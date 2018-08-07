/**
 * 未使用,导航栏菜单示例:
 * http://192.168.1.209:8000/pages/viewpage.action?pageId=8423237
 * 2017/03/30
 */
import React, { Component } from 'react';
import {
	View,
	Dimensions,
	TouchableOpacity,
	ScrollView,
	Image,
} from 'react-native';
import Styles from '../../lib/styles/Styles';

export default class FloatMenu extends Component {
	static propTypes = {
		closeMask: React.PropTypes.func,
		itemSelect: React.PropTypes.func,
	}
	render() {
		return (
			<ScrollView style={styles.float} showsVerticalScrollIndicator={false}>
				<TouchableOpacity style={styles.floatT} onPress={() => { this.props.closeMask() }}
					activeOpacity={0.99}>
				</TouchableOpacity>
				<View style={[styles.shangSanJiao, this.props.triangleStyle]}>
					<Image source={require('./res/FloatMenu/011gengduosanjiao.png')} />
				</View>
				{this.props.content}
			</ScrollView>
		)
	}
}

const styles = Styles.create({
	shangSanJiao: {
		// position: 'absolute',
		// top: -4,
		// right: 20,
		// height:4,
		// width: 8,
		width: 0,
		height: 0
	},
	float: {
		position: 'absolute',
		top: '$HEAD_HIGHT',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		bottom: 0,
		// height:screenHeight-64,
		flex: 1,
		width: '$W',
	},
	floatT: {
		position: 'absolute',
		top: 0,
		width: '$W',
		height: '$H - 64'
	},
	btns: {
		height: 49,
		width: '$W',
		paddingLeft: 10,
		backgroundColor: '#fff',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	}
})
