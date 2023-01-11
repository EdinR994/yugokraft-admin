import React, { useEffect, useRef, useState } from 'react';
import { uuid } from 'uuidv4';
import i18n from 'i18n-js';
import styles from './DocsRequestForm.module.scss';

/**
 *
 * @return {JSX.Element}
 * @desc function for creating UI of form for requesting documents
 */
const DocsRequestForm = ({ selectText, setSelectText, checkList, setCheckList, note, setNote }) => {
	const [isOptionsVisible, setOptionsVisible] = useState(false);

	const myRef = useRef();

	const handleClickOutside = (e) => {
		if (!myRef.current.contains(e.target) && e.target.id !== 'select' && e.target.parentNode.id !== 'select') {
			setOptionsVisible(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	});

	const documents = [
		'CV',
		'CV translated in German or English',
		'Diploma',
		'Diploma translated in German or English',
		'Certificates',
		'Certificates translated in German or English',
		'References',
		'References translated in German or English',
		'Biometric Photo',
		'Valid Passport',
	];

	const optionsHeight = documents.length * 60;

	const handleDocument = (item, e) => {
		if (e.target.checked === true) {
			if (selectText[0] === i18n.t('documents.Select documents')) {
				setSelectText([item]);
				setCheckList({ ...checkList, [item]: true });
			} else {
				setSelectText([...selectText, item]);
				setCheckList({ ...checkList, [item]: true });
			}
		} else {
			if (selectText.filter((doc) => doc !== item).length === 0) {
				setSelectText([i18n.t('documents.Select documents')]);
				setCheckList({ ...checkList, [item]: false });
				return;
			}
			setSelectText(selectText.filter((doc) => doc !== item));
			setCheckList({ ...checkList, [item]: false });
		}
	};

	return (
		<div className={styles.form__container}>
			<span className={styles.form__heading}>{i18n.t(`request-form.If you have any comments`)}</span>
			<div className={styles.form__select_container}>
				<div role='presentation' id='select' className={styles.form__select} onClick={() => setOptionsVisible(!isOptionsVisible)}>
					<span className={styles.form__text}>{selectText.join(', ')}</span>
					<div className={styles.form__triangle} style={{ transform: isOptionsVisible ? 'rotate(180deg)' : 'rotate(0deg' }} />
				</div>
				<div ref={myRef} className={styles.form__options} style={{ maxHeight: isOptionsVisible ? `${optionsHeight}px` : '0px' }}>
					{documents.map((item) => (
						<div key={uuid()} className={styles.form__option}>
							<label htmlFor={item} className={styles.form__checkbox}>
								<input
									type='checkbox'
									id={item}
									checked={checkList[i18n.t(`request-form.${item}`)]}
									onChange={(e) => handleDocument(i18n.t(`request-form.${item}`), e)}
								/>
								<span>{i18n.t(`request-form.${item}`)}</span>
							</label>
						</div>
					))}
				</div>
			</div>
			<textarea placeholder='Ihre Nachricht' className={styles.form__textarea} value={note} onChange={setNote} />
		</div>
	);
};

export default DocsRequestForm;
