import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import routes from './routes';
import { TOKEN } from '../store/actionTypes/actionTypes';

const PrivateRoute = ({ component: Component, ...rest }) => {
	const token = localStorage.getItem(TOKEN);

	return <Route {...rest} render={(props) => (token ? <Component {...props} /> : <Redirect to={routes.LOGIN_PAGE} />)} />;
};

export default PrivateRoute;
