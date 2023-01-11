import {
	LOGIN_USER,
	ACTIVATE_LOADER,
	CANDIDATES_PAGE,
	DEACTIVATE_LOADER,
	GET_ALL_CANDIDATES,
	PDF_REF,
	TOGGLE_MODAL,
	TOKEN,
	TOTAL_ROWS,
	USER_ID,
} from '../actionTypes/actionTypes';

const initialState = {
	loaderIsActive: false,
	isLogin: false,
	token: null,
	id: null,
	role: null,

	candidates: [],
	candidatesPage: 1,
	candidatesRows: 0,
	totalRows: 0,
	modalIsOpen: false,
	pdfRef: null,
};

const mainReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOGIN_USER:
			return { ...state, isLogin: !state.isLogin };
		case ACTIVATE_LOADER:
			return { ...state, loaderIsActive: true };
		case DEACTIVATE_LOADER:
			return { ...state, loaderIsActive: false };
		case TOKEN:
			return { ...state, token: action.payload };
		case USER_ID:
			return { ...state, id: action.payload };

		case GET_ALL_CANDIDATES:
			return { ...state, candidates: action.payload };
		case CANDIDATES_PAGE:
			return {
				...state,
				candidatesPage: action.payload.page + 1,
				candidatesRows: action.payload.first,
			};
		case TOTAL_ROWS:
			return { ...state, totalRows: action.payload };
		case TOGGLE_MODAL:
			return { ...state, modalIsOpen: action.payload };
		case PDF_REF:
			return { ...state, pdfRef: action.payload };

		default:
			return state;
	}
};

export default mainReducer;
