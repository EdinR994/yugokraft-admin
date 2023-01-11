import React from 'react';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import styles from './TimePicker.module.scss';

/**
 * @desc function for creating filter on Sidebar for choosing interview time range
 * @param {function} onInputChangeLast
 * @param {function} onInputChangeStart
 * @param {function} deleteTimeSelected
 * @param {object} periods
 * @returns {JSX.Element}
 */
const TimePicker = ({ onInputChangeLast, onInputChangeStart, deleteTimeSelected, periods }) => {
	const { isCalendarActive, periodValid } = useSelector((state) => state.calendar);
	return (
		<>
			{periods.map((item) => (
				<div key={item.id} className={styles.sidebar__selects}>
					<DatePicker
						selected={item.from}
						className={
							periodValid === false && item.from === null
								? `${styles.calendar__input__select} ${styles.calendar__input__select_error}`
								: styles.calendar__input__select
						}
						onChange={(date) => onInputChangeStart(date, item.id)}
						onChangeRaw={(e) => e.preventDefault()}
						showTimeSelect
						showTimeSelectOnly
						timeIntervals={60}
						timeCaption='Time'
						dateFormat='HH:mm'
						timeFormat='HH:mm'
						disabled={!isCalendarActive}
						popperPlacement='bottom'
						popperModifiers={{
							flip: {
								behavior: ['bottom'],
							},
							preventOverflow: {
								enabled: false,
							},
							hide: {
								enabled: false,
							},
						}}
					/>
					<DatePicker
						className={
							periodValid === false && item.to === null
								? `${styles.calendar__input__select} ${styles.calendar__input__select_error}`
								: styles.calendar__input__select
						}
						selected={item.to}
						onChange={(date) => onInputChangeLast(date, item.id)}
						onChangeRaw={(e) => e.preventDefault()}
						minTime={(item.from && new Date().setHours(item.from.getHours())) || new Date().setHours(23)}
						maxTime={new Date().setHours(23)}
						showTimeSelect
						showTimeSelectOnly
						timeIntervals={60}
						timeCaption='Time'
						dateFormat='HH:mm'
						timeFormat='HH:mm'
						disabled={!isCalendarActive}
						popperPlacement='bottom'
						popperModifiers={{
							flip: {
								behavior: ['bottom'],
							},
							preventOverflow: {
								enabled: false,
							},
							hide: {
								enabled: false,
							},
						}}
					/>
					<button
						type='button'
						className={styles.sidebar__delete}
						onClick={() => deleteTimeSelected(item.id)}
						disabled={!isCalendarActive}
						aria-label='delete'
					/>
				</div>
			))}
		</>
	);
};

export default TimePicker;
