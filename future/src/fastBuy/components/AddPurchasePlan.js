import React, { Component } from 'react';
import {
  TextInput,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  PixelRatio,
  Alert
} from 'react-native';

import { Loading,RefreshableListView, BaseView } from '../../widgets';
import Fetch from 'future/src/lib/Fetch';
import ValidateUtil from 'future/src/lib/ValidateUtil';
import DeviceEventEmitter from 'RCTDeviceEventEmitter';

var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;
export default class AddPurchasePlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name : '',
            remark : ''
        }
    }
    componentDidMount(){
    }
    componentWillUnmount(){
    }

    // deletePlan(){
    //     Alert.alert(
    //         '删除计划',
    //         '是否删除计划？',
    //         [
    //           {text: '取消', onPress: () => {}},
    //           {text: '确认', onPress: () => {this.fetchDeletePlan()}},
    //         ]
    //     )
    // }

    save(){
        
        if(ValidateUtil.isNull(this.state.name)){
			this.refs.baseview.showToast('请输入计划名称');
            return;
        }
        this.refs.baseview.showLoading();
        new Fetch({
			url: '/app/cart/createPurchaseTem.json',
			method: 'POST',
            bodyType: 'json',
			data: {
				templateNm : this.state.name,
				remarks : this.state.remark,
            }
		}).dofetch().then((data) => {
            this.refs.baseview.hideLoading();
            
            if(data.success){
                this.props.navigator.pop();
                this.refs.baseview.showToast('添加成功');
                this.postListenInfo();
            }
		}).catch((error)=>{
            this.refs.baseview.hideLoading();
			console.log('=====>错误 CATCH>>',error);
		});
    }

    postListenInfo(){
        DeviceEventEmitter.emit('updatePlanSuccess');
    }

    fetchDeletePlan(){
        
        new Fetch({
			url: '/app/user/deletePurchaseTemplate.json',
			method: 'POST',
			data: {
                purchaseTemplateId : this.props.params.purchaseTemplateId,
            }
		}).dofetch().then((data) => {
            if(data.success){
                this.refs.baseview.showToast('删除成功');
                this.props.navigator.pop();
                this.postListenInfo();
            }
		});
    }

    // renderRightButton(){
    //     return<TouchableOpacity onPress={this.deletePlan.bind(this)}>
    //        <Text style={{width:40,marginTop:15,color:'#fff'}}>删除</Text>
    //     </TouchableOpacity>
    // }
    render(){
        return(
            <BaseView 
            ref='baseview'
            title={{ title: '添加计划', fontSize: 16, tintColor: '#fff' }} 
            navigator={this.props.navigator} >
                <View style={{flex:1}}>
                    <View style={{backgroundColor:'#fff',marginTop:10,width:screenWidth,height:175}}>
                       <View style={{flexDirection:'row',height:45,width:screenWidth,alignItems:'center'}}>
                            <Text style={{fontSize:15,marginLeft:11,color:'#999'}}>计划名称</Text>
                            <TextInput 
							maxLength={124}
                            underlineColorAndroid='transparent'
                            ref='name' 
                            style={{fontSize:15,marginLeft:11,height:40,marginTop:2.5,width:screenWidth-93}} 
                            placeholder={'(必填)'}
                            onChangeText={(value)=>{
                                this.setState({name:value})
                            }}/>
                       </View>
                       <View style={{width:screenWidth,height:1 / PixelRatio.get(),backgroundColor:'#e5e5e5'}}/>
                       <View style={{flexDirection:'row',height:130,width:screenWidth,alignItems:'center'}}>
                            <View style={{height:130}}>
                                <Text style={{fontSize:15,marginLeft:11,color:'#999',marginTop:15}}>计划描述</Text>
                            </View>
                            <View style={{height:130}}>
                                <TextInput 
								maxLength={256}
                                underlineColorAndroid='transparent'
                                ref='remark' 
                                multiline={true}
                                style={{textAlignVertical:'top',marginLeft:11,marginTop:8,fontSize:15,width:screenWidth-93,height:120}}
                                onChangeText={(value)=>{
                                    this.setState({remark:value})
                                }}/>
                            </View>
                       </View>
                    </View>
                    <TouchableOpacity style={styles.edi_btn} onPress={this.save.bind(this)}>
                        <Text style={{color:'#fff',fontSize:13}}>添加</Text>
                    </TouchableOpacity>
                </View>
            </BaseView>
        )
    }
}
const styles = StyleSheet.create({
    edit_content:{
        backgroundColor:'#fff',
        marginTop:10,
        width:screenWidth,
        height:175
    },
    edi_btn:{
        marginTop:15,
        backgroundColor:'#3491df',
        marginLeft:12,
        borderRadius:5,
        width:screenWidth-24,
        height:40,
        justifyContent:'center',
        alignItems:'center'
    }
})
