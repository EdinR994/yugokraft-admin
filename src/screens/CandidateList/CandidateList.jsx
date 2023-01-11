/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import i18n from 'i18n-js';
import styles from './CandidateList.module.scss';
import CandidatesTable from '../../commons/Tables/CandidatesTable';
import Preloader from '../../components/Preloader/Preloader';
import {
	setFilteredCandidates,
	inviteForInterview,
	searchCandidates,
	searchCandidatesOwner,
	setErrorMessage,
	setCurrentPage,
	setAreLoaded,
	setSearchQueryCandidates,
	getAgeRange,
} from '../../store/actions/candidatesFilters';
import { DESELECT_ALL, SET_ARE_LOADED, SET_SHOWN_SELECTED } from '../../store/actionTypes/actionTypes';
import Popup from '../../commons/Popup/Popup';

/**
 *
 * @return {JSX.Element}
 * @desc UI for Candidates List screen
 */

const CandidateList = () => {
	const dispatch = useDispatch();
	const { candidatesAreLoaded, selectedUsers, selectedShown, requestBody, filteredCandidates, errorMessage } = useSelector(
		(state) => state.candidatesFiltersReducer,
	);
	const role = localStorage.getItem('USER_TYPE');

	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
	const { query } = useSelector((state) => state.candidatesFiltersReducer);

	useEffect(() => {
		dispatch(getAgeRange());
		if (!filteredCandidates) {
			dispatch({ type: SET_ARE_LOADED });
			if (role === 'employer') {
				dispatch(searchCandidates(requestBody));
			} else dispatch(searchCandidatesOwner(requestBody));
		}
	}, []);

	/**
	 * @desc function for showing selected candidates
	 */
	const showSelected = () => {
		dispatch(setFilteredCandidates(selectedUsers));
		dispatch({ type: SET_SHOWN_SELECTED });
	};

	/**
	 * @desc function for sending request for inviting selected candidates for interview
	 */
	const handleInvite = async () => {
		setIsPopupVisible(false);
		dispatch({ type: SET_ARE_LOADED, payload: false });
		dispatch({ type: DESELECT_ALL });
		const selectedIds = selectedUsers.map((user) => user.id);
		const body = { candidateIdList: [...selectedIds] };
		await dispatch(inviteForInterview(body));
		await dispatch(searchCandidates(requestBody));
		if (selectedShown) {
			dispatch({ type: SET_SHOWN_SELECTED });
		}
		if (candidatesAreLoaded && !errorMessage) {
			setIsSuccessPopupVisible(true);
		}
	};

	const handleSearch = (event) => {
		if (event.key === 'Enter') {
			const newRequestBody = {
				...requestBody,
				nameOrEmail: query,
				page: 0,
			};
			if (role === 'admin') {
				dispatch(setCurrentPage(0));
				dispatch(setAreLoaded(false));
				dispatch(searchCandidatesOwner(newRequestBody));
				return;
			}
			dispatch(setCurrentPage(0));
			dispatch(setAreLoaded(false));
			dispatch(searchCandidates(newRequestBody));
		}
	};

	const handleQuery = (e) => {
		dispatch(setSearchQueryCandidates(e.target.value));
	};

	return (
		<>
			<Popup
				visible={isPopupVisible}
				text='Sind  Sie sicher, dass Sie die Kandidaten zum Interview einladen wollen?'
				handleClosePopup={() => setIsPopupVisible(false)}
				labelClose='Nein'
				labelOk='Ja'
				cbOk={handleInvite}
			/>
			<Popup
				visible={errorMessage}
				text={i18n.t(`user-popup.error.${errorMessage}`)}
				handleClosePopup={() => dispatch(setErrorMessage(''))}
				labelClose='Schließen'
				calendarLink
			/>
			<Popup
				visible={isSuccessPopupVisible}
				text='Sie haben erfolgreich einen Kandidaten eingeladen'
				handleClosePopup={() => setIsSuccessPopupVisible(false)}
				labelClose='Schließen'
			/>
			<div className={styles.tableContainer} id='container'>
				<Preloader active={!candidatesAreLoaded} />
				<div className={styles.tableHeading}>
					<h2 className={styles.tableHeadingName}>{i18n.t('header-links.list-of-candidates')}</h2>
					<div className={styles.searchContainer}>
						<img src={require('../../assets/img/search.svg')} className={styles.searchIcon} alt='search icon' />
						<input
							type='text'
							className={styles.searchBar}
							placeholder={i18n.t('candidates-list.search-bar')}
							value={query}
							onChange={handleQuery}
							onKeyPress={handleSearch}
						/>
					</div>
					<div className={styles.tableHeadingBtnContainer}>
						{selectedUsers.length !== 0 && !selectedShown && (
							<button type='button' className={styles.showBtn} onClick={showSelected}>
								{i18n.t('candidates-list.show-selected')}: {selectedUsers.length}
							</button>
						)}
						{role !== 'admin' && (
							// eslint-disable-next-line max-len
							<button type='button' className={styles.inviteBtn} onClick={() => setIsPopupVisible(true)} disabled={!selectedUsers.length}>
								{i18n.t('candidates-list.invite')}
							</button>
						)}
					</div>
				</div>
				<div className={styles.tableDiv}>
					<CandidatesTable />
				</div>
			</div>
		</>
	);
};

export default CandidateList;
