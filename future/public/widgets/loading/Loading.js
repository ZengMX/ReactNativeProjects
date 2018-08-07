import React, { Component } from 'react';
import {
	StyleSheet,
	Animated,
	View,
	TouchableOpacity,
	Text,
	Platform
} from 'react-native';
var Spinner = require('react-native-spinkit');
import RootSiblings from 'react-native-root-siblings';

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

class LoadingComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			visible: this.props.visible,
			scale: new Animated.Value(1),
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
							<Spinner size={40} isVisible={true} type={base[7]} color={'#34457D'} style={{ marginLeft: Platform.OS == 'ios' ? 25 : 30 }}/>
							<Text style={{ width: 100, marginTop: 20, color: '#fff', textAlign: 'center' }}>{this.props.title}</Text>
						</View>
					</TouchableOpacity>
				</View>

			</Animated.View>
		)
	}
}

const styles = StyleSheet.create({
	modal: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	}
})


class Loading extends Component {
	static displayName = 'Loading';
	static propTypes = LoadingComponent.propTypes;
	_loading = null;
	static show = (props) => {
		this._loading = new RootSiblings(<LoadingComponent {...props} visible={true}/>);
		return this._loading;
	};
	static hide = (props) => {
		this._loading.update(<LoadingComponent {...props} visible={false}/>);
		this._loading.destroy();
	};
	// show() {
	// 	this._loading.update(<LoadingComponent {...this.props} visible={true} />);
	// }
	// hide() {
	// 	this._loading.update(<LoadingComponent {...this.props} visible={false} />);
	// };
	// componentWillMount、componentWillReceiveProps用于JSX中书写标签
	componentWillMount() {
		this._loading = new RootSiblings(<LoadingComponent {...this.props} visible={false}/>);
	}
	componentWillReceiveProps(nextProps) {
		this._loading.update(<LoadingComponent {...nextProps} />);
	}
	componentWillUnmount() {
		// this._loading.destroy();
	}
	render() {
		return null;
	}
}

export default Loading;