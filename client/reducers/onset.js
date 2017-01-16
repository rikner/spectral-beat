import {
    SET_ONSET_DETECTION_RUNNING,
    TOGGLE_ONSET_DETECTION_RUNNING,
    SET_ONSET_VALUES,
} from '/client/actions/actionTypes';

const initialState = {
    isRunning: false,
    onsetValues: [],
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
        case SET_ONSET_VALUES:
            return {
                ...state,
                onsetValues: action.onsetValues,
            };
        default:
            return state;
    }
}
