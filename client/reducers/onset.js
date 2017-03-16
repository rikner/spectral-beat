import {
    SET_ONSET_DETECTION_RUNNING,
    TOGGLE_ONSET_DETECTION_RUNNING,
    SET_ONSET_DATA,
} from '/client/actions/actionTypes';

const initialState = {
    isRunning: false,
    onsetData: {
        value: 0,
        threshold: 0,
        isPeak: false,
    },
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
                onsetData: action.onsetData,
            };
        default:
            return state;
    }
}
