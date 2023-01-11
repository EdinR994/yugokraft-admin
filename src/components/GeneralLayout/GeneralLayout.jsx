import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import PrivateRoute from '../../routes/PrivateRoute';
import PublicRoute from '../../routes/PublicRoute';
import routes from '../../routes/routes';
import Calendar from '../../screens/Calendar/Calendar';
import CandidateList from '../../screens/CandidateList/CandidateList';
import Home from '../../screens/Home/Home';
import Login from '../../screens/Login/Login';
import PendingCandidate from '../../screens/PendingCandidates/PendingCandidates';
import PersonalInfo from '../../screens/PersonalInfo/PersonalInfo';
import Registration from '../../screens/Registration/Registration';
import EmployersList from '../../screens/ListOfEmployers/ListOfEmployers';
import Statistics from '../../screens/Statistics/Statistics';
import Support from '../../screens/Support/Support';
import Settings from '../../screens/Settings/Settings';
import Sidebar from '../Sidebar/Sidebar';
import FiltersList from '../FiltersList/FiltersList';
import styles from './GeneralLayout.module.scss';
import filtersFromServer from '../../api/filters';
import ownerFiltersFromServer from '../../api/ownerFilters';
import PasswordRecovery from '../../screens/PasswordRecovery/PasswordRecovery';
import SetPassword from '../../screens/SetPassword/SetPassword';
import { getCountryFilters, getDocumentsCategories, setAgeFilter } from '../../store/actions/candidatesFilters';
import JitsiMeeting from '../../screens/JitsiMeeting/JitsiMeeting';
import {
	SET_IS_AGE_SELECTED,
	SET_IS_HIRED_SELECTED,
	SET_IS_INTERVIEWED_SELECTED,
	SET_IS_REGISTRATION_SELECTED,
} from '../../store/actionTypes/actionTypes';
import { setHiredFilter, setInterviewedFilter, setRegistrationFilter } from '../../store/actions/employersList';

/**
 *
 * @param {object} match
 * @return {JSX.Element}
 * @desc Component for redirection in order to URL
 */

