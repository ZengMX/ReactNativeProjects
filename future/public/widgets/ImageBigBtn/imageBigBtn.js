
/**
 * Created by timhuo on 2017/5/3.
 */
'use strict';
import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Platform,
	Image,
	findNodeHandle,
} from 'react-native';
import PhotoBrowser from "@imall-test/react-native-photobrowser";

export default class ImageBigBtn extends Component {

	constructor(props) {
		super();
		this.props = props;
		this.showBigImage = this._showBigImage.bind(this);
		this.btnPress = this._btnPress.bind(this);
	}

	_showBigImage(imageList, index, com) {
		// let viewTag = parseFloat(findNodeHandle(com));
		if (Platform.OS == 'android') {
			let locationArray = [];
			let coms = this.props.getComs();
			coms.map((value, i) => {
				value.com.measure((x, y, width, height, locationX, locationY) => {
					locationArray.push(width);/**Image的宽**/
					locationArray.push(height); /**Image的高**/
					locationArray.push(locationX); /**Image左上角的x坐标**/
					locationArray.push(locationY);/**Image左上角的y坐标**/
					if (locationArray.length == (coms.length * 4)) {
						PhotoBrowser.browserWithUrlImages_android({
							locationArray: locationArray, 	/**位置数组**/
							urlArray: imageList, 			/**图片url数组**/
							position: index, 				/**index为图片当前的索引，索引从0开始**/
							rnPageName: null, 				/**是否要在原生嵌入RN页面。要嵌入就填js文件名称，如test.js就填test,在此之前需要生成test.bundle文件(生成bundle操作看下面)，如果不要嵌入RN页面此处填null**/
						});
					}
				});
			});
			
		} else {

			let coms = this.props.getComs();
			let comsTag = coms.map((value, i) => {
				return parseFloat(findNodeHandle(value.com));
			});

			PhotoBrowser.browserWithUrlImages_ios({
				comArray: comsTag,               //（数组）  Component的 reactTag 的数组 （可与 url 数组数量不相等）,不传默认为空数组
				urls: imageList,
				index: index,                    //（Int）   点击的图片index 不传，默认为0
				start: 0,                        //（Int）   参数一的第一个Component 对应的 图片 index  不传，默认为0
			});
		}
	}

	_btnPress(event) {
		this.showBigImage(this.props.urls, this.props.index, this.com)
	}


	render() {
		let sameCom = (
			<TouchableOpacity
				style={this.props.style}
				onPress={this.btnPress}
				activeOpacity={1}
			>
				<Image
					ref={
						(com) => {
							this.com = com
						}
					}
					source={this.props.url}
					style={{ width: this.props.style.width, height: this.props.style.height }} resizeMode={'stretch'}
				/>
			</TouchableOpacity>
		);

		if (this.props.extentCom != null) {
			return (
				<View>
					{sameCom}
					{this.props.extentCom}
				</View>
			)
		} else {
			return sameCom;
		}
	}

	propTypes: {
		url: _react.PropTypes.string.isRequired,
		urls: _react.PropTypes.array.isRequired,
		index: _react.PropTypes.number.isRequired,
		getComs: _react.PropTypes.func,
		extentCom: _react.PropTypes.object,
	}
}
