import React from 'react';

import { ProgressSpinner } from 'primereact/progressspinner';
import styles from './Loader.module.scss';

/**
 * @desc function for creating display loader
 * @returns {JSX.Element}
 */
const Loader = () => {
	return (
		<div className={styles.loaderContainer}>
			<ProgressSpinner />
		</div>
	);
};

export default Loader;
