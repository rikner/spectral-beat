import {
    SET_SETTINGS_VISIBILITY
} from './actionTypes';

export const setSettingsVisibility = settingsAreVisible => ({
    type: SET_SETTINGS_VISIBILITY,
    settingsAreVisible,
});
