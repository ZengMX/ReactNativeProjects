/**
 * Created by timhuo on 2017/2/4.
 * 使用方法
 * IOS
 * 1.注册 https://developer.rongcloud.cn/
 * 2.下载 IMKit SDK 
 * 3.解压得到Rong_Cloud,拖到Xcode的项目中
 * 4.手动导入 SDK http://www.rongcloud.cn/docs/ios.html#IMKit_快速集成  
 * 	添加系统库依赖 
 * 	在 Xcode 项目 Build Settings -> Other Linker Flags 中，增加 "-ObjC"
 * 5.参考 http://192.168.1.209:8000/pages/viewpage.action?pageId=6422681 
 * 	2.4 AppDelegate中加入
 * 	didFinishLaunchingWithOptions中加入
 * 
 * IOS 客服(发送订单信息),小屏幕样式错误
 */
import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
} from 'react-native';
import { BaseView } from 'future/src/widgets';
import Chat from '@imall-test/react-native-chat'

export default class IMPage extends Component {

	componentDidMount() {
		// 登录 Token 在应用中通过/app/rong/getToken.json获取
		Chat.loginWithToken("JBizB+6Rq/ONdr27to/wv7k6ndr54XuDeOflllFkI701/TBGpHkjvwggAb1HtnWSShk6LKqfbAK/IifGrfuQ6A==",
			(params) => {
				console.log('IMPage', params);
			}
		);
	}

	componentWillUnmount() {
		// 退出
		Chat.disconnect();
	}
	_chartServer() {
		Chat.imService('KEFU148790648456719', {
			model: 'goods',
			title: "我是标题，看什么看，没见过帅哥吗！！！！",
			price: "29.0",
			url: "http://www.google.com",
			icon_url: "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=439080618,2617019361&fm=111&gp=0.jpg",
		});
	}

	_chartOrder() {
		Chat.imService('KEFU148790648456719', {
			model: 'order',
			orderid: '20160719060488',
			price: '69.00',
			date: '2016-08-09 50:55:66',
			goodsnum: '3',
			icon_url: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=439080618,2617019361&fm=111&gp=0.jpg',
		});
	}

	render() {
		return (
			<BaseView navigator={this.props.navigator} ref={base => this.base = base}>
				<TouchableOpacity style={styles.btnStyle} onPress={this._chartServer.bind(this)}>
					<Text>商品进入聊天</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.btnStyle} onPress={this._chartOrder.bind(this)}>
					<Text>订单进入聊天</Text>
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