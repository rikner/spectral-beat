import React, { PropTypes, Component } from 'react';
import ControlButton from '/client/components/Button';
import { connect } from 'react-redux';
import actions from '/client/actions/actionCreators';

class ControlPanel extends Component {
    render() {
        const { toggleSettingsVisibility, setOnsetDetectionRunning } = this.props;
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
                    onClick={() => {
                        setOnsetDetectionRunning(true);
                    }}
                />
                <ControlButton
                    label='Stop'
                    onClick={() => {
                        setOnsetDetectionRunning(false);
                    }}
                />
                <ControlButton
                    label='Settings'
                    onClick={toggleSettingsVisibility}
                />
            </div>
        );
    }
}

ControlPanel.propTypes = {
    toggleSettingsVisibility: PropTypes.func.isRequired,
    setOnsetDetectionRunning: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    setCanvasColor: (color) => {
        dispatch(actions.setCanvasColor(color));
    },
    toggleSettingsVisibility: () => {
        dispatch(actions.toggleSettingsVisibility());
    },
    setOnsetDetectionRunning: (isRunning) => {
        dispatch(actions.setOnsetDetectionRunning(isRunning));
    },
});

export default connect(null, mapDispatchToProps)(ControlPanel);
