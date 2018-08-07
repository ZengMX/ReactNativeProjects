import React, { Component } from 'react';
import Fetch from 'future/src/lib/Fetch';
import { View, Platform, Text, Linking } from 'react-native';
import { BaseView, Toast } from 'future/src/widgets';
import UPpay from '@imall-test/react-native-uppay';


// payment/unionpayApp/buildData.json
// http://192.168.1.78:8080/app/cashier/genPaymentDocument.json
let signUrl = 'http://183.233.190.56:10000/payment/alipayApp/buildData.json';
let appScheme = 'cn.com.imall.base';
let subscription;
export default class UPPay extends Component {
	constructor(props) {
		super(props);
	}

	_handleOpenURL(event) {
		console.log('url      ', event.url);
	}
	componentDidMount() {

		Linking.addEventListener('url', this._handleOpenURL);

		console.log('>>>>>>>>>>>>>>>', UPpay);
		new Fetch({
			url: 'http://192.168.1.78:8080/payment/unionpayApp/buildData.json',
			data: {
				order_no: 172,
			},
		}).dofetch().then((data) => {
			console.log('>>>>>>>>>>>>>>>>>', data.result);//orderId
			subscription = data.result;
		}).catch((error) => {
			console.log('=>333333333333333333  catch: ', error);
		});

	}

	componentWillUnmount() {
		Linking.removeEventListener('url', this._handleOpenURL);
	}

	render() {
		return (
			<BaseView navigator={this.props.navigator}>
				<Text onPress={() => {
					UPpay.startPay({ tn: subscription, mode: '01' }, (err) => { });
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