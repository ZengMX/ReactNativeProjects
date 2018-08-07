'use strict';

/**
 * 可以是用手指滑动的图片画廊，使用react-native-swiper
 * 需要安装依赖包npm i react-native-swiper --save
 *
 * https://github.com/leecade/react-native-swiper
 */
import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	Dimensions,
	TouchableOpacity
} from 'react-native';
import Swiper from 'react-native-swiper';
import SwiperForTab from './SwiperForTab';
var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;

export default class Banner extends Component {
	constructor(props) {
		super(props);
		this.dot = this.props.dot == undefined ? <View style={{ backgroundColor: 'rgba(255,255,255,.3)', width: 10, height: 10, borderRadius: 7, marginLeft: 7, marginRight: 7, }} /> : this.props.dot;
		this.activeDot = this.props.dot == undefined ? <View style={{ backgroundColor: '#fff', width: 10, height: 10, borderRadius: 7, marginLeft: 7, marginRight: 7 }} /> : this.props.activeDot;
	    this.paginationStyle = this.props.paginationStyle == undefined ? {bottom: 10} : this.props.paginationStyle;
    }
	static defaultProps = {
		width: Dimensions.get('window').width
	}
	static propTypes = {
		width: React.PropTypes.number, 								// 宽度
		height: React.PropTypes.number.isRequired, 					// 高度，必须
		images: React.PropTypes.arrayOf(React.PropTypes.string),		// 图片数组
		onPress: React.PropTypes.func,									// 图片点击事件，回传图片下标
		imageProps: React.PropTypes.object,
		imageWidth: React.PropTypes.number,
		imageHeight: React.PropTypes.number
		// 其它参数请查阅https://github.com/leecade/react-native-swiper
	}
	_renderRows(images) {
		return images.map((image, index) => {
			return (
				<TouchableOpacity
					activeOpacity={1}
					style={{ width: this.props.width, height: this.props.height, }}
					key={'banner_image_' + index}
					onPress={() => {
						this.props.onPress && this.props.onPress(index);
					}
					}>
					<View style={{ alignItems: 'center', width: screenWidth, }}>
						{image != null && image != undefined && <Image
							style={{ width: this.props.imageWidth || screenWidth, height: this.props.imageHeight || this.props.height, }}
							source={{ uri: image }} {...this.props.imageProps} />}
					</View>
				</TouchableOpacity>
			);
		});
	}
	render() {
		const {onPress, imageProps, ...swiperProps} = this.props;
		if (this.props && this.props.forTab == true) {
			return (
				<SwiperForTab
					ref='swiper'
					dot={<View style={{ backgroundColor: 'rgba(255,255,255,.3)', width: 10, height: 10, borderRadius: 7, marginLeft: 7, marginRight: 7, }} />}
					activeDot={<View style={{ backgroundColor: '#fff', width: 10, height: 10, borderRadius: 7, marginLeft: 7, marginRight: 7 }} />}
					paginationStyle={{
						bottom: 10,
					}}
					index={0}
					autoplay={true}
					removeClippedSubviews={false}
					{...swiperProps}
					>
					{this._renderRows(this.props.images)}
				</SwiperForTab>
			)
		} else {
			return (
				<Swiper
					ref='swiper'
					dot={this.dot}
					activeDot={this.activeDot}
					paginationStyle={this.paginationStyle}
					index={0}
					autoplay={true}
					removeClippedSubviews={false}
					{...swiperProps}
					>
					{this._renderRows(this.props.images)}
				</Swiper>
			);
		}
	}
}
