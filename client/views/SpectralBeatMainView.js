import React from 'react';
import SettingsOverlay from '/client/components/SettingsOverlay';
import ColorCanvas from '/client/components/ColorCanvas';
import ControlPanel from '/client/components/ControlPanel';

export default class SpectralBeatMainView extends React.Component {
  render() {
    return (
      <div>
        <h1>SpectralBeat</h1>
        <ColorCanvas />
        <SettingsOverlay />
        <ControlPanel />
      </div>
    );
  }
}