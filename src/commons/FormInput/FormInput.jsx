import React from 'react';
import { InputText } from 'primereact/inputtext';
import { getIn } from 'formik';
import styles from './FormInput.module.scss';

/**
 * @desc function for creating custom input
 * @param {object} field
 * @param {object} form
 * @param {object} meta
 * @param {string} placeholder
 * @param {string} type
 * @param {string} defaultValue
 * @param {object} props
 * @returns {JSX.Element}
 */
const FormInput = ({ field, form, meta, placeholder, type = 'text', defaultValue, ...props }) => {
	const error = getIn(form.errors, field.name);
	const touch = getIn(form.touched, field.name);

	const { required, label } = props;

	return (
		<>
			<span className={required ? styles.formLabelRequired : styles.formLabel}>
				{label} <span className={styles.redStar}>*</span>
			</span>
			<InputText
				{...field}
				{...props}
				className={touch && error ? styles.inputTextError : styles.inputText}
				placeholder={placeholder}
				type={type}
			/>
			<div className={touch && error ? styles.formErrorVisible : styles.formError}>{error}</div>
		</>
	);
};

export default FormInput;
