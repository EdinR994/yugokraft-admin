import React from 'react';
import i18n from 'i18n-js';
import { useDispatch, useSelector } from 'react-redux';
import { uuid } from 'uuidv4';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './FiltersList.module.scss';
import {
	searchCandidates,
	searchCandidatesOwner,
	setRequestBody,
	setSelectedUsers,
	setCurrentPage,
	setAgeFilter,
} from '../../store/actions/candidatesFilters';
import { searchPendingCandidates, setPendingRequestBody, setCurrentPendingPage } from '../../store/actions/pendingCandidates';
import {
	SET_ARE_LOADED,
	SET_ARE_PENDING_LOADED,
	SET_IS_AGE_SELECTED,
	SET_SHOWN_SELECTED,
	DESELECT_ALL,
	DESELECT_ALL_PENDING,
	SET_ARE_EMPLOYERS_LOADED,
	DESELECT_ALL_EMPLOYERS,
	SET_SELECTED_EMPLOYERS_SHOWN,
	SET_IS_REGISTRATION_SELECTED,
	SET_IS_HIRED_SELECTED,
	SET_IS_INTERVIEWED_SELECTED,
	SET_QUERY,
	USER_TYPE,
} from '../../store/actionTypes/actionTypes';
import routes from '../../routes/routes';
import {
	searchEmployers,
	setEmployersRequestBody,
	setSelectedEmployers,
	setRegistrationFilter,
	setInterviewedFilter,
	setHiredFilter,
	setCurrentEmployersPage,
} from '../../store/actions/employersList';

/**
 * @param {function} remapFilters
 * @param {Array} filtersList
 * @param {function} setFiltersList
 * @param {function} clear
 * @return {JSX.Element}
 * @desc function for creating UI of top bar with active filters
 */

