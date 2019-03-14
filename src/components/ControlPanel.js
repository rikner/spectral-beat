import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ControlButton from './Button';
import { connect } from 'react-redux';
import * as actions from "../actions";

const propTypes = {
    isRunning: PropTypes.bool.isRequired,
    onClickSettings: PropTypes.func.isRequired,
    onClickStartStop: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    isRunning: state.onsetDetection.isRunning
});

const mapDispatchToProps = dispatch => ({
    onClickSettings: () => {
        dispatch(actions.toggleSettingsVisibility());
    },
    onClickStartStop: (isRunning) => {
        dispatch(actions.setOnsetDetectionRunning(isRunning));
    },
});

class ControlPanel extends Component {
    render() {
        const { onClickStartStop, onClickSettings, isRunning } = this.props;
        return (
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    margin: '1em',
                    position: 'relative',
                }}
            >
                <ControlButton
                    label='Graph'
                    onClick={onClickSettings}
                />

                <ControlButton
                    label={isRunning ? "Stop" : "Start"}
                    onClick={() => onClickStartStop(!isRunning) }
                />
            </div>
        );
    }
}

ControlPanel.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
