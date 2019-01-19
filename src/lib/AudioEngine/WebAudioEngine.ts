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

	// https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
	private static mediaStreamConstraints: any = {
		audio: {
			echoCancellation: false,
			noiseSuppression: false
		}
	}

	public onFloatFrequencyData: ((data: Float32Array, timeStamp: number) => void) | null = null;

	private audioContext: AudioContext;
	// private inputNode: MediaStreamAudioSourceNode | null = null;
	private inputNode: AudioBufferSourceNode;
	private analyserNode: AnalyserNode;
	private processingNode: ScriptProcessorNode;
	private gainNode: GainNode;

	constructor(targetBufferSize: number | undefined) {
		const options: AudioContextOptions = {
			latencyHint: "interactive"
		}
		const CrossBrowserAudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
		this.audioContext = new CrossBrowserAudioContext(options);

		// input
		const url = "Scratch That.mp3";
		this.inputNode = this.audioContext.createBufferSource();
		createAudioBufferFromURL(url, this.audioContext)
		.then(audioBuffer => this.inputNode.buffer = audioBuffer)
		.catch(console.error);

		// fft
		this.analyserNode = this.audioContext.createAnalyser();

		// processing
		this.processingNode = this.audioContext.createScriptProcessor(targetBufferSize);
		this.processingNode.onaudioprocess = this.audioProcessingCallback;

		// gain
		this.gainNode = this.audioContext.createGain();
		this.gainNode.gain.setValueAtTime(1, this.audioContext.currentTime + 1);
	}

	public start() {
		if (this.inputNode) {
			this.connect();
			this.inputNode.start();
		} else {
			const constraints = WebAudioEngine.mediaStreamConstraints
			navigator.mediaDevices.getUserMedia(constraints)
			.then((mediaStream: MediaStream) => {
				// this.inputNode = this.audioContext.createMediaStreamSource(mediaStream);
				this.connect();
			})
			.catch(console.error);
		}
		this.audioContext.resume();
	}

	public stop() {
		this.disconnect();
		this.inputNode.stop();
		// this.inputNode = null; // safari workaround
		this.audioContext.suspend();
	}

	private connect() {
		if (this.inputNode) {
			this.inputNode.connect(this.analyserNode);
		}
		this.analyserNode.connect(this.processingNode);
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

		const inputBuffer = audioProcessingEvent.inputBuffer;
		const outputBuffer = audioProcessingEvent.outputBuffer;

		// Loop through the output channels (in this case there is only one)
		for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
			const inputData = inputBuffer.getChannelData(channel);
			const outputData = outputBuffer.getChannelData(channel);
			outputData.set(inputData);
		}
	};
}

export default WebAudioEngine;


async function createAudioBufferFromURL(url: string, audioContext: AudioContext): Promise<AudioBuffer> {
	const response = await fetch(url);
	const arrayBuffer = await response.arrayBuffer();

	// decodeAudiData() is browser-specific (promise vs. callback)
	// if (!!(window as any).webkitAudioContext) {
	// 	return new Promise((resolve, reject) => {
	// 		audioContext.decodeAudioData(arrayBuffer, resolve, reject);

	// 	});
	// } else {
		return audioContext.decodeAudioData(arrayBuffer);
	// }
}