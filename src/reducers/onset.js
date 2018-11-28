import {
    SET_ONSET_DETECTION_RUNNING,
    SET_ONSET_GRAPH_SCALE,
    TOGGLE_ONSET_DETECTION_RUNNING,
    SET_ONSET_DATA,
    SET_THRESHOLD,
    TOGGLE_AUTO_THRESHOLD_IS_ACTIVE,
} from '../actions/actionTypes';

const initialState = {
    autoThresholdIsActive: true,
    graphScale: 10000000,
    isRunning: false,
    onsetData: {
        isPeak: false,
        threshold: 0,
        value: 0,
    },
    userThreshold: 0,
};

export default function onsetDetection(state = initialState, action = {}) {
    switch (action.type) {
        case SET_ONSET_GRAPH_SCALE:
            return {
                ...state,
                graphScale: action.graphScale
            }
        case SET_ONSET_DETECTION_RUNNING:
            return {
                ...state,
                isRunning: action.isRunning,
            };
        case TOGGLE_ONSET_DETECTION_RUNNING:
            return {
                ...state,
                isRunning: !state.isRunning,
            };
        case SET_ONSET_DATA:
            return {
                ...state,
                onsetData: {
                    ...state.onsetData,
                    ...action.onsetData,
                },
            };
        case TOGGLE_AUTO_THRESHOLD_IS_ACTIVE:
            return {
                ...state,
                autoThresholdIsActive: !state.autoThresholdIsActive,
            };
        case SET_THRESHOLD:
            return {
                ...state,
                userThreshold: action.threshold
            };
        default:
            return state;
    }
}
