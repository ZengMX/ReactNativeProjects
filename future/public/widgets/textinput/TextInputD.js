/*
	封装TextInput避免漏写了以下三个属性

	autoCapitalize='none' 大小写自动切换
	autoCorrect={true}	拼写自动修正
	underlineColorAndroid='transparent' 文本框的下划线颜色
	ios和android平台添加输入文本右边清除输入内容的图片
	注意：给TextInput设置大小是要预留20的大小给图片
*/
import React,{Component} from 'react';
import ReactNative, {TextInput,View,Platform,TouchableOpacity,Image} from 'react-native';

class _TextInput extends Component {
	constructor(props) {
        super(props);
        this.state = {
            isOnEdit : false,
        }
    }
    static propTypes = {
        ...ReactNative.Text.propTypes,
    };
    _clearInput(){
		this.refs.txt.clear();
	}
	_onChange(text){//不执行？
		//alert(text);
	}
	_renderInput(){
			return (
					<TextInput
						ref='txt'
						onChangeText={(text)=>this._onChange(text)}
						autoCapitalize='none'
						autoCorrect={true}
						underlineColorAndroid='transparent'
						{...this.props}>
						{this.props.children}
					</TextInput>
			);
	}
    render() {
		const {borderColor,borderWidth} = this.props;
		return (
			<View style={{
					alignItems:'center',
					flexDirection:'row',
					height:this.props.style.height,
					width:this.props.style.width+20,
					borderColor:borderColor==undefined?'#dfdfdf':borderColor,
					borderWidth:borderWidth==undefined?0.5:borderWidth,
					backgroundColor:'#fff'}}>
				{this._renderInput()}
				<TouchableOpacity  onPress={this._clearInput.bind(this)}>
					<Image source={require('./res/004quxiao.png')} style={{width:15,height:15,marginRight:5}}/>
                </TouchableOpacity>
			</View>
		)
	}
}
export default _TextInput;
