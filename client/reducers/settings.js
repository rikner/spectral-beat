import {
    SET_SETTINGS_VISIBILITY,
} from '/client/actions/actionTypes';

const initialState = {
    settingsAreVisible: false,
};

export default function settings(state = initialState, action = {}) {
  switch (action.type) {
    case SET_SETTINGS_VISIBILITY:
      return {
        ...state,
        settingsAreVisible: action.settingsAreVisible
      }
    default:
      return state
  }
}