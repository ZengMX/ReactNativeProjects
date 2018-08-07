
/**
 *购物车的PrdListItem，速购的已经独立  NumberInput的 increment属性用于一次加减数量
 */

import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  TouchableOpacity
} from 'react-native';
var fullWidth = require('Dimensions').get('window').width;
import styles from '../style/StocksList.css.js'
import { NumberInput } from 'future/public/widgets';
export default class PrdListItem extends Component {
    constructor(props) {
        super(props);
        let num = 1;
        if(this.props.prdData){
            num = this.props.prdData.quantity;
        }
        this.state ={
            stepNum:num,
            isSelected:this.props.prdData?this.props.prdData.selected:true
        }
    }
    static propTypes = {
        showStock:React.PropTypes.bool,
        cartDataSelectAction:React.PropTypes.func,
        changePrdNums:React.PropTypes.func,
        clickAllItem:React.PropTypes.func,
    }
    static defaultProps = {
        showStock:false,
        cartDataSelectAction:()=>{},
        changePrdNums:()=>{},
        clickAllItem:()=>{}
    }
    componentDidMount(){
    }
    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
    }
    componentWillReceiveProps(nextProps){
        this.timer && clearTimeout(this.timer);
        // this.timer = setTimeout(()=>{
        //     nextProps.prdData&&this.setState({
        //         isSelected:this.props.prdData.selected
        //     });
        // },1000) 
    }
    render(){
        var remainStock;
        if(this.props.prdData) {
            if(this.props.prdData.remainStock<=0){
                remainStock = '<0';
            } 
            if(this.props.prdData.remainStock>0&&this.props.prdData.remainStock<=1000){
                remainStock = '<=1000';
            } 
            if(this.props.prdData.remainStock>1000&&this.props.prdData.remainStock<=1500){
                remainStock = '>1000';
            }
            if(this.props.prdData.remainStock>1500){
                remainStock = '>1500';
            }
        }
        if(this.props.cartData) {
            remainStock = this.props.cartData.remainStockRange;
        }
        let totalPrice = this.props.prdData?this.state.stepNum*this.props.prdData.price:'';
        return(
            <View style={{width:fullWidth,flex:1,flexDirection:'row',backgroundColor:'#fff'}}>
                <TouchableOpacity onPress={()=>{
                    this.props.cartData&&this.props.cartDataSelectAction(!this.props.cartData.itemSelected);
                }}>
                {this.props.prdData&&<View style={{width:50,flex:1,justifyContent:'center',alignItems:'center'}}>
                    {this.state.isSelected==true?<Image 
                    style={{ width: 16, height: 16}} 
                    source={require('../res/images/000gouxuan_s.png')}
					resizeMode='contain'/>:<Image 
                    style={{ width: 16, height: 16}} 
                    source={require('../res/images/000weigouxuan.png')}
					resizeMode='contain'/>}
                </View>}
                {this.props.cartData&&<View style={{width:50,flex:1,justifyContent:'center',alignItems:'center'}}>
                    {this.props.cartData.itemSelected==true?<Image 
                    style={{ width: 16, height: 16}} 
                    source={require('../res/images/000gouxuan_s.png')}
					resizeMode='contain'/>:<Image 
                    style={{ width: 16, height: 16}} 
                    source={require('../res/images/000weigouxuan.png')}
					resizeMode='contain'/>}
                </View>}
                </TouchableOpacity>
                {this.props.prdData&&<View style={{width:fullWidth-50,flex:1,backgroundColor:'#fff'}}>
                    <TouchableOpacity>
                        <Text style={{marginTop:15,fontSize:14,color:'#333'}}>{this.props.prdData.productNm}</Text>
                        <View style={{marginTop:10,width:fullWidth-60,flex:1,paddingBottom:15,borderBottomWidth:0.5,borderBottomColor:'#EEEEEE'}}>
                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                <Text style={{color:'#8495A2',fontSize:12}}>规格：{this.props.prdData.specPack}</Text>
                            </View>
                            <Text style={{color:'#8495A2',fontSize:12,marginTop:10}}>厂家：{this.props.prdData.factory}</Text>
                            {this.props.prdData.factory && <Text style={{color:'#8495A2',fontSize:12,marginTop:10}}>供应商：{this.props.prdData.shopNm}</Text>}
                        </View>
                        {this.props.showStock && <View style={{height:60,width:fullWidth-65,backgroundColor:'#F8F8F8',flexDirection:'row',justifyContent:'space-between'}}>
                                <View style={{marginLeft:15}}>
                                    <Text style={{marginTop:10,fontSize:13,color:'#333'}}>¥{this.props.prdData.price}</Text>
                                    <Text style={{marginTop:10,fontSize:12,color:'#5C6A74'}}>库存：{remainStock}</Text>
                                </View>
                                <View style={{marginTop:15,marginRight:15}}>
                                    <NumberInput 
                                    value={this.state.stepNum} 
                                    onChange={(value) => {this.setState({ stepNum: value }) }} 
                                    max={this.props.prdData.remainStock} />
                                </View>
                            </View>}
                        <View style={{width:fullWidth-60,flex:1,paddingBottom:10}}>
                            <Text style={{alignSelf:'flex-end',fontSize:13,marginTop:10,color:'#333'}}>小计<Text style={{color:'#FF6600'}}>   ¥{totalPrice.toFixed(2)}</Text></Text>
                        </View>
                    </TouchableOpacity>
                    </View>
                    }
                {this.props.cartData&&<View style={{width:fullWidth-50,flex:1,backgroundColor:'#fff'}}>
                    <TouchableOpacity onPress={()=>{
                        this.props.clickAllItem(this.props.cartData.productId)
                        }}>
                        <Text style={{marginTop:15,fontSize:14,color:'#333'}}>{this.props.cartData.name}</Text>
                        <View style={{marginTop:10,width:fullWidth-60,flex:1,paddingBottom:15}}>
                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                <Text style={{color:'#8495A2',fontSize:12}}>规格：{this.props.cartData.specName}</Text>
                                {this.props.editEnable==false&&<Text style={{color:'#B4B9C7',fontSize:13}}>¥{this.props.cartData.productUnitPrice.toFixed(2)}</Text>}
                            </View>
                            <Text style={{color:'#8495A2',fontSize:12,marginTop:10}}>厂家：{this.props.cartData.factory}</Text>
                        </View>
                        {Platform.OS!='ios'&&<View style={{height:this.props.editEnable==true?60:0,width:fullWidth-65,backgroundColor:'#F8F8F8',flexDirection:'row',justifyContent:'space-between'}}>
                            <View style={{marginLeft:15}}>
                                <Text style={{marginTop:10,fontSize:13,color:'#333'}}>¥{this.props.cartData.productUnitPrice.toFixed(2)}</Text>
                                <Text style={{marginTop:10,fontSize:12,color:'#5C6A74'}}>库存：{remainStock}</Text>
                            </View>
                            <View style={{marginTop:15,marginRight:15}}>
                                <NumberInput 
                                value={this.props.cartData.quantity} 
                                increment={this.props.cartData.midPackTotal?this.props.cartData.midPackTotal:1}
                                onChange={(value) => {this.props.changePrdNums(value,this.props.cartData.itemKey) }} 
                                min={this.props.cartData.midPackTotal?this.props.cartData.midPackTotal:1}
                                max={parseInt(remainStock)} />
                            </View>
                        </View>}
                        {Platform.OS=='ios'&&this.props.editEnable==true&&<View style={{height:60,width:fullWidth-65,backgroundColor:'#F8F8F8',flexDirection:'row',justifyContent:'space-between'}}>
                            <View style={{marginLeft:15}}>
                                <Text style={{marginTop:10,fontSize:13,color:'#333'}}>¥{this.props.cartData.productUnitPrice.toFixed(2)}</Text>
                                <Text style={{marginTop:10,fontSize:12,color:'#5C6A74'}}>库存：{remainStock}</Text>
                            </View>
                            <View style={{marginTop:15,marginRight:15}}>
                                <NumberInput 
                                value={this.props.cartData.quantity} 
                                increment={this.props.cartData.midPackTotal?this.props.cartData.midPackTotal:1}
                                onChange={(value) => {this.props.changePrdNums(value,this.props.cartData.itemKey) }} 
                                min={this.props.cartData.midPackTotal?this.props.cartData.midPackTotal:1}
                                max={parseInt(remainStock)} />
                            </View>
                        </View>}
                        <View style={{height:1,backgroundColor:'#f9f9f9',width:SCREENWIDTH-60}}/>
                        <View style={{width:fullWidth-60,flex:1,paddingBottom:10}}>
                            <Text style={{alignSelf:'flex-end',fontSize:13,marginTop:10,color:'#333'}}>共{this.props.cartData.quantity}件<Text style={{color:'#FF6600'}}>   ¥{this.props.cartData.productTotalAmount.toFixed(2)}</Text></Text>
                        </View>
                        <View style={{height:1,backgroundColor:'#f9f9f9',width:SCREENWIDTH}}/>
                        {this.props.cartData.presents.length>0&&<View style={{paddingBottom:10}}>
                            {this.props.cartData.presents.map((present,index)=>{
                                return <View key={'present'+index} style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
                                    <Text style={{color:'#53606A'}}>{present.name}</Text><Text style={{marginRight:13,color:'#53606A'}}>x{present.quantity}</Text>
                                </View>
                            })}
                        </View>}
                    </TouchableOpacity>
                    </View>}
            </View>
        )
    }
}

