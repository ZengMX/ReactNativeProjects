import React, { Component } from 'react';
import Fetch from 'future/src/lib/Fetch';
import { View, Platform, Text, Linking } from 'react-native';
import { BaseView, Toast } from 'future/src/widgets';
import WXpay from '@imall-test/react-native-weixinpay';


// payment/unionpayApp/buildData.json
// http://192.168.1.78:8080/app/cashier/genPaymentDocument.json
let signUrl = 'http://183.233.190.56:10000/payment/alipayApp/buildData.json';
let appScheme = 'cn.com.imall.base';
let subscription;
export default class WXPay extends Component {
	constructor(props) {
		super(props);
	}

	_handleOpenURL(event) {
		console.log('url      ', event.url);
	}

	componentDidMount() {
		console.log('>>>>>>>>>>>>>>>', WXpay);
		Linking.addEventListener('url', this._handleOpenURL);
	}

	startPay() {
		//该处请求微信支付的所有参数partnerId，prepayId，nonceStr，timeStamp，package，sign
		new Fetch({
			url: '/app/cart/getPaymentDocumentId.json',
			data: {
				orderIds: 262,
				clearingType: 0,
				paymentTypeCode: 35
			},
		}).dofetch().then((data) => {
			this.queryPay(data.result)
		}).catch((error) => {
			console.log('=>333333333333333333  catch: ', error);
		});
	}

	queryPay(paymentDocumentId) {
		new Fetch({
			url: '/app/weixin/payPackage.json',
			data: {
				paymentDocumentId: paymentDocumentId,
			},
		}).dofetch().then((data) => {
			console.log('>>>>>>>>>>>>>>>>>', data);//orderId
			// WXpay.pay(data,(err)=>{

			// })
		}).catch((error) => {
			console.log('catch: ', error);
		});
	}

	componentWillUnmount() {
		Linking.removeEventListener('url', this._handleOpenURL);
	}

	render() {
		return (
			<BaseView navigator={this.props.navigator}>
				<Text onPress={() => {
					this.startPay()
				}}>dgfhgfhg</Text>
			</BaseView>
		)
	}
}

// class Pay{
//     constructor(sign,orderInfo,subject,body,price,orderId,appScheme){
//         this.sign = sign;
//         this.orderInfo = orderInfo;
//         this.orderId = orderId;
//         this.appScheme = appScheme;
//     }
// }