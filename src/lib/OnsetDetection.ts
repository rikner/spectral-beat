import WebAudioEngine from "./AudioEngine/WebAudioEngine";

interface IOnsetResultData {
	isPeak: boolean;
	threshold: number;
	value: number;
}

class OnsetDetection {
	private static desiredBufferSize: number | undefined = 512;
	private static onsetBufferDurationS = 2.5
	
	public onProcessCallbacks: Array<(data: IOnsetResultData) => void> = [];
	public onOnsetDetected: ((timeStamp: number) => void) | null = null;
	
	private audioEngine = new WebAudioEngine(OnsetDetection.desiredBufferSize);
	private previousSpectrum = new Float32Array(this.audioEngine.frequencyBinCount);
	private onsetValues: number[] = (() => {
		const { bufferSize, sampleRate } = this.audioEngine;
		const bufferDuration = bufferSize / sampleRate;
		const onsetValueCount = Math.round(OnsetDetection.onsetBufferDurationS / bufferDuration);
		return Array.from({ length: onsetValueCount }, _ => 0);
	})()
	
	private shouldCalculateThreshold = true;
	private threshold: number = 0;

	public startAudioProcessing() {
		this.audioEngine.onFloatFrequencyData = this.run;
		this.audioEngine.start();
	}

	public stopAudioProcessing() {
		this.audioEngine.stop();
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

		const linearSpectrum = spectrum.map(value => {
			const exponent = value / 20;
			return Math.pow(10, exponent)
		});

		const flux = computeSpectralFlux(
			this.previousSpectrum,
			linearSpectrum
		);
		this.previousSpectrum.set(linearSpectrum);
		this.onsetValues.shift();
		this.onsetValues.push(flux);

		if (this.shouldCalculateThreshold) {
			this.threshold = calculateThreshold(this.onsetValues.slice());
		}

		const currentIsPeak = checkForRecentPeak(
			this.onsetValues.slice(),
			this.threshold
		);
		if (currentIsPeak) {
			if (this.onOnsetDetected != null) {
				this.onOnsetDetected(timeStamp);
			}
		}

		this.onProcessCallbacks.forEach(onProcess => {
			onProcess({
				isPeak: currentIsPeak,
				threshold: this.threshold,
				value: this.onsetValues[this.onsetValues.length - 1]
			});
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

const calculateThreshold = (arr: number[]): number => {
	const meanValue = mean(arr);
	const medianValue = median(arr);
	return (meanValue + medianValue) * 0.75;
};

const checkForRecentPeak = (arr: number[], threshold: number) => {
	const isLocalMaximum =
		arr[arr.length - 3] < arr[arr.length - 2] &&
		arr[arr.length - 2] > arr[arr.length - 1];
	const isAboveThreshold = arr[arr.length - 2] > threshold;
	return isLocalMaximum && isAboveThreshold;
};

const mean = (numArray: number[]) => {
	const sum = numArray.reduce((a, b) => a + b, 0);
	return sum / numArray.length;
};

const median = (numArray: number[]) => {
	const sortedNumArray = numArray.slice().sort((a, b) => a - b);
	const half = Math.floor(sortedNumArray.length / 2);

	if (sortedNumArray.length & 1) {
		return sortedNumArray[half];
	}
	return (sortedNumArray[half - 1] + sortedNumArray[half]) / 2.0;
};

export default OnsetDetection;
