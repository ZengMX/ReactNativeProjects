/**
 * props:
 *	checked: 是否选中，默认true
 *	uncheckedImage: 没选中时的图片，默认require('./img/nocheck.png')
 *  checkedImage:	选中时的图片，默认require('./img/checked.png')
 *  disabled: 是否禁用，默认false,
 *  onChange: 切换回调
 *  wrapStyle: 外部可点击的样式
 *  style: 图片样式
 */
import React, { Component, PropTypes } from 'react';
import {
	TouchableWithoutFeedback,
	Image,
	StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
	wrap : {
		backgroundColor : 'red'
	},
	checkbox:{
		width : 30,
		height : 85
	}
});

export default class CheckBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			checked: props.checked,
			disabled: props.disabled,
			enable: props.enable,
			disabledImage : props.disabledImage?props.disabledImage:props.uncheckedImage
		}
	}
	static propTypes = {
		checked 		: React.PropTypes.bool,
		uncheckedImage	: React.PropTypes.number,
		checkedImage	: React.PropTypes.number,
		disabled		: React.PropTypes.bool,
		onChange 		: React.PropTypes.func,
		wrapStyle 		: React.PropTypes.object,
		style 			: React.PropTypes.any,
		disabledImage : React.PropTypes.number,
		enable      : React.PropTypes.bool
	};
	static defaultProps = {
		checked: false,
		uncheckedImage: require('./img/nocheck.png'),
		checkedImage: require('./img/checked.png'),
		disabledImage: null,
		disabled: false,
		enable: true,
		onChange: () => { },
		wrapStyle : {},
		style : {}
	}
	componentWillReceiveProps(nextProps){
		this.setState({
			checked : nextProps.checked,
			disabled: nextProps.disabled,
			enable: nextProps.enable,
			disabledImage : nextProps.disabledImage?nextProps.disabledImage:nextProps.uncheckedImage
		});
	}
	_onPress(){
		this.setState({
			checked : !this.state.checked
		});
		this.props.onChange(!this.state.checked);
	}
	render() {
		let source = this.state.checked ? this.props.checkedImage : this.props.uncheckedImage;
		if (this.state.enable===false){
			source = this.state.disabledImage;
		}
		return (
			<TouchableWithoutFeedback disabled={this.state.disabled} onPress={this._onPress.bind(this)} style={[styles.wrap, this.props.wrapStyle]}>
				<Image source={source} style={[styles.checkbox, this.props.style]}/>
			</TouchableWithoutFeedback>
		);
	}
}

