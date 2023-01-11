import {
	MAX_CALENDARS_ERROR,
	SET_ACTIVE_PERIODS,
	SET_CALENDAR_ACTIVE,
	SET_CURRENT_USER,
	SET_DURATION_VALID,
	SET_PERIOD,
	SET_PERIODS_LOADED,
	SET_PERIOD_TO_SHOW,
	SET_PERIOD_VALID,
	SET_POPUP_WITH_INFO,
	SET_TABLE_POSITION,
} from '../actionTypes/actionTypes';

const initialState = {
	isCalendarActive: false,
	popupWithInfoActive: false,
	currentUser: null,
	activePeriods: [],
	periodToShow: null,
	periodsLoaded: false,
	tablePosition: 0,
	deletePopupActive: false,
	act: '',
	period: { start: '', end: '', interviewDuration: '', exemptHolidays: false, preferredTimeList: [] },
	maxCalendars: null,
	periodValid: true,
	durationValid: true,
};

const calendar = (state = initialState, action) => {
	switch (action.type) {
		case SET_PERIOD:
			return { ...state, period: action.payload };

		case SET_CALENDAR_ACTIVE:
			return { ...state, isCalendarActive: action.payload };

		case SET_POPUP_WITH_INFO:
			return { ...state, popupWithInfoActive: !state.popupWithInfoActive };

		case SET_CURRENT_USER:
			return { ...state, currentUser: action.payload };

		case SET_ACTIVE_PERIODS:
			return { ...state, activePeriods: action.payload };

		case SET_PERIOD_TO_SHOW:
			return { ...state, periodToShow: action.payload, tablePosition: 0, act: 'periodChanged' };

		case SET_PERIODS_LOADED:
			return { ...state, periodsLoaded: true };

		case SET_TABLE_POSITION:
			return { ...state, tablePosition: action.payload, act: action.act };

		case MAX_CALENDARS_ERROR:
			return { ...state, maxCalendars: action.payload };

		case SET_PERIOD_VALID:
			return { ...state, periodValid: action.payload };

		case SET_DURATION_VALID:
			return { ...state, durationValid: action.payload };

		default:
			return state;
	}
};

export default calendar;
