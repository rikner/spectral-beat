import {
    SET_CANVAS_COLOR,
} from '/client/actions/actionTypes';

const initialState = {
    currentColor: 'white',
};

export default function canvas(state = initialState, action = {}) {
  switch (action.type) {
    case SET_CANVAS_COLOR:
      return {
        ...state,
        currentColor: action.color,
      }
    default:
      return state;
  }
}
