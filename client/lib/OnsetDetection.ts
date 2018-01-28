import WebAudioEngine from './AudioEngine/WebAudioEngine';

class OnsetDetection {
    public static settings = {
        inputBinCount: 512
    }

    private audioEngine: WebAudioEngine = new WebAudioEngine(
        OnsetDetection.settings.inputBinCount * 2 // bufferSize
    );

    private currentValue = 0;
    private currentThreshold = 0;
    private currentIsPeak = false;

    private previousSpectrum = new Uint8Array(OnsetDetection.settings.inputBinCount);
    private onsetValues = new Array(50);

    public onProcessCallbacks: Array< (object)=>void > = [];
    public onOnsetDetected: () => void;

    private run(spectrum: Uint8Array) {
        this.currentValue = computeSpectralFlux(this.previousSpectrum, spectrum);
        this.onsetValues.shift();
        this.onsetValues.push(this.currentValue);
        this.currentThreshold = computeThreshold(this.onsetValues);

        const currentIsPeak = checkForRecentPeak(this.onsetValues, this.currentThreshold);
        if (currentIsPeak) {
            console.log("onset detected")
            this.onOnsetDetected();
        }   
        if (this.onProcessCallbacks.length) {
            this.onProcessCallbacks.forEach((onProcess) => {
                onProcess({
                    value: this.onsetValues[this.onsetValues.length - 1],
                    isPeak: currentIsPeak,
                    threshold: this.currentThreshold,
                });
            });
        }
    }

    public startAudioProcessing() {
        this.audioEngine.onByteFrequencyData = this.run;
        this.audioEngine.start();
    }

    public stopAudioProcessing(): void {
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
    previousSpectrum.set(spectrum.subarray(0));
    return flux;
};

const defautOnOnsetDetected = () => {
    console.log('onset detected');
};

const computeThreshold = (arr) => {
    const meanValue = mean(arr);
    const medianValue = median(arr);
    return Math.max(meanValue + (2 * medianValue));
};

const checkForRecentPeak = (arr, threshold) => {
    const isLocalMaximum = (arr[arr.length - 3] < arr[arr.length - 2]) && (arr[arr.length - 2] > arr[arr.length - 1]);
    const isAboveThreshold = (arr[arr.length - 2] > threshold);
    return isLocalMaximum && isAboveThreshold;
};

const mean = (numArray) => {
    const sum = numArray.reduce((a, b) => a + b, 0);
    return sum / numArray.length;
};

const median = (numArray) => {
    // always remember to hard copy the array when flashSorting
    // console.warn("remember to check result of sortedNumArray");
    const sortedNumArray = numArray.slice().sort((a, b) => a - b);
    const half = Math.floor(sortedNumArray.length / 2);

    if (sortedNumArray.length & 1) { return sortedNumArray[half]; }
    return (sortedNumArray[half - 1] + sortedNumArray[half]) / 2.0;
};


export default OnsetDetection;