class WebAudioEngine {
	public onFloatFrequencyData: ((data: Float32Array) => void) | null = null;
	
	private audioContext: AudioContext;
	
	private inputNode: MediaStreamAudioSourceNode | null = null;
	private micStream: MediaStream | null = null;
	
	private filterNode: BiquadFilterNode;
	private analyserNode: AnalyserNode;
	private processingNode: ScriptProcessorNode;
	private gainNode: GainNode;
	private bufferSize: number;

	constructor(bufferSize: number) {
		const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
		this.audioContext = new AudioContext();
		this.bufferSize = bufferSize;
		
		crossBrowserGetUserUserMedia({
			onError: console.error,
			onSuccess: (mediaStream: MediaStream) => {
				console.log("mediastream sunccess")
				this.micStream = mediaStream;
				this.inputNode = this.audioContext.createMediaStreamSource(this.micStream);
			},
			options: { audio: true },
		});
		
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
	
	public get frequencyBinCount() : number {
		return this.analyserNode.frequencyBinCount;
	}	
	
	public start(): void {
		if (!this.inputNode) {
			return;
		}
		this.inputNode.connect(this.analyserNode);
		this.analyserNode.connect(this.processingNode);
		this.processingNode.connect(this.gainNode);
		this.gainNode.connect(this.audioContext.destination);
	}
	
	public stop(): void {
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
		console.log(dataArray);

		if (this.onFloatFrequencyData) {
			this.onFloatFrequencyData(dataArray);
		}
	};
}

export default WebAudioEngine;


function crossBrowserGetUserUserMedia({ onSuccess, onError, options }: {
	onSuccess: NavigatorUserMediaSuccessCallback, 
	onError: NavigatorUserMediaErrorCallback,
	options: MediaStreamConstraints
}) : void {
	if (typeof navigator.mediaDevices.getUserMedia === "function") {
		console.log("using mediaDevices.getUsermedia")
		navigator.mediaDevices.getUserMedia(options)
		.then(onSuccess)
		.catch(onError)
	} else {
		navigator.getUserMedia(options, onSuccess, onError)
	}
}
