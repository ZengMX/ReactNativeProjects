/**
 * 调用相关支付方法时，模拟传值可能过期
 */
import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking
} from 'react-native';

import { BaseView, Toast, Loading } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';

import config from 'future/src/config';
import { Fetch } from 'future/src/lib';

import UPpay from '@imall-test/react-native-uppay';
import * as AliPay from '@imall-test/react-native-alipay';
import WXpay from '@imall-test/react-native-weixinpay';

var AppScheme = config.appId;
export default class CashierDesk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aliItemEnable: true,  // 支付方式
      yinlianItemEnable: false,
      weixinItemEnable: false,
    }
    this.orderId = '1111'; // 订单id
  }
  componentDidMount() {
    //处理微信回调
    Linking.addEventListener('url', this._handleOpenURL);
    //处理支付宝回调
    AliPay.payBlock(this._zfbPayHandle);
    //请求初始数据
    // new Fetch({
    //   url: '/app/cashier/cashier.json',
    //   method: 'POST',
    //   data: {
    //     orderId: this.orderId
    //   }
    // }).dofetch().then((data) => {
    //   let payWays = data.payWay;
    //   let isOpenAli = false;
    //   let isOpenWeixin = false;
    //   let isOpenYinlian = false;
    //   for (let i = 0; i < payWays.length; i++) {
    //     if (payWays[i].paymentTypeCode == "33" && payWays[i].isEnable == "Y") {//判断后台是否存在并开启支付宝支付
    //       isOpenAli = true;
    //     }
    //     if (payWays[i].paymentTypeCode == "35" && payWays[i].isEnable == "Y") {//判断后台是否存在并开启微信支付
    //       isOpenWeixin = true;
    //     }
    //     if (payWays[i].paymentTypeCode == "36" && payWays[i].isEnable == "Y") {//判断后台是否存在并开启银联支付
    //       isOpenYinlian = true;
    //     }
    //   }

    //   this.setState({
    //     orderCost: "￥" + data.orderDetail.orderTotalAmount.toFixed(2),
    //     cost: "￥" + data.orderDetail.payAmount.toFixed(2),
    //     titleInfo: data.orderDetail.receiverName + " " + data.orderDetail.receiverMobile + " " + data.orderDetail.receiverAddr,
    //     userInfo: data.orderDetail.receiverName + " " + data.orderDetail.receiverMobile,
    //     addrInfo: data.orderDetail.receiverAddr,
    //     items: data.orderDetail.items,
    //     isOpenAli: true,
    //     isOpenWeixin: true,
    //     isOpenYinlian: true,
    //   })
    //   this.interval = setInterval(this.ShowLeftTime, 1000);
    // });
  }
  componentWillUnmount() {
    // this.interval && clearInterval(this.interval);
    // this.props.params && this.props.params.callback && this.props.params.callback()
  }

  //支付宝回调
  _zfbPayHandle = (events) => {
    console.log("_zfbPayHandle", events);
    //支付宝支付状态
    //@"9000" : @"支付成功", @"8000" : @"等待支付结果确认",@"4000":@"系统异常",@"4001":@"数据格式不正确",
    //@"4003":@"该用户绑定的支付宝账户被冻结或不允许支付",@"4004":@"该用户已解除绑定",@"4005":@"绑定失败或没有绑定",
    //@"4006":@"订单支付失败",@"4010":@"重新绑定账户",@"6000":@"支付服务正在进行升级操作",@"6001":@"用户中途取消支付操作",@"7001":@"网页支付失败"
    if (events.status == '9000') {
      //支付成功后跳转
      this.paySucc();
    }
    // 展示回调信息
    Toast.show(events.statustext);
  }

  //处理微信回调
  _handleOpenURL(event) {
    console.log('url====>', event.url);
  }

  // 选择支付方式 0:支付宝 1:微信 2:银联 
  _selet(type) {
    switch (type) {
      case 0:
        this.setState({
          aliItemEnable: true,
          yinlianItemEnable: false,
          weixinItemEnable: false
        });
        break;
      case 1:
        this.setState({
          aliItemEnable: false,
          yinlianItemEnable: false,
          weixinItemEnable: true
        });
        break;
      case 2:
        this.setState({
          aliItemEnable: false,
          yinlianItemEnable: true,
          weixinItemEnable: false
        });
        break;
      default:
        this.setState({
          aliItemEnable: true,
          yinlianItemEnable: false,
          weixinItemEnable: false
        });
        break;
    }
  }

  // 确认支付
  _pay() {
    if (this.state.aliItemEnable) {
      //支付宝
      this._payWithAliPay(33)
    } else if (this.state.weixinItemEnable) {
      //微信支付
      this._payWithWeiXin(35)
    } else if (this.state.yinlianItemEnable) {
      //银联支付
      this._payWithYinLian(36)
    }
  }

  //支付宝支付
  _payWithAliPay(paymentTypeCode) {
    this._getPaymentDocumentId(paymentTypeCode, (paymentClearingDocumentId) => {

      // new Fetch({
      //   url: '/payment/alipayApp/buildData.json?order_no=' + paymentClearingDocumentId + '&plat=' + (IS_IOS ? 'ios' : 'android'),
      //   method: 'GET',
      //   show_error: false
      // }).dofetch().then((data) => {
      //   var ob = data.result;
      //   ob.orderId = paymentClearingDocumentId;
      //   ob.appScheme = AppScheme;
      //   AliPay.pay(ob);
      // }).catch((err) => {
      //   console.log("支付宝支付失败：", err);
      // });

      //支付宝支付
      AliPay.pay({
        appScheme: "cn.com.imall.b2b",
        orderId: 427,
        orderInfo: '"partner="2088701361565282"&seller_id="pay@imall.com.cn"&out_trade_no="0170508103807996"&subject="订单编码: 0170508103807996"&body="乐商医药批发订单"&total_fee="0.01"&notify_url="http://eyb2b.imall.com.cn/payment/alipayApp/handleResponse.json"&service="mobile.securitypay.pay"&payment_type="1"&_input_charset="utf-8"&it_b_pay="30m"',
        sign: "h/26cXhU8lykjor28fcyyp3J7//0paZUTLPxUAdUMG26gcsUnVrNSsDNYdNoLZiVOE0JorseuuiDPVe6s5xlx1/v6utc7QC8UxcahdhLtgGg+3FhlPOhzxjePtyce6aq1VggJA6/MpXcHXjZSSsTh4rjoXsQYo639EZ50taosHY="
      })

    });
  }

  //微信支付
  _payWithWeiXin(paymentTypeCode) {
    this._getPaymentDocumentId(paymentTypeCode, (paymentClearingDocumentId) => {

      // new Fetch({
      //   url: '/app/weixin/payPackage.json',
      //   method: 'POST',
      //   data: {
      //     paymentDocumentId: paymentClearingDocumentId,
      //   },
      // }).dofetch().then((data) => {
      //   if (IS_IOS) {
      //     WXpay.pay(data, this._wxPayAOSHandle)
      //   } else {
      //     WXpay.pay(data, this._wxPayAOSHandle);
      //   }
      // }).catch((err) => {
      //   console.log("微信支付失败：", err);
      // });

      //微信支付
      WXpay.pay({
        appid: "wx0ee35596d93be501",
        noncestr: "qxSPmzzlm14g3Uw5",
        package: "Sign=WXPay",
        partnerid: "1431293702",
        prepayid: "wx20170508151456fb82bee7870515841634",
        sign: "8E88A1B0AABA6795B8CC759792D211F5",
        timestamp: "1494227696"
      }, this._wxPayAOSHandle)

    });
  }

  //微信安卓回调
  _wxPayAOSHandle = (event) => {
    if (event.errCode == '0') {
      Toast.show("支付成功");
      this.paySucc();
    } else if (event.errCode == '-1') {
      //支付失败后跳转
      Toast.show("支付失败");
    } else {
      Toast.show(event.text);
    }
  }

  //银联支付 能支付
  _payWithYinLian(paymentTypeCode) {
    this._getPaymentDocumentId(paymentTypeCode, (paymentClearingDocumentId) => {

      // new Fetch({
      //   url: '/payment/unionpayApp/buildData.json',
      //   method: 'POST',
      //   data: {
      //     order_no: paymentClearingDocumentId
      //   }
      // }).dofetch().then((data) => {
      //   //mode:00表示生产版本，01表示测试版本
      //   // console.log("data.result：", data.result);
      // UPpay.startPay({ "tn": data.result, "mode": "01" }, (result) => {
      //     let code = result.code;
      //     if (code == "success") {		// 支付成功
      //       Toast.show('支付成功');
      //       this.paySucc();
      //     } else if (code == "cancel") {	// 取消支付
      //       Toast.show('取消支付');
      //     } else if (code == "fail") {	// 支付失败
      //       Toast.show('支付失败');
      //     }
      //   })
      // }).catch((err) => {
      //   console.log("银联支付失败：", err);
      // });

      //银联支付
      UPpay.startPay({ "tn": '868365854317065580401', "mode": "01" }, (result) => {
        let code = result.code;
        if (code == "success") {		// 支付成功
          Toast.show('支付成功');
          this.paySucc();
        } else if (code == "cancel") {	// 取消支付
          Toast.show('取消支付');
        } else if (code == "fail") {	// 支付失败
          Toast.show('支付失败');
        }
      })
    })
  }
  //支付成功回调
  paySucc() {
    console.log('支付成功回调');
  }
  //生成流水号,调用相关支付方法 paymentTypeCode：33表示支付宝支付，35表示微信支付，36表示银联支付
  _getPaymentDocumentId(paymentTypeCode, callback) {

    // Loading.show();
    // new Fetch({
    //   url: '/app/cashier/genPaymentDocument.json',
    //   method: 'POST',
    //   data: {
    //     orderId: this.orderId,
    //     paymentTypeCode: paymentTypeCode
    //   }
    // }).dofetch().then((data) => {
    //   callback(data.paymentClearingDocumentId)
    // }).catch((err) => {
    //   console.log("生成流水号失败：", err);
    // }).finally(() => {
    //   Loading.hide();
    // });

    //流水号
    callback('46516516164544441')
  }

  render() {
    return (
      <BaseView
        ref='baseview'
        navigator={this.props.navigator}
        title={{ title: '在线支付', fontSize: 16, tintColor: '#fff' }}
      >
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          {/*支付宝支付*/}
          <TouchableOpacity onPress={this._selet.bind(this, 0)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 45, paddingHorizontal: 12.5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image style={{ width: 27, height: 25 }} source={require('./res/zhifubao.png')} />
                <Text style={{ fontWeight: 'bold', fontSize: 13, marginLeft: 12 }}>支付宝支付</Text>
              </View>
              {this.state.aliItemEnable ?
                <Image style={{ width: 17, height: 17 }} source={require('./res/000gouxuan_s.png')} />
                :
                <Image style={{ width: 17, height: 17 }} source={require('./res/000weigouxuan.png')} />}
            </View>
          </TouchableOpacity>

          {/*微信支付*/}
          <TouchableOpacity onPress={this._selet.bind(this, 1)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 45, paddingHorizontal: 12.5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image style={{ width: 27, height: 25 }} source={require('./res/weixin.png')} />
                <Text style={{ fontWeight: 'bold', fontSize: 13, marginLeft: 12 }}>微信支付</Text>
              </View>
              {this.state.weixinItemEnable ?
                <Image style={{ width: 17, height: 17 }} source={require('./res/000gouxuan_s.png')} />
                :
                <Image style={{ width: 17, height: 17 }} source={require('./res/000weigouxuan.png')} />}
            </View>
          </TouchableOpacity>

          {/*银联支付*/}
          <TouchableOpacity onPress={this._selet.bind(this, 2)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 45, paddingHorizontal: 12.5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image style={{ width: 27, height: 25 }} source={require('./res/yinlian.png')} />
                <Text style={{ fontWeight: 'bold', fontSize: 13, marginLeft: 12 }}>银联支付</Text>
              </View>
              {this.state.yinlianItemEnable ?
                <Image style={{ width: 17, height: 17 }} source={require('./res/000gouxuan_s.png')} />
                :
                <Image style={{ width: 17, height: 17 }} source={require('./res/000weigouxuan.png')} />}
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={this._pay.bind(this)} style={{ top: Styles.theme.H - 109, position: 'absolute', backgroundColor: Styles.theme.MAIN_COLOR, width: Styles.theme.W, height: 45, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 13 }}>确认支付</Text>
        </TouchableOpacity>
      </BaseView>
    )
  }
}

const styles = Styles.create({
  lefttimetitle_con: {
    backgroundColor: '#ffedca',
    height: 30,
    width: '$W',
    justifyContent: 'center',
    alignItems: 'center'
  },
  lefttimetitle_title: {
    color: '#e82f2f',
    fontSize: 11
  },
  orderinfo_con: {
    backgroundColor: '#fff',
    width: '$W'
  },
  orderinfo_title: {
    flexDirection: 'row',
    height: 45,
    alignItems: 'center',
    paddingHorizontal: 12.5,
    paddingVertical: 15
  },
  orderinfo_titletxt: { fontSize: 13 },
  orderinfo_titlecon: { flexDirection: 'row' },
  orderinfo_titleinfo: {
    width: '$W - 106',
    marginLeft: 10,
    alignItems: 'flex-end'
  },
  orderinfo_titleinfotxt: {
    color: '#666',
    fontSize: 11
  },
  orderinfo_updownimg: {
    width: 8,
    height: 4.5,
    marginTop: 4,
    marginLeft: 4
  },
  derinfo_detailcon: { marginLeft: 12.5 },
  orderinfo_detailfont: {
    marginTop: 5,
    color: '#666',
    fontSize: 11
  },
  orderinfo_amountcon: {
    flexDirection: 'row',
    height: 45,
    alignItems: 'center',
    paddingHorizontal: 12.5,
    paddingVertical: 15,
    justifyContent: 'space-between'
  },
  orderinfo_amounttitle: { fontSize: 13 },
  orderinfo_amounttxt: { color: '#666' }
})
