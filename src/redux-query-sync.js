'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createBrowserHistory = require('history/createBrowserHistory');

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Sets up bidirectional synchronisation between a Redux store and window
 * location query parameters.
 *
 * @param {Object} options.store - The redux store object (= an object `{dispatch, getState}`).
 * @param {Object} options.params - The query parameters in the location to keep in sync.
 * @param {function value => action} options.params[].action - The action creator to be invoked with
 *     the parameter value. Should return an action that sets this value in the store.
 * @param {function state => value} options.params[].selector - The function that gets the value
 *     given the state.
 * @param {*} [options.params[].defaultValue] - The value corresponding to absence of the parameter.
 *     You may want this to equal the state's default/initial value. Default: `undefined`.
 * @param {function} [options.params[].valueToString] - The inverse of stringToValue. Specifies how
 *     to cast the value to a string, to be used in the URL. Defaults to javascript's automatic
 *     string conversion.
 * @param {function} [options.params[].stringToValue] - The inverse of valueToString. Specifies how
 *     to parse the parameter's string value to your desired value type. Defaults to the identity
 *     function (i.e. you get the string as it is).
 * @param {string} options.initialTruth - If set, indicates whose values to sync to the other,
 *     initially. Can be either `'location'` or `'store'`. If not set, the first of them that
 *     changes will set the other, which is not recommended. Usually you will want to use
 *     `location`.
 * @param {boolean} [options.replaceState] - If truthy, update location using
 *     history.replaceState instead of history.pushState, to not fill the browser history.
 */
function ReduxQuerySync(_ref) {
    var store = _ref.store,
        params = _ref.params,
        replaceState = _ref.replaceState,
        initialTruth = _ref.initialTruth;
    var dispatch = store.dispatch;


    var history = (0, _createBrowserHistory2.default)();

    var updateLocation = replaceState ? history.replace.bind(history) : history.push.bind(history);

    // A bit of state used to not respond to self-induced location updates.
    var ignoreLocationUpdate = false;

    // Keeps the last seen values for comparing what has changed.
    var lastQueryValues = {};

    function getQueryValues(location) {
        var locationParams = new URL('http://bogus' + location.search).searchParams;
        var queryValues = {};
        Object.keys(params).forEach(function (param) {
            var _params$param = params[param],
                defaultValue = _params$param.defaultValue,
                _params$param$stringT = _params$param.stringToValue,
                stringToValue = _params$param$stringT === undefined ? function (s) {
                return s;
            } : _params$param$stringT;

            var valueString = locationParams.get(param);
            var value = valueString === null ? defaultValue : stringToValue(valueString);
            queryValues[param] = value;
        });
        return queryValues;
    }

    function handleLocationUpdate(location) {
        // Ignore the event if the location update was induced by ourselves.
        if (ignoreLocationUpdate) return;

        var state = store.getState();

        // Read the values of the watched parameters
        var queryValues = getQueryValues(location);

        // For each parameter value that changed, call the corresponding action.
        Object.keys(queryValues).forEach(function (param) {
            var value = queryValues[param];
            if (value !== lastQueryValues[param]) {
                var _params$param2 = params[param],
                    selector = _params$param2.selector,
                    action = _params$param2.action;

                lastQueryValues[param] = value;

                // Dispatch the action to update the state if needed.
                // (except on initialisation, this should always be needed)
                if (selector(state) !== value) {
                    dispatch(action(value));
                }
            }
        });
    }

    function handleStateUpdate() {
        var state = store.getState();
        var location = history.location;

        // Parse the current location's query string.
        var locationParams = new URL('http://bogus' + location.search).searchParams;

        // Replace each configured parameter with its value in the state.
        Object.keys(params).forEach(function (param) {
            var _params$param3 = params[param],
                selector = _params$param3.selector,
                defaultValue = _params$param3.defaultValue,
                _params$param3$valueT = _params$param3.valueToString,
                valueToString = _params$param3$valueT === undefined ? function (v) {
                return '' + v;
            } : _params$param3$valueT;

            var value = selector(state);
            if (value === defaultValue) {
                locationParams.delete(param);
            } else {
                locationParams.set(param, valueToString(value));
            }
            lastQueryValues[param] = value;
        });
        var newLocationSearchString = '?' + locationParams;
        var oldLocationSearchString = location.search || '?';

        // Only update location if anything changed.
        if (newLocationSearchString !== oldLocationSearchString) {
            // Update location (but prevent triggering a state update).
            ignoreLocationUpdate = true;
            updateLocation({ search: newLocationSearchString });
            ignoreLocationUpdate = false;
        }
    }

    // Sync location to store on every location change, and vice versa.
    var unsubscribeFromLocation = history.listen(handleLocationUpdate);
    var unsubscribeFromStore = store.subscribe(handleStateUpdate);

    // Sync location to store now, or vice versa, or neither.
    if (initialTruth === 'location') {
        handleLocationUpdate(history.location);
    } else {
        // Just set the last seen values to later compare what changed.
        lastQueryValues = getQueryValues(history.location);
    }
    if (initialTruth === 'store') {
        handleStateUpdate();
    }

    return function unsubscribe() {
        unsubscribeFromLocation();
        unsubscribeFromStore();
    };
}

/**
 * For convenience, one can set up the synchronisation by passing this enhancer to createStore.
 *
 * @example
 *
 *     const storeEnhancer = ReduxQuerySync.enhancer({params, initialTruth: 'location'})
 *     const store = createStore(reducer, initialState, storeEnhancer)
 *
 * Arguments are equal to those of ReduxQuerySync itself, except that `store` can now be omitted.
 */
ReduxQuerySync.enhancer = function makeStoreEnhancer(config) {
    return function (storeCreator) {
        return function (reducer, initialState, enhancer) {
            // Create the store as usual.
            var store = storeCreator(reducer, initialState, enhancer);

            // Hook up our listeners.
            ReduxQuerySync(_extends({ store: store }, config));

            return store;
        };
    };
};

exports.default = ReduxQuerySync;