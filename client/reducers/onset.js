import {
    SET_ONSET_DETECTION_RUNNING,
    TOGGLE_ONSET_DETECTION_RUNNING,
    SET_ONSET_DATA,
    SET_THRESHOLD,
    TOGGLE_AUTO_THRESHOLD_IS_ACTIVE,
} from '/client/actions/actionTypes';

const initialState = {
    isRunning: false,
    onsetData: {
        value: 0,
        threshold: 0,
        isPeak: false,
    },
    autoThresholdIsActive: true,
};

export default function onsetDetection(state = initialState, action = {}) {
    switch (action.type) {
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
                onsetData: {
                    ...state.onsetData,
                    threshold: action.threshold,
                },
            };
        default:
            return state;
    }
}
