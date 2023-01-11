import axios from 'axios';
import { BASE_URL } from '../../constants/mainConstants';
import {
	ACTIVATE_LOADER,
	DEACTIVATE_LOADER,
	SET_STATISTICS_ALL,
	SET_STATISTICS_EXPERIENCE,
	SET_STATISTICS_SPECIALIZATION,
} from '../actionTypes/actionTypes';

/**
 * @desc function for setting statistics all
 * @param {object} statisticsAll
 * @return {{payload: {object}, type: {string}}} redux action
 */
export const setStatisticsAll = (statisticsAll) => ({ type: SET_STATISTICS_ALL, payload: statisticsAll });

/**
 * @desc function for getting statistics All data from API
 * @param {string} startDate
 * @param {string} endDate
 */
export const handleStatisticsAll = (startDate, endDate) => async (dispatch) => {
	try {
		let body;
		if (!startDate && !endDate) {
			body = {};
		} else {
			body = {
				interval: {
					from: startDate,
					to: endDate,
				},
			};
		}
		dispatch({ type: ACTIVATE_LOADER });
		const URL = `${BASE_URL}/statistics/all`;
		const response = await axios.post(URL, body);
		dispatch(setStatisticsAll(response.data));
		dispatch({ type: DEACTIVATE_LOADER });
	} catch (error) {
		console.warn(error);
		dispatch({ type: DEACTIVATE_LOADER });
	}
};

/**
 * @desc function for getting statistics Specialization data from API
 * @param {string} startDate
 * @param {string} endDate
 */
export const handleStatisticsSpecialization = (startDate, endDate) => async (dispatch) => {
	try {
		let body;
		if (startDate === null && endDate === null) {
			body = {
				key: 'skills',
			};
		} else {
			body = {
				key: 'skills',
				interval: {
					from: startDate,
					to: endDate,
				},
			};
		}
		dispatch({ type: ACTIVATE_LOADER });
		const response = await axios.post(`${BASE_URL}/statistics`, body);
		dispatch({ type: SET_STATISTICS_SPECIALIZATION, payload: response.data });
		dispatch({ type: DEACTIVATE_LOADER });
	} catch (err) {
		console.warn(err);
		dispatch({ type: DEACTIVATE_LOADER });
	}
};

/**
 * @desc function for getting statistics Experience data from API
 * @param {string} startDate
 * @param {string} endDate
 */
export const handleStatisticsExperience = (startDate, endDate) => async (dispatch) => {
	try {
		let body;
		if (startDate === null && endDate === null) {
			body = {
				key: 'experience',
			};
		} else {
			body = {
				key: 'experience',
				interval: {
					from: startDate,
					to: endDate,
				},
			};
		}
		dispatch({ type: ACTIVATE_LOADER });
		const response = await axios.post(`${BASE_URL}/statistics`, body);
		dispatch({ type: SET_STATISTICS_EXPERIENCE, payload: response.data });
		dispatch({ type: DEACTIVATE_LOADER });
	} catch (err) {
		console.warn(err);
		dispatch({ type: DEACTIVATE_LOADER });
	}
};
