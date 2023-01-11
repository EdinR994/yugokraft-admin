import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import mainReducer from './reducers/mainReducer';
import candidatesFiltersReducer from './reducers/candidatesFiltersReducer';
import statisticsReducer from './reducers/statistics.reducer';
import pendingCandidatesReducer from './reducers/pendingCandidatesReducer';
import employersListReducer from './reducers/employersListReducer';
import languageReducer from './reducers/languageReducer';
import calendar from './reducers/calendar';
import user from './reducers/user';

const appReducer = combineReducers({
	mainReducer,
	candidatesFiltersReducer,
	pendingCandidatesReducer,
	employersListReducer,
	statisticsReducer,
	languageReducer,
	calendar,
	user,
});

const rootReducer = (state, action) => {
	if (action.type === 'LOGOUT') {
		// eslint-disable-next-line no-param-reassign
		state = undefined;
	}
	return appReducer(state, action);
};

export default createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
