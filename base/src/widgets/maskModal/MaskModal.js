/**
 * 本组件封装React-Native Modal组件
 * 可根据viewType属性控制透明层范围：
 * 	"full"：全屏；"top"：不包括navbar；"tab"：不包括navbar及tab
 * 也可通过containerStyle自定义
 */

import React, { Component } from 'react';
import {

	Text,
	View,
	Modal,
	TouchableOpacity,
	Dimensions,
	Platform,
	Keyboard,
	Animated
} from 'react-native';
import Styles from '../../lib/styles/Styles';



let {height, width} = Dimensions.get('window');

import KeyboardSpacer from 'react-native-keyboard-spacer';
import Toast from './EasyToast';

//以下属性供Loading使用
import RootSiblings from 'react-native-root-siblings';
var Spinner = require('react-native-spinkit');
var base = [
	'CircleFlip',
	'Bounce',
	'Wave',
	'WanderingCubes',
	'Pulse',
	'ChasingDots',
	'ThreeBounce',
	'Circle',
	'9CubeGrid',
	'FadingCircle',
	'FadingCircleAlt'
];

export default class MaskModel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,	//modal是否显示
			isLoading: false,		//是否正在Loading
			loadingVisible: false,	//Loading是否显示
		};
		this.isKeyboardShow = false;	//键盘是否显示
	}
	static PropTypes = {
		contentView: React.PropTypes.object,
		containerStyle: React.PropTypes.object,
		animationType: React.PropTypes.string,
		onRequestClose: React.PropTypes.func,
		transparent: React.PropTypes.bool,
		closeCallback: React.PropTypes.func,	//打开MaskModal时调用
		openCallback: React.PropTypes.func,		//打开MaskModal时调用
	}

	static defaultProps = {
		animationType: 'fade',
		onRequestClose: () => { this._setModalVisible(false) },
		transparent: true,
		closeCallback: () => { },
		openCallback: () => { },
		viewType: "top"
	}

	componentWillMount() {
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
	}

	componentWillUnmount() {
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
	}

	_keyboardDidShow = () => {
		this.isKeyboardShow = true;
	}

	_keyboardDidHide = () => {
		this.isKeyboardShow = false;
	}

	//打开弹层
	show() {
		this._setModalVisible(true);
		this.props.openCallback();
	}

	//关闭弹层
	//TODO 执行完Toast后快速关闭Modal会出现
	/** Warning: setState(...): Can only update a mounted or mounting component. 
	 * This usually means you called setState() on an unmounted component. 
	 * This is a no-op. Please check the code for the Toast component.*/
	async hide() {
		this._setModalVisible(false);
		this.props.closeCallback();
	}

	//优先判断键盘再关闭弹层
	hideByCheckKeyboard() {
		if (this.isKeyboardShow) {
			Keyboard.dismiss();
			return;
		}
		this._setModalVisible(false);
		this.props.closeCallback();
	}

	toast(value) {
		this.refs.toast.show(value);
	}

	//显示Loading
	async showLoading() {
		this.setState({ isLoading: true, loadingVisible: true });
	};

	//隐藏Loading
	hideLoading() {
		this.setState({ isLoading: false });
	};

	_setModalVisible(visible) {
		this.setState({ modalVisible: visible });
	}

	//TODO 不确定Dimensions获取的高是否包含状态栏，先不做平台判断，用64
	render() {
		let top = 0;
		let hig = 0;
		if (this.props.viewType == "full") {
			top = 0;
			hig = height - (Platform.OS == "ios" ? 0 : 20);
		}
		if (this.props.viewType == "top") {
			top = Platform.OS == "ios" ? 64 : 44;
			hig = height - 64;
			// hig = height - (Platform.OS == "ios" ? 64: 44);
		}
		if (this.props.viewType == "tab") {
			top = Platform.OS == "ios" ? 64 : 44;
			hig = height - 64 - 50;
			// hig = height - (Platform.OS == "ios" ? 64: 44) - 50;
		}
		return (
			<Modal animationType={this.props.animationType || 'fade'}
				transparent={this.props.transparent || true}
				visible={this.state.modalVisible}
				onRequestClose={() => { this._setModalVisible(false) } }>
				<View style={{ flex: 1 }}>
					<Text style={style.maskText} onPress={() => { this.hideByCheckKeyboard() } } />
					<View refs="test" style={[styles.container, { top: top, height: hig }, this.props.containerStyle]}>
						<Text style={style.maskText2} onPress={() => { this.hideByCheckKeyboard() } } />
						{this.props.contentView}
					</View>
					{this.viewType == "tab" && <Text style={style.maskText3} onPress={() => { this.hideByCheckKeyboard() } } />}
					{this.state.loadingVisible && <LoadingComponent closeLoading={() => { this.setState({ loadingVisible: false }) } } visible={this.state.isLoading} />}
				</View>
				<Toast ref="toast" />
			</Modal>
		);
	}
}

class LoadingComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			visible: this.props.visible,
			scale: new Animated.Value(0),
		}
	}
	static defaultProps = {
		visible: false,
		isOverlay: true,
		isOverlayClickClose: true,
		title: '载入中...',
		touchBackViewAction: () => { }
	}
	static propTypes = {
		isOverlay: React.PropTypes.bool, // 是否有遮罩
		isOverlayClickClose: React.PropTypes.bool, // 是否点击遮罩关闭弹层
		title: React.PropTypes.string, // 标题
		modalStyle: React.PropTypes.any,
		overlayStyle: React.PropTypes.any,
		touchBackViewAction: React.PropTypes.func,
	}
	componentDidMount() {
		if (this.props.visible) {
			this.show()
		}
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.visible != nextProps.visible) {
			if (nextProps.visible) {
				this.show();
			} else {
				console.log("第一步");
				this.hide();
			}
		}
	}
	show() {
		this.state.scale.setValue(0);
		Animated.spring(this.state.scale, {
			toValue: 1
		}).start();
		this.setState({
			visible: true
		});
	}
	hide() {
		console.log("第二步");
		Animated.timing(this.state.scale, {
			toValue: 0
		}).start(() => {
			console.log("第三步");
			this.setState({
				visible: false
			});
			this.props.closeLoading();
		});
	}
	_onOverlayClick() {
		this.props.isOverlayClickClose && this.hide();
	}

	render() {
		return (
			<Animated.View
				style={[styles.modal, {
					backgroundColor: this.props.isOverlay ? 'rgba(0, 0, 0, 0)' : 'transparent',
					transform: [{ scale: this.state.scale }]
				}, this.props.modalStyle]}
				visible={this.state.visible}>
				{
					this.props.isOverlay && (
						<TouchableOpacity
							activeOpacity={1}
							style={[styles.modal, this.props.overlayStyle]}
							onPress={this._onOverlayClick.bind(this)}>

						</TouchableOpacity>
					)
				}
				<View style={{ flex: 1 }}>
					<TouchableOpacity style={style.loadingBtn}
						onPress={() => this.props.touchBackViewAction()} activeOpacity={1}>
						<View style={style.loadingView}>
							<Spinner size={40} isVisible={true} type={base[7]} color={'#0099cc'} style={{ marginLeft: Platform.OS == 'ios' ? 25 : 30 }} />
							<Text style={style.loadingText}>{this.props.title}</Text>
						</View>
					</TouchableOpacity>
				</View>

			</Animated.View>
		)
	}
}

const styles = Styles.create({
	container: {
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		alignItems: 'center',

	},
	modal: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},
	loadingBtn: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	loadingView: {
		paddingTop: 15,
		width: 100,
		height: 100,
		backgroundColor: 'rgba(23,23,23,0.8)',
		borderRadius: 8
	},
	loadingText: {
		width: 100,
		marginTop: 20,
		color: '#fff',
		textAlign: 'center'
	},
	maskText: {
		position: 'absolute',
		width: '$W',
		height: '$HEAD_HIGHT',
		top: 0
	},
	maskText2: {
		position: 'absolute',
		width: '$W',
		height: '$H',
		top: 0
	},
	maskText3: {
		position: 'absolute',
		width: '$W',
		height: 50,
		bottom: 0
	}
});