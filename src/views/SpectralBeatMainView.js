import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SettingsOverlay from '../components/SettingsOverlay';
import OnsetDetectionController from '../components/OnsetDetectionController';

import * as actions from '../actions';

class SpectralBeatMainView extends Component {
    render() {
        const { settingsAreVisible, backgroundColor } = this.props;

        return (
            <div
                style={{
                    alignItems: 'stretch',
                    backgroundColor,
                    display: 'flex',
                    flexDirection: 'column',
                    fontFamily,
                    height: '100%',
                    justifyContent: 'space-between',
                    left: 0,
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                    }}
                >
                    <OnsetDetectionController />
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                    }}
                >
                    {settingsAreVisible
                        ? <SettingsOverlay />
                        : null
                    }
                </div>
            </div>
        );
    }
}

const fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans","Droid Sans", "Helvetica Neue", sans-serif';

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
