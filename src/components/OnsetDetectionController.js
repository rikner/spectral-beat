import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import OnsetDetection from '../lib/OnsetDetection';
import getRandomColor from '../lib/helpers';
import ControlPanel from '../components/ControlPanel';

const actions = require('../actions/');
    
const propTypes = {
    onsetDetectionIsRunning: PropTypes.bool.isRequired,
    setNewRandomColor: PropTypes.func.isRequired,
    toggleSettingsVisibility: PropTypes.func.isRequired,
    setOnsetDetectionRunning: PropTypes.func.isRequired,
    setOnsetData: PropTypes.func.isRequired,
    autoThresholdIsActive: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    onsetDetectionIsRunning: state.onsetDetection.isRunning,
    autoThresholdIsActive: state.onsetDetection.autoThresholdIsActive,
    userThreshold: state.onsetDetection.userThreshold,
});

const mapDispatchToProps = dispatch => ({
    setNewRandomColor: () => {
        const color = getRandomColor();
        dispatch(actions.setCanvasColor(color));
    },
    setCanvasColor: (color) => {
        dispatch(actions.setCanvasColor(color));
    },
    toggleSettingsVisibility: () => {
        dispatch(actions.toggleSettingsVisibility());
    },
    setOnsetDetectionRunning: (isRunning) => {
        dispatch(actions.setOnsetDetectionRunning(isRunning));
    },
    setOnsetData: (onsetData) => {
        dispatch(actions.setOnsetData(onsetData));
    },
});

class OnsetDetectionController extends Component {
    constructor() {
        super();
        this.onsetDetection = new OnsetDetection();
    }

    componentDidMount() {
        this.onsetDetection.onOnsetDetected = this.props.setNewRandomColor;
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
            console.log("setting onset detection user threshold");
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

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(OnsetDetectionController);
