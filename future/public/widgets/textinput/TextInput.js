/*
	封装TextInput避免漏写了以下三个属性

	autoCapitalize='none' 大小写自动切换
	autoCorrect={true}	拼写自动修正
	underlineColorAndroid='transparent' 文本框的下划线颜色
*/
import React,{Component} from 'react';
import ReactNative, {TextInput} from 'react-native';

class _TextInput extends Component {
    static propTypes = {
        ...ReactNative.Text.propTypes
    };

    render() {
		return (
			<TextInput
				 autoCapitalize='none'
				 autoCorrect={true}
				 underlineColorAndroid='transparent'
				 {...this.props}>
				{this.props.children}
			</TextInput>
		)
	}
}

export default _TextInput;
