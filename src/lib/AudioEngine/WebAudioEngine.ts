class WebAudioEngine {
	public onFloatFrequencyData: ((data: Float32Array) => void) | null = null;

	private audioContext: AudioContext;

	private inputNode: MediaStreamAudioSourceNode | null = null;
	private filterNode: BiquadFilterNode;
	private analyserNode: AnalyserNode;
	private processingNode: ScriptProcessorNode;
	private gainNode: GainNode;
	private bufferSize: number;

	constructor(bufferSize: number) {
		const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
		this.audioContext = new AudioContext();
		this.bufferSize = bufferSize;

		// filter
		this.filterNode = this.audioContext.createBiquadFilter();
		this.filterNode.type = "lowpass";
		this.filterNode.frequency.setValueAtTime(1000, 0);

		// fft
		this.analyserNode = this.audioContext.createAnalyser();

		// processing
		this.processingNode = this.audioContext.createScriptProcessor(this.bufferSize, 1, 1);
		this.processingNode.onaudioprocess = this.audioProcessingCallback;

		// gain
		this.gainNode = this.audioContext.createGain();
		this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + 1);
	}

	public get frequencyBinCount(): number {
		return this.analyserNode.frequencyBinCount;
	}

	public start(): void {
		if (this.inputNode) {
			this.connect();
		} else {
			navigator.mediaDevices.getUserMedia({ audio: true })
			.then((mediaStream: MediaStream) => {
				this.inputNode = this.audioContext.createMediaStreamSource(mediaStream);
				this.connect();
			})
			.catch(console.error);
		}
	}

	public stop(): void {
		this.disconnect();
	}

	private connect(): void {
		if (this.inputNode) {
			this.inputNode.connect(this.analyserNode);
		}
		this.analyserNode.connect(this.processingNode);
		this.processingNode.connect(this.gainNode);
		this.gainNode.connect(this.audioContext.destination);
	}

	private disconnect(): void {
		if (this.inputNode) {
			this.inputNode.disconnect();
		}
		this.filterNode.disconnect();
		this.analyserNode.disconnect();
		this.processingNode.disconnect();
		this.gainNode.disconnect();
	}

	private audioProcessingCallback = (audioProcessingEvent: AudioProcessingEvent) => {
		const dataArray = new Float32Array(this.analyserNode.frequencyBinCount);
		void this.analyserNode.getFloatTimeDomainData(dataArray);
		// console.log(dataArray);

		if (this.onFloatFrequencyData) {
			this.onFloatFrequencyData(dataArray);
		}
	};
}

export default WebAudioEngine;