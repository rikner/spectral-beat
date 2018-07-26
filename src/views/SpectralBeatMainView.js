import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SettingsOverlay from '../components/SettingsOverlay';
import ColorCanvas from '../components/ColorCanvas';
import OnsetDetectionController from '../components/OnsetDetectionController';

import * as actions from "../actions";

class SpectralBeatMainView extends Component {
    render() {
        const { settingsAreVisible } = this.props;
        return (
            <div style={styles.main}>
                <ColorCanvas />
                <OnsetDetectionController />
                { settingsAreVisible 
                    ? <SettingsOverlay /> 
                    : null 
                }
            </div>
        );
    }
}

const styles = {
    main: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans","Droid Sans", "Helvetica Neue", sans-serif',
    },
};

SpectralBeatMainView.propTypes = {
    setSettingsVisibility: PropTypes.func.isRequired,
    settingsAreVisible: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ settings }) => ({
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
