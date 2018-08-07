'use strict'

import React, {Component, PropTypes} from 'react'
import {Navigator, View, StyleSheet, Platform, BackAndroid} from 'react-native'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import { Toast } from 'future/public/widgets';

import Index from 'future/src/index';
import _ from 'underscore';

class _Navigator extends React.Component {
	constructor(props) {
		super(props);
		this._renderScene = this._renderScene.bind(this);
		// if (Platform.OS === 'android') {
		// 	BackAndroid.addEventListener('hardwareBackPress', () => {
		// 		let nav = this.refs.navigator;
		// 		console.log("nav",nav);
		// 		const currRoutes = nav.getCurrentRoutes();
		// 		console.log("currRoutes",currRoutes);
		// 		if (currRoutes.length > 0) {
		// 			if(global.isShowPopup == false || global.isShowPopup == undefined){
		// 		console.log("global",global);
		// 		console.log("global.isShowPopupg",global.isShowPopup);
		// 				nav.pop();
		// 				return true;
		// 			}
		// 			return true;
		// 		}
		// 		return false;
		// 	});
		// }
	}
	componentDidMount() {
		// this.changeTabBarIdxListener = RCTDeviceEventEmitter.addListener('changeTabBarIdx', ({idx, goTop = false}) => {
		// 	if (true === goTop) {
		// 		let nav = this.refs.navigator;
		// 		const routers = nav.getCurrentRoutes();
		// 		if (routers.length > 1) {
		// 			nav.popToTop();
		// 		}
		// 	}
		// 	setTimeout(function () {
		// 		RCTDeviceEventEmitter.emit('changeTabBarIdx2', { idx: idx });
		// 	}, 100);
		// 	return true;
		// });
		if (Platform.OS === 'android') {
			BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
		}

		//错误发生崩溃返回上一页
		// this.fatalErrorListener = RCTDeviceEventEmitter.addListener('CatchFatalError',(err)=>{
		//     this.refs.navigator.pop();
		// });
	}
	componentWillUnmount() {
		// 移除 一定要写  
		// this.changeTabBarIdxListener && this.changeTabBarIdxListener.remove();
		// if (Platform.OS === 'android') {
		// 	BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
		// }

		// this.fatalErrorListener && this.fatalErrorListener.remove();
	}
	onBackAndroid = () => {
		let nav = this.refs.navigator;
		const routers = nav.getCurrentRoutes();
		/**
		 * 以下循环用于禁用页面的物理返回键（Android），如果有多个页面需要禁用安卓的物理返回键则要逐个页面添加判断
		 * 使用方法如（在PerfectInformation的前一个页面传递一个forbiddenPage参数过来，然后根据这个参数判断来禁用安卓物理返回键）：
		 * this.props.navigator.push({
					component:PerfectInformation,
					forbiddenPage:"PerfectInformation"
				});
		 */
		let returnOrNot = false;
		let needToBackHome = false;
		_.each(routers, (item, index)=>{
			//如果有多个页面请再加判断， 如：if(item.forbiddenPage == "PerfectInformation" || item.forbiddenPage == "其他页面名称")
			if(item.forbiddenPage == "PerfectInformation"){
				returnOrNot = true;
			}
			//以下判断用于判断点击安卓物理返回键时是否需要返回首页
			if(item.needToBackHome === "true" && item.name === 'SignIn' && (index+1) === routers.length){
				needToBackHome = true;
			}
		})
		
		if(returnOrNot){
			return returnOrNot;
		}
		if(needToBackHome){
			RCTDeviceEventEmitter.emit('changeTabBarIdx', { idx: 0, goTop:true });
			return needToBackHome;
		}
		// console.log("routers", routers, routers.length)
		if (global.isShowPopup) {
			return true;
		}
		if (routers.length > 1) {
			nav.pop();
		} else if (routers.length == 1) {
			if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
				//最近2秒内按过back键，可以退出应用。
				Toast.clear();
				BackAndroid.exitApp();
				return false;
			} else {
				Toast.show('再按一次退出应用');
				this.lastBackPressed = Date.now();
			}
		}
		return true;
	};
	render() {

		const NoBackSwipe ={
			...Navigator.SceneConfigs.PushFromRight,
			gestures: null
		};

		return (
			/*<Navigator
				ref='navigator'
				// 初始化component
				initialRoute={{ params: { name: 'Home页面' }, component: Index }}
				configureScene={(route) => {
					// 切换动画可定制
					if (route.sceneConfig) {
						return route.sceneConfig;
					}
					var config =  Navigator.SceneConfigs.PushFromRight;
					config.gestures = null;
					return config;
				} }
				renderScene={this._renderScene}
				/>*/

			<Navigator
				ref='navigator'
				// 初始化component
				initialRoute={{ params: { name: 'Home页面' }, component: Index }}
				configureScene={(route) => {
					// 切换动画可定制

					console.log('>>>>>route.component.displayName', route.component.displayName,route)
					if (route.sceneConfig) {
						return route.sceneConfig;
					}
					if( route.forbiddenPage&&route.forbiddenPage=='PerfectInformation'){
						return NoBackSwipe;
					}else{
						return Navigator.SceneConfigs.PushFromRight;
					}
					
				} }
				renderScene={this._renderScene}
				/>
		);
	}

	_renderScene(route, navigator) {
		//切换视图可定制
		let Component = route.component;
		// 注意: 此处的标签是通过对象传递过来的,不可写死！
		return <Component navigator={navigator} params={route.params} />
	}
}

export default _Navigator;
