import React, { Component } from 'react';
import {
	Text,
} from 'react-native';

import { BaseView, Button, Toast } from 'future/src/widgets';

export default class TestText extends Component {
	render() {
		const element = <Text style={{ color: '#000', borderColor: 'red', borderWidth: 1 }}>element</Text>;
		return (
			<BaseView
				style={{ justifyContent: 'center', alignItems: 'center' }}
				navigator={this.props.navigator}
				title={{ title: 'Toast', tintColor: '#fff' }}
			>
				<Text onPress={() => {
					Toast.show('Toast');
				}}>点我弹出Toast</Text>
			</BaseView>
		);
	}
}