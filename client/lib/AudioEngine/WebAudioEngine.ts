class WebAudioEngine {
    private audioContext: AudioContext = new AudioContext();

    private inputNode: MediaStreamAudioSourceNode;
    private analyserNode: AnalyserNode;
    private processingNode: ScriptProcessorNode;
    private gainNode: GainNode;
    private micStream: MediaStream;

    private byteFrequencyData: Uint8Array;
    public onByteFrequencyData: (arr: Uint8Array) => void;

    constructor({ bufferSize: bufferSize }) {
        this.byteFrequencyData = new Uint8Array(bufferSize / 2);
    }

    private audioProcessingCallback = (audioProcessingEvent: AudioProcessingEvent) => {
        if (!this.onByteFrequencyData) return;
        this.analyserNode.getByteFrequencyData(this.byteFrequencyData);
        this.onByteFrequencyData(this.byteFrequencyData);
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
        this.analyserNode.fftSize = this.byteFrequencyData.length;

        // processing
        const bufferSize = this.byteFrequencyData.length * 2
        this.processingNode = ctx.createScriptProcessor(bufferSize, 1, 1);
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