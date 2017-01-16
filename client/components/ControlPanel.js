import React, { PropTypes, Component } from 'react';
import ControlButton from '/client/components/Button';

const propTypes = {
    onClickStart: PropTypes.func.isRequired,
    onClickStop: PropTypes.func.isRequired,
    onClickSettings: PropTypes.func.isRequired,
};

class ControlPanel extends Component {
    render() {
        const { onClickStart, onClickStop, onClickSettings } = this.props;
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
                    label='Start'
                    onClick={onClickStart}
                />
                <ControlButton
                    label='Stop'
                    onClick={onClickStop}
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
