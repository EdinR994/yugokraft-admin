import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { Field, Form, Formik } from 'formik';
import { useDispatch } from 'react-redux';

import * as Yup from 'yup';
import i18n from 'i18n-js';
import styles from './Registration.module.scss';
import FormInput from '../../commons/FormInput/FormInput';
import MainButton from '../../commons/MainButton/MainButton';
import { handleRegistration } from '../../store/actions/user';
import Popup from '../../commons/Popup/Popup';
import routes from '../../routes/routes';
import Preloader from '../../components/Preloader/Preloader';

/**
 * @param {object} history
 * @return {JSX.Element}
 * @desc UI for Registration screen
 */

const Registration = ({ history }) => {
	const [isLoaderActive, setIsLoaderActive] = useState(false);
	const [isRejected, setIsRejected] = useState(false);
	const tokenParam = useLocation().search;
	const token = tokenParam.split('=')[1];
	const dispatch = useDispatch();

	const [popupIsActive, setPopupIsActive] = useState(false);

	const handleClosePopup = () => {
		setPopupIsActive(false);
	};
	const handleClosePopupOk = () => {
		history.push(routes.LOGIN_PAGE);
	};

	const validationSchema = Yup.object().shape({
		password: Yup.string()
			.min(8, i18n.t('validation.password-length'))
			.matches(/(?!.*[\s])(?=.*[a-z])(?=.*[0-9]).{8,}$/i, i18n.t('validation.password-contain-digit'))
			.required(i18n.t('validation.require-field')),
		confirmPassword: Yup.string()
			.required(i18n.t('validation.require-field'))
			.test('passwords-match', i18n.t('validation.password-match'), function (value) {
				// eslint-disable-next-line react/no-this-in-sfc
				return this.parent.password === value;
			}),
	});

	const onSubmit = async (values, { setSubmitting }) => {
		setIsLoaderActive(true);
		await setSubmitting(false);
		const isRegistration = await dispatch(handleRegistration(values, token));
		setIsLoaderActive(false);
		if (isRegistration) {
			setPopupIsActive(true);
		} else {
			setIsRejected(true);
			await setPopupIsActive(true);
		}
	};

	return (
		<>
			<Preloader active={isLoaderActive} />
			<div className={styles.pageContainer}>
				<Popup
					visible={popupIsActive}
					text={
						isRejected ? `${i18n.t('registration-screen.registration-error')}` : `${i18n.t('registration-screen.registration-success')}`
					}
					handleClosePopup={isRejected ? handleClosePopup : handleClosePopupOk}
				/>

				<section className={styles.authorizationWrapper}>
					<div className={styles.authorizationContainer}>
						<Formik
							initialValues={{
								password: '',
								confirmPassword: '',
							}}
							validationSchema={validationSchema}
							onSubmit={onSubmit}
							validateOnChange
							validateOnMount
						>
							{({ values, isValid }) => (
								<Form className={styles.formContainer}>
									<h2 className={styles.title}>{`${i18n.t('registration-screen.registration')}`}</h2>
									<Field
										name='password'
										type='password'
										label={`${i18n.t('registration-screen.password')}`}
										placeholder={`${i18n.t('registration-screen.enter-password')}`}
										component={FormInput}
										required
									/>
									<Field
										name='confirmPassword'
										type='password'
										label={`${i18n.t('registration-screen.password')}`}
										placeholder={`${i18n.t('registration-screen.enter-password')}`}
										component={FormInput}
										required
									/>
									<div className={styles.buttonContainer}>
										<MainButton
											type='submit'
											label={`${i18n.t('registration-screen.sign-up')}`}
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

export default Registration;
