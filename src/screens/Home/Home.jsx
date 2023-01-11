import React from 'react';
import styles from './Home.module.scss';
import CompanyCard from '../../customUI/CompanyCard/CompanyCard';
import siemensLogo from '../../assets/img/hotelPhoto.png';
import bayerLogo from '../../assets/img/bayer.png';
import bmwLogo from '../../assets/img/bmw.png';
import { USER_TYPE } from '../../store/actionTypes/actionTypes';
import routes from '../../routes/routes';

/**
 * @return {JSX.Element}
 * @desc Home screen UI
 */

const Home = ({ history }) => {
	const role = localStorage.getItem(USER_TYPE);
	if (role === 'admin') history.push(routes.EMPLOYERS_LIST);

	return (
		<div className={styles.card_container}>
			<CompanyCard image={siemensLogo} countOfEmployers={3000} />
			<CompanyCard image={bayerLogo} countOfEmployers={2000} />
			<CompanyCard image={bmwLogo} countOfEmployers={1500} />
		</div>
	);
};

export default Home;
