import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ControlButton from './Button';

const propTypes = {
    isRunning: PropTypes.bool.isRequired,
    onClickSettings: PropTypes.func.isRequired,
    onClickStartStop: PropTypes.func.isRequired,
};

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
                    marginTop: '1em',
                    position: 'relative',
                }}
            >
                <ControlButton
                    label={isRunning ? "Stop" : "Start"}
                    onClick={() => onClickStartStop(!isRunning) }
                />

                <ControlButton
                    label='Graph'
                    onClick={onClickSettings}
                />
            </div>
        );
    }
}

ControlPanel.propTypes = propTypes;

export default ControlPanel;
