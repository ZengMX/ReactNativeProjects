import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

import {BaseView} from 'future/public/widgets';

export default class FailPage extends Component {
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
                        source={require('../res/004shibai.png')}/>
                        <Text style={{marginTop:33,fontSize:15,color:'#455A64'}}>抱歉，提交失败！</Text>
                        <Text style={{color:'#999',fontSize:12,marginTop:10}}>网络异常，提交未成功，请返回提交</Text>
                    </View>

                    
                    <View style={{height:144,width:SCREENWIDTH,alignItems:'center'}}>
                        <TouchableOpacity 
                            onPress={()=>{
                                this.props.navigator.pop();
                            }}
                            style={{width:294,height:45,justifyContent:'center',alignItems:'center',marginTop:35,backgroundColor:'#34457D'}}>
                                <Text style={{fontSize:16,color:'#fff'}}>返回上一步</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={()=>{
                                RCTDeviceEventEmitter.emit('changeTabBarIdx2', { idx: 0, goTop: true });
                                this.props.navigator.popToTop();
                            }}
                            style={{marginTop:18,flexDirection:'row',alignItems:'center'}}>
                                <Text style={{fontSize:13,color:'#5591FA'}}>去首页逛逛</Text>
                                <Image style={{width:4,height:7,marginLeft:8}} source={require('../res/006xianyousnajiao.png')}/>
                        </TouchableOpacity>
                    </View>
                
            </BaseView>
        )
    }
}