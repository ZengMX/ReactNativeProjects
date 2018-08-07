/**
 * 属性
 * type: 'ver',		// 'ver' 垂直 'hor' 水平
 * width //ver模式宽度或hor模式高度
 * color 颜色
 * style 样式
 */
import React, { Component } from 'react';
import {
	View,
	PixelRatio
} from 'react-native';

export default class Separator extends Component {
	static defaultProps = {
		type: 'ver',				// 'ver' 垂直 'hor' 水平
		width: 1 / PixelRatio.get()	// 宽度或高度
	};
	static propTypes = {
		type: React.PropTypes.oneOf(['ver', 'hor']),
		width: React.PropTypes.number
	}
	render() {
		const { type, color, width, style } = this.props;
		const direction = (type == 'ver' ? { width: width } : { height: width });

		return (
			<View style={[style, direction, { backgroundColor: color }]} />
		)
	}
}
