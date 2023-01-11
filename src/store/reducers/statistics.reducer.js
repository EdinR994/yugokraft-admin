import { SET_STATISTICS_ALL, SET_STATISTICS_EXPERIENCE, SET_STATISTICS_SPECIALIZATION } from '../actionTypes/actionTypes';

const initialState = {
	statisticsAll: [],
	statisticsExperience: [],
	statisticsSpecialization: [],
};

const statisticsReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_STATISTICS_ALL:
			return { ...state, statisticsAll: action.payload };
		case SET_STATISTICS_EXPERIENCE:
			return { ...state, statisticsExperience: action.payload };
		case SET_STATISTICS_SPECIALIZATION:
			return { ...state, statisticsSpecialization: action.payload };
		default:
			return state;
	}
};

export default statisticsReducer;
