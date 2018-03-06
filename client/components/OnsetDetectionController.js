import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import OnsetDetection from '../lib/OnsetDetection';
import actions from '../actions/actionCreators';
import getRandomColor from '../lib/helpers';
import ControlPanel from '../components/ControlPanel';

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
            const { autoThresholdIsActive, setOnsetData } = this.props;
            if (autoThresholdIsActive) {
                setOnsetData(onsetData);
            } else {
                setOnsetData({ isPeak: onsetData.isPeak, value: onsetData.value });
            }
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
    }

    render() {
        const { setOnsetDetectionRunning, toggleSettingsVisibility } = this.props;
        return (
            <ControlPanel
                onClickStart={() => { setOnsetDetectionRunning(true); }}
                onClickStop={() => { setOnsetDetectionRunning(false); }}
                onClickSettings={toggleSettingsVisibility}
            />
        );
    }
}

OnsetDetectionController.propTypes = propTypes;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(OnsetDetectionController);
