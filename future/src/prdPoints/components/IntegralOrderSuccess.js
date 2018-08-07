import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Fetch } from 'future/public/lib';
import Styles from 'future/public/lib/styles/Styles';
import { BaseView, RefreshableListView } from 'future/public/widgets';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import IntegralOrderDetail from '../../order/components/IntegralOrderDetail';

export default class YourComponentName extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
    }
    componentWillUnmount(){
    }

	//返回首页
	_jumpToHome = () => {
		RCTDeviceEventEmitter.emit('changeTabBarIdx', { idx: 0, goTop: true });
	}
	
	//查看订单 TODO
    _jumpToOrderDetail = () => {
		const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                component: IntegralOrderDetail,
                params: {
					data: {integralOrderId:this.props.params.integralOrderId}
                }
            })
        }
	}

    render(){
        return(
            <BaseView
                ref='baseview'
                title={{ title: '提交成功', tintColor: '#333'}}
                navigator={this.props.navigator}
				statusBarStyle={'default'}>
                <View style={styles.viewWrap}>
					<Image source={require('../res/IntegralOrderSuccess/004chenggon.png')}
						style={styles.successImg} />
					<Text style={styles.text}>恭喜，您已成功提交订单！</Text>
					<View style={styles.btnWrap}>
						<TouchableOpacity style={styles.btn}
							onPress={this._jumpToHome}>
							<Text style={styles.btnText}>返回首页</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.btn}
							onPress={this._jumpToOrderDetail}>
							<Text style={styles.btnText}>查看订单</Text>
						</TouchableOpacity>
					</View>
				</View>
            </BaseView>
        )
    }
}
const styles = Styles.create({
	viewWrap: {
		flex: 1, 
		alignItems: 'center', 
		marginTop: '$IS * 105'
	},
	successImg: {
		width: 110, height: 72
	},
	text: {
		fontSize: 15, color: '#455A64', marginTop: 32
	},
	btnWrap: {
		flexDirection: 'row', marginTop: 20
	},
	btn: {
		width: 85,
		height: 30,
		borderWidth: '$BW',
		borderColor: '#8E939A',
		borderRadius: 3,
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: 7.5
	},
	btnText: {
		fontSize: 14,
		color: '#4a4a4a'
	}
})