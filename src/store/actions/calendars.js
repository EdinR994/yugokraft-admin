import axios from 'axios';
import i18n from 'i18n-js';
import { BASE_URL } from '../../constants/mainConstants';
import {
	MAX_CALENDARS_ERROR,
	SET_ACTIVE_PERIODS,
	SET_CALENDAR_ACTIVE,
	SET_DURATION_VALID,
	SET_PERIOD,
	SET_PERIOD_TO_SHOW,
	SET_PERIOD_VALID,
	SET_PERIODS_LOADED,
	SET_POPUP_WITH_INFO,
} from '../actionTypes/actionTypes';

/**
 * @param {object} period
 * @return {{payload: *, type: string}}
 * @desc function for creating time period.
 */
export const setPeriod = (period) => ({ type: SET_PERIOD, payload: period });

/**
 * @param {string | null} payload
 * @return {object} redux action
 * @desc function setting message of maximum created calendars
 */
export const setMaxCalendarError = (payload) => ({
	type: MAX_CALENDARS_ERROR,
	payload,
});
/**
 * @param {object} period
 * @desc function for handling calendar period
 */
export const handleCalendarPeriod = (period, handleClose) => async (dispatch) => {
	try {
		const body = {
			start: period.start,
			end: period.end,
			interviewDuration: period.interviewDuration,
			exemptHolidays: period.exemptHolidays,
			preferredTimeList: period.preferredTimeList,
		};

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		await axios.post(`${BASE_URL}/employers/calendars`, body, config);
	} catch (error) {
		const { data, status } = error.response;

		if (status === 400) {
			if (data.message === 'Cant create more than 4 calendars!') {
				dispatch(setMaxCalendarError(i18n.t('calendar-popup.max-calendars')));
			} else {
				dispatch(setMaxCalendarError(data.message));
			}
			handleClose();
		}
	}
};

/**
 * @param {object} periods
 * @return {{payload: *, type: string}} redux action
 * @desc function to set periods to show on UI
 */
export const setPeriods = (periods) => ({
	type: SET_ACTIVE_PERIODS,
	payload: periods,
});

/**
 * @desc function for getting calendar periods from API
 */
export const handleCalendarPeriods = () => async (dispatch) => {
	try {
		const response = await axios.get(`${BASE_URL}/employers/calendars`);
		dispatch(setPeriods(response.data));
		dispatch({ type: SET_PERIODS_LOADED });
	} catch (error) {
		console.warn(error);
	}
};

/**
 * @param {string} id
 * @desc function for deleting time period
 */
export const deletePeriod = (id) => async (dispatch) => {
	try {
		const body = {
			calendarId: id,
		};

		await axios.delete(`${BASE_URL}/employers/deleteCalendar`, { data: body });
		await dispatch(handleCalendarPeriods());
	} catch (error) {
		console.warn(error);
	}
};

/**
 *
 * @desc function to activate/deactivate calendar
 * @param {boolean} payload
 * @return {{payload: *, type: string}} redux action
 */
export const setCalendarStatus = (payload) => ({
	type: SET_CALENDAR_ACTIVE,
	payload,
});

/**
 * @desc function for setting current visible time periods
 * @param {object} periods
 * @return {{payload: *, type: string}} redux action
 */
export const setPeriodsToShow = (periods) => ({
	type: SET_PERIOD_TO_SHOW,
	payload: periods,
});

/**
 * @desc function for validation time period
 * @param {boolean} payload
 * @return {{payload: *, type: string}} redux action
 */
export const setPeriodValid = (payload) => ({
	type: SET_PERIOD_VALID,
	payload,
});

/**
 * @desc function for validation duration of interview
 * @param {boolean} payload
 * @return {{payload: *, type: string}} redux action
 */
export const setDurationValid = (payload) => ({
	type: SET_DURATION_VALID,
	payload,
});

/**
 * @desc function for showing calendar popup
 * @return {object} redux action
 */
export const setPopupWithInfo = () => ({
	type: SET_POPUP_WITH_INFO,
});
