import axios from 'axios';
import {
	SET_PENDING_CANDIDATES,
	SET_PENDING_CANDIDATES_PAGE,
	SET_PENDING_REQUEST_BODY,
	SET_SELECTED_PENDING_CANDIDATE,
	SET_TOTAL_PENDING_CANDIDATES,
	SET_WITH_REQUEST_DOCS_PENDING_CANDIDATES,
	SET_WITH_PENDING_REQUESTED_DOCS,
	TOGGLE_ALL_PENDING_SELECTED,
} from '../actionTypes/actionTypes';
import { BASE_URL } from '../../constants/mainConstants';
import { setErrorMessage as setErrorMessageAPI } from './user';
import { setAreLoaded } from './candidatesFilters';

/**
 * @desc function for setting pending candidates
 * @param {array} candidates
 * @returns {object} redux action
 */
export const setPendingCandidates = (candidates) => ({ type: SET_PENDING_CANDIDATES, payload: candidates });

/**
 * @desc function for setting pending users with documents selected
 * @param {boolean} payload
 * @returns {object} redux action
 */
export const setWithPendingRequestedDocs = (payload) => ({ type: SET_WITH_PENDING_REQUESTED_DOCS, payload });

/**
 * @desc function for setting total amount of pending candidates
 * @param {number} quantity
 * @returns {object} redux action
 */
export const setTotalPendingCandidates = (quantity) => ({ type: SET_TOTAL_PENDING_CANDIDATES, payload: quantity });

/**
 * @desc function for crating request body for APi
 * @param {object} body
 * @returns {object} redux action
 */
export const setPendingRequestBody = (body) => ({ type: SET_PENDING_REQUEST_BODY, payload: body });

/**
 * @desc function for selecting candidates
 * @param {array} users
 * @returns {object} redux action
 */
export const setSelectedPendingCandidates = (users) => ({ type: SET_SELECTED_PENDING_CANDIDATE, payload: users });

/**
 * @desc function for setting current page in table
 * @param {number} page
 * @returns {object} redux action
 */
export const setCurrentPendingPage = (page) => ({ type: SET_PENDING_CANDIDATES_PAGE, payload: page });

/**
 * @desc function for applying with request docs pending candidates
 * @param {string} quantity - quantity with request docs pending candidates
 * @returns {object} redux action
 */
export const setWithRequestDocsPendingCandidates = (quantity) => ({ type: SET_WITH_REQUEST_DOCS_PENDING_CANDIDATES, payload: quantity });

/**
 * @desc request for searching all pending candidates
 * @param {object} body
 * @returns {object} list of pending candidates
 */
export const searchPendingCandidates = (body) => async (dispatch) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const response = await axios.post(`${BASE_URL}/employers/pending/`, body, config);
		dispatch(setPendingCandidates(response.data.data));
		dispatch(setTotalPendingCandidates(response.data.total));
		dispatch(setWithRequestDocsPendingCandidates(response.data.fulfilledRequests));
	} catch (err) {
		dispatch(setAreLoaded(true));
		console.error(err.message);
		dispatch(setErrorMessageAPI('Schlechte Internetverbindung'));
	}
};

/**
 * @desc function for changing status of selected candidates
 * @param {object} body of request
 */
export const changeCandidateStatus = async (body) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		await axios.patch(`${BASE_URL}/employers/resolveCandidates/`, body, config);
	} catch (err) {
		console.error(err.message);
	}
};

/**
 * @desc function for selecting all pending candidates
 * @param {boolean} payload
 * @returns {{payload: *, type: string}} redux action
 */
export const toggleAllPending = (payload) => ({
	type: TOGGLE_ALL_PENDING_SELECTED,
	payload,
});
