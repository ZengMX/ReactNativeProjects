import React, { Component } from 'react';
import {
	Text as Text1
} from 'react-native';

import { BaseView, Text } from 'future/src/widgets';

export default class TestText extends Component {
	render() {
		const element = <Text style={{ color: '#000', borderColor: 'red', borderWidth: 1 }}>element</Text>;
		return (
			<BaseView
				style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
				navigator={this.props.navigator}
				title={{ title: 'Text', tintColor: '#fff' }}
			>
				<Text>确认</Text>
				<Text style={{ color: 'red' }}>确认</Text>
				<Text style={{ color: 'red' }}
					text={['string',
						<Text key={'element'} style={{ color: '#000', borderColor: 'red', borderWidth: 1 }}>element</Text>,
						{
							value: 'object', style: { color: 'blue' }
						}]}
				/>
				{/*react-native Text 在Text中有些属性是没法使用的， 下边是测试*/}
				{element}
				<Text1 style={{ color: 'red' }}>
					{element}
				</Text1>
			</BaseView>
		);
	}
}