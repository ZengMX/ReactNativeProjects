import React, { Component } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  TouchableHighlight,
  Linking,
  InteractionManager,
  PixelRatio,
  Alert
} from "react-native";
var screenWidth = require("Dimensions").get("window").width;
var screenHeight = require("Dimensions").get("window").height;
import _ from "underscore";
import { Fetch, UtilDateTime } from "future/public/lib";
import {
  BaseView,
  MaskModal,
  DataController,
  RefreshableListView,
  Toast,
  Loading
} from "future/public/widgets";
import ScrollableTabView from "react-native-scrollable-tab-view";
import ScrollableTabBar from "future/public/commons/ScrollableTabBar";
import CashierDesk from "../../settleCenter/components/CashierDesk";
import AfterSaleService from "../../member/components/AfterSaleService";
import StocksList from "../../stocksList/components/StocksList";

import styles from "../styles/OrderDetail";
import MoreOperation from "../../commons/moreOperation/components/MoreOperation";
import LogisticsDetail from './LogisticDetail';
import CancelOrderInfosSet from './CancelOrderInfosSet';
import OrderCancelRecord from './OrderCancelRecord';
import SupplierHome from '../../supplierHome/components/SupplierHome';

export default class OrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {

      isShowAll: false,
      invoiceInfos: {},
      // serverTime: new Date().getTime()
    };
  }

  componentDidMount() {
    this._fetchData();
    this.getInvoiceInfos();

    this.timer = setInterval(() => {
      this.startChangeTime();
    }, 1000);
  }

  getCancelableOrder() {
    new Fetch({
      url: "/app/order/findOrderCancelDetail.json",
      data: {
        orderId: this.props.params.orderId,
      }
    })
      .dofetch().then(data => {
        if (data.success) {
          this.setState({
            listLog: data.result.listLog
          })
        }
      }).catch(err => {
        console.log("err", err);
      });
  }

  //倒计时功能函数
  startChangeTime() {
    this.setState({
      serverTime: this.state.serverTime + 1000 //这里是毫秒
    });
  }

  //关闭倒计时
  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
    // TODO 暂时关闭返回刷新功能，待重做
    this.props.params &&
      this.props.params.callback &&
      this.props.params.callback();
  }

  _fetchData() {
    new Fetch({
      url: "/app/order/orderDetail.json",
      method: "POST",
      data: {
        orderId: this.props.params.orderId
      }
    }).dofetch().then(data => {
      if (data.success) {
        let orderData = data.result;
        if (orderData.multiplePackage && orderData.packageVoList.length > 0) {
          for (var i = 0; i < orderData.packageVoList.length; i++) {
            orderData.packageVoList[i].showMore = false;
          }
        }
        this.setState({
          result: orderData
        });
        this.getCancelableOrder();
      }
    }).catch(err => {
      console.log("err", err);
    });
  }
  //取消待发货订单
  cancelWaitSendOrder(orderId) {
    Alert.alert(
      '温馨提示',
      '是否确定取消订单',
      [
        { text: '取消', onPress: () => { } },
        {
          text: '确定', onPress: () => {
            this.props.navigator.push({
              component: CancelOrderInfosSet,
              params: {
                orderId: orderId,
                callback: () => {
                  this._fetchData();
                }
              }
            })
          }
        },
      ]
    )
  }

  //撤销“取消请求”
  revokeApplay(orderId) {
    new Fetch({
      url: "/app/order/findOrderCancelDetail.json",
      data: {
        orderId: orderId,
      }
    })
      .dofetch().then(data => {
        if (data.success)
          this.deleteCancelApplay(data.result.orderCancelApplyId)
      }).catch(err => {
        console.log("err", err);
      });
  }

  deleteCancelApplay(onCancelStateOrderId) {
    new Fetch({
      url: "/app/order/deleteCancelApply.json",
      data: {
        orderCancelApplyId: onCancelStateOrderId,
      }
    })
      .dofetch().then(data => {
        if (data.success) {
          Toast.show('撤销成功');
          this._fetchData();
        }

      }).catch(err => {
        console.log("err", err);
      });
  }

  //取消订单
  cancelOrder(orderId) {
    Alert.alert("取消订单", "是否确定取消订单？", [
      { text: "取消", onPress: () => { } },
      {
        text: "确定",
        onPress: () => {
          Loading.show();
          new Fetch({
            url: "/app/order/cancelOrder.json",
            method: "POST",
            data: {
              orderId: orderId
            }
          })
            .dofetch()
            .then(data => {
              Toast.show("取消订单成功");
              this._fetchData();
            })
            .catch(err => {
              console.log("订单详情取消订单失败：", err);
            })
            .finally(() => {
              Loading.hide();
            });
        }
      }
    ]);
  }

  //确认收货，订单
  buyerSigned(orderId) {
    Alert.alert("确定收货", "是否确定收货？", [
      { text: "取消", onPress: () => { } },
      {
        text: "确定",
        onPress: () => {
          Loading.show();
          new Fetch({
            url: "/app/order/buyerSigned.json",
            method: "POST",
            data: {
              orderId: orderId
            }
          })
            .dofetch()
            .then(data => {
              Toast.show("确认收货成功");
              this._fetchData();
            })
            .catch(err => {
              console.log("订单详情确认收货失败：", err);
            })
            .finally(() => {
              Loading.hide();
            });
        }
      }
    ]);
  }

  //提醒发货
  remind(orderId) {
    new Fetch({
      url: "/app/order/remind.json",
      method: "POST",
      data: {
        orderId: orderId
      }
    })
      .dofetch()
      .then(data => {
        if (data.success == true) {
          Toast.show("提醒发货成功");
          // this._fetchData();
          let result = Object.assign({}, this.state.result, { isRemind: "Y" });
          this.setState({
            result: result
          });
        }
      })
      .catch(err => {
        console.log("订单详情提醒发货失败：", err);
      });
  }

  //再次购买
  buyAgain(orderId, promotionTypeCode) {
    new Fetch({
      url: "/app/cart/buyAgain.json",
      method: "POST",
      data: {
        orderId: orderId
      }
    })
      .dofetch()
      .then(data => {
        Toast.show("加入购物车成功");
        this.props.navigator.push({
          component: StocksList
        });
      })
      .catch(err => {
        console.log("err", err);
      });
  }

  //物流详情
  logisticsDetail(orderId) {
    this.props.navigator.push({
      component: LogisticsDetail,
      params: {
        orderId: orderId
      }
    });
  }

  //立即支付
  gotoPay(orderId, orderTotalAmount) {
    this.props.navigator.push({
      component: CashierDesk,
      params: {
        orderIds: [orderId],
        needPayAmount: orderTotalAmount,
        callback: () => {
          this._fetchData();
        }
      }
    });
  }

  //售后
  afterSale(orderId, packageId) {
    this.props.navigator.push({
      component: AfterSaleService,
      params: {
        orderId: orderId,
        packageId: packageId
      }
    });
  }

  getInvoiceInfos() {
    new Fetch({
      url: 'app/cart/getInvoice.json',
      method: 'POST',
    }).dofetch().then((data) => {
      this.setState({
        invoiceInfos: data.result
      })

    }).catch((error) => {
      console.log('获取进货单数据失败:', error);
    });
  }

  _submitInvoice() {
    this.refs.invoice.hide();
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

  //查看订单取消记录
  orderCancelRecord() {
    this.props.navigator.push({
      component: OrderCancelRecord,
      params: {
        listLog: this.state.listLog
      }
    })
  }

  _renderTopStatView(result) {
    let data = '';
    let leftseconds = '';
    if (result.orderStat == "待付款") {
      leftseconds =
        result && result.canPayTime
          ? (result.canPayTime - new Date().getTime()) / 1000
          : 0;
      if (leftseconds < 0) {
        leftseconds = 0;
      }
      data = UtilDateTime.getLeftTimeString(leftseconds);
    }

    let headView = null, image = null;

    if (result.orderStat == "待发货") {
      image = <Image style={styles.topStatImg}
        source={require("../res/IntegralOrderDetail/daifukuan.jpg")} />
      headView = <View style={styles.headImage}>
        <Text style={styles.topStatTitle}>
          {result.hadCancelApplay == 'Y' && result.orderStat != '已取消' ? '取消中' : '待发货'}
        </Text>
        <Text style={{ fontSize: 12, color: "#fff", marginTop: 4, backgroundColor: "transparent" }} >
          {result.hadCancelApplay == 'Y' && result.orderStat != '已取消' ? '您的取消订单申请已提交' : '卖家备货中，请耐心等候'}
        </Text>
      </View>
    } else if (result.orderStat == "待付款") {
      image = <Image style={styles.topStatImg}
        source={require("../res/IntegralOrderDetail/daifukuan.jpg")} />
      headView = <View style={styles.headImage}>
        <Text style={styles.topStatTitle}>待付款</Text>
        {leftseconds > 0 &&
          <View>
            <Text style={[{ marginTop: 4 }, styles.topDetailTxt]}>
              请在
            <Text style={[{ marginTop: 4, fontWeight: "bold" }, styles.topDetailTxt]}>
                {data.hourStr}:{data.minuteStr}:{data.secondStr}
              </Text>
              内完成支付
          </Text>
            <Text style={[{ marginTop: 1 }, styles.topDetailTxt]}>
              超时订单自动取消
          </Text>
          </View>}
        {leftseconds == 0 &&
          <Text style={[{ marginTop: 4 }, styles.topDetailTxt]}>
            已超过支付时限
        </Text>}
      </View>
    } else if (result.orderStat == "待收货") {
      image = <Image style={[styles.topStatImg, { right: 0, top: 25 }]}
        source={require("../res/IntegralOrderDetail/daishouhuo.jpg")} />

      headView = <View style={styles.headImage}>
        <Text style={styles.topStatTitle}>待收货</Text>
        <Text style={[{ marginTop: 4 }, styles.topDetailTxt]}>尊敬的客户！</Text>
        <Text style={[{ marginTop: 1 }, styles.topDetailTxt]}>
          包裹正向你飞奔过去..
        </Text>
      </View>
    } else if (result.orderStat == "已完成") {
      image = <Image style={styles.topEndedImg}
        source={require("../res/IntegralOrderDetail/yiwancheng.jpg")} />
      headView = <View style={styles.headImage}>
        <Text style={styles.topStatTitle}>已完成</Text>
        <Text style={[{ marginTop: 4 }, styles.topDetailTxt]}>您已成功签收</Text>
      </View>
    } else if (result.orderStat == "已取消") {
      headView = <View style={styles.headImage}>
        <Text style={styles.topStatTitle}>已取消</Text>
        <Text style={[{ marginTop: 4 }, styles.topDetailTxt]}>
          您已成功取消，欢迎再次购买
        </Text>
      </View>
    }

    if (image == null && this.state.listLog && this.state.listLog.length > 0) {
      image = <TouchableOpacity style={styles.topCancelBtnView} onPress={this.orderCancelRecord.bind(this)}>
        <Text style={[styles.topDetailTxt, { marginRight: 5 }]}>取消记录</Text>
        <Image
          source={require('../res/OrderDetail/002sanjiao.png')}
          style={{ width: 5, height: 9 }} />
      </TouchableOpacity>
    }

    let view = <View>
      <Image
        style={styles.topStatBgImage}
        source={require("../res/IntegralOrderDetail/orderDetailsHead.jpg")} />
      {headView}
      {image}
    </View>;

    return view;
  }
  _renderPrdItem(itemData, index) {
    return <View key={index} style={[styles.prdItemView, { marginTop: index > 0 ? 5 : 0 }]}>
      <Text style={styles.prdNmTxt}>{itemData.title}</Text>
      <View style={styles.secpView}>
        <Text style={styles.secpTxt}>规格: {itemData.specPack}</Text>
        <Text style={styles.secpTxt}>￥{itemData.price.toFixed(2)}</Text>
      </View>
      <View style={styles.secpView}>
        <Text style={styles.secpTxt}>厂家: {itemData.factory}</Text>
        <Text style={styles.secpTxt}>× {itemData.buyQuantity}</Text>
      </View>
      {itemData.batchNum && <View>
        <Text style={styles.secpTxt}>批号: {itemData.batchNum}</Text>
      </View>}
    </View>
  }

  _renderShowMoreView(num) {
    return (
      <TouchableOpacity activeOpacity={0.7}
        onPress={() => {
          this.setState({
            isShowAll: !this.state.isShowAll
          });
        }} >
        {<View style={styles.showAllView} >
          <Text style={styles.showAllViewTxt} >
            {this.state.isShowAll == false ? "查看其他" + num + "个品种" : "收起"}
          </Text>
          {this.state.isShowAll == false ?
            <Image
              style={{ width: 10, height: 5, marginLeft: 5 }}
              source={require("../res/OrderDetail/000sanjiaoxia.png")} /> :
            <Image
              style={{ width: 10, height: 5, marginLeft: 5 }}
              source={require("../res/OrderDetail/000sanjiaoshang.png")} />}
        </View>}
      </TouchableOpacity>
    )
  }

  _renderShowPackageMoreView(num, index) {
    return (
      <TouchableOpacity activeOpacity={0.7}
        onPress={() => {
          this.state.result.packageVoList[index].showMore = !this.state.result.packageVoList[index].showMore;
          this.setState({
            result: this.state.result
          });
        }} >
        {<View style={styles.showAllView} >
          <Text style={styles.showAllViewTxt} >
            {this.state.result.packageVoList[index].showMore == false ? "查看其他" + num + "个品种" : "收起"}
          </Text>
          {this.state.result.packageVoList[index].showMore == false ?
            <Image
              style={{ width: 10, height: 5, marginLeft: 5 }}
              source={require("../res/OrderDetail/000sanjiaoxia.png")} /> :
            <Image
              style={{ width: 10, height: 5, marginLeft: 5 }}
              source={require("../res/OrderDetail/000sanjiaoshang.png")} />}
        </View>}
      </TouchableOpacity>
    )
  }

  _renderMultiplePackageBtnsView() {
    return <View>
    </View>
  }

  render() {
    let result = this.state.result;
    //倒计时信息(秒数)
    let leftseconds =
      result && result.canPayTime
        ? (result.canPayTime - new Date().getTime()) / 1000
        : 0;
    if (leftseconds < 0) {
      leftseconds = 0;
    }
    let data = UtilDateTime.getLeftTimeString(leftseconds);

    return (
      <BaseView
        mainBackColor={{ backgroundColor: "#f4f3f3" }}
        ref='baseview'
        mainColor={"#f5f5f5"}
        titlePosition={"center"}
        title={{ title: "订单详情", tintColor: "#333333", fontSize: 18 }}
        navigator={this.props.navigator}
        rightButton={
          <View style={{ justifyContent: "center" }}>
            <MoreOperation
              navigator={this.props.navigator}
              order={[{ module: "index" }, { module: "message" }, { module: "mine" }]} />
          </View>
        }>
        <DataController data={this.state.result}>
          {result && <View style={{ flex: 1, justifyContent: "space-between" }}>
            {/*基础信息*/}
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              {this._renderTopStatView(result)}
              <View style={{ flexDirection: "column", backgroundColor: "white" }}>
                <Text style={styles.topViewInfoTitle}>收货地址</Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontSize: 15, paddingLeft: 13, marginTop: 16 }}>
                    {result.receiverName}
                  </Text>
                  <Text style={{ fontSize: 15, marginLeft: 20, marginTop: 16 }}>
                    {result.receiverMobile != undefined &&
                      result.receiverMobile.substring(0, 3) +
                      "****" +
                      result.receiverMobile.substring(7, 11)}
                  </Text>
                </View>
                <Text style={styles.detailAddrTxt}>{result.receiverAddr}</Text>
              </View>

              <View style={styles.shopInfoTelView}>
                <TouchableOpacity onPress={() => {
                  this.props.navigator.push({
                    component: SupplierHome,
                    params: { shopInfId: result.sysShopInf.shopInfId }
                  })
                }} style={styles.shopName}>
                  <Text style={styles.shopNmTxt}>{result.shopNm}</Text>
                  <Image
                    style={{ width: 7, height: 13 }}
                    source={require('../res/OrderDetail/000xiangyousanjiao.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  if (result.sysShopInf.csadTel) {
                    Linking.openURL('tel:' + result.sysShopInf.csadTel)
                  } else {
                    Toast.show('该商家未提供联系电话')
                  }
                }}>
                  <Image
                    resizeMode={'contain'}
                    source={require('../res/OrderDetail/007dianhua.png')}
                    style={{ width: 22, height: 22 }} />
                </TouchableOpacity>
              </View>

              {/* {(result.orderStat!='待收货'||(result.orderStat=='待收货'&&result.isAllSend == "Y"))&& */}
              <View>
                {result.promotionTypeCode == 10 && <View style={styles.shopInfoView} >
                  {result.promotionTypeCode == 10 &&
                    <Text style={{ fontSize: 14, color: "#333333" }}>
                      商品清单({result.deliveredItems.length > 0 ?
                        result.deliveredItems.length  : 0})
                      </Text>}
                </View>}
                {/* 多包裹 */}
                {result.multiplePackage && <View style={{ backgroundColor: '#fff' }}>
                  {result.packageVoList.length > 0 && result.packageVoList.map((value, index) => {
                    return <View style={{ flex: 1 }} key={'item' + index}>
                      <View style={styles.packageTopView}>
                        <Image
                          source={require('../res/OrderDetail/007baoguo.png')}
                          style={{ width: 16, height: 16 }} />
                        <Text style={{ fontSize: 14, color: '#333', marginLeft: 10 }}>包裹{index + 1}</Text>
                      </View>
                      {!value.showMore && value.itemExts.map((data, index) => {
                        return index < 2 ? this._renderPrdItem(value.itemExts[index].appProductBaseVo, index) : null
                      })}
                      {value.showMore && value.itemExts.map((item, tag) => {
                        return this._renderPrdItem(item.appProductBaseVo, tag)
                      })}
                      {value.itemExts.length > 2 && this._renderShowPackageMoreView(value.itemExts.length, index)}
                    </View>
                  })}
                  {result.undeliveredItems.length > 0 && <View style={{ backgroundColor: '#fff' }}>
                    <View style={styles.packageTopView}>
                      <Image style={{ width: 16, height: 16 }} />
                      <Text style={{ fontSize: 14, color: '#333', marginLeft: 10 }}>未发货</Text>
                    </View>
                    {result.undeliveredItems.length > 0 && result.undeliveredItems.map((value, index) => {
                      return this.state.isShowAll ?
                        this._renderPrdItem(value, index) :
                        (index < 2 ? this._renderPrdItem(value, index) : null)
                    })}
                    {result.undeliveredItems.length > 2 && this._renderShowMoreView(
                      result.undeliveredItems.length
                    )}
                    <View style={styles.packageBtnsView}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          this.remind(result.orderId);
                        }}
                      >
                        <View style={[styles.buyAgainView, { borderColor: "#3491df", marginLeft: 8 }]}>
                          <Text style={{ fontSize: 13, color: "#3491df" }}>提醒发货</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>}
                </View>}
                {/* 非多包裹 */}
                {!result.multiplePackage && <View style={{ backgroundColor: '#fff' }}>
                  {result.undeliveredItems.length > 0 && result.undeliveredItems.map((value, index) => {
                    return this.state.isShowAll ?
                      this._renderPrdItem(value, index) :
                      (index < 2 ? this._renderPrdItem(value, index) : null)
                  })}
                  {result.packageVoList.length > 0 && result.packageVoList[0].itemExts.map((value, index) => {
                    return this.state.isShowAll ?
                      this._renderPrdItem(value.appProductBaseVo, index) :
                      (index < 2 ? this._renderPrdItem(value.appProductBaseVo, index) : null)
                  })}
                  {result.undeliveredItems.length > 2 && this._renderShowMoreView(
                    result.undeliveredItems.length
                  )}
                  {result.packageVoList.length > 0 && result.packageVoList[0].itemExts.length > 2 && this._renderShowMoreView(
                    result.packageVoList[0].itemExts.length
                  )}
                </View>}
                {/* 积分订单 */}
              </View>

              <View style={styles.amountDetailView}>
                <View style={[styles.itemAmountView, { marginTop: 15 }]}>
                  <Text style={{ fontSize: 13, color: "#333333" }}>商品总金额</Text>
                  <Text style={{ fontSize: 13, color: "#333333" }}>
                    ¥ {result.productTotalAmount.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.itemAmountView}>
                  <Text style={{ fontSize: 13, color: "#333333" }}>运费</Text>
                  <Text style={{ fontSize: 13, color: "#333333" }}>
                    ¥ {result.freightAmount.toFixed(2)}
                  </Text>
                </View>
                {Math.abs(result.discountAmount) > 0 &&
                  <View style={styles.itemAmountView}>
                    <Text style={{ fontSize: 13, color: "#333333" }}>已优惠</Text>
                    <Text style={{ fontSize: 13, color: "#333333" }}>
                      -¥ {Math.abs(result.discountAmount).toFixed(2)}
                    </Text>
                  </View>}
                {Math.abs(result.couponAmount) > 0 &&
                  <View style={styles.itemAmountView}>
                    <Text style={{ fontSize: 13, color: "#333333" }}>用券抵扣</Text>
                    <Text style={{ fontSize: 13, color: "#333333" }}>
                      -¥ {Math.abs(result.couponAmount).toFixed(2)}
                    </Text>
                  </View>}
                {Math.abs(result.balanceAmount) > 0 &&
                  <View style={styles.itemAmountView}>
                    <Text style={{ fontSize: 13, color: "#333333" }}>预存款抵扣</Text>
                    <Text style={{ fontSize: 13, color: "#333333" }}>
                      -¥ {Math.abs(result.balanceAmount).toFixed(2)}
                    </Text>
                  </View>}
                <View style={styles.itemSpaceView} />
                <View style={{ paddingVertical: 10 }}>
                  <View style={styles.pointView}>
                    <Text style={{ fontSize: 13, color: "#333" }}>赠送积分</Text>
                    <Text style={{ fontSize: 13, color: "#332" }}>
                      {result.obtainTotalIntegral}积分
                  </Text>
                  </View>
                  <View style={styles.itemSpaceView} />
                  <View style={styles.payAmountView}>
                    <Text
                      style={{ fontSize: 15, color: "#333", fontWeight: "bold" }}>
                      实付款
                  </Text>
                    <Text style={{ fontSize: 16, color: "#ff6600" }}>
                      ¥{result.orderTotalAmount &&
                        result.orderTotalAmount.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>

              {result.promotionTypeCode == 12 &&
                result.isUseDepositPayment == "Y" &&
                result.depositPayVo &&
                <View
                  style={{
                    marginTop: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    backgroundColor: "#fff"
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}
                  >
                    {result.depositPayVo.isPayedDeposit == "N" &&
                      <Text style={{ fontSize: 12, color: "#8495a2" }}>
                        未支付定金
                    </Text>}
                    {result.depositPayVo.isPayedDeposit == "Y" &&
                      <Text style={{ fontSize: 12, color: "#8495a2" }}>
                        已支付定金
                    </Text>}
                    <Text style={{ fontSize: 12, color: "#8495a2" }}>
                      ¥ {result.depositAmount.toFixed(2)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 7
                    }}
                  >
                    {result.depositPayVo.isPayedFinalPayment == "N" &&
                      <Text style={{ fontSize: 12, color: "#8495a2" }}>
                        未支付尾款
                    </Text>}
                    {result.depositPayVo.isPayedFinalPayment == "Y" &&
                      <Text style={{ fontSize: 12, color: "#8495a2" }}>
                        已支付尾款
                    </Text>}
                    <Text style={{ fontSize: 12, color: "#8495a2" }}>
                      ¥ {result.finalPaymentAmount.toFixed(2)}
                    </Text>
                  </View>
                </View>}

              <TouchableOpacity style={{ backgroundColor: '#fafafa' }} onPress={() => {
                this.refs.invoice.show()
              }}>
                <View style={{ marginTop: 10, height: 50, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', backgroundColor: '#fff' }}>
                  <Text style={{ fontSize: 15, color: '#666', marginLeft: 13 }}>发票信息</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13 }}>
                    <Text style={{ fontSize: 14, color: '#bbb', marginRight: 13 }}>
                      {this.state.invoiceInfos.invoiceType == '0' ? '增值税普通发票' : '增值税专用发票'}
                    </Text>
                    <Image
                      style={{ width: 7, height: 13 }}
                      source={require('../res/OrderDetail/000xiangyousanjiao.png')} />
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.bottomView}>
                <View style={styles.bottomItems}>
                  <Text style={{ fontSize: 13, color: "#333" }}>订单编号</Text>
                  <Text style={{ fontSize: 13, color: "#332" }}>
                    {result.orderNum}
                  </Text>
                </View>
                <View style={styles.bottomItems}>
                  <Text style={{ fontSize: 13, color: "#333" }}>下单时间</Text>
                  <View style={styles.bottomLeftItem}>
                    <Text style={{ fontSize: 13, color: "#332" }}>
                      {result.orderTime}
                    </Text>
                  </View>
                </View>
                <View style={styles.bottomItems}>
                  <Text style={{ fontSize: 13, color: "#333" }}>供应商</Text>
                  <View style={styles.bottomLeftItem}>
                    <Text style={{ fontSize: 13, color: "#332" }}>
                      {result.sysShopInf && result.sysShopInf.companyNm}
                    </Text>
                  </View>
                </View>
                <View style={styles.bottomItems}>
                  <Text style={{ fontSize: 13, color: "#333" }}>配送方式</Text>
                  <View style={styles.bottomLeftItem}>
                    <Text style={{ fontSize: 13, color: "#332" }}>
                      {result.deliveryWay}
                    </Text>
                  </View>
                </View>
                <View style={styles.bottomItems}>
                  <Text style={{ fontSize: 13, color: "#333" }}>备注信息</Text>
                  <View style={styles.bottomLeftItem}>
                    <Text style={{ fontSize: 13, color: "#332" }}>
                      {result.remark || "无"}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ width: screenWidth, height: 10 }} />
            </ScrollView>
            {!result.multiplePackage && <View>
              {/*全额 付款*/}
              {result &&
                result.orderStat == "待付款" &&
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: screenWidth,
                    height: 50,
                    paddingHorizontal: 10,
                    backgroundColor: "#fff"
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      marginRight: 6,
                      justifyContent: "flex-end"
                    }}
                  >
                    {/*可取消*/}
                    {result.isCancelable == "Y" &&
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          this.cancelOrder(result.orderId);
                        }}
                      >
                        <View
                          style={{
                            width: 70,
                            height: 28,
                            borderRadius: 5,
                            borderColor: "#8E939A",
                            borderWidth: 1 / PixelRatio.get(),
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          <Text style={{ fontSize: 13, color: "#4A4A4A" }}>
                            取消订单
                      </Text>
                        </View>
                      </TouchableOpacity>}

                    {/*不可取消*/}
                    {result.isCancelable == "N" &&
                      <View
                        style={{
                          width: 70,
                          height: 28,
                          borderRadius: 5,
                          backgroundColor: "#ddd",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <Text style={{ fontSize: 13, color: "#c2c2c2" }}>取消订单</Text>
                      </View>}

                    {/*在支付时间以内*/}
                    {leftseconds > 0 &&
                      <TouchableOpacity
                        onPress={() => {
                          this.gotoPay(result.orderId, result.orderTotalAmount);
                        }}
                      >
                        <View
                          style={{
                            width: 130,
                            height: 28,
                            borderRadius: 5,
                            borderColor: "#3491df",
                            borderWidth: 1 / PixelRatio.get(),
                            marginLeft: 8,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#0082FF",
                            flexDirection: "row"
                          }}
                        >
                          <Text style={{ fontSize: 13, color: "white" }}>
                            {"立即支付 "}
                            {data.hourStr}:{data.minuteStr}:{data.secondStr}
                          </Text>
                        </View>
                      </TouchableOpacity>}

                    {/*支付时间已逾期*/}
                    {leftseconds == 0 &&
                      <View
                        style={{
                          width: 80,
                          height: 30,
                          borderRadius: 5,
                          backgroundColor: "#ddd",
                          marginLeft: 8,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <Text style={{ fontSize: 12, color: "#c2c2c2" }}>立即支付</Text>
                      </View>}
                  </View>
                </View>}

              {/*支付订金*/}
              {result.isUseDepositPayment == "Y" &&
                result.orderStat == "待付款" &&
                result.depositPayVo.isPayedDeposit == "N" &&
                <View style={{ paddingHorizontal: 10, backgroundColor: "#fff" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      height: 30,
                      alignItems: "center",
                      width: screenWidth - 20,
                      borderBottomColor: "#e5e5e5",
                      borderBottomWidth: 1 / PixelRatio.get()
                    }}
                  >
                    {leftseconds > 0
                      ? <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontSize: 10, color: "#53606a" }}>
                          定金支付剩余时间:{" "}
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                          {data.dayStr > 0 &&
                            <Text style={{ fontSize: 10, color: "#ff8a00" }}>
                              {data.dayStr}
                              <Text style={{ color: "#53606a" }}>天</Text>
                            </Text>}
                          <Text style={{ fontSize: 10, color: "#ff8a00" }}>
                            {data.hourStr}
                            <Text style={{ color: "#53606a" }}>小时</Text>
                          </Text>
                          <Text style={{ fontSize: 10, color: "#ff8a00" }}>
                            {data.minuteStr}
                            <Text style={{ color: "#53606a" }}>分</Text>
                          </Text>
                          <Text style={{ fontSize: 10, color: "#ff8a00" }}>
                            {parseInt(data.secondStr)}
                            <Text style={{ color: "#53606a" }}>秒</Text>
                          </Text>
                        </View>
                      </View>
                      : <Text style={{ fontSize: 10, color: "#53606a" }}>
                        已超过支付时限
                    </Text>}
                    <Text style={{ fontSize: 10, color: "#53606a" }}>
                      定金: ¥{result.depositAmount.toFixed(2)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      height: 50,
                      alignItems: "center",
                      width: screenWidth - 20
                    }}
                  >
                    {/*可取消*/}
                    {result.isCancelable == "Y" &&
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          this.cancelOrder(result.orderId);
                        }}
                      >
                        <View
                          style={{
                            width: 70,
                            height: 28,
                            borderRadius: 5,
                            borderColor: "#8E939A",
                            borderWidth: 1 / PixelRatio.get(),
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          <Text style={{ fontSize: 13, color: "#4A4A4A" }}>
                            取消订单
                      </Text>
                        </View>
                      </TouchableOpacity>}

                    {/*不可取消*/}
                    {result.isCancelable == "N" &&
                      <View
                        style={{
                          width: 70,
                          height: 28,
                          borderRadius: 5,
                          backgroundColor: "#ddd",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <Text style={{ fontSize: 13, color: "#c2c2c2" }}>取消订单</Text>
                      </View>}

                    {/*在支付时间以内*/}
                    {leftseconds > 0 &&
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigator.push({
                            component: CashierDesk,
                            params: {
                              orderId: result.orderId
                            }
                          });
                        }}
                      >
                        <View
                          style={{
                            width: 80,
                            height: 30,
                            borderRadius: 5,
                            borderColor: "#3491df",
                            borderWidth: 1 / PixelRatio.get(),
                            marginLeft: 8,
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          <Text style={{ fontSize: 13, color: "#3491df" }}>
                            立即支付
                      </Text>
                        </View>
                      </TouchableOpacity>}

                    {/*支付时间已逾期*/}
                    {leftseconds == 0 &&
                      <View
                        style={{
                          width: 80,
                          height: 30,
                          borderRadius: 5,
                          backgroundColor: "#ddd",
                          marginLeft: 8,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <Text style={{ fontSize: 13, color: "#c2c2c2" }}>立即支付</Text>
                      </View>}
                  </View>
                </View>}

              {/*支付尾款*/}
              {result.isUseDepositPayment == "Y" &&
                result.orderStat == "待付款" &&
                result.depositPayVo.isPayedDeposit == "Y" &&
                <View style={{ paddingHorizontal: 10, backgroundColor: "#fff" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      height: 30,
                      alignItems: "center",
                      width: screenWidth - 20,
                      borderBottomColor: "#e5e5e5",
                      borderBottomWidth: 1 / PixelRatio.get()
                    }}
                  >
                    {result.depositPayVo.finalPaymentTimeCode == 0 &&
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontSize: 10, color: "#53606a" }}>
                          尾款支付开始时间:{" "}
                        </Text>
                        <Text style={{ fontSize: 10, color: "#ff8a00" }}>
                          {result.depositPayVo.finalPaymentStartTimeString}
                        </Text>
                      </View>}
                    {result.depositPayVo.finalPaymentTimeCode == 1 &&
                      (leftseconds > 0
                        ? <View style={{ flexDirection: "row" }}>
                          <Text style={{ fontSize: 10, color: "#53606a" }}>
                            尾款支付剩余时间:{" "}
                          </Text>
                          <View style={{ flexDirection: "row" }}>
                            {data.dayStr > 0 &&
                              <Text style={{ fontSize: 10, color: "#ff8a00" }}>
                                {data.dayStr}
                                <Text style={{ color: "#53606a" }}>天</Text>
                              </Text>}
                            <Text style={{ fontSize: 10, color: "#ff8a00" }}>
                              {data.hourStr}
                              <Text style={{ color: "#53606a" }}>小时</Text>
                            </Text>
                            <Text style={{ fontSize: 10, color: "#ff8a00" }}>
                              {data.minuteStr}
                              <Text style={{ color: "#53606a" }}>分</Text>
                            </Text>
                            <Text style={{ fontSize: 10, color: "#ff8a00" }}>
                              {parseInt(data.secondStr)}
                              <Text style={{ color: "#53606a" }}>秒</Text>
                            </Text>
                          </View>
                        </View>
                        : <Text style={{ fontSize: 10, color: "#53606a" }}>
                          已超过支付时限
                      </Text>)}
                    {result.depositPayVo.finalPaymentTimeCode == 2 &&
                      <View>
                        <Text style={{ fontSize: 10, color: "#53606a" }}>
                          尾款支付截止时间:{" "}
                        </Text>
                        <Text style={{ fontSize: 10, color: "#ff8a00" }}>
                          {result.depositPayVo.finalPaymentEndTimeString}
                        </Text>
                      </View>}
                    <Text style={{ fontSize: 10, color: "#53606a" }}>
                      尾款: ¥{result.finalPaymentAmount.toFixed(2)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      height: 50,
                      alignItems: "center",
                      width: screenWidth - 20
                    }}
                  >
                    {/*在支付时间以内*/}
                    {result.depositPayVo.finalPaymentTimeCode == 1 &&
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigator.push({
                            component: CashierDesk,
                            params: {
                              orderId: result.orderId
                            }
                          });
                        }}
                      >
                        <View style={[styles.buyAgainView, { width: 130, borderColor: "#3491df", marginLeft: 8, }]}>
                          <Text style={{
                            fontSize: 13,
                            color: "#3491df",
                            backgroundColor: "transparent"
                          }} >
                            立即支付 {data.hourStr}:{data.minuteStr}:{data.secondStr}
                          </Text>
                        </View>
                      </TouchableOpacity>}

                    {/*支付时间已逾期*/}
                    {(result.depositPayVo.finalPaymentTimeCode == 0 ||
                      result.depositPayVo.finalPaymentTimeCode == 2) &&
                      <View style={[styles.buyAgainView, { backgroundColor: "#ddd", marginLeft: 8 }]}>
                        <Text style={{ fontSize: 13, color: "#c2c2c2" }}>立即支付</Text>
                      </View>}
                  </View>
                </View>}

              {/*待发货*/}
              {result.orderStat == "待发货" &&
                <View style={[styles.statView, { width: screenWidth }]}>
                  {/*可取消*/}
                  {result.isCancelable == "Y" && result.orderStat != '待发货' &&
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        this.cancelOrder(result.orderId);
                      }}
                    >
                      <View style={[styles.buyAgainView, { borderColor: "#8E939A" }]}>
                        <Text style={{ fontSize: 13, color: "#4A4A4A" }}>取消订单</Text>
                      </View>
                    </TouchableOpacity>}

                  {/*不可取消*/}
                  {result.isCancelable == "N" && result.orderStat != '待发货' &&
                    <View style={[styles.buyAgainView, { backgroundColor: "#ddd" }]}>
                      <Text style={{ fontSize: 13, color: "#c2c2c2" }}>取消订单</Text>
                    </View>}

                  {result.orderStat == '待发货' &&
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        if (result.hadCancelApplay == 'Y')
                          this.revokeApplay(result.orderId);
                        else
                          this.cancelWaitSendOrder(result.orderId);
                      }}
                    >
                      <View style={[styles.buyAgainView, { borderColor: "#8E939A" }]}>
                        <Text style={{ fontSize: 13, color: "#4A4A4A" }}>{result.hadCancelApplay == 'Y' ? '撤销请求' : '取消订单'}</Text>
                      </View>
                    </TouchableOpacity>}

                  {result.isRemind == "N" && !(result.hadCancelApplay == 'Y' && result.orderStat != '已取消') &&
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        this.remind(result.orderId);
                      }}
                    >
                      <View style={[styles.buyAgainView, { borderColor: "#3491df", marginLeft: 8 }]}>
                        <Text style={{ fontSize: 13, color: "#3491df" }}>提醒发货</Text>
                      </View>
                    </TouchableOpacity>}

                  {result.isRemind == "Y" &&
                    <View style={[styles.buyAgainView, { backgroundColor: "#ddd", marginLeft: 8 }]}>
                      <Text style={{ fontSize: 13, color: "#bbb" }}>已提醒发货</Text>
                    </View>}
                </View>}

              {/*发货中*/}
              {result.orderStat == "待收货" &&
                <View style={styles.statView}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      {/*this.logisticsDetail(result.packageItems[0].packageId);*/ }
                      this.logisticsDetail(result.orderId);
                    }}
                  >
                    <View style={[styles.buyAgainView, { borderColor: "#8E939A" }]}>
                      <Text style={{ fontSize: 13, color: "#4A4A4A" }}>查看物流</Text>
                    </View>
                  </TouchableOpacity>

                  {result.isAllSend == 'Y' && <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      this.buyerSigned(result.orderId);
                    }}
                  >
                    <View style={[styles.buyAgainView, { borderColor: "#3491df", marginLeft: 8 }]}>
                      <Text style={{ fontSize: 13, color: "#3491df" }}>确认收货</Text>
                    </View>
                  </TouchableOpacity>}
                </View>}
              {/*已完成,不可退货*/}
              {result.orderStat == "已完成" &&
                result.isReturnable == "N" &&
                <View style={styles.statView}>
                  <View
                    style={[styles.buyAgainView, { backgroundColor: "#ddd" }]}>
                    <Text style={{ fontSize: 13, color: "#c2c2c2" }}>申请售后</Text>
                  </View>
                  {result.promotionTypeCode == 0 &&
                    <TouchableOpacity
                      onPress={() => {
                        this.buyAgain(result.orderId, this.state.promotionTypeCode);
                      }}
                    >
                      <View style={[styles.buyAgainView, { borderColor: "#3491df" }]}>
                        <Text style={{ fontSize: 12, color: "#3491df" }}>再次购买</Text>
                      </View>
                    </TouchableOpacity>}
                </View>}

              {/*已完成,可退货*/}
              {result.orderStat == "已完成" &&
                result.isReturnable == "Y" &&
                <View style={styles.statView}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      this.afterSale(
                        result.orderId,
                        result.defaultPackage.packageId
                      );
                    }}
                  >
                    <View style={[styles.buyAgainView, { borderColor: "#6e8393" }]}>
                      <Text style={{ fontSize: 13, color: "#6e8393" }}>申请售后</Text>
                    </View>
                  </TouchableOpacity>
                  {result.promotionTypeCode == 0 &&
                    <TouchableOpacity
                      onPress={() => {
                        this.buyAgain(result.orderId, this.state.promotionTypeCode);
                      }}
                    >
                      <View style={[styles.buyAgainView, { marginLeft: 8, borderColor: "#3491df" }]}>
                        <Text style={{ fontSize: 13, color: "#3491df" }}>再次购买</Text>
                      </View>
                    </TouchableOpacity>}
                </View>}
              {/*已取消,再次购买*/}
            </View>}
          </View>}
          <MaskModal ref='invoice' contentView={
            this._renderInvoiceMask(this.state.invoiceInfos)
          } />
        </DataController>
      </BaseView>
    );
  }
}
