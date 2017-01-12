import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import spectralBeatReducers from './reducers';
import SpectralBeatMainView from './views/SpectralBeatMainView';

let store = createStore(spectralBeatReducers);

let app =
    <Provider store={store}>
      <SpectralBeatMainView />
    </Provider>;

Meteor.startup(() => {
  render(app, document.getElementById('app'))
});