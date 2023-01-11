import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18n from 'i18n-js';
import { useLocation } from 'react-router-dom';
import styles from './Sidebar.module.scss';
import Filter from '../Filter/Filter';
import {
	SET_ONLY_ACTIVE,
	SET_WITH_REQUESTED_DOCS,
	SET_WITH_PENDING_REQUESTED_DOCS,
	SET_WITH_DETAILED_INFO,
} from '../../store/actionTypes/actionTypes';
import routes from '../../routes/routes';

/**
 * @desc Component with filters for searching candidates and employers
 * @param {function} setFiltersList
 * @param {object} filtersList
 * @param {object} filters
 * @param {function} remapFilters
 * @param {object} ownerFiltersList
 * @param {object} ownerFilters
 * @param {function} setOwnerFiltersList
 * @return {JSX.Element}
 */

const Sidebar = ({ setFiltersList, filtersList, filters, remapFilters, ownerFiltersList, ownerFilters, setOwnerFiltersList }) => {
	const location = useLocation();
	const dispatch = useDispatch();
	const { withDocsRequest, withRequestDocsCandidates, withDetailedInfo } = useSelector((state) => state.candidatesFiltersReducer);
	const { withPendingDocsRequest, withRequestDocsPendingCandidates } = useSelector((state) => state.pendingCandidatesReducer);
	const { onlyActive } = useSelector((state) => state.employersListReducer);
	const userType = localStorage.getItem('USER_TYPE');

	/**
	 * @desc function for controlling filters main checkbox
	 * @param {string} type - type of selected filter according to current page
	 */
	const handleChange = (type) => {
		if (type === 'requested') {
			dispatch({ type: SET_WITH_REQUESTED_DOCS });
		} else if (type === 'active') {
			dispatch({ type: SET_ONLY_ACTIVE });
		} else if (type === 'requestedPending') {
			dispatch({ type: SET_WITH_PENDING_REQUESTED_DOCS });
		} else if (type === 'detailedInfo') {
			dispatch({ type: SET_WITH_DETAILED_INFO });
		}
	};

	const setFilters = (list) => {
		if (location.pathname === routes.PENDING_CANDIDATES) {
			const newList = list.filter((filter) => filter.name !== 'Status');
			return newList;
		}
		return list;
	};

	if (location.pathname === routes.EMPLOYERS_LIST) {
		return (
			<aside className={styles.sidebarContainer}>
				<article className={styles.filterContainerDetailed}>
					<div className={styles.filterName}>
						<label htmlFor='only-detailed' className={styles.detailedCheckbox}>
							<input type='checkbox' id='only-detailed' checked={onlyActive} onChange={() => handleChange('active')} />
							<span>{i18n.t('sidebar.only-active')}</span>
						</label>
					</div>
				</article>
				<hr className={styles.divider} />
				{ownerFilters.map((filter) => (
					<Filter key={filter.id} filter={filter} filtersList={ownerFiltersList} setFiltersList={setOwnerFiltersList} />
				))}
			</aside>
		);
	}
	return (
		<aside className={styles.sidebarContainer}>
			<article className={styles.filterContainerDetailed}>
				<div className={styles.filterName}>
					<label htmlFor='only-detailed' className={styles.detailedCheckbox}>
						{location.pathname === routes.CANDIDATE_LIST && userType === 'employer' && (
							<>
								<input type='checkbox' id='only-detailed' checked={withDocsRequest} onChange={() => handleChange('requested')} />
								<span>{`${i18n.t('sidebar.show-candidates')}: ${withRequestDocsCandidates}`}</span>
							</>
						)}
						{location.pathname === routes.PENDING_CANDIDATES && (
							<>
								<input
									type='checkbox'
									id='only-detailed'
									checked={withPendingDocsRequest}
									onChange={() => handleChange('requestedPending')}
								/>
								<span>{`${i18n.t('sidebar.show-candidates')}: ${withRequestDocsPendingCandidates}`}</span>
							</>
						)}
						{location.pathname === routes.CANDIDATE_LIST && userType === 'admin' && (
							<>
								<input type='checkbox' id='only-detailed' checked={withDetailedInfo} onChange={() => handleChange('detailedInfo')} />
								<span>{`${i18n.t('sidebar.show-candidates-detailed-info')}`}</span>
							</>
						)}
					</label>
				</div>
			</article>
			<hr className={styles.divider} />
			{setFilters(filters).map((filter) => (
				<Filter key={filter.id} filter={filter} filtersList={filtersList} setFiltersList={setFiltersList} remapFilters={remapFilters} />
			))}
		</aside>
	);
};

export default Sidebar;
