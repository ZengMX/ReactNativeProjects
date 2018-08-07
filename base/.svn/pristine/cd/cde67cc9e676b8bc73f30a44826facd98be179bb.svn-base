
import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	ListView,
	TouchableHighlight
} from 'react-native';

import { BaseView, RefreshableListView } from 'future/src/widgets';
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFF',
	},
	navBar: {
		height: 64,
		backgroundColor: '#CCC'
	},
	row: {
		padding: 10,
		height: 44,
	}
});

const genData = (page, size) => {
	let data = [];
	for (const i = 0; i < size; i++) {
		let item = {};
		item.id = (page - 1) * size + i;
		item.text = 'row ' + i;
		data.push(item)
	}
	return data;
}

const fetchData = (page, size) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(genData(page, size));
		}, 3000);
	})
};


export default class Example extends Component {
	constructor() {
		super(...arguments);
	}
	componentDidMount() {

	}
	fetchData(page, success, error) {
		fetchData(page, 10).then((data) => {
			success(data, page * 10, 50);
		}).catch((err) => {
			console.log('=> catch: ', err);
			error();
		});
	}
	renderRow(rowData, sectionID, rowID, highlightRow) {
		return (
			<TouchableHighlight
				style={{ height: 60, flex: 1, justifyContent: 'center', alignItems: 'center' }}
				underlayColor='#c8c7cc'>
				<View style={{ flexDirection: 'row' }}>
					<Text style={{ fontSize: 14 }}>
						{rowData.id}
					</Text>
				</View>
			</TouchableHighlight>
		)
	}
	renderSeparator(sectionID, rowID) {
		return (
			<View key={'key' + rowID} style={{ height: 1, backgroundColor: '#CCC' }} />
		)
	}
	render() {
		return (
			<BaseView style={styles.container}
				navigator={this.props.navigator}>

				<RefreshableListView
					ref="list"
					autoRefresh={true}
					autoLoadMore={true}
					fetchData={this.fetchData.bind(this)}
					renderSeparator={this.renderSeparator}
					renderRow={this.renderRow.bind(this)} />

			</BaseView>
		);
	}
}
