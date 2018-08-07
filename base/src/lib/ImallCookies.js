/**
 * 操作当前用户的cookie信息
 * 在全局变量userCookie、AsyncStorage（key:'IMALL_COOKIES'）、cookie中同步存取
 */

import config from 'future/src/config';
import Cookie from './Cookie';
import CookieManager from '@imall-test/react-native-cookiemanager';
import moment from 'moment';
import { Platform, AsyncStorage } from 'react-native';


function getUserCookie() {
	return new Promise((resolve, reject) => {
		AsyncStorage.getItem('IMALL_COOKIES', (error, result) => {
			// console.log('=>>>>>>>>>>IMALL_COOKIES', result);
			if (!error && result != null) {
				let c = JSON.parse(result);
				c.origin = config.host;
				c.expires = new moment(c.expires).format('YYYY-MM-DDTHH:mm:ss.sssZ');
				let today = new moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.sssZ');
				if (today > c.expires) {
					return resolve(undefined);
				} else {
					return resolve(c);
				}
			} else {
				return resolve(undefined);
			}
		})

	})
};

export default class {
	static init() {
		AsyncStorage.getItem('IMALL_COOKIES', (error, result) => {
			if (!error && result != null) {
				let c = JSON.parse(result);
				c.origin = config.host;
				c.expires = new moment(c.expires).format('YYYY-MM-DDTHH:mm:ss.sssZ');
				let today = new moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.sssZ');
				if (today > c.expires) {
					AsyncStorage.removeItem('IMALL_COOKIES', () => { });
					if (Platform.OS == 'android') {
						CookieManager.clearByName({ name: c.name, origin: c.origin }, (ret) => {
							// console.log('clearByName removeItem');
						});
					} else if (Platform.OS == 'ios') {
						CookieManager.clearByName(c.name, (ret) => {
							// console.log('clearByName removeItem');
						});
					}
					let tmp = Object.assign({}, c, { value: '' });
					CookieManager.set(tmp, (res) => {
						// console.log("clean cookie 333", res, c);
					});
					return;
				}
				global.userCookie = c;
				CookieManager.set(c, (res) => {
					// console.log("init Set cookie-------------", res, c);
				});
			}
		})
	}

	static async getUser() {
		// console.log('user cookies -------------', global.userCookie);
		if (global.userCookie) return global.userCookie;
		const cookie = await getUserCookie();
		return cookie;
	}

	static setUser(c) {
		c.origin = config.host;
		c.expires = new moment(c.expires).format('YYYY-MM-DDTHH:mm:ss.sssZ');
		let today = new moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.sssZ');
		if (today > c.expires) {
			global.userCookie = null;
			AsyncStorage.removeItem('IMALL_COOKIES', () => { });
			if (Platform.OS == 'android') {
				CookieManager.clearByName({ name: c.name, origin: c.origin }, (ret) => {
					// console.log('synCookies removeItem');
				});
			} else if (Platform.OS == 'ios') {
				CookieManager.clearByName(c.name, (ret) => {
					// console.log('clearByName removeItem');
				});
			}
			let tmp = Object.assign({}, c, { value: '' });
			CookieManager.set(tmp, (res) => {
				// console.log("clean cookie 333", res, c);
			});
			return;
		}
		global.userCookie = c;
		AsyncStorage.setItem('IMALL_COOKIES', JSON.stringify(c));
		CookieManager.set(c, (ret) => {
			// console.log('Set cookie ----2222222---->>>>>>>>', ret, c);
		});
	}

	static clearUser() {
		let c = global.userCookie;
		if (c) {
			// console.log('clearUser', c);
			if (Platform.OS == 'android') {
				CookieManager.clearByName({ name: c.name, origin: c.origin }, (ret) => {
					// console.log('synCookies removeItem');
				});
			} else if (Platform.OS == 'ios') {
				CookieManager.clearByName(c.name, (ret) => {
					// console.log('clearByName removeItem');
				});
			}
			let tmp = Object.assign({}, c, { value: '' });
			CookieManager.set(tmp, (res) => {
				// console.log("clean cookie 333", res, c);
			});
		}
		global.userCookie = undefined;
		AsyncStorage.removeItem('IMALL_COOKIES', () => { });
		//Todo 移除本地Cookie
		// CookieManager.clearAll((ret) => {
		// 	console.log(ret);
		// });
	}

	static clearAll() {
		CookieManager.clearAll((ret) => {
			// console.log(ret);
		});
	}

	static getAll(callback) {
		CookieManager.getAll((ret) => {
			// console.log('cookies!');
			// console.log(ret);
			callback && callback(ret)
		});
	}
}