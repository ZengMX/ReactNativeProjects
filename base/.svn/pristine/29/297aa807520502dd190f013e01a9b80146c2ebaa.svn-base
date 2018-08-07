/*
	封装TextInput避免漏写了以下三个属性

	autoCapitalize='none' 大小写自动切换
	autoCorrect={true}	拼写自动修正
	underlineColorAndroid='transparent' 文本框的下划线颜色
*/
import React, { Component } from 'react';
import ReactNative, { TextInput } from 'react-native';

class _TextInput extends Component {
	static propTypes = TextInput.propTypes;

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
	}

	render() {
		let {style, ...inputProps} = this.props;
		return (
			<TextInput
				ref='input'
				autoCapitalize='none'
				autoCorrect={true}
				underlineColorAndroid='transparent'
				style={[style, { paddingVertical: 0 }]}
				{...inputProps}>
				{this.props.children}
			</TextInput>
		)
	}
}

export default _TextInput;
