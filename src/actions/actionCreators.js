import {
    SET_SETTINGS_VISIBILITY,
    TOGGLE_SETTINGS_VISIBILITY,
    SET_CANVAS_COLOR,
    TOGGLE_ONSET_DETECTION_RUNNING,
    SET_ONSET_DETECTION_RUNNING,
    SET_ONSET_DATA,
    SET_ONSET_GRAPH_SCALE,
    TOGGLE_AUTO_THRESHOLD_IS_ACTIVE,
    SET_THRESHOLD,
} from './actionTypes';

export const setSettingsVisibility = settingsAreVisible => ({
    settingsAreVisible,
    type: SET_SETTINGS_VISIBILITY,
});

export const setCanvasColor = color => ({
    color,
    type: SET_CANVAS_COLOR,
});

export const toggleSettingsVisibility = () => ({
    type: TOGGLE_SETTINGS_VISIBILITY,
});

export const toggleOnsetDetectionRunning = () => ({
    type: TOGGLE_ONSET_DETECTION_RUNNING,
});

export const setOnsetDetectionRunning = isRunning => ({
    isRunning,
    type: SET_ONSET_DETECTION_RUNNING,
});

export const setOnsetData = onsetData => ({
    onsetData,
    type: SET_ONSET_DATA,
});

export const setOnsetGraphScale = graphScale => ({
    graphScale,
    type: SET_ONSET_GRAPH_SCALE
});

export const setThreshold = threshold => ({
    threshold,
    type: SET_THRESHOLD,
});

export const toggleAutoThresholdIsActive = () => ({
    type: TOGGLE_AUTO_THRESHOLD_IS_ACTIVE,
});
