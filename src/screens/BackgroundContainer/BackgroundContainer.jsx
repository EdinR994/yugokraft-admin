import { createBrowserHistory } from 'history';
import React from 'react';
import MainRoutes from '../../routes/MainRoutes';

/**
 * @desc function for crating top-level container for all components
 * @returns {JSX.Element}
 */
const BackgroundContainer = () => {
	const history = createBrowserHistory();
	return (
		<>
			<MainRoutes history={history} />
		</>
	);
};

export default BackgroundContainer;
