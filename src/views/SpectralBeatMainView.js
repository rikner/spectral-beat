import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SettingsOverlay from '../components/SettingsOverlay';
import OnsetDetectionController from '../components/OnsetDetectionController';
import ControlPanel from '../components/ControlPanel';
import { toggleFullScreen } from '../lib/helpers';


const propTypes = {
    backgroundColor: PropTypes.string.isRequired,
    settingsAreVisible: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ canvas, settings }) => ({
    backgroundColor: canvas.currentColor,
    settingsAreVisible: settings.settingsAreVisible,
});

class SpectralBeatMainView extends Component {
    render() {
        const { settingsAreVisible, backgroundColor } =  this.props;
        return (
            <div 
                style={{ backgroundColor, ...styles.main }}
            >
                <OnsetDetectionController />
                <div style={styles.fullscreenButtonWrapper}>
                    <img
                        src={'fullscreen.png'}
                        style={styles.fullscreenButton}
                        onClick={toggleFullScreen}
                    />
                </div>

                <div style={styles.settingsContainer} >
                    {settingsAreVisible
                        ? <SettingsOverlay />
                        : null
                    }
                </div>
                <div style={styles.controlPanelContainer}>
                    <ControlPanel
                        // onClickStartStop={(isRunning) => { setOnsetDetectionRunning(isRunning); }}
                        // onClickSettings={toggleSettingsVisibility}
                        // isRunning={onsetDetectionIsRunning}
                    />
                </div>

            </div>
        )
    }
}

SpectralBeatMainView.propTypes = propTypes;

const styles = {
    controlPanelContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    fullscreenButton: {
        height: "3em",
        width: "3em",
    },
    fullscreenButtonWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    main: {
        alignItems: 'stretch',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans","Droid Sans", "Helvetica Neue", sans-serif',
        height: '100%',
        justifyContent: 'space-between',
        left: 0,
        position: 'absolute',
        top: 0,
        width: '100%',
    },
    settingsContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
}


export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SpectralBeatMainView);
