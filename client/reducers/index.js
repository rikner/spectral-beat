import { combineReducers } from 'redux';
import settings from './settings';
import canvas from './canvas';

export default combineReducers({
    settings,
    canvas,
});
