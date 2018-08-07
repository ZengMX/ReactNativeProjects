/**
 * 一个底部Tab示例， 使用react-native-navbar控件
 * 添加依赖
 * npm install react-native-navbar --save
 *
 * API doc:
 * https://github.com/react-native-fellowship/react-native-navbar
 */
'use strict';

import React, { PropTypes, Component } from 'react';
import {
	View,
	// StyleSheet,
	Text,
	Dimensions,
	Platform,
	PixelRatio
} from 'react-native';
import Styles from '../../lib/styles/Styles';
import statusAPI from '@imall-test/react-native-status-android';


/**
 *
    style - (Object, Array) - Style object or array of style objects
    tintColor - (String) - NavigationBar's tint color
    statusBar - (Object):
        style - ('light-content' or 'default') - Style of statusBar
        hidden - (Boolean)
        tintColor - (String) - Status bar tint color
        hideAnimation - ('fade', 'slide', 'none') - Type of statusBar hide animation
        showAnimation - ('fade', 'slide', 'none') - Type of statusBar show animation
    leftButton / rightButton - (Object, React Element) - Either plain object with configuration, or React Element which will be used as a custom left/right button element. Configuration object has following keys:
        title - (String) - Button's title
        tintColor - (String) - Button's text color
        style - (Object, Array) - Style object or array of style objects
        handler - (Function) - onPress function handler
    title - (Object, React Element) - Either plain object with configuration, or React Element which will be used as a custom title element. Configuration object has following keys:
        title - (String) - Button's title
        tintColor - (String) - Title's text color

 */
import NavigationBar from 'react-native-navbar';
import _ from 'underscore';

import BackBtn from './BackBtn';
// import RightNavBtn from './RightNavBtn';

export default class NavBar extends Component {

	static propTypes = {
		...NavigationBar.propTypes,
		navigator: React.PropTypes.object.isRequired,	// 导航控制器
		leftBtnHandler: React.PropTypes.func,
		hideLeftBtn: React.PropTypes.bool
	}
	static defaultProps = {
		mainColor: Styles.theme.MAIN_COLOR,
		title: {
			title: 'Hello NavBar',
			tintColor: '#FFF'
		},
		hideLeftBtn: false
	}
	constructor(props) {
		super(props);
		this.state = {
			navProps: null,
			statusHeight: 0
		}
		this.builderProps = this._builderProps.bind(this);

	}
	componentDidMount() {
		Platform.OS === 'android' && statusAPI.getStatusHeight((res) => {
			this.setState({
				statusHeight: res / PixelRatio.get()
			})
		});
	}

	componentWillReceiveProps(nextProps) {
		if (!_.isEqual(this.props, nextProps)) {
			this.setState({ navProps: this.builderProps(nextProps) });
		}
	}

	_builderProps(vars = {}) {
		let { style, tintColor, statusBar, leftButton, title, ...props } = vars;
		let statusBarStyle = this.props.statusBarStyle || 'default';
		return {
			tintColor: vars.mainColor,
			statusBar: {
				style: statusBarStyle,
				tintColor: vars.mainColor,
				hideAnimation: 'fade',
				showAnimation: 'slide'
			},
			leftButton: vars.hideLeftBtn === true ?
				(
					<View />
				) : (!!leftButton ?
					leftButton
					:
					<BackBtn style={this.props.leftBtnStyle}
						deep={this.props.deep}
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
				Object.assign({}, { title: 'Hello NavBar', tintColor: '#FFF' }, title) :
				(
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
		let { style, tintColor, statusBar, leftButton, title, ...props } = this.props;
		if (this.state.navProps == null) {
			this.state.navProps = this.builderProps(this.props);
		}
		return (
			<NavigationBar {...this.state.navProps} {...props}  style={[{ flex: 1, backgroundColor: this.props.mainColor, }, this.props.style, { height: 44, marginTop: Platform.OS == 'ios' ? 0 : global.STATUS_HIGHT }]}/>
		);
	}
}
