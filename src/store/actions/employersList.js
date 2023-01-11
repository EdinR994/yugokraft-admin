import axios from 'axios';
import {
	SET_EMPLOYERS_PAGE,
	SET_EMPLOYERS,
	SET_EMPLOYERS_REQUEST_BODY,
	SET_SELECTED_EMPLOYER,
	SET_TOTAL_EMPLOYERS,
	SET_HIRED_FILTER,
	SET_INTERVIEWED_FILTER,
	SET_REGISTRATION_FILTER,
	SET_ARE_EMPLOYERS_LOADED,
	SET_QUERY,
	DESELECT_ALL_EMPLOYERS,
	TOGGLE_SELECT_ALL_EMPLOYERS,
} from '../actionTypes/actionTypes';
import { BASE_URL } from '../../constants/mainConstants';
import { setAreLoaded } from './candidatesFilters';
import { setErrorMessage as setErrorMessageAPI } from './user';

/**
 * @desc function for setting employers
 * @param {object} employers
 * @return {{payload: *, type: string}} redux action
 */
export const setEmployers = (employers) => ({
	type: SET_EMPLOYERS,
	payload: employers,
});

/**
 * @desc function for setting quantity of employers
 * @param {string} total
 * @param {string} candidatesInterviewedCount
 * @param {string} candidatesHiredCount
 * @return {{payload: *, type: string}} redux action
 */
export const setTotalEmployers = ({ total, candidatesInterviewedCount, candidatesHiredCount }) => ({
	type: SET_TOTAL_EMPLOYERS,
	payload: {
		totalEmployers: total,
		candidatesInterviewedCount,
		candidatesHiredCount,
	},
});

/**
 * @desc function for setting request body for API request
 * @param {object} body
 * @return {{payload: *, type: string}} redux action
 */
export const setEmployersRequestBody = (body) => ({
	type: SET_EMPLOYERS_REQUEST_BODY,
	payload: body,
});

/**
 * @desc function for selecting employers
 * @param users
 * @return {{payload: *, type: string}} redux action
 */
export const setSelectedEmployers = (users) => ({
	type: SET_SELECTED_EMPLOYER,
	payload: users,
});

/**
 * @desc function for setting current page on employer page
 * @param {number} page
 * @return {{payload: *, type: string}} redux action
 */
export const setCurrentEmployersPage = (page) => ({
	type: SET_EMPLOYERS_PAGE,
	payload: page,
});

/**
 * @desc function for API request to search employer
 * @param {object} body - request body
 */
export const searchEmployers = (body) => async (dispatch) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const response = await axios.post(`${BASE_URL}/owners/employers/`, body, config);
		dispatch(setEmployers(response.data.data));
		dispatch(setTotalEmployers(response.data));
	} catch (err) {
		dispatch(setAreLoaded(true));
		console.error(err.message);
		dispatch(setErrorMessageAPI('Schlechte Internetverbindung'));
	}
};

/**
 * @desc function for changing status of selected employer
 * @param {object} body of request
 */
export const changeEmployerStatus = async (body) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		await axios.patch(`${BASE_URL}/owners/setEmployerStatus/`, body, config);
	} catch (err) {
		console.error(err.message);
	}
};

/**
 * @desc function for changing hired filter
 * @param {array} range
 * @returns {object} function for changing hired filter
 */
export const setHiredFilter = (range) => ({
	type: SET_HIRED_FILTER,
	payload: range,
});

/**
 * @desc function for changing interviewed filter
 * @param {array} range
 * @returns {object} redux action
 */
export const setInterviewedFilter = (range) => ({
	type: SET_INTERVIEWED_FILTER,
	payload: range,
});

/**
 * @desc set registration date filter
 * @param {string} name
 * @param {object} date
 * @returns {object} redux action
 */
export const setRegistrationFilter = (name, date) => ({
	type: SET_REGISTRATION_FILTER,
	name,
	payload: date,
});

/**
 * @desc function to check if employers are loaded from API
 * @return {{type: string}} redux action
 */
export const setEmployersLoaded = () => ({
	type: SET_ARE_EMPLOYERS_LOADED,
});

/**
 * @desc function for setting search query
 * @param {string} query
 * @return {{payload: *, type: string}} redux action
 */
export const setSearchQuery = (query) => ({
	type: SET_QUERY,
	payload: query,
});

/**
 * @desc function for unselecting all employers
 * @return {{type: string}} redux action
 */
export const setEmployersDeselected = () => ({
	type: DESELECT_ALL_EMPLOYERS,
});

/**
 * @desc function for selecting all employers
 * @param {boolean} payload
 * @returns {{payload: *, type: string}} redux action
 */
export const toggleEmployers = (payload) => ({
	type: TOGGLE_SELECT_ALL_EMPLOYERS,
	payload,
});
