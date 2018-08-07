import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	View,
	ScrollView,
	Dimensions,
	Text,
	Image,
	TouchableOpacity,
	Platform,
	TouchableHighlight,
	InteractionManager,
	PixelRatio,
	Alert
} from 'react-native';
var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;
import Styles from 'future/public/lib/styles/Styles';
import _ from 'underscore';
import { Fetch, UtilDateTime } from 'future/public/lib';
import { BaseView, MaskModal, RefreshableListView, Toast, Loading } from 'future/public/widgets';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollableTabBar from 'future/public/commons/ScrollableTabBar';

// import styles from '../../home/styles/InforChannel';
// import InforChannelSearch from '../../home/components/InforChannelSearch';
// import WebViewPage from '../../commons/WebViewPage';
// import ShoppingCart from '../../shoppingCart/components/ShoppingCart'
// import LogisticsDetail from './LogisticsDetail'
import OrderDetail from './OrderDetail'
// import OrderDetailMultiPackage from './OrderDetailMultiPackage'
import OrderSearch from './OrderSearch'
import List from './List'

// import Countdown from './Countdown'

// import SelectReturnGoods from '../../user/components/SelectReturnGoods'
// import SettleCenter from '../../shoppingCart/components/SettleCenter'
// import CashierDesk from '../../shoppingCart/components/CashierDesk';





