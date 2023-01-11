import React, { useState } from 'react';
import i18n from 'i18n-js';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import styles from './SetPassword.module.scss';
import toggleImage from '../../assets/img/pass.svg';
import toggleImageHidden from '../../assets/img/passhide.svg';
import Preloader from '../../components/Preloader/Preloader';
import Popup from '../../commons/Popup/Popup';
import { handleRegistration, setErrorMessage } from '../../store/actions/user';

/**
 * @desc - Component represents Setting password form.
 * @returns {JSX.Element}
 */

const SetPassword = () => {
	const dispatch = useDispatch();
	const { message } = useSelector((state) => state.mainReducer);
	const tokenParam = useLocation().search;
	const token = tokenParam.split('=')[1];
	const [inputs, setInputs] = useState({
		password: '',
		confirmPassword: '',
	});

	const [isFieldsVisible, setIsFieldsVisible] = useState({
		password: false,
		confirmPassword: false,
	});

	const [isFieldsValid, setIsFieldsValid] = useState({
		password: true,
		confirmPassword: true,
	});
	const [isSending, setIsSending] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handlePassword = (event) => {
		const { name, value } = event.target;
		setInputs({
			...inputs,
			[name]: value.trim(),
		});
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

		if (inputs.password.length < 6) {
			setIsFieldsValid({
				...isFieldsValid,
				password: !isFieldsValid.password,
			});
			return;
		}

		if (inputs.password !== inputs.confirmPassword) {
			setIsFieldsValid({
				...isFieldsValid,
				confirmPassword: !isFieldsValid.confirmPassword,
			});
			return;
		}

		setInputs({
			password: '',
			confirmPassword: '',
		});
		setIsSending(true);
		await dispatch(handleRegistration(inputs, token));
		setIsSubmitted(true);
		setIsSending(false);
	};

	const handleClosePopup = () => {
		setIsSubmitted(false);
		dispatch(setErrorMessage(null));
	};

	return (
		<>
			<Preloader active={isSending} />
			<Popup
				visible={isSubmitted}
				text={!message ? i18n.t('setPassword.popup-message') : 'Try again latter'}
				handleClosePopup={handleClosePopup}
			/>
			<div className={styles.formContainer}>
				<h1 className={styles.formHeading}>Choose a new password</h1>
				<form onSubmit={onSubmit}>
					<label htmlFor='password' className={styles.formLabel}>
						<span className={styles.personalFieldName}>New password</span>
						<input
							type={isFieldsVisible.password ? 'text' : 'password'}
							id='password'
							name='password'
							className={isFieldsValid.password ? styles.formInput : `${styles.formInput} ${styles.formInput_invalid}`}
							placeholder='Enter your new password'
							value={inputs.password}
							onChange={handlePassword}
							onClick={() => setIsFieldsValid({ ...isFieldsValid, password: true })}
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

					<label htmlFor='confirmPassword' className={styles.formLabel}>
						<span className={styles.personalFieldName}>Repeat password</span>
						<input
							type={isFieldsVisible.confirmPassword ? 'text' : 'password'}
							id='confirmPassword'
							name='confirmPassword'
							className={isFieldsValid.confirmPassword ? styles.formInput : `${styles.formInput} ${styles.formInput_invalid}`}
							placeholder='Repeat your new password'
							value={inputs.confirmPassword}
							onChange={handlePassword}
							onClick={() => setIsFieldsValid({ ...isFieldsValid, confirmPassword: true })}
						/>
						<button type='button' name='confirmPassword' onClick={togglePasswordVisible} className={styles.formButton}>
							<img
								name='confirmPassword'
								src={isFieldsVisible.confirmPassword ? toggleImage : toggleImageHidden}
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

export default SetPassword;
