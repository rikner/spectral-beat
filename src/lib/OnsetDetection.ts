interface IOnsetResultData {
	isPeak: boolean;
	threshold: number;
	value: number;
}

function createWeightingFunction(length: number, sampleRate: number): Float32Array {
	const arr = new Float32Array(length);
	for (let index = 0; index < arr.length; index++) {
		arr[index] = 1 - index / length;
	}
	return arr;
}

class OnsetDetection {
	private static readonly onsetBufferDurationS = 2.5;
	private static readonly smoothingWindowLength = 2;

	public onOnsetResultData?: ((data: IOnsetResultData) => void);
	public onOnsetDetected?: ((timeStamp: number) => void);

	private previousSpectrum: Float32Array;
	private onsetValues: Float32Array;

	private shouldCalculateThreshold = true;
	private threshold: number = 0;

	private readonly weightingFunction: Float32Array;

	constructor(sampleRate: number, bufferSize: number, frequencyBinCount: number) {
		this.onsetValues = (() => {
			const bufferDuration = bufferSize / sampleRate;
			const onsetValueCount = Math.round(OnsetDetection.onsetBufferDurationS / bufferDuration);
			return new Float32Array(onsetValueCount);
		})()
		this.previousSpectrum = new Float32Array(frequencyBinCount);
		this.weightingFunction = createWeightingFunction(frequencyBinCount, sampleRate);
	}


	public setThreshold(value?: number) {
		if (!value) {
			this.shouldCalculateThreshold = true;
		} else {
			this.threshold = value;
			this.shouldCalculateThreshold = false;
		}
	}

	private run = (spectrum: Float32Array, timeStamp: number) => {
		if (spectrum.length !== this.previousSpectrum.length) {
			console.error(`previous ${this.previousSpectrum.length} and current ${spectrum.length} spectrum don't have the same length`);
			return;
		}

		const linearWeightedSpectrum = spectrum.map((value, index) => decibelToLinear(value) * this.weightingFunction[index]);

		const flux = computeSpectralFlux(
			this.previousSpectrum,
			linearWeightedSpectrum
		);

		const smoothedFlux = (() => {
			const smoothingValues = this.onsetValues.subarray(
				this.onsetValues.length - OnsetDetection.smoothingWindowLength,
				this.onsetValues.length
			);
			const smoothingValuesSum = smoothingValues.reduce((agg, cur) => agg + cur, 0);
			return (smoothingValuesSum + flux) / (smoothingValues.length + 1);
		})();

		this.previousSpectrum.set(linearWeightedSpectrum);
		this.onsetValues.set(this.onsetValues.subarray(1)); // shift
		this.onsetValues[this.onsetValues.length - 1] = smoothedFlux; // push

		if (this.shouldCalculateThreshold) {
			this.threshold = mean(this.onsetValues);
		}

		const currentIsPeak = checkForRecentPeak(this.onsetValues, this.threshold);
		if (currentIsPeak) {
			if (this.onOnsetDetected != null) {
				this.onOnsetDetected(timeStamp);
			}
		}

		if (!this.onOnsetResultData) { return };
		this.onOnsetResultData({
			isPeak: currentIsPeak,
			threshold: this.threshold,
			value: this.onsetValues[this.onsetValues.length - 1]
		});
	};
}

const computeSpectralFlux = (previousSpectrum: Float32Array, spectrum: Float32Array): number => {
	const flux = spectrum.reduce((prev, cur, i) => {
		let diff = previousSpectrum[i] - cur;
		if (diff < 0) {
			return prev;
		}
		diff *= diff;
		return prev + diff;
	}, 0);

	return Math.sqrt(flux) / spectrum.length;
};

function decibelToLinear(value: number): number {
	return Math.pow(10, value / 20)
}

const checkForRecentPeak = (arr: Float32Array, threshold: number) => {
	const isLocalMaximum =
		arr[arr.length - 3] < arr[arr.length - 2] &&
		arr[arr.length - 2] > arr[arr.length - 1];
	const isAboveThreshold = arr[arr.length - 2] > threshold;
	return isLocalMaximum && isAboveThreshold;
};

const mean = (numArray: Float32Array) => {
	const sum = numArray.reduce((a, b) => a + b, 0);
	return sum / numArray.length;
};

const median = (numArray: Float32Array) => {
	const sortedNumArray = numArray.sort((a, b) => a - b);
	const half = Math.floor(sortedNumArray.length / 2);

	if (sortedNumArray.length & 1) {
		return sortedNumArray[half];
	}
	return (sortedNumArray[half - 1] + sortedNumArray[half]) / 2.0;
};

export default OnsetDetection;
