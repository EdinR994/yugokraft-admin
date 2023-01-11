import React from 'react';
import { useSelector } from 'react-redux';
import { uuid } from 'uuidv4';
import i18n from 'i18n-js';
import styles from './StatisticTable.module.scss';

/**
 * @param {string} criterion
 * @return {JSX.Element}
 * @desc UI for statistics experience and specializations tables
 */

const StatisticTable = ({ criterion }) => {
	const searchList = useSelector((state) => state.statisticsReducer[`statistics${criterion}`]);
	let columnsWidth;
	let headers;
	let preparedStatistic;
	const responseHeaders = ['skills', 'age', 'education', 'experience', 'languages', 'jobDetails', 'country', 'detailedInfo', 'count'];
	const responseHeadersForExperience = [
		'age',
		'skills',
		'education',
		'experience',
		'languages',
		'jobDetails',
		'country',
		'detailedInfo',
		'count',
	];
	switch (criterion) {
		case 'Specialization':
			columnsWidth = {
				Specialization: 15,
				Country: 15,
				Education: 15,
				Experience: 15,
				Languages: 10,
				'Job details': 10,
				Age: 10,
				'Detailed info': 10,
				Count: 0,
			};
			headers = ['Specialization', 'Age', 'Education', 'Experience', 'Languages', 'Job details', 'Country', 'Detailed info', 'Count'];
			preparedStatistic = searchList.map((item) => {
				const newKey = Object.entries(item.key);
				if (!newKey.some((category) => category[0] === 'detailedInfo')) {
					newKey.push(['detailedInfo', '']);
				}
				newKey.sort((a, b) => responseHeaders.indexOf(a[0]) - responseHeaders.indexOf(b[0]));
				return { ...item, newKey };
			});
			break;

		case 'Experience':
			columnsWidth = {
				Specialization: 15,
				Country: 15,
				Education: 15,
				Experience: 15,
				Languages: 10,
				'Job details': 10,
				Age: 10,
				'Detailed info': 10,
				Count: 0,
			};
			headers = ['Age', 'Specialization', 'Education', 'Experience', 'Languages', 'Job details', 'Country', 'Detailed info', 'Count'];

			preparedStatistic = searchList.map((item) => {
				const newKey = Object.entries(item.key);
				if (!newKey.some((category) => category[0] === 'detailedInfo')) newKey.push(['detailedInfo', '']);
				newKey.sort((a, b) => responseHeadersForExperience.indexOf(a[0]) - responseHeadersForExperience.indexOf(b[0]));
				return { ...item, newKey };
			});
			break;
		default:
			break;
	}

	return (
		<div>
			<table className={styles.table}>
				<thead>
					<tr className={styles.table__header_row}>
						{headers.map((heading) => (
							<th key={uuid()} className={styles.table__header} style={{ width: `${columnsWidth[heading]}%` }}>
								{i18n.t(`statistics.headers.${heading}`)}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{preparedStatistic.map((item) => (
						<tr className={styles.table__row} key={uuid()}>
							{Object.values(item.newKey).map((value) => (
								<td key={uuid()} className={styles.table__data}>
									{typeof value[1] === 'object' ? value[1].join(', ') : value[1].toString()}
								</td>
							))}
							<td className={styles.table__data}>{item.count}</td>
						</tr>
					))}
					<tr className={styles.table__footer} />
				</tbody>
			</table>
		</div>
	);
};

export default StatisticTable;
