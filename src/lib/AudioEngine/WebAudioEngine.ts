class WebAudioEngine {
	public get frequencyBinCount(): number {
		return this.analyserNode.frequencyBinCount;
	}

	public get sampleRate(): number {
		return this.audioContext.sampleRate;
	}

	public get bufferSize(): number {
		return this.processingNode.bufferSize;
	}

	public onFloatFrequencyData: ((data: Float32Array, timeStamp: number) => void) | null = null;

	private audioContext: AudioContext;
	private inputNode: AudioBufferSourceNode | MediaStreamAudioSourceNode | null;
	private analyserNode: AnalyserNode;
	private processingNode: ScriptProcessorNode;
	private gainNode: GainNode;

	constructor(targetBufferSize: number | undefined) {
		const options: AudioContextOptions = {
			latencyHint: "interactive"
		}
		const CrossBrowserAudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
		this.audioContext = new CrossBrowserAudioContext(options);

		createStreamSource(this.audioContext)
		.then(sourceNode => this.inputNode = sourceNode)

		this.analyserNode = this.audioContext.createAnalyser();
		
		this.processingNode = this.audioContext.createScriptProcessor(targetBufferSize);
		this.processingNode.onaudioprocess = this.audioProcessingCallback;
		
		this.gainNode = this.audioContext.createGain();
	}

	public start() {
		// only play back through speakers when buffer source (prevent mic feedback)
		const gainValue = isAudioBufferSource(this.inputNode) ? 1 : 0;
		this.gainNode.gain.setValueAtTime(gainValue, this.audioContext.currentTime);

		this.audioContext.resume();
		this.connect();
	}

	public stop() {
		this.disconnect();
		this.audioContext.suspend();
	}

	private connect() {
		if (this.inputNode) { 
			this.inputNode.connect(this.gainNode);
			this.inputNode.connect(this.analyserNode);
			this.inputNode.connect(this.processingNode);
		}
		this.processingNode.connect(this.gainNode);
		this.gainNode.connect(this.audioContext.destination);
	}

	private disconnect() {
		if (this.inputNode) { this.inputNode.disconnect(); }
		this.analyserNode.disconnect();
		this.processingNode.disconnect();
		this.gainNode.disconnect();
	}

	private audioProcessingCallback = (audioProcessingEvent: AudioProcessingEvent) => {
		const dataArray = new Float32Array(this.analyserNode.frequencyBinCount);
		void this.analyserNode.getFloatFrequencyData(dataArray);

		if (this.onFloatFrequencyData) {
			this.onFloatFrequencyData(dataArray, audioProcessingEvent.timeStamp);
		}
	};
}

export default WebAudioEngine;

function isAudioBufferSource(node: MediaStreamAudioSourceNode | AudioBufferSourceNode | null): node is AudioBufferSourceNode {
	return (node as AudioBufferSourceNode).buffer !== undefined;
}

async function createStreamSource(audioContext: AudioContext): Promise<MediaStreamAudioSourceNode> {
	const mediaStreamConstraints: any = { audio: { echoCancellation: false, noiseSuppression: false }}
	const mediaStream = await navigator.mediaDevices.getUserMedia(mediaStreamConstraints);
	const mediaStreamSource = audioContext.createMediaStreamSource(mediaStream);
	return mediaStreamSource;
}

async function createBufferSource(audioContext: AudioContext): Promise<AudioBufferSourceNode> {
	const sourceFileURL = "example.mp3";
	const audioBuffer = await getAudioBufferFromURL(sourceFileURL, audioContext)
	const bufferSourceNode = audioContext.createBufferSource();
	bufferSourceNode.buffer = audioBuffer;
	bufferSourceNode.start(); // just start it right away, enough for testing purposes
	return bufferSourceNode;
}

async function getAudioBufferFromURL(url: string, audioContext: AudioContext): Promise<AudioBuffer> {
	const response = await fetch(url);
	const arrayBuffer = await response.arrayBuffer();

	// decodeAudiData() is browser-specific (promise vs. callback)
	if (!!(window as any).webkitAudioContext) {
		return new Promise<AudioBuffer>((resolve, reject) => {
			audioContext.decodeAudioData(arrayBuffer, resolve, reject);

		});
	} else {
		return audioContext.decodeAudioData(arrayBuffer);
	}
}


