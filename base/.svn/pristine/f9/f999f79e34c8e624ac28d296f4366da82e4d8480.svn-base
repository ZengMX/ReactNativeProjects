/**
 *
 * 倒计时组件使用说明：
 * 	需要先继承Timeable组件，自定义组件的样式。
 * 自定义的倒计时组件属性：
 *	autoStart    			设置是否自动开始倒计时，默认为true，
 * 							在开启自动倒计时的情况下，setState可以重置倒计时时间，但是setState的值和上一次传入的值一样，则无效
 * 	time  					倒计时的总时间，单位毫秒，默认0，（初始显示的时间）
 *	callback 				倒计时完成时的回调函数
 */


import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	StyleSheet,
	TouchableOpacity
} from 'react-native';

// import Timeable from './Timeable';
import { BaseView, Timeable } from 'future/src/widgets';

class TimeBack extends Timeable {
	constructor(props) {
		super(props);
		console.log('test', this.props);
	}

	formatTime(num) {
		if (num < 10) {
			return '0' + num;
		} else {
			return num.toString();
		}
	}

	renderSelfStyle(day, hour, minute, second) {
		return (
			<View>
				<Text style={{ color: 'red' }}>{this.formatTime(day)}</Text>
				<Text style={{ color: 'green' }}>{this.formatTime(hour)}</Text>
				<Text style={{ color: 'blue' }}>{this.formatTime(minute)}</Text>
				<Text style={{ color: 'black' }}>{this.formatTime(second)}</Text>
			</View>
		)
	}
}

export default class Index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			time: 46523851000,
			end: ''
		}
	}

	render() {
		return (
			<BaseView
				navigator={this.props.navigator}
				title={{ title: '自定义样式倒计时', tintColor: '#fff', fontSize: 16 }}
			>

				<TimeBack
					ref='time'
					autoStart={false}
					time={this.state.time}
					callback={() => {
						this.setState({ end: 'end~~~~~~' })
					}}
				/>

				<TouchableOpacity onPress={() => {
					this.setState({ time: 9000 });
				}}>
					<Text>自动开始(请求后台数据返回自动开始)</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={() => {
					this.refs.time.start();
				}}>
					<Text>点我手动开始</Text>
				</TouchableOpacity>
				<Text>{this.state.end}</Text>
			</BaseView>
		)
	}
}
