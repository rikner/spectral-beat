export const settings = {
    inputBinCount: 512,
};

export const onProcessCallbacks = [];

const previousSpectrum = new Uint8Array(settings.inputBinCount);
const onsetValues = new Array(50);

let currentThreshold = 0;
let currentValue = 0;
let currentIsPeak = false;

let calculateThreshold = true;

(function () {
    for (let i = 0; i < onsetValues.length; i++) {
        onsetValues[i] = 0;
    }
}());

export default detectOnsets = (spectrum, onOnsetDetected = defautOnOnsetDetected) => {
    currentValue = computeSpectralFlux(spectrum);
    onsetValues.shift();
    onsetValues.push(currentValue);
    if (calculateThreshold) currentThreshold = computeThreshold(onsetValues);
    currentIsPeak = checkForRecentPeak(onsetValues, currentThreshold);
    if (currentIsPeak) onOnsetDetected();
    onAudioProcessed();
};

export function setThreshold(threshold) {
    currentThreshold = threshold;
}

export function setCalculateThreshold(value) {
    calculateThreshold = value;
}

const onAudioProcessed = () => {
    if (onProcessCallbacks.length) {
        onProcessCallbacks.forEach((onProcess) => {
            onProcess({
                value: onsetValues[onsetValues.length - 1],
                threshold: currentThreshold,
                isPeak: currentIsPeak,
            });
        });
    }
};

const defautOnOnsetDetected = () => {
    console.log('onset detected');
};

const computeSpectralFlux = (spectrum) => {
   let flux = spectrum.reduce((prev, cur, i) => {
        let diff = previousSpectrum[i] - cur;
        if (diff<0) return prev;
        diff *= diff;
        return prev + diff;
    }, 0);

    // let flux = 0;
    // for (let i = 0; i < spectrum.length; i++) {
    //     let diff = spectrum[i] - previousSpectrum[i];
    //     if (diff < 0) continue;
    //     diff *= diff;
    //     flux += diff;
    // }

    flux = Math.sqrt(flux);
    flux /= (spectrum.length);
    previousSpectrum.set(spectrum.subarray(0));
    return flux;
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
