import {
	SET_PENDING_CANDIDATES,
	SET_TOTAL_PENDING_CANDIDATES,
	SET_ARE_PENDING_LOADED,
	SET_PENDING_REQUEST_BODY,
	SET_SELECTED_PENDING_CANDIDATE,
	SET_PENDING_CANDIDATES_PAGE,
	TOGGLE_ALL_PENDING_SELECTED,
	DESELECT_ALL_PENDING,
	SET_WITH_REQUEST_DOCS_PENDING_CANDIDATES,
	SET_WITH_PENDING_REQUESTED_DOCS,
} from '../actionTypes/actionTypes';

const initialState = {
	areLoaded: true,
	pendingCandidates: null,
	totalPendingCandidates: null,
	pendingRequestBody: {
		degree: [],
		showWithRequestedDocuments: false,
		detailed: false,
		experience: [],
		languages: [],
		skills: [],
		jobDetails: [],
		age: {
			from: 0,
			to: 100,
		},
		country: [],
		status: [0],
		page: 0,
		size: 10,
	},
	selectedPendingCandidates: [],
	withRequestDocsPendingCandidates: 0,
	allPendingSelected: false,
	pendingCandidatesPage: 0,
	withPendingDocsRequest: false,
};

const pendingCandidatesReducer = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case SET_PENDING_CANDIDATES:
			return {
				...state,
				pendingCandidates: payload,
				areLoaded: true,
			};
		case SET_TOTAL_PENDING_CANDIDATES:
			return {
				...state,
				totalPendingCandidates: payload,
			};
		case SET_ARE_PENDING_LOADED:
			return {
				...state,
				areLoaded: false,
			};
		case SET_PENDING_REQUEST_BODY:
			return {
				...state,
				pendingRequestBody: payload,
			};
		case SET_SELECTED_PENDING_CANDIDATE:
			return {
				...state,
				selectedPendingCandidates: payload,
			};
		case SET_PENDING_CANDIDATES_PAGE:
			return {
				...state,
				pendingCandidatesPage: payload,
			};
		case TOGGLE_ALL_PENDING_SELECTED:
			return {
				...state,
				allPendingSelected: action.payload,
			};
		case DESELECT_ALL_PENDING:
			return {
				...state,
				allPendingSelected: false,
				selectedPendingCandidates: [],
			};
		case SET_WITH_REQUEST_DOCS_PENDING_CANDIDATES:
			return { ...state, withRequestDocsPendingCandidates: action.payload };
		case SET_WITH_PENDING_REQUESTED_DOCS:
			return {
				...state,
				withPendingDocsRequest: !state.withPendingDocsRequest,
			};
		default:
			return state;
	}
};

export default pendingCandidatesReducer;
