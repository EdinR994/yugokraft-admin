import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uuid } from 'uuidv4';
import i18n from 'i18n-js';
import CalendarPopup from '../../commons/CalendarPopup/CalendarPopup';
import InterviewList from '../../components/InterviewList/InterviewList';
import Preloader from '../../components/Preloader/Preloader';
import SidebarCalendar from '../../components/SidebarCalendar/SidebarCalendar';
import {
	handleCalendarPeriods,
	setCalendarStatus,
	setMaxCalendarError,
	setPeriodsToShow,
	setPopupWithInfo,
} from '../../store/actions/calendars';
import styles from './Calendar.module.scss';
import Popup from '../../commons/Popup/Popup';

/**
 * @return {JSX.Element}
 * @desc UI for Calendar Screen
 */

const Calendar = () => {
	const { popupWithInfoActive, currentUser, activePeriods, periodsLoaded, maxCalendars } = useSelector((state) => state.calendar);
	const [deletedId, setDeletePopupActive] = useState('');
	const dispatch = useDispatch();
	useEffect(() => {
		if (!periodsLoaded) dispatch(handleCalendarPeriods());
	}, [dispatch, periodsLoaded]);
	const handleClose = () => {
		dispatch(setPopupWithInfo());
	};

	const preparedPeriods = activePeriods.map((item) => item).slice(0, 4);

	/**
	 * @param {object} period
	 * @desc Dispatching chosen period to Redux Store
	 */
	const handleCurrentVisiblePeriod = (period) => {
		dispatch(setPeriodsToShow(period));
		dispatch(setCalendarStatus(false));
	};

	/**
	 * @param {string} str
	 * @return {string}
	 * @desc Preparing time string  from API
	 */
	const monthFromStr = (str) => {
		const year = {
			0: 'Jan',
			1: 'Feb',
			2: 'Mar',
			3: 'Apr',
			4: 'May',
			5: 'June',
			6: 'July',
			7: 'Aug',
			8: 'Sep',
			9: 'Oct',
			10: 'Nov',
			11: 'Dec',
		};
		const arr = str.split('-').reverse();
		arr[1] = i18n.t(`calendar.${year[arr[1] - 1]}`);
		return arr.slice(0, 2).join(' ');
	};

	return (
		<div className={styles.page__container}>
			<CalendarPopup visible={popupWithInfoActive} handleClose={handleClose} employer={currentUser} type='info' />
			<Popup visible={maxCalendars} text={maxCalendars} handleClosePopup={() => dispatch(setMaxCalendarError(null))} />
			<SidebarCalendar />
			<div className={styles.page__right__container}>
				<Preloader active={!periodsLoaded} />
				<div className={styles.page__filters}>
					<ul className={styles.filtersList}>
						{preparedPeriods.map((period) => (
							<Fragment key={uuid()}>
								<CalendarPopup
									visible={deletedId === period.id}
									handleClose={() => setDeletePopupActive('')}
									type='delete'
									text={period && `${period.start}-${period.end}`}
									id={period.id}
								/>
								<li
									className={styles.filterButton}
									onClick={() => {
										return handleCurrentVisiblePeriod(period);
									}}
									role='presentation'
								>
									<span className={styles.filterName}>
										{period && `${monthFromStr(period.start)} `}-{` ${monthFromStr(period.end)}`}
									</span>
									<div role='presentation' className={styles.filterDeleteButton} onClick={() => setDeletePopupActive(period.id)} />
								</li>
							</Fragment>
						))}
					</ul>
				</div>
				<InterviewList />
			</div>
		</div>
	);
};

export default Calendar;
