import * as types from '../actions/ActionTypes';

const initialState = {
	unReadNum: 0,
}



export default function MsgInfo(state = initialState, action = {}) {
	switch (action.type) {
		case types.SET_MSGNUMBER:
			return Object.assign(
				{}, state, { unReadNum : action.data }
			)
		default:
			return state;
	}
}
