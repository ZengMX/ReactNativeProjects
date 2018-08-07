/**
 * BaseView
 * 主要功能：Navbar、网络状态控制、执行耗时操作API、浮层、Toast提示消息、Loading状态
 *    screenStyle                              //屏幕容器样式
 * 		style				               		           //BaseView容器样式
 *		showNavBar				               		     //是否显示导航栏，默认true
 *		leftButton={this.renderLeftButton()}	   //自定义navbar左边按钮,默认后退按钮
 *		rightButton={this.renderRightButton()}	 //自定义navbar右边按钮，默认无
 *		title={{title:'xxx',tintColor:'xxx'}}	   //navbar标题文字和颜色，默认 {title: '导航栏标题',tintColor: '#FFF'}
 *		head={自定义组件}				                  //自定义navbar标题，注意空出左边按钮（如果有）的位置
 *		mainColor				               		       //导航栏颜色，android状态栏颜色
 *		navBarStyle				              		     //导航栏样式，可重写mainColor
 *		modalStyle				             		       //浮层样式
 *		openCheckNetwork={false}					       //是否开启网络检查
 *		reload={() => this.fetchData()}				   //断网后重新加载数据()
 *		onOpen={() => { }}							       	 //页面打开时执行，礼让动画
 *
 *	注：1、RefreshableListView和BaseView默认关闭网络控制
 *		 2、同时使用RefreshableListView和BaseView时注意网络控制开关，不要同时开启网络控制，可通过传递'openCheckNetwork'参数控制是否开启
 */
'use strict';
import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	Alert,
	InteractionManager,
	Animated,
	PanResponder
} from 'react-native';
import Styles from 'future/src/lib/styles/Styles';

import { NavBar, Toast, Loading, PopModal } from 'future/src/widgets';
import _ from 'underscore';
import dismissKeyboard from 'dismissKeyboard';

const NavBarTop = IS_IOS ? 64 : 44 + STATUS_HIGHT;

export default class BaseView extends Component {

	static propTypes = {
		navigator: React.PropTypes.any.isRequired, //Navigator实例
		renderModalScence: React.PropTypes.func,	 //浮层
		head: React.PropTypes.element,	           //自定义navbar
		openCheckNetwork: React.PropTypes.bool,		 //是否需要检查网络
		reload: React.PropTypes.func,		           //重新加载,
		onOpen: React.PropTypes.func,	             //原Page组件onOpen事件移植，页面打开时调用
		showNavBar: React.PropTypes.bool,	         //是否显示NavBar
		dismissKeyboard: React.PropTypes.bool,     //点击非触摸区域收回键盘
	}

	static defaultProps = {
		renderModalScence: () => { return (<View></View>) },
		openCheckNetwork: false,
		reload: () => { },
		onOpen: () => { },
		showNavBar: true,
		screenStyle: {},
		dismissKeyboard: false
	}

	constructor(props) {
		super(props);
		this.state = {
			checkNetwork: true,     // 网络状态 true online,false offline
			showNavBaring: this.props.showNavBar, //当前是否正在显示NavBar
			NavBarY: new Animated.Value(0), //动态隐藏导航栏
		};

		// 当导航动画完成时，执行onOpen
		if (this.props.navigator) {
			this._didFocusSubscription_ = this.props.navigator.navigationContext.addListener('didfocus', _.once(() => {
				this._didFocusSubscription_.remove();
				InteractionManager.runAfterInteractions(() => {
					typeof this.props.onOpen == 'function' && this.props.onOpen();
				});
			}));
		}

	}

	// 点击输入框外自动收回键盘
	componentWillMount() {
		this._panResponder = PanResponder.create({
			onStartShouldSetPanResponder: (evt, gestureState) => {
				return !!this.props.dismissKeyboard && TextInput.State.currentlyFocusedField() != null;
			},
			onStartShouldSetPanResponderCapture: (evt, gestureState) => {
				if (!!this.props.dismissKeyboard && TextInput.State.currentlyFocusedField() != null && evt.target != TextInput.State.currentlyFocusedField()) {
					dismissKeyboard();
				}
				return false;
			},
			onPanResponderRelease: () => {
				dismissKeyboard();
			},
		});
	}

	//根据err控制页面，TODO 未添加延时判断
	controlViewByErr = (err) => {
		this.setState({
			checkNetwork: err.message != "noNetwork"
		})
	}

	//弹出Toast
	showToast = (message) => {
		Toast.show(message);
	}

