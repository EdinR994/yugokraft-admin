import React, { useState } from 'react';
import i18n from 'i18n-js';
import { useDispatch, useSelector } from 'react-redux';
import styles from './PasswordRecovery.module.scss';
import Preloader from '../../components/Preloader/Preloader';
import Popup from '../../commons/Popup/Popup';
import validateEmail from '../../Helpers/validators';
import { resetPassword, setPasswordReseted } from '../../store/actions/user';

/**
 * @desc - Component representing password recovery form
 * @param {object} history - route history.
 * @return {JSX.Element} - markup
 */

const PasswordRecovery = ({ history }) => {
	const [email, setEmail] = useState('');
	const [isSending, setIsSending] = useState(false);
	const [disabled, setDisabled] = useState(true);

	const dispatch = useDispatch();
	const { passwordReseted, passwordResetError } = useSelector((state) => state.user);

	const handleChange = (e) => {
		const { value } = e.target;
		setEmail(value.trim());

		if (validateEmail(value)) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	};

	const onSubmit = async () => {
		if (email) {
			setIsSending(true);
			await dispatch(resetPassword(email));
			setIsSending(false);
		}
	};

	const handleClosePopup = () => {
		setEmail('');
		dispatch(setPasswordReseted(false));
		history.push('/login');
	};

	return (
		<>
			<Preloader active={isSending} />
			<Popup
				login
				visible={passwordReseted || passwordResetError}
				text={passwordResetError ? i18n.t('passwordRecovery.error-message') : i18n.t('passwordRecovery.poppup-text')}
				handleClosePopup={handleClosePopup}
			/>
			<section className={styles.recovery_section}>
				<div className={styles.container}>
					<h1 className={styles.recovery_heading}>{i18n.t('passwordRecovery.heading')}</h1>
					<p className={styles.recovery_text}>
						Tragen Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link, damit Sie Ihr Passwort zurücksetzen
					</p>
					<input placeholder={i18n.t('passwordRecovery.email')} className={styles.recovery_input} value={email} onChange={handleChange} />
					<button type='submit' className={styles.submitButton} onClick={onSubmit} disabled={disabled}>
						<span className={styles.buttonText}>{i18n.t('passwordRecovery.button')}</span>
					</button>
				</div>
			</section>
		</>
	);
};

export default PasswordRecovery;
