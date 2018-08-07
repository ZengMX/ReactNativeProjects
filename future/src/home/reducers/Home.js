import * as types from '../actions/ActionTypes';
export default function Home(state = {}, action = {}) {
	switch (action.type) {
		case types.HOME_DATA:
			return Object.assign(
				{}, state, action.data
			)
		default:
			return state;
	}
}
