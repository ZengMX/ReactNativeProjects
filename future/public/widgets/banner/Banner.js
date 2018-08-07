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

export default class Banner extends Component {
	constructor(props) {
		super(props);//rgba(255,255,255,0.3
		this.dot = this.props.dot == undefined ? <View style={{ backgroundColor: 'rgba(255,255,255,0.3)', width: 8, height: 8, borderRadius: 4, marginLeft: 7, marginRight: 7,borderWidth:1,borderColor:'#8b95b5'}} /> : this.props.dot;
		this.activeDot = this.props.activeDot == undefined ? <View style={{ backgroundColor: '#34457d', width: 8, height: 8, borderRadius: 4, marginLeft: 7, marginRight: 7}} /> : this.props.activeDot;
	}
	static defaultProps = {
		width 	: Dimensions.get('window').width,
		imageWidth: Dimensions.get('window').width,
		isImage : true
  	}
	static propTypes = {
		width 		: React.PropTypes.number, 					// 宽度
		imageWidth  : React.PropTypes.number, 
		height		: React.PropTypes.number.isRequired, 		// 高度，必须
		images		: React.PropTypes.array,					// 图片数组
		onPress		: React.PropTypes.func,						// 图片点击事件，回传图片下标
		imageProps  : React.PropTypes.object,
		renderPagination: React.PropTypes.func,
		dot         : React.PropTypes.element,
		activeDot   : React.PropTypes.element,
		// 其它参数请查阅https://github.com/leecade/react-native-swiper
	}
	_renderRows(images, isImage) {
		if(isImage){
			return images.map((image, index) => {
				return (
					<TouchableOpacity
						activeOpacity={1}
						style={{ width: this.props.width, height: this.props.height,alignItems:'center',backgroundColor:'#fff'}}
						key={'banner_image_' + index}
						onPress={() => {
							this.props.onPress && this.props.onPress(index);
						}
						}>
						{image!=null && image !=undefined && <Image
							style={{ width: this.props.imageWidth, height: this.props.height}}
							source={{ uri: image }} {...this.props.imageProps}/>}
					</TouchableOpacity>
				);
			});
		}else{
			return images;
		}
	}
	render() {
		const {onPress, imageProps, ...swiperProps}  = this.props;
		return (
			<Swiper
				dot={this.dot}
				activeDot={this.activeDot}
				paginationStyle={{
					bottom: 10,
				}}
				renderPagination={this.props.renderPagination ? (index, total, content)=>this.props.renderPagination(index, total, content):undefined}
				index={0}
				autoplay={true}
				{...swiperProps}
				>

				{ this._renderRows(this.props.images, this.props.isImage) }
			</Swiper>
		);
	}
}