const GeneralLayout = ({ match }) => {
	const { url } = match;
	const forbiddenRoutes = [
		routes.PERSONAL_INFO,
		routes.LOGIN_PAGE,
		routes.SUPPORT,
		routes.STATISTICS,
		routes.SETTINGS,
		routes.PASSWORD_RECOVERY,
		routes.SET_PASSWORD,
		routes.REGISTRATION_PAGE,
		routes.CALENDAR,
		routes.INTERVIEW,
	];
	const token = localStorage.getItem('TOKEN');

	const urlsWithScroll = [routes.CANDIDATE_LIST, routes.PENDING_CANDIDATES, routes.EMPLOYERS_LIST];

	const isVisible = forbiddenRoutes.every((element) => element !== url);

	const dispatch = useDispatch();

	const { registrationIsSelected, interviewedIsSelected, hiredIsSelected } = useSelector((state) => state.employersListReducer);
	const { candidatesInterviewedCount, candidatesHiredCount } = useSelector((state) => state.employersListReducer);
	const { ageIsSelected } = useSelector((state) => state.candidatesFiltersReducer);
	const { categories } = useSelector((state) => state.candidatesFiltersReducer);
	const { ageRange } = useSelector((state) => state.candidatesFiltersReducer);

	const [filtersList, setFiltersList] = useState([]);
	const [ownerFiltersList, setOwnerFiltersList] = useState([]);
	const [filters, setFilters] = useState(filtersFromServer);
	const [ownerFilters, setOwnerFilters] = useState(ownerFiltersFromServer);

	useEffect(() => {
		(async () => {
			const response = await getCountryFilters();
			const newCountries = response.map((country) => ({ name: country.name, key: country.name, selected: false }));
			setFilters(
				filters.map((filter) => {
					if (filter.name !== 'Country') {
						return filter;
					}
					return { ...filter, criteria: [...filter.criteria, ...newCountries] };
				}),
			);
		})();
	}, []);

	useEffect(() => {
		if (!categories.length) dispatch(getDocumentsCategories());
	}, []);

	/**
	 * @desc function for synchronisation checkboxes in sidebar with currently selected filters in filters list
	 * @param {number} id - id of filter's category
	 * @param {string} criterion - filter's name
	 */
	const remapFilters = (id, criterion) => {
		setFilters(
			filters.map((filter) => {
				let newFilter;
				if (filter.id === id && filter.id !== 6) {
					newFilter = filter.criteria.map((crit) => {
						if (crit.name !== criterion) {
							return crit;
						}
						return { ...crit, checked: !crit.checked };
					});
				}
				if (newFilter) {
					return { ...filter, criteria: [...newFilter] };
				}
				return filter;
			}),
		);
	};

	/**
	 * @desc funcion for clearing all selected filters for list of candidates and pending candidates
	 */
	const handleClear = () => {
		setFiltersList([]);
		(async () => {
			const response = await getCountryFilters();
			const newCountries = response.map((country) => ({ name: country.name, key: country.name, selected: false }));
			setFilters(
				filtersFromServer.map((filter) => {
					if (filter.name !== 'Country') {
						return filter;
					}
					return { ...filter, criteria: [...filter.criteria, ...newCountries] };
				}),
			);
		})();
		if (ageIsSelected) {
			dispatch({ type: SET_IS_AGE_SELECTED });
			dispatch(setAgeFilter(ageRange));
		}
	};

	/**
	 * @desc funcion for clearing all selected filters for list of employers
	 */
	const handleOwnerClear = () => {
		setOwnerFiltersList([]);
		setOwnerFilters(ownerFiltersFromServer);
		if (registrationIsSelected) {
			dispatch({ type: SET_IS_REGISTRATION_SELECTED });
			dispatch(setRegistrationFilter('startDate', ''));
			dispatch(setRegistrationFilter('endDate', ''));
		}
		if (hiredIsSelected) {
			dispatch({ type: SET_IS_HIRED_SELECTED });
			dispatch(setHiredFilter([0, +candidatesHiredCount]));
		}
		if (interviewedIsSelected) {
			dispatch({ type: SET_IS_INTERVIEWED_SELECTED });
			dispatch(setInterviewedFilter([0, +candidatesInterviewedCount]));
		}
	};

	return (
		<div className={isVisible ? styles.pageContainer : ''}>
			{isVisible && (
				<div className={styles.sideBarContainer}>
					<Sidebar
						setFiltersList={setFiltersList}
						filters={filters}
						filtersList={filtersList}
						ownerFiltersList={ownerFiltersList}
						setOwnerFiltersList={setOwnerFiltersList}
						remapFilters={remapFilters}
						ownerFilters={ownerFilters}
					/>
				</div>
			)}
			<div className={styles.contentContainer} style={{ overflowX: urlsWithScroll.some((item) => item === url) && 'scroll' }}>
				{isVisible && url !== '/employers_list' && (
					<div className={url !== '/' ? styles.filtersListContainer : styles.filtersListContainerHome}>
						<FiltersList setFiltersList={setFiltersList} filtersList={filtersList} remapFilters={remapFilters} clear={handleClear} />
					</div>
				)}
				{isVisible && url === '/employers_list' && (
					<div className={url !== '/' ? styles.filtersListContainer : styles.filtersListContainerHome}>
						<FiltersList setFiltersList={setOwnerFiltersList} filtersList={ownerFiltersList} clear={handleOwnerClear} />
					</div>
				)}
				<Switch>
					<PublicRoute path={routes.LOGIN_PAGE} exact component={Login} />
					<PublicRoute path={routes.REGISTRATION_PAGE} exact component={Registration} />
					<PublicRoute path={routes.PASSWORD_RECOVERY} exact component={PasswordRecovery} />
					<PublicRoute path={routes.SET_PASSWORD} exact component={SetPassword} />
					<PrivateRoute path={routes.HOME_PAGE} exact component={Home} />
					<PrivateRoute path={routes.CANDIDATE_LIST} exact component={CandidateList} />
					<PrivateRoute path={routes.PENDING_CANDIDATES} exact component={PendingCandidate} />
					<PrivateRoute path={routes.CALENDAR} exact component={Calendar} />
					<PrivateRoute path={routes.SUPPORT} exact component={Support} />
					<PrivateRoute path={routes.PERSONAL_INFO} exact component={PersonalInfo} />
					<PrivateRoute path={routes.EMPLOYERS_LIST} exact component={EmployersList} />
					<PrivateRoute path={routes.SETTINGS} exact component={Settings} />
					<PrivateRoute path={routes.STATISTICS} exact component={Statistics} />
					{token ? (
						<PrivateRoute path={routes.INTERVIEW} exact component={JitsiMeeting} />
					) : (
						<PublicRoute path={routes.INTERVIEW} exact component={JitsiMeeting} />
					)}
					<Route render={() => <Redirect to={{ pathname: '/' }} />} />
				</Switch>
			</div>
		</div>
	);
};

export default GeneralLayout;
