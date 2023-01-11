import React from 'react';
import i18n from 'i18n-js';

import { NavLink } from 'react-router-dom';
import styles from './Popup.module.scss';
import MainButton from '../MainButton/MainButton';
import routes from '../../routes/routes';

/**
 * @desc function for creating Popup UI
 * @param {boolean} visible
 * @param {string} text
 * @param {function} handleClosePopup
 * @param {object} cbOk
 * @param {string} labelClose
 * @param {string} labelOk
 * @param {string} calendarLink
 * @param {string} login
 * @returns {JSX.Element}
 */
const Popup = ({
	visible,
	text,
	handleClosePopup,
	cbOk = null,
	labelClose = `${i18n.t('general.close')}`,
	labelOk = `${i18n.t('general.yes')}`,
	calendarLink = null,
	login = null,
}) => {
	return (
		<div className={visible ? styles.popupWrapper : styles.popupWrapperHide}>
			<div className={styles.popupContainer}>
				<label htmlFor='text_to'>{text}</label>
				<div className={styles.buttonContainer}>
					{cbOk ? (
						<>
							<MainButton label={labelClose} onClick={handleClosePopup} closeButton />
							<MainButton label={labelOk} onClick={cbOk} />
						</>
					) : (
						<>
							{login && <MainButton label={labelClose} onClick={handleClosePopup} />}
							{!login && <MainButton label={labelClose} onClick={handleClosePopup} closeButton />}
							{calendarLink && (
								<NavLink className={styles.calendarLink} to={routes.CALENDAR} onClick={handleClosePopup}>
									Zum Kalender
								</NavLink>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Popup;
