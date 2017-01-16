import {
    SET_SETTINGS_VISIBILITY,
    TOGGLE_SETTINGS_VISIBILITY,
    SET_CANVAS_COLOR,
    TOGGLE_ONSET_DETECTION_RUNNING,
    SET_ONSET_DETECTION_RUNNING,
    SET_ONSET_VALUES,
} from './actionTypes';

export const setSettingsVisibility = settingsAreVisible => ({
    type: SET_SETTINGS_VISIBILITY,
    settingsAreVisible,
});

export const setCanvasColor = color => ({
    type: SET_CANVAS_COLOR,
    color,
});

export const toggleSettingsVisibility = () => ({
    type: TOGGLE_SETTINGS_VISIBILITY,
});

export const toggleOnsetDetectionRunning = () => ({
    type: TOGGLE_ONSET_DETECTION_RUNNING,
});

export const setOnsetDetectionRunning = isRunning => ({
    type: SET_ONSET_DETECTION_RUNNING,
    isRunning,
});

export const setOnsetValues = onsetValues => ({
    type: SET_ONSET_VALUES,
    onsetValues,
})
