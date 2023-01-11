import axios from 'axios';
import {
	FILTERED_CANDIDATES,
	SET_AGE_FILTER,
	SET_CANDIDATES_PAGE,
	SET_COUNTRIES_FILTERS,
	SET_REQUEST_BODY,
	SET_SELECTED_USER,
	SET_TOTAL_CANDIDATES,
	SET_WITH_REQUESTED_DOCS,
	SET_WITH_DETAILED_INFO,
	SET_ERROR_MESSAGE,
	SET_DOCUMENTS_CATEGORIES,
	SET_CANDIDATE_TRANSLATED_CV,
	SET_WITH_REQUEST_DOCS_CANDIDATES,
	SET_CV_TRANSLATED,
	TOGGLE_SELECTED_ALL,
	SET_ARE_LOADED,
	SET_QUERY_CANDIDATES,
	SET_AGE_RANGE,
} from '../actionTypes/actionTypes';
import { BASE_URL } from '../../constants/mainConstants';
import { setLoaderDisabled } from './mainActions';
import { setErrorMessage as setErrorMessageAPI } from './user';

/**
 * @desc function for apply filtered candidates
 * @param {array} candidates
 * @returns {object} redux action
 */
export const setFilteredCandidates = (candidates) => ({ type: FILTERED_CANDIDATES, payload: candidates });

/**
 * @desc function for changing current page in table
 * @param {number} page
 * @returns {object} redux action
 */
export const setCurrentPage = (page) => ({ type: SET_CANDIDATES_PAGE, payload: page });

/**
 * @desc function for creating request body
 * @param {object} body
 * @returns {object} redux action
 */
export const setRequestBody = (body) => ({ type: SET_REQUEST_BODY, payload: body });

/**
 * @desc function for setting total amount of candidates
 * @param {number} quantity
 * @returns {object} redux action
 */
export const setTotalCandidates = (quantity) => ({ type: SET_TOTAL_CANDIDATES, payload: quantity });

/**
 * @desc function for setting selected users
 * @param {array} users
 * @returns {object} redux action
 */
export const setSelectedUsers = (users) => ({ type: SET_SELECTED_USER, payload: users });

/**
 * @desc function for setting users with documents selected
 * @param {boolean} payload
 * @returns {object} redux action
 */
export const setWithRequestedDocs = (payload) => ({ type: SET_WITH_REQUESTED_DOCS, payload });

/**
 * @desc function for setting users with detailed info
 * @param {boolean} payload
 * @returns {object} redux action
 */
export const setWithDetailedInfo = (payload) => ({ type: SET_WITH_DETAILED_INFO, payload });

/**
 * @desc function for setting countries filters
 * @param {array} countries
 * @returns {object} redux action
 */
export const setCountriesFilters = (countries) => ({ type: SET_COUNTRIES_FILTERS, payload: countries });

/**
 * @desc function for applying error message
 * @param {string} message - error message from request
 * @returns {object} redux action
 */
export const setErrorMessage = (message) => ({ type: SET_ERROR_MESSAGE, payload: message });

/**
 * @desc function for applying with request docs candidates
 * @param {string} quantity - quantity with request docs candidates
 * @returns {object} redux action
 */
export const setWithRequestDocsCandidates = (quantity) => ({ type: SET_WITH_REQUEST_DOCS_CANDIDATES, payload: quantity });

/**
 * @desc function for disabling loader
 * @param {boolean} payload
 * @returns {object} redux action
 */
export const setAreLoaded = (payload) => ({
	type: SET_ARE_LOADED,
	payload,
});

/**
 * @desc request for searching all available candidates
 * @param {object} body
 */
export const searchCandidates = (body) => async (dispatch) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const response = await axios.post(`${BASE_URL}/employers/candidates/`, body, config);
		dispatch(setFilteredCandidates(response.data.data));
		dispatch(setTotalCandidates(response.data.total));
		dispatch(setWithRequestDocsCandidates(response.data.fulfilledRequests));
	} catch (err) {
		dispatch(setAreLoaded(true));
		console.error(err.message);
		dispatch(setErrorMessageAPI('Schlechte Internetverbindung'));
	}
};

/**
 * @desc request for searching all available candidates for Owner
 * @param {object} body
 */
export const searchCandidatesOwner = (body) => async (dispatch) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const response = await axios.post(`${BASE_URL}/owners/candidates/`, body, config);
		dispatch(setFilteredCandidates(response.data.data));
		dispatch(setTotalCandidates(response.data.total));
	} catch (err) {
		dispatch(setAreLoaded(true));
		console.error(err.message);
		dispatch(setErrorMessageAPI('Schlechte Internetverbindung'));
	}
};

/**
 * @desc function for inviting selected candidates for interview
 * @param {object} body of request
 */
export const inviteForInterview = (body) => async (dispatch) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		await axios.post(`${BASE_URL}/employers/inviteForInterview/`, body, config);
	} catch (err) {
		const { message } = err.response.data;
		dispatch(setErrorMessage(message));
		console.error(err.message);
	}
};

