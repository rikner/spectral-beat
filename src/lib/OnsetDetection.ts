import WebAudioEngine from "./AudioEngine/WebAudioEngine";

interface IOnsetResultData {
	isPeak: boolean;
	threshold: number;
	value: number;
}

class OnsetDetection {
	private static bufferSize: number = 512;
	
	public onProcessCallbacks: Array<(data: IOnsetResultData) => void> = [];
	public onOnsetDetected: (() => void) | null = null;
	
	private audioEngine = new WebAudioEngine(OnsetDetection.bufferSize);
	private previousSpectrum = new Float32Array(this.audioEngine.frequencyBinCount);
	private onsetValues: number[];
	private shouldCalculateThreshold: boolean = true;
	private threshold: number = 0;
	
	constructor() {
		this.onsetValues = new Array(100);
		for (let i = 0; i < this.onsetValues.length; i++) {
			this.onsetValues[i] = 0;
		}
	}
	
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
	
	private run = (spectrum: Float32Array) => {
		if (spectrum.length !== this.previousSpectrum.length) {
			console.error("previous and current spectrum don't have the same length");
			return;
		}
		
		const flux = computeSpectralFlux(
			this.previousSpectrum,
			spectrum.subarray(0)
		);
		this.previousSpectrum.set(spectrum);
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
				this.onOnsetDetected();
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
	return meanValue + medianValue;
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
