import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const onsetScale = 100;

const propTypes = {
    canvasHeight: PropTypes.number.isRequired,
    canvasWidth: PropTypes.number.isRequired,
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
    constructor(props) {
        super(props);

        const { canvasHeight, canvasWidth } = props;

        this.onsetValues = new Array(canvasWidth);
        this.thresholdValues = new Array(canvasWidth);
        this.peakValues = new Array(canvasWidth);

        for (let i = 0; i < canvasWidth; i++) {
            this.onsetValues[i] = 0;
            this.thresholdValues[i] = 0;
            this.peakValues[i] = false;
        }
    }

    componentDidMount = () => {
        this.startLoop();
    };

    componentWillUnmount = () => {
        this.stopLoop();
    };

    componentDidUpdate = (prevProps) => {
        const onsetData = this.props.onsetData

        this.onsetValues.shift();
        this.onsetValues.push(onsetData.value);

        this.thresholdValues.shift();
        this.thresholdValues.push(onsetData.threshold);

        this.peakValues.shift();
        this.peakValues.push(onsetData.isPeak);

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
        const { canvasHeight, canvasWidth } = this.props;

        const onsetCanvasCtx = this.canvas.getContext("2d");
        onsetCanvasCtx.fillStyle = "green"; // e.g. rgba(0, 0, 200, 0.5)
        onsetCanvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);

        onsetCanvasCtx.fillStyle = "blue";
        this.thresholdValues.forEach((value, i) => {
            onsetCanvasCtx.fillRect(i, canvasHeight, 1, -value * onsetScale);
        })

        onsetCanvasCtx.fillStyle = "white";
        this.onsetValues.forEach((value, i) => {
            onsetCanvasCtx.fillRect(i, canvasHeight, 1, -value * onsetScale);
        })

        onsetCanvasCtx.fillStyle = "grey";
        this.peakValues.forEach((value, i) => {
            if (value === true) {
                onsetCanvasCtx.fillRect(i, canvasHeight, 1, -canvasHeight);
            }
        })
    }

    render() {
        const { canvasHeight, canvasWidth } = this.props;
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