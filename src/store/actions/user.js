import axios from 'axios';
import { BASE_URL } from '../../constants/mainConstants';
import {
	FINISH_LOADING,
	PASSWORD_RESETED,
	PASSWORD_RESET_ERROR,
	SET_API_REQUEST_ERROR,
	SET_DAYS,
	SET_USER_INFO,
} from '../actionTypes/actionTypes';

/**
 * @param {boolean} bool
 * @return {object} redux action
 * @desc function for password resetting
 */
export const setPasswordReseted = (bool) => ({ type: PASSWORD_RESETED, payload: bool });

/**
 * @param {object}  err
 * @return {object} redux action
 * @desc function for setting error while password resetting
 */
export const setPasswordResetError = (err) => ({ type: PASSWORD_RESET_ERROR, payload: err });

/**
 * @param {string} userEmail
 * @desc function for request to reset password
 */
export const resetPassword = (userEmail) => async (dispatch) => {
	try {
		const body = {
			email: userEmail,
		};
		const config = {
			headers: {
				'content-type': 'application/json',
			},
		};
		await axios.post(`${BASE_URL}/auth/resetPassword`, body, config);
		dispatch(setPasswordReseted(true));
	} catch (error) {
		dispatch(setPasswordResetError(error));
	}
};

/**
 * @desc function for setting API error
 * @param {string} message
 * @return {object} redux action
 */
export const setErrorMessage = (message) => ({ type: SET_API_REQUEST_ERROR, payload: message });

/**
 * @desc function for sending request to specify the number of days after which users will automatically receive letters
 * @param {string} days
 */
export const setSettingsDays = (days) => async (dispatch) => {
	try {
		const body = {
			renewalPeriod: +days,
		};

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		await axios.patch(`${BASE_URL}/owners/setRenewalPeriod`, body, config);
	} catch (err) {
		const message = err.response ? err.response.data.message : err.message;
		dispatch(setErrorMessage(message));
		dispatch({ type: FINISH_LOADING });
	}
};

/**
 * @desc function for sending request to get the renewal period in days
 */
export const getSettingsDays = () => async (dispatch) => {
	try {
		const { data } = await axios.get(`${BASE_URL}/owners/getRenewalPeriod`);
		dispatch({ type: SET_DAYS, payload: data.days });
	} catch (error) {
		console.warn(error);
	}
};

/**
 * @desc function for setting user info
 * @param {object} userInfo
 * @return {object} redux action
 */
export const setUserInfo = (userInfo) => ({ type: SET_USER_INFO, payload: userInfo });

/**
 *@desc function for request to get info about user
 */
export const handleUserInfo = () => async (dispatch) => {
	try {
		const response = await axios.get(`${BASE_URL}/employers/credentials`);
		dispatch(setUserInfo(response.data));
		localStorage.setItem('USER', JSON.stringify(response.data));
	} catch (error) {
		console.warn(error);
	}
};

/**
 * @desc Setting a password to the new employer
 * @param {string} token - token from link
 * @param {string} password - new password
 * @param {string} confirmPassword - password confirmation
 */
export const handleRegistration = ({ password, confirmPassword }, token) => async (dispatch) => {
	try {
		const body = {
			password,
			repeatedPassword: confirmPassword,
		};

		await axios.patch(`${BASE_URL}/auth/setPassword?token=${token}`, body);
		return true;
	} catch (err) {
		dispatch(setErrorMessage(err.message));
		return false;
	}
};

/**
 * @desc Set password for registered users
 * @param {string} password
 * @param {string} confirmation
 */
export const handleSetPasswordForRegistered = ({ password, confirmation }) => async (dispatch) => {
	try {
		const body = {
			password,
			repeatedPassword: confirmation,
		};

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		await axios.patch(`${BASE_URL}/auth/setPasswordForPersonalAccount`, body, config);
	} catch (error) {
		dispatch(setErrorMessage(error.message));
	}
};

/**
 * @desc Handling sending a message to support.
 * @param {string} email
 * @param {string} message
 */
export const getSupport = ({ email, message }) => async (dispatch) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const body = {
			recipient: '',
			sender: email,
			mailParams: {
				successMessage: 'Successfully sent an email to support',
				failMessage: 'An error occurred while sending an email to support',
				replaceParams: {},
			},
			message,
		};

		await axios.post(`${BASE_URL}/emails/support `, body, config);
	} catch (err) {
		dispatch(setErrorMessage(err.message));
	}
};

/**
 * @desc Handling user logout
 */
export const handleLogoutRequest = async () => {
	try {
		await axios.post(`${BASE_URL}/auth/logout `);
	} catch (error) {
		console.warn(error);
	}
};
