import i18n from 'i18n-js';
import de from '../assets/locale/de.json';
import sh from '../assets/locale/sh.json';

i18n.translations = { de, sh };
i18n.locale = 'de';

const filters = [
	{
		id: 1,
		type: 'checkbox',
		name: 'Education',
		criteria: [
			{
				name: 'Primary school',
				key: `${i18n.t(`filters.Primary School`)}`,
				selected: false,
			},
			{
				name: 'Basic secondary education',
				key: `${i18n.t(`filters.Basic secondary education`)}`,
				selected: false,
			},
			{
				name: 'Upper secondary education',
				key: `${i18n.t(`filters.Upper secondary education`)}`,
				selected: false,
			},
			{
				name: 'Incomplete higher education',
				key: `${i18n.t(`filters.Incomplete higher education`)}`,
				selected: false,
			},
			{
				name: 'Higher education',
				key: `${i18n.t(`filters.Higher Education`)}`,
				selected: false,
			},
			{
				name: "Bachelor's degree",
				key: `${i18n.t(`filters.Bachelor’s degree`)}`,
				selected: false,
			},
			{
				name: "Master's degree",
				key: `${i18n.t(`filters.Master’s degree`)}`,
				selected: false,
			},
		],
	},
	{
		id: 2,
		type: 'checkbox',
		name: 'Experience',
		criteria: [
			{
				name: 'Office',
				key: `${i18n.t(`filters.Office`)}`,
				selected: false,
			},
			{
				name: 'Technical',
				key: `${i18n.t(`filters.Technical`)}`,
				selected: false,
			},
			{
				name: 'Medical',
				key: `${i18n.t(`filters.Medical`)}`,
				selected: false,
			},
			{
				name: 'Social',
				key: `${i18n.t(`filters.Social`)}`,
				selected: false,
			},
			{
				name: 'Trades',
				key: `${i18n.t(`filters.Trades`)}`,
				selected: false,
			},
			{
				name: 'Administration',
				key: `${i18n.t(`filters.Administration`)}`,
				selected: false,
			},
			{
				name: 'Hospitality',
				key: `${i18n.t(`filters.Hospitality exp`)}`,
				selected: false,
			},
		],
	},
	{
		id: 3,
		type: 'checkbox',
		name: 'Languages',
		criteria: [
			{
				name: 'German',
				key: `${i18n.t(`filters.German`)}`,
				selected: false,
			},
			{
				name: 'English',
				key: `${i18n.t(`filters.English`)}`,
				selected: false,
			},
			{
				name: 'French',
				key: `${i18n.t(`filters.French`)}`,
				selected: false,
			},
			{
				name: 'Russian',
				key: `${i18n.t(`filters.Russian`)}`,
				selected: false,
			},
			{
				name: 'Italian',
				key: `${i18n.t(`filters.Italian`)}`,
				selected: false,
			},
			{
				name: 'Spanish',
				key: `${i18n.t(`filters.Spanish`)}`,
				selected: false,
			},
			{
				name: 'Turkish',
				key: `${i18n.t(`filters.Turkish`)}`,
				selected: false,
			},
		],
	},
	{
		id: 4,
		type: 'checkbox',
		name: 'Skills',
		criteria: [
			{
				name: 'Communication',
				key: `${i18n.t(`filters.Communication`)}`,
				selected: false,
			},
			{
				name: 'Ability to work in a team',
				key: `${i18n.t(`filters.Ability to work in a team`)}`,
				selected: false,
			},
			{
				name: 'Problem-solving skills',
				key: `${i18n.t(`filters.Problem-solving skills`)}`,
				selected: false,
			},
			{
				name: 'Creativity',
				key: `${i18n.t(`filters.Creativity`)}`,
				selected: false,
			},
			{
				name: 'Work ethic',
				key: `${i18n.t(`filters.Work ethic`)}`,
				selected: false,
			},
			{
				name: 'Interpersonal relations',
				key: `${i18n.t(`filters.Interpersonal relations`)}`,
				selected: false,
			},
			{
				name: 'Time management',
				key: `${i18n.t(`filters.Time management`)}`,
				selected: false,
			},
			{
				name: 'Leadership skills',
				key: `${i18n.t(`filters.Leadership skills`)}`,
				selected: false,
			},
			{
				name: 'Precision and attention to detail',
				key: `${i18n.t(`filters.Precision and attention to detail`)}`,
				selected: false,
			},
		],
	},
	{
		id: 5,
		type: 'checkbox',
		name: 'Job details',
		criteria: [
			{
				name: 'Nursing care',
				key: `${i18n.t(`filters.Nursing care`)}`,
				selected: false,
			},
			{
				name: 'Cleaning',
				key: `${i18n.t(`filters.Cleaning`)}`,
				selected: false,
			},
			{
				name: 'Construction',
				key: `${i18n.t(`filters.Construction`)}`,
				selected: false,
			},
			{
				name: 'Hospitality',
				key: `${i18n.t(`filters.Hospitality`)}`,
				selected: false,
			},
			{
				name: 'Administration/office',
				key: `${i18n.t(`filters.Administration/office`)}`,
				selected: false,
			},
			{
				name: 'Industry',
				key: `${i18n.t(`filters.Industry`)}`,
				selected: false,
			},
			{
				name: 'Education/social',
				key: `${i18n.t(`filters.Education/social`)}`,
				selected: false,
			},
			{
				name: 'In any field',
				key: `${i18n.t(`filters.In any field`)}`,
				selected: false,
			},
		],
	},
	{
		id: 6,
		type: 'range',
		name: 'Age',
	},
	{
		id: 7,
		type: 'checkbox',
		name: 'Country',
		criteria: [
			{
				name: 'EU Citizen',
				selected: false,
			},
			{
				name: 'Non EU Citizen',
				selected: false,
			},
		],
	},
	{
		id: 8,
		type: 'checkbox',
		name: 'Status',
		criteria: [
			{
				name: 'Available',
				key: 0,
				selected: false,
			},
			{
				name: 'Invited',
				key: 1,
				selected: false,
			},
			{
				name: 'Confirmed',
				key: 2,
				selected: false,
			},
			{
				name: 'Open',
				key: 3,
				selected: false,
			},
			{
				name: 'Hired',
				key: 4,
				selected: false,
			},
			{
				name: 'Rejected',
				key: 5,
				selected: false,
			},
			{
				name: `Didn't show up`,
				key: 6,
				selected: false,
			},
		],
	},
];

export default filters;
