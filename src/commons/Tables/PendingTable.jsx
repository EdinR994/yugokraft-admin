import React, { useState, useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import i18n from 'i18n-js';
import {
	setSelectedPendingCandidates,
	searchPendingCandidates,
	setPendingRequestBody,
	setCurrentPendingPage,
	toggleAllPending,
} from '../../store/actions/pendingCandidates';
import styles from './Tables.module.scss';
import { SET_ARE_PENDING_LOADED } from '../../store/actionTypes/actionTypes';
import DetailedPopup from '../DetailedPopup/DetailedPopup';
import setCurrentRange from '../../Helpers/setCurrentRange';
import Popup from '../Popup/Popup';

/**
 * @desc function for creating UI for table with pending candidates
 * @returns {JSX.Element}
 */
const PendingTable = () => {
	const dispatch = useDispatch();

	const {
		pendingCandidates,
		pendingRequestBody,
		totalPendingCandidates,
		pendingCandidatesPage,
		selectedPendingCandidates,
		allPendingSelected,
	} = useSelector((state) => state.pendingCandidatesReducer);
	const { message } = useSelector((state) => state.user);

	const tableSize = useSelector((state) => state.pendingCandidatesReducer.pendingRequestBody.size);

	const [detailedIsVisible, setDetailedIsVisible] = useState(false);
	const [selectedUser, setSelectedUser] = useState({});
	const [isPerPageVisible, setIsPerPageVisible] = useState(false);
	const [isPrevActive, setIsPrevActive] = useState(true);
	const [isNextActive, setIsNextActive] = useState(true);

	const perPageValues = [100, 50, 25, 10];

	useEffect(() => {
		document.onclick = (e) => {
			if (e.target.id !== 'dropdownBtn' && isPerPageVisible) {
				setIsPerPageVisible(!isPerPageVisible);
			}
		};
	});

	useEffect(() => {
		dispatch(setSelectedPendingCandidates([]));
	}, [dispatch]);

	useEffect(() => {
		if (selectedPendingCandidates.length !== pendingCandidates?.length) {
			dispatch(toggleAllPending(false));
		} else if (pendingCandidates?.length > 0) {
			dispatch(toggleAllPending(true));
		}
	}, [selectedPendingCandidates, pendingCandidates, dispatch]);

	/**
	 * @desc pagination
	 * @param {string} direction - direction of page change - "forward" or "backward"
	 */
	const handlePageChange = (direction) => {
		let newRequestBody;
		switch (direction) {
			case 'f':
				if (
					pendingCandidatesPage === Math.floor(totalPendingCandidates / tableSize) ||
					pendingRequestBody.page * pendingRequestBody.size + pendingRequestBody.size >= totalPendingCandidates
				) {
					setIsNextActive(false);
					return;
				}
				newRequestBody = { ...pendingRequestBody, page: (pendingRequestBody.page += 1) };
				dispatch(toggleAllPending(false));
				dispatch(setSelectedPendingCandidates([]));
				dispatch(setCurrentPendingPage(pendingRequestBody.page));
				setCurrentRange(pendingCandidatesPage + 1, totalPendingCandidates, tableSize);
				dispatch({ type: SET_ARE_PENDING_LOADED });
				dispatch(setPendingRequestBody(newRequestBody));
				dispatch(searchPendingCandidates(newRequestBody));
				setIsPrevActive(true);
				break;
			case 'b':
				if (pendingCandidatesPage === 0) {
					setIsPrevActive(false);
					return;
				}
				newRequestBody = { ...pendingRequestBody, page: (pendingRequestBody.page -= 1) };
				dispatch(toggleAllPending(false));
				dispatch(setSelectedPendingCandidates([]));
				dispatch(setCurrentPendingPage(pendingRequestBody.page));
				setCurrentRange(pendingCandidatesPage);
				dispatch({ type: SET_ARE_PENDING_LOADED });
				dispatch(setPendingRequestBody(newRequestBody));
				dispatch(searchPendingCandidates(newRequestBody));
				setIsNextActive(true);
				break;
			default:
				break;
		}
	};

	/**
	 * @desc function for showing detailed popup for selected candidate
	 * @param {object} user - selected candidate
	 */
	const showInfo = (user) => {
		setSelectedUser(user);
		setDetailedIsVisible(true);
		document.body.style = 'overflow: hidden;';
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
	const setPerPage = (value) => {
		setIsPerPageVisible(!isPerPageVisible);
		const newRequestBody = { ...pendingRequestBody, size: value, page: 0 };
		dispatch({ type: SET_ARE_PENDING_LOADED });
		dispatch(setPendingRequestBody(newRequestBody));
		dispatch(searchPendingCandidates(newRequestBody));
		dispatch(setCurrentPendingPage(0));
		setIsNextActive(true);
	};

	/**
	 * @desc function for selecting/deselecting all candidates with checkbox
	 */
	const toggleAllCandidates = () => {
		if (!allPendingSelected) {
			dispatch(setSelectedPendingCandidates(pendingCandidates.map((user) => user)));
			dispatch(toggleAllPending(true));
		} else {
			dispatch(setSelectedPendingCandidates([]));
			dispatch(toggleAllPending(false));
		}
	};
	/**
	 * @desc function for controlling candidate's selection witch checkboxes
	 * @param {object} user - checked candidate
	 */
	const handleCheck = (user) => {
		if (selectedPendingCandidates.includes(user)) {
			dispatch(setSelectedPendingCandidates(selectedPendingCandidates.filter((usr) => usr.id !== user.id)));
		} else {
			dispatch(setSelectedPendingCandidates([...selectedPendingCandidates, user]));
		}
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
			{pendingCandidates && (
				<table className={styles.table}>
					<thead>
						<tr className={styles.tableHeaderRow}>
							<th className={styles.chckColumn}>
								<label htmlFor='selectAll' className={styles.detailedCheckbox}>
									<input type='checkbox' id='selectAll' onChange={toggleAllCandidates} checked={allPendingSelected} />
									<span />
								</label>
							</th>
							<th className={styles.nameColumnHeader}>{i18n.t('candidates-list.name')}</th>
							<th className={styles.countryColumn}>{i18n.t('candidates-list.country')}</th>
							<th className={styles.ageColumn}>{i18n.t('candidates-list.age')}</th>
							<th className={styles.eduColumn}>{i18n.t('candidates-list.education')}</th>
							<th className={styles.langColumn}>{i18n.t('candidates-list.languages')}</th>
							<th className={styles.regionColumn}>{i18n.t('candidates-list.region')}</th>
							<th className={styles.startColumnPending}>{i18n.t('candidates-list.start')}</th>
							<th className={styles.dateColumn}>{i18n.t('candidates-list.date-of-interview')}</th>
							<th className={styles.statusColumn}>{i18n.t('candidates-list.status')}</th>
							<th className={styles.moreInfoColumn}>{i18n.t('candidates-list.more-info')}</th>
						</tr>
					</thead>
					<tbody>
						{pendingCandidates.map((user) => (
							<tr className={styles.tableBodyRow} key={user.id}>
								<td>
									<label htmlFor={user.id} className={styles.detailedCheckbox}>
										<input
											type='checkbox'
											id={user.id}
											checked={selectedPendingCandidates.includes(user)}
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
								<td className={styles.ageColumn}>{user.data.candidate.age}</td>
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
								<td>15.10.2020</td>
								<td>{showStatus(user.data.status)}</td>
								<td className={styles.moreInfoColumn}>
									<input type='button' className={styles.detailedInf} onClick={() => showInfo(user)} />
								</td>
							</tr>
						))}
					</tbody>
					<tfoot className={styles.footer}>
						<tr className={styles.footerRow}>
							<td colSpan='8' />
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
								<span>
									{setCurrentRange(pendingCandidatesPage, totalPendingCandidates, tableSize)} {i18n.t('candidates-list.of')}{' '}
									{totalPendingCandidates}
								</span>
							</td>
							<td className={styles.pagination}>
								<input type='button' className={styles.prevPage} onClick={() => handlePageChange('b')} disabled={!isPrevActive} />
								<input type='button' className={styles.nextPage} onClick={() => handlePageChange('f')} disabled={!isNextActive} />
							</td>
						</tr>
					</tfoot>
				</table>
			)}
		</>
	);
};

export default memo(PendingTable);
