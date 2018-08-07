
import React, { Component } from 'react';
import {
	Text,
	Image,
	ScrollView,
	TouchableHighlight,
	TouchableOpacity,
	View,
	PixelRatio,
	InteractionManager,
	StyleSheet,
	Platform
} from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

import Popup from 'react-native-popup';
import _ from 'underscore';

import ScrollableTabView from 'react-native-scrollable-tab-view';

import {
	RefreshableListView,
	ScrollableTabBar,
	ItemPicker,
	Separator,
	Arrow,
	Toast,
	Loading,
	BaseView
} from 'future/src/widgets';

import { Fetch, ImageUtil, RXUtil } from 'future/src/lib';
// import { RXUtil } from 'future/src/commons';

import styles from '../styles/OrderList';
import OrderSearch from './OrderSearch';
// import OrderDetail from './OrderDetail';
// import IntegralOrderDetail from './IntegralOrderDetail';
// import GroupBuyOrderDetail from './GroupBuyOrderDetail';
// import GiftCardOrderDetail from './GiftCardOrderDetail';
// import CitySendOrderDetail from './CitySendOrderDetail';


// //门店详情
// import ShopIndex from '../../citySend/components/ShopIndex';
// //商品详情
// import ProductDetail from '../../product/components/ProductDetail';
// //积分兑换
// import IntegralPrdList from '../../product/components/IntegralProductList';
// //团购详情
// import GroupPrdDetail from '../../groupBuy/components/ProductDetail';
// //礼品卡列表
// import GiftCardList from '../../giftCard/components/GiftCardList';
// //门店购物车
// import CitySendCart from '../../cart/components/CitySendCart';
// //评价晒单
// import OrderComment from './OrderComment';
// //物流详情
// import LogisticsDetail from './LogisticsDetail';
// //收银台
// import Counter from '../../cart/components/Counter';
// import PaySuccess from '../../cart/components/PaySuccess';


//普通购物车
// import Cart from '../../cart/components/Cart';

const screenWidth = require('Dimensions').get('window').width;
const screenHeight = require('Dimensions').get('window').height;

class List extends Component {

