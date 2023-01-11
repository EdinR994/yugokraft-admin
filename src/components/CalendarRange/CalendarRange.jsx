import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { uuid } from 'uuidv4';
import de from 'date-fns/locale/de';
import en from 'date-fns/locale/en-GB';
import styles from './CalendarRange.module.scss';
import { setCalendarStatus, setPeriodsToShow, setPeriodValid, setDurationValid } from '../../store/actions/calendars';

registerLocale('de', de);
registerLocale('en', en);

/**
 *
 * @param {object} startDate
 * @param {object} endDate
 * @param {function} setEndDate
 * @param {function} setStartDate
 * @param {function} setPeriods
 * @param {function} setDuration
 * @return {JSX.Element}
 * @desc UI for calendar with range inputs
 */

const CalendarRange = ({ startDate, endDate, setEndDate, setStartDate, setPeriods, setDuration }) => {
	const [isUpdate, setIsUpdate] = useState(false);
	const { isCalendarActive, periodToShow } = useSelector((state) => state.calendar);
	const dispatch = useDispatch();
	const { language } = useSelector((store) => store.languageReducer);
	const initialDate = new Date();
	initialDate.setHours(0);

	const maxDate = new Date(new Date().setMonth(new Date().getMonth() + 2));

	const onChange = (dates) => {
		dispatch(setCalendarStatus(true));
		dispatch(setPeriodValid(true));
		dispatch(setDurationValid(true));
		setPeriods([{ from: null, to: null, id: uuid() }]);
		setDuration('15 min');
		dispatch(setPeriodsToShow(null));
		const [start, end] = dates;
		setStartDate(start);
		setEndDate(end);
	};

	const handleStartInput = (date) => {
		if ((date >= initialDate && date <= maxDate && date < endDate) || date === null) {
			setStartDate(date);
			setIsUpdate(!isUpdate);
		}
	};

	const handleEndInput = (date) => {
		if ((date >= initialDate && date <= maxDate) || date === null) {
			setEndDate(date);
			setIsUpdate(!isUpdate);
		} else {
			setEndDate(endDate);
			setIsUpdate(!isUpdate);
		}
	};

	return (
		<>
			<DatePicker
				dateFormat='dd.MM.yyyy'
				calendarClassName={`${styles.calendar} calendar`}
				onChange={onChange}
				startDate={isCalendarActive ? startDate : periodToShow && new Date(periodToShow.start)}
				endDate={isCalendarActive ? endDate : periodToShow && new Date(periodToShow.end)}
				maxDate={maxDate}
				minDate={isCalendarActive ? initialDate : (periodToShow && new Date(periodToShow.start)) || initialDate}
				selected={periodToShow ? new Date(periodToShow.start) : null}
				selectsRange
				inline
				locale={language}
			/>
			<div className={styles.calendar__inputs}>
				<DatePicker
					open={false}
					onChange={handleStartInput}
					dateFormat='dd.MM.yyyy'
					readOnly
					selected={isCalendarActive ? startDate : periodToShow && new Date(periodToShow.start)}
					className={styles.calendar__input}
					disabled={!isCalendarActive}
				/>
				<DatePicker
					open={false}
					onChange={handleEndInput}
					dateFormat='dd.MM.yyyy'
					readOnly
					selected={isCalendarActive ? endDate : periodToShow && new Date(periodToShow.end)}
					className={styles.calendar__input}
					disabled={!isCalendarActive}
				/>
			</div>
		</>
	);
};

export default CalendarRange;
