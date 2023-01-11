/**
 * @desc function for showing currently displayed candidates
 * @param {number} page - current page of candidate's list
 * @param {number} totalCandidates
 * @param {number} tableSize
 * @returns {string} - range of currently displayed candidates
 */

const setCurrentRange = (page, totalCandidates, tableSize) => {
	if (!totalCandidates) return `${0}-${0}`;
	let from;
	let to;
	if (totalCandidates < 10) {
		from = 1;
		to = totalCandidates;
	} else if (page !== 0 && page !== Math.floor(totalCandidates / tableSize)) {
		from = page * tableSize + 1;
		to = page * tableSize + tableSize;
	} else if (page === Math.floor(totalCandidates / tableSize)) {
		from = page * tableSize + 1;
		to = totalCandidates;
	} else {
		from = 1;
		to = tableSize;
	}
	return `${from}-${to}`;
};
export default setCurrentRange;