	constructor(props) {
		super(props);
		this.fetchData = this._fetchData.bind(this);
		this.renderRow = this._renderRow.bind(this);
		this.boomBtnClick = this._boomBtnClick.bind(this);
		this.reloadList = this._reloadList.bind(this);

		this.orderComment = this.orderComment.bind(this);
		this.buyAgain = this.buyAgain.bind(this);
		this.normalBuy = this.normalBuy.bind(this);
		this.groupBuy = this.groupBuy.bind(this);
		this.giftCardBuy = this.giftCardBuy.bind(this);
		this.citySendBuy = this.citySendBuy.bind(this);
		this.integralExchangeBuy = this.integralExchangeBuy.bind(this);

		// this.searchParams = {
		// 	orderType : this.props.params.orderType,
		// 	promotionType : this.props.params.promotionType,
		// 	searchField :  this.props.params.searchField,
		// 	startDate : this.props.params.startDate,
		// 	orderNum : this.props.params.orderNum,
		// 	limit : this.props.params.limit
		// },
		this.state = {
			selectTab: 0,
		}
		this.isInit = false;
	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.refs.list && this.refs.list.pullRefresh();
			setTimeout(() => { this.isInit = true; }, 100);
		});

		this.DeviceEventEmitter = RCTDeviceEventEmitter.addListener('callback', () => {
			this.reloadList();
		});
	}
	componentWillUnmount() {
		this.DeviceEventEmitter.remove();
	}
	componentWillReceiveProps(nextProps) {
		// 如果传入新的搜索参数，列表重置刷新
		if (!_.isEqual(this.props.params, nextProps.params)) {
			InteractionManager.runAfterInteractions(() => {
				this.refs.list && this.refs.list.pullRefresh();
			});
		}
	}
	_reloadList() {
		this.isInit &&
			InteractionManager.runAfterInteractions(() => {
				this.refs.list && this.refs.list.pullRefresh();
			});
	}
	_fetchData(page, success, error) {
		// orderType;//全部订单-0, 待付款-1, 待发货-2,  待收货-3,已完成-4, 待评价-5
		// promotionType;//normal groupBuy integralExchange //citySend//,giftCard,
		// promotionType;//订单类型，具体请查看 PromotionTypeCodeEnum
		// searchField;//搜索关键字
		// startDate;//开始时间
		// endDate;//结束时间
		// orderNum;//订单号
		// this.props.params.loadOrderCount();
		console.log('------------fetchData-----------', this.props.params);
		setTimeout(() => this.props.loadOrderListCount(), 100);
		const searchParams = Object.assign({}, this.props.params, { page: page })
		new Fetch({
			url: '/app/order/orderList.json',
			bodyType: 'json',
			data: searchParams
		}).dofetch().then((data) => {
			success(data.result, (page - 1) * 5 + data.result.length, data.totalCount);
		}).catch((err) => {
			console.log(err)
			error();
		});
	}
	updateAtIndex(index, rowData) {
		//this.props.params.loadOrderCount();
		const rows = [].concat(this.refs.list.getRows());
		const row = Object.assign({}, rows[Number(index)], rowData)
		rows[Number(index)] = row;
		this.refs.list.setRows(rows);
		setTimeout(() => this.props.loadOrderListCount(), 1000);
	}

	//再次购买
	buyAgain(orderId, type, orderItemList) {
		console.log('再次购买', orderId, type, orderItemList);
		if (type === "normal") {
			this.normalBuy(orderId, type, orderItemList);
		} else if (type === "groupBuy") {
			this.groupBuy(orderId, type, orderItemList);
		} else if (type === "citySend") {
			this.citySendBuy(orderId, type, orderItemList);
		} else if (type === "giftCard") {
			this.giftCardBuy(orderId, type, orderItemList);
		} else if (type === "integralExchange") {
			this.integralExchangeBuy(orderId, type, orderItemList);
		}
	}
	normalBuy(orderId, type, orderItemList) {
		//TODO 演示屏蔽
		return;
		Loading.show();
		new Fetch({
			url: "app/cart/buyAgain.json",
			data: {
				orderId: orderId,
			},
			show_error: false
		}).dofetch().then(data => {
			this.props.navigator.push({
				params: {
					orgId: data.result
				},
				component: Cart,
			});
		}).catch(err => {
			Toast.show("添加失败，请稍后重试");
		}).finally(() => {
			Loading.hide();
		})
	}
	groupBuy(orderId, type, orderItemList) {
		//TODO 演示屏蔽
		return;
		// TODO 注释跳转部分
		if (orderItemList.length > 0) {
			var orderItem = orderItemList[0];
			this.props.navigator.push({
				component: GroupPrdDetail,
				params: {
					groupBuyId: orderItem.groupById,
					productId: productId,
				}
			})
		}
	}
	giftCardBuy(orderId, type, orderItemList) {
		//TODO 演示屏蔽
		return;
		this.props.navigator.push({
			component: GiftCardList
		});
	}
	citySendBuy(orderId, type, orderItemList) {
		//TODO 演示屏蔽
		return;
		Loading.show();
		new Fetch({
			url: "app/citySend/cart/citySendBuyAgain.json",
			data: {
				orderId: orderId,
			},
			show_error: false
		}).dofetch().then(data => {
			this.props.navigator.push({
				params: {
					orgId: data.result
				},
				component: CitySendCart,
			});
		}).catch(err => {
			Toast.show("添加失败，请稍后重试");
		}).finally(() => {
			Loading.hide();
		})
	}

	integralExchangeBuy(orderId, type, orderItemList) {
		//TODO 演示屏蔽
		return;
		this.props.navigator.push({
			component: IntegralPrdList
		});
	}

	// 取消订单
	cancelOrder(orderId, itemIndex) {
		alert(orderId);
		// new Fetch({
		// 	url: "/app/order/cancelOrder.json",
		// 	data: {
		// 		orderId: orderId,
		// 	}
		// }).dofetch().then(data => {
		// 	this.updateAtIndex(itemIndex, { orderStat: "已取消" });
		// });
	}
	//提醒发货
	remindSend(orderId, itemIndex) {
		new Fetch({
			url: "/app/order/remindSend.json",
			data: {
				orderId: orderId,
			}
		}).dofetch().then(data => {
			this.updateAtIndex(itemIndex, { btnStyle: { rightBtnTitle: '已提醒发货' } });
		});
	}
	//查看物流
	lookLogisti = (orderId) => {
		//TODO 演示屏蔽
		return;
		this.props.navigator.push({
			params: {
				orderId: orderId
			},
			component: LogisticsDetail
		});
	}
	//立即支付
	gotoPay = (orderId, type) => {
		//TODO 演示屏蔽
		return;
		this.props.navigator.push({
			params: {
				orderId: orderId,
				promotionType: type,
				callback: () => this.reloadList()
			},
			component: Counter
		});
	}
	buyerSigned(orderId, itemIndex, type) {
		alert("buyerSigned" + orderId);
		// new Fetch({
		// 	url: "/app/order/buyerSigned.json",
		// 	data: {
		// 		orderId: orderId,
		// 	}
		// }).dofetch().then(data => {
		// 	const success = data.success;
		// 	if (success == "1") {
		// 		if (type == "giftCard" || type == "integralExchange") {
		// 			this.updateAtIndex(itemIndex, { orderStat: '已完成', btnStyle: { leftBtnVis: false, rightBtnTitle: '再次购买' } });
		// 		} else {
		// 			this.updateAtIndex(itemIndex, { orderStat: '待评价', btnStyle: { leftBtnVis: true, leftBtnTitle: '评价晒单', rightBtnVis: true, rightBtnTitle: '再次购买' } });
		// 		}
		// 	}
		// });
	}
	// 晒单评价
	orderComment(orderId, dataItem, itemIndex) {
		//TODO 演示屏蔽
		return;
		this.props.navigator.push({
			name: 'OrderComment',
			component: OrderComment,
			params: {
				orderId: orderId,
				// 这个数据可以传过去，不传在下一个组件中重新再请求一次后台，得到数据是一样的
				// orderItemList: dataItem.orderItemList,
				callback: () => {
					this.updateAtIndex(itemIndex, { orderStat: '已完成', btnStyle: { leftBtnTitle: '查看评价' } });
				},
			}
		})
	}
	//左右按钮点击
	_boomBtnClick(action, dataItem, itemIndex) {
		const orderId = dataItem.orderId;
		const type = dataItem.promotionType;

		if (action == "取消订单") {
			this.props.showMsgt('取消订单', '是否确认取消该订单？', () => { alert("取消") }, () => this.cancelOrder(orderId, itemIndex));
			//	this.props.showConfirm('取消订单', '是否确认取消该订单？', () => this.cancelOrder(orderId, itemIndex));//之前的写法
		}
		if (action == "立即支付") {
			this.gotoPay(orderId, type);
		}
		if (action == "提醒发货") {
			this.remindSend(orderId, itemIndex)
		}
		if (action == "确认收货") {
			if (dataItem.isSeparate == "Y") {
				this.props.openDetail(dataItem, () => this.refs.list.pullRefresh())
			} else {
				this.props.showMsgt('确认收货', '请确保收到货再确认收货', () => { alert("取消") }, () => this.buyerSigned(orderId, itemIndex, type));
			}
		}
		if (action == "查看物流") {
			if (dataItem.isSeparate == "Y") {
				this.props.openDetail(dataItem, () => this.refs.list.pullRefresh())
			} else {
				this.lookLogisti(orderId);
			}
		}
		if (action == "评价晒单") {
			this.props.showMsgt('确认收货', '请确保收到货再确认收货', () => { alert("取消") }, () => this.buyerSigned(orderId, itemIndex, type));//测试用的
			this.orderComment(orderId, dataItem, itemIndex);
		}
		if (action == "再次购买") {
			this.buyAgain(orderId, type, dataItem.orderItemList);
		}
		if (action == "查看评价") {
			this.orderComment(orderId, dataItem, itemIndex);
		}
	}
	getOrderBtnStyle(rowData, orderState, isRemind) {
		let style = rowData.promotionType

		let leftBtnTitle = rightBtnTitle = "";
		let leftBtnVis = rightBtnVis = true;
		if (orderState == "待付款") {
			leftBtnTitle = "取消订单";
			if (rowData.processStatCode != '0') {
				leftBtnVis = false;
			}
			rightBtnTitle = "立即支付";
		}
		if (orderState == "待发货") {
			leftBtnTitle = "取消订单";
			if (rowData.processStatCode != '0') {
				leftBtnVis = false;
			}
			rightBtnTitle = "提醒发货";
			if (isRemind != null && isRemind == "Y") {
				rightBtnTitle = "已提醒发货";
			}
			if (style == "groupBuy") {
				leftBtnVis = false;
			}
		}
		if (orderState == "待收货") {
			leftBtnTitle = "查看物流";
			rightBtnTitle = "确认收货";
			if (style == "citySend") {
				leftBtnVis = false;
			}
		}
		if (orderState == "待评价") {
			leftBtnTitle = "评价晒单";
			rightBtnTitle = "再次购买";
			if (style == "integralExchange") {
				leftBtnVis = false;
			}
			if (style == "giftCard") {
				leftBtnVis = false;
			}
			if (style == 'groupBuy') {
				rightBtnVis = false;
			}
		}

		if (orderState == "已完成") {
			leftBtnTitle = "查看评价";
			rightBtnTitle = "再次购买";
			if (style == "giftCard" || style == "integralExchange") {
				leftBtnVis = false;
			}
			if (style == 'groupBuy') {
				rightBtnVis = false;
			}
		}
		if (orderState == "已取消" || orderState == "拒收") {
			rightBtnTitle = "再次购买";
			leftBtnVis = false;
			if (style == 'groupBuy') {
				rightBtnVis = false;
			}
		}
		if (orderState == "发货中") {
			if (style == "citySend") {
				leftBtnVis = false;
			}
			leftBtnTitle = "查看物流";
			rightBtnTitle = "提醒发货";
			if (isRemind != null && isRemind == "Y") {
				rightBtnTitle = "已提醒发货";
			}
		}
		if (orderState == "用户已确认收货") {
			leftBtnVis = false;
			rightBtnTitle = "等待付款";
		}
		return { leftBtnTitle, rightBtnTitle, leftBtnVis, rightBtnVis };
	}
	renderCitySendShopTemplate(dataItem, rowID) {
		return (
			<TouchableOpacity onPress={() => { this.props.openShopIndex(dataItem); }}
				style={styles.citySendShopBtn}>
				<View style={styles.citySendShop}>
					<Text style={{ fontSize: 14, color: '#666666' }}>{dataItem.orgNm}</Text>
					<Arrow style={{ height: 27 }} />
				</View>
			</TouchableOpacity >
		)
	}
	renderOrderNoticeTemplate(dataItem) {
		return (
			<View style={styles.orderNotice}>
				<Image style={{ width: 14, height: 14 }} source={require('../res/001tishi_d.png')} />
				<Text style={{ color: '#ff5b54', fontSize: 9, marginLeft: 5 }}>很抱歉, 您的订单由于特殊原因, 部分商品还未发货, 请您耐心等待</Text>
			</View>
		)
	}
	renderOrderNumTemplate(dataItem) {
		return (
			<View key={dataItem.orderNum + "_a_" + "renderOrderNumTemplate"} style={styles.orderNum}>
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<Text style={{ fontSize: 12, color: '#666666' }}>订单编号: </Text>
					<Text style={{ fontSize: 12, color: '#666666', marginLeft: 4 }} >{dataItem.orderNum}</Text>
				</View>
				<Text style={{ fontSize: 12, color: '#ff0000' }}>{(dataItem.orderStat) != "用户已确认收货" ? dataItem.orderStat : "已收货"}</Text>
			</View>
		)
	}
	renderNormalPrdTemplate(prdData, promotionType, rowID, idx) {
		// TODO 是否赠品
		let isPresent = prdData.isPresent == "Y";
		let RXimg = RXUtil.get(prdData.medicinalTypeCode, prdData.prescriptionTypeCode);
		return (
			<View key={prdData.orderNum + "_b_" + rowID + "_" + idx}
				style={styles.normalPrd}>
				<Image
					style={{ marginVertical: 10, width: 80, height: 80, borderWidth: 1 / PixelRatio.get(), borderColor: '#e5e5e5' }}
					source={ImageUtil.get(prdData.image)}
					resizeMode={'contain'}
				/>
				{
					promotionType == 'groupBuy' &&
					<Image
						style={{ position: 'absolute', left: 0, top: 0, width: 25, height: 25 }}
						source={require('../res/009tuanbaioqian_d.png')} />
				}
				<View style={{ flex: 1, flexDirection: 'column', paddingVertical: 15, marginLeft: 5 }}>
					<View style={{ flex: 1, flexDirection: 'row' }}>
						<Text style={{ flex: 1, fontSize: 12, color: '#323232', }}
							numberOfLines={2}
						>{(RXimg ? (Platform.OS == "ios" ? "             " : "               ") : "")}{prdData.productNm}
						</Text>
						{
							isPresent &&
							<Text style={{ fontSize: 13, color: '#ff0000' }}>赠品</Text>
						}
						{!!RXimg &&
							<Image source={RXimg}
								style={[{ width: 39, height: 11, position: "absolute", left: 0 }, { top: Platform.OS == "ios" ? 1.5 : 3 }]} resizeMode={'contain'} />}
					</View>

					<Text style={{ marginVertical: 5, fontSize: 12, color: '#999999' }} numberOfLines={2}>
						{prdData.spec}
					</Text>
					<View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
						<Text style={{ fontSize: 12, color: '#666666' }}>￥{prdData.unitPrice}</Text>
						{
							promotionType == 'groupBuy' && (prdData.isDepositPayment == 'Y' && prdData.depositUnit != null ?
								<View style={{ marginLeft: 30, flex: 1, flexDirection: 'row', alignItems: 'center' }}>
									<Text style={{ fontSize: 8, color: '#fff', backgroundColor: '#ff5b54', padding: 2 }}>定金</Text>
									<Text style={{ fontSize: 12, color: '#666666', }}>￥{prdData.depositUnit}</Text>
								</View>
								:
								<View style={{ flex: 1 }} />
							)
						}
						<Text style={{ marginLeft: 30, fontSize: 12, color: '#666666' }}>X{prdData.quantity}</Text>
					</View>
				</View>
			</View>
		)
	}
	renderGiftCardPrdTemplate(prdData, rowID, idx) {
		return (
			<View key={prdData.orderNum + "_c_" + rowID + "_" + idx} style={styles.giftCardPrd}>
				<Image
					style={{ marginVertical: 10, width: 105, height: 67, borderWidth: 1 / PixelRatio.get(), borderColor: '#e5e5e5' }}
					source={ImageUtil.get(prdData.image)}
					resizeMode={'contain'}
				/>
				<Text style={{ flex: 1, marginLeft: 20, marginTop: 20, marginRight: 5, fontSize: 14, color: '#323232' }}>{prdData.productNm}</Text>
				<Text style={{ marginTop: 20, fontSize: 14, color: '#999999' }}>X{prdData.quantity}</Text>
			</View>
		)
	}
	renderIntegralPrdTemplate(prdData, idx) {
		let priceText;
		//只使用积分加金额的模式
		if (prdData.productIsUseIntegralMode == "N" && prdData.productIsUseIntegralCashMode == "Y") {
			priceText = prdData.productUnitIntegral + "积分+￥" + prdData.productUnitPrice;
		} else if (prdData.productIsUseIntegralMode == "Y" && prdData.productIsUseIntegralCashMode == "Y") {
			priceText = prdData.exchangeIntegral + "积分+￥" + prdData.exchangeAmount + "或" + prdData.productUnitIntegral + "积分";
		}
		return (
			<View key={"IntegralPrdTemplate_" + prdData.orderNum + "_" + idx} style={styles.integralPrd}>
				<Image
					style={{ marginVertical: 10, width: 80, height: 80, borderWidth: 1 / PixelRatio.get(), borderColor: '#e5e5e5' }}
					source={ImageUtil.get(prdData.image)}
					resizeMode={'contain'}
				/>
				<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', paddingVertical: 15, marginLeft: 5 }}>
					<Text style={{ flex: 1, fontSize: 12, color: '#333333' }} numberOfLines={2}>{prdData.productNm}</Text>
					<View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
						<Text style={{ flex: 1, fontSize: 12, color: '#666666', textAlign: 'left' }}>{priceText}</Text>
						<Text style={{ flex: 1, fontSize: 14, color: '#666666', textAlign: 'right' }}>X{prdData.quantity}</Text>
					</View>
				</View>
			</View>
		)
	}
	renderOrderAmountTemplate(dataItem) {
		let orderTotalAmount = null;
		if (dataItem.promotionType != 'integralExchange') {
			orderTotalAmount = '￥' + (dataItem.orderStat == "待付款" ? dataItem.unpaidAmount : dataItem.orderTotalAmount)
		} else {
			orderTotalAmount = dataItem.integralAmount + "积分" + "+￥" + dataItem.orderTotalAmount
		}
		return (
			<View style={styles.orderAmount}>
				<Text style={{ fontSize: 10, color: '#999999' }}>{dataItem.orderCreateTime}</Text>
				<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
					<Text style={{ fontSize: 12, color: '#666666' }}>共{dataItem.productTotalCount}件商品 实付: </Text>
					<Text style={{ fontSize: 12, color: '#ff0000' }}>{orderTotalAmount}</Text>
				</View>
			</View>
		)
	}
	renderGroupDepositAmountTemplate(dataItem) {
		return (
			<View style={styles.groupDepositAmount}>
				{
					(dataItem.canNotPayFinal != undefined || dataItem.canNotPayDeposit != undefined) ?
						<Text style={{ fontSize: 12, color: '#666666' }}>{dataItem.canNotPayFinal || dataItem.canNotPayDeposit}</Text>
						:
						<View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
							<Image source={require('../res/000daojishi_d.png')} ></Image>
							<Text style={{ fontSize: 12, color: '#999999', marginLeft: 2 }}>剩余</Text>
							<Text style={{ fontSize: 12, color: '#333333' }}>{dataItem.day}</Text>
							<Text style={{ fontSize: 12, color: '#999999' }}>天</Text>
							<Text style={{ fontSize: 12, color: '#333333' }}>{dataItem.houre}</Text>
							<Text style={{ fontSize: 12, color: '#999999' }}>小时</Text>
							<Text style={{ fontSize: 12, color: '#333333' }}>{dataItem.minute}</Text>
							<Text style={{ fontSize: 12, color: '#999999' }}>分</Text>
						</View>
				}
				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
					<Text style={{ fontSize: 12, color: '#666666' }}>{dataItem.remianAmountPrdNum}  {dataItem.totalAmountTag}</Text>
					<Text style={{ fontSize: 12, color: '#ff0000' }}>{dataItem.remianAmount}</Text>
				</View>
			</View>
		)
	}
	renderOrderBtnTemplate(btnStyle, rowData, rowID) {
		const { leftBtnVis, leftBtnTitle, rightBtnVis, rightBtnTitle } = Object.assign(btnStyle, rowData.btnStyle);
		return (
			<TouchableOpacity style={styles.orderBtnWrapT} activeOpacity={1}>
				<View style={styles.orderBtnWrap}>
					{
						leftBtnVis ?
							<TouchableOpacity
								onPress={this.boomBtnClick.bind(this, leftBtnTitle, rowData, rowID)}
								style={styles.leftBtn}>
								<Text style={{ fontSize: 12, color: '#666' }}>{leftBtnTitle}</Text>
							</TouchableOpacity>
							:
							<View style={{ flex: 1 }} />
					}
					<Separator width={22} type='ver' color='transparent' />
					{
						rightBtnVis ?
							<TouchableOpacity
								onPress={() => this.boomBtnClick(rightBtnTitle, rowData, rowID)}
								style={styles.rightBtn}>
								<Text style={{ fontSize: 12, color: '#fff' }}>{rightBtnTitle}</Text>
							</TouchableOpacity>
							:
							<View style={{ flex: 1 }} />
					}
				</View>
			</TouchableOpacity >
		)
	}
	// 普通订单
	renderNormalOrder(rowData, rowID, type) {
		const showNotice = ((rowData.isSeparate != null && rowData.isSeparate == "Y") && (rowData.isSendAll != null && rowData.isSendAll == "N"));
		const btnStyle = this.getOrderBtnStyle(rowData, rowData.orderStat, rowData.isRemind);
		return (
			<View>
				{rowID == '0' && type != "citySend" && this._renderSeparator()}
				{this.renderOrderNumTemplate(rowData)}
				{showNotice && this.renderOrderNoticeTemplate(rowData)}
				{rowData.orderItemList && rowData.orderItemList.map((item, idx) => {
					return this.renderNormalPrdTemplate(item, "normal", rowID, idx);
				})}
				{this.renderOrderAmountTemplate(rowData)}
				{rowData.orderStat != "用户已确认收货" && this.renderOrderBtnTemplate(btnStyle, rowData, rowID)}
			</View>
		)
	}
	// 团购订单
	renderGroupBuyOrder(rowData, rowID) {
		const showNotice = ((rowData.isSeparate != null && rowData.isSeparate == "Y") && (rowData.isSendAll != null && rowData.isSendAll == "N"));
		let isCanPayNext = "Y"; // 订单是否可以继续支付
		let boomBtnVisible = "Y"; // 底部按钮是否显示

		let groupAmountView = null;
		const orderItem = rowData.orderItemList[0];
		var groupAmountItem = {
			day: (orderItem.depositPayRemianTime == null || (orderItem.depositPayRemianTime)[0] <= 0) ? 0 : (orderItem.depositPayRemianTime)[0],
			houre: (orderItem.depositPayRemianTime == null || (orderItem.depositPayRemianTime)[1] <= 0) ? 0 : (orderItem.depositPayRemianTime)[1],
			minute: (orderItem.depositPayRemianTime == null || (orderItem.depositPayRemianTime)[2] <= 0) ? 0 : (orderItem.depositPayRemianTime)[2],
		};
		//isPayed订单已完成支付,//isDepositPayment是否订金支付//isDepositPayed订金是否已支付//
		if (orderItem.isDepositPayment == "Y") {
			//订单未完全支付
			if (rowData.isPayed == "N") {
				//定金未支付
				if (rowData.isDepositPayed == "N") {
					if (orderItem.depositIsStart == "Y" && orderItem.depositIsEnd == "N") {
						if (rowData.orderStat == "已取消") {
							groupAmountItem.canNotPayDeposit = '定金支付时间已过,无法支付';
						}
						groupAmountItem.remianAmountPrdNum = "共" + rowData.productTotalCount + "件商品";
						groupAmountItem.totalAmountTag = "订金:"
						groupAmountItem.remianAmount = "￥" + rowData.depositAmount;
						// groupDepositAmountTemplate1
					} else if (orderItem.depositIsStart == "Y" && orderItem.depositIsEnd == "Y") {
						isCanPayNext = "N";
						boomBtnVisible = "N";
						groupAmountItem.remianAmountPrdNum = "共" + rowData.productTotalCount + "件商品";
						groupAmountItem.totalAmountTag = "订金:"
						groupAmountItem.remianAmount = "￥" + rowData.depositAmount;
						groupAmountItem.canNotPayDeposit = '定金支付时间已结束';
					}
				} else {
					//定金已支付
					//尾款不可以支付,团购活动未结束,尾款支付未开始,
					if (orderItem.finalPayIsStart == "N" && orderItem.finalPayIsEnd == "N") {
						isCanPayNext = "N";
						//template : "groupRemianAmountTemplate2",
						groupAmountItem.canNotPayFinal = "尾款支付时间:" + orderItem.finalPaymentStartTime;
						groupAmountItem.totalAmountTag = "已付定金:";
						groupAmountItem.remianAmount = "￥" + rowData.depositAmount;
					}
					//尾款可以支付 ----  团购活动已结束,尾款支付开始时间在now之前(尾款支付已开始),尾款支付结束时间在now之后
					if (orderItem.finalPayIsStart == "Y" && orderItem.finalPayIsEnd == "N") {
						//template : "groupRemianAmountTemplate2",
						groupAmountItem.remianAmountPrdNum = "共" + rowData.productTotalCount + "件商品";
						groupAmountItem.totalAmountTag = "尾款:"
						groupAmountItem.remianAmount = "￥" + rowData.remianAmount;
					}
					if (orderItem.finalPayIsStart == "Y" && orderItem.finalPayIsEnd == "Y") {
						isCanPayNext = "N";
						boomBtnVisible = "N";
						groupAmountItem.remianAmountPrdNum = "共" + rowData.productTotalCount + "件商品";
						groupAmountItem.totalAmountTag = "尾款:"
						groupAmountItem.remianAmount = "￥" + rowData.remianAmount
						groupAmountItem.canNotPayFinal = "尾款支付时间结束";
						//"groupRemianAmountTemplate2"
					}
				}
				groupAmountView = this.renderGroupDepositAmountTemplate(groupAmountItem);
			} else {
				//"orderAmountTemplate"
				groupAmountView = this.renderOrderAmountTemplate(rowData);
			}
		} else {
			//"orderAmountTemplate",
			groupAmountView = this.renderOrderAmountTemplate(rowData);
		}
		let btnStyle = this.getOrderBtnStyle(rowData, rowData.orderStat, rowData.isRemind);
		btnStyle.rightBtnVis = (btnStyle.rightBtnVis && isCanPayNext == "Y" && btnStyle.rightBtnTitle != "再次购买") ? true : false;
		return (
			<View>
				{rowID == '0' && this._renderSeparator()}
				{this.renderOrderNumTemplate(rowData)}
				{showNotice && this.renderOrderNoticeTemplate(rowData)}
				{rowData.orderItemList && rowData.orderItemList.map((item) => {
					return this.renderNormalPrdTemplate(item, rowData.promotionType);
				})}
				{groupAmountView}
				{(rowData.orderStat != "已取消" && boomBtnVisible != "N") && this.renderOrderBtnTemplate(btnStyle, rowData, rowID)}
			</View>
		)
	}
	// 积分订单
	renderIntegralOrder(rowData, rowID) {
		const btnStyle = this.getOrderBtnStyle(rowData, rowData.orderStat, rowData.isRemind);
		return (
			<View>
				{rowID == '0' && this._renderSeparator()}
				{this.renderOrderNumTemplate(rowData)}
				{rowData.orderItemList && rowData.orderItemList.map((item, idx) => {
					return this.renderIntegralPrdTemplate(item, idx);
				})}
				{this.renderOrderAmountTemplate(rowData)}
				{this.renderOrderBtnTemplate(btnStyle, rowData, rowID)}
			</View>
		)
	}
	// 礼品卡订单
	renderGiftCardOrder(rowData, rowID) {
		const btnStyle = this.getOrderBtnStyle(rowData, rowData.orderStat, rowData.isRemind);
		return (
			<View>
				{rowID == '0' && this._renderSeparator()}
				{this.renderOrderNumTemplate(rowData)}
				{rowData.orderItemList && rowData.orderItemList.map((item, idx) => {
					return this.renderGiftCardPrdTemplate(item, rowID, idx);
				})}
				{this.renderOrderAmountTemplate(rowData)}
				{this.renderOrderBtnTemplate(btnStyle, rowData, rowID)}
			</View>
		)
	}
	// 同城送订单
	renderCitySendOrder(dataItem, rowID) {
		return (
			<View>
				{rowID == '0' && this._renderSeparator()}
				{this.renderCitySendShopTemplate(dataItem, rowID)}
				{this.renderNormalOrder(dataItem, rowID, "citySend")}
			</View>
		)
	}
	_renderRow(rowData, sectionID, rowID, highlightRow) {
		let content = null;
		if (rowData.promotionType === "normal" || rowData.promotionType === null) {
			content = this.renderNormalOrder(rowData, rowID);
		}
		if (rowData.promotionType === "groupBuy") {
			content = this.renderGroupBuyOrder(rowData, rowID);
		}
		if (rowData.promotionType === "integralExchange") {
			content = this.renderIntegralOrder(rowData, rowID);
		}
		if (rowData.promotionType === "giftCard") {
			if (rowData.downLoadPsw != null) {
				content = this.renderGiftCardOrder(rowData, rowID);
			} else {
				content = this.renderNormalOrder(rowData, rowID);
			}
		}
		if (rowData.promotionType === "citySend") {
			content = this.renderCitySendOrder(rowData, rowID);
		}
		return (
			<TouchableHighlight
				key={rowData.orderNum + "_e_" + rowID}
				underlayColor='#f0f8f8'
				onPress={() => { this.props.openDetail(rowData, () => this.refs.list.pullRefresh()) }}
				style={{ backgroundColor: "#fff" }}>
				{content}
			</TouchableHighlight>
		);
	}
	_renderSeparator(sectionID, rowID) {
		return (
			<View key={'key' + rowID} style={{ height: 10, backgroundColor: '#f0f8f8' }} />
		)
	}
	render() {
		return (
			<RefreshableListView
				ref="list"
				style={{ flex: 1 }}
				fetchData={this.fetchData}
				renderSeparator={this._renderSeparator}
				renderRow={this.renderRow}
			/>
		);
	}
}

