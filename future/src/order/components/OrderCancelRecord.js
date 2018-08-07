import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView
} from 'react-native';

import {BaseView,RefreshableListView,MaskModal,TextInputC,DataController,} from "future/public/widgets";
import {Fetch} from 'future/public/lib';
export default class OrderCancelRecord extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
        console.log(this.props.params.listLog)
    }
    _renderTimePointView(data,index){
        let datastr = data.timeStr;
        let DateArr = datastr.split(' ');
        return <View style={{width:SCREENWIDTH-26,flexDirection:'row',flex:1}} key={index+'time'}>
            <View style={{width:(SCREENWIDTH-40)/3,flex:1}}>
                <Text style={{alignSelf:'flex-end',marginRight:10,fontSize:12,color:'#5E656D'}}>{DateArr[0]}</Text>
                <Text style={{alignSelf:'flex-end',marginRight:10,fontSize:12,color:'#5E656D'}}>{DateArr[1]}</Text>
            </View>
            <View style={{width:14,alignItems:'center',flex:1}}>
                <Image style={{width:12,height:12,backgroundColor:index==0?'#0082FF':'#BCC5D7'}}/>
                {index!=this.props.params.listLog.length-1&&<View style={{width:1,flex:1,backgroundColor:'#BCC5D7'}}/>}
            </View>
            <View style={{width:2*(SCREENWIDTH-40)/3,flex:1}}>
                <Text numberOfLines={10} style={{marginLeft:15,marginBottom:50,fontSize:14,color:'#666'}}>{data.cont}</Text>
            </View>
        </View>
    }
    render(){
        return(
            <BaseView navigator={this.props.navigator} 
            scrollEnabled={false} 
            mainColor={'#34457D'}
            ref='base'
            statusBarStyle={'light-content'}
            title={{ title: '取消记录', tintColor: '#fff', fontSize: 18 }}
            leftBtnStyle={{width:10,height:17,tintColor:'#fff'}}>
                <View style={{flex:1,backgroundColor:'#F5F5F5'}}>
                    <View style={{height:24,width:SCREENWIDTH,backgroundColor:'#34457D'}}>
                    </View>
                    <ScrollView 
                    style={{
                        height:SCREENHEIGHT-79,
                        width:SCREENWIDTH-26,
                        borderRadius:4,
                        left:13,
                        top:15,
                        backgroundColor:'#F5F5F5',
                        position:'absolute'}}>
                        <View style={{width:SCREENWIDTH-26,marginTop:35}}>
                            {this.props.params.listLog&&this.props.params.listLog.length>0
                            &&this.props.params.listLog.map((value,index)=>{
                                return this._renderTimePointView(value,index);
                            })}
                        </View>
                    </ScrollView>
                </View>
            </BaseView>
        )
    }
}
