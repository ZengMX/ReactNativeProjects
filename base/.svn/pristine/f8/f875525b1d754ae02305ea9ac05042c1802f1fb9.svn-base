import React, { Component } from 'react';

import { View, TouchableHighlight, Text } from 'react-native';
import { BaseView } from 'future/src/widgets';
import ImallCookies from 'future/src/lib/ImallCookies';

export default class CookiesTest extends Component {
	render() {
		return (
			<BaseView
				ref={base => this.base = base}
				style={{ justifyContent: 'center', alignItems: 'stretch' }}
				navigator={this.props.navigator}
				title={{ title: 'CookiesTest', tintColor: '#fff' }}
			>
				<TouchableHighlight
					style={{ height: 30, marginVertical: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}
					onPress={async () => {
						const cookies = await ImallCookies.getUser();
						console.log('user cookies : ' + cookies);
						ImallCookies.getAll();
					}}
					underlayColor="#ccc"
				>
					<Text>点击查看打印数据</Text>
				</TouchableHighlight>
			</BaseView>
		);
	}
}
