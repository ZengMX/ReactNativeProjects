/**
 * 2017/03/30
 * 用新组件取代：
 * http://192.168.1.209:8000/pages/viewpage.action?pageId=7538357
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

export default class CheckBox extends Component {
	static propTypes = {
		checked: React.PropTypes.bool,
		uncheckedImage: React.PropTypes.number,
		checkedImage: React.PropTypes.number,
		disabled: React.PropTypes.bool,
		onChange: React.PropTypes.func,
		wrapStyle: React.PropTypes.object,
		style: React.PropTypes.any,
	};
	static defaultProps = {
		checked: false,
		uncheckedImage: require('./img/nocheck.png'),
		checkedImage: require('./img/checked.png'),
		disabled: false,
		onChange: () => { },
		wrapStyle: {},
		style: {}
	};
	constructor(props) {
		super(props);
		this.state = {
			checked: this.props.checked,
			disabled: this.props.disabled
		}
		this.onPress = this._onPress.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			checked: nextProps.checked,
			disabled: nextProps.disabled
		});
	}
	_onPress() {
		this.setState({
			checked: !this.state.checked
		});
		this.props.onChange(!this.state.checked);
	}
	render() {
		const source = this.state.checked ? this.props.checkedImage : this.props.uncheckedImage;
		return (
			<TouchableWithoutFeedback disabled={this.state.disabled} onPress={this.onPress} style={[styles.wrap, this.props.wrapStyle]}>
				<Image source={source} style={[styles.checkbox, this.props.style]} />
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	wrap: {
		backgroundColor: 'red'
	},
	checkbox: {
		width: 30,
		height: 85
	}
});
