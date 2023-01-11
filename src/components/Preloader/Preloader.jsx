import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

import styles from './Preloader.module.scss';

/**
 * @param {bool} active
 * @return {*|JSX.Element}
 * @desc Spinner
 */

const Preloader = ({ active }) => {
	return (
		active && (
			<div>
				<div className={styles.preloaderContainer}>
					<ProgressSpinner style={{ width: '100px', height: '100px' }} strokeWidth='5' animationDuration='.7s' fill='transparent' />
				</div>
			</div>
		)
	);
};

export default Preloader;
