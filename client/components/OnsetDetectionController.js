import React, { PropTypes, Component } from 'react';
import { startAudioProcessing, stopAudioProcessing, onProcessCallbacks } from '/client/lib/onset-detection';
import { connect } from 'react-redux';
import actions from '/client/actions/actionCreators';
import getRandomColor from '/client/lib/helpers';
import ControlPanel from '/client/components/ControlPanel';

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

    componentDidMount() {
        onProcessCallbacks.push((onsetData) => {
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
            if (nextProps.onsetDetectionIsRunning) startAudioProcessing(this.props.setNewRandomColor);
            else stopAudioProcessing();
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
