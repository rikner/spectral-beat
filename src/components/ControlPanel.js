import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ControlButton from './Button';

const propTypes = {
    onClickStartStop: PropTypes.func.isRequired,
    onClickSettings: PropTypes.func.isRequired,
    isRunning: PropTypes.bool.isRequired,
};

class ControlPanel extends Component {
    render() {
        const { onClickStartStop, onClickSettings, isRunning } = this.props;
        return (
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                }}
            >
                <ControlButton
                    label={isRunning ? "Stop" : "Start"}
                    onClick={() => onClickStartStop(!isRunning) }
                />

                <ControlButton
                    label='Settings'
                    onClick={onClickSettings}
                />
            </div>
        );
    }
}

ControlPanel.propTypes = propTypes;

export default ControlPanel;
