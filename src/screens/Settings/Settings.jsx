import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import i18n from 'i18n-js';
import styles from './Settings.module.scss';
import Preloader from '../../components/Preloader/Preloader';
import Popup from '../../commons/Popup/Popup';
import { getSettingsDays, setErrorMessage, setSettingsDays } from '../../store/actions/user';
import { START_LOADING } from '../../store/actionTypes/actionTypes';

/**
 * @param {object} history
 * @return {JSX.Element}
 * @desc UI for User Settings
 */

const Settings = ({ history }) => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getSettingsDays());
		const role = localStorage.getItem('USER_TYPE');
		if (role !== 'admin') history.push('/');
	}, []);
	const [quantity, setQuantity] = useState('');
	const [isFieldValid, setIsFieldValid] = useState(true);
	const [isFormSubmitted, setIsFormSubmitted] = useState(false);
	const { message, days, isLoaderActive } = useSelector((state) => state.user);

	const handleFocus = () => setIsFieldValid(true);

	const onSubmit = async (event) => {
		event.preventDefault();
		if (quantity > 5 && quantity <= 100) {
			dispatch({ type: START_LOADING });

			await dispatch(setSettingsDays(quantity));
			await dispatch(getSettingsDays());
			setIsFormSubmitted(true);
			setQuantity('');
		} else {
			setIsFieldValid(false);
		}
	};

	const handleChange = (event) => {
		const { value } = event.target;
		setQuantity(
			value
				.replace(/^0|[^(0-9)]/g, '')
				.trim()
				.slice(0, 3),
		);
	};

	const handleClosePopup = () => {
		setIsFormSubmitted(false);
		dispatch(setErrorMessage(''));
	};

	return (
		<>
			<Preloader active={isLoaderActive} />
			<Popup visible={isFormSubmitted} text={message || 'Ihre Nachricht wurde gesendet'} handleClosePopup={handleClosePopup} />
			<div className={styles.settings__formContainer}>
				<h1 className={styles.settings__formHeading}>{i18n.t('settings.heading')}</h1>
				<div className={styles.settings__text}>{i18n.t('settings.text')}</div>
				<form className={styles.settings__form} onSubmit={onSubmit}>
					<label htmlFor='email'>
						<fieldset className={isFieldValid ? styles.settings__fieldset : `${styles.settings__fieldset} ${styles.border_red}`}>
							<legend className={styles.settings__legend}>{i18n.t('settings.quantity-of-days')}</legend>
							<div>
								<input
									type='text'
									id='quantity'
									name='quantity'
									className={styles.settings__input}
									value={quantity}
									onChange={handleChange}
									onClick={handleFocus}
									placeholder={`aktuelle Anzahl der Tage ist ${days || ''}`}
								/>
							</div>
						</fieldset>
					</label>
					<span className={styles.settings__description} style={{ color: isFieldValid ? '#09101d' : '#ff0000' }}>
						{isFieldValid ? i18n.t('settings.problem') : 'Tragen Sie die Anzahl der Tage zwischen 6 und 100 ein'}
					</span>
					<button type='submit' className={styles.submitButton}>
						<span className={styles.buttonText}>{i18n.t('settings.button-text')}</span>
					</button>
				</form>
			</div>
		</>
	);
};

export default Settings;
