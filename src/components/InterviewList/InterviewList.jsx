import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18n from 'i18n-js';
import { debounce } from 'lodash';
import { uuid } from 'uuidv4';
import { SET_TABLE_POSITION } from '../../store/actionTypes/actionTypes';
import InterviewListUser from '../InterviewListUser/InterviewListUser';
import styles from './InterviewList.module.scss';

/**
 *
 * @return {JSX.Element}
 * @desc function for creating UI of table with time slots for interviews
 */

const InterviewList = () => {
	let { periodToShow } = useSelector((state) => state.calendar);
	const { tablePosition, activePeriods, act } = useSelector((state) => state.calendar);
	const dispatch = useDispatch();
	const currentDate = new Date();
	const week = {
		0: 'Sun',
		1: 'Mon',
		2: 'Tue',
		3: 'Wed',
		4: 'Thu',
		5: 'Fri',
		6: 'Sat',
	};

	const periods = [
		'00:00',
		'01:00',
		'02:00',
		'03:00',
		'04:00',
		'05:00',
		'06:00',
		'07:00',
		'08:00',
		'09:00',
		'10:00',
		'11:00',
		'12:00',
		'13:00',
		'14:00',
		'15:00',
		'16:00',
		'17:00',
		'18:00',
		'19:00',
		'20:00',
		'21:00',
		'22:00',
		'23:00',
		'24:00',
	];

	const [width, setWidth] = useState(window.innerWidth);

	useEffect(() => {
		const handleResize = debounce(() => {
			dispatch({ type: SET_TABLE_POSITION, payload: 0 });
			setWidth(window.innerWidth);
		}, 10);

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	if (periodToShow === null) {
		if (activePeriods.length !== 0) {
			[periodToShow] = activePeriods;
		}
	}

	const GMT = 'GMT+01';
	const msInDay = 1000 * 60 * 60 * 24;
	const currentDayOfWeek = currentDate.getDay();
	const currentMonth = currentDate.getMonth() + 1;
	const currentDay = currentDate.getDate();

	/**
	 * @param dateObject
	 * @return {string}
	 * @desc Make a String from Date Object to show in UI
	 */
	const getFullDate = (dateObject = new Date()) => {
		const date = dateObject.toUTCString().split(', ')[1].split(' ').slice(0, 3).join(' ');
		return date;
	};

	/**
	 * @param res
	 * @param dayInTable
	 * @return {[]}
	 */
	const setInterviews = (res, dayInTable) => {
		const list = [];

		const interviewsInCurrentDay = res.filter((person) => {
			// console.log(getFullDate(new Date(person.date)) === getFullDate(dayInTable));
			return getFullDate(new Date(person.date)) === getFullDate(dayInTable);
		});

		for (let i = 0; i < periods.length; i += 1) {
			const period = periods[i];
			let meetings = interviewsInCurrentDay.filter((item) => {
				return +item.from.slice(0, 2) === +period.slice(0, 2);
			});

			if (meetings.length > 0) {
				meetings = meetings.map((meeting) => {
					const duration = (meeting.to.slice(0, 2) - meeting.from.slice(0, 2)) * 60 + (meeting.to.slice(3, 5) - meeting.from.slice(3, 5));
					return {
						...meeting,
						duration,
						height: duration * 0.83,
						marginTop: meeting.from.slice(3, 5) * 0.83,
					};
				});
				list.push(meetings);
			} else {
				list.push(null);
			}
		}
		// console.log(list);
		return list;
	};

	let startDay = {};
	const startDayInitial = {
		day: week[currentDayOfWeek],
		date: currentDay,
		month: currentMonth,
		ms: currentDate.getTime(),
		interviews: [],
	};

	if (periodToShow) {
		startDay = {
			day: week[new Date(periodToShow.start).getDay()],
			date: new Date(periodToShow.start).getDate(),
			month: new Date(periodToShow.start).getMonth() + 1,
			ms: new Date(periodToShow.start).getTime(),
			interviews: periodToShow ? setInterviews(periodToShow.interviews, new Date(periodToShow.start)) : [],
		};
	}

	let periodLength = periodToShow && (new Date(periodToShow.end).getTime() - new Date(periodToShow.start).getTime()) / msInDay;

	/**
	 *
	 * @param {object} firstDay
	 * @return {[{object}]}
	 * @desc Create an array for mapping Interview Table
	 */
	const getTwoWeeks = (firstDay) => {
		const days = [firstDay];
		if (periodLength % 14 !== 0) {
			periodLength += 13 - (periodLength % 14);
		}
		if (periodLength === 0) periodLength = 13;
		let i = 0;
		const maxDay = periodToShow ? periodLength : 13;
		while (i < maxDay) {
			const nextDate = new Date(days[i].ms + msInDay);

			const nextDay = {
				day: week[nextDate.getDay()],
				date: nextDate.getDate(),
				month: nextDate.getMonth() + 1,
				ms: nextDate.getTime(),
				interviews: periodToShow ? setInterviews(periodToShow.interviews, nextDate) : [],
			};
			days.push(nextDay);
			i += 1;
		}
		return days;
	};

	const preparedDays = periodToShow ? getTwoWeeks(startDay) : getTwoWeeks(startDayInitial);

	/**
	 * @param {object} event
	 * @desc Setting Interview Table Position
	 */
	const handleTableTransform = (event) => {
		const { id } = event.target;
		const table = document.querySelector('#table');
		const tableWidth = table.offsetWidth;
		const delta = width - 410 - 4;
		switch (id) {
			case 'next':
				if (Math.round((Math.abs(tablePosition) + delta) / 100) === Math.round(tableWidth / 100)) break;
				dispatch({ type: SET_TABLE_POSITION, payload: tablePosition - delta, act: 'button' });
				break;
			case 'prev':
				if (Math.abs(tablePosition) <= 10) break;
				dispatch({ type: SET_TABLE_POSITION, payload: tablePosition + delta, act: 'button' });
				break;
			default:
				break;
		}
	};

	const cellWidth = (document.documentElement.clientWidth - 410) / 14;

	return (
		<div className={styles.table__container}>
			<div className={styles.table__times}>
				<div className={`${styles.table__periods} ${styles.table__periods_zone}`}>{GMT}</div>
				{periods.map((item) => (
					<div key={item} className={styles.table__periods}>
						{item}
					</div>
				))}
			</div>
			<div
				className={styles.table}
				id='table'
				style={{ transform: `translate(${tablePosition}px)`, transition: tablePosition === 0 && act === 'periodChanged' && 'none' }}
			>
				<div className={styles.table__header__container}>
					{preparedDays.map((day) => (
						<div key={day.ms} className={styles.table__header} style={{ width: `${cellWidth}px` }}>
							{width >= 1400 ? `${i18n.t(`calendar.${day.day}`)} ${day.date}/${day.month}` : `${day.date}/${day.month}`}
						</div>
					))}
				</div>
				{periods.map((period, idx) => (
					<div key={period} className={styles.table__row}>
						{preparedDays.map((item) => (
							<div key={uuid()} className={styles.table__cells} style={{ width: `${cellWidth}px` }}>
								{item.interviews[idx] &&
									item.interviews[idx].map((person) => <InterviewListUser person={person} cellWidth={cellWidth} key={uuid()} />)}
							</div>
						))}
					</div>
				))}
			</div>
			<div className={styles.table__button__container} style={{ width: `${cellWidth}px`, right: `0px` }}>
				<button type='button' id='prev' className={styles.table__prev} onClick={handleTableTransform}>
					prev
				</button>
				<button type='button' id='next' className={styles.table__next} onClick={handleTableTransform}>
					next
				</button>
			</div>
		</div>
	);
};

export default memo(InterviewList);
