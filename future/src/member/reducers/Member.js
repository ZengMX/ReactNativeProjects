import * as types from '../actions/ActionTypes';

const initialState = {
	userInfo: undefined,
	isLogin: false
}

export default function SecurityCenter(state = initialState, action = {}) {
	switch (action.type) {
		case types.USER_INFO:
			return Object.assign(
				{}, state, { userInfo: action.data }
			)
		case types.USER_LOGINED:
			return Object.assign(
				{}, state, { isLogin: action.data }
			)
		default:
			return state;
	}
}