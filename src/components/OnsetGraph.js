import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const w = 512;
const h = 600;
const onsetScale = 100;

const onsetValues = new Array(w);
const thresholdValues = new Array(w);
const peakValues = new Array(w);


function updateCanvas(onsetData) {
    onsetValues.shift();
    onsetValues.push(onsetData.value);

    thresholdValues.shift();
    thresholdValues.push(onsetData.threshold);

    peakValues.shift();
    peakValues.push(onsetData.isPeak);
}

(function () {
    for (let i = 0; i < w; i++) {
        onsetValues[i] = 0;
        thresholdValues[i] = 0;
        peakValues[i] = false;
    }
}());

const propTypes = {
    onsetData: PropTypes.shape({
        value: PropTypes.number.isRequired,
        threshold: PropTypes.number.isRequired,
        isPeak: PropTypes.bool.isRequired,
    }).isRequired,
};

const mapStateToProps = state => ({
    onsetData: state.onsetDetection.onsetData,
});

class OnsetGraph extends Component {

    constructor() {
        super();
        this.loop = this.loop.bind(this);
        this.drawCanvas = this.drawCanvas.bind(this);
    }

    componentDidMount() {
        this.startLoop();

    }

    componentWillUnmount() {
        this.stopLoop();
    }

    componentWillUpdate(nextProps) {
        updateCanvas(nextProps.onsetData);
    }

    startLoop() {
        if (!this.frameId) {
            this.frameId = window.requestAnimationFrame(this.loop);
        }
    }

    loop() {
        this.drawCanvas()
        this.frameId = window.requestAnimationFrame(this.loop)
    }

    stopLoop() {
        window.cancelAnimationFrame(this.frameId);
    }


    drawCanvas() {
        const onsetCanvasCtx = this.canvas.getContext('2d');
        onsetCanvasCtx.fillStyle = 'black';
        onsetCanvasCtx.fillRect(0, 0, w, h);

        onsetCanvasCtx.fillStyle = 'pink';
        for (let i = 0; i < peakValues.length; i++) {
            if (peakValues[i] === true) {
                onsetCanvasCtx.fillRect(i, h, 1, -onsetValues[i] * onsetScale);
            }
        }

        onsetCanvasCtx.fillStyle = 'blue';
        for (let i = 0; i < thresholdValues.length; i++) {
            onsetCanvasCtx.fillRect(i, h, 1, -thresholdValues[i] * onsetScale);
        }

        onsetCanvasCtx.fillStyle = 'white';
        for (let i = 0; i < onsetValues.length; i++) {
            onsetCanvasCtx.fillRect(i, h, 1, -onsetValues[i] * onsetScale);
        }
    }

    render() {
        return (
            <canvas ref={(canvas) => { this.canvas = canvas; }} width={w} height={h} />
        );
    }
}

OnsetGraph.propTypes = propTypes;

export default connect(mapStateToProps)(OnsetGraph);