// 对store做修改
import * as types from '../actions/ActionTypes';
// 初始化state.Blank
const initialState = {};

export default function Blank(state = initialState, action = {}) {
	switch (action.type) {
		case types.BLANK_DETAIL:
			return Object.assign(
				{}, state, action.data
			);
		case types.BLANK_RESET:
			return {};
		default:
			return state;
	}
}