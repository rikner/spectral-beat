interface IOnsetResultData {
	isPeak: boolean;
	threshold: number;
	value: number;
}

class OnsetDetection {
	private static onsetBufferDurationS = 2.5;

	public onOnsetResultData: ((data: IOnsetResultData) => void) | null = null;
	public onOnsetDetected: ((timeStamp: number) => void) | null = null;

	private previousSpectrum: Float32Array;
	private onsetValues: Float32Array;

	private shouldCalculateThreshold = true;
	private threshold: number = 0;
	private readonly sampleRate: number;
	private readonly bufferSize: number;

	constructor(sampleRate: number, bufferSize: number) {
		this.sampleRate = sampleRate;
		this.bufferSize = bufferSize;
		this.onsetValues = (() => {
			const bufferDuration = bufferSize / sampleRate;
			const onsetValueCount = Math.round(OnsetDetection.onsetBufferDurationS / bufferDuration);
			return new Float32Array(onsetValueCount);
		})()
		this.previousSpectrum = new Float32Array(bufferSize * 2);
	}


	public setThreshold(value: number | null) {
		if (value != null) {
			this.threshold = value;
			this.shouldCalculateThreshold = false;
		} else {
			this.shouldCalculateThreshold = true;
		}
	}

	private run = (spectrum: Float32Array, timeStamp: number) => {
		if (spectrum.length !== this.previousSpectrum.length) {
			console.error("previous and current spectrum don't have the same length");
			return;
		}

		const linearSpectrum = spectrum.map(decibelToLinear);

		const flux = computeSpectralFlux(
			this.previousSpectrum,
			linearSpectrum
		);
		this.previousSpectrum.set(linearSpectrum);
		this.onsetValues.set(this.onsetValues.subarray(1)); // shift
		this.onsetValues[this.onsetValues.length - 1] = flux; // push

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
