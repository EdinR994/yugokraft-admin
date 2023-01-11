import {
	FILTERED_CANDIDATES,
	SET_IS_AGE_SELECTED,
	SET_ARE_LOADED,
	SET_CANDIDATES_PAGE,
	SET_REQUEST_BODY,
	SET_TOTAL_CANDIDATES,
	SET_SELECTED_USER,
	SET_SHOWN_SELECTED,
	TOGGLE_SELECTED_ALL,
	DESELECT_ALL,
	SET_WITH_REQUESTED_DOCS,
	SET_WITH_DETAILED_INFO,
	SET_COUNTRIES_FILTERS,
	SET_ERROR_MESSAGE,
	SET_AGE_FILTER,
	SET_DOCUMENTS_CATEGORIES,
	SET_CANDIDATE_TRANSLATED_CV,
	SET_WITH_REQUEST_DOCS_CANDIDATES,
	SET_CV_TRANSLATED,
	SET_QUERY_CANDIDATES,
	SET_AGE_RANGE,
} from '../actionTypes/actionTypes';

const initialState = {
	candidatesAreLoaded: true,
	requestBody: {
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
		status: [],
		page: 0,
		size: 10,
	},
	candidatesPage: 0,
	totalCandidates: null,
	filteredCandidates: null,
	ageIsSelected: false,
	selectedUsers: [],
	allAreSelected: false,
	selectedShown: false,
	withDocsRequest: false,
	withDetailedInfo: false,
	countriesFilters: [],
	errorMessage: '',
	filters: {
		age: [0, 100],
	},
	categories: [],
	currentCandidateTranslatedCV: {},
	withRequestDocsCandidates: 0,
	isCVTranslated: false,
	query: '',
	ageRange: [0, 100],
};

const candidatesFiltersReducer = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case FILTERED_CANDIDATES:
			return {
				...state,
				filteredCandidates: payload,
				candidatesAreLoaded: true,
			};
		case SET_IS_AGE_SELECTED:
			return {
				...state,
				ageIsSelected: !state.ageIsSelected,
			};
		case SET_ARE_LOADED:
			return {
				...state,
				candidatesAreLoaded: action.payload,
			};
		case SET_CANDIDATES_PAGE:
			return {
				...state,
				candidatesPage: payload,
			};
		case SET_REQUEST_BODY:
			return {
				...state,
				requestBody: payload,
			};
		case SET_TOTAL_CANDIDATES:
			return {
				...state,
				totalCandidates: payload,
			};
		case SET_SELECTED_USER:
			return {
				...state,
				selectedUsers: payload,
			};
		case SET_SHOWN_SELECTED:
			return {
				...state,
				selectedShown: !state.selectedShown,
			};
		case TOGGLE_SELECTED_ALL:
			return {
				...state,
				allAreSelected: action.payload,
			};
		case DESELECT_ALL:
			return {
				...state,
				allAreSelected: false,
				selectedUsers: [],
			};
		case SET_WITH_REQUESTED_DOCS:
			return {
				...state,
				withDocsRequest: !state.withDocsRequest,
			};
		case SET_WITH_DETAILED_INFO:
			return {
				...state,
				withDetailedInfo: !state.withDetailedInfo,
			};
		case SET_COUNTRIES_FILTERS:
			return {
				...state,
				countriesFilters: payload,
			};
		case SET_ERROR_MESSAGE:
			return {
				...state,
				errorMessage: payload,
			};
		case SET_AGE_FILTER:
			return {
				...state,
				filters: {
					...state.filters,
					age: payload,
				},
			};
		case SET_DOCUMENTS_CATEGORIES:
			return { ...state, categories: action.payload };
		case SET_CANDIDATE_TRANSLATED_CV:
			return { ...state, currentCandidateTranslatedCV: action.payload };
		case SET_WITH_REQUEST_DOCS_CANDIDATES:
			return { ...state, withRequestDocsCandidates: action.payload };
		case SET_CV_TRANSLATED:
			return { ...state, isCVTranslated: action.payload };
		case SET_QUERY_CANDIDATES:
			return { ...state, query: action.payload };
		case SET_AGE_RANGE:
			return {
				...state,
				filters: {
					...state.filters,
					age: [+action.payload.minAge, +action.payload.maxAge],
				},
				ageRange: [+action.payload.minAge, +action.payload.maxAge],
			};
		default:
			return state;
	}
};

export default candidatesFiltersReducer;
