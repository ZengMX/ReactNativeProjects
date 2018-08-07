import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';

import BaseView from "future/public/widgets/baseView/BaseView"
var fullWidth = require('Dimensions').get('window').width;
export default class FlashSaleProductDetail extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
    }
    componentWillReceiveProps(nextProps){
    }
    renderRightButton(){
        let messageNum = this.props.cartNum;
		let messageNumImg = require('future/src/home/res/home/000shuzibeijing_22x22.png');
		if (messageNum > 0 && messageNum < 10) {
			messageNumImg = require('future/src/home/res/home/000shuzibeijing_22x22.png');
		} else if (messageNum >= 10 && messageNum < 100) {
			messageNumImg = require('future/src/home/res/home/000shuzibeijing_36x22.png');
		} else if (messageNum >= 100) {
			messageNumImg = require('future/src/home/res/home/000shuzibeijing_46x22.png');
		}
		return (
			<View style={{ flexDirection: "row", bottom: 7 }}>
				{/* 前往购物车 */}
				<TouchableOpacity
					onPress={() => {
						//TODO 类型未传递
					} }
					activeOpacity={0.7}>
					<Image style={{ flexDirection: 'row', justifyContent: 'flex-end' }} source={require('future/src/product/res/images/ProductDetail/000jinhuodan.png')}/>
						
				</TouchableOpacity>
				{/* 更多 */}
				<TouchableOpacity
					onPress={() => { this.refs.moreModal.show(); } }
					activeOpacity={0.7}>
					<Image style={{}} source={require('future/src/product/res/images/ProductDetail/000gengduo_70x88.png')}></Image>
				</TouchableOpacity>
			</View>
		)
    }
    render(){
        return(
        <BaseView navigator={this.props.navigator} scrollEnabled={false} ref='base'
                title={{ title: '抢购商品详情', tintColor: '#fff', fontSize: 16 }}
                rightButton={this.renderRightButton()}
             >
            <ScrollView>
                <View style={{backgroundColor:'#fff',width:fullWidth,height:220}}>
                    {/*banner*/}
                </View>
                <View style={{backgroundColor:'#FFD1D1',width:fullWidth,height:40}}>
                    {/*一口价*/}
                </View>
                <View style={{backgroundColor:'#FFF',width:fullWidth,height:100}}>
                    <View style={{width:fullWidth,height:60}}>
                        <Text style={{marginTop:10,marginLeft:10}}>参苏感冒片</Text>
                        <Text style={{marginTop:10,marginLeft:10,fontSize:12,color:'#6E828C'}}>供应商    百洋健康大药房</Text>
                    </View>
                    <View style={{width:fullWidth,height:40}}>
                        <View style={{height:1,backgroundColor:'#FBFAFB',width:fullWidth-20,marginLeft:10}}>
                        </View>
                        <View style={{flexDirection:'row',width:fullWidth-20,justifyContent:'space-between',marginLeft:10}}>
                            <Text style={{color:'#C8C8C8',fontSize:12,marginTop:14}}>类型   OTC乙</Text>
                            <Text style={{color:'#C8C8C8',fontSize:12,marginTop:14}}>已抢   1004</Text>
                            <Text style={{color:'#C8C8C8',fontSize:12,marginTop:14}}>不可拆零</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </BaseView>
        )
    }
}
const styles = StyleSheet.create({
})
