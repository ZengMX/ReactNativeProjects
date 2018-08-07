import React, { Component } from 'react';
import {
	View,
	ScrollView,
	Dimensions,
	Text,
	Image,
	TouchableOpacity,
	Platform,
	TextInput,
	ListView,
	PixelRatio,
	InteractionManager
} from 'react-native';
var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;
import _ from 'underscore';
import Fetch from 'future/lib/Fetch';
import { RefreshableListView, BaseView, Toast, MaskModal, TextInputC } from 'future/widgets';
import AlphabetListView from 'react-native-alphabetlistview';
import ClearInput from './ClearInput';

import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class SectionHeader extends Component {
	render() {

		return (
			<View style={{ height: 31, width: screenWidth, backgroundColor: '#f2f4f5', }}>
				<Text style={{ lineHeight: 31, width: screenWidth, marginLeft: 10, color: 'rgb(51,51,51)' }}>{this.props.title}</Text>
			</View>
		);
	}
}

class SectionItem extends Component {
	render() {
		if (this.props.title == "近期下单客户") {
			return (<View></View>)
		}
		return (
			<Text style={{ color: '#3491df' }}>{this.props.title}</Text>
		);
	}
}

class Cell extends Component {
	_selectMenber() {
		this.props.setOrderClient(this.props.item);
		new Fetch({
			url: '/app/user/proxyUser.json',
			method: "POST",
			data: {
				sysUserId: this.props.item.mainAccountSysUserId
			}
		}).dofetch().then((data) => {
		}).catch((err) => {
			console.log('=> catch: ', err);
		});
		this.props.navigator.pop()
	}
	render() {
		return (
			<TouchableOpacity activeOpacity={0.7} onPress={() => { this._selectMenber() } }>
				<View style={{ paddingLeft: 10, height: 60, backgroundColor: '#fff' }}>
					<Text style={{ fontSize: 14, color: 'rgb(51,51,51)', marginTop: 15 }}>{this.props.item.companyCeo}</Text>
					<Text style={{ fontSize: 11, color: 'rgb(102,102,102)', marginTop: 6 }}>{this.props.item.unitNm}</Text>
				</View>
			</TouchableOpacity>
		);
	}
}
export default class SelectOrderClient extends Component {
	constructor(props) {
		super(props);

		this.fetchData = this._fetchData.bind(this);


		var getSectionData = (dataBlob, sectionID) => {
			return dataBlob[sectionID];
		};

		var getRowData = (dataBlob, sectionID, rowID) => {
			return dataBlob[sectionID + ':' + rowID];
		};

		this.state = {
			newgroups: [],
			data: {
				A: [],
				B: [],
				C: [],
			},
			rowData: null,

			searchField: null,

			dataSource: new ListView.DataSource({
				getSectionData: getSectionData, // 获取组中数据
				getRowData: getRowData, // 获取行中的数据
				rowHasChanged: (r1, r2) => r1 !== r2,
				sectionHeaderHasChanged: (s1, s2) => s1 !== s2
			})
		};
	}

	componentDidMount() {	
		InteractionManager.runAfterInteractions(() => {
			this.fetchData();
		});

	}
	_fetchData() {
		let listData = {}

		new Fetch({
			url: '/app/salesman/historyOrderSalesmanList.json',
			method: "POST",
		}).dofetch().then((data) => {

			listData["近期下单客户"] = data.result;
		});
		new Fetch({
			url: '/app/salesman/getBuyersBySalemanId.json',
			method: "POST",
			data: {
				pageNum: 1,
				limit: 10000,
				searchFiled: ''
			},
		}).dofetch().then((data) => {

			let departments = data.result;
			var groups = _.groupBy(departments, function (item) {
				var first = item.pinYin.toUpperCase().charAt(0);
				if (/[a-zA-Z]/.test(first)) {
					return first;
				} else {
					return '#';
				}
			});

			groups = _.sortBy(groups, function (group, key) {
				if (key == '#') {
					return 999;
				} else {
					return key.charCodeAt();
				}
			});
			_.each(groups, function (group) {
				var first = group[0].pinYin.toUpperCase().charAt(0);
				if (/[a-zA-Z]/.test(first) == false) {
					first = '#';
				}

				listData[first] = group

			})
			this.setState({
				// newgroups : newgroups,
				data: listData
			})
		})
	}


	search() {
		let listData = {}

		new Fetch({
			url: '/app/salesman/getBuyersBySalemanId.json',
			method: "POST",
			data: {
				pageNum: 1,
				limit: 10000,
				searchFiled: this.state.searchField
			},
		}).dofetch().then((data) => {

			let departments = data.result;
			var groups = _.groupBy(departments, function (item) {
				var first = item.pinYin.toUpperCase().charAt(0);
				if (/[a-zA-Z]/.test(first)) {
					return first;
				} else {
					return '#';
				}
			});

			groups = _.sortBy(groups, function (group, key) {
				if (key == '#') {
					return 999;
				} else {
					return key.charCodeAt();
				}
			});
			// console.log("groups",groups)
			// let newgroups = []

			_.each(groups, function (group) {
				var first = group[0].pinYin.toUpperCase().charAt(0);
				if (/[a-zA-Z]/.test(first) == false) {
					first = '#';
				}
				listData[first] = group

			})
			this.setState({
				// newgroups : newgroups,
				data: listData
			})
		})
	}
	_onSubmit() {
		if (this.state.searchField == '') { () => { this._fetchData() }; return }
		setTimeout(() => { this.search() }, 500);
	}
	_findItems() {
		return (
			<View style={{ width: screenWidth, height: 54, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center', }}>
				<View style={{
					paddingLeft: 6, height: 32, backgroundColor: '#eff0f0',
					paddingVertical: 0, marginHorizontal: 12, alignItems: 'center', flexDirection: 'row', borderRadius: 4
				}}>
					<Image source={require('../res/images/001sousuo.png')} style={{ width: 14.5, height: 14, }} resizeMode='stretch' />
					<TextInputC
						style={{ fontSize: 12, marginLeft: 5, paddingLeft: 6, width: screenWidth - 70, height: 32, paddingVertical: 0, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
						ref="textInput"
						clearButtonMode='while-editing'
						autoFocus = {true}
						underlineColorAndroid='transparent'
						placeholder='请输入客户名称/单位名称/手机号'
						numberOfLines={1}
						onChangeText={(searchField) => { this.setState({ searchField: searchField }); this._onSubmit() } }
						value={this.state.searchField} />
				</View>

			</View>
		)
	}
	render() {
		return (

			<BaseView navigator={this.props.navigator} title={{ title: '选择下单客户 ', tintColor: '#fff', fontSize: 16 }}>
				{this._findItems()}
				<AlphabetListView
					cellProps={{ navigator: this.props.navigator, setOrderClient: this.props.params.setOrderClient }}
					data={this.state.data}
					cell={Cell}
					cellHeight={30}
					sectionListItem={SectionItem}
					sectionHeader={SectionHeader}
					sectionHeaderHeight={22.5}
					enableEmptySections={true}
					/>
			</BaseView>
		);
	}

}
