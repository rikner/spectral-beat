import {
    SET_CANVAS_COLOR,
} from '../actions/actionTypes';

const initialState = {
    currentColor: 'black',
};

export default function canvas(state = initialState, action = {}) {
    switch (action.type) {
        case SET_CANVAS_COLOR:
            return {
                ...state,
                currentColor: action.color,
            };
        default:
            return state;
    }
}
