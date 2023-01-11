/**
 * @desc function for email validation
 * @param email
 * @returns {boolean}
 */
const validateEmail = (email) => {
	const regexp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
	return regexp.test(email);
};

export default validateEmail;
