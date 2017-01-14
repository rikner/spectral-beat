import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import SettingsOverlay from '/client/components/SettingsOverlay';
import ColorCanvas from '/client/components/ColorCanvas';
import ControlPanel from '/client/components/ControlPanel';
import settingsActions from '/client/actions/actionCreators';

class SpectralBeatMainView extends Component {
    componentDidMount() {
        this.props.setSettingsVisibility(true);
    }
    render() {
        const { settingsAreVisible } = this.props;
        return (
            <div>
                <ColorCanvas />
                <ControlPanel />
                { settingsAreVisible ? <SettingsOverlay /> : null }
            </div>
        );
    }
}

SpectralBeatMainView.propTypes = {
    settingsAreVisible: PropTypes.bool.isRequired,
    setSettingsVisibility: PropTypes.func.isRequired,
};

const mapStateToProps = ({ settings }) => ({
    settingsAreVisible: settings.settingsAreVisible,
});

const mapDispatchToProps = dispatch => ({
    setSettingsVisibility: (visible) => {
        dispatch(settingsActions.setSettingsVisibility(visible));
    },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SpectralBeatMainView);
