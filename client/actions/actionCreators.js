import {
    SET_SETTINGS_VISIBILITY,
    SET_CANVAS_COLOR,
} from './actionTypes';

export const setSettingsVisibility = settingsAreVisible => ({
    type: SET_SETTINGS_VISIBILITY,
    settingsAreVisible,
});

export const setCanvasColor = color => ({
    type:  SET_CANVAS_COLOR,
    color,
});