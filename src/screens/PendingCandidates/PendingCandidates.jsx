import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18n from 'i18n-js';
import styles from './PendingCandidate.module.scss';
import Preloader from '../../components/Preloader/Preloader';
import { changeCandidateStatus, searchPendingCandidates } from '../../store/actions/pendingCandidates';
import PendingTable from '../../commons/Tables/PendingTable';
import { DESELECT_ALL_PENDING, SET_ARE_PENDING_LOADED } from '../../store/actionTypes/actionTypes';
import Popup from '../../commons/Popup/Popup';
import { getAgeRange } from '../../store/actions/candidatesFilters';

/**
 * @desc function for creating screen with Pending candidates
 * @returns {JSX.Element}
 */
const PendingCandidate = () => {
	const dispatch = useDispatch();
	const { areLoaded, selectedPendingCandidates, pendingRequestBody, pendingCandidates } = useSelector(
		(state) => state.pendingCandidatesReducer,
	);

	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [statusCode, setStatusCode] = useState(0);

	useEffect(() => {
		dispatch(getAgeRange());
		if (!pendingCandidates) {
			dispatch({ type: SET_ARE_PENDING_LOADED });
			dispatch(searchPendingCandidates(pendingRequestBody));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * @desc function for changing selected candidate's status according to status code
	 */
	const changeStatus = () => {
		setIsPopupVisible(false);
		dispatch({ type: SET_ARE_PENDING_LOADED });
		dispatch({ type: DESELECT_ALL_PENDING });
		const selectedIds = selectedPendingCandidates.map((user) => user.id);
		const body = {
			candidateIdList: selectedIds,
			status: statusCode,
		};
		changeCandidateStatus(body);
		dispatch(searchPendingCandidates(pendingRequestBody));
	};

	/**
	 * @desc function for setting status-code for selected candidates
	 * @param {number} code - selected status
	 */
	const setCode = (code) => {
		setStatusCode(code);
		setIsPopupVisible(true);
	};

	return (
		<>
			<Popup
				visible={isPopupVisible}
				text='Sind Sie sicher, dass Sie den Status des Kandidaten ändern wollen?'
				handleClosePopup={() => setIsPopupVisible(false)}
				labelClose='Nein'
				labelOk='Ja'
				cbOk={changeStatus}
			/>
			<div className={styles.tableContainer}>
				<Preloader active={!areLoaded} />
				<div className={styles.tableHeading}>
					<h2 className={styles.tableHeadingName}>{i18n.t('header-links.pending-candidates')}</h2>
					<div className={styles.tableHeadingBtnContainer}>
						<button type='button' className={styles.statusBtn} onClick={() => setCode(6)} disabled={!selectedPendingCandidates.length}>
							{i18n.t(`candidates-list.Didn't show up`)}
						</button>
						<button type='button' className={styles.statusBtn} onClick={() => setCode(5)} disabled={!selectedPendingCandidates.length}>
							{i18n.t(`candidates-list.Rejected`)}
						</button>
						<button type='button' className={styles.hireBtn} onClick={() => setCode(4)} disabled={!selectedPendingCandidates.length}>
							{i18n.t(`candidates-list.Hired`)}
						</button>
					</div>
				</div>
				<div className={styles.tableDiv}>
					<PendingTable />
				</div>
			</div>
		</>
	);
};

export default PendingCandidate;
