import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OnsetGraph from './OnsetGraph';
import OnsetScaler from './OnsetScaler';
import ThresholdController from './ThresholdController';
import withSizes from 'react-sizes'


class SettingsOverlay extends Component {
    render() {
        const { windowWidth, windowHeight } = this.props;

        return (
            <div style={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: '1em'
            }}>
                <OnsetGraph
                    canvasHeight={Math.round(windowHeight / 3)}
                    canvasWidth={Math.round(windowWidth / 2)}
                />
                <OnsetScaler />
            </div>
        );
    }
}

SettingsOverlay.props = {
    windowHeight: PropTypes.number.isRequired,
    windowWidth: PropTypes.number.isRequired,
};

const mapSizesToProps = ({ width, height }) => ({
    windowHeight: height,
    windowWidth: width,
})


export default withSizes(mapSizesToProps)(SettingsOverlay);
