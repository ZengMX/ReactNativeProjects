import React, { Component } from 'react';
import {
	Text,
	ListView,
	View,
	TouchableOpacity,
	Image,
	PixelRatio,
	Platform,
	InteractionManager,
	ScrollView
} from 'react-native';
var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;
import _ from 'underscore';
import UtilDateTime from 'future/public/lib/UtilDateTime';
import {
	Fetch,
	imageUtil,
} from 'future/public/lib';
import styles from '../styles/GroupBuyList';
import { RefreshableListView, BaseView } from 'future/public/widgets';
import GroupBuyDetail from './GroupBuyDetail';
import MoreOperation from '../../commons/moreOperation/components/MoreOperation';

export default class GroupBuyProductList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
			categoryId: 15,
			result: null,
			selectTabIndex: 0,
			serverTime: new Date().getTime(), // 服务器时间，先用本地时间初始化一下
			leftSeconds: 3600
		}
		this.renderRow = this._renderRow.bind(this);
		this.pullRefresh = this._pullRefresh.bind(this);
		this.BuyCategories = this._BuyCategories.bind(this);
		this.startChangeTime = this.startChangeTime.bind(this);
		this.tabsdata = { categoryId: 15, name: '全部团购' };

	}
	componentDidMount() {
		this.pullRefresh();
		InteractionManager.runAfterInteractions(() => {
			this.BuyCategories()
		});
		this.timer = setInterval(
			() => { this.startChangeTime(); },
			1000
		);
	}
	// 倒计时
	startChangeTime() {
		this.setState({
			serverTime: this.state.serverTime + 1000
		})
	}
	componentWillUnmount() {
		this.timer && clearTimeout(this.timer);
	}

	fetchData(page, success, error) {
		new Fetch({
			url: 'app/groupbuy/groupbuyPage.json',
			method: "POST",
			data: {
				pageNumber: page,
				pageSize: 10,
				categoryId: this.state.categoryId
			},
		}).dofetch().then((data) => {
			success(data.result.result, 10 * (page - 1) + data.result.result.length, data.result.totalCount);
		}).catch((err) => {
			error && error(err);
			console.log('=> catch: ', err);
		});
	}
	_pullRefresh() {
		InteractionManager.runAfterInteractions(() => {
			this.refs.listView && this.refs.listView.pullRefresh && this.refs.listView.pullRefresh();
		});
	}
	_BuyCategories(page, success, error) {
		new Fetch({
			url: '/app/groupbuy/groupBuyCategories.json',
			method: "GET",
			data: {},
		}).dofetch().then((data) => {
			data.result.unshift(this.tabsdata);
			this.setState({
				result: data.result,
			});
		}).catch((err) => {
			error && error();
			console.log('=> catch: ', err);
		});
	}
	//切换 	
	_onSwitchTab(item, index) {
		if (this.state.selectTabIndex == index) {
			return;
		}
		this.setState({
			selectTabIndex: index,
			categoryId: item.categoryId
		});
		setTimeout(() => {
			this._pullRefresh();
		}, 100);
	}
	_groupBuyProductDetail(rowData, rowID) {
		this.timer && clearTimeout(this.timer);
		setTimeout(() => {
			this.props.navigator.push({
				component: GroupBuyDetail,
				params: {
					groupBuyId: rowData.groupBuyId,
				}
			})
		}, 50);
	}
	_subPrice(params) {
		let data = params.toString();
		let result = [];
		if (data.indexOf('.') == -1) {
			result[0] = data;
			result[1] = '00';
		} else {
			result = data.split(".");
		}
		return result;
	}
	_renderRow(rowData, sectionID, rowID, highlightRow) {
		let pic = rowData && rowData.pictFileId ? rowData.pictFileId : null;
		let price = this._subPrice(rowData.price);
		let orgPrice = this._subPrice(rowData.orgPrice);
		return (
			<TouchableOpacity style={{ width: screenWidth, height: 155, backgroundColor: '#fff', paddingHorizontal: 12, paddingTop: 20, flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee' }}
				onPress={() => { this._groupBuyProductDetail(rowData, rowID) }}>
				<Image style={{ width: 115, height: 115 }} resizeMode='stretch' source={imageUtil.get(pic)}></Image>
				<View style={{ flex: 1, flexDirection: 'column', paddingLeft: 10 }}>
					<View style={{ flexDirection: 'row', height: 15, alignItems: 'center' }}>
						<Text style={{ fontSize: 11, color: '#4F5966' }}>仅剩</Text>
						<View style={{ flex: 1, }}>
							<Countdown
								type={3}
								leftSeconds={parseInt(rowData.leftTime)}
							/>
						</View>
					</View>
					<View style={{ flex: 1, flexDirection: 'column' }}>
						<Text style={{ fontSize: 15, color: '#333', marginTop: 14 }} numberOfLines={1}>{rowData.productNm}</Text>
						<View style={{ width: 70, height: 18.5, borderWidth: 1, borderColor: '#5591FA', justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
							<Text style={{ fontSize: 11, color: '#5591FA' }} numberOfLines={1}>{rowData.soldQuantity}人已参团</Text>
						</View>
						<View style={{ flexDirection: 'row', marginTop: 15, alignItems: 'flex-end', height: 25 }}>
							<Text style={{ fontSize: 13, color: '#FF6600' }}>￥</Text>
							<Text style={{ fontSize: 18, color: '#FF6600', marginLeft: 5, marginBottom: -2 }}>{price[0]}.</Text>
							<Text style={{ fontSize: 15, color: '#FF6600', marginBottom: -1 }}>{price[1]}</Text>
							<Text style={{ fontSize: 11, color: '#999999', marginLeft: 8, textDecorationLine: 'line-through' }}>￥{orgPrice[0]}.{orgPrice[1]}</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
	_more() {
		return (
			<View style={{ justifyContent: 'center' }}>
				<MoreOperation
					navigator={this.props.navigator}
					order={
						[{
							module: 'index',
						}, {
							module: 'search',
						}, {
							module: 'message',
						}, {
							module: 'mine',
						}]
					}
				/>
			</View>

		)
	}
	_renderTabs() {
		if (this.state.result) {
			return this.state.result.map((item, index) => {
				let selectTabColor = index == this.state.selectTabIndex ? '#34457D' : '#fff';
				let selectTextColor = index == this.state.selectTabIndex ? '#34457D' : '#4B5963';
				return (
					<TouchableOpacity key={index} onPress={() => { this._onSwitchTab(item, index) }}>
						<View style={{
							height: 45,
							marginRight: 25,
							justifyContent: 'center',
							alignItems: 'center',
							borderBottomWidth: 2,
							borderColor: selectTabColor
						}}>
							<Text style={{ fontSize: 14, color: selectTextColor }}>{item.name}</Text>
						</View>
					</TouchableOpacity>
				);
			})
		}
	}
	render() {
		return (
			<BaseView navigator={this.props.navigator}
			    statusBarStyle={'default'}
				title={{ title: '团购活动', tintColor: '#333333', fontSize: 16 }}
				titlePosition={'center'}
				rightButton={this._more()}
			>
				<View style={{ width: screenWidth, height: 45 }}>
					<ScrollView
						style={{ flex: 1, backgroundColor: "#FAFAFA" }}
						horizontal={true}
						showsHorizontalScrollIndicator={false}>
						<View style={{ alignItems: 'center', flexDirection: 'row', flex: 1, paddingLeft: 20 }}>
							{this._renderTabs()}
						</View>
					</ScrollView>
				</View>
				<RefreshableListView
					style={{ flex: 1, marginTop: 0 }}
					ref="listView"
					pageSize={10}
					initialListSize={0}
					autoRefresh={false}
					autoLoadMore={true}
					fetchData={this.fetchData.bind(this)}
					dataSource={this.state.dataSource}
					renderRow={this.renderRow}
				/>
			</BaseView>
		);
	}
}
class Countdown extends Component {
	constructor(props) {
		super(props);
		this.state = {
			leftSeconds: this.props.leftSeconds || 0,
		};
		//根据leftSeconds计算后的天时分秒
		this.countdown = {
			dayStr: 0,
			hourStr: '00',
			minuteStr: '00',
			secondStr: '00',
		};
		this.tipColor = this.props.tipColor || '#999'; //天时分秒color
		this.tipFontSize = this.props.tipFontSize || 12;
		this.valueColor = this.props.valueColor || '#f00'; //数字color
		this.valueFontSize = this.props.valueFontSize || 12;
		this.first = true;
	}
	//开启倒计时
	componentDidMount() {
		if (this.first) {
			this.timer = setInterval(
				() => { this.startChangeTime(); },
				1000
			);
		} else {
			this.first = false;
		}

	}
	//关闭倒计时
	componentWillUnmount() {
		this.timer && clearInterval(this.timer);
	}
	//列表中倒计时根据传入的时间值更新
	componentWillReceiveProps(nextProps) {
		if (!this.props.startChangeTime) {
			this.setState({
				leftSeconds: nextProps.leftSeconds
			});
		}
	}

	// 倒计时
	startChangeTime() {
		if (this.state.leftSeconds <= 0 || !_.isNumber(this.state.leftSeconds)) {
			this.timer && clearInterval(this.timer);
			return;
		}
		this.setState({
			leftSeconds: this.state.leftSeconds <= 0 ? 0 : --this.state.leftSeconds
		})
	}

	_subString(substr) {
		if (substr != undefined) {
			let str = substr.toString();
			if (str.length > 0) {
				let arrs = [];
				for (let i = 0; i < str.length; i++) {
					arrs.push(str.substring(i, i + 1));
				}
				return arrs;
			}
		}
	}
	_renderNumbers(data) {
		let day = this._subString(data);
		if (day != undefined && day.length > 0) {
			return day.map((item, index) => {
				return (
					<View
						key={index}
						style={{
							width: 12,
							height: 15,
							backgroundColor: '#333',
							alignItems: 'center',
							justifyContent: 'center',
							marginHorizontal: 1,
							borderRadius: 1,
						}}>
						<Text style={{ fontSize: 10, color: '#FFF' }}>{item}</Text>
					</View>
				);
			});
		}
	}

	render() {
		// type==1 0天00小时23分34秒 type==2 212天 / 9分23秒
		// 下面的null可替换为倒计时结束要显示的内容
		let type = this.props.type || 1;
		this.countdown = UtilDateTime.getLeftTimeString(this.state.leftSeconds);
		return (
			<View style={this.props.style}>
				{(type == 3 && _.isNumber(this.state.leftSeconds)) ?
					<View style={[{ flexDirection: 'row', alignItems: 'center' }, this.props.style]}>
						{this._renderNumbers(this.countdown.dayStr)}
						<Text style={{ fontSize: 11, color: '#4F5966' }}>天</Text>
						{this._renderNumbers(this.countdown.hourStr)}
						<Text style={{ fontSize: 11, color: '#4F5966' }}>:</Text>
						{this._renderNumbers(this.countdown.minuteStr)}
						<Text style={{ fontSize: 11, color: '#4F5966' }}>:</Text>
						{this._renderNumbers(this.countdown.secondStr)}
					</View> : null
				}
			</View>
		);
	}
}




