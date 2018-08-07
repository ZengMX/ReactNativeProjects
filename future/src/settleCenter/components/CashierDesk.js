import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	TouchableOpacity,
	Platform,
	InteractionManager,
	ScrollView
} from 'react-native';
import md5 from 'md5';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import UPpay from '@imall-test/react-native-uppay';
import * as AliPay from '@imall-test/react-native-alipay';
import WXpay from '@imall-test/react-native-weixinpay';

import config from '../../../public/config';

import { BaseView, MaskModal, TextInputC, Loading, Toast } from 'future/public/widgets';
import { Fetch } from 'future/public/lib';

import styles from '../style/SettleCenter.css';
import SettleResult from './SettleResult';

var AppScheme = config.appId;

export default class CashierDesk extends Component {
	constructor(props) {
		super(props);

		this.state = {
			pwd: '',
			prestore: 0,
			payMethodIndex: 1,
			receiverInfo:{}
		}

		this.orderIds = this.props.params.orderIds;		//oderId数组
		console.log('this.orderIds', this.orderIds);
	}
	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			//app/order/getReceiverAddr.json
			// new Fetch({
			// 	url: 'app/user/getUserPreStoreAndintegral.json',
			// 	method: 'GET',
			// }).dofetch().then((data) => {
			// 	this.setState({
			// 		prestore: data.prestore
			// 	})
			// }).catch((error) => {
			// 	console.log('获取进货单数据失败:', error);
			// });
			new Fetch({
				url: 'app/order/getReceiverAddr.json?orderId='+this.orderIds.join(',')[0],
				method: 'GET',
			}).dofetch().then((data) => {
				if(data.success){
					this.setState({
						receiverInfo: data
					})
				}
			}).catch((error) => {
				console.log('获取进货单数据失败:', error);
			});
			AliPay.payBlock(this._zfbPayHandle);
		});
	}
	componentWillReceiveProps(nextProps) {
	}
	//支付成功后
	toPaySuccess() {
		this.props.navigator.push({
			component: SettleResult,
			params: {
				title: '收银台',
				resultContent: '恭喜您，支付成功!',
				success: true,
				returnTitle: '返回首页',
			}
		});
	}
	//支付失败后
	toPayFail() {
		this.props.navigator.push({
			component: SettleResult,
			params: {
				title: '收银台',
				resultContent: '抱歉,支付失败!',
				success: false,
				returnTitle: '返回首页',
			}
		});
	}
	_goToResultAfterFetch() {
		// this.props.navigator.push({
		//     component:SettleResult,
		//     params:{
		//         title:'收银台',
		//         resultContent:'抱歉，提交订单失败!',
		//         success:false,
		//         returnTitle:'返回进货单',
		//         reason:'网络异常，提交未成功，请重新下单'
		//     }
		// })
		// this._payByPreDeposit(orderIds[0])
		if (this.state.payMethodIndex == 0) {  //预存款
			this.refs.addNewPlan.show();
		} else if (this.state.payMethodIndex == 1) { //支付宝
			this._payWithAliPay(29);
		} else if (this.state.payMethodIndex == 2) {  //微信
			this._payWithWeiXin(30);
		} else if (this.state.payMethodIndex == 3) { //银联
			this._payWithYinLian(31);
		}
	}

	//支付宝支付
	_payWithAliPay(paymentTypeCode) {
		this._getPaymentDocumentId(paymentTypeCode, (paymentClearingDocumentId) => {
			new Fetch({
				url: '/payment/alipayApp/buildData.json?documentId=' + paymentClearingDocumentId + '&plat=' + (Platform.OS == 'ios' ? 'ios' : 'android'),
				method: 'GET',
				show_error: false
			}).dofetch().then((data) => {
				var ob = data.result;
				if (ob != undefined) {
					ob.orderId = paymentClearingDocumentId;
					ob.appScheme = AppScheme;
					AliPay.pay(ob);
				}
				console.log('_payWithAliPay', data);

			}).catch((err) => {
				console.log("支付宝支付失败：", err);
			});
		});
	}
	//支付宝回调
	_zfbPayHandle = (events) => {
		if (events.status == '9000') {
			//支付成功后跳转
			this.toPaySuccess();
		} else if (events.status == '4006' || events.status == '7001') {
			//支付失败后跳转
			this.toPayFail();
		} else {
			Toast.show(events.statustext);
		}
	}

	//微信支付
	_payWithWeiXin(paymentTypeCode) {
		this._getPaymentDocumentId(paymentTypeCode, (paymentClearingDocumentId) => {
			new Fetch({
				url: '/app/weixin/payPackage.json',
				method: 'POST',
				data: {
					paymentDocumentId: paymentClearingDocumentId,
				},
			}).dofetch().then((data) => {
				console.log('_payWithWeiXin', data);
				if (Platform.OS == 'ios') {
					WXpay.pay(data, this._wxPayIOSHandle)
				} else {
					WXpay.pay(data, this._wxPayAOSHandle);
				}
			}).catch((err) => {
				console.log("微信支付失败：", err);
			});
		});
	}
	//微信IOS回调 监听
	_wxPayIOSHandle = (event) => {
		//微信IOS支付监听
		if (event.errCode == 0) {
			//支付成功后跳转
			this.toPaySuccess();
		} else if (event.errCode == -1) {
			//支付失败后跳转
			this.toPayFail();
		} else {
			Toast.show(event.text);
		}
	}
	//微信安卓回调
	_wxPayAOSHandle = (event) => {
		if (event.errCode == '0') {
			//支付成功后跳转
			this.toPaySuccess();
		} else if (event.errCode == '-1') {
			//支付失败后跳转
			this.toPayFail();
		} else {
			Toast.show(event.text);
		}
	}


	//银联支付 能支付
	_payWithYinLian(paymentTypeCode) {
		this._getPaymentDocumentId(paymentTypeCode, (paymentClearingDocumentId) => {
			new Fetch({
				url: '/payment/unionpayApp/buildData.json',
				method: 'POST',
				data: {
					order_no: paymentClearingDocumentId
				}
			}).dofetch().then((data) => {
				//mode:00表示生产版本，01表示测试版本
				// console.log("data.result：", data.result);
				console.log('_payWithYinLian', data);
				UPpay.startPay({ "tn": data.result, "mode": "00" }, (result) => {
					let code = result.code;
					if (code == "success") {		// 支付成功
						this.toPaySuccess();
					} else if (code == "cancel") {	// 取消支付
						Toast.show('取消支付');
					} else if (code == "fail") {	// 支付失败
						this.toPayFail();
					}
				});
			}).catch((err) => {
				console.log("银联支付失败：", err);
			});
		})
	}

	//生成流水号 paymentTypeCode：33表示支付宝支付，35表示微信支付，36表示银联支付
	_getPaymentDocumentId(paymentTypeCode, callback) {
		Loading.show();
		new Fetch({
			url: '/app/cashier/genPaymentDocument.json',
			method: 'POST',
			data: {
				orderIdArr: this.orderIds.join(','),
				paymentTypeCode: paymentTypeCode
			}
		}).dofetch().then((data) => {
			callback(data.paymentClearingDocumentId)
		}).catch((err) => {
			console.log("生成流水号失败：", err);
		}).finally(() => {
			Loading.hide();
		});
	}
	_payByPreDeposit(pwd) {
		this.refs.addNewPlan.hide();
		new Fetch({
			url: 'app/cashier/prestorePays.json',
			method: 'POST',
			data: {
				payPsw: md5(pwd),
				orderIds: this.props.params.orderIds.join(',')
			}
		}).dofetch().then((data) => {
			if (data.success) {
				this.toPaySuccess();
			}
		}).catch((error) => {
			console.log('获取进货单数据失败:', error);
		});
	}

	cancel = () => {
		this.refs.addNewPlan.hide();
	}

	_renderNewPlanModal() {
		return (
			<View style={styles.newPlanModal}>
				<Text style={styles.plan_NewBtn}>支付密码</Text>
				<View style={{ backgroundColor: '#fff' }}>
					<TextInputC
						ref="textInput"
						style={styles.plan_inputNm}
						clearButtonMode='while-editing'
						autoFocus={true}
						secureTextEntry={true}
						placeholder={'请输入支付密码'}
						underlineColorAndroid='transparent'
						blurOnSubmit={true}
						onChangeText={(value) => {
							this.setState({ pwd: value })
						} }
						maxLength={10}
						/>
				</View>
				<View style={styles.plan_cancel}>
					<TouchableOpacity style={styles.plan_cancelBtn}
						onPress={this.cancel.bind(this)}>
						<Text style={styles.plan_cancelTitle}>取消</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.plan_sureBtn}
						onPress={this._payByPreDeposit.bind(this, this.state.pwd)}>
						<Text style={styles.plan_sureTitle}>确定</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}

	_choicePayMethod(index) {
		this.setState({
			payMethodIndex: index
		})
	}

	render() {
		const { params, navigator } = this.props;
		return (
			<BaseView
				ref='baseview'
				navigator={navigator}
				leftBtnHandler={() => {
					if (params.isSettleCenter) {
						navigator.popToTop();
						RCTDeviceEventEmitter.emit('changeTabBarIdx2', { idx: 2, goTop: true });
					} else {
						{/*let routes = navigator.getCurrentRoutes();*/ }
						navigator.pop()
					}

				} }
				title={{ title: '收银台', tintColor: '#333', fontSize: 18 }}
				>
				<ScrollView style={{ flex: 1, backgroundColor: '#F4F3F3' }}>
					<View style={{backgroundColor:'#fff',width:SCREENWIDTH,paddingHorizontal:13,paddingBottom:20}}>
						<Text style={{fontSize:15,marginTop:17,color:'#455A64'}}>恭喜您，您的订单提交成功！</Text>
						<View style={{flexDirection:'row',marginTop:10}}>
							<Text style={{fontSize:12,color:'#53606A'}}>收货人</Text>
							<Text style={{fontSize:12,color:'#53606A',marginLeft:25}}>
							{this.state.receiverInfo.receiverName?this.state.receiverInfo.receiverName:''}
							{this.state.receiverInfo.receiverMobile?' '+this.state.receiverInfo.receiverMobile.substring(0,3)+
							'***'+this.state.receiverInfo.receiverMobile.substring(this.state.receiverInfo.receiverMobile.length-4,
							this.state.receiverInfo.receiverMobile.length):''}
							</Text>
						</View>
						<View style={{flexDirection:'row',marginTop:5}}>
							<Text style={{fontSize:12,color:'#53606A'}}>寄送至</Text>
							<Text numberOfLines={4} style={{fontSize:12,width:SCREENWIDTH-86,color:'#53606A',marginLeft:25}}>
								{this.state.receiverInfo.receiverAddr?this.state.receiverInfo.receiverAddr:''}
							</Text>
						</View>
					</View>
					<Text style={{ marginTop: 16, fontSize: 14, color: '#666', marginLeft: 13 }}>支付方式</Text>
					<TouchableOpacity activeOpacity={0.5} style={{ marginTop: 10, backgroundColor: '#fff' }} onPress={this._choicePayMethod.bind(this, 1)}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 52, paddingHorizontal: 12.5 }}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Image style={{ width: 25, height: 25 }} source={require('../res/CashierDesk/zhifubao.png')} />
								<Text style={{ fontWeight: 'bold', fontSize: 13, marginLeft: 12 }}>支付宝支付</Text>
							</View>
							<Image
								style={{ width: 17, height: 17 }}
								source={this.state.payMethodIndex == 1 ?
									require('../res/CashierDesk/000gouxuan_s.png') :
									require('../res/CashierDesk/000weigouxuan.png')} />
						</View>
					</TouchableOpacity>
					{/* <TouchableOpacity activeOpacity={0.5} style={{ backgroundColor: '#fff' }} onPress={this._choicePayMethod.bind(this, 2)}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 52, paddingHorizontal: 12.5 }}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Image style={{ width: 25, height: 25 }} source={require('../res/CashierDesk/weixin.png')} />
								<Text style={{ fontWeight: 'bold', fontSize: 13, marginLeft: 12 }}>微信支付</Text>
							</View>
							<Image
								style={{ width: 17, height: 17 }}
								source={this.state.payMethodIndex == 2 ?
									require('../res/CashierDesk/000gouxuan_s.png') :
									require('../res/CashierDesk/000weigouxuan.png')} />
						</View>
					</TouchableOpacity> */}
					<TouchableOpacity activeOpacity={0.5} style={{ backgroundColor: '#fff' }} onPress={this._choicePayMethod.bind(this, 3)}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 52, paddingHorizontal: 12.5 }}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Image style={{ width: 27, height: 25 }} source={require('../res/CashierDesk/yinlian.png')} />
								<Text style={{ fontWeight: 'bold', fontSize: 13, marginLeft: 12 }}>银联支付</Text>
							</View>
							<Image
								style={{ width: 17, height: 17 }}
								source={this.state.payMethodIndex == 3 ?
									require('../res/CashierDesk/000gouxuan_s.png') :
									require('../res/CashierDesk/000weigouxuan.png')} />
						</View>
					</TouchableOpacity>

				</ScrollView>
				<View style={styles.bottomMenu}>
					<Text style={styles.amountTotalInfo}>应付金额<Text style={styles.amount}>￥{this.props.params.needPayAmount.toFixed(2)}</Text></Text>
					<TouchableOpacity
						activeOpacity={0.5}
						style={styles.submitBtn} onPress={this._goToResultAfterFetch.bind(this)}>
						<Text style={{ fontSize: 16, color: '#fff' }}>确认支付</Text>
					</TouchableOpacity>
				</View>
				<MaskModal
					ref="addNewPlan"
					viewType="top"
					animationType='slide'
					containerStyle2={{ alignItems: 'center' }}
					contentView={
						this._renderNewPlanModal()
					} />
			</BaseView>
		)
	}
}


