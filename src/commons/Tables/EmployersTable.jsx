import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18n from 'i18n-js';
import styles from './Tables.module.scss';
import {
	searchEmployers,
	setCurrentEmployersPage,
	setEmployersRequestBody,
	setSelectedEmployers,
	toggleEmployers,
} from '../../store/actions/employersList';
import { SET_ARE_EMPLOYERS_LOADED } from '../../store/actionTypes/actionTypes';
import Popup from '../Popup/Popup';

/**
 * @desc function for creating UI for table with employers
 * @returns {JSX.Element}
 */
const EmployersTable = () => {
	const dispatch = useDispatch();
	const {
		employers,
		selectedEmployers,
		selectedEmployersShown,
		allAreSelected,
		employersPage,
		totalEmployers,
		employersRequestBody,
	} = useSelector((state) => state.employersListReducer);
	const tableSize = useSelector((state) => state.employersListReducer.employersRequestBody.size);
	const { message } = useSelector((state) => state.user);

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
		dispatch(setSelectedEmployers([]));
	}, [dispatch]);

	useEffect(() => {
		if (selectedEmployers.length !== employers?.length) {
			dispatch(toggleEmployers(false));
		} else if (employers?.length > 0) {
			dispatch(toggleEmployers(true));
		}
	}, [selectedEmployers, employers, dispatch]);

	/**
	 * @desc function for converting date to appropriate format
	 * @param {string} date - date from server
	 * @return {string} - date in appropriate format
	 */
	const showDate = (date) => {
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const year = date.getFullYear();
		return `${day}.${month}.${year}`;
	};

	/**
	 * @desc function for controlling employers' selection witch checkboxes
	 * @param {object} user - checked employer
	 */
	const handleEmployerCheck = (user) => {
		if (selectedEmployers.includes(user)) {
			dispatch(setSelectedEmployers(selectedEmployers.filter((usr) => usr.id !== user.id)));
		} else {
			dispatch(setSelectedEmployers([...selectedEmployers, user]));
		}
	};

	/**
	 * @desc function for selecting/deselecting all employers with checkbox
	 */
	const toggleAllEmployers = () => {
		if (!allAreSelected) {
			dispatch(setSelectedEmployers(employers.map((user) => user)));
			dispatch(toggleEmployers(true));
		} else {
			dispatch(setSelectedEmployers([]));
			dispatch(toggleEmployers(false));
		}
	};

	/**
	 * @desc function for showing currently displayed candidates
	 * @param {number} page - current page of candidate's list
	 * @returns {string} - range of currently displayed candidates
	 */
	const setCurrentRange = (page) => {
		if (!totalEmployers) return `${0}-${0}`;
		let from;
		let to;
		if (totalEmployers < 10) {
			from = 1;
			to = totalEmployers;
		} else if (page !== 0 && page !== Math.floor(totalEmployers / tableSize)) {
			from = page * tableSize + 1;
			to = page * tableSize + tableSize;
		} else if (page === Math.floor(totalEmployers / tableSize)) {
			from = page * tableSize + 1;
			to = totalEmployers;
		} else {
			from = 1;
			to = tableSize;
		}
		return totalEmployers === 0 ? '0' : `${from}-${to}`;
	};

	/**
	 * @desc pagination
	 * @param {string} direction - direction of page change - "forward" or "backward"
	 */
	const handlePageChange = (direction) => {
		let newRequestBody;
		switch (direction) {
			case 'f':
				if (
					employersPage === Math.floor(totalEmployers / tableSize) ||
					employersRequestBody.page * employersRequestBody.size + employersRequestBody.size >= totalEmployers
				) {
					setIsNextActive(false);
					return;
				}
				newRequestBody = { ...employersRequestBody, page: (employersRequestBody.page += 1) };
				dispatch(setSelectedEmployers([]));
				dispatch(toggleEmployers(false));
				dispatch(setCurrentEmployersPage(employersRequestBody.page));
				dispatch({ type: SET_ARE_EMPLOYERS_LOADED });
				dispatch(setEmployersRequestBody(newRequestBody));
				dispatch(searchEmployers(newRequestBody));
				setIsPrevActive(true);
				break;
			case 'b':
				if (employersPage === 0) {
					setIsPrevActive(false);
					return;
				}
				newRequestBody = { ...employersRequestBody, page: (employersRequestBody.page -= 1) };
				dispatch(toggleEmployers(false));
				dispatch(setSelectedEmployers([]));
				dispatch(setCurrentEmployersPage(employersRequestBody.page));
				dispatch({ type: SET_ARE_EMPLOYERS_LOADED });
				dispatch(setEmployersRequestBody(newRequestBody));
				dispatch(searchEmployers(newRequestBody));
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
	const setPerPage = (value) => {
		setIsPerPageVisible(!isPerPageVisible);
		const newRequestBody = { ...employersRequestBody, size: value, page: 0 };
		dispatch({ type: SET_ARE_EMPLOYERS_LOADED });
		dispatch(setEmployersRequestBody(newRequestBody));
		dispatch(searchEmployers(newRequestBody));
		dispatch(setCurrentEmployersPage(0));
		setIsNextActive(true);
	};

	const handleClosePopup = () => {
		window.location.reload();
	};

	return (
		<>
			{message && <Popup visible text={message} handleClosePopup={handleClosePopup} labelClose='Neu laden' />}
			{employers && (
				<table className={styles.table}>
					<thead>
						<tr className={styles.tableHeaderRow}>
							<th className={styles.chckColumn}>
								<label htmlFor='selectAll' className={styles.detailedCheckbox}>
									<input type='checkbox' id='selectAll' onChange={toggleAllEmployers} checked={allAreSelected} />
									<span />
								</label>
							</th>
							<th>{i18n.t('employers-list.name')}</th>
							<th className={styles.companyColumn}>{i18n.t('employers-list.company')}</th>
							<th>{i18n.t('employers-list.email')}</th>
							<th>{i18n.t('employers-list.registration-date')}</th>
							<th>{i18n.t('employers-list.interviewed')}</th>
							<th>{i18n.t('employers-list.hired')}</th>
							<th className={styles.statusColumnEmployers}>{i18n.t('employers-list.status')}</th>
						</tr>
					</thead>
					<tbody>
						{employers.map((user) => (
							<tr className={styles.tableBodyRow} key={user.id}>
								<td>
									<label htmlFor={user.id} className={styles.detailedCheckbox}>
										<input
											type='checkbox'
											id={user.id}
											checked={selectedEmployers.includes(user)}
											onChange={() => handleEmployerCheck(user)}
										/>
										<span />
									</label>
								</td>
								<td>
									<p className={styles.mainInf}>{user.name}</p>
								</td>
								<td>
									<p className={styles.mainInf}>{user.company}</p>
								</td>
								<td>{user.email}</td>
								<td>{showDate(new Date(user.createdAt))}</td>
								<td>{user.interviewed} candidates</td>
								<td>{user.hired} candidates</td>
								<td>{user.active ? 'Active' : 'Disactive'}</td>
							</tr>
						))}
					</tbody>
					{!selectedEmployersShown && (
						<tfoot className={styles.footer}>
							<tr className={styles.footerRow}>
								<td colSpan='5' />
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
										{setCurrentRange(employersPage)} {i18n.t('candidates-list.of')} {totalEmployers}
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

export default EmployersTable;
