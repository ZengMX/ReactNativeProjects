
'use strict';

import React, { Component } from 'react';
import {
	NavigationExperimental,
	BackAndroid,
	Platform,
	Text,
	PushNotificationIOS,
	View,
	Alert,
	NetInfo,
	Image,
	Modal,
	AppState,
} from 'react-native';

// import {
//   isFirstTime,
//   isRolledBack,
//   packageVersion,
//   currentVersion,
//   checkUpdate,
//   downloadUpdate,
//   switchVersion,
//   switchVersionLater,
//   markSuccess,
// } from 'react-native-update';

// 初始化项目
import 'future/public/lib/initAPP/InitIndex';

import config from 'future/public/config';
import * as launchImage from 'react-native-launch-image';
import DeviceEventEmitter from 'RCTDeviceEventEmitter';

// 注释掉的已转移到 public/lib/initAPP/InitIndex.js ，下同
// 由于toast内部调用的是AppRegistry.registerComponent方法，
// 所以要先初始化一次，解决消息不显示的bug
// import Toast from 'react-native-root-toast';

// redux
import { Provider } from 'react-redux';
import configureStore from 'future/public/store/configure-store';
// 新配置
// import configureStore from 'future/public/store/configure-store';
import Navigation from 'future/public/lib/navigator';

import codePush from "react-native-code-push";

// 初始化EStyleSheet
// import EStyleSheet from 'react-native-extended-stylesheet';
// EStyleSheet.build();



//热更新
// import _updateConfig from './update.json';
// const {appKey} = _updateConfig[Platform.OS];

//检查更新
import Update from 'future/public/lib/Update';




// if (config.debug != true) {
// 	console.log = () => { };
// 	console.disableYellowBox = true;
// 	require('ErrorUtils').setGlobalHandler(function (err) {
// 		alert('发生未知错误!');
// 		//   DeviceEventEmitter.emit('CatchFatalError',err);
// 	});
// }

class App extends Component {

	constructor(props) {
	    super(props);
	    this.state = {modalVisible: true};
	  }
	componentWillMount() {
		//只允许竖屏
		// if (Platform.OS === 'ios') {
		// 	Orientation.lockToPortrait();
		// }
	// 	if (isFirstTime) {
	//       Alert.alert('提示', '这是当前版本第一次启动,是否要模拟启动失败?失败将回滚到上一版本', [
	//         {text: '是', onPress: ()=>{throw new Error('模拟启动失败,请重启应用')}},
	//         {text: '否', onPress: ()=>{markSuccess()}},
	//       ]);
	//   } else if (isRolledBack) {
	//       Alert.alert('提示', '刚刚更新失败了,版本被回滚.');
	//   }
	}

	async componentDidMount() {
		// 随便做点什么，包括可以用await去做异步调用。
		launchImage.hide();
		// 热更新 微软的
		codePush.sync();
		//网络状态监听，IOS bug
		// NetInfo.isConnected.addEventListener('change', ()=>{});
		//接受推送消息
		if(Platform.OS ==='ios'){
			PushNotificationIOS.addEventListener('notification', this._onNotification);
		}

		//检查更新 RN网的
		// setTimeout(function() {
		// 	Update();
		// }, 2000);

		//app状态改变的时候再次检测热更新
		// AppState.addEventListener("change", this.codePushListener);
	}

	componentWillUnmount(){
		//移除监听
		PushNotificationIOS.removeEventListener('notification',this._onNotification);
		NetInfo.isConnected.removeEventListener('change', ()=>{});
		// AppState.removeEventListener("change", this.codePushListener);
	}

	// 监听热更新
	// codePushListener = (newState) => {
	// 	newState === "active" && codePush.sync();
	// }

	_onNotification(notification) {
		let description = ""; 
		for(let i in notification.getData()){ 
		  let property=notification.getData()[i]; 
		  if(i==='State'){
		  	description=property;
		  } 
		} 
		if(description==='Active'){
			Alert.alert('温馨提示',notification.getMessage(),
				[
				{text: '取消', onPress: () => {  }},
				{text: '确认', onPress: () => {  }},
				]
			)
		} 
	}

	// doUpdate = info => {
	//     downloadUpdate(info).then(hash => {
	//       Alert.alert('提示', '下载完毕,是否重启应用?', [
	//         {text: '是', onPress: ()=>{switchVersion(hash);}},
	//         {text: '否',},
	//         {text: '下次启动时', onPress: ()=>{switchVersionLater(hash);}},
	//       ]);
	//     }).catch(err => {
	//       Alert.alert('提示', '更新失败.');
	//     });
	// };
	// checkUpdate = () => {
	//     checkUpdate(appKey).then(info => {
	//       if (info.expired) {
	//         Alert.alert('提示', '您的应用版本已更新,请前往应用商店下载新的版本', [
	//           {text: '确定', onPress: ()=>{info.downloadUrl && Linking.openURL(info.downloadUrl)}},
	//         ]);
	//       } else if (info.upToDate) {
	//         Alert.alert('提示', '您的应用版本已是最新.');
	//       } else {
	//         Alert.alert('提示', '检查到新的版本'+info.name+',是否下载?\n'+ info.description, [
	//           {text: '是', onPress: ()=>{this.doUpdate(info)}},
	//           {text: '否',},
	//         ]);
	//       }
	//     }).catch(err => {
	//       Alert.alert('提示', '更新失败.');
	//     });
  //   };

	render() {
		// return (
		// 	{/*<View style={{flex:1}}>
		// 	    <Modal
		// 		animationType={"fade"}
		//         transparent={true}
		//         visible={this.state.modalVisible}
		//         onRequestClose={() => {}}>
		//             <View style={{backgroundColor:'#fff',flex:1,justifyContent:'center',alignItems:'center'}}>
		// 								<Text onPress={this.checkUpdate}>点击我吧TTTTTTTTT11111111</Text>
        //             <Text>
		// 									{'\n'}
		// 									这是版本一 {'\n'}
		// 									当前包版本号: {packageVersion}{'\n'}
		// 									当前版本Hash: {currentVersion||'(空)'}{'\n'}
		// 								</Text>
		// 								<Image source={require('./000gouxuan_s.png')}/>
		// 								<Text onPress={()=>{
		// 									this.setState({
		// 										modalVisible:!this.state.modalVisible
		// 									})
		// 								}}>打开应用</Text>
		//             </View>

		// 		</Modal>
		// 		<Navigation />
		// 	</View>*/}
		// )
		return (
			<Navigation />
		)
	}
}

const store = configureStore();

const Root = () => (
	<Provider store={store}>
		<App />
	</Provider>
);

export default Root;
