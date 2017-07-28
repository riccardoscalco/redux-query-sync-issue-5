import {getFocus} from '../state/selectors';
import {dispatchSetFocus} from '../state/dispatchers';

const onFocus = n => state => getFocus(state) === n;
const setFocus = n => e => dispatchSetFocus(n);

export default function (opts) {
	this.oneOnFocus = onFocus(1)(opts.store.getState());
	this.twoOnFocus = onFocus(2)(opts.store.getState());	
	this.threeOnFocus = onFocus(3)(opts.store.getState());


	this.on('update', () => {
		this.oneOnFocus = onFocus(1)(opts.store.getState());
		this.twoOnFocus = onFocus(2)(opts.store.getState());	
		this.threeOnFocus = onFocus(3)(opts.store.getState());
	})

	this.setFocusOne = setFocus(1);
	this.setFocusTwo = setFocus(2);
	this.setFocusThree = setFocus(3);
}
