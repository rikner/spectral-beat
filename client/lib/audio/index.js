import detectOnsets from './onset';

let audioContext = null;
let inputNode = null;
let analyserNode = null;
let onsetNode = null;
let gainNode = null;

export function startAudioProcessing() {
    if (!hasGetUserMedia()) onMicrophoneFail('no getUserMedia available');

    // navigator.mediaDevices.getUserMedia({ audio: true })
    // .then(startAudioProcessing, onMicrophoneFail);

    navigator.mediaDevices.getUserMedia({ audio: true }).then(function(mediaStream) {
        setupAudioGraph(mediaStream);
    }).catch(function(err) {
        onMicrophoneFail(err);
    });
}

export function stopAudioProcessing() {
    inputNode && inputNode.disconnect();
    analyserNode && analyserNode.disconnect();
    onsetNode && onsetNode.disconnect();
    gainNode && gainNode.disconnect();
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

function onsetAudioProcessingCallback(audioProcessingEvent) {
    let inputBuffer = audioProcessingEvent.inputBuffer;
    let outputBuffer = audioProcessingEvent.outputBuffer;

    let dataArray = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteTimeDomainData(dataArray);

    detectOnsets(dataArray);
}

function hasGetUserMedia() {
    const getUserMediaExists = !!(navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia ||
            navigator.mediaDevices.mozGetUserMedia || navigator.mediaDevices.msGetUserMedia);

    return getUserMediaExists;
}