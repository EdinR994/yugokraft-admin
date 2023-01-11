/**
 * @desc function for making string from Date object
 * @param {object} date
 * @return {string}
 */
const dateToUrl = (date) => {
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const year = date.getFullYear();
	return `${year}-${month}-${day}`;
};

export default dateToUrl;
