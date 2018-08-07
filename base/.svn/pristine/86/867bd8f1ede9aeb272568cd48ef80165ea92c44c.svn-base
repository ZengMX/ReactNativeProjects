// 使用严格模式
'use strict';

import React, { Component, PropTypes } from 'react';

// 引入RN组件，最后一个组件后加‘,’，单行不加
import {
	View,
	Text,
	Image,
	TouchableOpacity,
} from 'react-native';

// 引入lib目录组件，最后一个组件后加‘,’，单行不加
import {
	ConvertUtil,
} from 'future/src/lib';

// 引入widgets目录组件，最后一个组件后加‘,’，单行不加
import {
	BaseView,
	RightNavBtn,
	Page,
	DataController,
	NavBar
} from 'future/src/widgets';
// 引入本组件样式
import styles from '../style/Blank';

// 使用redux
import { bindActionCreators } from 'redux';
import * as blankActions from '../actions/Blank';
import { connect } from 'react-redux';


class Blank extends Component {
	// 属性验证
	static propTypes = {

	};
	// 属性默认值
	static defaultProps = {

	};
	// 构造函数
	constructor(props) {
		super(props);
		// 定义 state
		this.state = {
			smiling: false
		};
		// 方法绑定
		this.handleClick1 = this._handleClick1.bind(this);
		this.handleClick2 = this._handleClick2.bind(this);
		this.onOpen = this._onOpen.bind(this);

	}

	// 生命周期方法
	componentWillMount() {

	}
	componentDidMount() {

	}
	componentWillReceiveProps(nextProps) {

	}
	componentWillUnmount() {

	}
	// 获取数据
	_onOpen() {
		this.props.actions.getBlank();
	}
	// 定义组件方法
	_handleClick1() {
		this.props.actions.getBlank();
	}
	_handleClick2() {
		this.props.actions.resetBlank();
	}

	// render函数
	_renderChild() {
		return (
			<View>
				<Text>演示使用redux,打开Remote JS Debugging查看</Text>
				<TouchableOpacity onPress={this.handleClick1} style={styles.button}>
					<Text style={styles.content}>点击加载state</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={this.handleClick2} style={styles.button}>
					<Text style={styles.content}>点击重置state</Text>
				</TouchableOpacity>
			</View>
		);
	}

	render() {

		// 这里处理数据
		return (
			<BaseView
				title={{ title: '目录结构示例', tintColor: '#fff' }}
				navigator={this.props.navigator}
				rightButton={(<RightNavBtn title={'右边按键'} handler={() => { }} />)}
				onOpen={this.onOpen.bind(this)}
			>
				<DataController data={this.props.blank}>
					<View style={styles.container}>
						<Text>后台数据：{this.props.blank.receiverName}</Text>
						{this._renderChild()}
					</View>
				</DataController>
			</BaseView>
		);
	}
}


// 哪些 Redux 全局的 state 是我们组件想要通过 props 获取的？
function mapStateToProps(state) {
	return {
		blank: state.Blank,
	};
}

// 哪些 action 创建函数是我们想要通过 props 获取的？
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(blankActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Blank);