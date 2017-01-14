import detectOnsets from './Onset';

let audioContext = null;
let inputNode = null;
let analyserNode = null;
let onsetNode = null;
let gainNode = null;

let onsetDetected = null;

export function startAudioProcessing(onOnsetDetected) {
    if (onOnsetDetected) onsetDetected = onOnsetDetected;
    if (!hasGetUserMedia()) onMicrophoneFail('no getUserMedia available');
    navigator.mediaDevices.getUserMedia({ audio: true }).then((mediaStream) => {
        setupAudioGraph(mediaStream);
    }).catch((err) => {
        onMicrophoneFail(err);
    });
}

export function stopAudioProcessing() {
    inputNode && inputNode.disconnect();
    analyserNode && analyserNode.disconnect();
    onsetNode && onsetNode.disconnect();
    gainNode && gainNode.disconnect();

    onsetDetected = null;
}

function setupAudioGraph(mediaStream) {
    audioContext = audioContext !== null ? audioContext : new AudioContext();

    // input
    inputNode = audioContext.createMediaStreamSource(mediaStream);

    // fft
    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 256;

    // onset
    onsetNode = audioContext.createScriptProcessor(512, 1, 1);
    onsetNode.onaudioprocess = onsetAudioProcessingCallback;

    // gain
    gainNode = audioContext.createGain();
    gainNode.gain = 0;

    // connect
    inputNode.connect(analyserNode);
    analyserNode.connect(onsetNode);
    onsetNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
}

function onMicrophoneFail(reason) {
    console.error(reason);
}

function onsetAudioProcessingCallback(/*audioProcessingEvent*/) {
    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteTimeDomainData(dataArray);

    detectOnsets(dataArray, onsetDetected);
}

function hasGetUserMedia() {
    return !!(navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia ||
            navigator.mediaDevices.mozGetUserMedia || navigator.mediaDevices.msGetUserMedia);
}