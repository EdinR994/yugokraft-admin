import React from 'react';
import { useSelector } from 'react-redux';
import i18n from 'i18n-js';

import './App.scss';
import BackgroundContainer from './screens/BackgroundContainer/BackgroundContainer';
import de from './assets/locale/de.json';
import sh from './assets/locale/sh.json';
import en from './assets/locale/en.json';

function App() {
	const { language } = useSelector((state) => state.languageReducer);
	i18n.fallbacks = true;
	i18n.translations = { de, sh, en };
	i18n.locale = language;
	return <BackgroundContainer />;
}

export default App;
