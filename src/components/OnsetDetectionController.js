import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import OnsetDetection from '../lib/OnsetDetection';
import { getRandomColor } from '../lib/helpers';
import ControlPanel from '../components/ControlPanel';

import * as actions from "../actions";
    
const propTypes = {
    autoThresholdIsActive: PropTypes.bool.isRequired,
    onsetDetectionIsRunning: PropTypes.bool.isRequired,
    setNewRandomColor: PropTypes.func.isRequired,
    setOnsetData: PropTypes.func.isRequired,
    setOnsetDetectionRunning: PropTypes.func.isRequired,
    toggleSettingsVisibility: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    autoThresholdIsActive: state.onsetDetection.autoThresholdIsActive,
    onsetDetectionIsRunning: state.onsetDetection.isRunning,
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
    constructor() {
        super();
        this.onsetDetection = new OnsetDetection();
    }

    componentDidMount() {
        this.onsetDetection.onOnsetDetected = withRefractoryTime(this.props.setNewRandomColor);
        this.onsetDetection.onProcessCallbacks.push((onsetData) => {
            this.props.setOnsetData(onsetData);
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.onsetDetectionIsRunning !== this.props.onsetDetectionIsRunning) {
            if (nextProps.onsetDetectionIsRunning) {
                this.onsetDetection.startAudioProcessing();
            } else {
                this.onsetDetection.stopAudioProcessing();
            }
        }
        if (nextProps.autoThresholdIsActive !== this.props.autoThresholdIsActive) {
            this.onsetDetection.shouldCalculateThreshold = nextProps.autoThresholdIsActive;
        }

        if (nextProps.userThreshold !== this.props.userThreshold) {
            this.onsetDetection.setThreshold(nextProps.userThreshold);
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


function withRefractoryTime(callback) {
    const REFRACTORY_TIME_MS = 75;
    let lastDetectionTimeStamp = 0;
    return function(timeStamp) {
        if ((timeStamp - lastDetectionTimeStamp) >= REFRACTORY_TIME_MS) {
            callback();
        }
        lastDetectionTimeStamp = timeStamp;
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(OnsetDetectionController);
