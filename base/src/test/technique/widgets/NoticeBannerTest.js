
'use strict';

import React, { Component } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions
} from 'react-native';
import { BaseView, NoticeBanner, NoticeBanners } from 'future/src/widgets';
let screenWidth = Dimensions.get('window').width;
export default class NoticeBannerTest extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		let dataAr = ['aaaaaa', 'bbbbbb', 'ccccc', 'ddddd'];
		return (
			<BaseView style={{ flex: 1 }}
				navigator={this.props.navigator}>

				<View style={{ width: screenWidth, height: 70, backgroundColor: '#ff0', alignItems: "center", justifyContent: 'center', marginTop: 20 }}>
					<NoticeBanner
						textStyle={{ color: "#333", fontSize: 14, marginLeft: 5, backgroundColor: 'red', alignItems: "center", justifyContent: 'center' }}
						onPress={(Value) => { alert(Value) }}
						dataArr={dataAr}
					></NoticeBanner>
				</View>

				<View style={{ width: screenWidth, height: 70, backgroundColor: '#ff0', alignItems: "center", justifyContent: 'center', marginTop: 20 }}>
					<NoticeBanners
						textStyle={{ color: "#333", fontSize: 14, marginLeft: 5, backgroundColor: 'red', alignItems: "center", justifyContent: 'center' }}
						onPress={(Value) => { alert(Value) }}
						dataArr={dataAr}
					></NoticeBanners>
				</View>


			</BaseView>
		);
	}
};
