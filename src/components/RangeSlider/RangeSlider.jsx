import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { uuid } from 'uuidv4';
import Slider from '@material-ui/core/Slider';
import styles from '../Sidebar/Sidebar.module.scss';
import { SET_IS_AGE_SELECTED, SET_IS_HIRED_SELECTED, SET_IS_INTERVIEWED_SELECTED } from '../../store/actionTypes/actionTypes';
import { setAgeFilter } from '../../store/actions/candidatesFilters';
import { setHiredFilter, setInterviewedFilter } from '../../store/actions/employersList';

const useStyles = makeStyles({
	root: {
		width: `217px`,
	},
	rail: {
		height: `3px`,
		borderRadius: `3px`,
		backgroundColor: '#1e496b',
	},
	track: {
		height: `3px`,
		borderRadius: `3px`,
		backgroundColor: `#f27480`,
	},
	thumb: {
		top: '8px',
		width: '23px',
		height: '23px',
		backgroundColor: '#fff',
		border: '1px solid #a6a6a6',
		boxSizing: 'border-box',
		borderRadius: '20px',
	},
});

/**
 * @desc function for creating slider UI that allows to enter range query
 * @param {object} filtersList
 * @param {function} setFiltersList
 * @param {string} name
 * @returns {JSX.Element}
 */
