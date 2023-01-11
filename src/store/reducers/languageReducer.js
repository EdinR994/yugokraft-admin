import { SET_LANGUAGE } from '../actionTypes/actionTypes';

const initialState = {
	language: 'de',
};

const languageReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_LANGUAGE:
			return { ...state, language: action.payload };

		default:
			return state;
	}
};

export default languageReducer;
