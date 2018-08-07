import React, { Component } from 'react';
import {
	StyleSheet,
	Animated,
	Dimensions,
	TouchableOpacity,
	Platform,
	View,
	BackAndroid
} from 'react-native';
var dimensW = Dimensions.get('window').width;
var dimensH = Dimensions.get('window').height;

export default class CustomMaskBoard extends Component {
	constructor(props){
		super(props);
		this.state = {
			Yposition: new Animated.Value(dimensH),
			fadeInOpacity: new Animated.Value(0),
		}
	}
	static defaultProps = {
		isOverlay				: true,
		isOverlayClickClose		: true
  	}
	static propTypes = {
		isOverlay 				: React.PropTypes.bool, // 是否有遮罩
		isOverlayClickClose 	: React.PropTypes.bool, // 是否点击遮罩关闭弹层
		// modalStyle				: React.PropTypes.any,
		overlayStyle			: React.PropTypes.any
	}
	show = ()=>{
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
		Animated.timing(this.state.Yposition, {
			toValue: 0,
			duration: 200,
		}).start();
	}
	hide = ()=>{
		Animated.timing(this.state.Yposition, {
			toValue: dimensH,
			duration: 1,
		}).start();
		this.props.onHide();
	}

	_onOverlayClick(){
		this.props.isOverlayClickClose && this.hide();
	}

	render(){
		return (
			<Animated.View style={[
					{width:dimensW,height:dimensH,top:this.state.Yposition,position:'absolute'},
					{transform: [{translateY: this.state.Yposition}]},
					this.props.modalStyle,
				]}>
				{
					this.props.isOverlay &&
				<TouchableOpacity
					style={{flex:1,position:'absolute',top:0,left:0,right:0,bottom:0,zIndex:9}}
					activeOpacity={1}
					onPress={()=>{this.props.isOverlayClickClose && this.hide();}} />
				}
				{this.props.children}
			</Animated.View>
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



// <Animated.Modal
// 				style={[styles.modal, {
// 					backgroundColor: this.props.isOverlay ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
// 					transform: [{scale: this.state.scale}]
// 				},this.props.modalStyle]}
// 				visible={this.state.visible}>
// 				{
// 					this.props.isOverlay ? (
// 						<TouchableOpacity
// 							activeOpacity={1}
// 							style={[styles.modal, this.props.overlayStyle]}
// 							onPress={this._onOverlayClick.bind(this)}>
// 							{this.props.children}
// 						</TouchableOpacity>
// 					) : (
// 						this.props.children
// 					)
// 				}
// 			</Animated.Modal>
