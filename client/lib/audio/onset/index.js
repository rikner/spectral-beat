export const settings = {
    inputBinCount: 256,
};

const previousSpectrum = new Uint8Array(settings.inputBinCount);
const onsetValues = new Array(100);

(function () {
    for (let i = 0; i < onsetValues.length; i++) {
        onsetValues[i] = 0;
    }
}());

export default detectOnsets = (spectrum, onOnsetDetected = defautOnOnsetDetected) => {
    const spectralFlux = computeSpectralFlux(spectrum);
    onsetValues.shift();
    onsetValues.push(spectralFlux);
    const currentThreshold = computeThreshold(onsetValues);
    const isPeak = checkForRecentPeak(onsetValues, currentThreshold);
    if (isPeak) onOnsetDetected();
};

const defautOnOnsetDetected = () => {
    console.log('onset detected');
};

const computeSpectralFlux = (spectrum) => {
    let flux = 0;
    for (let i = 0; i < spectrum.length; i++) {
        let diff = spectrum[i] - previousSpectrum[i];
        if (diff < 0) continue;
        diff *= diff;
        flux += diff;
    }
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
    console.warn("remember to check result of sortedNumArray");
    const sortedNumArray = numArray.slice().sort((a, b) => a - b);
    const half = Math.floor(sortedNumArray.length / 2);

    if (sortedNumArray.length & 1) { return sortedNumArray[half]; }
    return (sortedNumArray[half - 1] + sortedNumArray[half]) / 2.0;
};