/**
 * @desc request for countries list from the server
 * @return {array} list of countries
 */
export const getCountryFilters = async () => {
	try {
		const response = await axios.get(`${BASE_URL}/data/countries`);
		return response.data;
	} catch (err) {
		console.error(err.message);
		return err.message;
	}
};

/**
 * @desc function for setting age filter
 * @param {array} range
 * @returns {object} redux action
 */
export const setAgeFilter = (range) => ({ type: SET_AGE_FILTER, payload: range });

/**
 * @desc function for setting documents categories to redux
 * @param {object} categoriesFromAPI
 * @return {{payload: *, type: string}} redux action
 */
export const setDocumentsCategories = (categoriesFromAPI) => ({ type: SET_DOCUMENTS_CATEGORIES, payload: categoriesFromAPI });

/**
 * @desc function for getting documents categories from API
 */
export const getDocumentsCategories = () => async (dispatch) => {
	try {
		const response = await axios.get(`${BASE_URL}/data/categories`);
		dispatch(setDocumentsCategories(response.data));
	} catch (error) {
		console.warn(error);
	}
};

/**
 * @desc function for downloading candidate's documents by category
 * @param {string} categoryId
 * @param {string} userId
 * @return {Promise<void>}
 */
export const getDocumentsArchiveByCategory = async (categoryId, userId) => {
	try {
		const config = {
			responseType: 'blob',
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		};
		const response = await axios.get(`${BASE_URL}/candidates/documents?category_id=${categoryId}&candidate_id=${userId}`, config);
		const blob = new Blob([response.data], { type: 'application/zip' });
		const url = window.URL.createObjectURL(blob);
		const fileName = response.headers['content-disposition'].split('=')[1];
		const link = document.createElement('a');
		link.setAttribute('download', `${fileName.slice(1, fileName.length - 1)}`);
		link.href = url;
		document.body.appendChild(link);
		link.click();
		link.parentNode.removeChild(link);
	} catch (error) {
		console.warn(error);
	}
};

/**
 * @desc function for downloading all candidate's documents
 * @param {string} userId
 * @return {Promise<boolean>}
 */
export const getAllDocuments = async (userId) => {
	try {
		const config = {
			responseType: 'blob',
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		};
		const response = await axios.get(`${BASE_URL}/candidates/documents/all?candidate_id=${userId}`, config);
		const blob = new Blob([response.data], { type: 'application/zip' });
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		const fileName = response.headers['content-disposition'].split('=')[1];
		link.setAttribute('download', `${fileName.slice(1, fileName.length - 1)}`);
		document.body.appendChild(link);
		link.click();
		link.parentNode.removeChild(link);
		return true;
	} catch (error) {
		console.warn(error);
		return false;
	}
};

/**
 * @desc function for requesting additionall documents from candidate
 * @param {object} request
 * @param {string} id
 */
export const sendDocumentsRequest = (request, id) => async (dispatch) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const body = {
			categoryIdList: request.categoryIdList,
			note: request.note,
		};

		axios.post(`${BASE_URL}/candidates/${id}/documents/request`, body, config);
	} catch (error) {
		console.warn(error);
		dispatch(setLoaderDisabled());
	}
};

/**
 * @desc function for set translated CV for current candidate
 * @param {object} data
 * @returns {object} redux action
 */
export const setCandidateTranslatedCV = (data) => ({
	type: SET_CANDIDATE_TRANSLATED_CV,
	payload: data,
});

/**
 * @desc function for managing CV translation process
 * @param {boolean} payload
 * @return {{payload: *, type: string}} redux action
 */
export const setCVTranslated = (payload) => ({
	type: SET_CV_TRANSLATED,
	payload,
});

/**
 * @desc function for get translated CV for current candidate from back
 * @param {string} id
 * @return {Promise<void>}
 */
export const getCandidateTranslatedCV = (id) => async (dispatch) => {
	try {
		const response = await axios.get(`${BASE_URL}/candidates/${id}/translated`);
		await dispatch(setCandidateTranslatedCV(response.data));
		dispatch(setCVTranslated(true));
	} catch (err) {
		console.warn(err);
	}
};

/**
 * @desc function for selecting all candidates
 * @param {boolean} payload
 * @returns {{payload: *, type: string}} redux action
 */
export const toggleCandidates = (payload) => ({
	type: TOGGLE_SELECTED_ALL,
	payload,
});

/**
 * @desc function for setting search query
 * @param {string} query
 * @return {{payload: *, type: string}} redux action
 */
export const setSearchQueryCandidates = (query) => ({
	type: SET_QUERY_CANDIDATES,
	payload: query,
});

/**
 * @desc function for getting candidates age maximums
 * @returns {function(*): Promise<void>}
 */
export const getAgeRange = () => async (dispatch) => {
	try {
		const response = await axios.get(`${BASE_URL}/candidates/age-range`);
		dispatch({
			type: SET_AGE_RANGE,
			payload: response.data,
		});
	} catch (err) {
		console.warn(err);
	}
};
