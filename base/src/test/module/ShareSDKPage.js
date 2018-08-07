/**
 * Created by timhuo on 2017/2/4.
 * 功能完成 2/27
 */
import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	NativeAppEventEmitter,
	DeviceEventEmitter,
	Platform,
} from 'react-native';
import { BaseView } from 'future/src/widgets';

import ShareSDK from '@imall-test/react-native-sharesdk'

export default class ShareSDKPage extends Component {
	constructor(props) {
		super(props);
		this.subscription = null;
	}
	componentDidMount() {
		//开始监听系统截屏,两个平台同样写法
		ShareSDK.takeNotification();
		
		this.subscription = DeviceEventEmitter.addListener('TakeScreenshot', this.shareImg);
	}

	componentWillUnMount() {
		//结束监听系统截屏
		ShareSDK.removeNotification();
		//组件卸载时记得移除监听
		this.subscription && this.subscription.remove();
	}

	//ShareSDK 分享截图图片
	shareImg = (imagePath) => {
		ShareSDK.shareImageAction(imagePath);
	};

	_onBtnPress() {
		//普通分享和以前一致
		ShareSDK.shareInfomationWith({
			url: 'http://www.qq.com',            //分享此内容的网站地址  //复制链接的内容
			title: '标题标题标题',                 //标题，微信、QQ好友和QQ空间使用
			content: '内容内容内容',                   //content是分享文本，所有平台都需要这个字段
			imgUrl: 'http://n.sinaimg.cn/news/transform/20161208/JJVV-fxypipt0549595.jpg',   //分享网络图片，新浪微博分享网络图片需要通过审核后申请高级写入接口
		});
	}

	render() {
		return (
			<BaseView style={styles.container}
				navigator={this.props.navigator}>
				<TouchableOpacity style={styles.btnStyle} onPress={this._onBtnPress.bind(this)}>
					<Text>分享</Text>
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
	},
	btnStyle: {
		padding: 20,
		backgroundColor: 'yellow'
	}
});