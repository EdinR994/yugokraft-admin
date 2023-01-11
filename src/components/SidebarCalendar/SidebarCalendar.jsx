import React, { memo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { uuid } from 'uuidv4';
import i18n from 'i18n-js';
import CalendarPopup from '../../commons/CalendarPopup/CalendarPopup';
import { setCalendarStatus, setDurationValid, setPeriod, setPeriodValid } from '../../store/actions/calendars';
import CalendarRange from '../CalendarRange/CalendarRange';
import styles from './SidebarCalendar.module.scss';
import TimePicker from '../TimePicker/TimePicker';
import TimeSelect from '../../commons/TimeSelect/TimeSelect';

/**
 * @return {JSX.Element}
 * @desc UI for Calendars Filters
 */
const SidebarCalendar = () => {
	const dispatch = useDispatch();
	const [periods, setPeriods] = useState([{ from: null, to: null, id: uuid() }]);
	const [duration, setDuration] = useState('15 min');
	const generalPeriod = { start: '', end: '', interviewDuration: '', exemptHolidays: false, preferredTimeList: [] };
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(null);
	const [withWeekends, setWithWithWeekends] = useState(true);
	const [popupActive, setPopupActive] = useState(false);
	const { isCalendarActive, periodToShow } = useSelector((state) => state.calendar);

	const addPeriod = () => {
		if (periods.length === 0 || (periods.length <= 3 && periods[periods.length - 1].from && periods[periods.length - 1].to)) {
			const newPeriods = [...periods];
			const newPeriod = { from: null, to: null, id: uuid() };
			newPeriods.push(newPeriod);
			setPeriods(newPeriods);
		}
	};

	const onInputChangeLast = (date, id) => {
		if (date === null) return;
		dispatch(setPeriodValid(true));
		dispatch(setDurationValid(true));
		const newPeriods = [...periods];
		const current = newPeriods.find((item) => item.id === id);
		current.to = date;
		setPeriods(newPeriods);
	};

	const onInputChangeStart = (date, id) => {
		if (date === null) return;
		dispatch(setPeriodValid(true));
		dispatch(setDurationValid(true));
		const newPeriods = [...periods];
		const current = newPeriods.find((item) => item.id === id);
		if (current.to && current.to.getHours() <= date.getHours()) return;
		current.from = date;
		setPeriods(newPeriods);
	};

	const deleteTimeSelected = (id) => {
		const newPeriods = periods.filter((item) => item.id !== id);
		setPeriods(newPeriods);
	};

	const makeStringDate = (dateObj) => {
		const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
		const day = dateObj.getDate().toString().padStart(2, '0');
		const strDate = `${dateObj.getFullYear()}-${month}-${day}`;
		return strDate;
	};

	const onSubmit = () => {
		if (isCalendarActive) {
			generalPeriod.preferredTimeList = periods.map((item) => {
				if (item.from && item.to) {
					return { from: `${item.from.getHours()}:00`.padStart(5, '0'), to: `${item.to.getHours()}:00`.padStart(5, '0') };
				}
				return {};
			});
			if (!endDate) setEndDate(startDate);
			generalPeriod.interviewDuration = +`${parseInt(duration, 10) * 60}`;
			generalPeriod.start = startDate ? makeStringDate(startDate) : makeStringDate(new Date());
			generalPeriod.end = endDate ? makeStringDate(endDate) : makeStringDate(startDate);
			generalPeriod.exemptHolidays = !withWeekends;
			generalPeriod.interviews = [];
			dispatch(setPeriod(generalPeriod));
			setPopupActive(true);
			return;
		}
		dispatch(setCalendarStatus(true));
	};

	return (
		<div className={styles.sidebar__container}>
			{popupActive && <CalendarPopup visible={popupActive} handleClose={() => setPopupActive(false)} type='invite' />}
			<span className={styles.sidebar__heading}>{i18n.t('calendar.select-date')}</span>
			<CalendarRange
				startDate={startDate}
				endDate={endDate}
				setStartDate={setStartDate}
				setEndDate={setEndDate}
				setPeriods={setPeriods}
				setDuration={setDuration}
			/>
			{isCalendarActive && (
				<div className={styles.sidebar__checkbox}>
					<input
						type='checkbox'
						id='holidays'
						name='holidays'
						className={styles.customCheckbox}
						checked={isCalendarActive ? !withWeekends : periodToShow && periodToShow.exemptHolidays}
						disabled={!isCalendarActive}
						onChange={() => setWithWithWeekends(!withWeekends)}
					/>
					<label htmlFor='holidays' className={styles.fieldLabel}>
						<span>
							{' '}
							{i18n.t('calendar.exempt-holidays')}
							<span className={styles.sidebar__text}>{i18n.t('calendar.sat-sun')}</span>
						</span>
					</label>
				</div>
			)}
			<div className={styles.sidebar__select}>
				<span className={styles.sidebar__heading}>{i18n.t('calendar.select-time')}</span>
				{isCalendarActive && (
					<TimePicker
						onInputChangeLast={onInputChangeLast}
						onInputChangeStart={onInputChangeStart}
						periods={periods}
						deleteTimeSelected={deleteTimeSelected}
					/>
				)}

				{!isCalendarActive &&
					periodToShow &&
					periodToShow.preferredTimeList.map((item) => (
						<div key={uuid()} className={styles.sidebar__selects}>
							<DatePicker
								selected={new Date(periodToShow.start).setHours(item.from.slice(0, 2))}
								className={styles.calendar__input__select}
								showTimeSelect
								showTimeSelectOnly
								timeCaption='Time'
								dateFormat='HH:mm'
								timeFormat='HH:mm'
								disabled={!isCalendarActive}
							/>
							<DatePicker
								className={styles.calendar__input__select}
								selected={new Date(periodToShow.start).setHours(item.to.slice(0, 2))}
								showTimeSelect
								showTimeSelectOnly
								timeCaption='Time'
								dateFormat='HH:mm'
								timeFormat='HH:mm'
								disabled={!isCalendarActive}
							/>
						</div>
					))}
				{isCalendarActive && (
					<div className={styles.sidebar__add_container}>
						<button type='button' onClick={addPeriod} className={styles.sidebar__add} disabled={!isCalendarActive}>
							Add
						</button>
						<span className={styles.sidebar__add_text}>{i18n.t('calendar.add-period')}</span>
					</div>
				)}
			</div>
			<div className={styles.sidebar__duration}>
				<span className={styles.sidebar__heading}>{i18n.t('calendar.select')}</span>
				<TimeSelect setDuration={setDuration} duration={duration} />
			</div>
			{isCalendarActive && (
				<button type='button' className={styles.sidebar__container_button} onClick={onSubmit}>
					{i18n.t('calendar.add-new')}
				</button>
			)}
		</div>
	);
};

export default memo(SidebarCalendar);
