import React, { PropTypes, Component } from 'react';
import { startAudioProcessing, stopAudioProcessing } from '/client/lib/onset-detection';
import { connect } from 'react-redux';
import actions from '/client/actions/actionCreators';
import getRandomColor from '/client/lib/helpers';

const propTypes = {
    onsetDetectionIsRunning: PropTypes.bool.isRequired,
    setNewRandomColor: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    return {
        onsetDetectionIsRunning: state.onsetDetection.isRunning,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setNewRandomColor: () => {
            const color = getRandomColor();
            dispatch(actions.setCanvasColor(color));
        },
    };
};

class OnsetDetectionController extends Component {
    render() {
        const { onsetDetectionIsRunning, setNewRandomColor } = this.props;
        if (onsetDetectionIsRunning) startAudioProcessing(setNewRandomColor);
        else stopAudioProcessing();
        return (
            <div />
        );
    }
}

OnsetDetectionController.propTypes = propTypes;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(OnsetDetectionController);
