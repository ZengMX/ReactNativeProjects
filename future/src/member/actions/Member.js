import * as types from './ActionTypes';
import { Fetch } from 'future/public/lib';

export function setLogined(data) {
	return {
		type: types.USER_LOGINED,
		data
	}
}

export function setUserInfo(data) {
	return {
		type: types.USER_INFO,
		data
	}
}

export function login(data) {
	return (dispatch) => {
		return new Fetch({
			url: 'app/user/login.json',
			data: data,
			forbidToast: true,
		}).dofetch().then((data) => {
			if (data.isApprove) {
				dispatch(setLogined(true));
				dispatch(getUser());
			}
			return data;
		});
	}
}

export function logout() {
	return (dispatch) => {
		return new Fetch({
			url: 'app/user/exit.json',
			method: 'POST',
			forbidToast: true,
		}).dofetch().then((data) => {
			dispatch(setLogined(false));
			dispatch(setUserInfo(undefined));
			return data;
		});
	}
}

export function getUser() {
	return (dispatch) => {
		return new Fetch({
			url: '/app/user/getUser.json',
			method: "POST",
		}).dofetch().then((data) => {
			dispatch(setUserInfo(data.result));
			return data.result;
		}).catch((err) => {
			dispatch(setLogined(false));
			dispatch(setUserInfo(undefined));
		});
	}
}