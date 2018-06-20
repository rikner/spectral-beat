import { combineReducers } from 'redux';
import settings from './settings';
import canvas from './canvas';
import onsetDetection from './onset';

export default combineReducers({
    canvas,
    onsetDetection,
    settings,
});
