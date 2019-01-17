import ActionTypes from '../actions/actionTypes';

const {
	SET_SETTINGS_VISIBILITY,
	TOGGLE_SETTINGS_VISIBILITY,
} = ActionTypes;

interface ISettingsState {
	settingsAreVisible: boolean
}

const initialState: ISettingsState = {
	settingsAreVisible: false,
};

const reducer = (state = initialState, action: any = {}) => {
	switch (action.type) {
		case SET_SETTINGS_VISIBILITY: {
			return {...state, settingsAreVisible: action.settingsAreVisible }
		}
		case TOGGLE_SETTINGS_VISIBILITY: {
			return { ...state, settingsAreVisible: !state.settingsAreVisible };
		}
		default: return state;
	}
}

export default reducer;
