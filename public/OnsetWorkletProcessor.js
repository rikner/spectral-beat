class OnsetWorkletProcessor extends AudioWorkletProcessor { 
    constructor() { 
        super(); 
    } 

    process(inputs, outputs, parameters) {
        // eslint-disable-next-line
        // console.warn("process");

        return true;
    }
} 

registerProcessor('onset-worklet-processor', OnsetWorkletProcessor);