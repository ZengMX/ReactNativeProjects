'use strict';

import React, { PropTypes, } from 'react';
import {
	StyleSheet,
	Text,
	View,
	PixelRatio,
	Image,
	Platform
} from 'react-native';
import _ from 'underscore';


export default class Badge extends React.Component {
	static propTypes = {
		...Text.propTypes,
		textStyle: PropTypes.element,
	};
	constructor(props, context) {
		super(props, context);
		this._handleLayout = this._handleLayout.bind(this);
	}

	state = {
		computedSize: null,
	};

	render() {
		let { computedSize } = this.state;
		let style = {};
		if (!computedSize) {
			style.opacity = 0;
		} else {
			style.width = Math.max(computedSize.height, computedSize.width);
		}
		if (_.isNull(this.props.children) || _.isUndefined(this.props.children)) {
			return null;
		}
		let num = this.props.children;
		let img = require('./img/000shuzibeijing_22x22.png');
		if(num > 0 && num < 10){
			img = require('./img/000shuzibeijing_22x22.png');
		}else if(num >= 10 && num < 100){
			img = require('./img/000shuzibeijing_36x22.png');
		}else if(num > 99){
			img = require('./img/000shuzibeijing_46x22.png');
		}
			{/*<View style={[styles.container, this.props.style, style]}
				onLayout={this._handleLayout}>
				<Text
					numberOfLines={1}
					style={[styles.text, this.props.textStyle, style]}>
					{this.props.children}
				</Text>
			</View>*/}
		
			let badge = null;
			if(Platform.OS=='ios') {
				badge = <View onLayout={this._handleLayout} style={[styles.container, this.props.style, style]}>
					{(num > 0) &&  <Image resizeMode={'contain'} style={{justifyContent: 'center', alignItems: 'center', width:num < 10 ? 20:24, height:18, marginTop: num < 10 ? -4 : -5,marginRight:num < 10 ? -2: -5}} source={img}>
						<Text 
						style={{backgroundColor: 'transparent',  color: "#fff", fontSize: 10, textAlign: "center"}} 
						numberOfLines={1}>{num >= 100 ? "99+" : num}</Text>
					</Image>}
				</View>
			} else {
				badge = <View onLayout={this._handleLayout} style={[this.props.style,style,{top:0,backgroundColor:'transparent',width:16}]}>
					{(num > 0) &&  <View>
						<Image resizeMode={'contain'} style={{position:'absolute', height:10,right:-5 }} source={require('./img/000shuzibeijing_36x22.png')}/>
						<Text 
						style={{backgroundColor: 'transparent',marginTop:-2,  color: "#fff", fontSize: 9, textAlign: "center"}} 
						numberOfLines={1}>{num >= 100 ? "99+" : num}</Text>
					</View>}
				</View>
			}
			
		return badge;
	
		/*return (
			<View style={[styles.container, this.props.style, style]}
				onLayout={this._handleLayout}>
				<Text
					numberOfLines={1}
					style={[styles.text, this.props.textStyle, style]}>
					{this.props.children}
				</Text>
			</View>
		);*/
	}

	_handleLayout(event) {
		let { width, height } = event.nativeEvent.layout;
		let { computedSize } = this.state;
		if (computedSize && computedSize.height === height &&
			computedSize.width === width) {
			return;
		}

		this.setState({
			computedSize: { width, height },
		});

		if (this.props.onLayout) {
			this.props.onLayout(event);
		}
	}
}

let styles = StyleSheet.create({
	container: {
		// backgroundColor: 'red',
		// height: 15,
		// borderWidth: 1 + (1 / PixelRatio.get()),
		// borderColor: '#fefefe',
		// borderRadius: 17 / 2,
		marginTop: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		fontSize: 12,
		textAlign: 'center',
		color: '#fff',
		padding: 0,
		margin: 0,
		borderRadius: 17 / 2,
		overflow: 'hidden',
	},
});
