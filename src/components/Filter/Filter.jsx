import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uuid } from 'uuidv4';
import i18n from 'i18n-js';
import DatePicker from 'react-datepicker';
import styles from './Filter.module.scss';
import RangeSlider from '../RangeSlider/RangeSlider';
import { SET_IS_REGISTRATION_SELECTED } from '../../store/actionTypes/actionTypes';
import { setRegistrationFilter } from '../../store/actions/employersList';

/**
 * @desc function for crating UI of one filter with categories
 * @param {function} remapFilters
 * @param {object} filter
 * @param {object} filtersList
 * @param {function} setFiltersList
 * @return {JSX.element}
 */
const Filter = ({ remapFilters, filter, filtersList, setFiltersList }) => {
	const dispatch = useDispatch();
	const { registrationIsSelected, filters } = useSelector((state) => state.employersListReducer);
	const [openedFilters, setOpenedFilters] = useState([]);
	const userType = localStorage.getItem('USER_TYPE');
	const [preparedFilter, setPreparedFilter] = useState({});

	useEffect(() => {
		if (userType === 'employer' && filter.name === 'Status') {
			const preparedCriteria = filter.criteria.filter((criteria) => criteria.name !== 'Open');
			const newFilter = { ...filter, criteria: preparedCriteria };

			setPreparedFilter(newFilter);
		} else {
			setPreparedFilter(filter);
		}
	}, [filter, userType]);

	const { startDate, endDate } = filters.registrated;

	/**
	 * @desc function for opening filters category
	 * @param {object} event
	 * @param {number} filterId - id of selected filter category
	 */
	const handleOpen = (event, filterId) => {
		const closeFilterCategory = openedFilters.filter((id) => id !== filterId);
		const openFilterCategory = [...openedFilters, filterId];
		if (openedFilters.includes(filterId)) {
			setOpenedFilters(closeFilterCategory);
			event.target.style.transform = 'rotate(0deg)';
		} else {
			setOpenedFilters(openFilterCategory);
			event.target.style.transform = 'rotate(180deg)';
		}
	};

	/**
	 * @desc function for adding filters to Filters List with checkboxes
	 * @param {object} event
	 * @param {string} category - name of filter's category
	 * @param {string} criterion - name of filter
	 * @param {string} key - key for filter in database
	 * @param {number} sourceFilterId - id of filter's category
	 */
	const handleCheck = (event, category, criterion, key, sourceFilterId) => {
		if (event.target.checked) {
			setFiltersList([
				...filtersList,
				{
					id: uuid(),
					category,
					criterion,
					key,
					sourceFilterId,
					type: 'checkbox',
				},
			]);
		} else {
			setFiltersList(
				filtersList.filter((filt) => {
					if (category === filt.category) {
						return filt.criterion !== criterion;
					}
					return true;
				}),
			);
		}
	};

	/**
	 * @desc function for converting date to appropriate format
	 * @param {string} date - date from server
	 * @param {string} reverseDate - param to set result reversed
	 * @return {string} - date in appropriate format
	 */
	const dateToString = (date, reversedDate) => {
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const year = date.getFullYear();
		return reversedDate ? `${day}-${month}-${year}` : `${year}-${month}-${day}`;
	};

	/**
	 * @desc function for setting start date for current range
	 * @param date
	 */
	const setStart = (date) => {
		dispatch(setRegistrationFilter('startDate', date));
	};

	/**
	 * @desc function for setting end date for current range
	 * @param date
	 */
	const setEnd = (date) => {
		dispatch(setRegistrationFilter('endDate', date));
	};

	/**
	 * @desc function for setting current range as a filter
	 */
	const setDate = () => {
		if (!startDate || !endDate) {
			return;
		}
		if (registrationIsSelected) {
			setFiltersList(
				filtersList.map((filt) => {
					if (filt.category !== 'Registration date') {
						return filt;
					}
					return {
						...filt,
						filter: `from ${dateToString(new Date(startDate), 'reversedDate')} to ${dateToString(new Date(endDate), 'reversedDate')}`,
						from: dateToString(new Date(startDate)),
						to: dateToString(new Date(endDate)),
					};
				}),
			);
			return;
		}
		setFiltersList([
			...filtersList,
			{
				id: uuid(),
				category: 'Registration date',
				filter: `from ${dateToString(new Date(startDate), 'reversedDate')} to ${dateToString(new Date(endDate), 'reversedDate')}`,
				from: dateToString(new Date(startDate)),
				to: dateToString(new Date(endDate)),
				type: 'date',
			},
		]);
		dispatch({ type: SET_IS_REGISTRATION_SELECTED });
	};

	if (filter.type === 'range') {
		return (
			<>
				<article className={styles.filterContainer}>
					<div className={styles.filterName}>
						<span className={styles.categoryLabel}>{i18n.t(`sidebar.${filter.name}`)}</span>
						<input type='button' className={styles.dropDownButton} onClick={(event) => handleOpen(event, filter.id)} />
					</div>
					{openedFilters.includes(filter.id) && (
						<div className={styles.filters}>
							<RangeSlider filtersList={filtersList} setFiltersList={setFiltersList} name={filter.name} />
						</div>
					)}
				</article>
				<hr className={styles.divider} />
			</>
		);
	}
	if (filter.type === 'date') {
		return (
			<>
				<article className={styles.filterContainer}>
					<div className={styles.filterName}>
						<span className={styles.categoryLabel}>{i18n.t(`sidebar.${filter.name}`)}</span>
						<input type='button' className={styles.dropDownButton} onClick={(event) => handleOpen(event, filter.id)} />
					</div>
					{openedFilters.includes(filter.id) && (
						<div className={styles.filters}>
							<div className={styles.filterField}>
								<DatePicker
									dateFormat='dd.MM.yyyy'
									className={styles.datesInput}
									selected={startDate}
									maxDate={endDate}
									onChange={setStart}
								/>
								<span className={styles.dateFieldsDivider} />
								<DatePicker
									dateFormat='dd.MM.yyyy'
									className={styles.datesInput}
									selected={endDate}
									minDate={startDate}
									onChange={setEnd}
								/>
								<button type='button' className={styles.ageConfirmButton} onClick={setDate}>
									OK
								</button>
							</div>
						</div>
					)}
				</article>
				<hr className={styles.divider} />
			</>
		);
	}
	return (
		<>
			<article className={styles.filterContainer}>
				<div className={styles.filterName}>
					<span className={styles.categoryLabel}>{i18n.t(`sidebar.${filter.name}`)}</span>
					<input type='button' className={styles.dropDownButton} onClick={(event) => handleOpen(event, filter.id)} />
				</div>
				{openedFilters.includes(filter.id) && (
					<div className={styles.filters}>
						{preparedFilter.criteria.map((criterion) => (
							<div
								className={filter.name !== 'Country' ? styles.filterField : `${styles.filterField} ${styles.filterFieldCountry}`}
								key={uuid()}
							>
								<input
									type='checkbox'
									id={`${criterion.name} ${filter.id}`}
									className={styles.customCheckbox}
									checked={criterion.checked}
									onChange={(event) => {
										handleCheck(event, filter.name, criterion.name, criterion.key, filter.id);
										remapFilters(filter.id, criterion.name, criterion);
									}}
								/>
								<label htmlFor={`${criterion.name} ${filter.id}`}>{i18n.t(`filters-ui.${criterion.name}`)}</label>
							</div>
						))}
					</div>
				)}
			</article>
			<hr className={styles.divider} />
		</>
	);
};

export default Filter;
