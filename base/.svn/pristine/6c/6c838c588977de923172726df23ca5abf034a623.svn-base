import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	StyleSheet
} from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import { BaseView } from 'future/src/widgets';

export default class YourComponentName extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<BaseView navigator={this.props.navigator}>
				<Text onPress={() => {
					RCTDeviceEventEmitter.emit('setTabBadge', { index: 0, count: '122' });
				}}>点我设置TAB上标，回首页查看底部Tab</Text>

			</BaseView>
		)
	}
}
const styles = StyleSheet.create({

})
