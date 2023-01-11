import {
	SET_IS_INTERVIEWED_SELECTED,
	SET_IS_HIRED_SELECTED,
	SET_ONLY_ACTIVE,
	SET_EMPLOYERS,
	SET_TOTAL_EMPLOYERS,
	SET_EMPLOYERS_REQUEST_BODY,
	SET_ARE_EMPLOYERS_LOADED,
	DESELECT_ALL_EMPLOYERS,
	SET_SELECTED_EMPLOYER,
	SET_SELECTED_EMPLOYERS_SHOWN,
	TOGGLE_SELECT_ALL_EMPLOYERS,
	SET_EMPLOYERS_PAGE,
	SET_IS_REGISTRATION_SELECTED,
	SET_HIRED_FILTER,
	SET_INTERVIEWED_FILTER,
	SET_REGISTRATION_FILTER,
	SET_QUERY,
} from '../actionTypes/actionTypes';

const initialState = {
	employersAreLoaded: true,
	employersRequestBody: {
		onlyActive: false,
		size: 10,
		page: 0,
	},
	employers: null,
	onlyActive: false,
	registrationIsSelected: false,
	interviewedIsSelected: false,
	hiredIsSelected: false,
	allAreSelected: false,
	selectedEmployers: [],
	selectedEmployersShown: false,
	employersPage: 0,
	totalEmployers: null,
	tableSize: 10,
	filters: {
		registrated: {
			startDate: '',
			endDate: '',
		},
		hired: [0, 0],
		interviewed: [0, 0],
	},
	query: '',
	candidatesInterviewedCount: 0,
	candidatesHiredCount: 0,
};

const employersListReducer = (state = initialState, action) => {
	const { type, payload, name } = action;

	switch (type) {
		case SET_EMPLOYERS:
			return {
				...state,
				employers: payload,
				employersAreLoaded: true,
			};
		case SET_EMPLOYERS_REQUEST_BODY:
			return {
				...state,
				employersRequestBody: payload,
			};
		case SET_ARE_EMPLOYERS_LOADED:
			return {
				...state,
				employersAreLoaded: false,
			};
		case TOGGLE_SELECT_ALL_EMPLOYERS:
			return {
				...state,
				allAreSelected: action.payload,
			};
		case DESELECT_ALL_EMPLOYERS:
			return {
				...state,
				allAreSelected: false,
				selectedEmployers: [],
			};
		case SET_TOTAL_EMPLOYERS:
			return {
				...state,
				totalEmployers: payload.totalEmployers,
				candidatesInterviewedCount: payload.candidatesInterviewedCount,
				candidatesHiredCount: payload.candidatesHiredCount,
				filters: {
					...state.filters,
					hired: [
						!state.filters.hired[0] ? 0 : state.filters.hired[0],
						!state.filters.hired[1] ? +payload.candidatesHiredCount : state.filters.hired[1],
					],
					interviewed: [
						!state.filters.interviewed[0] ? 0 : state.filters.interviewed[0],
						!state.filters.interviewed[1] ? +payload.candidatesInterviewedCount : state.filters.interviewed[1],
					],
				},
			};
		case SET_EMPLOYERS_PAGE:
			return {
				...state,
				employersPage: payload,
				employersRequestBody: {
					...state.employersRequestBody,
					page: payload,
				},
			};
		case SET_IS_INTERVIEWED_SELECTED:
			return {
				...state,
				interviewedIsSelected: !state.interviewedIsSelected,
			};
		case SET_IS_REGISTRATION_SELECTED:
			return {
				...state,
				registrationIsSelected: !state.registrationIsSelected,
			};
		case SET_IS_HIRED_SELECTED:
			return {
				...state,
				hiredIsSelected: !state.hiredIsSelected,
			};
		case SET_ONLY_ACTIVE:
			return {
				...state,
				onlyActive: !state.onlyActive,
				employersRequestBody: {
					...state.employersRequestBody,
					onlyActive: !state.onlyActive,
				},
			};
		case SET_SELECTED_EMPLOYER:
			return {
				...state,
				selectedEmployers: payload,
			};
		case SET_SELECTED_EMPLOYERS_SHOWN:
			return {
				...state,
				selectedEmployersShown: !state.selectedEmployersShown,
			};
		case SET_HIRED_FILTER:
			return {
				...state,
				filters: {
					...state.filters,
					hired: payload,
				},
			};
		case SET_INTERVIEWED_FILTER:
			return {
				...state,
				filters: {
					...state.filters,
					interviewed: payload,
				},
			};
		case SET_REGISTRATION_FILTER:
			return {
				...state,
				filters: {
					...state.filters,
					registrated: {
						...state.filters.registrated,
						[name]: payload,
					},
				},
			};
		case SET_QUERY:
			return { ...state, query: action.payload };
		default:
			return state;
	}
};

export default employersListReducer;
