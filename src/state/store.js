import ReduxQuerySync from '../redux-query-sync'
import {update} from 'riot';
import {applyMiddleware, createStore} from 'redux';
import rootReducer from './root-reducer';
import logger from './logger';
import {getFocus} from './selectors';
import actions from './action-creators';


const store = createStore(
	rootReducer,
	applyMiddleware(logger)
);

ReduxQuerySync({
	store,
	params: {
		f: {
			selector: getFocus,
			action: actions.setFocus,
			stringToValue: string => Number(string),
			valueToString: value => `${value}`,
			defaultValue: undefined,
		},
	},
	initialTruth: 'location',
	replaceState: false,
})

store.subscribe(update);

export default store;
