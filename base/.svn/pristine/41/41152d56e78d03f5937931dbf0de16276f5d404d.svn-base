/**
 * Created by timhuo on 2017/2/4.
 * 功能完成 2/27
 */
import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Platform,
	TouchableOpacity,
	DeviceEventEmitter,
	PushNotificationIOS,
} from 'react-native';
import { BaseView } from 'future/src/widgets';
import jpush from '@imall-test/react-native-jpush'

export default class PushPage extends Component {
	constructor(props) {
		super(props);
	}

	// 推送打开指定页面在main.js已添加
	componentWillMount() {
		// if (IS_IOS) { // IS_IOS是全局变量,在base/src/lib/initAPP/InitGlobal中配置
		// 	//添加监听
		// 	PushNotificationIOS.addEventListener('notification', this._onNotification.bind(this));
		// } else {
		// 	this.notification = DeviceEventEmitter.addListener('NOTIFICATION', this._onNotification.bind(this));DeviceEventEmitter.addListener('NOTIFICATION', this._onNotification.bind(this));
		// }
	}
	componentWillunMount() {
		// if (IS_IOS) {
		// 	PushNotificationIOS.removeEventListener('notification', this._onNotification.bind(this));
		// } else {
		// 	this.notification && this.notification.remove();
		// }
	}



	onBtnPress() {
		//添加本地通知
		jpush.addLocalNotification({
			builderId: 1,
			title: "标题",
			subtitle: "小标题",
			body: '内容',
			categoryId: '分类 ID', //可选
			fireDate: '2',   //多少秒后触发
			requestId: '111', //用于之后 remove
			extras: { name: "jpush", age: 23 }
		});
	}

	onremovePress() {
		jpush.clearLocalNotifications();
	}
	getInfo = () => {
		// 设置客户端的标签和别名
		jpush.setAliasAndTags(["man"], 'user2');
		//极光提供的客户端唯一标识
		jpush.getRegistrationIDWithCallback((registrationID) => {
			console.log('registrationID', registrationID);
		});
	}

	render() {
		return (
			<BaseView navigator={this.props.navigator} ref={base => this.base = base}>
				<TouchableOpacity style={styles.btnStyle} onPress={this.onBtnPress} >
					<Text>添加本地推送</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.btnStyle} onPress={this.onremovePress}>
					<Text>清除本地推送</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.btnStyle} onPress={this.getInfo}>
					<Text>设置测试</Text>
				</TouchableOpacity>
			</BaseView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
		marginTop: 64,
	},
	btnStyle: {
		padding: 20,
		backgroundColor: 'yellow'
	}
});