import actionTypes from './action-types';

export default {
	init : url =>
		({
			type: actionTypes.INIT
		}),
	setFocus : value =>
		({
			type: actionTypes.SET_FOCUS,
			value
		})
};
