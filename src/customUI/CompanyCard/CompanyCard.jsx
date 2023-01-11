import React from 'react';
import i18n from 'i18n-js';
import styles from './CompanyCard.module.scss';

/**
 * @param {string} image
 * @param {number} countOfEmployers
 * @return {JSX.Element}
 * @desc Company Card UI
 */

const CompanyCard = ({ image, countOfEmployers }) => {
	return (
		<div className={styles.card}>
			<img src={image} alt='company logo' className={styles.card__logo} />
			<div className={styles.card__details}>
				<h1 className={styles.card__heading}>{i18n.t('companyCard.name')}</h1>
				<div className={styles.card__position}># 7 in Bussines</div>
				<span className={styles.card__hired}>{countOfEmployers}+</span>
				<span className={`${styles.card__hired} ${styles.card__hired_small}`}>{i18n.t('companyCard.hired')}</span>
			</div>
			<div className={styles.card__line} />
			<div className={styles.card__description}>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dictumst ut rhoncus diam tristique nunc purus, sodales elit.
				Consectetur egestas nec etiam ut aliquet at nibh. Volutpat euismod ac aliquet pulvinar vestibulum magna lorem nam sodales. Nunc urna
				tortor sit gravida at sit ac. Lorem ipsum dolor sit amet.
			</div>
		</div>
	);
};

export default CompanyCard;
