/**
 * Created by timhuo on 2017/2/4.
 * Android 日历无法选择已过去的日期,特意设计  2017/2/27 
 */
import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	processColor,
} from 'react-native';
import Clock from '@imall-test/react-native-clock';
import { BaseView } from 'future/src/widgets';

export default class TimePickPage extends Component {

	_onClock1() {
		Clock.setClock({
			minDate: (new Date(2017, 2, 25, 5, 50, 0, 0)),     //最小时间，不写默认 1970/1/1 00:00:00
			maxDate: (new Date(2017, 2, 25, 15, 50, 0, 0)),     //最大时间，不写默认 2099/12/31 00:00:00
			defaultDate: (new Date(2017, 2, 28, 5, 49, 0, 0)), //默认选中时间，不写默认当前时间
			color: "rgba(78,193,137,1)",                       //颜色，不写默认 blue
			titleDic: { confirm_btn: "完成", cancle_btn: "移除" }, //底部按钮，不写默认 {confirm_btn:"完成",cancle_btn:"移除"};
			block: (date) => {                                   //回调 必写
				console.log(date);
			}
		});
	}

	//设置日历  （参数参考上面）                  
	_onClock2() {
		Clock.setCalendar({
			minDate: (new Date(2017, 2, 25, 5, 50, 0, 0)),
			maxDate: (new Date(2017, 2, 28, 5, 50, 0, 0)),
			defaultDate: (new Date(2017, 2, 26, 5, 50, 0, 0)),
			color: "rgba(78,193,137,1)",
			titleDic: { confirm_btn: "完成", cancle_btn: "移除" },
			block: (date) => {
				alert(date);
				console.log(date);
			}
		});
	}

	//设置日历和时间  （参数参考上面）
	_onClock3() {
		Clock.setCalendarAndClock({
			minDate: (new Date(2017, 2, 25, 5, 50, 0, 0)),
			maxDate: (new Date(2019, 2, 28, 5, 50, 0, 0)),
			defaultDate: (new Date(2017, 2, 28, 5, 50, 0, 0)),
			color: "rgba(78,193,137,1)",
			titleDic: { confirm_btn: "完成", cancle_btn: "移除" },
			block: (date) => {
				alert(date);
				console.log(date);
			}
		});
	}

	//时间选择器  （参数参考上面，特殊已标明）
	_onClock4() {
		Clock.setIntervalCalendarAndClock({
			minDate: (new Date(2017, 2, 25, 5, 50, 0, 0)),
			maxDate: (new Date(2017, 3, 28, 5, 50, 0, 0)),
			defaultStartDate: (new Date(2017, 2, 25, 5, 50, 0, 0)),     //默认选择开始日期，不写默认当前日期
			defaultEndDate: (new Date(2017, 3, 25, 5, 50, 0, 0)),       //默认选择结束日期，不写默认当前日期     （只有2个日期相等，才会起效果）
			color: "rgba(78,193,137,1)",
			titleDic: { confirm_btn: "完成", cancle_btn: "移除" },
			block: (start, end) => {
				console.log(start);
				console.log(end);
			}
		});
	}

	render() {
		return (
			<BaseView navigator={this.props.navigator} ref={base => this.base = base}>
				<TouchableOpacity style={styles.btnStyle} onPress={this._onClock1.bind(this)}>
					<Text>时钟</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.btnStyle} onPress={this._onClock2.bind(this)}>
					<Text>日历</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.btnStyle} onPress={this._onClock3.bind(this)}>
					<Text>时钟和日历</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.btnStyle} onPress={this._onClock4.bind(this)}>
					<Text>时间选择器</Text>
				</TouchableOpacity>
			</BaseView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
		marginTop: 64,
	},
	btnStyle: {
		padding: 20,
		backgroundColor: 'yellow'
	}
});