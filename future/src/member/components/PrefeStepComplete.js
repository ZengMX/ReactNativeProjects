import React, { Component } from 'react';
import {
    Text,
    Image,
    View,
    TouchableOpacity,
} from 'react-native';
import {
    BaseView,
} from 'future/public/widgets';
import Styles from 'future/public/lib/styles/Styles';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

export default class PrefeStepComplete extends Component {
    constructor(props) {
        super(props);	
    }

	//返回首页
	_jumpToHome() {
		RCTDeviceEventEmitter.emit('changeTabBarIdx', { idx: 0, goTop: true });
	}

	_pop = () => {
		if(this.props.navigator) {
			this.props.navigator.pop();
		}
	}

	_renderLeftButton() {
		return (
			<TouchableOpacity style={styles.leftButton}
				onPress={this._pop}>
				<Image source={require('future/public/widgets/nav/img/000famhui.png')}
					style={styles.back} />
			</TouchableOpacity>
		);
	}
    
    render() {
        return (
            <BaseView
				title={{ title: '提交资料', tintColor: '#fff', fontSize: 18 }}
				navigator={this.props.navigator}
				mainColor={'#34457D'}
				statusBarStyle={'light-content'}
				mainBackColor={{ backgroundColor: '#f4f3f3' }}
				leftButton={this._renderLeftButton()} >
				<View style={styles.viewWrap}>
					<Image source={require('../../prdPoints/res/IntegralOrderSuccess/004chenggon.png')}
						style={styles.successImg} />
						<Text style={styles.text}>成功完善资料！</Text>
						<Text style={styles.subText}>请耐心等待平台审核，我们会尽快通知您！</Text>
				</View>
				<View>
					<TouchableOpacity
						activeOpacity={0.5}
						style={styles.btn}
						onPress={this._jumpToHome}>
						<Text style={styles.btnText}>去首页逛逛</Text>
					</TouchableOpacity>
				</View>
			</BaseView>
        );
    }
}

const styles = Styles.create({
	viewWrap: {
		backgroundColor: '#fdfdfd', 
		height: '$IS * 360', 
		justifyContent: 'center', 
		alignItems: 'center'
	},
	successImg: {
		width: 110, height: 72
	},
	text: {
		fontSize: 15, color: '#455A64', marginTop: 32
	},
	subText: {
		fontSize: 12, color: '#999', marginTop: 10
	},
	btn: {
		height: 45,
		borderWidth: '$BW',
		borderColor: '#8E939A',
		borderRadius: 4,
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: 13,
		backgroundColor: '#34457D',
		marginTop: 35
	},
	btnText: {
		fontSize: 16,
		color: '#fff'
	},
	leftButton: {
		width: 39, height: 44, justifyContent: 'center', alignItems: 'center'
	},
	back: {
		width: 9, height: 16
	}
});