const FiltersList = ({ remapFilters, filtersList, setFiltersList, clear }) => {
	const user = localStorage.getItem(USER_TYPE);
	const dispatch = useDispatch();
	const { selectedShown, withDocsRequest, withDetailedInfo, ageRange } = useSelector((state) => state.candidatesFiltersReducer);
	const candidateQuery = useSelector((state) => state.candidatesFiltersReducer.query);
	const { withPendingDocsRequest } = useSelector((state) => state.pendingCandidatesReducer);
	const { query } = useSelector((state) => state.employersListReducer);
	const { selectedEmployersShown, onlyActive } = useSelector((state) => state.employersListReducer);
	const { candidatesInterviewedCount, candidatesHiredCount } = useSelector((state) => state.employersListReducer);
	const userType = localStorage.getItem('USER_TYPE');
	const location = useLocation();

	/**
	 * @desc removing filter from filters list with 'delete' button
	 * @param {number} id - id of filter in filters list
	 * @param {string} category - filter's category
	 * @param {string} criterion - filter's name
	 * @param {number} sourceFilterId - id of filter's category
	 * @param {string} type
	 */
	const deleteFilter = ({ id, category, criterion, sourceFilterId, type }) => {
		const changedFilters = filtersList.filter((filter) => filter.id !== id);
		setFiltersList(changedFilters);
		if (type === 'checkbox') {
			remapFilters(sourceFilterId, criterion);
		}
		if (category === 'Age') {
			dispatch({ type: SET_IS_AGE_SELECTED });
			dispatch(setAgeFilter(ageRange));
		}
		if (category === 'Registration') {
			dispatch({ type: SET_IS_REGISTRATION_SELECTED });
		}
		if (category === 'Hired') {
			dispatch({ type: SET_IS_HIRED_SELECTED });
		}
		if (category === 'Interviewed') {
			dispatch({ type: SET_IS_INTERVIEWED_SELECTED });
		}
		if (category === 'Registration date') {
			dispatch({ type: SET_IS_REGISTRATION_SELECTED });
			dispatch(setRegistrationFilter('startDate', ''));
			dispatch(setRegistrationFilter('endDate', ''));
		}
		if (category === 'Interviewed candidates') {
			dispatch({ type: SET_IS_INTERVIEWED_SELECTED });
			dispatch(setInterviewedFilter([0, +candidatesInterviewedCount]));
		}
		if (category === 'Hired candidates') {
			dispatch({ type: SET_IS_HIRED_SELECTED });
			dispatch(setHiredFilter([0, +candidatesHiredCount]));
		}
	};

	/**
	 * @desc function for creating request body according to currently selected filters
	 * @param {array} list - currently selected filters
	 * @returns {object} - request body
	 */
	const createRequestBody = (list) => {
		const template = {
			degree: [],
			showWithRequestedDocuments: false,
			detailed: false,
			experience: [],
			languages: [],
			skills: [],
			jobDetails: [],
			age: {
				from: 0,
				to: 100,
			},
			country: [],
			status: [],
			page: 0,
			size: 10,
			nameOrEmail: candidateQuery,
		};
		let req = { ...template };

		list.forEach((element) => {
			switch (element.category) {
				case 'Education':
					req = { ...req, degree: [...req.degree, element.key] };
					break;
				case 'Experience':
					req = { ...req, experience: [...req.experience, element.key] };
					break;
				case 'Languages':
					req = { ...req, languages: [...req.languages, element.key] };
					break;
				case 'Skills':
					req = { ...req, skills: [...req.skills, element.key] };
					break;
				case 'Job details':
					req = { ...req, jobDetails: [...req.jobDetails, element.key] };
					break;
				case 'Country':
					if (element.criterion !== 'EU Citizen' && element.criterion !== 'Non EU Citizen') {
						req = { ...req, country: [...req.country, element.key] };
					} else if (element.criterion === 'EU Citizen') {
						req = { ...req, eu: true, country: [...req.country] };
					} else if (element.criterion === 'Non EU Citizen') {
						req = { ...req, eu: false, country: [...req.country] };
					}
					break;
				case 'Age':
					req = { ...req, age: { from: element.from, to: element.to } };
					break;
				case 'Status':
					req = { ...req, status: [...req.status, element.key] };
					break;
				default:
					break;
			}
		});
		return {
			...req,
			showWithRequestedDocuments: location.pathname === '/pending_candidates' ? withPendingDocsRequest : withDocsRequest,
			detailed: location.pathname === '/candidates_list' && userType === 'admin' ? withDetailedInfo : false,
		};
	};

	/**
	 * @desc function for creating request body for list of employers
	 * @param {array} list - currently selected filters for employers list
	 * @returns {object} - request body
	 */
	const createEmployersBody = (list) => {
		const template = {
			onlyActive: false,
			size: 10,
			page: 0,
		};
		let req = { ...template };
		if (onlyActive) {
			req = { ...req, onlyActive: true };
		}
		list.forEach((element) => {
			switch (element.category) {
				case 'Registration date':
					req = { ...req, registrationDate: { from: element.from, to: element.to } };
					break;
				case 'Interviewed candidates':
					req = { ...req, interviewed: { from: element.from, to: element.to } };
					break;
				case 'Hired candidates':
					req = { ...req, hired: { from: element.from, to: element.to } };
					break;
				default:
					break;
			}
		});
		return req;
	};

	const requestBody = createRequestBody(filtersList);
	const employersBody = createEmployersBody(filtersList);

	/**
	 * @desc function for start searching candidates/employers OR returning to search if there are selected candidates/employers in table
	 */
	const handleClick = () => {
		if (selectedShown) {
			dispatch({ type: SET_SHOWN_SELECTED });
			dispatch(setSelectedUsers([]));
		}
		if (selectedEmployersShown) {
			dispatch({ type: SET_SELECTED_EMPLOYERS_SHOWN });
			dispatch(setSelectedEmployers([]));
		}
		if (location.pathname === '/candidates_list' || location.pathname === '/') {
			if (user === 'employer') {
				dispatch(searchCandidates(requestBody));
			}
			if (user === 'admin') {
				dispatch(searchCandidatesOwner(requestBody));
			}
			dispatch(setRequestBody(requestBody));
			dispatch({ type: SET_ARE_LOADED });
			dispatch({ type: DESELECT_ALL });
			dispatch(setCurrentPage(0));
		} else if (location.pathname === '/pending_candidates') {
			dispatch(searchPendingCandidates(requestBody));
			dispatch({ type: SET_ARE_PENDING_LOADED });
			dispatch(setPendingRequestBody(requestBody));
			dispatch({ type: DESELECT_ALL_PENDING });
			dispatch(setCurrentPendingPage(0));
		} else if (location.pathname === '/employers_list') {
			let newRequestBody = { ...employersBody };
			if (query) {
				newRequestBody = { ...employersBody, nameOrCompany: query };
			}
			dispatch(searchEmployers(newRequestBody));
			dispatch(setEmployersRequestBody(newRequestBody));
			dispatch({ type: SET_ARE_EMPLOYERS_LOADED });
			dispatch({ type: DESELECT_ALL_EMPLOYERS });
			dispatch({ type: SET_QUERY, payload: '' });
			dispatch(setCurrentEmployersPage(0));
		}
	};

	return (
		<section className={styles.filterListSection}>
			<ul className={styles.filtersList}>
				{filtersList.map((filter) => (
					<li key={uuid()} className={styles.filterButton}>
						{filter.type === 'checkbox' ? (
							<span className={styles.filterName}>{`${i18n.t(`sidebar.${filter.category}`)}: ${i18n.t(
								`filters-ui.${filter.criterion}`,
							)}`}</span>
						) : (
							<span className={styles.filterName}>{`${i18n.t(`sidebar.${filter.category}`)}: ${filter.filter}`}</span>
						)}
						<button type='button' aria-label='delete' className={styles.filterDeleteButton} onClick={() => deleteFilter(filter)} />
					</li>
				))}
				{!!filtersList.length && (
					<li role='presentation' className={styles.clearBtn} onClick={clear}>
						<img src={require('../../assets/img/clearBtn.svg')} alt='clear all' className={styles.clearBtnIcon} />
						<span className={styles.clearBtnText}>{i18n.t('candidates-list.clear-all')}</span>
					</li>
				)}
			</ul>
			{location.pathname === '/employers_list' && (
				<button
					type='button'
					className={!selectedEmployersShown ? `${styles.queryButton} ${styles.queryButtonDark}` : styles.backBtn}
					onClick={() => handleClick()}
				>
					{/* {!selectedEmployersShown ? `Search for employers` : `Back to search`} */}
					{!selectedEmployersShown ? i18n.t('employers-list.search') : i18n.t('candidates-list.back-to-search')}
				</button>
			)}
			{location.pathname !== '/' && location.pathname !== '/employers_list' && (
				<button
					type='button'
					className={!selectedShown ? `${styles.queryButton} ${styles.queryButtonDark}` : styles.backBtn}
					onClick={() => handleClick()}
				>
					{!selectedShown ? i18n.t('candidates-list.search-for-candidates') : i18n.t('candidates-list.back-to-search')}
				</button>
			)}
			{location.pathname === '/' && (
				<button type='button' className={styles.queryButton} onClick={() => handleClick()}>
					<NavLink className={styles.queryLink} to={routes.CANDIDATE_LIST}>
						{i18n.t('candidates-list.start-searching')}
					</NavLink>
				</button>
			)}
		</section>
	);
};

export default FiltersList;
