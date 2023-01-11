import React from 'react';
import { Button } from 'primereact/button';

import styles from './MainButton.module.scss';

/**
 * @desc function for creating reusable button component
 * @param {string|null} label
 * @param {boolean} disabled
 * @param {string} type
 * @param {function} onClick
 * @param {function} closeButton
 * @param {object} children
 * @returns {JSX.Element}
 */
const MainButton = ({ label = null, disabled = false, type = 'button', onClick = () => {}, closeButton = false, children }) => {
	const { disabledButton, buttonClose, button } = styles;

	const setClassName = () => {
		if (disabled) {
			return disabledButton;
		}
		if (closeButton) {
			return buttonClose;
		}
		return button;
	};

	return (
		<Button className={setClassName(disabled, closeButton)} disabled={disabled} onClick={onClick} type={type} label={label}>
			{children}
		</Button>
	);
};

export default MainButton;
