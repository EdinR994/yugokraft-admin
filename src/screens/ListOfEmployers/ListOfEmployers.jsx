import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18n from 'i18n-js';
import styles from './ListOfEmployers.module.scss';
import Preloader from '../../components/Preloader/Preloader';
import EmployersTable from '../../commons/Tables/EmployersTable';
import { SET_ARE_EMPLOYERS_LOADED, SET_SELECTED_EMPLOYERS_SHOWN } from '../../store/actionTypes/actionTypes';
import {
	changeEmployerStatus,
	searchEmployers,
	setEmployers,
	setEmployersDeselected,
	setEmployersLoaded,
	setSearchQuery,
	setCurrentEmployersPage,
} from '../../store/actions/employersList';
import Popup from '../../commons/Popup/Popup';

/**
 * @return {JSX.Element}
 * @desc UI of Employers Screen
 */

const ListOfEmployers = () => {
	const dispatch = useDispatch();
	const { employersAreLoaded, selectedEmployers, selectedEmployersShown, employers, employersRequestBody } = useSelector(
		(state) => state.employersListReducer,
	);

	// const [search, setSearch] = useState('');
	const { query } = useSelector((state) => state.employersListReducer);
	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [status, setStatus] = useState(null);

	useEffect(() => {
		if (!employers) {
			dispatch({ type: SET_ARE_EMPLOYERS_LOADED });
			dispatch(searchEmployers(employersRequestBody));
		}
	}, [employers, dispatch, employersRequestBody]);

	/**
	 * @desc function for showing selected employers
	 */
	const showSelected = () => {
		dispatch(setEmployers(selectedEmployers));
		dispatch({ type: SET_SELECTED_EMPLOYERS_SHOWN });
	};

	/**
	 * @desc function for changing selected employer's status
	 */
	const changeStatus = async () => {
		setIsPopupVisible(false);
		dispatch(setEmployersLoaded());
		dispatch(setEmployersDeselected());
		const selectedIds = selectedEmployers.map((user) => user.id);
		const body = {
			employerIdList: selectedIds,
			active: status,
		};
		await changeEmployerStatus(body);
		dispatch(searchEmployers(employersRequestBody));
		dispatch({ type: SET_SELECTED_EMPLOYERS_SHOWN });
	};

	/**
	 * @desc function for setting status for selected employer
	 * @param {boolean} isActive - setting active/disactive status for selected employer
	 */
	const setActive = (isActive) => {
		setStatus(isActive);
		setIsPopupVisible(true);
	};

	/**
	 * @desc function for searching employers by name or company
	 * @param event
	 */
	const handleSearch = (event) => {
		if (event.key === 'Enter') {
			const newRequestBody = {
				...employersRequestBody,
				nameOrCompany: query,
				page: 0,
			};
			dispatch(setCurrentEmployersPage(0));
			dispatch(setEmployersLoaded());
			dispatch(searchEmployers(newRequestBody));
		}
	};

	const handleQuery = (e) => {
		dispatch(setSearchQuery(e.target.value));
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
				<Preloader active={!employersAreLoaded} />
				<div className={styles.tableHeading}>
					<div className={styles.headingContainer}>
						<h2 className={styles.tableHeadingName}>{i18n.t('header-links.list-of-employers')}</h2>
						<div className={styles.searchContainer}>
							<img src={require('../../assets/img/search.svg')} className={styles.searchIcon} alt='search icon' />
							<input
								type='text'
								className={styles.searchBar}
								placeholder={i18n.t('employers-list.search-bar')}
								value={query}
								onChange={handleQuery}
								onKeyPress={handleSearch}
							/>
						</div>
					</div>
					<div className={styles.tableHeadingBtnContainer}>
						{!!selectedEmployers.length && !selectedEmployersShown && (
							<button type='button' className={styles.showBtn} onClick={showSelected} disabled={selectedEmployersShown}>
								{i18n.t('employers-list.show-selected')}: {selectedEmployers.length}
							</button>
						)}
						<button type='button' className={styles.disactivateBtn} onClick={() => setActive(false)} disabled={!selectedEmployers.length}>
							{i18n.t('employers-list.disactivate')}
						</button>
						<button type='button' className={styles.activateBtn} onClick={() => setActive(true)} disabled={!selectedEmployers.length}>
							{i18n.t('employers-list.activate')}
						</button>
					</div>
				</div>
				<div className={styles.tableDiv}>
					<EmployersTable />
				</div>
			</div>
		</>
	);
};

export default ListOfEmployers;
