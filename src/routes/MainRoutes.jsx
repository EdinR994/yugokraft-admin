import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from '../components/Header/Header';
import GeneralLayout from '../components/GeneralLayout/GeneralLayout';
import routes from './routes';

const MainRoutes = ({ history }) => {
	const { pathname } = history.location;
	const isHeader = pathname !== routes.INTERVIEW;
	return (
		<BrowserRouter>
			{isHeader && <Route path='/:params?' exact component={Header} />}
			<Route path='/:params?' exact component={GeneralLayout} />
		</BrowserRouter>
	);
};

export default MainRoutes;