const RangeSlider = ({ filtersList, setFiltersList, name }) => {
	const classes = useStyles();

	const dispatch = useDispatch();
	const { ageIsSelected, ageRange } = useSelector((state) => state.candidatesFiltersReducer);
	const { interviewedIsSelected, hiredIsSelected, candidatesInterviewedCount, candidatesHiredCount } = useSelector(
		(state) => state.employersListReducer,
	);
	const { age } = useSelector((state) => state.candidatesFiltersReducer.filters);
	const { hired, interviewed } = useSelector((state) => state.employersListReducer.filters);

	/**
	 * @desc function for setting current age filter
	 * @param event
	 * @param newValue
	 */
	const handleAgeChange = (event, newValue) => {
		dispatch(setAgeFilter(newValue));
	};

	/**
	 * @desc function for setting hired candidates filter
	 * @param event
	 * @param newValue
	 */
	const handleInterviewedChange = (event, newValue) => {
		dispatch(setInterviewedFilter(newValue));
	};

	/**
	 * @desc function for setting interviewed candidates filter
	 * @param event
	 * @param newValue
	 */
	const handleHiredChange = (event, newValue) => {
		dispatch(setHiredFilter(newValue));
	};

	/**
	 * @desc function for setting start age for filter
	 * @param event
	 */
	const handleStartAge = (event) => {
		let value = event.target.value.replace(/[^0-9]+/g, '').replace(/(^0(?!$)|[,.-])/g, '');
		if (value !== '') value = +value;
		dispatch(setAgeFilter([+value <= ageRange[1] ? value : ageRange[1], age[1]]));
	};

	/**
	 * @desc function for setting end age for filter
	 * @param event
	 */
	const handleEndAge = (event) => {
		let value = event.target.value.replace(/[^0-9]+/g, '').replace(/(^0(?!$)|[,.-])/g, '');
		if (value !== '') value = +value;
		dispatch(setAgeFilter([age[0], +value <= +ageRange[1] ? value : ageRange[1]]));
	};

	/**
	 * @desc function for setting start position for interviewed candidates filter
	 * @param event
	 */
	const handleStartInterviewed = (event) => {
		let value = event.target.value.replace(/[^0-9]+/g, '').replace(/(^0(?!$)|[,.-])/g, '');
		if (value !== '') value = +value;
		dispatch(setInterviewedFilter([+value <= +candidatesInterviewedCount ? value : +candidatesInterviewedCount, interviewed[1]]));
	};

	/**
	 * @desc function for setting end position for interviewed candidates filter
	 * @param event
	 */
	const handleEndInterviewed = (event) => {
		let value = event.target.value.replace(/[^0-9]+/g, '').replace(/(^0(?!$)|[,.-])/g, '');
		if (value !== '') value = +value;
		dispatch(setInterviewedFilter([interviewed[0], +value <= +candidatesInterviewedCount ? value : +candidatesInterviewedCount]));
	};

	/**
	 * @desc function for setting start position for hired candidates filter
	 * @param event
	 */
	const handleStartHired = (event) => {
		let value = event.target.value.replace(/[^0-9]+/g, '').replace(/(^0(?!$)|[,.-])/g, '');
		if (value !== '') value = +value;
		dispatch(setHiredFilter([+value <= +candidatesHiredCount ? value : +candidatesHiredCount, hired[1]]));
	};

	/**
	 * @desc function for setting end position for hired candidates filter
	 * @param event
	 */
	const handleEndHired = (event) => {
		let value = event.target.value.replace(/[^0-9]+/g, '').replace(/(^0(?!$)|[,.-])/g, '');
		if (value !== '') value = +value;
		dispatch(setHiredFilter([hired[0], +value <= +candidatesHiredCount ? value : +candidatesHiredCount]));
	};

	/**
	 * @desc function for setting current age range for filter
	 */
	const handleAgeFilter = () => {
		let first = age[0];
		let second = age[1];
		const checkedAge = [first, second];
		if (age[0] < ageRange[0]) {
			[first] = ageRange;
			checkedAge[0] = first;
			dispatch(setAgeFilter(checkedAge));
		}
		if (age[1] < ageRange[0]) {
			[, second] = ageRange;
			checkedAge[1] = second;
			dispatch(setAgeFilter(checkedAge));
		}

		if (ageIsSelected) {
			setFiltersList(
				filtersList.map((filter) => {
					if (filter.category !== 'Age') {
						return filter;
					}
					return { ...filter, filter: checkedAge.join('-'), from: checkedAge[0], to: checkedAge[1] };
				}),
			);
			return;
		}
		setFiltersList([
			...filtersList,
			{
				id: uuid(),
				category: 'Age',
				filter: checkedAge.join('-'),
				from: checkedAge[0],
				to: checkedAge[1],
				type: 'range',
			},
		]);
		dispatch({ type: SET_IS_AGE_SELECTED });
	};

	/**
	 * @desc function for setting interviewed candidates range for filter
	 */
	const handleInterviewedFilter = () => {
		if (interviewedIsSelected) {
			setFiltersList(
				filtersList.map((filter) => {
					if (filter.category !== 'Interviewed candidates') {
						return filter;
					}
					return { ...filter, filter: `${+interviewed[0]}-${+interviewed[1]}`, from: +interviewed[0], to: +interviewed[1] };
				}),
			);
			return;
		}
		setFiltersList([
			...filtersList,
			{
				id: uuid(),
				category: 'Interviewed candidates',
				filter: `${+interviewed[0]}-${+interviewed[1]}`,
				from: +interviewed[0],
				to: +interviewed[1],
				type: 'range',
			},
		]);
		dispatch({ type: SET_IS_INTERVIEWED_SELECTED });
	};

	/**
	 * @desc function for setting hired candidates range for filter
	 */
	const handleHiredFilter = () => {
		if (hiredIsSelected) {
			setFiltersList(
				filtersList.map((filter) => {
					if (filter.category !== 'Hired candidates') {
						return filter;
					}
					return { ...filter, filter: `${+hired[0]}-${+hired[1]}`, from: +hired[0], to: +hired[1] };
				}),
			);
			return;
		}
		setFiltersList([
			...filtersList,
			{
				id: uuid(),
				category: 'Hired candidates',
				filter: `${+hired[0]}-${+hired[1]}`,
				from: +hired[0],
				to: +hired[1],
				type: 'range',
			},
		]);
		dispatch({ type: SET_IS_HIRED_SELECTED });
	};

	switch (name) {
		case 'Interviewed candidates':
			return (
				<>
					<div className={styles.filterField}>
						<input type='text' className={styles.ageField} value={interviewed[0]} onChange={handleStartInterviewed} />
						<span className={styles.ageFieldsDivider} />
						<input type='text' className={styles.ageField} value={interviewed[1]} onChange={handleEndInterviewed} />
						<button type='button' className={styles.ageConfirmButton} onClick={handleInterviewedFilter}>
							OK
						</button>
					</div>
					<Slider
						classes={{
							root: classes.root,
							thumb: classes.thumb,
							track: classes.track,
							rail: classes.rail,
						}}
						min={0}
						max={+candidatesInterviewedCount}
						value={interviewed}
						onChange={handleInterviewedChange}
					/>
				</>
			);
		case 'Hired candidates':
			return (
				<>
					<div className={styles.filterField}>
						<input type='text' className={styles.ageField} value={hired[0]} onChange={handleStartHired} />
						<span className={styles.ageFieldsDivider} />
						<input type='text' className={styles.ageField} value={hired[1]} onChange={handleEndHired} />
						<button type='button' className={styles.ageConfirmButton} onClick={handleHiredFilter}>
							OK
						</button>
					</div>
					<Slider
						classes={{
							root: classes.root,
							thumb: classes.thumb,
							track: classes.track,
							rail: classes.rail,
						}}
						min={0}
						max={+candidatesHiredCount}
						value={hired}
						onChange={handleHiredChange}
					/>
				</>
			);
		default:
			return (
				<>
					<div className={styles.filterField}>
						<input type='text' className={styles.ageField} value={age[0]} onChange={handleStartAge} />
						<span className={styles.ageFieldsDivider} />
						<input type='text' className={styles.ageField} value={age[1]} onChange={handleEndAge} />
						<button type='button' className={styles.ageConfirmButton} onClick={handleAgeFilter}>
							OK
						</button>
					</div>
					<Slider
						classes={{
							root: classes.root,
							thumb: classes.thumb,
							track: classes.track,
							rail: classes.rail,
						}}
						min={ageRange[0]}
						max={ageRange[1]}
						value={age}
						onChange={handleAgeChange}
					/>
				</>
			);
	}
};
export default RangeSlider;
