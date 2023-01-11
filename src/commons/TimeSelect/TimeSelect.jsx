import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './TimeSelect.module.scss';
import { setDurationValid } from '../../store/actions/calendars';

/**
 * @desc Component for choosing interview duration
 * @returns {JSX.Element}
 */
const TimeSelect = ({ setDuration, duration }) => {
	const { isCalendarActive, periodToShow, durationValid } = useSelector((state) => state.calendar);
	const dispatch = useDispatch();
	const [isVisible, setIsVisible] = useState(false);
	const zonesToRender = ['15 min', '20 min', '30 min', '45 min', '60 min', '90 min', '120 min'];
	const selectRef = useRef();

	const handleClickOutside = (e) => {
		if (
			!selectRef.current.contains(e.target) &&
			e.target.id &&
			e.target.id !== 'select' &&
			e.target.parentNode.id &&
			e.target.parentNode.id !== 'select'
		) {
			setIsVisible(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	});

	const handleSelectedTime = (idx) => {
		setDuration(zonesToRender[idx]);
		dispatch(setDurationValid(true));
		setIsVisible(false);
	};

	const optionsHeight = zonesToRender.length * 60 + 10;

	const handleOptionsVisible = () => {
		if (isCalendarActive) {
			setIsVisible(!isVisible);
		}
	};

	return (
		<div className={styles.form__select_container}>
			<div
				role='presentation'
				id='select'
				className={durationValid ? styles.form__select : `${styles.form__select} ${styles.form__select_error}`}
				onClick={handleOptionsVisible}
				style={{ backgroundColor: isCalendarActive ? '#fff' : '#E9E9E9' }}
			>
				<span className={styles.form__text} style={{ cursor: isCalendarActive ? 'pointer' : 'default' }}>
					{isCalendarActive ? duration : (periodToShow && `${+periodToShow.interviewDuration / 60} min`) || ''}
				</span>
				<div
					className={styles.form__triangle}
					style={{ transform: isVisible ? 'rotate(180deg)' : 'rotate(0deg)', display: isCalendarActive ? 'block' : 'none' }}
				/>
			</div>
			<div
				ref={selectRef}
				className={styles.form__options}
				style={{ maxHeight: isVisible ? `${optionsHeight}px` : '0px', display: isCalendarActive ? 'block' : 'none' }}
			>
				{zonesToRender.map((item, idx) => (
					<div key={item} className={styles.form__option}>
						<label htmlFor={item} className={styles.form__checkbox}>
							<>
								<span role='presentation' onClick={() => handleSelectedTime(idx)} className={styles.form__zone}>
									{item}
								</span>
							</>
						</label>
					</div>
				))}
			</div>
		</div>
	);
};

export default TimeSelect;