/*{this.state.prestore > this.props.params.needPayAmount &&
						<TouchableOpacity onPress={this._choicePayMethod.bind(this, 0)}>
						<View style={{ flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'space-between', alignItems: 'center', height: 52, paddingHorizontal: 13 }}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Image style={{ height: 25, width: 25 }} source={require('../../stocksList/res/StocksList/004yuchunkuan.png')} />
								<Text style={{ color: '#666', fontSize: 15, marginLeft: 9 }}>预存款</Text>
							</View>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Text style={{ color: '#999', fontSize: 13 }}>￥{this.state.prestore.toFixed(2)}可用   </Text>

								<Image
									style={{ height: 17, width: 17 }}
									source={this.state.payMethodIndex == 0 ?
										require('../res/CashierDesk/000gouxuan_s.png') :
										require('../res/CashierDesk/000weigouxuan.png')} />

							</View>
						</View>
					</TouchableOpacity>}
					<Text style={{ marginTop: 16, fontSize: 14, color: '#666', marginLeft: 13 }}>其他支付方式</Text>
					<View style={{flexDirection:'row'}}>
							<View style={{marginTop:11}}>
								<Text style={{fontSize:12,color:'#53606A'}}>收货人</Text>
								<Text style={{fontSize:12,color:'#53606A',marginTop:6}}>寄送至</Text>
							</View>
							<View style={{marginLeft:25,marginTop:11}}>
								<Text style={{fontSize:12,color:'#53606A'}}>
								{this.state.receiverInfo.receiverName?this.state.receiverInfo.receiverName:''}
								{this.state.receiverInfo.receiverMobile?' '+this.state.receiverInfo.receiverMobile.substring(0,3)+
								'***'+this.state.receiverInfo.receiverMobile.substring(this.state.receiverInfo.receiverMobile.length-4,
								this.state.receiverInfo.receiverMobile.length):''}
								</Text>
								<Text numberOfLines={4} style={{fontSize:12,width:SCREENWIDTH-86,color:'#53606A',marginTop:6}}>
								{this.state.receiverInfo.receiverAddr?this.state.receiverInfo.receiverAddr:''}
								</Text>
							</View>
						</View>*/
