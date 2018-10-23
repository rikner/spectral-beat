import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SettingsOverlay from '../components/SettingsOverlay';
import OnsetDetectionController from '../components/OnsetDetectionController';
import * as actions from '../actions';

const SpectralBeatMainView = ({ settingsAreVisible, backgroundColor }) =>
    <div style={{ backgroundColor, ...styles.main }}>
        <div style={styles.controllerContainer}>
            <OnsetDetectionController />
        </div>
        <div style={styles.settingsContainer} >
            {settingsAreVisible
                ? <SettingsOverlay />
                : null
            }
        </div>
    </div>


const styles = {
    controllerContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
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

SpectralBeatMainView.propTypes = {
    setSettingsVisibility: PropTypes.func.isRequired,
    settingsAreVisible: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ canvas, settings }) => ({
    backgroundColor: canvas.currentColor,
    settingsAreVisible: settings.settingsAreVisible,
});

const mapDispatchToProps = dispatch => ({
    setSettingsVisibility: (visible) => {
        dispatch(actions.setSettingsVisibility(visible));
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SpectralBeatMainView);
