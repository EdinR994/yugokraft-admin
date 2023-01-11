import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18n from 'i18n-js';
import { NavLink } from 'react-router-dom';
import Preloader from '../../components/Preloader/Preloader';
import styles from './CalendarPopup.module.scss';
import {
	deletePeriod,
	handleCalendarPeriod,
	handleCalendarPeriods,
	setCalendarStatus,
	setDurationValid,
	setPeriods,
	setPeriodsToShow,
	setPeriodValid,
} from '../../store/actions/calendars';
import { setLoaderActive, setLoaderDisabled } from '../../store/actions/mainActions';
import DetailedPopup from '../DetailedPopup/DetailedPopup';
import workDuration from '../../Helpers/workDuration';

/**
 * @param {boolean} visible
 * @param {function} handleClose
 * @param {string} type
 * @param {object} employer
 * @param {string} id
 * @return {JSX.Element}
 * @desc UI for Popup
 */
const CalendarPopup = ({ visible, handleClose, type, employer, id }) => {
	const dispatch = useDispatch();
	const popupRef = useRef();
	const [isValid, setIsValid] = useState(true);
	const [detailedIsVisible, setDetailedIsVisible] = useState(false);
	const [toLongInterview, setToLongInterview] = useState(false);
	const { period, periodToShow, activePeriods } = useSelector((state) => state.calendar);
	const { loaderIsActive } = useSelector((state) => state.mainReducer);
	const timeInterval = period.preferredTimeList.length && `${period.preferredTimeList[0].from}-${period.preferredTimeList[0].to}`;
	const startDate = period.start;
	const endDate = period.end;
	if (isValid && type === 'invite') {
		if (
			period.preferredTimeList.some((elem) => elem.from === undefined || elem.to === undefined) ||
			period.preferredTimeList.length === 0
		) {
			dispatch(setPeriodValid(false));
			setIsValid(false);
		}

		if (
			period.preferredTimeList.some((elem) => {
				if (elem.to && elem.from) {
					return (+elem.to.slice(0, 2) - +elem.from.slice(0, 2)) * 3600 < period.interviewDuration;
				}
				return false;
			})
		) {
			setIsValid(false);
			setToLongInterview(true);
			dispatch(setDurationValid(false));
		}
	}

	const handleClickOutsidePopup = (e) => {
		if (!popupRef.current.contains(e.target) && visible) {
			handleClose();
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutsidePopup);
		return () => document.removeEventListener('mousedown', handleClickOutsidePopup);
	});

	const onSubmit = async () => {
		if (type === 'info') {
			return;
		}
		dispatch(setLoaderActive());
		if (type === 'delete') {
			setTimeout(async () => {
				const newActivePeriods = activePeriods.filter((item) => item.id !== id);
				dispatch(setPeriods(newActivePeriods));
				await dispatch(deletePeriod(id));
				dispatch(setPeriodsToShow(null));
				dispatch(setCalendarStatus(false));
				handleClose();
				dispatch(setLoaderDisabled());
			}, 500);
			return;
		}
		dispatch(setPeriods(activePeriods));
		await dispatch(handleCalendarPeriod(period, handleClose));
		await dispatch(handleCalendarPeriods());
		await dispatch(setCalendarStatus(false));
		await dispatch(setPeriodsToShow(null));
		handleClose();
		dispatch(setLoaderDisabled());
	};

	const tokenForJitsi = employer?.data.jitsiLink.split('=')[1];

	return isValid ? (
		<div className={visible ? styles.popup : styles.popup__hidden}>
			<div ref={popupRef}>
				{detailedIsVisible && employer && (
					<DetailedPopup userInfo={employer} detailedIsVisible={detailedIsVisible} setDetailedIsVisible={setDetailedIsVisible} />
				)}
				<div className={styles.popup__container}>
					<Preloader active={loaderIsActive} />
					<h1 className={styles.popup__heading}>
						{type === 'info' ? i18n.t('calendar-popup.candidate-info') : i18n.t('calendar-popup.are-you-sure')}
					</h1>
					{type === 'invite' && (
						<>
							<p className={styles.popup__text}>
								{i18n.t('calendar-popup.selected-period-from')}
								<span className={styles.popup__time}>{startDate}</span>
								{i18n.t('calendar-popup.till')}
								<span className={styles.popup__time}>{endDate}</span>
								{i18n.t('calendar-popup.time-for-candidate')} <span className={styles.popup__time}>{timeInterval}</span>
								{i18n.t('calendar-popup.duration')} <span className={styles.popup__time}>{period.interviewDuration / 60}</span>
								{i18n.t('calendar-popup.min')}
							</p>
							<p className={styles.popup__text}>{i18n.t('calendar-popup.approvement')}</p>
						</>
					)}
					{type === 'delete' && periodToShow && (
						<>
							<p className={styles.popup__text}>{`${i18n.t('calendar-popup.period')} ${periodToShow.start} ${periodToShow.end} ${i18n.t(
								'calendar-popup.clear-period',
							)}?`}</p>
						</>
					)}
					{type === 'info' && employer && (
						<>
							<p>
								<span className={styles.popup__text}>
									{i18n.t('calendar-popup.name')}: {employer.name}
								</span>
								<span className={styles.popup__text}>
									{i18n.t('calendar-popup.age')}: {employer.age} Jahre alt
								</span>
								<span className={styles.popup__text}>
									{i18n.t('calendar-popup.country')}: {employer.country.name}
								</span>
							</p>

							<p>
								<span className={styles.popup__text}>
									{i18n.t('calendar-popup.education')}: {employer.educations.map((edu) => edu.degree).join(', ')}
								</span>
								<span className={styles.popup__text}>
									{i18n.t('calendar-popup.experience')}: {employer.jobs.map((job) => job.specialization).join(', ')}
								</span>
								<span className={styles.popup__text}>
									{i18n.t('calendar-popup.skills')}: {employer.skills.map((skill) => skill.name).join(', ')}
								</span>
								<span className={styles.popup__text}>
									{i18n.t('calendar-popup.work-duration')}: {workDuration(employer.jobs)}
								</span>
								<span className={styles.popup__text}>
									{i18n.t('calendar-popup.work-region')}: {employer.polls[0]?.desiredRegion}
								</span>
								<span className={styles.popup__text}>
									{i18n.t('calendar-popup.languages')}:{' '}
									{employer.languages
										.filter((lang) => lang.language)
										.map((lang) => lang.language)
										.join(', ')}
								</span>
								<span className={styles.popup__text}>
									{i18n.t('calendar-popup.start-work')}: {employer.polls[0]?.whenReadyToWork}
								</span>
							</p>
							<p>
								<span className={styles.popup__text}>
									Interview starts on: {employer.date} at {employer.from}
								</span>
								<NavLink to={`/interview?token=${tokenForJitsi}`} target='blank'>
									Begin interview
								</NavLink>
							</p>
						</>
					)}
					<div className={styles.popup__buttons} style={{ margin: type === 'invite' ? '120px 0 0' : '30px 0 0' }}>
						<button type='button' onClick={handleClose} className={type === 'info' ? styles.popup__hide : styles.popup__cancel}>
							{type === 'info' ? i18n.t('calendar-popup.hide') : i18n.t('calendar-popup.cancel')}
						</button>
						{type === 'invite' && (
							<button type='button' onClick={onSubmit} className={styles.popup__sure}>
								{i18n.t('calendar-popup.yes')}
							</button>
						)}
						{type === 'delete' && (
							<button type='button' onClick={onSubmit} className={styles.popup__sure}>
								{i18n.t('calendar-popup.yes')}
							</button>
						)}
						{type === 'info' && (
							<button type='button' className={styles.popup__sure} onClick={() => setDetailedIsVisible(true)}>
								{i18n.t('calendar-popup.view-cv')}
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	) : (
		<div className={visible ? styles.popup : styles.popup__hidden}>
			<div className={styles.popup__container} ref={popupRef}>
				{!toLongInterview && <div className={styles.popup__error}>Bitte wählen Sie Ihren bevorzugten Interviewzeitraum</div>}
				{toLongInterview && <div className={styles.popup__error}>Interview duration is longer then interview period</div>}
				<button type='button' onClick={handleClose} className={styles.popup__sure} style={{ margin: '0 auto' }}>
					Ja
				</button>
			</div>
		</div>
	);
};

export default CalendarPopup;
