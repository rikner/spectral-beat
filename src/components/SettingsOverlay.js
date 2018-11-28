import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OnsetGraph from './OnsetGraph';
import OnsetScaler from './OnsetScaler';
import ThresholdController from './ThresholdController';
import withSizes from 'react-sizes'


class SettingsOverlay extends Component {
    render() {
        const { windowWidth, windowHeight } = this.props;
        const canvasHeight = Math.round(windowHeight / 3);
        const canvasWidth = Math.round(windowWidth);
        return (
            <div style={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: '1em'
            }}>
                {/* <OnsetScaler height={canvasHeight} /> */}
                <OnsetGraph
                    canvasHeight={canvasHeight}
                    canvasWidth={canvasWidth}
                />
                {/* <ThresholdController /> */}
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
