import {
    SET_SETTINGS_VISIBILITY,
    TOGGLE_SETTINGS_VISIBILITY,
    SET_CANVAS_COLOR,
    TOGGLE_ONSET_DETECTION_RUNNING,
    SET_ONSET_DETECTION_RUNNING,
    SET_ONSET_DATA,
    TOGGLE_AUTO_THRESHOLD_IS_ACTIVE,
    SET_THRESHOLD,
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

export const setOnsetData = onsetData => ({
    type: SET_ONSET_DATA,
    onsetData,
});

export const setThreshold = threshold => ({
    type: SET_THRESHOLD,
    threshold,
});

export const toggleAutoThresholdIsActive = () => ({
    type: TOGGLE_AUTO_THRESHOLD_IS_ACTIVE,
});
