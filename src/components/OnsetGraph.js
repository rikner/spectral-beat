import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const canvasWidth = 512;
const canvasHeight = 400;
const onsetScale = 100;

const onsetValues = new Array(canvasWidth);
const thresholdValues = new Array(canvasWidth);
const peakValues = new Array(canvasWidth);


function updateCanvas(onsetData) {
    onsetValues.shift();
    onsetValues.push(onsetData.value);

    thresholdValues.shift();
    thresholdValues.push(onsetData.threshold);

    peakValues.shift();
    peakValues.push(onsetData.isPeak);
}

(function () {
    for (let i = 0; i < canvasWidth; i++) {
        onsetValues[i] = 0;
        thresholdValues[i] = 0;
        peakValues[i] = false;
    }
}());

const propTypes = {
    onsetData: PropTypes.shape({
        isPeak: PropTypes.bool.isRequired,
        threshold: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    }).isRequired,
};

const mapStateToProps = state => ({
    onsetData: state.onsetDetection.onsetData,
});

class OnsetGraph extends Component {
    componentDidMount = () => {
        this.startLoop();
    };

    componentWillUnmount = () => {
        this.stopLoop();
    };

    componentWillUpdate = (nextProps) => {
        updateCanvas(nextProps.onsetData);
    }

    startLoop = () => {
        if (!this.frameId) {
            this.frameId = window.requestAnimationFrame(this.loop);
        }
    }

    loop = () => {
        this.drawCanvas();
        this.frameId = window.requestAnimationFrame(this.loop);
    }

    stopLoop = () => {
        window.cancelAnimationFrame(this.frameId);
    }

    drawCanvas = () => {
        const onsetCanvasCtx = this.canvas.getContext("2d");
        onsetCanvasCtx.fillStyle = "black"; // e.g. rgba(0, 0, 200, 0.5)
        onsetCanvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);

        onsetCanvasCtx.fillStyle = "blue";
        thresholdValues.forEach((value, i) => {
            onsetCanvasCtx.fillRect(i, canvasHeight, 1, -value * onsetScale);
        })

        onsetCanvasCtx.fillStyle = "white";
        onsetValues.forEach((value, i) => {
            onsetCanvasCtx.fillRect(i, canvasHeight, 1, -value * onsetScale);
        })

        onsetCanvasCtx.fillStyle = "grey";
        peakValues.forEach((value, i) => {
            if (value === true) {
                onsetCanvasCtx.fillRect(i, canvasHeight, 1, -canvasHeight);
            }
        })
    }

    render() {
        return (
            <canvas
                ref={canvas => {
                    this.canvas = canvas;
                }}
                width={canvasWidth}
                height={canvasHeight}
            />
        );
    }
}

OnsetGraph.propTypes = propTypes;

export default connect(mapStateToProps)(OnsetGraph);