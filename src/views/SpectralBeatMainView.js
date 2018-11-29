import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SettingsOverlay from '../components/SettingsOverlay';
import OnsetDetectionController from '../components/OnsetDetectionController';
import * as actions from '../actions';
import { toggleFullScreen } from '../lib/helpers';

class SpectralBeatMainView extends Component {
    constructor(props) {
        super(props);
        this.mainView = React.createRef();
    }
    render() {
        const { settingsAreVisible, backgroundColor } =  this.props;
        return (
            <div 
                ref={this.mainView}
                style={{ backgroundColor, ...styles.main }}
            >
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
                <div style={styles.controllerContainer}>
                    <OnsetDetectionController />
                </div>

            </div>
        )
    }
}

const styles = {
    controllerContainer: {
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
