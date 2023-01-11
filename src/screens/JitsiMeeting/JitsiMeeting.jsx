import React, { useEffect, useState } from 'react';
import { Jutsu } from 'react-jutsu';
import { useLocation } from 'react-router';
import jwtDecode from 'jwt-decode';
import styles from './JitsiMeeting.module.scss';
import logo from '../../assets/img/logo-full.png';
import logoDark from '../../assets/img/logo-dark.png';
import interfaceConfig from './interfaceConfig';

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

/**
 * @return {JSX.Element}
 * @desc UI for Video Meeting screen
 */
const JitsiMeeting = () => {
	const query = useQuery();
	const token = query.get('token');
	const [authFields, setAuthFields] = useState({
		name: '',
		room: '',
		password: '',
		call: false,
	});

	useEffect(() => {
		if (token) {
			const decodedAuth = jwtDecode(token);
			setAuthFields({
				name: decodedAuth.name,
				room: decodedAuth.room,
				call: true,
				password: `${decodedAuth.iat}`,
			});
		}
	}, []);

	return (
		<div className={styles.jitsi}>
			{authFields.call ? (
				<div className={styles.jitsi__background}>
					<img src={logo} alt='logo' style={{ marginBottom: '35px' }} />
					<div className={styles.jitsi__container}>
						<Jutsu
							interfaceConfigOverwrite={interfaceConfig}
							containerStyles={{ width: '100%', height: '100%' }}
							roomName={authFields.room}
							displayName={authFields.name}
							password={authFields.password}
							onMeetingEnd={() => {}}
							loadingComponent={<p>loading ...</p>}
							errorComponent={<p>Oops, something went wrong</p>}
						/>
					</div>
				</div>
			) : (
				<div className={styles.jitsi__background}>
					<img src={logo} alt='logo' style={{ marginBottom: '35px' }} />
					<div className={styles.jitsi__container} />
				</div>
			)}
			<footer className={styles.footer}>
				<img src={logoDark} alt='logo' />
				<hr className={styles.footer__line} />
				<span className={styles.footer__text}>WIR VERBINDEN ARBEITSMÄRKTE. FÜR SIE.</span>
			</footer>
		</div>
	);
};

export default JitsiMeeting;
