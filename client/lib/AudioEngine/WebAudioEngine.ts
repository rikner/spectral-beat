class WebAudioEngine {
    private audioContext: AudioContext

    private inputNode: MediaStreamAudioSourceNode | null = null;
    private micStream: MediaStream | null = null;
    
    private filterNode: BiquadFilterNode;
    private analyserNode: AnalyserNode;
    private processingNode: ScriptProcessorNode;
    private gainNode: GainNode;
    private bufferSize: number;

    public onFloatTimeDomainData = (arr: Float32Array) => {};

    constructor({ bufferSize }: { bufferSize: number }) { 
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

        // filter
        this.filterNode = this.audioContext.createBiquadFilter()
        this.filterNode.type = "lowpass"
        this.filterNode.frequency.setValueAtTime(1000, 0);

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
        const floatTimeDomainData = new Float32Array(this.bufferSize); 
        this.analyserNode.getFloatTimeDomainData(floatTimeDomainData); 
        this.onFloatTimeDomainData(floatTimeDomainData); 
    }

    public start(): void {
        if (this.inputNode == null) return;
        this.inputNode
        .connect(this.filterNode)
        .connect(this.analyserNode)
        .connect(this.processingNode)
        .connect(this.gainNode)
        .connect(this.audioContext.destination);
    }

    public stop(): void {
        this.inputNode && this.inputNode.disconnect();
        this.filterNode.disconnect();
        this.analyserNode.disconnect();
        this.processingNode.disconnect();
        this.gainNode.disconnect();
    }
}

function hasGetUserMedia() {
    return !!(navigator.mediaDevices.getUserMedia)
}


export default WebAudioEngine;