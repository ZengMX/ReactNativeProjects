/**
 * 本组件封装React-Native Modal组件
 * 可根据viewType属性控制透明层范围：
 * 	"full"：全屏；"top"：不包括navbar；"tab"：不包括navbar及tab
 * 也可通过containerStyle自定义
 * 
 * 2017/03/15
 * 修改人：张凯伟
 * 改：动画实现调整，原为Modal自带动画，现改为Modal仅作背景，动画改由Animated实现。
 * 目前实现：
 * 		"fade"：浅进浅出
 * 		"slide"：底部滑动出现
 */

import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Modal,
	TouchableOpacity,
	Dimensions,
	Platform,
	Keyboard,
	Animated
} from 'react-native';
let dimensW = Dimensions.get('window').width;
let dimensH = Dimensions.get('window').height;
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

export default class MaskModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,	//modal是否显示
			isLoading: false,		//是否正在Loading
			loadingVisible: false,	//Loading是否显示

			Yposition: new Animated.Value(dimensH),
			animatDefaultZero: new Animated.Value(0),
			animatDefaultOne: new Animated.Value(1),
		};
		this.isKeyboardShow = false;	//键盘是否显示

		this.paramsObj = {};
		this.showActions = () =>{};
		this.hideActions = () =>{};
		// 若修改扩充动画效果，请在这里配置
		switch(this.props.animationType){
			// 延迟从底部滑出
			case 'slide':
				// 设置初始属性
				// this.paramsObj.defaultTop = this.state.Yposition;
				this.paramsObj.style = { transform:[{translateY:this.state.Yposition}]};
				// 设置动画效果
				this.showActions = () => {
					let timing = Animated.timing;
					Animated.parallel([
						timing(this.state.animatDefaultZero,{
							toValue: 1,
							duration: 200,
						}),
						timing(this.state.Yposition,{
							toValue: 0,
							duration: 200,
						}),
					]).start();
				};
				this.hideActions = () => {
					let timing = Animated.timing;
					Animated.parallel([
						timing(this.state.Yposition,{
							toValue: dimensH,
							duration: 200,
						}),
						timing(this.state.animatDefaultZero,{
							toValue: 0,
							duration: 200,
						}),
					]).start();
				};
				break;
			// 透明渐变
			case 'fade':
			default: // 默认是fade，写在default里面，以免因为输入不存在的animationType而报错
				// 设置初始属性
				// this.paramsObj.defaultTop = 0;
				this.paramsObj.style = { opacity: this.state.animatDefaultZero, };
				// 设置动画效果
				this.showActions = () => {
					Animated.timing(this.state.animatDefaultZero, {
						toValue: 1,
						duration: 200,
					}).start();
				};
				this.hideActions = () => {
					Animated.timing(this.state.animatDefaultZero, {
						toValue: 0,
						duration: 1,
					}).start();
				};
				break;
		}
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
		closeCallback: ()=>{},
		openCallback: ()=>{},
		viewType: "top"
	}

	componentWillMount () {
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
	}

	componentWillUnmount () {
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
		this.showActions();
		this.props.openCallback();
	}

	//关闭弹层
	//TODO 执行完Toast后快速关闭Modal会出现
	/** Warning: setState(...): Can only update a mounted or mounting component. 
	 * This usually means you called setState() on an unmounted component. 
	 * This is a no-op. Please check the code for the Toast component.*/
	async hide() {
		this.hideActions();
		this.props.closeCallback();
		this.timer && clearTimeout(this.timer);
		this.timer = setTimeout(()=>{
			this._setModalVisible(false);
		}, 200);
	}

	//优先判断键盘再关闭弹层
	hideByCheckKeyboard(){
		if(this.isKeyboardShow){
			Keyboard.dismiss();
			return;
		}
		this.hide();
		// this.hideActions();
		// this._setModalVisible(false);
		// this.props.closeCallback();
	}

	toast(value){
		this.refs.toast.show(value);
	}

	//显示Loading
	async showLoading (){
		this.setState({ isLoading : true, loadingVisible : true });
	};

	//隐藏Loading
	hideLoading (){
		this.setState({ isLoading : false });
	};

	_setModalVisible(visible) {
		this.setState({ modalVisible: visible});
	}

	//TODO 不确定Dimensions获取的高是否包含状态栏，先不做平台判断，用64
	render() {
		let top = 0;
		let height = 0;
		if(this.props.viewType == "full"){
			top = 0;
			height = dimensH - (Platform.OS == "ios" ? 0 : 20);
		}
		if(this.props.viewType == "top"){
			top = Platform.OS == "ios" ? 64: 44;
			height = dimensH - 64;
			// height = dimensH - (Platform.OS == "ios" ? 64: 44);
		}
		if(this.props.viewType == "tab"){
			top = Platform.OS == "ios" ? 64: 44;
			height = dimensH - 64 - 50;
			// height = dimensH - (Platform.OS == "ios" ? 64: 44) - 50;
		}
		return (
			<Modal animationType={'none'}
				transparent={this.props.transparent || true}
				visible={this.state.modalVisible}
				onRequestClose={() => {this._setModalVisible(false) } }>
				{/*最外层View，占满屏幕*/}
				<View style={{flex:1}}>
					{/*顶部Text，覆盖导航栏*/}
					<Text style={{ position: 'absolute', width: dimensW, height: Platform.OS == "ios" ? 64 : 44, top: 0, }} onPress={() => { this.hideByCheckKeyboard(); this.props.maskHideCallBack && this.props.maskHideCallBack(); } } />
					{/*内容容器View，根据viewType设置高度，也可用containerStyle设置样式*/}
					<View style={[styles.container, { top: top, height: height, }, this.props.containerStyle]}>
						{/*内容动画容器View，根据animationType设置动画类型*/}
						<Animated.View style={[ { flex:1, width: dimensW,}, this.props.containerStyle2,this.paramsObj.style,]}>
							{/*不可见的遮罩层，用于点击内容外隐藏弹层*/}
							<Text style={{ position: 'absolute', width: dimensW, height: dimensH, top: 0, }} onPress={() => { this.hideByCheckKeyboard(); this.props.maskHideCallBack && this.props.maskHideCallBack(); } } />
							{ //自定义的内容
								this.props.contentView
							}
						</Animated.View>
					</View>
					{/*当viewType为tab时，用Text覆盖底部的Tab，用于点击时隐藏弹层*/}
					{this.viewType == "tab" && <Text style={{ position: 'absolute', width: dimensW, height: 50, bottom: 0 }} onPress={() => { this.hideByCheckKeyboard() } } />}
					{/*加载中动画弹层*/}
					{this.state.loadingVisible && <LoadingComponent closeLoading={()=>{this.setState({loadingVisible : false})}} visible={this.state.isLoading}/>}
				</View>
				{/*Toast弹层*/}
				<Toast ref="toast"/>
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
		Animated.timing(this.state.scale, {
			toValue: 0
		}).start(() => {
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
					<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
						onPress={() => this.props.touchBackViewAction()} activeOpacity={1}>
						<View style={{ paddingTop: 15, width: 100, height: 100, backgroundColor: 'rgba(23,23,23,0.8)', borderRadius: 8 }}>
							<Spinner size={40} isVisible={true} type={base[7]} color={'#0099cc'} style={{ marginLeft: Platform.OS == 'ios' ? 25 : 30 }}/>
							<Text style={{ width: 100, marginTop: 20, color: '#fff', textAlign: 'center' }}>{this.props.title}</Text>
						</View>
					</TouchableOpacity>
				</View>

			</Animated.View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		alignItems:'center',
		
	},
	modal: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	}
});