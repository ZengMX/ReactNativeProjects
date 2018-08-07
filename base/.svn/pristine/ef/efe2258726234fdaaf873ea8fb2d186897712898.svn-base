import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text
} from 'react-native';

import { BaseView } from 'future/src/widgets';
export default class DialogsTest extends Component {
	onPressHandle() {
		this.base.showConfirm({
			title: '标题',
			content: '内容',
			btn: [
				{ text: '确认', onPress: () => { alert('确认'); } },
				{ text: '取消' }
			]
		});
	}
	render() {
		return (
			<BaseView
				ref={base => this.base = base}
				style={{ justifyContent: 'center', alignItems: 'center' }}
				navigator={this.props.navigator}
				title={{ title: 'DialogsTest', tintColor: '#fff' }}
			>
				<Text onPress={this.onPressHandle.bind(this)}>点我调用BaseView弹出确认框</Text>
			</BaseView>
		);
	}
}
