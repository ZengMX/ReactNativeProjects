
'use strict';

import React, { Component } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions
} from 'react-native';
import { BaseView, Panel } from 'future/src/widgets';
let screenWidth = Dimensions.get('window').width;
export default class Panels extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isShow: false
		};
	}
	_onPress() {
		this.setState({
			isShow: !this.state.isShow
		});
	}
	render() {
		return (
			<BaseView style={{ flex: 1 }}
				navigator={this.props.navigator}>
				<View style={{ flex: 1, marginTop: 100 }}>
					<TouchableOpacity onPress={() => {
						this._onPress()
					}}>
						<Text>隐藏显示开关</Text>
					</TouchableOpacity>
					<Panel
					    style={{ width: screenWidth, height: 300, alignItems: 'center', justifyContent: 'center', backgroundColor: 'red' }}
						duration={1000}
						collapsed={this.state.isShow}
						onCollapsedChange={(extended) => {
						}}
						head={(<View style={{ width: screenWidth, height: 100, backgroundColor: "#0f0", alignItems: 'center', justifyContent: 'center' }} >
							<Text > {"自定义头部"} </Text>
						</View>)}
						>

						<Text>
							 Lorem ipsum dolor sit amet,consectetur adipiscing elit.
                        </Text>
					</Panel>
				</View>
			</BaseView>
		);
	}
};
