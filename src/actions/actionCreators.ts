import ActionTypes from './actionTypes';

const { 
	SET_SETTINGS_VISIBILITY,
	SET_CANVAS_COLOR,
	TOGGLE_SETTINGS_VISIBILITY,
	TOGGLE_AUTO_THRESHOLD_IS_ACTIVE,
	TOGGLE_ONSET_DETECTION_RUNNING,
	SET_ONSET_DETECTION_RUNNING,
	SET_ONSET_DATA,
	SET_THRESHOLD,
	SET_ONSET_GRAPH_SCALE 
} = ActionTypes;

export const setSettingsVisibility = (settingsAreVisible: boolean) => ({
	settingsAreVisible,
	type: SET_SETTINGS_VISIBILITY,
});

export const setCanvasColor = (color: string) => ({
	color,
	type: SET_CANVAS_COLOR,
});

export const toggleSettingsVisibility = () => ({
	type: TOGGLE_SETTINGS_VISIBILITY,
});

export const toggleOnsetDetectionRunning = () => ({
	type: TOGGLE_ONSET_DETECTION_RUNNING,
});

export const setOnsetDetectionRunning = (isRunning: boolean) => ({
	isRunning,
	type: SET_ONSET_DETECTION_RUNNING,
});

export const setOnsetData = (onsetData: any) => ({
	onsetData,
	type: SET_ONSET_DATA,
});

export const setOnsetGraphScale = (graphScale: number) => ({
	graphScale,
	type: SET_ONSET_GRAPH_SCALE
});

export const setThreshold = (threshold: number) => ({
	threshold,
	type: SET_THRESHOLD,
});

export const toggleAutoThresholdIsActive = () => ({
	type: TOGGLE_AUTO_THRESHOLD_IS_ACTIVE,
});
