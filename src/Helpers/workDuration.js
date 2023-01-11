/**
 * @desc function for calculating candidate's job duration
 * @param jobs
 * @returns {string}
 */
const workDuration = (jobs) => {
	const time = jobs.map((job) => job.period).reduce((acc, per) => acc + per, 0);
	let duration;
	if (time === 0) duration = '';
	if (time === 1) duration = `${time} year`;
	if (time > 1) duration = `${time} years`;
	return duration;
};

export default workDuration;
