import React, { Component } from 'react';
import {
	StyleSheet,
	Animated,
	TouchableOpacity,
	Platform,
	BackAndroid,
	Modal
} from 'react-native';

const MyModal = Animated.createAnimatedComponent(Modal);


export default class ScalePopupView extends Component {
	constructor(props){
		super(props);
		this.state = {
			visible: false,
			scale: new Animated.Value(0),
		}
	}
	static defaultProps = {
		isOverlay				: true,
		isOverlayClickClose		: true
  	}
	static propTypes = {
		isOverlay 				: React.PropTypes.bool, // 是否有遮罩
		isOverlayClickClose 	: React.PropTypes.bool, // 是否点击遮罩关闭弹层
		modalStyle				: React.PropTypes.any,
		overlayStyle			: React.PropTypes.any
	}
	show() {
		if(Platform.OS == 'android') {
			global.isShowPopup = true;
			this.backListener = BackAndroid.addEventListener('hardwareBackPress', () => {
				setTimeout(()=>{
					global.isShowPopup = false;
				}, 500);
				this.hide();
				BackAndroid.removeEventListener('hardwareBackPress', this.backListener);
				return true;
			});
		}
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
		});
	}
	_onOverlayClick(){
		this.props.isOverlayClickClose && this.hide();
	}
	render(){
		return (
			this.state.visible ?
				<Animated.View
					style={[styles.modal, {
						backgroundColor: this.props.isOverlay ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
						transform: [{scale: this.state.scale}]
					},this.props.modalStyle]}	
					>
					{
						this.props.isOverlay && (
							<TouchableOpacity
								activeOpacity={1}
								style={[styles.modal, this.props.overlayStyle]}
								onPress={this._onOverlayClick.bind(this)}>
	
							</TouchableOpacity>
						)
					}
					{this.props.children}
	
				</Animated.View>:null			
		)
	}
}

const styles = StyleSheet.create({
	modal:{
		position:'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	}
})
