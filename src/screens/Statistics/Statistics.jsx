import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uuid } from 'uuidv4';
import DatePicker, { registerLocale } from 'react-datepicker';
import i18n from 'i18n-js';
import 'react-datepicker/dist/react-datepicker.css';
import de from 'date-fns/locale/de';
import en from 'date-fns/locale/en-GB';
import StatisticTable from '../../components/StatisicsTable/StatisticTable';
import StatisticsCategory from '../../components/StatisticsCategory/StatisticsCategory';
import { handleStatisticsAll, handleStatisticsExperience, handleStatisticsSpecialization } from '../../store/actions/statistics';
import styles from './Statistics.module.scss';
import Preloader from '../../components/Preloader/Preloader';
import dateToUrl from '../../Helpers/dateToUrl';

registerLocale('de', de);
registerLocale('en', en);

/**
 * @param history
 * @return {JSX.Element}
 * @desc Statistics UI
 */

const Statistics = ({ history }) => {
	const dispatch = useDispatch();
	const statistics = useSelector((state) => state.statisticsReducer.statisticsAll);
	const { loaderIsActive } = useSelector((state) => state.mainReducer);
	const { language } = useSelector((store) => store.languageReducer);
	const [activeButton, setActiveButton] = useState('All');
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [isInputsValid, setIsInPutsValid] = useState({
		start: true,
		end: true,
	});
	const categoryList = Object.entries(statistics);
	const buttons = ['All', 'Specialization', 'Experience'];

	useEffect(() => {
		const role = localStorage.getItem('USER_TYPE');
		if (role !== 'admin') {
			history.push('/');
		} else {
			switch (activeButton) {
				case 'All':
					dispatch(handleStatisticsAll(startDate, endDate));
					break;
				case 'Specialization':
					dispatch(handleStatisticsSpecialization(startDate, endDate));
					break;
				case 'Experience':
					dispatch(handleStatisticsExperience(startDate, endDate));
					break;
				default:
					break;
			}
		}
	}, [activeButton]);

	const handleSearch = () => {
		if (startDate === null && endDate === null) {
			setIsInPutsValid({ start: false, end: false });
			return;
		}
		if (startDate === null) {
			setIsInPutsValid({ ...isInputsValid, start: false });
			return;
		}
		if (endDate === null) {
			setIsInPutsValid({ ...isInputsValid, end: false });
			return;
		}
		let start;
		let end;
		if (startDate) {
			start = dateToUrl(startDate);
		}
		if (endDate) {
			end = dateToUrl(endDate);
		}
		switch (activeButton) {
			case 'All':
				dispatch(handleStatisticsAll(start, end));
				break;
			case 'Specialization':
				dispatch(handleStatisticsSpecialization(start, end));
				break;
			case 'Experience':
				dispatch(handleStatisticsExperience(start, end));
				break;
			default:
				break;
		}
	};

	const handleStartDate = (date) => {
		if (endDate === null) {
			setStartDate(date);
			return;
		}
		if (date?.getTime() > endDate.getTime()) {
			return;
		}
		setStartDate(date);
	};

	const handleEndDate = (date) => {
		if (startDate === null) {
			setEndDate(date);
			return;
		}
		if (date?.getTime() < startDate.getTime()) {
			return;
		}
		setEndDate(date);
	};

	return (
		<div className={styles.statistics}>
			<Preloader active={loaderIsActive} />
			<div className={styles.statistics__header}>
				<h1 className={styles.statistics__heading}>{i18n.t('statistics.statistics')}</h1>
				<div className={styles.statistics__filters_container}>
					<DatePicker
						onInputClick={() => setIsInPutsValid({ ...isInputsValid, start: true })}
						locale={language}
						dateFormat='dd.MM.yyyy'
						className={
							isInputsValid.start ? styles.statistics__filters : `${styles.statistics__filters} ${styles.statistics__filters_error}`
						}
						selected={startDate}
						onChange={handleStartDate}
					/>
					<div className={styles.statistics__line} />
					<DatePicker
						onInputClick={() => setIsInPutsValid({ ...isInputsValid, end: true })}
						locale={language}
						dateFormat='dd.MM.yyyy'
						// eslint-disable-next-line max-len
						className={isInputsValid.end ? styles.statistics__filters : `${styles.statistics__filters} ${styles.statistics__filters_error}`}
						selected={endDate}
						onChange={handleEndDate}
					/>
					<button
						type='button'
						className={
							endDate === null || startDate === null
								? `${styles.statistics__filters_button} ${styles.statistics__filters_button_disabled}`
								: styles.statistics__filters_button
						}
						onClick={handleSearch}
					>
						{i18n.t('statistics.search')}
					</button>
				</div>
			</div>
			<div className={styles.statistics__buttons}>
				{buttons.map((button) => (
					<button
						type='button'
						id={button}
						key={uuid()}
						className={
							activeButton !== button ? styles.statistics__button : `${styles.statistics__button} ${styles.statistics__button_active}`
						}
						onClick={() => setActiveButton(button)}
					>
						{i18n.t(`statistics.${button}`)}
					</button>
				))}
			</div>
			{activeButton === 'Specialization' && <StatisticTable criterion='Specialization' />}
			{activeButton === 'Experience' && <StatisticTable criterion='Experience' />}
			{activeButton === 'All' && (
				<div className={styles.statistics__container}>
					{categoryList.map((category) => (
						<StatisticsCategory category={category} key={uuid()} />
					))}
				</div>
			)}
		</div>
	);
};

export default Statistics;
