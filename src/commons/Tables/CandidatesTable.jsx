import React, { useState, useEffect } from 'react';
import i18n from 'i18n-js';
import { useSelector, useDispatch } from 'react-redux';
import {
	searchCandidates,
	setRequestBody,
	setCurrentPage,
	setSelectedUsers,
	searchCandidatesOwner,
	toggleCandidates,
	setAreLoaded,
} from '../../store/actions/candidatesFilters';
import styles from './Tables.module.scss';
import DetailedPopup from '../DetailedPopup/DetailedPopup';
import setCurrentRange from '../../Helpers/setCurrentRange';
import Popup from '../Popup/Popup';

/**
 * @desc function for creating UI for table with candidates
 * @returns {JSX.Element}
 */
const Table = () => {
	const dispatch = useDispatch();
	const { filteredCandidates, requestBody, totalCandidates, candidatesPage, selectedUsers, selectedShown, allAreSelected } = useSelector(
		(state) => state.candidatesFiltersReducer,
	);
	const { message } = useSelector((state) => state.user);
	const tableSize = useSelector((state) => state.candidatesFiltersReducer.requestBody.size);
	const [selectedUser, setSelectedUser] = useState({});
	const [isPerPageVisible, setIsPerPageVisible] = useState(false);
	const [isPrevActive, setIsPrevActive] = useState(true);
	const [isNextActive, setIsNextActive] = useState(true);
	const [detailedIsVisible, setDetailedIsVisible] = useState(false);
	const userType = localStorage.getItem('USER_TYPE');
	const candidateQuery = useSelector((state) => state.candidatesFiltersReducer.query);

	const perPageValues = [100, 50, 25, 10];

	useEffect(() => {
		document.onclick = (e) => {
			if (e.target.id !== 'dropdownBtn' && isPerPageVisible) {
				setIsPerPageVisible(!isPerPageVisible);
			}
		};
	});

	useEffect(() => {
		dispatch(setSelectedUsers([]));
	}, [dispatch]);

	useEffect(() => {
		if (selectedUsers.length !== filteredCandidates?.length) {
			dispatch(toggleCandidates(false));
		} else if (filteredCandidates?.length > 0) {
			dispatch(toggleCandidates(true));
		}
	}, [selectedUsers, filteredCandidates, dispatch]);

	/**
	 * @desc pagination
	 * @param {string} direction - direction of page change - "forward" or "backward"
	 */
	const handlePageChange = async (direction) => {
		let newRequestBody;
		switch (direction) {
			case 'f':
				if (
					candidatesPage === Math.floor(totalCandidates / tableSize) ||
					requestBody.page * requestBody.size + requestBody.size >= totalCandidates
				) {
					setIsNextActive(false);
					return;
				}
				newRequestBody = {
					...requestBody,
					page: (requestBody.page += 1),
					nameOrEmail: candidateQuery,
				};
				dispatch(toggleCandidates(false));
				dispatch(setSelectedUsers([]));
				dispatch(setCurrentPage(requestBody.page));
				dispatch(setAreLoaded(false));
				dispatch(setRequestBody(newRequestBody));
				if (userType === 'admin') {
					await dispatch(searchCandidatesOwner(newRequestBody));
				} else {
					await dispatch(searchCandidates(newRequestBody));
				}
				setIsPrevActive(true);
				break;
			case 'b':
				if (candidatesPage === 0) {
					setIsPrevActive(false);
					return;
				}
				dispatch(toggleCandidates(false));
				dispatch(setSelectedUsers([]));
				newRequestBody = {
					...requestBody,
					page: (requestBody.page -= 1),
					nameOrEmail: candidateQuery,
				};
				dispatch(setCurrentPage(requestBody.page));
				dispatch(setAreLoaded(false));
				dispatch(setRequestBody(newRequestBody));
				if (userType === 'admin') {
					await dispatch(searchCandidatesOwner(newRequestBody));
				} else {
					await dispatch(searchCandidates(newRequestBody));
				}
				setIsNextActive(true);
				break;
			default:
				break;
		}
	};

	/**
	 * @desc function for opening rows per page select
	 */
	const openSelect = () => {
		setIsPerPageVisible(!isPerPageVisible);
	};

	/**
	 * @desc function for setting rows per page
	 * @param {number} value - selected number of rows per page
	 */
	const setPerPage = async (value) => {
		setIsPerPageVisible(!isPerPageVisible);
		const newRequestBody = { ...requestBody, size: value, page: 0 };
		dispatch(setAreLoaded(false));
		dispatch(setRequestBody(newRequestBody));
		if (userType === 'admin') {
			await dispatch(searchCandidatesOwner(newRequestBody));
		} else {
			await dispatch(searchCandidates(newRequestBody));
		}
		dispatch(setCurrentPage(0));
		setIsNextActive(true);
	};

	/**
	 * @desc function for selecting/deselecting all candidates with checkbox
	 */
	const toggleAllCandidates = () => {
		if (!allAreSelected) {
			dispatch(setSelectedUsers(filteredCandidates.map((user) => user)));
			dispatch(toggleCandidates(true));
		} else {
			dispatch(setSelectedUsers([]));
			dispatch(toggleCandidates(false));
		}
	};

	/**
	 * @desc function for controlling candidate's selection witch checkboxes
	 * @param {object} user - checked candidate
	 */
	const handleCheck = (user) => {
		if (selectedUsers.some((item) => item.id === user.id)) {
			dispatch(setSelectedUsers(selectedUsers.filter((usr) => usr.id !== user.id)));
		} else {
			dispatch(setSelectedUsers([...selectedUsers, user]));
		}
	};

	/**
	 * @desc function for showing detailed popup for selected candidate
	 * @param {object} user - selected candidate
	 */
	const showInfo = (user) => {
		setSelectedUser(user);
		setDetailedIsVisible(true);
		document.body.style = `overflow: hidden`;
	};

	/**
	 * @desc function for showing status of candidate according to status code
	 * @param {number} code - status code of candidate
	 * @returns {string} - status of candidate
	 */
	const showStatus = (code) => {
		const statusCodes = {
			0: 'Available',
			1: 'Invited',
			2: 'Confirmed',
			3: 'Open',
			4: 'Hired',
			5: 'Rejected',
			6: `Didn't show up`,
		};
		return i18n.t(`candidates-list.${statusCodes[code]}`);
	};

	const handleClosePopup = () => {
		window.location.reload();
	};

	return (
		<>
			{message && <Popup visible text={message} handleClosePopup={handleClosePopup} labelClose='Neu laden' />}
			{selectedUser.id && (
				<DetailedPopup userInfo={selectedUser} detailedIsVisible={detailedIsVisible} setDetailedIsVisible={setDetailedIsVisible} />
			)}
			{filteredCandidates && (
				<table className={styles.table}>
					<thead>
						<tr className={styles.tableHeaderRow}>
							<th className={styles.chckColumn}>
								<label htmlFor='selectAll' className={styles.detailedCheckbox}>
									<input type='checkbox' id='selectAll' onChange={toggleAllCandidates} checked={allAreSelected} />
									<span />
								</label>
							</th>
							<th className={styles.nameColumnHeader}>{i18n.t('candidates-list.name')}</th>
							<th className={styles.countryColumn}>{i18n.t('candidates-list.country')}</th>
							<th className={styles.ageColumn}>{i18n.t('candidates-list.age')}</th>
							<th className={styles.eduColumn}>{i18n.t('candidates-list.education')}</th>
							<th className={styles.langColumn}>{i18n.t('candidates-list.languages')}</th>
							<th className={styles.regionColumn}>{i18n.t('candidates-list.region')}</th>
							<th className={styles.startColumn}>{i18n.t('candidates-list.start')}</th>
							<th className={styles.statusColumn}>{i18n.t('candidates-list.status')}</th>
							<th className={styles.moreInfoColumn}>{i18n.t('candidates-list.more-info')}</th>
						</tr>
					</thead>
					<tbody>
						{filteredCandidates.map((user) => (
							<tr className={styles.tableBodyRow} key={user.id}>
								<td>
									<label htmlFor={user.id} className={styles.detailedCheckbox}>
										{/* eslint-disable-next-line max-len */}
										<input
											type='checkbox'
											id={user.id}
											checked={selectedUsers.some((item) => item.id === user.id)}
											onChange={() => handleCheck(user)}
										/>
										<span />
									</label>
								</td>
								<td className={styles.nameColumn}>
									<div className={styles.nameColumnWrapper}>
										<p className={styles.mainInf}>{`${user.data.candidate.firstName} ${user.data.candidate.lastName}`}</p>
										<p className={styles.secondaryInf}>{user.data.candidate.email}</p>
									</div>
								</td>
								<td>
									<p className={styles.mainInf}>
										{user.data.country.eu ? i18n.t('candidates-list.eu-citizen') : i18n.t('candidates-list.non-eu-citizen')}
									</p>
									<p className={styles.secondaryInf}>{user.data.country.name}</p>
								</td>
								<td>{user.data.candidate.age}</td>
								{/* //displaying only first education in list */}
								<td>{user.data.educations.length ? user.data.educations[0].degree : ''}</td>
								<td>
									<p>
										{user.data.languages
											.filter((lang) => lang.language)
											.map((lang) => lang.language)
											// displaying only first two languages
											.slice(0, 2)
											.join(', ')}
									</p>
								</td>
								{/* //displaying only first poll in the list */}
								<td>{user.data.polls.length ? user.data.polls[0].desiredRegion : ''}</td>
								<td>{user.data.polls.length ? user.data.polls[0].whenReadyToWork.split('-').join(' ') : ''}</td>
								<td>{showStatus(user.data.status)}</td>
								<td className={styles.moreInfoColumn}>
									<input type='button' className={styles.detailedInf} onClick={() => showInfo(user)} />
								</td>
							</tr>
						))}
					</tbody>
					{!selectedShown && (
						<tfoot className={styles.footer}>
							<tr className={styles.footerRow}>
								<td colSpan='7' />
								<td role='presentation' className={styles.pagesSelect}>
									<span>{`${i18n.t('candidates-list.rows-per-page')}: ${tableSize}`}</span>
									<div className={styles.pagesSelectContainer}>
										<input type='button' id='dropdownBtn' className={styles.dropdownBtn} onClick={openSelect} />
										{isPerPageVisible && (
											<div className={styles.perPageSelect}>
												<ul className={styles.perPageList}>
													{perPageValues.map((value) => (
														<li key={value}>
															<button type='button' className={styles.perPage} onClick={() => setPerPage(value)}>
																{value}
															</button>
														</li>
													))}
												</ul>
											</div>
										)}
									</div>
								</td>
								<td className={styles.paginationText}>
									<span className={styles.range}>
										{setCurrentRange(candidatesPage, totalCandidates, tableSize)} {i18n.t('candidates-list.of')} {totalCandidates}
									</span>
								</td>
								<td className={styles.pagination}>
									<input type='button' className={styles.prevPage} onClick={() => handlePageChange('b')} disabled={!isPrevActive} />
									<input type='button' className={styles.nextPage} onClick={() => handlePageChange('f')} disabled={!isNextActive} />
								</td>
							</tr>
						</tfoot>
					)}
				</table>
			)}
		</>
	);
};

export default Table;
