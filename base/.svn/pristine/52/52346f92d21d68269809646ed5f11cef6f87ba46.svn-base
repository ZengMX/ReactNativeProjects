import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	TouchableOpacity
} from 'react-native';

import { BaseView, Page } from 'future/src/widgets';
export default class Star extends Component {
	constructor(props) {
		super(props);
	}
	next() {
		this.props.navigator.push({
			component: Star
		})
	}
	render() {
		return (
			<Page
				navigator={this.props.navigator}
				onOpen={() => {
					console.log('--------------onOpen')
				}}
			>
				<BaseView style={{ flex: 1 }}
					navigator={this.props.navigator}>
					<View style={{ flexDirection: 'column' }}>
						<TouchableOpacity style={{ marginTop: 20, alignSelf: 'center' }} onPress={this.next.bind(this)}>
							<Text>Next</Text>
						</TouchableOpacity>
					</View>
				</BaseView>
			</Page>
		);
	}
}
