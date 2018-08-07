import React, { Component } from 'react';
import {
    Text,
    Image,
    TouchableOpacity,
    View,
    TextInput,
    ScrollView,
    Platform,
    InteractionManager,
    Dimensions
} from 'react-native';
import Fetch from 'future/public/lib/Fetch';
import {
    BaseView,
} from 'future/public/widgets';
import styles from '../styles/IntegralOrderDetail';
import MoreOperation from '../../commons/moreOperation/components/MoreOperation';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default class IntegralOrderDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: {},
            orderItemVoList: []
        }
        this._showMore = this._showMore.bind(this);
        this.fetchData = this._fetchData.bind(this);
    }
    componentDidMount() {
        console.log('params', this.props.params);
        this.fetchData()
    }
    _fetchData() {
        new Fetch({
            url: "app/integralOrder/getIntegralOrderDetail.json",
            data: {
                integralOrderId: this.props.params.data.integralOrderId
            },
        }).dofetch().then((data) => {
            this.setState({
                result: data.result,
                orderItemVoList: data.result.orderItemVoList
            })
        }).catch((err) => {
            console.log("获取积分订单详情失败：", err);
        });
    }
    _showMore() {

    }
    _renderTopView(result) {
        if (result.orderStat == '待发货') {
            return (
                <View>
                    <Image style={{width:screenWidth,height:100 ,position:'absolute'}} source={require('../res/IntegralOrderDetail/orderDetailsHead.jpg')}/>
                    <Image style={{width:130,height:75 ,top:13,position:'absolute',right:15}} source={require('../res/IntegralOrderDetail/daifukuan.jpg')}/>
                <View style={styles.headImage}>
                    <Text style={{ fontSize: 18, color: '#fff' }}>待发货</Text>
                    <Text style={{ fontSize: 12, color: '#fff', marginTop: 4 }}>尊敬的客户！</Text>
                    <Text style={{ fontSize: 12, color: '#fff', marginTop: 1 }}>我们会尽快为您发货。</Text>
                </View>
                </View>
                
            );
        } else if (result.orderStat == '待收货') {
            return (
                 <View>
                    <Image style={{width:screenWidth,height:100 ,position:'absolute'}} source={require('../res/IntegralOrderDetail/orderDetailsHead.jpg')}/>
                    <Image style={{width:130,height:75 ,top:25,position:'absolute',right:0}} source={require('../res/IntegralOrderDetail/daishouhuo.jpg')}/>
                <View style={styles.headImage}>
                    <Text style={{ fontSize: 18, color: '#fff' }}>待收货</Text>
                    <Text style={{ fontSize: 12, color: '#fff', marginTop: 4 }}>尊敬的客户！</Text>
                    <Text style={{ fontSize: 12, color: '#fff', marginTop: 1 }}>包裹正向你飞奔过去..</Text>
                </View>
                </View>
            );
        } else if (result.orderStat == '已完成') {
            return (
                 <View>
                    <Image style={{width:screenWidth,height:100 ,position:'absolute'}} source={require('../res/IntegralOrderDetail/orderDetailsHead.jpg')}/>
                    <Image style={{width:55,height:65 ,top:25,position:'absolute',right:15}} source={require('../res/IntegralOrderDetail/yiwancheng.jpg')}/>
                <View style={styles.headImage}>
                    <Text style={{ fontSize: 18, color: '#fff' }}>已完成</Text>
                    <Text style={{ fontSize: 12, color: '#fff', marginTop: 4 }}>交易已完成~</Text>
                    <Text style={{ fontSize: 12, color: '#fff', marginTop: 1 }}>感谢亲您对我们的支持！</Text>
                </View>
                </View>
            );
        }
    }
    render() {
        let result = this.state.result;
        let orderItemVoList = this.state.orderItemVoList;
        console.log('result',result);
        return (
            <BaseView
                mainBackColor={{ backgroundColor: '#f4f3f3' }}
                mainColor={'#f5f5f5'}
                statusBarStyle={'default'}
                titlePosition={'center'}
                title={{ title: '订单详情', tintColor: '#333', fontSize: 18 }}
                navigator={this.props.navigator}
                rightButton={(
                   <View style={{ justifyContent: 'center' }}>
                        <MoreOperation
                            navigator={this.props.navigator}
                            order={
                                [{
                                    module: 'index',
                                },{
                                    module: 'message',
                                }, {
                                    module: 'mine',
                                }]
                            }
                            />
                    </View>
                )}>
                <ScrollView style={{ flex: 1 }}>
                    {this._renderTopView(result)}
                    <View style={styles.address}>
                        <Text style={{ fontSize: 15, color: '#333' }}>收货地址</Text>
                        <View style={styles.phone}>
                            <Text style={{ fontSize: 15, color: '#333', marginRight: 20 }}>{result.receiverName}</Text>
                            <Text style={{ fontSize: 15, color: '#333' }}>{result.receiverMobile}</Text>
                        </View>
                        <View style={styles.adressDe}>
                            <Text style={{ fontSize: 14, color: '#666' }} numberOfLines={2}>{result.receiverAddr}</Text>
                        </View>
                    </View>

                    <View style={styles.shopList}>
                        <Text style={{ fontSize: 14, color: '#333' }}>商品清单</Text>
                    </View>
                    <View style={styles.shopName}>
                        <Text style={{ fontSize: 14, color: '#333', marginRight: 20, flex: 1 }} numberOfLines={1}>{orderItemVoList.length > 0 ? orderItemVoList[0].integralProductNm : ''}</Text>
                        <Text style={{ fontSize: 12, color: '#8495A2' }}>{orderItemVoList.length > 0 ? 'x' + orderItemVoList[0].num : ''}</Text>
                    </View>
                    <View style={styles.sorceView}>
                        <Text style={{ fontSize: 13, color: '#333' }}>积分价</Text>
                        <Text style={{ fontSize: 13, color: '#333' }}>{orderItemVoList.length > 0 ? orderItemVoList[0].productUnitIntegral : ''}</Text>
                    </View>
                    <View style={styles.line} />
                    <View style={styles.sorceView}>
                        <Text style={{ fontSize: 15, color: '#333', fontWeight: 'bold' }}>应付总积分</Text>
                        <Text style={{ fontSize: 16, color: '#FF6600', fontWeight: 'bold' }}>{orderItemVoList.length > 0 ? orderItemVoList[0].totalIntegral : ''}</Text>
                    </View>

                    <View style={styles.bottomView}>
                        <View style={styles.bottomItems}>
                            <Text style={{ fontSize: 13, color: '#333' }}>订单编号</Text>
                            <Text style={{ fontSize: 13, color: '#332' }}>{result.orderNum}</Text>
                        </View>
                        <View style={styles.bottomItems}>
                            <Text style={{ fontSize: 13, color: '#333' }}>下单时间</Text>
                            <View style={styles.bottomLeftItem}>
                                <Text style={{ fontSize: 13, color: '#332' }}>{result.createDateStr}</Text>
                            </View>
                        </View>
                        <View style={styles.bottomItems}>
                            <Text style={{ fontSize: 13, color: '#333' }}>配送方式</Text>
                            <View style={styles.bottomLeftItem}>
                                <Text style={{ fontSize: 13, color: '#332' }}>公司配送</Text>
                            </View>
                        </View>
                        <View style={styles.bottomItems}>
                            <Text style={{ fontSize: 13, color: '#333' }}>支付方式</Text>
                            <View style={styles.bottomLeftItem}>
                                <Text style={{ fontSize: 13, color: '#332' }}>在线支付</Text>
                            </View>
                        </View>
                    </View>

                    {result.orderStat == '待收货'&&<View style={styles.confirm}>
                         <TouchableOpacity >
                            <View style={styles.confirmView}>
                             <Text style={{fontSize:13,color:'#0082FF'}}>确认收货</Text>
                             </View>
                         </TouchableOpacity>
                    </View>}
                </ScrollView>
            </BaseView >
        );
    }
}


