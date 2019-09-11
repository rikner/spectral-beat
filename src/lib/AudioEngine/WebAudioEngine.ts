const BUFFER_SOURCE_DEBUG = false;

class WebAudioEngine {
	public onFloatFrequencyData?: ((data: Float32Array, timeStamp: number) => void);
	public get frequencyBinCount(): number { return this.analyserNode.frequencyBinCount; }
	public get sampleRate(): number { return this.audioContext.sampleRate; }
	public get bufferSize(): number { return this.processingNode.bufferSize; }

	private audioContext: AudioContext;
	private inputNode?: AudioBufferSourceNode | MediaStreamAudioSourceNode;
	private analyserNode: AnalyserNode;
	private processingNode: ScriptProcessorNode;
	private gainNode: GainNode;

	constructor(targetBufferSize: number | undefined) {
		const options: AudioContextOptions = { latencyHint: "interactive" }
		const CrossBrowserAudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
		this.audioContext = new CrossBrowserAudioContext(options);
		this.analyserNode = this.audioContext.createAnalyser();
		this.processingNode = this.audioContext.createScriptProcessor(targetBufferSize);
		this.processingNode.onaudioprocess = this.audioProcessingCallback;
		this.gainNode = this.audioContext.createGain();
		const gainValue = BUFFER_SOURCE_DEBUG ? 1 : 0;
		this.gainNode.gain.setValueAtTime(gainValue, this.audioContext.currentTime);
	}

	public async start() {
		if (!this.inputNode) {
			const createSource = BUFFER_SOURCE_DEBUG ? createBufferSource : createStreamSource;
			this.inputNode = await createSource(this.audioContext);
		}
		this.connect();
		this.audioContext.resume();
	}

	public stop() {
		this.disconnect();
		this.removeInputNodeIfNecessary();
		this.audioContext.suspend();
	}

	private removeInputNodeIfNecessary() {
		// in order to be able to stop and restart correctly
		// we need to kill (and later recreate) the input node
		if (!!(window as any).webkitAudioContext) {
			this.inputNode = undefined;
		}
	}

	private connect() {
		if (this.inputNode) {
			this.inputNode.connect(this.gainNode);
			this.inputNode.connect(this.analyserNode);
			this.inputNode.connect(this.processingNode);
		}
		this.analyserNode.connect(this.gainNode); // chromes web audio has issues, when you don't connect the analyser output
		this.processingNode.connect(this.gainNode);
		this.gainNode.connect(this.audioContext.destination);
	}

	private disconnect() {
		if (this.inputNode) {
			this.inputNode.disconnect();
		}
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

async function createStreamSource(audioContext: AudioContext): Promise<MediaStreamAudioSourceNode> {
	const mediaStreamConstraints: any = { audio: { echoCancellation: false, noiseSuppression: false } };
	const mediaStream = await navigator.mediaDevices.getUserMedia(mediaStreamConstraints);
	const mediaStreamSource = audioContext.createMediaStreamSource(mediaStream);
	return mediaStreamSource;
}

// for debugging purposes
async function createBufferSource(audioContext: AudioContext): Promise<AudioBufferSourceNode> {
	audioContext.resume() // XXX: seems to fix issues
	const sourceFileURL = "example.mp3";
	const audioBuffer = await getAudioBufferFromURL(sourceFileURL, audioContext);
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


