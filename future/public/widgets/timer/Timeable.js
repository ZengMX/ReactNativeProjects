import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	StyleSheet
} from 'react-native';
export default class Timeable extends Component {
	static propTypes = {
		autoStart: React.PropTypes.bool,
		time: React.PropTypes.number,
		callback: React.PropTypes.func,
	};

	static defaultProps = {
		autoStart: true,
		time: 0
	};

	constructor(props) {
		super(props);
		this.defaultStartTime = this.props.time > 0 ? this.props.time / 1000 : 0;
		this.state = {
			day: Math.floor(this.defaultStartTime / (24 * 60 * 60)),
			hour: Math.floor(this.defaultStartTime % (24 * 60 * 60) / (60 * 60)),
			minute: Math.floor(this.defaultStartTime % (24 * 60 * 60) % (60 * 60) / 60),
			second: Math.floor(this.defaultStartTime % (24 * 60 * 60) % (60 * 60) % 60),
		};
		this.deadline = 0;											//记录第一次进来时候的this.props.time值
	}

	componentWillUnmount() {
		this.timer && clearInterval(this.timer);
	}

	runTimeBack(deadline) {
		if (deadline == undefined || deadline == null) { return; }
		this.timer && clearInterval(this.timer);					//清除上一个timer
		deadline = deadline + Date.now();
		this.timer = setInterval(() => {
			let nowTodate = (deadline - Date.now() + 500) / 1000;	//加个500ms修正floor偏差
			let day = Math.floor(nowTodate / (24 * 60 * 60));
			let hour = Math.floor(nowTodate % (24 * 60 * 60) / (60 * 60));
			let minute = Math.floor(nowTodate % (24 * 60 * 60) % (60 * 60) / 60);
			let second = Math.floor(nowTodate % (24 * 60 * 60) % (60 * 60) % 60);
			this.setState({
				day: day,
				hour: hour,
				minute: minute,
				second: second
			});
			if (Math.floor(nowTodate) <= 0) {
				clearInterval(this.timer);
				this.props.callback && this.props.callback();			//回调.倒计时完成
				this.setState({
					day: 0,
					hour: 0,
					minute: 0,
					second: 0
				});
			}
		}, 1000)
	}

	start() {
		if (!this.props.autoStart) {
			this.runTimeBack(this.props.time > 0 ? this.props.time : 0);
		}
	}

	render() {
		if (this.props.time > 0 && this.props.autoStart && this.props.time != this.deadline) {
			this.deadline = this.props.time;
			this.runTimeBack(this.props.time);
		}
		return this.renderSelfStyle(this.state.day, this.state.hour, this.state.minute, this.state.second);
	}
}
