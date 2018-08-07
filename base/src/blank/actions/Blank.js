import * as types from './ActionTypes';
import { Fetch } from 'future/src/lib';

// Action 创建函数
function saveBlank(data) {
	return {
		type: types.BLANK_DETAIL,
		data
	}
}
// Action 使用创建函数
export function getBlank(type = 'normal') {
	return (dispatch) => {
		return new Fetch({
			url: 'app/cart.json',
			data: {
				type: type
			}
		}).dofetch().then((data) => {
      // console.log('actions',data);
			dispatch(saveBlank(data.result));
			return data.result;
		});
	}
}

export function resetBlank() {
	return {
		type: types.BLANK_RESET,
		data: {}
	}
}