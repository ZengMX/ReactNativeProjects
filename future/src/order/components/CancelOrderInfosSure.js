import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity
} from 'react-native';
import { BaseView, MaskModal, RefreshableListView, Loading } from 'future/public/widgets';
import { Fetch } from "future/public/lib";
import styles from '../styles/CancelOrderInfosSet.css';
export default class CancelOrderInfosSure extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount:0,
            buyer:'',
            tel:''
        }
    }
    componentDidMount(){
        new Fetch({
            url: "/app/order/applayOrderCancelDetail.json",
            method: "POST",
            data:{
                orderId:this.props.params.orderId
            }
        })
        .dofetch().then(data => {
            if(data.success){
                this.setState({
                    amount:data.result.orderTotalAmount,
                    buyer:data.result.receiverName,
                    tel:data.result.mobile
                })
            }
        }).catch(err => {
            console.log("err", err);
        });
    }

    sureAction(){
        new Fetch({
            url: "/app/order/applayOrderCancel.json",
            method: "POST",
            bodyType:'json',
            data:{
                orderId:this.props.params.orderId,
                reasonCode:this.props.params.code
            }
        })
        .dofetch().then(data => {
            if(data.success){
                this.refs.base.showToast('提交成功')
                let poproute = this.props.navigator.getCurrentRoutes()[this.props.navigator.getCurrentRoutes().length - 3];
                this.props.navigator.popToRoute(poproute);
                this.props.params.callback&&this.props.params.callback();
            }
        }).catch(err => {
            console.log("err", err);
        });
    }

    submitCancelInfos(){
        Alert.alert(
            '',
			'亲，您确定取消订单吗？',
			[
				{ text: '取消', onPress: () => { } },
				{
					text: '确定', onPress: () => {
						this.sureAction();
					}
				},
			]
		)
    }
    render(){
        return(
            <BaseView
            mainBackColor={{ backgroundColor: "#f4f3f3" }}
            ref='base'
            mainColor={"#fafafa"}
            titlePosition={"center"}
            title={{ title: "取消订单", tintColor: "#333333", fontSize: 18 }}
            navigator={this.props.navigator}>
                <View style={{flex:1}}>
                    <View style={styles.topView}>
                        <Text style={styles.amountTitle}>退款金额(元)</Text>
                        <Text style={styles.amountTxt}>{this.state.amount.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.buyerViews,{marginTop:5}]}>
                        <View style={{width:98}}>
                            <Text style={styles.buyerTitle}>联系人</Text>
                        </View>
                        <View style={{width:SCREENWIDTH-98}}>
                            <Text style={styles.buyerTxt}>{this.state.buyer}</Text>
                        </View>
                    </View>
                    <View style={styles.buyerViews}>
                        <View style={{width:98}}>
                            <Text style={styles.buyerTitle}>手机号码</Text>
                        </View>
                        <View style={{width:SCREENWIDTH-98}}>
                            <Text style={styles.buyerTxt}>{this.state.tel}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.bottomView}>
                    <TouchableOpacity 
                    onPress={this.submitCancelInfos.bind(this)}
                    style={styles.nextBtnAble}>
                        <Text style={styles.nextBtnTxtAble}>提交</Text>
                    </TouchableOpacity>
                </View>
            </BaseView>
        )
    }
}
