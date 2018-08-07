/*
	import Fetch from ‘Fetch’;
	const promise = new Fetch({
		url : string // 请求URL
		method : enum // 请求方式，enum('GET','POST','PUT','DELETE')，默认'POST'
		data : object // 请求参数
		headers : object // 请求头 {key:value}
		bodyType : enum // 请求body类型，enum('form','file','json')，默认'form'
		// credentials : string // 证书,
		returnType : enum // 响应类型，enum('json','text','blob','formData','arrayBuffer')，默认'json'
		timeout : number // 超时时间，毫秒, 默认12000
		forbidToast : forbidToast // 禁用弹出提示
	}).dofetch();

	promise.then((data) => {
        console.log('=> data: ', data);
    })
    .catch((error) => {
        console.log('=> catch: ', error);
    });

*/

// TODO:完成后config替换到public下

import config from 'future/public/config';
import { Toast } from 'future/public/widgets';
import Uri from './Uri';
import Cookie from './Cookie';
import ImallCookies from 'future/public/lib/ImallCookies';
import { Platform, AsyncStorage, NetInfo } from 'react-native';
// import FetchBase from './FetchBase';
// import './FetchBase';
class RequestError {
	constructor(code, object, description) {
		this.code = code;
		this.object = object;
		this.description = description;
	}
}

export default class Fetch {
	constructor(params) {
		// 简单判断是不是包含域名
		if (params.url && params.url.indexOf('http://') == -1) {
			params.url = config.host + params.url;
		}
		this.url = params.url || '';
		this.method = params.method || 'POST';
		this.headers = params.headers || {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		};
		this.body_type = params.bodyType || 'form';
		this.bodys = params.data || {};
		// this.credentials   = params.credentials || 'omit';
		this.return_type = params.returnType || 'json';
		this.timeout = params.timeout || 12000;
		this.show_error = params.show_error || true;
		this.forbidToast = params.forbidToast || false;
	}

	dofetch() {
		let options = {};
		options.method = this.method;
		// options.credentials = this.credentials;

		options.headers = this.headers;

		if ({} != this.bodys && this.method != 'GET') {
			if ('form' == this.body_type) {
				let data = '';
				Object.keys(this.bodys).map((index) => {
					const value = (this.bodys[index] == null || this.bodys[index] == undefined) ? '' : this.bodys[index];
					let param = encodeURI(value);
					data += `${index}=${param}&`;
				});
				options.body = data;
			} else if ('file' == this.body_type) {
				let data = new FormData();
				Object.keys(this.bodys).map((index) => {
					data.append(index, this.bodys[index]);
				});
				options.body = data;
			} else if ('json' == this.body_type) {
				// imalls 定制化 具体可以查看后台的MappingJacksonHttpMessageConverterExt.java类
				options.headers = Object.assign({}, options.headers, { "Content-Type": "application/json; charset=UTF-8" });
				options.body = '_method=post&json=' + JSON.stringify(this.bodys);
			}
		}

		console.log('fetch=>', this, 'options => ', options);
		return Promise.race([
			//正常请求
			fetch(this.url, options),
			// FetchBase.fetch(this.url, options),
			//检查是否超时
			new Promise((resolve, reject) => {
				setTimeout(() => reject(new Error('timeout')), this.timeout);
				// setTimeout(() => reject('requestTimeout'), this.timeout);
			}),
			//检查是否断网
			new Promise((resolve, reject) => {
				if (global.startTime && new Date() - global.startTime > 5000) {
					NetInfo.isConnected.fetch().done((isConnected) => {
						if (global.startTime && new Date() - global.startTime > 5000) {
							if (!isConnected) {
								reject(new Error('noNetwork'));
							}
						}
					});
				}
			}),

		])
			.then((response) => {
				// fix cookie domain与域名不同的问题,
				// TODO 	后期将彻底解决此问题
				try {
					let cookieStr = null;
					if (response.headers.has("Set-Cookie")) {
						cookieStr = response.headers.get("Set-Cookie");
					} else if (response.headers.has("set-cookie")) {
						cookieStr = response.headers.get("set-cookie");
					}
					if (cookieStr) {
						console.log('Set-Cookie      ', cookieStr);
						const cookies = cookieStr.split("Path=/, ");
						console.log('Set-Cookie 2     ', cookies);
						const host = new Uri(config.host).hostname;
						for (var i in cookies) {
							console.log('Set-Cookie 3     ', cookies[i]);
							let c = Cookie.parse(cookies[i]);
							console.log('Set-Cookie 4     ', c, (c.name == '_appUser' && c.domain != host));
							if (c.name == '_appUser' && c.domain != host) {
								console.log('Set cookie to AsyncStorage 5', c);
								c.domain = host;
								ImallCookies.setUser(c);
								break;
							}
						}
					}
				} catch (e) {
					console.error(e);
				}
				return response;
			})
			.then(
			(response) => {
				if ('json' == this.return_type) {
					return response.json();
				} else if ('text' == this.return_type) {
					return response.text();
				} else if ('blob' == this.return_type) {
					return response.blob();
				} else if ('formData' == this.return_type) {
					return response.formData();
				} else if ('arrayBuffer' == this.return_type) {
					return response.arrayBuffer();
				}
			}
			).then((response) => {
				console.log('fetch url = %s', this.url, response);
				return response;
			}).then((response) => {
				/**
				 * 此处处理后台异常
				 * 将后台返回异常信息返回由页面实施者根据实际需要处理
				 *  */
				if (response.errorObject) {
					console.log("response.errorObject", response);
					if (response.errorObject.errorText && this.show_error) {
						!this.forbidToast && Toast.show(response.errorObject.errorText);
					}
					return Promise.reject(new RequestError('500', response.errorObject, '服务器代码执行错误'));
				}
				return response;
			}).catch((error) => {
				/**
				 * 此处处理非后台异常，如网络异常等
				 * 将异常抛出由页面实施者根据实际需要处理
				 *  */
				if (error.message == "noNetwork") {
					!this.forbidToast && Toast.show("网络连接异常，请检查网络设置");
				}
				if (error.message == "timeout") {
					!this.forbidToast && Toast.show("网络连接超时");
				}
				throw error;
			});
	}

}
