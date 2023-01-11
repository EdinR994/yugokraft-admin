import React, { useState } from 'react';
import i18n from 'i18n-js';
import { useDispatch, useSelector } from 'react-redux';
import Popup from '../../commons/Popup/Popup';
import Preloader from '../../components/Preloader/Preloader';
import styles from './Support.module.scss';
import { getSupport, setErrorMessage } from '../../store/actions/user';

/**
 * @return {JSX.Element}
 * @desc UI for Support Screen
 */

const Support = () => {
	const [formData, setFormData] = useState({
		email: '',
		message: '',
	});

	const [isEmailValid, setIsEmailValid] = useState(true);
	const [isMessageValid, setIsMessageValid] = useState(true);
	const [isFormSubmitted, setIsFormSubmitted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { message } = useSelector((state) => state.mainReducer);
	const dispatch = useDispatch();

	const handleChange = (event) => {
		const { name } = event.target;
		setFormData({
			...formData,
			[name]: event.target.value.slice(0, 500),
		});
	};

	const onSubmit = async (event) => {
		const regEmail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
		event.preventDefault();
		if (!regEmail.test(`${formData.email}`)) {
			setIsEmailValid(false);
			if (formData.message.length < 2 || formData.message.length > 500) {
				setIsMessageValid(false);
				return;
			}
			return;
		}
		if (formData.message.length < 2 || formData.message.length > 500) {
			setIsMessageValid(false);
			return;
		}
		if (isMessageValid && isEmailValid) {
			setIsLoading(true);
			await dispatch(getSupport(formData));

			setIsLoading(false);
			setIsFormSubmitted(true);
		}
	};

	const handleFocus = (event) => {
		const { name } = event.target;

		switch (name) {
			case 'message':
				setIsMessageValid(true);
				break;

			case 'email':
				setIsEmailValid(true);
				break;

			default:
				break;
		}
	};

	const handleClosePopup = () => {
		dispatch(setErrorMessage(''));
		setIsFormSubmitted(false);
		setFormData({
			email: '',
			message: '',
		});
	};

	return (
		<>
			<Preloader active={isLoading} />
			<Popup visible={isFormSubmitted} text={message || 'Ihre Nachricht wurde gesendet'} handleClosePopup={handleClosePopup} />
			<div className={styles.support__formContainer}>
				<h1 className={styles.support__formHeading}>{i18n.t('support.heading')}</h1>
				<div className={styles.support__text}>{i18n.t('support.text')}</div>
				<form className={styles.support__form} onSubmit={onSubmit}>
					<label htmlFor='email'>
						<fieldset className={isEmailValid ? styles.support__fieldset : `${styles.support__fieldset} ${styles.border_red}`}>
							<legend className={styles.support__legend}>
								{i18n.t('support.email')}
								<span className={styles.support__star}>*</span>
							</legend>
							<div>
								<input
									type='text'
									id='email'
									name='email'
									className={styles.support__input}
									value={formData.email}
									onChange={handleChange}
									onClick={handleFocus}
								/>
							</div>
						</fieldset>
					</label>
					<span className={styles.support__description}>{i18n.t('support.enter-email')}</span>
					<textarea
						name='message'
						className={isMessageValid ? styles.support__textarea : `${styles.support__textarea} ${styles.border_red}`}
						id='message'
						placeholder={i18n.t('support.placeholder')}
						onChange={handleChange}
						onClick={handleFocus}
						value={formData.message}
					/>
					{!formData.message.length && <span className={styles.support__description}>{i18n.t('support.problem')}</span>}
					{formData.message && (
						<span className={styles.support__description}>
							{`Available for input ${500 - formData.message.length} out of 500 characters `}
						</span>
					)}
					<span
						className={`${styles.support__description} ${styles.support__error}`}
						style={{ visibility: isMessageValid ? 'hidden' : 'visible' }}
					>
						Enter from 2 to 500 characters
					</span>
					<button type='submit' className={styles.submitButton}>
						<span className={styles.buttonText}>{i18n.t('support.button-text')}</span>
					</button>
				</form>
			</div>
		</>
	);
};

export default Support;
