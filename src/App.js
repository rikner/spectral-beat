import React, { Component } from 'react';
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import spectralBeatReducers from './reducers';
import SpectralBeatMainView from './views/SpectralBeatMainView';

let store = createStore(spectralBeatReducers);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <SpectralBeatMainView />
      </Provider>
    );
  }
}

export default App;
