/**
 *  导航栏
 *  依赖https://github.com/react-native-fellowship/react-native-navbar
 *  android 
 * 	containerStyle - (Object) - 导航栏样式，含状态栏，背景色会被tintColor重写
 * 	style - (Object, Array) - 导航栏样式，不含状态栏
 * 	tintColor - (String) - 导航栏背景颜色，含状态栏，IOS状态栏颜色会被statusBar.tintColor重写
 * 
 *  状态栏仅用于IOS
 * 	statusBar - (Object): 
 * 			style - ('light-content' or 'default') - 样式
 * 			hidden - (Boolean)	是否显示
 * 			tintColor - (String) - 背景颜色
 * 			hideAnimation - ('fade', 'slide', 'none') - Type of statusBar hide animation
 * 			showAnimation - ('fade', 'slide', 'none') - Type of statusBar show animation
 * 
 *  左右按钮封装的全是组件，这里的属性没用上
 * 	leftButton / rightButton - (Object, React Element) - Either plain object with configuration, or React Element which will be used as a custom left/right button element. Configuration object has following keys:
 * 			title - (String) - Button's title
 * 			tintColor - (String) - Button's text color
 * 			style - (Object, Array) - Style object or array of style objects
 * 			handler - (Function) - onPress function handler
 * 			disabled - (Boolean) - If true, disable interactions for this button.
 * 			accessible - (Boolean) - Indicates that the view is an accessibility element
 * 			accessibilityLabel - (String, React Element) - Overrides the text that's read by the screen reader for the button.
 * 	
 *  中间标题，自定义组件时属性用不上，注意空出左边按钮位置
 *  title - (Object, React Element) - Either plain object with configuration, or React Element which will be used as a custom title element. Configuration object has following keys:
 * 			title - (String) - 中间标题
 * 			style - (Object, Array, Number) - 中间标题样式，字体颜色会被tintColor重写
 * 			tintColor - (String) - 中间标颜色
 */
'use strict';

import React, { PropTypes, Component } from 'react';
import {
	View,
	Text,

} from 'react-native';

import Styles from 'future/src/lib/styles/Styles';
// android获取状态栏高度，实际使用的是全局变量里获取的高度，待改进
import NavigationBar from 'react-native-navbar';
import _ from 'underscore';
// 自定义左边后退按钮
import BackBtn from './BackBtn';

export default class NavBar extends Component {

	static propTypes = {
		...NavigationBar.propTypes,
		navigator: React.PropTypes.object.isRequired,	// Navigator实例，必要属性
		leftBtnHandler: React.PropTypes.func,
		hideLeftBtn: React.PropTypes.bool
	}
	static defaultProps = {
		mainColor: Styles.theme.MAIN_COLOR, // 设置导航栏默认颜色
		title: {
			title: '导航栏标题',
			tintColor: '#FFF'
		},
		hideLeftBtn: false
	}
	constructor(props) {
		super(props);
		this.state = {
			navProps: null,

		}
		this.builderProps = this._builderProps.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (!_.isEqual(this.props, nextProps)) {
			this.setState({ navProps: this.builderProps(nextProps) });
		}
	}

	_builderProps(vars = {}) {
		let { style, tintColor, statusBar, leftButton, title, ...props } = vars;
		// 参考页头说明查看。注：右边按钮要在外部调用进定义，不定义不显示
		return {
			tintColor: vars.mainColor,  //android状态栏颜色 实际是整个导航栏包含状态栏颜色，IOS状态栏颜色会被重写
			statusBar: {
				style: 'light-content',
				tintColor: vars.mainColor,  //ios状态栏颜色 
				hideAnimation: 'fade',
				showAnimation: 'slide',
			},
			leftButton: vars.hideLeftBtn === true ?
				(
					<View />
				) : (!!leftButton ?
					leftButton
					:
					<BackBtn
						handler={() => {
							if (typeof vars.leftBtnHandler == 'function') {
								vars.leftBtnHandler();
							} else {
								vars.navigator.pop();
							}
						}}
					/>
				),
			title: !vars.children ?
				title :
				( //自定义title
					<View style={{
						height: 44 - (7 * 2),
						flexDirection: "row",
						alignItems: 'center',
					}}>
						{vars.children}
					</View>
				)
		}
	}


	render() {
		let { navBarStyle, tintColor, statusBar, leftButton, title, ...props } = this.props;
		if (this.state.navProps == null) {
			this.state.navProps = this.builderProps(this.props);
		}
		return (
			<NavigationBar
				{...this.state.navProps}
				{...props}
				style={[{ backgroundColor: this.props.mainColor }, this.props.navBarStyle, { marginTop: IS_IOS ? 0 : STATUS_HIGHT }]}
			/>
		);
	}
}
