import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import SpectralBeatMainView from './views/SpectralBeatMainView';

Meteor.startup(() => {
  render(<SpectralBeatMainView />, document.getElementById('app'));
});