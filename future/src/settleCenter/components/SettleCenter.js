import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	ScrollView,
	TextInput,
	TouchableOpacity,
	Platform
} from 'react-native';
import { RefreshableListView, BaseView, MaskModal, NumberInput, DataController, Toast } from 'future/public/widgets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Fetch } from 'future/public/lib';
import styles from '../style/SettleCenter.css';
import CashierDesk from './CashierDesk';
import SettleResult from './SettleResult';
import CouponSelect from './CouponSelect';
let SCREEN_WIDTH = require('Dimensions').get('window').width;
let SCREEN_HEIGHT = require('Dimensions').get('window').height;
let selectIndex = 0;
export default class SettleCenter extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showDetail: false,
			currentUserAddInfos: {},
			addrList: [],
			senderTypes: {},
			senderType: [],
			invoiceInfos: {},
			orderDatas: [],
			cartList: {},
			shoppingCartIndex: -1,
		}
	}

	static defaultProps = {
		params: {},
	}
	componentDidMount() {


		// listAllReceiver
		this._loadShoppingCartData();

	}
	_loadShoppingCartData() {
		this.refs.baseview.showLoading();
		// console.log('........yyyyyyyy>>>>>>>>>>>>>>>>>>',this.props.params.type)
		//加载购物车数据
		new Fetch({
			url: 'app/cart/getShoppingCartList.json',
			method: 'POST',
			data: {
				type: this.props.params.type || 'normal'
			},
		}).dofetch().then((data) => {
			// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>',data);
			this._setDatas(data.cartList)
			this._getAllReceiver();

		}).catch((error) => {

			this.refs.baseview.hideLoading();
			console.log('获取进货单数据失败:', error);
		});
	}

	goToCoupon(cartValue) {
		// console.log('HHHHHHHHHHHHHHH',cartValue)
		//打开优惠券列表页面
		this.props.navigator.push({
			component: CouponSelect,
			params: {
				orgId: cartValue.orgId,
				type: cartValue.cartType,
				callBack: () => {
					setTimeout(()=>{
						this._loadShoppingCartData();
					},0)
				}
			}
		})
	}

	_setDatas(cartDatas) {
		// let types = [].concat(
		//     cartDatas.shoppingCarts.length>0?cartDatas.shoppingCarts[0].deliveryRuleList:[]
		// );
		// for(var n=0;n<types.length;n++){
		//     types[n].isChosed = false;
		// }
		let seletedDeliveryRuleIdArr = [];
		cartDatas.shoppingCarts.forEach((item, index) => {
			seletedDeliveryRuleIdArr.push(item.deliveryRuleId);
		})
		let orderDatas = [].concat(cartDatas.shoppingCarts);
		for (var i = 0; i < orderDatas.length; i++) {
			orderDatas[i].isOpen = false;
		}

		this.setState({
			// senderTypes:types,
			orderDatas: orderDatas,
			cartList: cartDatas,
			senderType: seletedDeliveryRuleIdArr,
		})
	}

	_getAllReceiver() {
		new Fetch({
			url: '/app/cart/listAllReceiver.json',
			method: 'POST',
		}).dofetch().then((data) => {
			if (data.success === true) {
				this.setState({
					addrList: data.result
				})
				this._getInvoiceInfos();
				for (var i = 0; i < data.result.length; i++) {
					if (data.result[i].isDefault === 'Y') {
						data.result[i].isSelected = true;
						selectIndex = i;
						this.setState({
							currentUserAddInfos: data.result[i],
						})
					} else {
						data.result[i].isSelected = false;
					}
				}
			}
		}).catch((error) => {
			this.refs.baseview.hideLoading();
			console.log('获取进货单数据失败:', error);
		});
	}
	_saveRemark(type, remark, orgId) {
		// 

		new Fetch({
			url: 'app/cart/saveCartRemark.json',
			method: 'POST',
			data: {
				type: type,
				remark: remark,
				orgId: orgId
			}
		}).dofetch().then((data) => {
			// console.log('OOOOOOO',data)
		}).catch((error) => {
			console.log('获取进货单数据失败:', error);
		});
	}
	_getInvoiceInfos() {
		new Fetch({
			url: 'app/cart/getInvoice.json',
			method: 'POST',
		}).dofetch().then((data) => {
			this.refs.baseview.hideLoading();
			this.setState({
				invoiceInfos: data.result
			})

		}).catch((error) => {
			this.refs.baseview.hideLoading();
			console.log('获取进货单数据失败:', error);
		});
	}
	_gotoCashierDesk() {
		//先判断是否有配送方式
		// let isAllHasDeliveryWay = true;
		// this.state.orderDatas.forEach((item, index) => {
		// 	if (item.deliveryRuleId == null) {
		// 		isAllHasDeliveryWay = false;
		// 	}
		// })
		// if (isAllHasDeliveryWay == false) { return Toast.show('请选择配送方式') };

		new Fetch({
			url: 'app/cart/addOrder.json',
			method: 'POST',
			data: { type: this.props.params.type || 'normal', isNeedInvoice: 'Y' }
		}).dofetch().then((data) => {
			if (data.success) {
				this.props.navigator.push({
					component: CashierDesk,
					params: {
						isSettleCenter: true,
						orderIds: data.orderIds,
						needPayAmount: this.state.cartList.allOrderTotalAmount
					}
				})

			} else {
				this.props.navigator.push({
					component: SettleResult,
					params: {
						title: '订单提交',
						resultContent: '抱歉，提交订单失败!',
						success: false,
						returnTitle: '返回进货单',
						reason: '网络异常，提交未成功，请重新下单'
					}
				})
			}
		}).catch((error) => {
			console.log('获取进货单数据失败:', error);
		});
		//失败
		// this.props.navigator.push({
		//     component:SettleResult,
		//     params:{
		//         title:'订单提交',
		//         resultContent:'抱歉，提交订单失败!',
		//         success:false,
		//         returnTitle:'返回进货单',
		//         reason:'网络异常，提交未成功，请重新下单'
		//     }
		// })
		//成功     
		// this.props.navigator.push({
		//     component:SettleResult,
		//     params:{
		//         title:'订单提交',
		//         resultContent:'恭喜您，您的提交订单成功!',
		//         success:true,
		//         returnTitle:'查看订单',
		//         receiverInfos:{
		//             receiver:this.state.currentUserAddInfos.name,
		//             receiverAddr:this.state.currentUserAddInfos.addr,
		//             receiverMobile:this.state.currentUserAddInfos.mobile
		//         }
		//     }
		// })


	}
	_selectAddr(index) {
		selectIndex = index;
		for (let i = 0; i < this.state.addrList.length; i++) {
			this.state.addrList[i].isSelected = false;
		}
		this.state.addrList[index].isSelected = !this.state.addrList[index].isSelected;
		this.setState({
			addrList: this.state.addrList
		})
	}
	_submitSelectAddress() {
		this.refs.stateModal.hide()
		this.setState({
			currentUserAddInfos: this.state.addrList[selectIndex]
		})
		//选择地址请求
		new Fetch({
			url: 'app/cart/selectReceiver.json',
			method: 'POST',
			data: {
				type: 'normal',
				receiveAddrId: this.state.addrList[selectIndex].receiveAddrId
			}
		}).dofetch().then((data) => {

		}).catch((error) => {
			console.log('获取进货单数据失败:', error);
		});
	}
	_submitSelectSenderType(shoppingCartObj, deliveryRuleId, shoppingCartObjIndex) {
		new Fetch({
			url: 'app/cart/selectDeliveryRule.json',
			method: 'POST',
			data: {
				type: this.props.params && this.props.params.type || 'normal',
				deliveryRuleId: deliveryRuleId,
				orgId: shoppingCartObj.orgId,
			}
		}).dofetch().then((data) => {
			if (data.success) {
				let arr = this.state.orderDatas.slice(0);
				arr[shoppingCartObjIndex].deliveryRuleId = deliveryRuleId;
				this.setState({
					orderDatas: arr
				});
			}
			this.refs.senderModal.hide();
		}).catch((error) => {
			console.log('err:', error);
			this.refs.senderModal.hide();
		});

	}
	_submitInvoice() {
		this.refs.invoice.hide();
	}

	onChangeDeliveryWay(item, idIndex) {
		let arr = this.state.senderType.slice(0);
		arr[idIndex] = item.deliveryRuleId;
		this.setState({
			senderType: arr,
		})
	}

	//地址选择弹出层
	_renderAddrMask(MaskInfos) {
		return (
			<View style={{ width: SCREEN_WIDTH, height: 330, backgroundColor: '#fff', marginTop: SCREEN_HEIGHT - 394, justifyContent: 'space-between' }}>
				<View>
					<Text style={{ marginTop: 20, fontSize: 15, color: "#333", marginLeft: 13, fontWeight: 'bold' }}>收货地址</Text>

					{MaskInfos.map((address, index) => {
						return (<TouchableOpacity key={'mask' + index} onPress={this._selectAddr.bind(this, index)}>
							<View style={{ width: SCREEN_WIDTH, height: 95, flexDirection: 'row', justifyContent: 'space-between' }}>
								<View>
									<Text style={{ marginTop: 15, fontSize: 15, color: "#333", marginLeft: 13 }}>{address.name}     {address.mobile}</Text>
									<Text style={{ marginTop: 7, fontSize: 15, color: "#333", marginLeft: 13, width: SCREEN_WIDTH - 45 }} numberOfLines={2}>{address.addressPath} {address.addr}</Text>
								</View>
								<View style={{ width: 32, height: 95, justifyContent: 'center', alignItems: 'center' }}>
									<Image
										style={{ width: 16, height: 16 }}
										source={address.isSelected == true ? require('../res/CashierDesk/000gouxuan_s.png') : require('../../stocksList/res/images/000weigouxuan.png')}
										resizeMode='contain' />
								</View>
							</View>
						</TouchableOpacity>)
					})}
				</View>
				<TouchableOpacity style={{ width: SCREEN_WIDTH, height: 50, backgroundColor: '#34457D', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end' }} onPress={this._submitSelectAddress.bind(this)}>
					<Text style={{ color: '#fff', fontSize: 16 }}>确定</Text>
				</TouchableOpacity>
			</View>
		)
	}
	//配送方式选择弹出层
	_renderSenderTypeMask(senderTypes, idIndex) {
		return (
			<View style={{ width: SCREEN_WIDTH, height: 330, backgroundColor: '#fff', marginTop: SCREEN_HEIGHT - 394, justifyContent: 'space-between' }}>
				<View style={{ flex: 1 }}>
					<Text style={{ marginTop: 20, fontSize: 15, color: "#333", marginLeft: 13, marginBottom: 10, fontWeight: 'bold' }}>配送方式</Text>
					{
						// <TouchableOpacity style={{width:SCREEN_WIDTH,height:50,marginTop:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
						// 	 <Text style={{marginLeft:13,fontSize:14,color:'#53606A'}}>默认配送方式</Text>
						// </TouchableOpacity>
					}
					<ScrollView>
						{senderTypes.deliveryRuleList && senderTypes.deliveryRuleList.map((item, index) => {
							return <TouchableOpacity
								onPress={() => {
									this.onChangeDeliveryWay(item, idIndex);
								}}
								key={'sender' + index}
								style={{ width: SCREEN_WIDTH, height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
								<Text style={{ marginLeft: 13, fontSize: 14, color: '#53606A' }}>{item.deliveryRuleNm}</Text>
								<Image style={{ width: 15, height: 10, marginRight: 13 }} source={this.state.senderType[idIndex] == item.deliveryRuleId ? require('../res/CashierDesk/000gouxuan.png') : null} />
							</TouchableOpacity>
						})}
					</ScrollView>
				</View>
				<TouchableOpacity style={{ width: SCREEN_WIDTH, height: 50, backgroundColor: '#34457D', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end' }}
					onPress={() => {
						this._submitSelectSenderType(senderTypes, this.state.senderType[idIndex], idIndex);
					}}>
					<Text style={{ color: '#fff', fontSize: 16 }}>确定</Text>
				</TouchableOpacity>
			</View>
		)
	}
	//发票信息弹出层
	_renderInvoiceMask(invoiceInfos) {
		let invoice = invoiceInfos.invoiceType === '0' ? '增值税普通发票' : '增值税专用发票';
		return (
			<View style={{ flex: 1, flexDirection: 'column' }}>
				<View style={{ flex: 1, backgroundColor: "#0000" }} />
				<View style={{ width: SCREENWIDTH, backgroundColor: '#fff', justifyContent: 'space-between' }}>
					<View>
						<Text style={{ marginTop: 20, fontSize: 15, color: "#333", marginLeft: 13, fontWeight: 'bold' }}>发票信息</Text>

						<View style={{ width: SCREENWIDTH, height: 45, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
							<Text style={{ marginLeft: 13, fontSize: 14, color: '#53606A' }}>发票类别     {invoice}</Text>
						</View>

						<View style={{ width: SCREENWIDTH, height: 45, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
							<Text style={{ marginLeft: 13, fontSize: 14, color: '#53606A' }}>发票抬头     {invoiceInfos.invoiceTitle}</Text>
						</View>

						<View style={{ width: SCREENWIDTH, height: 45, marginTop: 7, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
							<Text style={{ marginLeft: 13, fontSize: 14, color: '#53606A' }}>发票税号     {invoiceInfos.invoiceCode}</Text>
						</View>

						<View style={{ width: SCREENWIDTH, height: 45, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
							<Text style={{ marginLeft: 13, fontSize: 14, color: '#53606A' }}>开票电话     {invoiceInfos.invoicePhone}</Text>
						</View>

						<View style={{ width: SCREENWIDTH, height: 45, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
							<Text style={{ marginLeft: 13, fontSize: 14, color: '#53606A' }}>发票地址     {invoiceInfos.invoiceAddress}</Text>
						</View>

						{
							invoiceInfos.invoiceType === '0' ? null :
								(
									<View style={{ width: SCREENWIDTH, height: 45, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
										<Text style={{ marginLeft: 13, fontSize: 14, color: '#53606A' }}>开户银行     {invoiceInfos.invoiceBank}</Text>
									</View>
								)
						}
						{
							invoiceInfos.invoiceType === '0' ? null :
								(
									<View style={{ width: SCREENWIDTH, height: 45, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
										<Text style={{ marginLeft: 13, fontSize: 14, color: '#53606A' }}>银行账号     {invoiceInfos.invoiceBankCode}</Text>
									</View>
								)
						}
					</View>
					<TouchableOpacity style={{ width: SCREENWIDTH, height: 50, backgroundColor: '#34457D', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end' }} onPress={this._submitInvoice.bind(this)}>
						<Text style={{ color: '#fff', fontSize: 16 }}>关闭</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}

	renderDeliveryWay(value, item) {
		if (value == null) { return '请选择' };
		let wayName = '';
		item.forEach((e, i) => {
			if (e.deliveryRuleId == value) {
				wayName = e.deliveryRuleNm;
			}
		})
		return wayName;
	}

	resetDeliveryWay() {
		if (this.state.orderDatas[this.state.shoppingCartIndex].deliveryRuleId != this.state.senderType[this.state.shoppingCartIndex]) {
			let arr = this.state.senderType.slice(0);
			arr[this.state.shoppingCartIndex] = this.state.orderDatas[this.state.shoppingCartIndex].deliveryRuleId;
			this.setState({
				senderType: arr,
			})
		}
	}

	render() {
		let orderDatas = this.state.orderDatas;
		let Cods = 0;
		for (var i = 0; i < orderDatas.length; i++) {
			if (orderDatas[i].isSupportCod == false) {
				Cods++;
			}
		}


		return (
			<BaseView
				ref='baseview'
				navigator={this.props.navigator}
				title={{ title: '订单提交', tintColor: '#333', fontSize: 18 }}
			>
				<DataController data={this.state.cartList}>
					<KeyboardAwareScrollView
						keyboardDismissMode={'on-drag'}
						style={styles.scrollView}>

						<TouchableOpacity onPress={() => {
							this.refs.stateModal.show()
						}} style={styles.topView}>
							<View>
								<Text style={styles.userInfos}>
									{this.state.currentUserAddInfos.name ? this.state.currentUserAddInfos.name : ''}
									{this.state.currentUserAddInfos.mobile ? this.state.currentUserAddInfos.mobile : ''}
								</Text>
								<Text style={styles.userAddr} numberOfLines={2}>{(this.state.currentUserAddInfos.addressPath ? this.state.currentUserAddInfos.addressPath : '') + ' ' +
									(this.state.currentUserAddInfos.addr ? this.state.currentUserAddInfos.addr : '')}</Text>
							</View>
							<View style={{ width: 32, height: 95, justifyContent: 'center', alignItems: 'center' }}>
								<Image style={{ width: 6, height: 11 }} source={require('../res/CashierDesk/004sanjiaoxianyou.png')} />
							</View>
						</TouchableOpacity>
						{this.props.params.isPayWhenResieved && Cods > 0 && <View style={{ height: 35, width: SCREEN_WIDTH, backgroundColor: '#FF7F79', flexDirection: 'row', alignItems: 'center' }}>
							<Image style={{ width: 13, height: 13, marginLeft: 13 }} resizeMode='contain' source={require('../res/SettleCenter/clock.png')} />
							<Text style={{ fontSize: 13, color: '#fff' }}> 结算页中有{Cods}家卖家暂不支持货到付款</Text>
						</View>}
						<View style={{ marginTop: 10, flex: 1, backgroundColor: '#fff' }}>
							<View style={{ flexDirection: 'row', height: 50, width: SCREEN_WIDTH, justifyContent: 'space-between', alignItems: 'center', borderBottomColor: '#e5e5e5', borderBottomWidth: 0.5 }}>
								<Text style={{ marginLeft: 13, fontSize: 14, color: '#666' }}>进货清单</Text>
								<TouchableOpacity onPress={() => {
									this.setState({
										showDetail: !this.state.showDetail
									})
								}}>
									<Text style={{ marginRight: 13, fontSize: 14, color: '#666' }}>{this.state.showDetail ? '隐藏明细' : '显示明细'}</Text>
								</TouchableOpacity>
							</View>
							{orderDatas.map((value, index) => {
								let products = value.cartItems.map((item, tag) => {
									if (value.isOpen == true && item.itemSelected) {
										return <View key={'prd' + tag} style={{ alignItems: 'center' }}>
											<View style={{ flexDirection: 'row', marginTop: 15, width: SCREEN_WIDTH, justifyContent: 'space-between', alignItems: 'center' }}>
												<Text style={{ marginLeft: 13, fontSize: 14, color: '#798B9A', width: SCREEN_WIDTH - 66 }}>{item.name}</Text>
												<Text style={{ marginRight: 13, fontSize: 14, color: '#798B9A' }}>{!this.state.showDetail && ('x' + item.quantity)}</Text>
											</View>
											{this.state.showDetail && <View style={{ marginTop: 10, height: 90, width: SCREEN_WIDTH - 26, backgroundColor: '#F8F8F8', flexDirection: 'row', justifyContent: 'space-between' }}>
												<View style={{ marginLeft: 15 }}>
													<View style={{ marginTop: 10, width: SCREEN_WIDTH - 26, flexDirection: 'row', justifyContent: 'space-between' }}>
														<Text style={{ fontSize: 13, color: '#5C6A74' }}>规格：{item.specName}</Text>
														<Text style={{ fontSize: 13, color: '#5C6A74', marginRight: 28 }}>¥{item.productTotalAmount}</Text>
													</View>
													<View style={{ marginTop: 10, width: SCREEN_WIDTH - 26, flexDirection: 'row', justifyContent: 'space-between' }}>
														<Text style={{ fontSize: 12, color: '#5C6A74' }}>厂家：{item.factory}</Text>
														<Text style={{ fontSize: 12, color: '#5C6A74', marginRight: 28 }}>x{item.quantity}</Text>
													</View>
													<View style={{ marginTop: 10, width: SCREEN_WIDTH - 26 }}>
														<Text style={{ fontSize: 12, color: '#5C6A74', width: 200 }}>单价：¥{item.productUnitPrice}</Text>
													</View>
												</View>
											</View>}
										</View>
									} else {
										if (tag < 2 && item.itemSelected) {
											return <View key={'prd' + tag} style={{ alignItems: 'center' }}>
												<View style={{ flexDirection: 'row', marginTop: 15, width: SCREEN_WIDTH, justifyContent: 'space-between', alignItems: 'center' }}>
													<Text style={{ marginLeft: 13, fontSize: 14, color: '#798B9A', width: SCREEN_WIDTH - 66 }}>{item.name}</Text>
													<Text style={{ marginRight: 13, fontSize: 14, color: '#798B9A' }}>{!this.state.showDetail && ('x' + item.quantity)}</Text>
												</View>
												{this.state.showDetail && <View style={{ marginTop: 10, height: 90, width: SCREEN_WIDTH - 26, backgroundColor: '#F8F8F8', flexDirection: 'row', justifyContent: 'space-between' }}>
													<View style={{ marginLeft: 15, justifyContent: 'center' }}>
														<View style={{ width: SCREEN_WIDTH - 26, flexDirection: 'row', justifyContent: 'space-between' }}>
															<Text style={{ fontSize: 13, color: '#5C6A74' }}>规格：{item.specName}</Text>
															<Text style={{ fontSize: 13, color: '#5C6A74', marginRight: 28 }}>¥{item.productTotalAmount}</Text>
														</View>
														<View style={{ marginTop: 10, width: SCREEN_WIDTH - 26, flexDirection: 'row', justifyContent: 'space-between' }}>
															<Text style={{ fontSize: 12, color: '#5C6A74' }}>厂家：{item.factory}</Text>
															<Text style={{ fontSize: 12, color: '#5C6A74', marginRight: 28 }}>x{item.quantity}</Text>
														</View>
														<View style={{ marginTop: 10, width: SCREEN_WIDTH - 26 }}>
															<Text style={{ fontSize: 12, color: '#5C6A74', width: 200 }}>单价：¥{item.productUnitPrice}</Text>
														</View>
													</View>
												</View>}
											</View>
										} else {
											return null;
										}
									}
								});
								let shop = orderDatas[index].selectedItemNum > 0 ? <View key={'shop' + index}>
									{index > 0 && <View style={{ width: SCREEN_WIDTH, height: 10, backgroundColor: '#fafafa' }} />}
									<View style={{ height: 50, flexDirection: 'row', alignItems: 'center' }}>
										<Text style={{ fontSize: 14, color: '#ff6600', marginLeft: 14 }}>订单{index + 1}：
										<Text style={{ fontSize: 14, color: '#333', marginLeft: 14 }}>{value.shopNm}</Text>
										</Text>
										{value.hadRecordSta != 1 &&
											<Image style={{ width: 74, height: 15, marginLeft: 10 }} source={require('../res/SettleCenter/006weijianli02.png')} />
										}
									</View>
									<View style={{ backgroundColor: '#e5e5e5', height: 0.5, width: SCREEN_WIDTH - 12, marginLeft: 12 }}>
									</View>
									{/*** 商品列表 ***/}
									{products}
									{/*** 商品赠品 ***/}
									{value.orderPresents&&value.orderPresents.length>0&&<View>
									{value.orderPresents.map((ordPresent,index)=>{
                                        return <View key={'ordPresent'+index}  
										style={{flexDirection: 'row', marginTop: 15, width: SCREEN_WIDTH, justifyContent: 'space-between', alignItems: 'center'}}>
                                        <Text 
                                        style={{ marginLeft: 8, fontSize: 14, color: '#798B9A', width: SCREEN_WIDTH - 66 }}>【赠品】{ordPresent.name}</Text>
                                        <Text style={{ marginRight: 13, fontSize: 14, color: '#798B9A' }}>x{ordPresent.quantity}</Text>
                                        </View>
                                    })}</View>}
									<View style={{ backgroundColor: '#e5e5e5', marginTop: 15, height: 0.5, width: SCREEN_WIDTH - 24, marginLeft: 12 }}>
									</View>
									{value.cartItems.length > 2 && <View style={{ width: SCREEN_WIDTH, height: 45, justifyContent: 'center', alignItems: 'center' }}>
										<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {
											orderDatas[index].isOpen = !orderDatas[index].isOpen;
											this.setState({
												orderDatas: orderDatas
											});
										}}>
											<Text style={{ fontSize: 14, color: '#9DA1AB' }}>{value.isOpen == false ? '查看其他' : '收起'}</Text>
											<Image style={{ height: 5, width: 10 }} source={value.isOpen == false ? require('../res/CashierDesk/sanjiao.png') : require('../res/CashierDesk/sanjiaoshang.png')} />
										</TouchableOpacity>
									</View>}
									<View style={{ height: 52, width: SCREEN_WIDTH, flexDirection: 'column', paddingHorizontal: 13 }}>
										<View style={{ width: SCREEN_WIDTH - 26, height: 30, backgroundColor: '#ff0', marginTop: 6 }}>
											<TextInput
												placeholder={'我要给卖家留言(可选填)'}
												underlineColorAndroid="transparent"
												maxLength={20}
												onChangeText={(txt) => {
													this.refs['mark' + index].setNativeProps({
														text: txt.length + '/20'
													})
												}}
												style={{
													backgroundColor: '#fafafa',
													fontSize: 13,
													height: 30, width: SCREEN_WIDTH - 26,
													paddingLeft: 8,
													flexDirection: "row", alignItems: 'center',
													paddingVertical: 0,
												}}
												onEndEditing={(event) => this._saveRemark(value.cartType, event.nativeEvent.text, value.orgId)} />
										</View>
										<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
											<TextInput
												editable={false}
												ref={'mark' + index}
												underlineColorAndroid="transparent"
												value={'0/20'}
												style={{ width: 35, height: 16, fontSize: 10, color: '#333',paddingVertical: 0,}} />
										</View>
									</View>
									{/*配送方式*/}
									<TouchableOpacity onPress={() => {
										this.setState({ senderTypes: orderDatas[index], shoppingCartIndex: index })
										this.refs.senderModal.show()
									}}>
										<View style={{ height: 52, width: SCREEN_WIDTH, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: '#e5e5e5', borderBottomWidth: 0.5, borderTopColor: '#e5e5e5', borderTopWidth: 0.5 }}>
											<View style={{ flexDirection: 'row', alignItems: 'center' }}>
												<Text style={{ fontSize: 15, color: '#666', marginLeft: 13 }}>配送方式   </Text>
												{(this.props.params.isPayWhenResieved && value.isSupportCod == false) && <View style={{ borderColor: '#FF7F79', borderWidth: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 3 }}>
													<Text style={{ color: '#FF7F79', height: 20, lineHeight: 20, fontSize: 12 }}> 无货到付款服务 </Text>
												</View>}
											</View>
											<View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13 }}>
												<Text style={{ fontSize: 13, color: '#999', marginRight: 13 }}>
													{
														this.renderDeliveryWay(orderDatas[index].deliveryRuleId, orderDatas[index].deliveryRuleList)
													}
												</Text>
												<Image
													style={{ width: 7, height: 13 }}
													source={require('../../order/res/OrderDetail/000xiangyousanjiao.png')} />
											</View>
										</View>
									</TouchableOpacity>
									{/*优惠券*/}
									<TouchableOpacity style={{ backgroundColor: '#fafafa',borderBottomColor: '#e5e5e5', borderBottomWidth: 0.5  }} onPress={() => {
										this.goToCoupon(value);
									}}>
										<View style={{ height: 52, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', backgroundColor: '#fff' }}>
											<Text style={{ fontSize: 15, color: '#666', marginLeft: 13 }}>优惠券</Text>
											<View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13 }}>
												<Text style={{ fontSize: 14, color: '#bbb', marginRight: 13 }}>
													{value.couponNum == 0 && value.discountAmount == 0 ?
														'无可用' : (
															value.couponDiscount < 0 ? '-￥' + (-value.couponDiscount).toFixed(2) : '可用券' + value.couponNum + '张'
														)}
												</Text>
												<Image
													style={{ width: 7, height: 13 }}
													source={require('../../order/res/OrderDetail/000xiangyousanjiao.png')} />
											</View>
										</View>
									</TouchableOpacity>

									<View style={{ alignItems: 'center', height: 94, borderBottomColor: '#e5e5e5', borderBottomWidth: 0.5 }}>
										<View style={{ width: SCREEN_WIDTH - 26, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
											<Text style={{ color: '#53606A', fontSize: 13 }}>运费</Text>
											<Text style={{ color: '#53606A', fontSize: 13 }}>￥{value.freightAmount}</Text>
										</View>
										{/*满减优惠****需要字段*/}
										<View style={{ width: SCREEN_WIDTH - 26, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
											<Text style={{ color: '#53606A', fontSize: 13 }}>满减优惠</Text>
											<Text style={{ color: '#53606A', fontSize: 13 }}>￥{value.discountAmount}</Text>
										</View>
										<View style={{ width: SCREEN_WIDTH - 26, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
											<Text style={{ color: '#53606A', fontSize: 13 }}>{value.productNum}件|小计（含运费）</Text>
											<Text style={{ color: '#53606A', fontSize: 13 }}>￥{value.orderTotalAmount}</Text>
										</View>
									</View>
								</View> : null;
								return shop;
							})}



							<TouchableOpacity style={{ backgroundColor: '#fafafa' }} onPress={() => {
								this.refs.invoice.show()
							}}>
								<View style={{ marginTop: 10, height: 52, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', backgroundColor: '#fff' }}>
									<Text style={{ fontSize: 15, color: '#666', marginLeft: 13 }}>发票信息</Text>
									<View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13 }}>
										<Text style={{ fontSize: 14, color: '#bbb', marginRight: 13 }}>
											{this.state.invoiceInfos.invoiceType == '0' ? '增值税普通发票' : '增值税专用发票'}
										</Text>
										<Image
											style={{ width: 7, height: 13 }}
											source={require('../../order/res/OrderDetail/000xiangyousanjiao.png')} />
									</View>
								</View>
							</TouchableOpacity>



							<View style={{ backgroundColor: '#fafafa' }}>
								<View style={{ marginTop: 10, alignItems: 'center', flex: 1, paddingBottom: 10, backgroundColor: '#fff', borderBottomColor: '#e5e5e5', borderBottomWidth: 0.5 }}>
									<View style={{ width: SCREEN_WIDTH - 26, flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
										<Text style={{ color: '#53606A', fontSize: 13 }}>商品总金额</Text>
										<Text style={{ color: '#53606A', fontSize: 13 }}>￥{
											(this.state.cartList.allProductTotalAmount ? this.state.cartList.allProductTotalAmount : 0).toFixed(2)
										}</Text>
									</View>
									<View style={{ width: SCREEN_WIDTH - 26, flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
										<Text style={{ color: '#53606A', fontSize: 13 }}>总运费</Text>
										<Text style={{ color: '#53606A', fontSize: 13 }}>￥{
											(this.state.cartList.allFreightAmount ? this.state.cartList.allFreightAmount : 0).toFixed(2)
										}</Text>
									</View>
									<View style={{ width: SCREEN_WIDTH - 26, flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
										<Text style={{ color: '#53606A', fontSize: 13 }}>总优惠</Text>
										<Text style={{ color: '#53606A', fontSize: 13 }}>￥{
											(this.state.cartList.allDiscountAmount ? this.state.cartList.allDiscountAmount : 0).toFixed(2)
										}</Text>
									</View>
								</View>
							</View>
						</View>
					</KeyboardAwareScrollView>
					<View style={styles.bottomMenu}>
						<Text style={styles.amountTotalInfo}>共{this.state.cartList.allSelectedItemNum}种  应付金额<Text style={styles.amount}>￥{
							(this.state.cartList.allOrderTotalAmount ? this.state.cartList.allOrderTotalAmount : 0).toFixed(2)
						}</Text></Text>
						<TouchableOpacity style={styles.submitBtn} onPress={this._gotoCashierDesk.bind(this)}>
							<Text style={{ fontSize: 16, color: '#fff' }}>提交订单</Text>
						</TouchableOpacity>
					</View>

					<MaskModal ref='stateModal' contentView={
						this._renderAddrMask(this.state.addrList)
					} />
					<MaskModal ref='senderModal' contentView={
						this._renderSenderTypeMask(this.state.senderTypes, this.state.shoppingCartIndex)
					}
						maskHideCallBack={() => {
							this.resetDeliveryWay();
						}}
					/>
					{/*<MaskModal ref='payModal' contentView={
                    this._renderPayWayMask()
                }/>*/}
				</DataController>
				<MaskModal ref='invoice' contentView={
					this._renderInvoiceMask(this.state.invoiceInfos)
				} />

			</BaseView>
		)
	}
}
