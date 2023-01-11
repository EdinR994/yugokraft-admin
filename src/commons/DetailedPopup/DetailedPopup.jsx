/* eslint-disable no-prototype-builtins */
import React, { useEffect, useRef, useState } from 'react';
import { uuid } from 'uuidv4';
import i18n from 'i18n-js';
import { useDispatch, useSelector } from 'react-redux';
import dateToUrl from '../../Helpers/dateToUrl';
import styles from './DetailedPopup.module.scss';
import DocsRequestForm from '../DocsRequestForm/DocsRequestForm';
import {
	getDocumentsArchiveByCategory,
	getAllDocuments,
	sendDocumentsRequest,
	getCandidateTranslatedCV,
	setCandidateTranslatedCV,
	setCVTranslated,
} from '../../store/actions/candidatesFilters';
import Preloader from '../../components/Preloader/Preloader';
import { setLoaderActive, setLoaderDisabled } from '../../store/actions/mainActions';
import Popup from '../Popup/Popup';

/**
 * @param {object} userInfo
 * @param {boolean} detailedIsVisible
 * @param {function} setDetailedIsVisible
 * @return {JSX.Element}
 * @desc function for creating UI for popup with user information
 */
const DetailedPopup = ({ userInfo = null, setDetailedIsVisible, detailedIsVisible }) => {
	const { categories, currentCandidateTranslatedCV, isCVTranslated } = useSelector((state) => state.candidatesFiltersReducer);
	let preparedUser = { ...currentCandidateTranslatedCV };
	if (currentCandidateTranslatedCV.data) {
		preparedUser = { ...currentCandidateTranslatedCV, ...currentCandidateTranslatedCV.data };
	}
	if (currentCandidateTranslatedCV.hasOwnProperty('id') === false && Object.keys(currentCandidateTranslatedCV).length) {
		preparedUser.id = currentCandidateTranslatedCV.candidate.id;
	}

	const [selectText, setSelectText] = useState([i18n.t('documents.Select documents')]);
	const [checkList, setCheckList] = useState({});
	const [note, setNote] = useState('');
	const [popupVisible, setPopupVisible] = useState(false);
	const dispatch = useDispatch();
	const popupRef = useRef();
	const { loaderIsActive } = useSelector((state) => state.mainReducer);
	const [isLoading, setIsLoading] = useState({
		id: null,
		status: false,
	});

	/**
	 * @desc function for set translated CV for current candidate
	 */
	useEffect(() => {
		dispatch(getCandidateTranslatedCV(userInfo.id || userInfo.candidate.id));
	}, [dispatch, detailedIsVisible]);

	const handleClickOutsidePopup = (e) => {
		if (isCVTranslated && !popupRef.current.contains(e.target)) {
			setDetailedIsVisible(false);
			dispatch(setCandidateTranslatedCV({}));
			setSelectText([i18n.t('documents.Select documents')]);
			setCheckList({});
			setNote('');
			setPopupVisible(false);
			dispatch(setCVTranslated(false));
			document.body.style = 'overflow-y: overlay;';
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutsidePopup);
		return () => document.removeEventListener('mousedown', handleClickOutsidePopup);
	});
	/**
	 * @desc function for closing detailed popup
	 */
	const closePopup = () => {
		setDetailedIsVisible(!detailedIsVisible);
		dispatch(setCVTranslated(false));
		dispatch(setCandidateTranslatedCV({}));
		document.body.style = 'overflow: visible;';
	};

	const handleDownloadDocs = async (id) => {
		setIsLoading({
			id: 'all',
			status: true,
		});
		await getAllDocuments(id);
		setIsLoading({
			id: null,
			status: false,
		});
	};

	const handleDownloadLink = async (category) => {
		setIsLoading({
			id: category,
			status: true,
		});
		const categoryId = categories.find((item) => item.name === category).id;
		await getDocumentsArchiveByCategory(categoryId, preparedUser.id);
		setIsLoading({
			id: null,
			status: false,
		});
	};

	const handleRequest = async () => {
		let categoryIdList = Object.keys(checkList);
		if (selectText[0] === i18n.t('documents.Select documents')) return;
		dispatch(setLoaderActive());
		categoryIdList = categoryIdList.map((item) => categories.find((category) => category.name === i18n.t(`documents.${item}`)).id);
		await dispatch(sendDocumentsRequest({ categoryIdList, note }, preparedUser.id));
		setNote('');
		setCheckList({});
		setSelectText([i18n.t('documents.Select documents')]);
		dispatch(setLoaderDisabled());
		setPopupVisible(true);
	};

	const handleNote = (e) => {
		setNote(e.target.value.slice(0, 500));
	};

	preparedUser.languages = preparedUser?.languages?.filter((lang) => lang.language !== '');
	preparedUser.skills = preparedUser?.skills?.filter((skill) => skill.name !== '');

	return !isCVTranslated && detailedIsVisible ? (
		<Preloader active />
	) : (
		<div className={detailedIsVisible ? styles.popupWrapper : styles.popupWrapperHide}>
			<div ref={popupRef} className={styles.popupContainer}>
				<Preloader active={loaderIsActive} />
				<Popup visible={popupVisible} text='Ihre Nachricht wurde gesendet' handleClosePopup={() => setPopupVisible(false)} />
				<div className={styles.headingContainer}>
					<img src={require('../../assets/img/contactInfo.svg')} alt='contact information' className={styles.contactIcon} />
					<h3 className={styles.heading}>Kontaktinformation</h3>
				</div>
				<div className={styles.contactInfo}>
					<div className={styles.contactInfoSection}>
						<p className={styles.contactInfoMain}>{`${userInfo?.data?.candidate?.firstName} ${userInfo?.data?.candidate?.lastName}`}</p>
						<p className={styles.contactInfoSecondary}>{preparedUser?.candidate?.email}</p>
						<p className={styles.contactInfoSecondary}>{preparedUser?.candidate?.phoneNumber}</p>
					</div>
					<div className={styles.contactInfoSection}>
						<p className={styles.contactInfoMain}>
							{preparedUser?.country?.eu ? i18n.t('candidates-list.eu-citizen') : i18n.t('candidates-list.non-eu-citizen')}
						</p>
						<p className={styles.contactInfoSecondary}>{preparedUser?.country?.name}</p>
					</div>
				</div>

				{preparedUser && (
					<div className={styles.infoContainer}>
						<div className={styles.headingContainer}>
							<img src={require('../../assets/img/additionalInfo.svg')} alt='additional information' className={styles.secondaryIcon} />
							<h3 className={styles.heading}>Zusätzliche Informationen</h3>
						</div>
						<table className={styles.popupTable}>
							<thead>
								<tr>
									<th>Arbeitserfahrung im Ausland</th>
									<th>Letzte Änderung</th>
									<th>Geburtsdatum</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>{preparedUser?.candidate?.experienceAbroad}</td>
									<td>{dateToUrl(new Date(preparedUser?.createdAt))}</td>
									<td>{preparedUser?.candidate?.birthdate}</td>
								</tr>
							</tbody>
						</table>
					</div>
				)}
				{preparedUser?.educations && (
					<div className={styles.infoContainer}>
						<div className={styles.headingContainer}>
							<img src={require('../../assets/img/educationIcon.svg')} alt='education' className={styles.eduIcon} />
							<h3 className={styles.heading}>{i18n.t('user-popup.education.education')}</h3>
						</div>
						<table className={styles.popupTable}>
							<thead>
								<tr>
									<th>{`${i18n.t('user-popup.education.institute')}`}</th>
									<th>Fähigkeit</th>
								</tr>
							</thead>
							<tbody>
								{preparedUser.educations.length ? (
									preparedUser.educations.map((edu) => (
										<tr key={uuid()}>
											<td>{edu.specialty}</td>
											<td>{edu.degree}</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan='2'>Keine Ausbildung</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}
				{preparedUser?.jobs && (
					<div className={styles.infoContainer}>
						<div className={styles.headingContainer}>
							<img src={require('../../assets/img/desiredSphere.svg')} alt='desired work sphere' className={styles.desiredIcon} />
							<h3 className={styles.heading}>{i18n.t('user-popup.jobs.jobs')}</h3>
						</div>
						<table className={styles.popupTable}>
							<thead>
								<tr>
									<th>{`${i18n.t('user-popup.jobs.company')}`}</th>
									<th>{`${i18n.t('user-popup.jobs.experience')}`}</th>
									<th>{`${i18n.t('user-popup.jobs.specialization')}`}</th>
									<th>{`${i18n.t('user-popup.jobs.position')}`}</th>
									<th>{`${i18n.t('user-popup.jobs.responsibilities')}`}</th>
								</tr>
							</thead>
							<tbody>
								{preparedUser.jobs.length ? (
									preparedUser.jobs.map((job) => {
										const prepareDate = (date) => {
											return date.split('T')[0].split('-').reverse().join('-');
										};

										return (
											<tr key={uuid()}>
												<td>{job.company}</td>
												<td className={styles.fieldMinWidth}>{`${prepareDate(job.from)} - ${prepareDate(job.to)}`}</td>
												<td>{job.specialization}</td>
												<td>{job.position}</td>
												<td>{job.responsibilities}</td>
											</tr>
										);
									})
								) : (
									<tr>
										<td colSpan='5'>Keine Arbeitsstellen</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}
				{preparedUser?.languages && (
					<div className={styles.infoContainer}>
						<div className={styles.headingContainer}>
							<img src={require('../../assets/img/langIcon.svg')} alt='languages' className={styles.langIcon} />
							<h3 className={styles.heading}>{i18n.t('user-popup.languages.languages')}</h3>
						</div>
						<table className={styles.popupTable}>
							<thead>
								<tr>
									<th>{`${i18n.t('user-popup.languages.language')}`}</th>
									<th>{`${i18n.t('user-popup.languages.level')}`}</th>
								</tr>
							</thead>
							<tbody>
								{preparedUser.languages.length ? (
									preparedUser.languages.map((lang) => (
										<tr key={uuid()}>
											<td>{lang.language}</td>
											<td>{lang.level}</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan='2'>Keine Sprachen</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}
				{preparedUser?.polls && (
					<div className={styles.infoContainer}>
						<div className={styles.headingContainer}>
							<img src={require('../../assets/img/polls.svg')} alt='polls' className={styles.pollsIcon} />
							<h3 className={styles.heading}>{i18n.t('user-popup.polls.polls')}</h3>
						</div>
						<table className={styles.popupTable}>
							<thead>
								<tr>
									<th>{`${i18n.t('user-popup.polls.region')}`}</th>
									<th>{`${i18n.t('user-popup.polls.reason')}`}</th>
									<th>{`${i18n.t('user-popup.polls.date')}`}</th>
									<th>{`${i18n.t('user-popup.polls.available')}`}</th>
								</tr>
							</thead>
							<tbody>
								{preparedUser.polls.length ? (
									preparedUser.polls.map((poll) => (
										<tr key={uuid()}>
											<td>{poll.desiredRegion}</td>
											<td>{poll.motivation}</td>
											<td>{poll.whenReadyToWork}</td>
											<td>{poll.availableForCall ? 'Ja' : 'Nein'}</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan='4'>Keine Umfragen</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}
				{preparedUser?.skills && (
					<div className={styles.infoContainer}>
						<div className={styles.headingContainer}>
							<img src={require('../../assets/img/skills.svg')} alt='skills' className={styles.skillsIcon} />
							<h3 className={styles.heading}>{i18n.t('user-popup.skills.skills')}</h3>
						</div>
						<table className={styles.popupTable}>
							<thead>
								<tr>
									<th>{`${i18n.t('user-popup.skills.skill')}`}</th>
									<th>{`${i18n.t('user-popup.skills.description')}`}</th>
								</tr>
							</thead>
							<tbody>
								{preparedUser.skills.length ? (
									preparedUser.skills.map((skill) => (
										<tr key={uuid()}>
											<td>{skill.name}</td>
											<td>{skill.description}</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan='2'>Keine Fähigkeiten</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}
				{preparedUser?.candidate?.desiredWorkSpheres && (
					<div className={styles.infoContainer}>
						<div className={styles.headingContainer}>
							<img src={require('../../assets/img/desiredSphere.svg')} alt='desired work sphere' className={styles.desiredIcon} />
							<h3 className={styles.heading}>Gewünschter Arbeitsplatz</h3>
						</div>
						<ul className={styles.desiredSpheresList}>
							{preparedUser.candidate.desiredWorkSpheres.map((sphere) => (
								<li className={styles.desiredSpheresListItem} key={uuid()}>
									{sphere}
								</li>
							))}
						</ul>
					</div>
				)}
				{preparedUser?.documents && (
					<div className={styles.infoContainer}>
						<div className={styles.documentsContainer}>
							<div className={styles.headingLeft}>
								<img src={require('../../assets/img/docs.svg')} alt='attached documents' className={styles.docsIcon} />
								<h3 className={styles.heading}>{i18n.t('user-popup.documents.documents')}</h3>
							</div>
							{!!preparedUser.documents.length && (
								<button
									disabled={isLoading.id === 'all' && isLoading.status}
									className={`${styles.downloadBtn} ${styles.headingBtn}`}
									type='button'
									onClick={() => handleDownloadDocs(preparedUser.id)}
								>
									{isLoading.id === 'all' && isLoading.status === true ? 'Loading...' : 'Alles herunterladen'}
								</button>
							)}
						</div>
						<table className={styles.popupTable}>
							<thead>
								<tr>
									<th>Dokumentname</th>
									<th className={styles.downloadCell}>Aktivitäten</th>
								</tr>
							</thead>
							<tbody>
								{preparedUser.documents.length ? (
									preparedUser.documents.map((doc) => (
										<tr key={uuid()}>
											<td>{i18n.t(`documents.${doc.category}`)}</td>
											<td>
												<button
													disabled={isLoading.id === doc.category && isLoading.status}
													type='button'
													onClick={() => handleDownloadLink(doc.category)}
													className={styles.downloadBtn}
												>
													{isLoading.id === doc.category && isLoading.status === true ? 'Loading...' : 'Herunterladen'}
												</button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan='2'>Keine Dokumente</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}
				<DocsRequestForm
					checkList={checkList}
					setCheckList={setCheckList}
					selectText={selectText}
					setSelectText={setSelectText}
					note={note}
					setNote={handleNote}
				/>
				<div className={styles.buttonContainer}>
					<button type='button' className={styles.closeButton} onClick={closePopup}>
						{i18n.t('general.close')}
					</button>
					<button type='button' className={styles.sendButton} onClick={handleRequest}>
						Anfrage senden
					</button>
				</div>
			</div>
		</div>
	);
};

export default DetailedPopup;
