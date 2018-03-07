class WebAudioEngine {
    private audioContext: AudioContext

    private inputNode: MediaStreamAudioSourceNode | null = null;
    private micStream: MediaStream | null = null;
    
    private analyserNode: AnalyserNode;
    private processingNode: ScriptProcessorNode;
    private gainNode: GainNode;
    private bufferSize: number;

    public onByteFrequencyData = (arr: Uint8Array) => {};

    constructor(bufferSize: number) {
        let AudioContext = (<any>window).AudioContext || (<any>window).webkitAudioContext;
        this.audioContext = new AudioContext();
        this.bufferSize = bufferSize;

        navigator.mediaDevices.getUserMedia({ audio: true })
        .then((mediaStream) => {
            this.micStream = mediaStream;
            this.inputNode = this.audioContext.createMediaStreamSource(this.micStream);
        }).catch((reason) => {
            console.error(reason)
        })

        // fft
        this.analyserNode = this.audioContext.createAnalyser();
        this.analyserNode.fftSize = this.bufferSize / 2;

        // processing
        this.processingNode = this.audioContext.createScriptProcessor(this.bufferSize, 1, 1);
        this.processingNode.onaudioprocess = this.audioProcessingCallback;

        // gain
        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + 1);
    }

    private audioProcessingCallback = (audioProcessingEvent: AudioProcessingEvent) => {
        const byteFrequencyData = new Uint8Array(this.bufferSize / 2);
        this.analyserNode.getByteTimeDomainData(byteFrequencyData);
        this.onByteFrequencyData(byteFrequencyData);
    }

    public async start(): Promise<void> {
        this.inputNode && this.inputNode.connect(this.analyserNode);
        this.analyserNode.connect(this.processingNode);
        this.processingNode.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
    }

    public stop(): void {
        this.inputNode && this.inputNode.disconnect();
        this.analyserNode.disconnect();
        this.processingNode.disconnect();
        this.gainNode.disconnect();
    }
}

function hasGetUserMedia() {
    return !!(navigator.mediaDevices.getUserMedia)
}


export default WebAudioEngine;