import React, { Component } from 'react';
import {
	Image,
	View,
	Text
} from 'react-native';
import _ from 'underscore';
import UtilDateTime from 'future/public/lib/UtilDateTime';
class _Component extends Component {
	constructor(props) {
		super(props);
		this._isMounted = true;

		// this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	componentDidMount() {
		this._isMounted = true;
	}
	componentWillUnmount() {
		this._isMounted = false;
	}
	shouldComponentUpdate(nextProps, nextState) {
		return this._isMounted && !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)
	}

}
export default class Countdown extends _Component {
	constructor(props) {
		super(props);
		this.state = {
			leftSeconds: this.props.leftSeconds || 0,
		};
		//根据leftSeconds计算后的天时分秒
		this.countdown = {
			dayStr: 0,
			hourStr: '00',
			minuteStr: '00',
			secondStr: '00',
		};
		this.tipColor = this.props.tipColor || '#999'; //天时分秒color
		this.tipFontSize = this.props.tipFontSize || 12;
		this.valueColor = this.props.valueColor || '#f00'; //数字color
		this.valueFontSize = this.props.valueFontSize || 12;
	}
	//开启倒计时
	componentDidMount() {
		if (this.props.startChangeTime) {
			this.timer = setInterval(
				() => { this.startChangeTime(); },
				1000
			);
		}
	}
	//关闭倒计时
	componentWillUnmount() {
		this.timer && clearInterval(this.timer);
	}
	//列表中倒计时根据传入的时间值更新
	componentWillReceiveProps(nextProps) {
		if (!this.props.startChangeTime) {
			this.setState({
				leftSeconds: nextProps.leftSeconds
			});
		}
	}

	// 倒计时
	startChangeTime() {
		if (this.state.leftSeconds <= 0 || !_.isNumber(this.state.leftSeconds)) {
			this.timer && clearInterval(this.timer);
			return;
		}
		this.setState({
			leftSeconds: this.state.leftSeconds <= 0 ? 0 : --this.state.leftSeconds
		})
		//父组件要更新一个state才能使父组件其他信息根据倒计时情况变化，非必须
		if (this.props.startChangeTime) {
			this.props.startChangeTime(this.state.leftSeconds)
		}
	}

	render() {
		// type==1 0天00小时23分34秒 type==2 212天 / 9分23秒
		// 下面的null可替换为倒计时结束要显示的内容
		let type = this.props.type || 1;
		this.countdown = UtilDateTime.getLeftTimeString(this.state.leftSeconds);

		return (
			<View>
				{(type == 1 && this.state.leftSeconds > 0 && _.isNumber(this.state.leftSeconds)) ?
					<Text
						text={[{ value: this.countdown.dayStr, style: { fontSize: this.valueFontSize, color: this.valueColor } },
						{ value: "天", style: { fontSize: this.tipFontSize, color: this.tipColor } },
						{ value: this.countdown.hourStr, style: { fontSize: this.valueFontSize, color: this.valueColor } },
						{ value: "时", style: { fontSize: this.tipFontSize, color: this.tipColor } },
						{ value: this.countdown.minuteStr, style: { fontSize: this.valueFontSize, color: this.valueColor } },
						{ value: "分", style: { fontSize: this.tipFontSize, color: this.tipColor } },
						{ value: this.countdown.secondStr, style: { fontSize: this.valueFontSize, color: this.valueColor } },
						{ value: "秒", style: { fontSize: this.tipFontSize, color: this.tipColor } },
						]}></Text> : null
				}
				{(type == 2 && this.countdown.dayStr > 0 && this.state.leftSeconds > 0 && _.isNumber(this.state.leftSeconds)) &&
					<Text
						text={[{ value: this.countdown.dayStr, style: { fontSize: this.valueFontSize, color: this.valueColor } },
						{ value: "天", style: { fontSize: this.tipFontSize, color: this.tipColor } },
						]}></Text>
				}
				{(type == 2 && this.countdown.dayStr == 0 && this.state.leftSeconds > 0 && _.isNumber(this.state.leftSeconds)) ?
					<Text
						text={[
							this.countdown.hourStr != '00' && { value: this.countdown.hourStr, style: { fontSize: this.valueFontSize, color: this.valueColor } },
							this.countdown.hourStr != '00' && { value: "时", style: { fontSize: this.tipFontSize, color: this.tipColor } },
							(this.countdown.hourStr != '00' || this.countdown.minuteStr != '00') && { value: this.countdown.minuteStr, style: { fontSize: this.valueFontSize, color: this.valueColor } },
							(this.countdown.hourStr != '00' || this.countdown.minuteStr != '00') && { value: "分", style: { fontSize: this.tipFontSize, color: this.tipColor } },
							(this.countdown.hourStr != '00' || this.countdown.minuteStr != '00' || this.countdown.secondStr != '00') && { value: this.countdown.secondStr, style: { fontSize: this.valueFontSize, color: this.valueColor } },
							(this.countdown.hourStr != '00' || this.countdown.minuteStr != '00' || this.countdown.secondStr != '00') && { value: "秒", style: { fontSize: this.tipFontSize, color: this.tipColor } },
						]}></Text> : null
				}
			</View>
		);
	}
}