	//加载动画
	showLoading = ({ title = '载入中...', isOverlay = false } = {}) => {
		Loading.show({
			title, // 标题
			isOverlay, // 是否有遮罩
		});
	}

	//隐藏加载动画
	hideLoading = () => {
		Loading.hide();
	}

	//显示浮层
	showModal = () => {
		this.popModal.show();
	}

	//隐藏浮层
	hideModal = () => {
		this.popModal.hide();
	}

	//弹出浮层上面的Toast
	showModalToast = (message) => {
		this.popModal.Toast(message);
	}

	//alert提示框
	showMessages = (message) => {
		alert(message);
	}

	//选择对话框
	showConfirm = (info) => {
		info = Object.assign({ title: '', content: '', btn: [] }, info);
		for (let i = 0; i < info.btn.length; i++) {
			if (typeof info.btn[i].onPress != 'function' && typeof info.btn[i].callback == 'function') {
				info.btn[i].onPress = info.btn[i].callback;
			}
		}
		Alert.alert(info.title, info.content, [].concat(info.btn));
	}

	// 动态隐藏导航栏 toHide:true隐藏 showNavBaring:true 正在显示
	hideBar(toHide) {
		if (toHide && this.state.showNavBaring) {
			Animated.timing(this.state.NavBarY, {
				toValue: IS_IOS ? -64 : -(44 + STATUS_HIGHT),
				duration: 100
			}).start();
		} else if (!toHide && !this.state.showNavBaring) {
			Animated.timing(this.state.NavBarY, {
				toValue: 0,
				duration: 100
			}).start();
		}
		this.setState({ showNavBaring: !toHide })
	}

	render() {
		let content = (
			<View style={[styles.container, { marginTop: this.state.showNavBaring ? NavBarTop : 0 }, this.props.style]}>
				{this.props.children}
			</View>);
		// 如果检查网络状态开启，渲染前优先判断网络状态
		if (this.props.openCheckNetwork) {
			if (!this.state.checkNetwork) {
				content = (
					<View style={[styles.netView, { marginTop: this.state.showNavBaring ? NavBarTop : 0 }]}>
						<Image source={require('./res/004zanwuwangluo.png')} resizeMode={'contain'} />
						<Text style={styles.netText}>网络不给力，请检查网络后刷新~</Text>
						<TouchableOpacity
							style={styles.netBtn}
							onPress={() => { this.props.reload && this.props.reload() }}
							activeOpacity={0.7}>
							<Text style={styles.netBtnText}>重新加载</Text>
						</TouchableOpacity>
					</View>
				);
			}
		}

		return (
			<View
				style={[{ flex: 1 }, this.props.screenStyle]}
				{...this._panResponder.panHandlers}
			>

				{/* 导航栏 title与this.props.head不要一起用 */}
				{this.props.showNavBar != false &&
					<Animated.View
						ref={navView => this.navView = navView}
						style={[styles.navBarView, { top: this.state.NavBarY }]}>
						<NavBar
							ref='navbar'
							navigator={this.props.navigator}
							mainColor={this.props.mainColor}
							hideLeftBtn={this.props.hideLeftBtn}
							leftButton={this.props.leftButton}
							rightButton={this.props.rightButton}
							title={this.props.title}
							navBarStyle={this.props.navBarStyle}
						>
							{this.props.head}
						</NavBar>
					</Animated.View>}

				{/* 内容 */}
				{content}

				<PopModal
					ref={popModal => this.popModal = popModal}
					containerStyle={[styles.modalView, this.props.modalStyle]}
					contentView={this.props.renderModalScence()} />

			</View >
		)
	}
}

const styles = Styles.create({
	container: {
		width: '$W',
		backgroundColor: "$bColor.main",
		flex: 1,
		marginTop: NavBarTop,
	},
	navBarView: {
		position: 'absolute',
		height: NavBarTop,
		width: '$W'
	},
	netView: {
		height: 400,
		justifyContent: 'center',
		alignItems: 'center',
		width: '$W',
		marginTop: NavBarTop,
	},
	netText: {
		color: '#d8d8d8',
		fontSize: 13,
		marginTop: 22
	},
	netBtn: {
		width: 164,
		height: 41,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 22,
		backgroundColor: "$MAIN_COLOR",
		borderRadius: 5,
		borderWidth: '$BW',
		borderColor: "$bColor.main"
	},
	netBtnText: {
		color: "#fff",
		fontSize: 15
	},
	modalView: {
		justifyContent: 'center',
		alignItems: 'center',
	},
});