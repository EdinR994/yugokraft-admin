import React from 'react';
import { uuid } from 'uuidv4';
import i18n from 'i18n-js';
import styles from './StatisticsCategory.module.scss';

/**
 * @param {object} category
 * @return {JSX.Element}
 * @desc UI for category card
 */

const StatisticsCategory = ({ category }) => {
	const fields = Object.values(category[1]);
	return (
		fields[0] !== 'detailedInfo' && (
			<div className={styles.category}>
				<div className={styles.category__header}>
					<div className={styles.category__category}>{i18n.t(`statistics.headers.${fields[0]}`)}</div>
					<div className={styles.category__views}>{i18n.t(`statistics.headers.Views`)}</div>
				</div>
				<ul className={styles.category__list}>
					{fields[1].map((item) => (
						<li className={styles.category__item} key={uuid()}>
							<div className={styles.category__name}>{item.key}</div>
							<div className={styles.category__quantity}>{item.count}</div>
						</li>
					))}
				</ul>
			</div>
		)
	);
};

export default StatisticsCategory;