class OrderList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPageIndex: 0,
			showOrderType: false,
			showOrderState: false,
			// extraParams: {
			// 	searchFiled: null,				
			// 	startDate: null,
			// 	endDate: null,
			// },
			stateList: ["   全部", " 待付款", " 待发货", " 待收货", ' 待评价', " 已完成", "已取消"],
			stateCodeList: [0, 1, 2, 3, 4],
			promotionTypeCode: (this.props.params && this.props.params.promotionTypeCode) || 'ALL',
			status: null
			//取值 0（普通订单），1（团购），2 (抢购) ，3 直降， 12（预售订单） ， 13（近效期）
		}
		//this.promotionTypeCode = (this.props.params && this.props.params.promotionTypeCode) || null

	}

	componentDidMount() {
		if (this.props.params && this.props.params.page) {

			this.refs.scrollableTabView.goToPage(this.props.params.page);
		}
	}



	_openSearch() {
		this.props.navigator.push({
			params: {
				//extraParams : this.state.extraParams,
				// callback: (value) => {					
				// 	this.setState({
				// 		extraParams: value
				// 	});			
				// }
			},
			component: OrderSearch
		})

	}

	//选择订单类型
	renderStateMenu() {
		let cells = []
		let orderType = [{ title: '全部', status: null, checked: this.state.status == null },
		{ title: '待付款', status: 2, checked: this.state.status == 2 },
		{ title: '待发货', status: 3, checked: this.state.status == 3 },
		{ title: '待收货', status: 4, checked: this.state.status == 4 },
		{ title: '待评价', status: 5, checked: this.state.status == 5 },
		{ title: '已完成', status: 6, checked: this.state.status == 6 },
		{ title: '已取消', status: 8, checked: this.state.status == 8 },]
		let styleBlur = { borderColor: '#8e939a', backgroundColor: '#fff' }
		let styleFcous = { borderColor: '#ff6600', backgroundColor: '#ff6600' }

		_.each(orderType, (item, index) => {
			cells.push(
				<TouchableOpacity style={{ marginBottom: 5 }} key={index} onPress={() => {

					{
						if (item.state != this.state.status) {
							if (item.status == null) {
								this.setState({ status: null })
							} else
								if (item.status == 2) {
									this.setState({ status: 2 })
								} else
									if (item.status == 3) {
										this.setState({ status: 3 })
									} else
										if (item.status == 4) {
											this.setState({ status: 4 })
										} else
											if (item.status == 5) {
												this.setState({ status: 5 })
											} else
												if (item.status == 6) {
													this.setState({ status: 6 })
												} else
													if (item.status == 8) {
														this.setState({ status: 8 })
													}
						}
					}
					this.refs.orderState.hide();
					setTimeout(() => {
						this.refs.scrollableTabView.goToPage(index);
					}, 1000)

				}}>
					<View style={[{ height: 30 * Styles.theme.IS, width: 90 * Styles.theme.IS, justifyContent: 'center', alignItems: 'center', marginLeft: 10, borderWidth: 1, borderRadius: 3 }, item.checked ? styleFcous : styleBlur]}>
						<Text style={{ fontSize: 12, color: item.checked ? '#fff' : '#444' }}>{item.title}</Text>
					</View>
				</TouchableOpacity>
			)
		})
		return (
			<View style={{ position: "absolute", top: 0, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fafafa', width: screenWidth, flexWrap: 'wrap', paddingHorizontal: 3, paddingVertical: 10 }}>
				{cells}
			</View>
		)
	}

	//选择订单类型{/* title: '积分订单', checked: this.state.promotionTypeCode == 'INTEGRAL_EXCHANGE', type: 'INTEGRAL_EXCHANGE' */}
	renderFloatMenu() {
		let cells = []
		let orderType = [{ title: '全部订单', checked: this.state.promotionTypeCode == 'ALL', type: 'ALL' },
		{ title: '普通订单', checked: this.state.promotionTypeCode == null, type: null },
		{ title: '团购订单', checked: this.state.promotionTypeCode == 'GROUP_BUY', type: 'GROUP_BUY' },
		]
		let styleBlur = { borderColor: '#8e939a', backgroundColor: '#fff' }
		let styleFcous = { borderColor: '#ff6600', backgroundColor: '#ff6600' }

		_.each(orderType, (item, index) => {
			cells.push(
				<TouchableOpacity style={{ marginBottom: 5 }} key={index} onPress={() => {
					if (item.type != this.state.promotionTypeCode) {
						if (item.type == null) {
							this.setState({ promotionTypeCode: null })
						} else
							if (item.type == 'ALL') {
								this.setState({ promotionTypeCode: 'ALL' })
							} else
								if (item.type == 'GROUP_BUY') {
									this.setState({ promotionTypeCode: 'GROUP_BUY' })
								} 
								{/* else
									if (item.type == 'INTEGRAL_EXCHANGE') {
										this.setState({ promotionTypeCode: 'INTEGRAL_EXCHANGE' })
									} */}
					}
					this.refs.orderType.hide()
				}}>
					<View style={[{ height: 30 * Styles.theme.IS, width: 90 * Styles.theme.IS, justifyContent: 'center', alignItems: 'center', marginLeft: 10, borderWidth: 1, borderRadius: 3 }, item.checked ? styleFcous : styleBlur]}>
						<Text style={{ fontSize: 12, color: item.checked ? '#fff' : '#444' }}>{item.title}</Text>
					</View>
				</TouchableOpacity>
			)
		})
		return (
			<View style={{ position: "absolute", top: 0, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fafafa', width: screenWidth, flexWrap: 'wrap', paddingHorizontal: 3, paddingVertical: 10 }}>
				{cells}
			</View>
		)
	}

	render() {
		let head = (
			<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} activeOpacity={1}
				onPress={() => { this.refs.orderType.show(); this.setState({ showOrderType: true }) }}>
				{this.state.promotionTypeCode == 'ALL' && <Text style={{ fontSize: 18, color: '#333' }}>全部订单</Text>}
				{this.state.promotionTypeCode == null && <Text style={{ fontSize: 18, color: '#333' }}>普通订单</Text>}
				{this.state.promotionTypeCode == 'GROUP_BUY' && <Text style={{ fontSize: 18, color: '#333' }}>团购订单</Text>}
				{/*this.state.promotionTypeCode == 'INTEGRAL_EXCHANGE' && <Text style={{ fontSize: 18, color: '#333' }}>积分订单</Text>*/}
				{this.state.showOrderType ?
					<Image style={{ marginLeft: 3, width: 11, height: 11, resizeMode: 'contain' }} source={require('../res/orderlist/000sanjiaoshang.png')} /> :
					<Image style={{ marginLeft: 3, width: 11, height: 11, resizeMode: 'contain' }} source={require('../res/orderlist/000sanjiaoxia.png')} />
				}
			</TouchableOpacity>
		)

		return (
			<BaseView navigator={this.props.navigator}
				ref='base'
				head={head}
				leftBtnStyle={{ width: 10, height: 17, tintColor: '#444444' }}
				statusBarStyle={'default'}
				rightButton={(
					<TouchableOpacity style={{ justifyContent: 'center', marginRight: 13 }} onPress={() => { this._openSearch(); }}>
						<Image source={require('../res/orderlist/b005sousuo.png')} style={{ width: 19, height: 19, tintColor: '#444' }} />
					</TouchableOpacity>
				)}
			>
				<View style={{ flex: 1, backgroundColor: '#f1f4f3' }}>

					<MaskModal
						ref="orderType"
						viewType="top"
						closeCallback={() => { this.setState({ showOrderType: false }) }}
						contentView={this.renderFloatMenu()}>
						></MaskModal>

					<MaskModal
						ref="orderState"
						viewType="top"
						closeCallback={() => { this.setState({ showOrderState: false }) }}
						contentView={this.renderStateMenu()}>
						></MaskModal>

					<ScrollableTabView
						ref='scrollableTabView'
						//initialPage={0}
						tabBarTextStyle={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
						onChangeTab={(i) => {
							this.refs['List' + i.i] && this.refs['List' + i.i].pullRefresh();
						}}
						renderTabBar={() => (
							<ScrollableTabBar
								textViewStyle={{ width: 60, height: 20, alignItems: 'center', justifyContent: 'center', marginLeft: 40 }}
								tabStyle={{ height: 45, width: screenWidth / 5, alignItems: 'center', justifyContent: 'center', paddingLeft: 1 }}
								style={{ backgroundColor: "#fafafa", width: screenWidth - 40, height: 45, borderWidth: 0, }}
								underlineStyle={{ height: 2, width: 30, marginLeft: 5 }}
							/>
						)}
					>
						{this.state.stateList && this.state.stateList.map((item, index) => {
							let status;
							switch (index) {
								case 0:
									status = null;
									break;
								case 1:
									status = 2;
									break;
								case 2:
									status = 3;
									break;
								case 3:
									status = 4;
									break;
								case 4:
									status = 5;
									break;
								case 5:
									status = 6;
									break;
								case 6:
									status = 8;
									break;
							}
							return (
								<List key={index} ref={'List' + index} id={'List' + index} tabLabel={item}
									params={{ status: status, extraParams: this.state.extraParams, promotionTypeCode: this.state.promotionTypeCode }}
									navigator={this.props.navigator} promotionTypeCode={this.state.promotionTypeCode} />
							);
						})}

					</ScrollableTabView>
					<TouchableOpacity
						onPress={() => { this.refs.orderState.show() }}
						activeOpacity={0.8}
						style={{ backgroundColor: '#FAFAFA', width: 40, height: 45, position: 'absolute', right: 0, top: 0, justifyContent: 'center', alignItems: 'center' }}>
						<Image style={{ width: 11, height: 6 }} source={require('../res/orderlist/003sanjiao.png')} />
					</TouchableOpacity>
				</View>

			</BaseView>

		);
	}
}


function mapStateToProps(state) {
	return {
		// isLogin: state.user.isLogin,
		userInfo: state.Member.userInfo,
		isLogin: state.Member.isLogin,
	};
}

export default connect(mapStateToProps)(OrderList);



