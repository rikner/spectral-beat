import WebAudioEngine from './AudioEngine/WebAudioEngine';

type OnsetResultData = {
    value: number,
    isPeak: boolean,
    threshold: number
}

class OnsetDetection {

    static inputBinCount: number = 512

    private audioEngine = new WebAudioEngine(OnsetDetection.inputBinCount * 2);
    
    private previousSpectrum = new Uint8Array(OnsetDetection.inputBinCount);
    private onsetValues: Array<number>;
    private shouldCalculateThreshold: boolean = true;
    private threshold: number = 0;

    public onProcessCallbacks: Array<(data: OnsetResultData) => void> = [];
    public onOnsetDetected: () => void = () => { }

    constructor() {
        this.onsetValues = new Array(100);
        for (let i = 0; i < this.onsetValues.length; i++) {
            this.onsetValues[i] = 0;
        }
    }

    
    public setThreshold(value : number | null) {
        if (value != null) {
            this.threshold = value;
            this.shouldCalculateThreshold = false;
        } else {
            this.shouldCalculateThreshold = true;
        }
    }
    

    private run = (spectrum: Uint8Array) => {
        if (spectrum.length !== this.previousSpectrum.length) {
            console.error("previous and current spectrum don't have the same length");
            return
        }

        const flux = computeSpectralFlux(this.previousSpectrum, spectrum.subarray(0));
        this.previousSpectrum.set(spectrum);
        this.onsetValues.shift();
        this.onsetValues.push(flux);

        if (this.shouldCalculateThreshold) 
            this.threshold = calculateThreshold(this.onsetValues.slice());

        const currentIsPeak = checkForRecentPeak(this.onsetValues.slice(), this.threshold);
        if (currentIsPeak) {
            this.onOnsetDetected();
        }

        this.onProcessCallbacks.forEach((onProcess) => {
            onProcess({
                value: this.onsetValues[this.onsetValues.length - 1],
                isPeak: currentIsPeak,
                threshold: this.threshold,
            });
        });
    }

    public startAudioProcessing() {
        this.audioEngine.onByteFrequencyData = this.run;
        this.audioEngine.start();
    }

    public stopAudioProcessing() {
        this.audioEngine.stop();
    }
}

const computeSpectralFlux = (previousSpectrum: Uint8Array, spectrum: Uint8Array): number => {
    let flux = spectrum.reduce((prev, cur, i) => {
        let diff = previousSpectrum[i] - cur;
        if (diff < 0) return prev;
        diff *= diff;
        return prev + diff;
    }, 0);

    flux = Math.sqrt(flux);
    flux /= (spectrum.length);
    return flux;
};

const calculateThreshold = (arr: Array<number>): number => {
    const meanValue = mean(arr);
    const medianValue = median(arr);
    return meanValue + medianValue;
};

const checkForRecentPeak = (arr: Array<number>, threshold: number) => {
    const isLocalMaximum = (arr[arr.length - 3] < arr[arr.length - 2]) && (arr[arr.length - 2] > arr[arr.length - 1]);
    const isAboveThreshold = (arr[arr.length - 2] > threshold);
    return isLocalMaximum && isAboveThreshold;
};

const mean = (numArray: Array<number>) => {
    const sum = numArray.reduce((a, b) => a + b, 0);
    return sum / numArray.length;
};

const median = (numArray: Array<number>) => {
    const sortedNumArray = numArray.slice().sort((a, b) => a - b);
    const half = Math.floor(sortedNumArray.length / 2);

    if (sortedNumArray.length & 1) { return sortedNumArray[half]; }
    return (sortedNumArray[half - 1] + sortedNumArray[half]) / 2.0;
};


export default OnsetDetection;