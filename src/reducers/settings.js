import {
    SET_SETTINGS_VISIBILITY,
    TOGGLE_SETTINGS_VISIBILITY,
} from '../actions/actionTypes';

const initialState = {
    settingsAreVisible: false,
};

export default function settings(state = initialState, action = {}) {
    switch (action.type) {
        case SET_SETTINGS_VISIBILITY:
            return {
                ...state,
                settingsAreVisible: action.settingsAreVisible,
            };
        case TOGGLE_SETTINGS_VISIBILITY:
            return {
                ...state,
                settingsAreVisible: !state.settingsAreVisible,
            };
        default:
            return state;
    }
}
