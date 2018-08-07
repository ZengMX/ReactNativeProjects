import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  StyleSheet
} from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

import {BaseView} from 'future/public/widgets';

export default class SuccessPage extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
    }
    render(){
        return(
            <BaseView
                ref='base'
                navigator={this.props.navigator}
                mainBackColor={{ backgroundColor: '#f0f0f0' }}
                mainColor={'#34457D'}
                title={{ title: '提交资料', tintColor: '#fff', fontSize: 18 }}
            >
                    <View style={{flex:1,alignItems:'center',backgroundColor:'#fff'}}>
                        <Image 
                        style={{marginTop:105}} 
                        resizeMode='contain' 
                        source={require('../res/004chenggon.png')}/>
                        <Text style={{marginTop:33,fontSize:15,color:'#455A64'}}>提交成功！</Text>
                        <Text style={{color:'#999',fontSize:12,marginTop:10}}>您的资料已提交，请等待管理员审核</Text>
                    </View>

                    <View style={{width:SCREENWIDTH,height:65,marginTop:10}}>
                        <Image style={{position:'absolute',width:SCREENWIDTH,flex:1}} source={require('../res/006beijing.png')}/>
                        <View style={{width:SCREENWIDTH,flexDirection:'row',paddingHorizontal:13,justifyContent:'space-between',marginTop:13}}>
                            <Text style={{fontSize:12,color:'#53606a',backgroundColor:'rgba(255,255,255,0)'}}>免费咨询客服加速审核</Text>
                            <Text style={{fontSize:12,color:'#53606a',backgroundColor:'rgba(255,255,255,0)'}}>工作日 9:00-18:00</Text>
                        </View>
                        <View style={{width:SCREENWIDTH,flexDirection:'row',paddingHorizontal:13,alignItems:'center',justifyContent:'space-between'}}>
                            <Text style={{fontSize:19,color:'#34457d',backgroundColor:'rgba(255,255,255,0)'}}>400-873-8700</Text>
                            <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>{
                                    Linking.openURL('tel:4008738700')
                                }}>
                            <Text style={{fontSize:12,color:'#34457d',backgroundColor:'rgba(255,255,255,0)'}}>立即拨打</Text>
                            <Image style={{width:5.5,height:9,marginLeft:5}} source={require('../res/006xisanjiao.png')}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{height:144,width:SCREENWIDTH,alignItems:'center'}}>
                        <TouchableOpacity 
                            onPress={()=>{
                                RCTDeviceEventEmitter.emit('changeTabBarIdx2', { idx: 0, goTop: true });
                                this.props.navigator.popToTop();
                            }}
                            style={{width:294,height:45,justifyContent:'center',alignItems:'center',marginTop:35,backgroundColor:'#34457D'}}>
                                <Text style={{fontSize:16,color:'#fff'}}>去首页逛逛</Text>
                        </TouchableOpacity>
                    </View>
                
            </BaseView>
        )
    }
}