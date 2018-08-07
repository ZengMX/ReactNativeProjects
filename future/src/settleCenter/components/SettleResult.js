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

let SCREEN_WIDTH = require('Dimensions').get('window').width;
export default class SettleResult extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount(){
    }
    componentDidMount(){
    }
    componentWillReceiveProps(nextProps){
    }
    shouldComponentUpdate(){
    }
    componentWillUpdate(){
    }
    componentDidUpdate(){
    }
    componentWillUnmount(){
    }
    render(){
        return(
            <BaseView
                ref='base'
                navigator={this.props.navigator}
                mainColor={'#34457D'}
                title={{ title: this.props.params.title, tintColor: '#fff', fontSize: 18 }}
            >
                    <View style={{flex:1,alignItems:'center'}}>
                        <Image 
                        style={{marginTop:105}} 
                        resizeMode='contain' 
                        source={
                            this.props.params.success?
                            require('../../stocksList/res/StocksList/004chenggon.png'):
                            require('../../stocksList/res/StocksList/004shibai.png')}/>
                        <Text style={{marginTop:33,fontSize:15,color:'#455A64'}}>{this.props.params.resultContent}</Text>
                        {this.props.params.reason&&<Text style={{color:'#999',fontSize:12}}>{this.props.params.reason}</Text>}
                    </View>
                    <View style={{height:144,width:SCREEN_WIDTH,alignItems:'center',backgroundColor:'#F0F0F0'}}>
                        <TouchableOpacity 
                            onPress={()=>{
                                this.props.navigator.popToTop();
                            }}
                            style={{width:294,height:45,justifyContent:'center',alignItems:'center',marginTop:35,backgroundColor:'#34457D'}}>
                                <Text style={{fontSize:16,color:'#fff'}}>{this.props.params.returnTitle}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={()=>{
                                RCTDeviceEventEmitter.emit('changeTabBarIdx2', { idx: 0, goTop: true });
                                this.props.navigator.popToTop();
                            }}
                            style={{marginTop:18}}>
                                <Text style={{fontSize:13,color:'#5591FA'}}>去首页看看</Text>
                        </TouchableOpacity>
                    </View>
                
            </BaseView>
        )
    }
}
const styles = StyleSheet.create({
})
