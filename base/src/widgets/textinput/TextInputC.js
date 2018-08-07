/*
	ver		: 1.0.3
	time	: 2017年01月11日17:33:24
	author	: 甘四春


	封装TextInput避免漏写了以下三个属性

	autoCapitalize='none' 大小写自动切换
	autoCorrect={true}	拼写自动修正
	underlineColorAndroid='transparent' 文本框的下划线颜色

	props:
		clearButtonMode : //扩展官方属性，给予同IOS完全一致的清除按钮效果

		valueType : //数据类型
			default : 默认，不做任何处理
			phone : 手机号，自动格式化
			bank-card : 银行卡，自动格式化

		keyboardType : //键盘类型，当设置valueType为非default时，本参数具备的输入类型验证自动失效
			number-pad : 纯数字，自动限制输入数据
			numeric : 带小数点的数字键盘，自动限制输入数据

			... 其它键盘类型未做控制

*/
import React, { Component } from 'react';
// import Component from 'future/src/Component';
import ReactNative, { StyleSheet, TextInput, View, Platform, TouchableOpacity, Image } from 'react-native';
import _ from 'underscore';

class _TextInput extends Component {
	static propTypes = {
		valueType: React.PropTypes.oneOf(['default', 'phone', 'bank-card']),
		...ReactNative.Text.propTypes
	}
	static defaultProps = {
		valueType: 'default',
		height: 30
	}
	constructor(props) {
		super(props);
		this.state = {
			isOnEdit: _.isString(this.props.value) && this.props.value.length > 0,
			isFocus: false,
			value: this.props.value || ''
		}
		this.oldValue = _.isString(this.props.value) ? this.props.value : '';
		this.propsStyle = Object.assign({}, StyleSheet.flatten(this.props.style));
		this.onChangeText = this._onChangeText.bind(this);
		this.timer = null;
		this.inputKeys = [
			'color',
			'fontFamily',
			'fontSize',
			'fontStyle',
			'fontWeight',
			'lineHeight',
			'textAlign',
			'textAlignVertical',
			'letterSpacing',
			'textDecorationColor',
			'textDecorationLine',
			'textDecorationStyle',
			'writingDirection',
			'placeholder',
			'height'
		];
	}
	componentWillReceiveProps(nextProps) {
		// 如果传入新的搜索参数，列表重置刷新
		if (!_.isEqual(this.props.style, nextProps.style)) {
			this.propsStyle = Object.assign({}, StyleSheet.flatten(nextProps.style));
		}
		if (!_.isEqual(this.props.value, nextProps.value) && _.isString(nextProps.value)) {
			this.oldValue = nextProps.value;
		}
	}
	componentWillUnmount() {
		this.timer && clearTimeout(this.timer);
	}
	focus() {
		this.refs.input.focus();
	}
	blur() {
		this.refs.input.blur();
	}
	isFocused() {
		return this.refs.input.isFocused();
	}
	clear() {
		this.refs.input.clear();
		Platform.OS == 'android' && this.onChangeText('');
	}
	_clearInput() {
		this.refs.input.clear();
		this.setState({
			isOnEdit: false,
		});
		Platform.OS == 'android' && this.onChangeText('');
	}
	_onChangeText(text) {
		if (_.isString(text) && text.length > 0) {
			if (this.props.valueType != 'default') {
				if (this.props.valueType == 'phone') {
					if (!/^[0-9\s]*$/.test(text)) {
						text = this.oldValue;
					}
					text = text.replace(/\s/g, '').substring(0, 11).replace(/(\d{3})(?=\d)(\d{4})?(?=\d)(\d{4})?/g, "$1 $2 $3");
				} else if (this.props.valueType == 'bank-card') {
					if (!/^[0-9\s]*$/.test(text)) {
						text = this.oldValue;
					}
					text = text.replace(/\s/g, '').substring(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");
				}
			} else if (!_.isUndefined(this.props.keyboardType)) {
				if (this.props.keyboardType == 'number-pad') {
					if (!/^[0-9]*$/.test(text)) {
						text = this.oldValue;
					}
				} else if (this.props.keyboardType == 'numeric') {
					if (!/^[\.0-9]*$/.test(text)) {
						text = this.oldValue;
					}
				}
			}
		}
		this.setState({
			isOnEdit: _.isString(text) && text.length > 0
		});
		(typeof this.props.onChangeText === 'function') && this.props.onChangeText(text);
	}
	_renderClearBtn() {
		if (Platform.OS != 'android') {

			return null;
		}
		/*const cleanBtn = (
			<TouchableOpacity onPress={this._clearInput.bind(this)}
				hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}
			>
				<Image source={require('./res/004quxiao.png')} style={{ width: 15, height: 15, marginRight: 8, }} resizeMode='stretch' />
			</TouchableOpacity >
		);*/
		let cleanBtn = (
			<TouchableOpacity onPress={this._clearInput.bind(this)}
				hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}
				style={{ position: 'absolute', right: 8, top: (this.propsStyle.height - 15) / 2, backgroundColor: '#fff' }}
			>
				<Image source={require('./res/004quxiao.png')}
					style={{ width: 15, height: 15 }}
					resizeMode='stretch' />
			</TouchableOpacity >);
		return cleanBtn;
		// if (this.props.clearButtonMode == 'while-editing' && this.state.isFocus === true && this.state.isOnEdit) {
		// 	return cleanBtn;
		// } else if (this.props.clearButtonMode == 'unless-editing' && this.state.isFocus === false && this.state.isOnEdit) {
		// 	return cleanBtn;
		// } else if (this.props.clearButtonMode == 'always') {
		// 	return cleanBtn;
		// }
	}
	_renderInput() {
		let { style, onChangeText, ...inputProps } = this.props;
		let intputStyle = { flex: 1, padding: 0, marginRight: Platform.OS == 'android' ? 25 : 0 };
		_.each(this.inputKeys, (item) => {
			if (this.propsStyle[item] != undefined) {
				intputStyle[item] = this.propsStyle[item];
			}
		});
		return (
			<TextInput
				ref='input'
				numberOfLines={1}
				autoCapitalize='none'
				autoCorrect={true}
				underlineColorAndroid='transparent'
				style={intputStyle}
				{...inputProps}
				onChangeText={(text) => this.onChangeText(text)}
				onFocus={() => {
					this.timer && clearTimeout(this.timer);
					this.setState({ isFocus: true });
					(typeof this.props.onFocus === 'function') && this.props.onFocus();
				}}
				onBlur={() => {
					this.timer && clearTimeout(this.timer);
					this.timer = setTimeout(() => {
						this.setState({ isFocus: false });
					}, 350);
					(typeof this.props.onBlur === 'function') && this.props.onBlur();
				}}
			/>
		)

	}
	render() {
		let { color, fontFamily, fontSize, fontStyle, fontWeight, lineHeight, textAlign, textAlignVertical,
			letterSpacing, textDecorationColor, textDecorationLine, textDecorationStyle, writingDirection, placeholder
			, ...viewStyle } = this.propsStyle;
		return (
			<View style={[viewStyle, {}]} >
				{this._renderInput()}
				{this._renderClearBtn()}
			</View>
		)
	}
}

export default _TextInput;
