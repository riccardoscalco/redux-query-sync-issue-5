import {compose} from 'redux';
import store from './store';
import action from './action-creators';

export const dispatchInit = compose(
	store.dispatch,
	action.init
);

export const dispatchSetFocus = compose(
	store.dispatch,
	action.setFocus
);
