import axios from 'axios';
import { BASE_URL } from '../../constants/mainConstants';

import {
	PDF_REF,
	USER_TYPE,
	TOGGLE_MODAL,
	TOKEN,
	USER_ID,
	SET_LANGUAGE,
	ACTIVATE_LOADER,
	DEACTIVATE_LOADER,
} from '../actionTypes/actionTypes';

axios.interceptors.request.use(
	async (request) => {
		const token = await localStorage.getItem(TOKEN);

		if (request.url !== `${BASE_URL}/auth` && request.url !== `${BASE_URL}/auth/login` && request.url !== `${BASE_URL}/auth/setPassword`) {
			request.headers.Authorization = `Bearer ${token}`;
		}

		return request;
	},
	(err) => {
		console.error(err);
	},
);

axios.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		if (error.response.status === 401 || error.response.status === 403) {
			localStorage.removeItem(TOKEN);
			window.location.href = '/';
		}

		// return Error object with Promise
		return Promise.reject(error);
	},
);

/**
 * @param {string} id
 * @return {object} redux action
 * @desc function to writing user token to localStorage
 */
const setToken = (token) => {
	localStorage.setItem(TOKEN, token);

	return { type: TOKEN, payload: token };
};

/**
 * @param {string} id
 * @return {object} redux action
 * @desc function to write user id to localStorage
 */
const setUserId = (id) => {
	localStorage.setItem(USER_ID, id);

	return { type: USER_ID, payload: id };
};

/**
 * @param {string} role
 * @return {object} redux action
 * @desc function to write user role to localStorage
 */
const setUserType = (role) => {
	if (role === 'owner') {
		localStorage.setItem(USER_TYPE, 'admin');
	} else {
		localStorage.setItem(USER_TYPE, role);
	}

	return { type: USER_TYPE, payload: role };
};

/**
 * @param {string} email
 * @param {string} password
 * @desc function for handling user authorization
 */
export const handleLogin = ({ email, password }) => async (dispatch) => {
	try {
		const body = {
			email,
			password,
		};
		const config = {
			header: {
				'content-type': 'application/json',
			},
		};

		const response = await axios.post(`${BASE_URL}/auth/login`, body, config);
		const { token, id, role } = response.data;
		dispatch(setToken(token));
		dispatch(setUserId(id));
		dispatch(setUserType(role));

		return response.data;
	} catch (error) {
		return false;
	}
};

/**
 * @desc function for getting user documents from API
 * @param {string} id
 * @return {Promise<* | void>}
 */
export const getCandidateFiles = (id) => {
	return axios
		.get(`${BASE_URL}/documents?candidateId=${id}`)
		.then(({ data }) => data)
		.catch((err) => console.warn(err));
};

/**
 * @desc function for downloading users documents in excel format
 * @param id
 * @return {Promise<* | void>}
 */

export const getCandidatesExcel = (id) => {
	return axios
		.get(`${BASE_URL}/candidates/excel-all-data-report-${id}`)
		.then(({ data }) => data)
		.catch((err) => console.warn(err));
};

/**
 * @desc function for toggle modal in header
 * @param {boolean} boolean
 * @return {{payload: *, type: string}} redux action
 */
export const setModalIsOpen = (boolean) => ({ type: TOGGLE_MODAL, payload: boolean });

/**
 * @desc function for setting pdf ref
 * @param ref
 * @return {{payload: *, type: string}} redux action
 */
export const setPdfRef = (ref) => ({ type: PDF_REF, payload: ref });

/**
 * @desc function for setting app default language
 * @param language
 * @return {{payload: *, type: string}} redux action
 */
export const setLanguage = (language) => ({
	type: SET_LANGUAGE,
	payload: language,
});

/**
 * @desc function for loader activating
 * @return {object} redux action
 */
export const setLoaderActive = () => ({
	type: ACTIVATE_LOADER,
});

/**
 * @desc function for loader deactivating
 * @return {object} redux action
 */
export const setLoaderDisabled = () => ({
	type: DEACTIVATE_LOADER,
});
