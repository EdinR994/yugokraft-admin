import React, { useState } from 'react';
import i18n from 'i18n-js';
import { useDispatch, useSelector } from 'react-redux';
import styles from './PersonalInfo.module.scss';
import toggleImage from '../../assets/img/pass.svg';
import toggleImageHidden from '../../assets/img/passhide.svg';
import Preloader from '../../components/Preloader/Preloader';
import { handleSetPasswordForRegistered, setErrorMessage } from '../../store/actions/user';
import Popup from '../../commons/Popup/Popup';

/**
 * @return {JSX.Element}
 * @desc UI for Personal Info
 */
const regExp = /(?!.*[\s])(?=.*[a-z])(?=.*[0-9]).{8,}$/i;
const PersonalInfo = () => {
	const dispatch = useDispatch();
	const [isSended, setIsSended] = useState(false);
	const { message } = useSelector((state) => state.mainReducer);
	const infoFromStorage = JSON.parse(localStorage.getItem('USER'));

	const [inputs, setInputs] = useState({
		password: '',
		confirmation: '',
	});

	const [isFieldsVisible, setIsFieldsVisible] = useState({
		password: false,
		confirmation: false,
	});

	const [isFieldsValid, setIsFieldsValid] = useState({
		password: true,
		confirmation: true,
	});
	const [isSending, setIsSending] = useState(false);
	const [incorrectText, setIncorrectText] = useState('clear');
	const errorTexts = {
		clear: '',
		toShort: 'Passwort muß mindestens 8 Zeichen enthalten',
		withoutLetter: 'Passwort muß mindestens eine Großbuchstabe enthalten',
	};

	const handlePassword = (event) => {
		const { name, value } = event.target;
		setInputs({
			...inputs,
			[name]: value.trim(),
		});
		setIncorrectText('clear');
	};

	const togglePasswordVisible = (event) => {
		const { name } = event.target;
		setIsFieldsVisible({
			...isFieldsVisible,
			[name]: !isFieldsVisible[name],
		});
	};

	const onSubmit = async (event) => {
		event.preventDefault();

		if (inputs.password.length < 8) {
			setIsFieldsValid({
				confirmation: false,
				password: !isFieldsValid.password,
			});
			setIncorrectText('toShort');
			return;
		}

		if (!regExp.test(inputs.password)) {
			setIsFieldsValid({
				confirmation: false,
				password: false,
			});
			setIncorrectText('withoutLetter');
			return;
		}

		if (inputs.password !== inputs.confirmation) {
			setIsFieldsValid({
				...isFieldsValid,
				confirmation: false,
			});
			return;
		}

		setIsSending(true);
		await dispatch(handleSetPasswordForRegistered(inputs));
		setIsSended(true);
		setInputs({
			password: '',
			confirmation: '',
		});
		setIsSending(false);
		setIsFieldsValid({
			confirmation: true,
			password: true,
		});
	};

	const handleClosePopup = () => {
		setIsSended(false);
		dispatch(setErrorMessage(null));
	};

	return (
		<>
			<Preloader active={isSending} />
			<Popup text={!message ? 'Das Passwort wurde geändert' : 'Try again latter'} visible={isSended} handleClosePopup={handleClosePopup} />
			<div className={styles.formContainer}>
				<h1 className={styles.formHeading}>{i18n.t('personal-info.heading')}</h1>
				<span className={styles.personalFieldName}>{i18n.t('personal-info.name')}</span>
				<div className={styles.personalData}>
					<span className={styles.personalData__text}>{infoFromStorage.name}</span>
				</div>
				<span className={styles.personalFieldName}>{i18n.t('personal-info.email')}</span>
				<div className={styles.personalData}>
					<span className={styles.personalData__text}>{infoFromStorage.email}</span>
				</div>
				<span className={styles.personalFieldName}>{i18n.t('personal-info.company')}</span>
				<div className={styles.personalData}>
					<span className={styles.personalData__text}>{infoFromStorage.company}</span>
				</div>
				<form className={styles.infoForm} onSubmit={onSubmit}>
					<label htmlFor='password' className={styles.formLabel}>
						<span className={styles.personalFieldName}>{i18n.t('personal-info.new-password')}</span>
						<input
							type={isFieldsVisible.password ? 'text' : 'password'}
							id='password'
							name='password'
							className={isFieldsValid.password ? styles.formInput : `${styles.formInput} ${styles.formInput_invalid}`}
							placeholder={i18n.t('personal-info.enter-password')}
							value={inputs.password}
							onChange={handlePassword}
							onClick={() => {
								setIsFieldsValid({ ...isFieldsValid, password: true });
								setIncorrectText('clear');
							}}
						/>
						<button type='button' name='password' onClick={togglePasswordVisible} className={styles.formButton}>
							<img
								name='password'
								src={isFieldsVisible.password ? toggleImage : toggleImageHidden}
								alt='show password'
								className={styles.togglePassword}
							/>
						</button>
					</label>
					<span className={styles.errorMessage}>{errorTexts[incorrectText]}</span>

					<label htmlFor='confirmation' className={styles.formLabel}>
						<span className={`${styles.personalFieldName} ${styles.nameConfirm}`}>{i18n.t('personal-info.repeat-password')}</span>
						<input
							type={isFieldsVisible.confirmation ? 'text' : 'password'}
							id='confirmation'
							name='confirmation'
							className={isFieldsValid.confirmation ? styles.formInput : `${styles.formInput} ${styles.formInput_invalid}`}
							placeholder={i18n.t('personal-info.repeat-new-password')}
							value={inputs.confirmation}
							onChange={handlePassword}
							onClick={() => setIsFieldsValid({ ...isFieldsValid, confirmation: true })}
						/>
						<button type='button' name='confirmation' onClick={togglePasswordVisible} className={styles.formButton}>
							<img
								name='confirmation'
								src={isFieldsVisible.confirmation ? toggleImage : toggleImageHidden}
								alt='show password'
								className={styles.togglePassword}
							/>
						</button>
					</label>
					<button type='submit' className={styles.submitButton}>
						<span className={styles.buttonText}>{i18n.t('personal-info.button')}</span>
					</button>
				</form>
			</div>
		</>
	);
};

export default PersonalInfo;
