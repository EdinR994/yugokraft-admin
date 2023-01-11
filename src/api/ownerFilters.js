import i18n from 'i18n-js';
import de from '../assets/locale/de.json';
import sh from '../assets/locale/sh.json';

i18n.translations = { de, sh };
i18n.locale = 'de';

const ownerFilters = [
	{
		id: 9,
		type: 'date',
		name: 'Registration date',
	},
	{
		id: 10,
		type: 'range',
		name: 'Interviewed candidates',
	},
	{
		id: 11,
		type: 'range',
		name: 'Hired candidates',
	},
];

export default ownerFilters;
