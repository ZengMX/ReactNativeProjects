/**
 *  属性
 * 	title: '正在加载',   // 标题
 * 	isOverlay: true,    // 是否有遮罩
 * 	type: 'CubeGrid9',   // 动画类型
 * 	isOverlayClickClose: true, // 有遮罩点击是否关闭
 * 	overlayStyle: {}, //遮罩样式
 * 	modalStyle: {}, //弹层样式
 */
import React, { Component } from 'react';
import {
	StyleSheet,
	Animated,
	View,
	TouchableOpacity,
	Text,
	Platform
} from 'react-native';
import Spinner from 'react-native-spinkit';
import RootSiblings from 'react-native-root-siblings';

const animation = {
	CircleFlip: 'CircleFlip',
	Bounce: 'Bounce',
	Wave: 'Wave',
	WanderingCubes: 'WanderingCubes',
	Pulse: 'Pulse',
	ChasingDots: 'ChasingDots',
	ThreeBounce: 'ThreeBounce',
	Circle: 'Circle',
	CubeGrid9: '9CubeGrid',
	FadingCircle: 'FadingCircle',
	FadingCircleAl: 'FadingCircleAlt'
};

class LoadingComponent extends Component {
	static propTypes = {
		isOverlay: React.PropTypes.bool, // 是否有遮罩
		isOverlayClickClose: React.PropTypes.bool, // 是否点击遮罩关闭弹层
		title: React.PropTypes.string, // 标题
		modalStyle: React.PropTypes.any, //弹层样式
		overlayStyle: React.PropTypes.any, //遮罩样式
	}
	static defaultProps = {
		isOverlay: false,
		isOverlayClickClose: true,
		visible: false,
		title: '载入中...',
		type: 'Circle'
	}
	constructor(props) {
		super(props);
		this.state = {
			isOverlay: this.props.isOverlay,
			visible: this.props.visible,
			scale: new Animated.Value(0),
		}
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
		Animated.spring(this.state.scale, {
			toValue: 1
		}).start();
	}

	hide() {
		Animated.timing(this.state.scale, {
			toValue: 0
		}).start(() => {
			this.state.isOverlay && this.setState({ isOverlay: false });
		});
	}

	onOverlayClick = () => {
		this.props.isOverlayClickClose && this.hide();
	}

	render() {
		return (
			<View style={[styles.modal, this.props.modalStyle]} >
				{
					this.state.isOverlay && (
						<TouchableOpacity
							activeOpacity={1}
							style={[styles.overlay, this.props.overlayStyle]}
							onPress={this.onOverlayClick}>
						</TouchableOpacity>
					)
				}

				<Animated.View style={[styles.container, { transform: [{ scale: this.state.scale }] }]}>
					<Spinner size={40} isVisible={true} type={animation[this.props.type]} color={'#0099cc'} style={{ marginLeft: Platform.OS == 'ios' ? 25 : 30 }} />
					<Text style={{ width: 100, marginTop: 20, color: '#fff', textAlign: 'center' }}>{this.props.title}</Text>
				</Animated.View>

			</View>
		)
	}
}

export default class Loading extends Component {
	static displayName = 'Loading';
	static propTypes = LoadingComponent.propTypes;
	_loading = null;
	static show = (props) => {
		this._loading = new RootSiblings(<LoadingComponent {...props} loading={this._loading} visible={true} />);
	};
	static hide = (props) => {
		this._loading.update(<LoadingComponent {...props} loading={this._loading} visible={false} />);
		this._loading.destroy();
	};

	componentWillMount() {
		this._loading = new RootSiblings(<LoadingComponent {...this.props} visible={false} />);
	}

	componentWillReceiveProps(nextProps) {
		this._loading.update(<LoadingComponent {...nextProps} />);
	}

	render() {
		return null;
	}
}

const styles = StyleSheet.create({
	modal: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		alignItems: 'center',
		justifyContent: 'center',
	},
	overlay: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		backgroundColor: 'rgba(0,0,0,0.2)',
	},
	container: {
		paddingTop: 15,
		width: 100,
		height: 100,
		backgroundColor: 'rgba(23,23,23,0.8)',
		borderRadius: 8,
	}
})