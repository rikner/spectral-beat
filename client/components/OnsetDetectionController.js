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
    setOnsetValues: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    onsetDetectionIsRunning: state.onsetDetection.isRunning,
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
    setOnsetValues: (onsetValues) => {
        dispatch(actions.setOnsetValues(onsetValues));
    },
});

class OnsetDetectionController extends Component {

    componentDidMount() {
        onProcessCallbacks.push((onsetValues) => {
            this.props.setOnsetValues(onsetValues.slice());
        });
    }

    render() {
        const { onsetDetectionIsRunning, setNewRandomColor, setOnsetDetectionRunning, toggleSettingsVisibility } = this.props;

        if (onsetDetectionIsRunning) startAudioProcessing(setNewRandomColor);
        else stopAudioProcessing();
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
