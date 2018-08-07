/**
 * 2017/03/31
 * 用新组件取代：
 * http://192.168.1.209:8000/pages/viewpage.action?pageId=8422393
 * 
 * 可以是用手指滑动的图片画廊，使用react-native-swiper
 * 需要安装依赖包npm i react-native-swiper --save
 *
 * https://github.com/leecade/react-native-swiper
 */
'use strict';
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

export default class Banner extends Component {
	constructor(props) {
		super(props);
	}
	static defaultProps = {
		width: Dimensions.get('window').width,
		imageWidth: Dimensions.get('window').width,
	}
	static propTypes = {
		width: React.PropTypes.number, 								// 宽度
		imageWidth: React.PropTypes.number,
		height: React.PropTypes.number.isRequired, 					// 高度，必须
		images: React.PropTypes.arrayOf(React.PropTypes.string),		// 图片数组
		onPress: React.PropTypes.func,									// 图片点击事件，回传图片下标
		imageProps: React.PropTypes.object,
		// 其它参数请查阅https://github.com/leecade/react-native-swiper
	}
	_renderRows(images) {
		return images.map((image, index) => {
			return (
				<TouchableOpacity
					activeOpacity={1}
					style={{ width: this.props.width, height: this.props.height, alignItems: 'center', backgroundColor: '#fff' }}
					key={'banner_image_' + index}
					onPress={() => {
						this.props.onPress && this.props.onPress(index);
					}
					}>
					{image != null && image != undefined && <Image
						style={{ width: this.props.imageWidth, height: this.props.height, resizeMode: "stretch" }}
						source={{ uri: image }} {...this.props.imageProps} />}
				</TouchableOpacity>
			);
		});
	}
	render() {
		const { onPress, imageProps, ...swiperProps } = this.props;
		return (
			<Swiper
				dot={<View style={{ backgroundColor: 'rgba(255,255,255,.3)', width: 10, height: 10, borderRadius: 7, marginLeft: 7, marginRight: 7, }} />}
				activeDot={<View style={{ backgroundColor: '#fff', width: 10, height: 10, borderRadius: 7, marginLeft: 7, marginRight: 7 }} />}
				paginationStyle={{
					bottom: 10,
				}}
				index={0}
				autoplay={true}
				{...swiperProps}
			>

				{this._renderRows(this.props.images)}
			</Swiper>
		);
	}
}
