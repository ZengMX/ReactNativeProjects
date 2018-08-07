'use strict';

import React, { Component, PropTypes } from 'react';
import {
	TouchableOpacity,
	View,
	Image,
	TextInput,
	StyleSheet
} from 'react-native';
import ValidateUtil from 'future/src/lib/ValidateUtil';

class NumberInput extends React.Component {
	static propTypes = {
		minusDisabled: React.PropTypes.bool,
		plusDisabled: React.PropTypes.bool,
		showMinus: React.PropTypes.bool,
		showPlus: React.PropTypes.bool,
		showInput: React.PropTypes.bool,
		minusIcon: Image.propTypes.source,
		minusDisabledIcon: Image.propTypes.source,
		plusIcon: Image.propTypes.source,
		plusDisabledIcon: Image.propTypes.source,
		inputProps: React.PropTypes.object,
		style: React.PropTypes.object,
		value: React.PropTypes.number,
		min: React.PropTypes.number,
		max: React.PropTypes.number,
		increment: React.PropTypes.number,
		debounce: React.PropTypes.number,
		onChange: React.PropTypes.func,
		onPlus: React.PropTypes.func,
		onMinus: React.PropTypes.func,
		isCanChange: React.PropTypes.func
	}
	static defaultProps = {
		minusDisabled: false, // 是否禁用减号
		plusDisabled: false, // 是否禁用加号
		showMinus: true, //显示减号
		showInput: true, //显示输入框
		showPlus: true, //显示加号
		minusIcon: require('./img/minus.png'), //减号图片
		minusDisabledIcon: require('./img/minus_d.png'),//减号不可点击图片
		plusIcon: require('./img/plus.png'),//加号图片
		plusDisabledIcon: require('./img/plus_d.png'),//加号不可点击图片
		inputProps: {},	// 输入框属性,同官方TextInput
		style: {},	// 样式
		min: 1,	// 最小值
		max: 999999,	// 最大值
		value: null,		// 默认值
		increment: 1,		// 增量
		debounce: 0,		// 数据改变延迟
		onChange: () => { },	// 监听方法
		onPlus: () => { },	// 监听方法
		onMinus: () => { },	// 监听方法
		isCanChange: () => { return true; } //输入内容是否可变
	}
	constructor(props) {
		super(props);
		this.state = {
			minusDisabled: Number(this.props.value) <= this.props.min || this.props.minusDisabled,
			plusDisabled: Number(this.props.value) >= this.props.max || this.props.plusDisabled,
			// 传入值不可转为整数时取最小值
			value: ValidateUtil.isNumber(this.props.value) ? this.props.value.toString() : this.props.min,
		}
		this.timer = null;
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			minusDisabled: Number(nextProps.value) <= nextProps.min || nextProps.minusDisabled,
			plusDisabled: Number(nextProps.value) >= nextProps.max || nextProps.plusDisabled,
			value: nextProps.value != null ? nextProps.value.toString() : null,
		});
	}

	componentWillUnmount() {
		this.timer && clearTimeout(this.timer);
	}

	// 检查输入值value,无法转换为整数时取当前值或者最小值
	_validate = (value) => {
		try {
			value = parseInt(value, 10)
		} catch (ex) {
			console.log(ex);
			value = this.state.value || this.props.min;
		}
		if (isNaN(value)) value = this.state.value || this.props.min;
		value = (value < this.props.min ? this.props.min : value);
		value = (value > this.props.max ? this.props.max : value);
		return value;
	};

	// 执行数值变化，回调onChange
	_change = (value) => {
		this.setState({
			minusDisabled: value <= this.props.min,
			plusDisabled: value >= this.props.max,
			value: value.toString()
		});

		if (this.props.debounce != 0) {
			this.timer = setTimeout(() => {
				if (value == this.state.value) {
					this.props.onChange && this.props.onChange(value);
				}
			}, this.props.debounce);
		} else {
			this.props.onChange && this.props.onChange(value);
		}
	};

	// 点击加号时触发
	plus = () => {
		if (!this.props.showPlus || this.props.isCanChange() == false) return;
		let value = (!(ValidateUtil.isNumber(this.state.value)) ? this.props.min : parseInt(this.state.value, 10) + this.props.increment);
		value = this._validate(value);
		this._change(value);
		this.props.onPlus && this.props.onPlus(value);
	};

	// 点击减号时触发
	minus = () => {
		if (!this.props.showMinus || this.props.isCanChange() == false) return;
		let value = (!(ValidateUtil.isNumber(this.state.value)) ? this.props.min : parseInt(this.state.value, 10) - this.props.increment);
		value = this._validate(value);
		this._change(value);
		this.props.onMinus && this.props.onMinus(value);
	};

	// 手动输入内容时触发
	onChangeText = (value) => {
		if (!this.props.showInput || this.props.isCanChange() == false) return;
		if (ValidateUtil.isNumber(value)) {
			value = this._validate(value);
		} else {
			// 输入值不能转换成整数的直接返回
			return;
		}
		this._change(value);
	};

	// 失去焦点时触发
	_onBlur = () => {
		if (this.props.isCanChange() == false) return;
		const value = this._validate(this.state.value);
		this.setState({
			minusDisabled: value <= this.props.min,
			plusDisabled: value >= this.props.max,
			value: value.toString()
		});
		this.props.inputProps && this.props.inputProps.onBlur && this.props.inputProps.onBlur();
	};

	render() {
		const minusImage = this.state.minusDisabled ? this.props.minusDisabledIcon : this.props.minusIcon;
		const plusImage = this.state.plusDisabled ? this.props.plusDisabledIcon : this.props.plusIcon;
		return (
			<View style={[{ width: 90, flexDirection: 'row', alignItems: 'center' }, this.props.style, { height: 29 }]}>
				<TouchableOpacity ref='minus' disabled={this.state.minusDisabled} onPress={this.minus}>
					<Image source={minusImage} style={{ width: 29, height: this.props.showMinus ? 29 : 0 }} />
				</TouchableOpacity>
				<TextInput
					ref='input'
					keyboardType='number-pad'
					underlineColorAndroid={'transparent'}
					style={[{ flex: 1, textAlign: 'center', paddingVertical: 0, paddingHorizontal: 0, borderTopWidth: 1, borderBottomWidth: 1 }, { height: this.props.showInput ? 29 : 0 }]} autoCorrect={false}
					blurOnSubmit={true}
					value={this.props.showInput ? this.state.value : ""}
					onChangeText={this.onChangeText}
					onBlur={this._onBlur}
					{...this.props.inputProps} />
				<TouchableOpacity ref='plus' disabled={this.state.plusDisabled} onPress={this.plus}>
					<Image source={plusImage} style={{ width: 29, height: this.props.showPlus ? 29 : 0 }} />
				</TouchableOpacity>
			</View >
		)
	}
}

export default NumberInput;
