import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	PixelRatio,
	Dimensions,
} from 'react-native';

import { BaseView } from 'future/src/widgets';

const screenWidth = Dimensions.get('window').width;

const datas = ["全部", "高新技术产业开发区", "长安区", "桥东区", "桥西区", "新华区", "裕华区", "井陉矿区"];

export default class RowAutoLayout extends Component {
	constructor(props) {
		super(props);
	}

	reload(data) {
		return data.map((item, index) => {
			return (
				<View style={styles.itemBox} key={index}>
					<View style={styles.item}>
						<Text style={styles.itemText} numberOfLines={1}>{item}</Text>
					</View>
				</View>
			)
		})
	}

	render() {
		const items = this.reload(datas);
		return (
			<BaseView style={styles.container}
				navigator={this.props.navigator}>

				<View style={styles.content}>
					<ScrollView contentContainerStyle={styles.itemView}>{items}</ScrollView>
				</View>
			</BaseView>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flexDirection: 'column',
		flex: 1
	},
	itemView: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	itemBox: {
		width: screenWidth / 3,
		height: 30,
		flexDirection: 'row',
		justifyContent: 'center',
		marginVertical: 5,
	},
	item: {
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
		width: 80,
		height: 30,
		borderColor: '#999',
		borderWidth: 1 / PixelRatio.get()
	},
	itemText: {
		fontSize: 13,
	},
});
