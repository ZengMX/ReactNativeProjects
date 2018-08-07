import * as types from './ActionTypes';
import Fetch from 'future/public/lib/Fetch';
export function setHome(data) {
	return {
		type: types.HOME_DATA,
		data
	}
}

export function getHome() {
	return (dispatch) => {
		return new Fetch({
			url: 'app/index.json',
			mothod: 'GET',
		}).dofetch().then((data) => {
			dispatch(setHome(data.result));
			return data.result;
		});
	}
}
