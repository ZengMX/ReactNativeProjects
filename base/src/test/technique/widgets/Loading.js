/**
 *  属性
 * 	title: '正在加载',   // 标题
 * 	isOverlay: true,    // 是否有遮罩
 * 	type: 'CubeGrid9',   // 动画类型
 * 	isOverlayClickClose: true, // 有遮罩点击是否关闭
 * 	overlayStyle: {}, //遮罩样式
 * 	modalStyle: {}, //弹层样式
 */
import React, { Component } from 'react';
import {
	TouchableOpacity,
	Text,
} from 'react-native';

import { BaseView, Loading } from 'future/src/widgets';

export default class TestLoading extends Component {
	constructor(props) {
		super(props);
	}
	callingApi = () => {
		Loading.show();
		setTimeout(() => {
			Loading.hide();
		}, 2000)
	}

	customApi = () => {
		// 自定义显示
		Loading.show({
			title: '正在加载', // 标题
			isOverlay: true, // 是否有遮罩
			type: 'CubeGrid9',  // 动画类型
			isOverlayClickClose: true, // 有遮罩点击是否关闭
			overlayStyle: {}, //遮罩样式
			modalStyle: {},//弹层样式
		});
		setTimeout(() => {
			Loading.hide();
		}, 2000)
	}

	render() {

		return (
			<BaseView style={{ flex: 1 }}
				navigator={this.props.navigator}>
				<TouchableOpacity style={{ marginTop: 20, alignSelf: 'center' }} onPress={this.callingApi}>
					<Text>直接调用API, 无需书写控件</Text>
				</TouchableOpacity>
				<TouchableOpacity style={{ marginTop: 20, alignSelf: 'center' }} onPress={this.customApi}>
					<Text>自定义显示内容</Text>
				</TouchableOpacity>
			</BaseView>
		);
	}
}