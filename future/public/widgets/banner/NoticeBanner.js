import React, { Component } from 'react';
import {
	View,
	Text,
	Animated,
	TouchableOpacity
} from 'react-native';
//一行公告轮播
export default class NoticeBanner extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			opacityAnim: new Animated.Value(1),
			bottomAnim: new Animated.Value(0),
			dataArr: this.props.dataArr.length > 0 ? this.props.dataArr : ["暂无公告"],
			currentNotice: this.props.dataArr[0] == undefined ? '暂无公告' : this.props.dataArr[0],
			currentNoticeIndex: 0,
		};
		// this.dataArr = this.props.dataArr || ["暂无公告"]
		this.timer = null; 
		this.animate = this._animate.bind(this);
	}
	static propTypes = {
		dataArr: React.PropTypes.arrayOf(React.PropTypes.string),
		onPress: React.PropTypes.func,
	}
	static defaultProps = {
		dataArr: [],
		onPress: () => { },
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			dataArr: nextProps.dataArr.length > 0 ? this.props.dataArr : ["暂无公告"],
			currentNotice: nextProps.dataArr[0],
			currentNoticeIndex: 0
		})
	}
	componentDidMount() {
		this.timer = setTimeout(() => { this.animate() }, 3000);
	}
	componentWillUnmount() {
		// 如果存在this.timer，则使用clearTimeout清空。
		// 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
		this.timer && clearTimeout(this.timer);
	}
	/**
	 * 动画
	 *  */
	_animate() {
		if (this.state.dataArr.length <= 1) {
			this.timer && clearTimeout(this.timer);
			return;
		}
		//隐藏
		Animated.parallel([
			Animated.timing(          // Uses easing functions
				this.state.opacityAnim,    // The value to drive
				{
					toValue: 0.1,
					duration: 500
				},           // Configuration
			),
			Animated.timing(          // Uses easing functions
				this.state.bottomAnim,    // The value to drive
				{
					toValue: 10,
					duration: 500
				},           // Configuration
			),
		]).start();
		//设置延迟在隐藏动画结束后设置轮播内容、
		setTimeout(() => {
			this.state.currentNoticeIndex = this.state.currentNoticeIndex + 1;
			if (this.state.currentNoticeIndex >= this.state.dataArr.length || this.state.currentNoticeIndex >= this.props.num) {
				this.setState({
					currentNotice: this.state.dataArr[0],
					currentNoticeIndex: 0
				})
			} else {
				this.setState({
					currentNotice: this.state.dataArr[this.state.currentNoticeIndex],
					currentNoticeIndex: this.state.currentNoticeIndex
				})
			}
			//显示
			Animated.parallel([
				Animated.timing(          // Uses easing functions
					this.state.opacityAnim,    // The value to drive
					{
						toValue: 1,
						duration: 500
					},           // Configuration
				),
				Animated.timing(          // Uses easing functions
					this.state.bottomAnim,    // The value to drive
					{
						toValue: 0,
						duration: 500
					},           // Configuration
				),
			]).start();
		}, 500);
		//开始新一轮轮播
		this.timer = setTimeout(() => { this.animate() }, 3000);
	}
	render() {
		return (
			<Animated.View
				style={[{ bottom: this.state.bottomAnim, opacity: this.state.opacityAnim },this.props.style]}>
				<TouchableOpacity
					onPress={()=>{
						if(this.props.pressActions){
							this.props.pressActions(this.state.currentNotice);
						}
					}}
					activeOpacity={0.7}>
					<Text style={this.props.textStyle} numberOfLines={1}>{this.state.currentNotice}</Text>
				</TouchableOpacity>
			</Animated.View>
		);
	}
}