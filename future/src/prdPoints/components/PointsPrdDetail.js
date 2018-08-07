import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  WebView
} from 'react-native';
import { BaseView } from 'future/public/widgets';
import PointsShoppingCart from './PointsShoppingCart';
import config from '../../../public/config';
export default class PointsPrdDetail extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
    }
    _renderRightItemBtn(){
       return(
           <View style={{ flexDirection: "row", bottom: 7 }}>
				{/* 前往购物车 */}
				<TouchableOpacity
					onPress={() => {
						//TODO 类型未传递
                        this.props.navigator.push({
                            component:PointsShoppingCart,
                            params:{
                                
                            }
                        })
					} }
					activeOpacity={0.7}>
					<Image style={{ flexDirection: 'row', justifyContent: 'flex-end' }} source={require('../res/PointsShoppingCart/000jinhuodan.png')}>
						
					</Image>
				</TouchableOpacity>
				{/* 更多 */}
				<TouchableOpacity
					onPress={() => {} }
					activeOpacity={0.7}>
					<Image style={{}} source={require('../res/PointsShoppingCart/000gengduo_70x88.png')}></Image>
				</TouchableOpacity>
			</View>
       ) 
    }
    render(){
		let requestUrl = this.props.params.integralProductId ? (config.host + '/app/integralProductDetail.jsp?integralProductId=' + this.props.params.integralProductId) : 'http://www.baidu.com';
        return(
            <BaseView
                ref='baseview'
                rightButton={this._renderRightItemBtn()}
                title={{ title: '商品详情', tintColor: '#333'}}
                navigator={this.props.navigator}>
                
                <WebView 
                style={{flex:1}}
                automaticallyAdjustContentInsets={false}
                startInLoadingState={true}
                source={{uri: requestUrl}}/>
            </BaseView>
        )
    }
}
