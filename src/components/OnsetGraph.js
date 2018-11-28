import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const propTypes = {
    canvasHeight: PropTypes.number.isRequired,
    canvasWidth: PropTypes.number.isRequired,
    graphScale: PropTypes.number.isRequired,
    onsetData: PropTypes.shape({
        isPeak: PropTypes.bool.isRequired,
        threshold: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    }).isRequired,
};

const mapStateToProps = state => ({
    graphScale: state.onsetDetection.graphScale,
    onsetData: state.onsetDetection.onsetData,
});

class OnsetGraph extends Component {
    constructor(props) {
        super(props);
        const { canvasWidth } = props;
        this.createDataArrays(canvasWidth);
    }

    createDataArrays(length) {
        this.onsetValues = new Array(length);
        this.thresholdValues = new Array(length);
        this.peakValues = new Array(length);

        for (let i = 0; i < length; i++) {
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
        const { onsetData, canvasWidth } = this.props

        if (prevProps.canvasWidth !== canvasWidth) {
            // XXX: there might a better solution than creating new ararys
            // everytime the width changes, but I guess it's allright for now
            // since one doesn't resize it all the time
            this.createDataArrays(canvasWidth);
        }

        const { value, threshold, isPeak } = onsetData;

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
        const { canvasHeight, canvasWidth, graphScale } = this.props;

        const onsetCanvasCtx = this.canvas.getContext("2d");

        const backgroundGradient = onsetCanvasCtx.createLinearGradient(0, 0, 0, 170);
        backgroundGradient.addColorStop(0, "blue");
        backgroundGradient.addColorStop(1, "black");

        onsetCanvasCtx.fillStyle = backgroundGradient;
        onsetCanvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);


        onsetCanvasCtx.fillStyle = "blue";
        this.thresholdValues.forEach((value, i) => {
            onsetCanvasCtx.fillRect(i, canvasHeight, 1, -value * graphScale);
        })

        onsetCanvasCtx.fillStyle = "white";
        this.onsetValues.forEach((value, i) => {
            onsetCanvasCtx.fillRect(i, canvasHeight, 1, -value * graphScale);
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
            <div style={{
                height: canvasHeight,
                opacity: 0.5,
                width: canvasWidth,
            }}>
                <canvas
                    ref={canvas => {
                        this.canvas = canvas;
                    }}
                    width={canvasWidth}
                    height={canvasHeight}
                />
            </div>
        );
    }
}

OnsetGraph.propTypes = propTypes;

export default connect(mapStateToProps)(OnsetGraph);