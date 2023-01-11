import React, { useEffect, useState } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import i18n from 'i18n-js';
import { useDispatch, useSelector } from 'react-redux';
// import Dropdown from 'react-dropdown';
import styles from './Header.module.scss';
import routes from '../../routes/routes';
import logo from '../../assets/img/logo.svg';
import { FULL_NAME, USER_TYPE, TOKEN, USER_ID, USER, LOGOUT } from '../../store/actionTypes/actionTypes';
import { setModalIsOpen } from '../../store/actions/mainActions';
import { handleLogoutRequest } from '../../store/actions/user';
import Popup from '../../commons/Popup/Popup';
import 'react-dropdown/style.css';

/**
 * @desc function for Header UI
 * @param {object} match
 * @returns {JSX.Element}
 */
const Header = ({ match }) => {
	const { url } = match;
	const [exitModalIsOpen, setExitModalIsOpen] = useState(false);
	const { modalIsOpen } = useSelector((state) => state.mainReducer);
	const dispatch = useDispatch();
	const token = localStorage.getItem(TOKEN);
	const history = useHistory();
	const role = localStorage.getItem(USER_TYPE);

	useEffect(() => {
		document.onclick = (e) => {
			if (e.target.id !== 'modal' && modalIsOpen) {
				dispatch(setModalIsOpen(!modalIsOpen));
			}
		};
	});

	const handleLogout = async () => {
		await handleLogoutRequest();
		await localStorage.removeItem(TOKEN);
		await localStorage.removeItem(USER_ID);
		await localStorage.removeItem(FULL_NAME);
		await localStorage.removeItem(USER_TYPE);
		await localStorage.removeItem(USER);
		await history.push(routes.LOGIN_PAGE);
		setExitModalIsOpen(false);
		dispatch({ type: LOGOUT });
		window.location.reload();
	};

	return (
		<header className={styles.headerContainer}>
			<Popup
				visible={exitModalIsOpen}
				text={i18n.t('general.want-logout?')}
				handleClosePopup={() => setExitModalIsOpen(false)}
				labelClose={i18n.t('general.no')}
				cbOk={handleLogout}
			/>
			<div className={styles.leftContainer} />
			<h1 className={styles.logoContainer}>
				<Link to={role === 'employer' ? '/' : routes.EMPLOYERS_LIST} onClick={() => dispatch(setModalIsOpen(false))}>
					<img src={logo} alt='LOGO' />
				</Link>
			</h1>
			<nav className={styles.navContainer}>
				{role === 'employer' && (
					<ul className={styles.navLinks} style={{ visibility: url === routes.LOGIN_PAGE ? 'hidden' : 'visible' }}>
						<li className={styles.navItem}>
							<NavLink exact to={routes.CANDIDATE_LIST} activeClassName={styles.navLinkActive} className={styles.navLink}>
								{i18n.t('header-links.list-of-candidates')}
							</NavLink>
						</li>
						<li className={styles.navItem}>
							<NavLink exact to={routes.PENDING_CANDIDATES} activeClassName={styles.navLinkActive} className={styles.navLink}>
								{i18n.t('header-links.pending-candidates')}
							</NavLink>
						</li>
						<li className={styles.navItem}>
							<NavLink exact to={routes.CALENDAR} activeClassName={styles.navLinkActive} className={styles.navLink}>
								{i18n.t('header-links.calendar')}
							</NavLink>
						</li>
						<li className={styles.navItem}>
							<NavLink exact to={routes.SUPPORT} activeClassName={styles.navLinkActive} className={styles.navLink}>
								{i18n.t('header-links.support')}
							</NavLink>
						</li>
					</ul>
				)}

				{role === 'admin' && (
					<ul className={styles.navLinks} style={{ display: url === routes.LOGIN_PAGE ? 'none' : 'flex' }}>
						<li className={styles.navItem}>
							<NavLink exact to={routes.EMPLOYERS_LIST} activeClassName={styles.navLinkActive} className={styles.navLink}>
								{i18n.t('header-links.list-of-employers')}
							</NavLink>
						</li>
						<li className={styles.navItem}>
							<NavLink exact to={routes.CANDIDATE_LIST} activeClassName={styles.navLinkActive} className={styles.navLink}>
								{i18n.t('header-links.list-of-candidates')}
							</NavLink>
						</li>
						<li className={styles.navItem}>
							<NavLink exact to={routes.STATISTICS} activeClassName={styles.navLinkActive} className={styles.navLink}>
								{i18n.t('header-links.statistics')}
							</NavLink>
						</li>
						<li className={styles.navItem}>
							<NavLink exact to={routes.SETTINGS} activeClassName={styles.navLinkActive} className={styles.navLink}>
								{i18n.t('header-links.settings')}
							</NavLink>
						</li>
					</ul>
				)}
			</nav>
			<div className={styles.rightContainer}>
				{/* <Dropdown
					options={options}
					value={options[0]}
					controlClassName={styles.control}
					arrowClassName={styles.arrow}
					onChange={onSelect}
				/> */}
				{token && (
					<div
						tabIndex={0}
						role='button'
						onKeyPress={() => {}}
						className={styles.menuWrapper}
						onClick={() => dispatch(setModalIsOpen(!modalIsOpen))}
					>
						<span id='modal' className={styles.menuRole}>
							{i18n.t(`general.${role}`)}
						</span>
						<img id='modal-image' src={require('../../assets/img/down-arrow.svg')} alt='down arrow' height={12} width={12} />
						<div className={modalIsOpen ? styles.menuContainer : styles.menuContainerClose}>
							{role === 'employer' && (
								<>
									<Link to={routes.PERSONAL_INFO} className={styles.menuLink}>
										{i18n.t('header-links.personal-account')}
									</Link>
									<div className={styles.menuLine} />
								</>
							)}
							<div
								role='button'
								tabIndex={0}
								onKeyPress={() => {}}
								className={styles.menuLinkContainer}
								onClick={() => setExitModalIsOpen(true)}
							>
								<div className={styles.menuLogout}>{i18n.t('header-links.logout')}</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
