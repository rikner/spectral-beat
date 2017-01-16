import React, { Component, PropTypes } from 'react';
import OnsetGraph from './OnsetGraph';

class SettingsOverlay extends Component {
    render() {
        return (
            <div>
                SettingsOverlay
                <OnsetGraph />
            </div>
        );
    }
}

SettingsOverlay.props = {

};

export default SettingsOverlay;
