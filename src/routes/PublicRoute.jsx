import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import routes from './routes';
import { TOKEN } from '../store/actionTypes/actionTypes';

const PublicRoute = ({ component: Component, ...rest }) => {
	const token = localStorage.getItem(TOKEN);

	return <Route {...rest} render={(props) => (!token ? <Component {...props} /> : <Redirect to={routes.HOME_PAGE} />)} />;
};

export default PublicRoute;