export default class OrderList extends Component {
	constructor(props) {
		super(props);
		// 订单选择项 全部订单-0, 团购订单-1, 积分订单-2,  同城送订单-3,礼品卡订单-4
		this.promotionTypes = ["全部订单", "普通订单", "团购订单", "积分订单", "同城送订单", "礼品卡订单"];
		this.promotionTypeValues = [null, "normal", "groupBuy", "integralExchange", "citySend", "giftCard"];
		this.state = {
			promotionType: this.promotionTypeValues[0],
			displayPromotionType: this.promotionTypes[0],
		}
		this.onChangePromotionType = this._onChangePromotionType.bind(this);
		this.onChangeTab = this._onChangeTab.bind(this);
		this.openSearch = this._openSearch.bind(this);

		this.actions = {
			showConfirm: this._showConfirm.bind(this),
			openDetail: this._openDetail.bind(this),
			openShopIndex: this._openShopIndex.bind(this),
			openPrdDetail: this._openPrdDetail.bind(this),
			loadOrderListCount: this.loadOrderListCount
		}
		this.activePage = 0;
		this.tabs = [
			{ lab: "全部", param: { orderType: 0, limit: 5 } },
			{ lab: "待付款", param: { orderType: 1, limit: 5 } },
			{ lab: "待发货", param: { orderType: 2, limit: 5 } },
			{ lab: "待收货", param: { orderType: 3, limit: 5 } },
			{ lab: "已完成", param: { orderType: 4, limit: 5 } },
			{ lab: "待评价", param: { orderType: 5, limit: 5 } },
		];
	}
	componentDidMount() {

	}
	componentWillUnmount() {
		this.props.params && this.props.params.callback && this.props.params.callback();
	}
	loadOrderListCount = (promotionType) => {
		if (!promotionType) promotionType = this.state.promotionType;
		new Fetch({
			url: '/app/order/orderListCount.json',
			bodyType: 'json',
			data: {
				orderType: 0,
				promotionType: promotionType,
				searchField: this.state.searchField
			}
		}).dofetch().then((data) => {
			this.setState({
				counts: data.result
			})
		}).catch((err) => {
			console.log(err)
		});
	}

