const onsetValues = new Array(100);
for (var i = 0; i < onsetValues.length; i++) {
    onsetValues[i] = 0;
}

const previousSpectrum = new Uint8Array(256);

export default detectOnsets = (spectrum) => {
    const spectralFlux = computeSpectralFlux(spectrum);
    onsetValues.shift();
    onsetValues.push(spectralFlux);
    const currentThreshold = computeThreshold(onsetValues);
    const isPeak = checkForRecentPeak(onsetValues, currentThreshold);
    if (isPeak) console.log('onset detected');
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
    let threshold = 0;
    for (let i = 0; i < arr.length; i++) {
        threshold += arr[i];
    }
    threshold = threshold / arr.length;
    return threshold;
};

// const computeThreshold = (arr) => {
//     let sum = arr.reduce(add, 0);
//     return sum / arr.length;
// };

const add = (previousValue, currentValue) => {
    return (previousValue + currentValue);
};

const checkForRecentPeak = (arr, threshold) => {

    const isLocalMaximum = (arr[arr.length - 3] < arr[arr.length - 2]) && (arr[arr.length - 2] > arr[arr.length - 1]);
    const isAboveThreshold = (arr[arr.length - 2] > threshold);

    return isLocalMaximum && isAboveThreshold;
};
