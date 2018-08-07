import React, { Component } from 'react';
import {
	StyleSheet,
	Animated,
	Dimensions,
	TouchableOpacity,
	Platform,
	View,
	Text,
	BackAndroid,
	InteractionManager,
	Easing
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Toast, { DURATION } from 'react-native-easy-toast';
var dimensW = Dimensions.get('window').width;
var dimensH = Dimensions.get('window').height;

export default class FlexModal extends Component {

	static defaultProps = {
		isOverlay: true,
		isOverlayClickClose: true,
		animationType: 'fade',
	}
	static propTypes = {
		isOverlay: React.PropTypes.bool, // 是否有遮罩
		isOverlayClickClose: React.PropTypes.bool, // 是否点击遮罩关闭弹层
		modalStyle: React.PropTypes.any,
		overlayStyle: React.PropTypes.any,
		contentView: React.PropTypes.object,	//自定义在modal上的jsx
		animationType: React.PropTypes.string,  // 动画类型(默认'fade')
	}

	constructor(props) {
		super(props);
		this.state = {
			Yposition: new Animated.Value(dimensH),				//y的位置在底部
			Yposition_top: new Animated.Value(-dimensH),			//y的位置在顶部
			animatDefaultZero: new Animated.Value(0),
			animatDefaultOne: new Animated.Value(1),
			hasShow: false,
		}

		this.paramsObj = {};
		this.showActions = () => { };
		this.hideActions = () => { };
		// 若修改扩充动画效果，请在这里配置
		switch (this.props.animationType) {
			// 延迟从底部滑出
			case 'slide':
				// 设置初始属性
				this.paramsObj.defaultTop = this.state.Yposition;
				this.paramsObj.style = { transform: [{ translateY: this.state.Yposition }], backgroundColor: 'transparent', };
				// 设置动画效果
				this.showActions = () => {
					let timing = Animated.timing;
					InteractionManager.runAfterInteractions(() => {
						Animated.parallel([
							timing(this.state.animatDefaultZero, {
								toValue: 1,
								duration: 200,
							}),
							timing(this.state.Yposition, {
								toValue: 0,
								duration: 200,
							}),
						]).start();
					})
				};
				this.hideActions = () => {
					let timing = Animated.timing;
					Animated.parallel([
						timing(this.state.Yposition, {
							toValue: dimensH,
							duration: 200,
						}),
						timing(this.state.animatDefaultZero, {
							toValue: 0,
							duration: 100,
						}),
					]).start();
				};
				break;
			case 'scalePop':
				this.paramsObj.defaultTop = 0;
				this.paramsObj.style = {
					transform: [{
						scale: this.state.animatDefaultZero,
					}]
				}
				this.showActions = () => {
					InteractionManager.runAfterInteractions(() => {
						Animated.spring(this.state.animatDefaultZero, {
							toValue: 1,
							tension: 2, // Slow
							friction: 3,  // Oscillate a lot
						}).start();
					})
				};
				this.hideActions = () => {
					Animated.timing(this.state.animatDefaultZero, {
						toValue: 0,
						duration: 200,
					}).start();
				};
				break;
			case 'scaleFade':
				this.paramsObj.defaultTop = 0;
				this.paramsObj.style = {
					transform: [{
						scale: this.state.animatDefaultZero.interpolate({
							inputRange: [0, 1],
							outputRange: [2, 1],
						}),
					}],
					opacity: this.state.animatDefaultZero,
				}
				this.showActions = () => {
					InteractionManager.runAfterInteractions(() => {
						Animated.timing(this.state.animatDefaultZero, {
							toValue: 1,
							duration: 300,
						}).start();
					})
				};
				this.hideActions = () => {
					Animated.timing(this.state.animatDefaultZero, {
						toValue: 0,
						duration: 200,
					}).start();
				};
				break;
			//从顶部滑下
			case 'slideDown':
				// 设置初始属性
				this.paramsObj.defaultTop = this.state.Yposition_top;
				this.paramsObj.style = { transform: [{ translateY: this.state.Yposition_top }], backgroundColor: 'transparent', };
				// 设置动画效果
				this.showActions = () => {
					let timing = Animated.timing;
					InteractionManager.runAfterInteractions(() => {
						Animated.parallel([
							timing(this.state.animatDefaultZero, {
								toValue: 1,
								duration: 400,
								
							}),
							timing(this.state.Yposition_top, {
								toValue: 0,
								duration: 400,
								easing:Easing.linear,
							}),
						]).start();
					})
				};
				this.hideActions = () => {
					let timing = Animated.timing;
					Animated.parallel([
						timing(this.state.Yposition_top, {
							toValue: -dimensH,
							duration: 200,
						}),
						timing(this.state.animatDefaultZero, {
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
				this.paramsObj.defaultTop = 0;
				this.paramsObj.style = { opacity: this.state.animatDefaultZero, };
				// 设置动画效果
				this.showActions = () => {
					InteractionManager.runAfterInteractions(() => {
						Animated.timing(this.state.animatDefaultZero, {
							toValue: 1,
							duration: 200,
						}).start();
					})
				};
				this.hideActions = () => {
					Animated.timing(this.state.animatDefaultZero, {
						toValue: 0,
						duration: 200,
					}).start();
				};
				break;
		}
	}

	show = () => {
		if (Platform.OS == 'android') {
			global.isShowPopup = true;
			BackAndroid.addEventListener('hardwareBackPress', this.backFunction);
		}
		this.setState({ hasShow: true, });
		this.showActions();
	}
	hide = () => {
		BackAndroid.removeEventListener('hardwareBackPress', this.backFunction);
		this.hideActions();
		InteractionManager.runAfterInteractions(() => {
			this.setState({ hasShow: false, });
		})
		this.props.onHide && this.props.onHide();
		this.props.closeCallBack && this.props.closeCallBack();
	}
	backFunction = () => {
		setTimeout(() => {
			global.isShowPopup = false;
		}, 500);
		this.hide();
		return true;
	}
	_onOverlayClick() {
		this.props.isOverlayClickClose && this.hide();
	}
	Toast = (content) => {
		if (content) {
			this.refs.toast.show(content);
		}
	}
	render() {
		let content = (
			<Animated.View style={[
				{ left: 0, right: 0, bottom: 0, position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5)' },
				{ top: this.paramsObj.defaultTop, },
				this.paramsObj.style,
				this.props.containerStyle]}>
				{
					this.props.isOverlay &&
					<TouchableOpacity
						style={{ flex: 1 }}
						activeOpacity={1}
						onPress={() => { this.props.isOverlayClickClose && this.hide(); } } />
				}
				{this.props.contentView}
				{Platform.OS == 'ios' && <KeyboardSpacer />}
				<Toast ref="toast" position={this.props.position} />
			</Animated.View>
		)

		let returnContent;
		switch (this.props.animationType) {
			case 'slideDown':
			case 'slide':
				returnContent = (
					<Animated.View
						style={[
							{ left: 0, right: 0, bottom: 0, top: 0, position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5)' },
							{ opacity: this.state.animatDefaultZero, },
							this.props.outerStyle,
						]}
						>
						{content}
					</Animated.View>
				)
				break;
			case 'scalePop':
			case 'scaleFade':
			case 'fade':
			default:
				returnContent = content;
				break;
		}

		return this.state.hasShow === true ?
			returnContent : null;
	}
}
