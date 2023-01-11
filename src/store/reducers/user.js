import {
	FINISH_LOADING,
	FULL_NAME,
	PASSWORD_RESETED,
	PASSWORD_RESET_ERROR,
	SET_API_REQUEST_ERROR,
	SET_DAYS,
	SET_USER_INFO,
	START_LOADING,
	USER_TYPE,
} from '../actionTypes/actionTypes';

const initialState = {
	passwordReseted: false,
	passwordResetError: false,
	message: null,
	userInfo: null,
	fullName: null,
	days: null,
	isLoaderActive: false,
};

const user = (state = initialState, action) => {
	switch (action.type) {
		case USER_TYPE:
			return { ...state, role: action.payload };

		case PASSWORD_RESETED:
			return { ...state, passwordReseted: action.payload };
		case PASSWORD_RESET_ERROR:
			return { ...state, passwordResetError: action.payload };

		case SET_API_REQUEST_ERROR:
			return { ...state, message: action.payload };

		case SET_USER_INFO:
			return { ...state, userInfo: action.payload };

		case FULL_NAME:
			return { ...state, fullName: action.payload };

		case SET_DAYS:
			return { ...state, days: action.payload, isLoaderActive: false };

		case START_LOADING:
			return { ...state, isLoaderActive: true };

		case FINISH_LOADING:
			return { ...state, isLoaderActive: false };

		default:
			return state;
	}
};

export default user;
