import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	PixelRatio,
	TouchableOpacity,
	Image,
	Platform,
} from 'react-native';
import {
	Fetch,
} from 'future/public/lib';
import _ from 'underscore';
import { Loading } from 'future/public/widgets';
var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
// import Search from 'future/src/home/components/Search';
export default class GroupMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			result: this.props.result,
			categoryId: this.props.categoryId
		}	
	}
	static propTypes = {
		closeMask: React.PropTypes.func,
		itemSelect: React.PropTypes.func,
	}
	componentWillUnmount() {
		this.timer1 && clearTimeout(this.timer1);
		this.timer && clearTimeout(this.timer);
	}
	_finish() {
		this.timer1 = setTimeout(() => {
			this.props.callback && this.props.callback(this.state.categoryId)
		},100);
		
		this.timer = setTimeout(() => {
			this.props.closeMask && this.props.closeMask();
		},300);
		
	}
	_items(result) {
		return _.map(result, (item, index) => {
			return (
				<TouchableOpacity activeOpacity={0.7} key={"Cate" + index} style={{ marginTop: 10, backgroundColor: this.state.categoryId == item.categoryId ? '#ff8a00' : '#fff', width: 135, height: 35, borderColor: '#ccc', borderRadius: 4, borderWidth: 1 / PixelRatio.get(), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 }}
					onPress={() => {this.setState({ categoryId : item.categoryId });this._finish() } }>
					<Text style={{ fontSize: 12, color: this.state.categoryId == item.categoryId ? '#fff' : '#333' }}>{item.name}</Text>
				</TouchableOpacity>
			)
		})
	}
	render() {
		return (
			<View style={{ width: screenWidth, backgroundColor: '#fff', position: 'absolute', top: 0, }}>
				<View style={styles.shangSanJiao}>
					<Image source={require('../res/images/011gengduosanjiao.png')} style={{ width: 8, height: 4 }} />
				</View>
				<View style={{ width: screenWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', paddingVertical: 10 }}>
					{
						this.state.result == null ? null :
						<TouchableOpacity style={{backgroundColor: this.state.categoryId == null ? '#ff8a00' : '#fff', marginTop: 10, width: 135, height: 35, borderColor: '#ccc', borderRadius: 4, borderWidth: 1 / PixelRatio.get(), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 }}
						onPress={() => {this.setState({ categoryId : null });this._finish() } }>
						<Text style={{fontSize: 12, color: this.state.categoryId == null ? '#fff' : '#333'}}>全部</Text>
					</TouchableOpacity>
					}					
					{this._items(this.state.result)}
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	shangSanJiao: {
		position: 'absolute',
		top: Platform.OS == 'android' ? -2 : -4,
		right: 20,
		height: 4,
		width: 8,
	},
	btns: {
		height: 49,
		width: screenWidth,
		paddingLeft: 10,
		backgroundColor: '#fff',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	}
})
