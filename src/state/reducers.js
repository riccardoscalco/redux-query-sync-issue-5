import actionTypes from './action-types';

export const focus = (state = 1, action) => {
	switch (action.type) {
		case actionTypes.INIT:
			return state;
		case actionTypes.SET_FOCUS:
			return action.value || state;
		default:
			return state;
	}
};
