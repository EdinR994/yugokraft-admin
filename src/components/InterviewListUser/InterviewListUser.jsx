import React from 'react';
import { useDispatch } from 'react-redux';
import { SET_CURRENT_USER, SET_POPUP_WITH_INFO } from '../../store/actionTypes/actionTypes';
import styles from './InterviewListUser.module.scss';

/**
 * @desc function for creating UI for cell with candidate in Calendar Table
 * @param person
 * @param cellWidth
 * @returns {JSX.Element}
 */
const InterviewListUser = ({ person, cellWidth }) => {
	const dispatch = useDispatch();
	const handleOpenPopup = () => {
		dispatch({ type: SET_CURRENT_USER, payload: person });
		dispatch({ type: SET_POPUP_WITH_INFO });
	};

	return (
		<>
			<div
				className={styles.person}
				style={{
					width: `${cellWidth}px`,
					height: `${person.height}px`,
					lineHeight: `${person.height}px`,
					top: `${person.marginTop}px`,
				}}
				onClick={handleOpenPopup}
				role='presentation'
			>
				<span>{person.name}</span>
			</div>
		</>
	);
};

export default InterviewListUser;
