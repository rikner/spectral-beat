import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import OnsetDetection from '../lib/OnsetDetection';
import { getRandomColor } from '../lib/helpers';
import ControlPanel from '../components/ControlPanel';

import * as actions from "../actions";
import WebAudioEngine from 'src/lib/AudioEngine/WebAudioEngine';

const propTypes = {
    autoThresholdIsActive: PropTypes.bool.isRequired,
    onsetDetectionIsRunning: PropTypes.bool.isRequired,
    setNewRandomColor: PropTypes.func.isRequired,
    setOnsetData: PropTypes.func.isRequired,
    setOnsetDetectionRunning: PropTypes.func.isRequired,
    settingsAreVisible: PropTypes.bool.isRequired,
    toggleSettingsVisibility: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    autoThresholdIsActive: state.onsetDetection.autoThresholdIsActive,
    onsetDetectionIsRunning: state.onsetDetection.isRunning,
    settingsAreVisible: state.settings.settingsAreVisible,
    userThreshold: state.onsetDetection.userThreshold,
});

const mapDispatchToProps = dispatch => ({
    setCanvasColor: (color) => {
        dispatch(actions.setCanvasColor(color));
    },
    setNewRandomColor: () => {
        const color = getRandomColor();
        dispatch(actions.setCanvasColor(color));
    },
    setOnsetData: (onsetData) => {
        dispatch(actions.setOnsetData(onsetData));
    },
    setOnsetDetectionRunning: (isRunning) => {
        dispatch(actions.setOnsetDetectionRunning(isRunning));
    },
    toggleSettingsVisibility: () => {
        dispatch(actions.toggleSettingsVisibility());
    },
});

class OnsetDetectionController extends Component {
    static desiredBufferSize = 1024;
    static refractoryTimeMS = 75;

    constructor() {
        super();
        this.audioEngine = new WebAudioEngine(OnsetDetectionController.desiredBufferSize);
        this.onsetDetection = new OnsetDetection(this.audioEngine.sampleRate, this.audioEngine.bufferSize, this.audioEngine.frequencyBinCount);
    }

    startAudioProcessing() {
        this.audioEngine.onFloatFrequencyData = this.onsetDetection.run;
        this.audioEngine.start();
    }

    stopAudioProcessing() {
        this.audioEngine.stop();
    }

    componentDidMount() {
        this.onsetDetection.onOnsetDetected = withRefractoryTime(OnsetDetectionController.refractoryTimeMS)(this.props.setNewRandomColor);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.onsetDetectionIsRunning !== this.props.onsetDetectionIsRunning) {
            if (this.props.onsetDetectionIsRunning) {
                this.startAudioProcessing();
            } else {
                this.stopAudioProcessing();
            }
        }
        if (prevProps.autoThresholdIsActive !== this.props.autoThresholdIsActive) {
            this.onsetDetection.shouldCalculateThreshold = this.props.autoThresholdIsActive;
        }

        if (prevProps.userThreshold !== this.props.userThreshold) {
            this.onsetDetection.setThreshold(this.props.userThreshold);
        }

        if (prevProps.settingsAreVisible !== this.props.settingsAreVisible) {
            if (this.props.settingsAreVisible) {
                this.onsetDetection.onOnsetResultData = this.props.setOnsetData;
            } else {
                this.onsetDetection.onOnsetResultData = null
            }
        }
    }

    render() {
        const {
            onsetDetectionIsRunning,
            setOnsetDetectionRunning,
            toggleSettingsVisibility
        } = this.props;

        return (
            <ControlPanel
                onClickStartStop={(isRunning) => { setOnsetDetectionRunning(isRunning); }}
                onClickSettings={toggleSettingsVisibility}
                isRunning={onsetDetectionIsRunning}
            />
        );
    }
}

OnsetDetectionController.propTypes = propTypes;

// tslint:disable:no-console

function withRefractoryTime(refactoryTime) {
    return function (callback) {
        let lastDetectionTimeStamp = 0;
        return function (timeStamp) {
            if ((timeStamp - lastDetectionTimeStamp) >= refactoryTime) {
                callback();
            }
            lastDetectionTimeStamp = timeStamp;
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(OnsetDetectionController);
