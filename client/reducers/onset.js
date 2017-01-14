import {
    SET_ONSET_DETECTION_RUNNING,
    TOGGLE_ONSET_DETECTION_RUNNING,
} from '/client/actions/actionTypes';

const initialState = {
    isRunning: false,
};

export default function settings(state = initialState, action = {}) {
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
        default:
            return state;
    }
}
