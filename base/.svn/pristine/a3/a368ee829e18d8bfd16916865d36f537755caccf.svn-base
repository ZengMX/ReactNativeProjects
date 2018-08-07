import React, { Component } from 'react';
import {
    View,
    Platform,
    TouchableOpacity,
    Text,
    NativeAppEventEmitter,
    NativeModules,
} from 'react-native';
import { BaseView, Toast } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';
import Fetch from 'future/src/lib/Fetch';
import * as TTT from '@imall-test/react-native-alipay';
import Payment from './Payment';

var signUrl = 'http://183.233.190.56:10000/payment/alipayApp/buildData.json';
var appScheme = 'cn.com.imall.base';
var subscription;
export default class AliPay extends Component {
    constructor(props) {
        super(props);
        this.orderNum = null;
    }
    componentDidMount() {

        // subscription = NativeAppEventEmitter.addListener(
        //     'sendPlayResultMessage',
        //     (reminder) => console.log('.......................',reminder.infos)
        // );

        // TTT.payBlock((events) => {
        //     console.log('>>>>>>>', events);
        // });

        // new Fetch({
        //     url: 'app/cart/getPaymentDocumentId.json',
        //     data: {
        //         orderIds: 187,
        //         paymentTypeCode: 34,
        //         clearingType: 0,
        //     },
        // }).dofetch().then((data) => {
        //     console.log('>>>>>>>>>>>>>>>>>', data.result);//orderId
        //     this.queryPay(data.result.toString());
        // }).catch((error) => {
        //     console.log('=>333333333333333333  catch: ', error);
        // });

    }

    componentWillUnmount() {

    }

    queryPay(order_no) {
        new Fetch({
            url: '/payment/alipayApp/buildData.json?order_no=' + order_no + '&plat=' + (Platform.OS == 'ios' ? 'ios' : 'android'),
            method: 'GET',
            show_error: false
        }).dofetch().then((data) => {

            var ob = data.result;
            ob.orderId = order_no;
            ob.appScheme = appScheme;

            this.pay(ob);

        }).catch(error => {
            Toast.show("XXX生成支付宝订单失败", error);
        })
    }
    pay(payInfo) {
        console.log('::::::', payInfo);
        // var map = new Pay('JUYHHKJNL','rdrgfdgfh',"ceshi","miaoshu","0.01",423,appScheme)
        TTT.pay(payInfo);
    }

    //立即支付
    gotoPay = () => {
        this.props.navigator.push({
            component: Payment,
            params: {
                orderId: '1111',
                callback: () => { }
            }
        })
    }


    render() {
        return (
            <BaseView navigator={this.props.navigator}>
                <TouchableOpacity
                    onPress={this.gotoPay}>
                    <View style={styles.btn}>
                        <Text style={styles.text}>支付宝支付</Text>
                    </View>
                </TouchableOpacity>
            </BaseView>
        )
    }
}

const styles = Styles.create({
    btn: {
        marginTop: 10,
        marginHorizontal: 10,
        height: 45,
        borderRadius: 10,
        backgroundColor: '#3B5998',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
    },
});