import {mount} from 'riot';
import store from './src/state/store';
import {dispatchInit} from './src/state/dispatchers';
import './src/tags/buttons-bar.tag';

document.addEventListener('DOMContentLoaded', () => {
	mount('buttons-bar', {store});
	dispatchInit(); // comment this in order to see the second issue
});