	_showConfirm(title, content, callback) {
		this.popup.confirm({
			title: title,
			content: content,
			ok: {
				text: '确认',
				callback: () => {
					callback();
				},
			},
			cancel: {
				text: '取消'
			}
		});
	}
	_openPrdDetail(rowData, type) {
		//TODO 演示屏蔽
		return;
		this.props.navigator.push({
			params: {
				productId: rowData.productId,
			},
			component: ProductDetail
		});
	}
	_openShopIndex(rowData) {
		//TODO 演示屏蔽
		return;
		this.props.navigator.push({
			params: {
				orgId: rowData.orgId,
				callback: () => { },
			},
			component: ShopIndex
		})
	}
	_openDetail(rowData, callback) {
		//TODO 演示屏蔽
		return;

		let detail = OrderDetail;
		if (rowData.promotionType === "normal" || rowData.promotionType === null) {
			detail = OrderDetail;
		} else if (rowData.promotionType === "groupBuy") {
			detail = GroupBuyOrderDetail;
		}
		else if (rowData.promotionType === "integralExchange") {
			detail = IntegralOrderDetail;
		}
		else if (rowData.promotionType === "giftCard") {
			detail = GiftCardOrderDetail;
		}
		else if (rowData.promotionType === "citySend") {
			detail = CitySendOrderDetail;
		}
		this.props.navigator.push({
			params: {
				orderId: rowData.orderId,
				callback: callback
			},
			component: detail
		})
	}
	_onChangeTab({ i, ref, from }) {
		if (i !== from) {
			InteractionManager.runAfterInteractions(() => {
				this.refs[ref.ref].reloadList();
			})
		}
	}
	_onChangePromotionType(value) {
		this.setState({
			displayPromotionType: value,
			promotionType: this.promotionTypeValues[this.promotionTypes.indexOf(value[0])]
		});
	}
	_openSearch() {
		this.props.navigator.push({
			params: {
				value: this.state.searchField,
				callback: (value) => {
					this.setState({
						searchField: value
					})
				}
			},
			component: OrderSearch
		})
	}
	renderTab = (isTabActive, title, page) => {
		// console.log("renderTab_" + title, page);
		const textColor = isTabActive ? '#2fbdc8' : '#999';
		const fontWeight = isTabActive ? 'bold' : 'normal';
		let num = 0;
		if ('待评价' == title) {
			num = !!this.state.counts ? this.state.counts.noComment : 0
		} else if ('待付款' == title) {
			num = !!this.state.counts ? this.state.counts.noPay : 0
		} else if ('待收货' == title) {
			num = !!this.state.counts ? this.state.counts.noReceive : 0
		} else if ('待发货' == title) {
			num = !!this.state.counts ? this.state.counts.noSend : 0
		}
		return (
			<TouchableOpacity style={{ width: 57, height: 35 }} activeOpacity={1}>
				<View style={[styles.tabStyle]}>
					<Text style={[{ color: textColor, fontWeight, }, { fontSize: 12 }]}>
						{title}
					</Text>
					<Image source={require("../res/002shuzibeijing.png")}
						style={[{ height: 15, justifyContent: "center", alignItems: "center", position: "absolute", right: 0, top: 2 }, { width: num > 0 ? 15 : 0 }]} >
						<Text style={{ fontSize: 9, color: "#fff", backgroundColor: "transparent" }} numberOfLines={1}>{num > 99 ? 99 : num}</Text>
					</Image>
				</View>
			</TouchableOpacity>
		)
	}
	_showPicker() {
		ItemPicker.show({
			dataSource: this.promotionTypes,
			onPickerConfirm: (selectedData, selectedIndex) => {
				this.setState({
					displayPromotionType: selectedData,
					promotionType: this.promotionTypeValues[selectedIndex]
				});
			},
			onPickerCancel: () => {

			}
		})
	}
	render() {
		let { displayPromotionType, counts, activePage, ...params } = this.state;
		return (
			<BaseView
				ref='base'
				style={{ flex: 1, backgroundColor: '#f0f8f8' }} navigator={this.props.navigator}
				rightButton={(
					<TouchableOpacity onPress={this.openSearch} >
						<Image source={require('../res/000sousuo.png')} style={{ width: 26, height: 26, marginRight: 12, marginTop: 10, }} />
					</TouchableOpacity>
				)}
				head={(<TouchableOpacity onPress={() => { this._showPicker() }} >
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text style={{ fontSize: 16, color: "#fff" }}>{this.state.displayPromotionType}</Text>
						<Image source={require('../res/001xianxiajiantou.png')} style={{ marginLeft: 5 }} />
					</View>
				</TouchableOpacity>)}
			>

				<ScrollableTabView
					tabBarBackgroundColor='#fff'
					initialPage={this.activePage}
					onChangeTab={this.onChangeTab}
					renderTabBar={() => (
						<ScrollableTabBar
							underlineHeight={2}
							tabsContainerStyle={styles.tabsContainerStyle}
							style={{
								height: 35,
								borderBottomWidth: 1 / PixelRatio.get(),
							}}
							renderTab={this.renderTab}
						/>
					)}
				>
					{
						this.tabs.map((tab, i) => {
							if (tab.lab == "已完成" && (this.state.promotionType != "integralExchange" && this.state.promotionType != "giftCard")) {
								return null;
							}
							if (tab.lab == "待评价" && (this.state.promotionType == "integralExchange" || this.state.promotionType == "giftCard")) {
								return null;
							}
							return <List
								showMsgt={(title, message, comfirm, cancle) => {
									this.refs.base.showAlertMessage(title, message, comfirm, cancle);
								}}
								ref={"list_" + i}
								i={i}
								key={i}
								tabLabel={tab.lab}
								navigator={this.props.navigator}
								params={Object.assign({}, tab.param, params)}
								{...this.actions} />;
						})
					}
				</ScrollableTabView>
			</BaseView>
		);
	}
}
