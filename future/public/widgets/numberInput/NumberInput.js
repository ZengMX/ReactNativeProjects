'use strict';

import React, { Component, PropTypes } from 'react';
import {
	TouchableOpacity,
	View,
	Image,
	TextInput,
	StyleSheet,
	PixelRatio
} from 'react-native';
import {
	ValidateUtil
} from 'future/public/lib';

class NumberInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			minusDisabled: Number(this.props.value) <= this.props.min || this.props.minusDisabled,
			plusDisabled: Number(this.props.value) >= this.props.max || this.props.plusDisabled,
			value: this.props.value != null ? this.props.value.toString() : null,
		}
		this.timer = null;
	}
	static propTypes = {
		minusDisabled 		: React.PropTypes.bool,
		plusDisabled		: React.PropTypes.bool,
		showMinus			: React.PropTypes.bool,
		showPlus			: React.PropTypes.bool,
		showInput			: React.PropTypes.bool,
		minusIcon			: Image.propTypes.source,
		minusDisabledIcon	: Image.propTypes.source,
		plusIcon			: Image.propTypes.source,
		plusDisabledIcon	: Image.propTypes.source,
		inputProps 			: React.PropTypes.object,
		style 				: React.PropTypes.object,
		value 				: React.PropTypes.number,
		min 				: React.PropTypes.number,
		max 				: React.PropTypes.number,
		increment			: React.PropTypes.number,
		debounce			: React.PropTypes.number,
		onChange			: React.PropTypes.func,
		onPlus				: React.PropTypes.func,
		onMinus				: React.PropTypes.func,
		isCanChange			: React.PropTypes.func
	}
	static defaultProps = {
		minusDisabled 		: false, // 是否禁用
		plusDisabled		: false, // 是否禁用
		showMinus			: true, //显示减号
		showInput			: true, //显示输入框
		showPlus			: true, //显示加号
		minusIcon			: require('./img/000jianqu.png'), //减号图片
		minusDisabledIcon	: require('./img/000jianqu_d.png'),//减号不可点击图片
		plusIcon			: require('./img/000tianjia.png'),//加号图片
		plusDisabledIcon	: require('./img/000tianjia_d.png'),//加号不可点击图片
		inputProps 			: {},	// 输入框参数
		style 				: {},	// 样式
		min 				: 1,	// 最小值
		max					: 999999,	// 最大值
		value 				: null,		// 默认值
		increment			: 1,		// 增量
		debounce			: 0,		// 延迟
		onChange			: ()=>{},	// 监听方法
		onPlus				: ()=>{},	// 监听方法
		onMinus				: ()=>{},	// 监听方法
		isCanChange			: ()=>{return true;}
	}
	plus() {
		if (!this.props.showPlus || this.props.isCanChange() == false) return;
		let value = (this.state.value == null ? this.props.min : parseInt(this.state.value, 10) + this.props.increment)
		value = this._validate(value);
		this._change(value);
		this.props.onPlus && this.props.onPlus(value);
	}
	minus() {
		if (!this.props.showMinus || this.props.isCanChange() == false) return;
		let value = (this.state.value == null ? this.props.min : parseInt(this.state.value, 10) - this.props.increment);
		value = this._validate(value);
		this._change(value);
		this.props.onMinus && this.props.onMinus(value);
	}
	onChangeText(value) {
		//value = this._validate(value);
		if (!this.props.showInput || this.props.isCanChange() == false) {
			value = this.state.value;
		}
		if (ValidateUtil.isBlank(value)) {
            value = "";
        } else if (ValidateUtil.isNumberInput(value) && !ValidateUtil.isNumber(value)) {
            //value = "";
        } else if (ValidateUtil.isNumber(value)) {
            value = this._validate(value);
        } else {
            value = "";
        }
		console.log("value",value);
		this.setState({
			minusDisabled: value <= this.props.min,
			plusDisabled: value >= this.props.max,
			value: value.toString()
		});
		if (this.props.debounce != 0) {
			this.timer = setTimeout(() => {
				if (value == this.state.value) this.props.onChange(value);
			}, this.props.debounce);
		} else {
			this.props.onChange(value);
		}
	}
	_onBlur() {
		const value = this._validate(this.state.value);
		if (this.props.isCanChange() == false) {
			return;
		}
		this.setState({
			minusDisabled: value <= this.props.min,
			plusDisabled: value >= this.props.max,
			value: value.toString()
		});
		this.props.inputProps && this.props.inputProps.onBlur && this.props.inputProps.onBlur();
		this.props.onChange(value);
	}
	_change(value) {
		this.setState({
			minusDisabled: value <= this.props.min,
			plusDisabled: value >= this.props.max,
			value: value.toString()
		});
		this.props.onChange(value);
	}
	_validate(value) {
		try {
			value = parseInt(value, 10)
		} catch (ex) {
			console.log(ex)
			value = this.props.min;
		}
		if (isNaN(value)) value = this.props.min;
		value = (value < this.props.min ? this.props.min : value);
		value = (value > this.props.max ? this.props.max : value);
		return value;
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			minusDisabled: Number(nextProps.value) <= nextProps.min || nextProps.minusDisabled,
			plusDisabled: Number(nextProps.value) >= nextProps.max || nextProps.plusDisabled,
			value: nextProps.value != null ? nextProps.value.toString() : null,
		});
	}
	componentWillUnmount() {
		clearTimeout(this.timer);
	}
	render() {
		const minusImage = this.state.minusDisabled ? this.props.minusDisabledIcon : this.props.minusIcon;
		const plusImage = this.state.plusDisabled ? this.props.plusDisabledIcon : this.props.plusIcon;
		return (
			<View style={[{ flexDirection: 'row', justifyContent: 'flex-start', width: 90, }, this.props.style]}>
				<TouchableOpacity ref='minus' disabled={this.state.minusDisabled} onPress={this.minus.bind(this) }>
					<Image source={minusImage} style={{ width: 29, height: this.props.showMinus ? 29 : 0 }} />
				</TouchableOpacity>
				<View style={[{ flex: 1, height: 29, borderColor: "#e5e5e5", borderTopWidth: 1 / PixelRatio.get(), borderBottomWidth: 1 / PixelRatio.get() }, this.props.inputWrapStyle]}>
					<TextInput ref='input'
					keyboardType='numeric'
					underlineColorAndroid={'transparent'}
					style={[{ padding: 0, flex: 1, textAlign: 'center', backgroundColor: "#fff", fontSize: 15, color: "#333333"}, { height: this.props.showInput ? 28 : 0 }]} autoCorrect={false}
					blurOnSubmit={true}
					value={this.props.showInput ? this.state.value : ""}
					onChangeText={this.onChangeText.bind(this) }
					onBlur={this._onBlur.bind(this) }
					{...this.props.inputProps} >
					</TextInput>
				</View>
				<TouchableOpacity ref='plus' disabled={this.state.plusDisabled} onPress={this.plus.bind(this) }>
					<Image source={plusImage} style={{ width: 29, height: this.props.showPlus ? 29 : 0 }} />
				</TouchableOpacity>
			</View>
		)
	}
}

export default NumberInput;
