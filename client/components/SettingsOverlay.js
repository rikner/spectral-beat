import React, { Component, PropTypes } from 'react';
import OnsetGraph from './OnsetGraph';
import ThresholdController from './ThresholdController';

class SettingsOverlay extends Component {
    render() {
        return (
            <div style={{ position: 'absolute', zIndex: 10 }}>
                <OnsetGraph />
                <ThresholdController />
            </div >
        );
    }
}

SettingsOverlay.props = {

};

export default SettingsOverlay;
