import React, { Component } from 'react';
import OnsetGraph from './OnsetGraph';
import ThresholdController from './ThresholdController';

class SettingsOverlay extends Component {
    render() {
        return (
            <div style={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                position: 'relative',
                top: '2em'
            }}>
                <OnsetGraph />
                <ThresholdController />
            </div >
        );
    }
}

SettingsOverlay.props = {

};

export default SettingsOverlay;
