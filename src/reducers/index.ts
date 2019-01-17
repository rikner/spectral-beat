import { combineReducers } from 'redux';
import canvas from './canvas';
import onsetDetection from './onset';
import settings from './settings';

export default combineReducers({
	canvas,
	onsetDetection,
	settings,
});
