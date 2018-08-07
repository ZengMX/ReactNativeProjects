import React, { Component } from 'react';
import {
	DeviceEventEmitter,
	PushNotificationIOS,
} from 'react-native';

//自定义环境初始化
import 'future/src/lib/initAPP/InitIndex';

// 启动闪白屏问题,可优化
// import * as launchImage from 'react-native-launch-image';
import SplashScreen from "@imall-test/rn-splash-screen";
import Navigator from 'future/src/Navigator';

// 配置Redux
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
// 引入所有的reducers
import * as reducers from 'future/src/redux/Reducers';

// logger纪录所有Action state
const logger = createLogger();
// applyMiddleware 组合中间件
// thunk判断 action 类型是否是函数，若是，则执行 action，若不是，则继续传递 action 到下个 middleware
let createStoreWithMiddleware = null;
if (__DEV__) {
	createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore);
} else {
	createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
}
// combineReducers 把多个不同reducer函数合并成一个最终的reducer 函数.
const reducer = combineReducers(reducers);
// createStore 创建一个 Redux store 来以存放应用中所有的 state
const store = createStoreWithMiddleware(reducer);

// 根组件应该嵌套在 <Provider> 中，<Provider store> 使下级组件使用connect()方法绑定Redux store
export default class Main extends Component {
	render() {
		return (
			<Provider store={store}>
				<App />
			</Provider>
		);
	}
}

class App extends Component {
	async componentDidMount() {
		// 解决白屏问题
		// if (IS_IOS) {
		// 	launchImage.hide();
		// } else {
		SplashScreen.hide();
		// }
		//添加监听,接受极光推送消息,IS_IOS是全局变量,在base/src/lib/initAPP/InitGlobal中配置
		if (IS_IOS) {
			PushNotificationIOS.addEventListener('notification', this._onNotification.bind(this));
		} else {
			this.notification = DeviceEventEmitter.addListener('NOTIFICATION', this._onNotification.bind(this));
		}
	}

	componentWillUnmount() {
		//移除监听极光推送消息
		if (IS_IOS) {
			PushNotificationIOS.removeEventListener('notification', this._onNotification.bind(this));
		} else {
			this.notification && this.notification.remove();
		}
	}

	_onNotification(notification) {
		// 根据notification信息，可以做一些事情
		console.log('pushPage', notification);
	}

	render() {
		return (
			<Navigator />
		)
	}
}