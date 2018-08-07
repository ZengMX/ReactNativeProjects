import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import styles from '../styles/CancelOrderInfosSet.css';
import { BaseView, MaskModal, RefreshableListView, Toast, Loading } from 'future/public/widgets';
import { Fetch } from "future/public/lib";
import CancelOrderInfosSure from './CancelOrderInfosSure';
export default class CancelOrderInfosSet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reasons : [],
            selectCode:'',
        }
    }
    componentDidMount(){
        new Fetch({
            url: "/app/order/reasonCodeList.json",
            method: "GET",
        })
        .dofetch().then(data => {
            if(data.success){
                this.setState({
                    reasons:data.result
                })
            }
        }).catch(err => {
            console.log("err", err);
        });
    }
    selectTheReason(selectData){
        this.setState({
            selectCode:selectData.code
        });
    }

    nextStep(){
        if(this.state.selectCode!=''){
            this.props.navigator.push({
                component:CancelOrderInfosSure,
                params:{
                    orderId:this.props.params.orderId,
                    code:this.state.selectCode,
                    callback:this.props.params.callback
                }
            })
        }
    }
    render(){
        let reasonsItemView = null;
        if(this.state.reasons.length>0){
            reasonsItemView = this.state.reasons.map((value,index)=>{
                return <TouchableOpacity 
                onPress={this.selectTheReason.bind(this,value)}
                key={'reason'+index} style={styles.reasonItem}>
                    <Text style={styles.reasonContentItemTitle}>{value.name}</Text>
                    <Image 
                    style={styles.reasonItemImg} 
                    source={this.state.selectCode==value.code?
                    require('../res/cancelOrderInset/已勾选.png'):
                    require('../res/cancelOrderInset/a006gouxuan.png')}/>
                </TouchableOpacity>
            })
        }
        return(
            <BaseView
            mainBackColor={{ backgroundColor: "#f4f3f3" }}
            mainColor={"#fafafa"}
            titlePosition={"center"}
            title={{ title: "取消订单", tintColor: "#333333", fontSize: 18 }}
            navigator={this.props.navigator}>
                <View style={styles.introduce}>
                    <Text style={styles.introduceTitle}>温馨提示：</Text>
                    <Text style={styles.introduceTxt}>·订单成功取消后我们会以短信的方式通知您</Text>
                    <Text style={styles.introduceTxt}>·该订单已付金额，成功取消后会全额原路返回</Text>
                    <Text style={styles.introduceTxt}>·拆单后取消订单</Text>
                    <Text style={styles.introduceTxt}>·取消订单失败，我们会以短信的方式通知您</Text>
                </View>
                <View style={styles.reasonContent}>
                    <Text style={styles.reasonContentTitle}>取消原因</Text>
                    <View style={styles.splitLine} />
                    <ScrollView style={{flex:1,borderBottomWidth:0.5,borderBottomColor:'#f0f0f0'}}>
                        <View style={styles.reasonContentView}>
                        {reasonsItemView}
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.bottomView}>
                    <TouchableOpacity 
                    onPress={this.nextStep.bind(this)}
                    style={this.state.selectCode==''?styles.nextBtnUnable:styles.nextBtnAble}>
                        <Text style={this.state.selectCode==''?styles.nextBtnTxtUnable:styles.nextBtnTxtAble}>下一步</Text>
                    </TouchableOpacity>
                </View>
            </BaseView>
        )
    }
}
