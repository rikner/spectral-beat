class WebAudioEngine {
    private audioContext: AudioContext = new AudioContext();

    private inputNode: MediaStreamAudioSourceNode;
    private analyserNode: AnalyserNode;
    private processingNode: ScriptProcessorNode;
    private gainNode: GainNode;
    private micStream: MediaStream;
    private bufferSize: number;

    public onByteFrequencyData: (arr: Uint8Array) => void;

    constructor({ bufferSize: bufferSize }) {
        this.bufferSize = bufferSize;
    }

    private audioProcessingCallback = (audioProcessingEvent: AudioProcessingEvent) => {
        const byteFrequencyData = new Uint8Array(512);
        this.analyserNode.getByteTimeDomainData(byteFrequencyData);
        this.onByteFrequencyData(byteFrequencyData);
    }

    static async getMicrophoneMediaStream(): Promise<MediaStream> {
        return navigator.mediaDevices.getUserMedia({ audio: true });
    }

    private async createAudioGraph(): Promise<void> {
        const ctx = this.audioContext;

        this.micStream = await WebAudioEngine.getMicrophoneMediaStream();

        // mic input
        this.inputNode = ctx.createMediaStreamSource(this.micStream);

        // fft
        this.analyserNode = ctx.createAnalyser();
        this.analyserNode.fftSize = this.bufferSize / 2;

        // processing
        this.processingNode = ctx.createScriptProcessor(this.bufferSize, 1, 1);
        this.processingNode.onaudioprocess = this.audioProcessingCallback;

        // gain
        this.gainNode = ctx.createGain();
        this.gainNode.gain.value = 0;
    }

    public async start(): Promise<void> {
        if (this.micStream == null) {
            await this.createAudioGraph();
        }
        this.inputNode.connect(this.analyserNode);
        this.analyserNode.connect(this.processingNode);
        this.processingNode.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
    }

    public stop(): void {
        this.inputNode && this.inputNode.disconnect();
        this.analyserNode && this.analyserNode.disconnect();
        this.processingNode && this.processingNode.disconnect();
        this.gainNode && this.gainNode.disconnect();                                                   
    }
}

function hasGetUserMedia() {
    return !!(navigator.mediaDevices.getUserMedia)
}   


export default WebAudioEngine;