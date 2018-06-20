import * as React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";

import spectralBeatReducers from "./reducers";
import SpectralBeatMainView from "./views/SpectralBeatMainView";

const store = createStore(spectralBeatReducers);

class App extends React.Component {
	public render() {
		return (
			<Provider store={store}>
			<SpectralBeatMainView />
			</Provider>
		);
	}
}

export default App;
