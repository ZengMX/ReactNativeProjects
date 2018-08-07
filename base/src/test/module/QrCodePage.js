/**
 * Created by timhuo on 2017/2/4.
 * 功能完成
 */
import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
} from 'react-native';
import { BaseView, Toast } from 'future/src/widgets';
import QrCodeModule from '@imall-test/react-native-qrcode';

export default class QrCodePage extends Component {

	_onBtnPress() {
		let dic = {
			"qrcode_scanning": "切换至扫码",
			"title": "二维码123123/条形码",
			"qrcode_input": "输入条形码",
			"qrcode_placeholder": "请输入条形码123",
		};
		QrCodeModule.scan({
			callback: (codestring) => {                     //回调
				console.log(codestring);
			},
			titiledic: dic,                                //title 标签 （可不传）
			color: 'orange'                                //颜色 默认颜色为橙色 （可不传）
		});
	}

	render() {
		return (
			<BaseView navigator={this.props.navigator}>
				<TouchableOpacity style={{ padding: 20, backgroundColor: 'yellow' }} onPress={this._onBtnPress}>
					<Text>二维码扫描</Text>
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
	}
});