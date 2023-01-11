import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import i18n from 'i18n-js';

import { Link } from 'react-router-dom';
import routes from '../../routes/routes';
import styles from './Login.module.scss';
import FormInput from '../../commons/FormInput/FormInput';
import MainButton from '../../commons/MainButton/MainButton';
import { handleUserInfo } from '../../store/actions/user';
import { handleLogin } from '../../store/actions/mainActions';
import Popup from '../../commons/Popup/Popup';
import { LOGIN_USER, USER_TYPE } from '../../store/actionTypes/actionTypes';
import Preloader from '../../components/Preloader/Preloader';

/**
 * @param {object} history
 * @return {JSX.Element}
 * @desc UI for Login Screen
 */

const Login = ({ history }) => {
	const [popupIsActive, setPopupIsActive] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const dispatch = useDispatch();

	const handleClosePopup = () => {
		setPopupIsActive(false);
	};

	const onSubmit = async (values, { setSubmitting }) => {
		await setSubmitting(false);
		setIsSending(true);

		const isLogin = await dispatch(handleLogin(values));

		if (isLogin) {
			setIsSending(false);
			if (localStorage.getItem(USER_TYPE) === 'employer') {
				await history.push(routes.HOME_PAGE);
				await dispatch(handleUserInfo());
				dispatch({ type: LOGIN_USER });
			}
			if (localStorage.getItem(USER_TYPE) === 'admin') {
				await history.push(routes.EMPLOYERS_LIST);
			}
		} else {
			setIsSending(false);
			await setPopupIsActive(true);
		}
	};

	const validationSchema = Yup.object().shape({
		email: Yup.string().email(i18n.t('validation.invalid-email')).required(i18n.t('validation.require-field')),
		password: Yup.string()
			.min(8, i18n.t('validation.password-length'))
			.matches(/(?!.*[\s])(?=.*[a-z])(?=.*[0-9]).{8,}$/i, i18n.t('validation.password-contain-digit'))
			.required(i18n.t('validation.require-field')),
	});

	return (
		<>
			<Preloader active={isSending} />
			<div className={styles.pageContainer}>
				<Popup visible={popupIsActive} text={`${i18n.t('login-screen.authorization-error')}`} handleClosePopup={handleClosePopup} />

				<section className={styles.authorizationWrapper}>
					<div className={styles.authorizationContainer}>
						<Formik
							initialValues={{
								email: '',
								password: '',
							}}
							validationSchema={validationSchema}
							onSubmit={onSubmit}
							validateOnChange
							validateOnMount
						>
							{({ values, isValid }) => (
								<Form className={styles.formContainer}>
									<h2 className={styles.title}>{i18n.t('login-screen.authorization')}</h2>
									<Field
										name='email'
										label={`${i18n.t('login-screen.email')}`}
										placeholder={`${i18n.t('login-screen.enter-email')}`}
										component={FormInput}
										required
									/>
									<Field
										name='password'
										label={`${i18n.t('login-screen.password')}`}
										type='password'
										placeholder={`${i18n.t('login-screen.enter-password')}`}
										component={FormInput}
										required
									/>
									<Link to={routes.PASSWORD_RECOVERY} className={styles.formLink}>
										{i18n.t('login-screen.recovery-link')}
									</Link>
									<div className={styles.buttonContainer}>
										<MainButton
											type='submit'
											label={`${i18n.t('login-screen.sign-in')}`}
											disabled={!(Object.values(values).every((item) => item) && isValid)}
										/>
									</div>
								</Form>
							)}
						</Formik>
					</div>
				</section>
			</div>
		</>
	);
};

export default Login;
