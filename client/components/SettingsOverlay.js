import React, { Component, PropTypes } from 'react';
import OnsetGraph from './OnsetGraph';

class SettingsOverlay extends Component {
    render() {
        return (
            <div style={{ position: 'absolute', zIndex: 10 }}>
                <OnsetGraph />
            </div >
        );
    }
}

SettingsOverlay.props = {

};

export default SettingsOverlay;
