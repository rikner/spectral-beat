import ActionTypes from '../actions/actionTypes';

const { SET_CANVAS_COLOR } = ActionTypes;

interface ICanvasState {
	currentColor: string
}

const initialState: ICanvasState = {
	currentColor: 'black',
};

const reducer = (state: ICanvasState = initialState, action: any = {}) => {
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

export default reducer;