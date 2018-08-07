/**
项目未使用

其它方法待补充
https://github.com/joeferraro/react-native-cookies
**/
import _CookieManager  from 'react-native-cookies';
import config from 'future/src/config';

function getCookies(host) {
	return new Promise((resolve, reject) => {
		_CookieManager.get(host, (err, res) => {
			if (err) reject();
			resolve(res);
		})
	})
};

export default class CookieManager {

	static async getCookies(host){
		if(host == undefined)host = config.host;
		return await getCookies(host);
	}

	static async getUser(){
		console.log('user cookies -------------', global.userCookie);
		if(global.userCookie)return global.userCookie;
		const cookies =  await CookieManager.getCookies(config.host)
		return cookies._appUser;
	}

 	// ios only, 所以只是测试用
	static getAll(){
		_CookieManager.getAll((err, res) => {
		  console.log('cookies!');
		  console.log(err);
		  console.log(res);
		});
	}

}
