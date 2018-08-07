/**
 * 2017/03/31
 * 用新组件取代：
 * http://192.168.1.209:8000/pages/viewpage.action?pageId=8422401
 * 属性
 * date   当前被选中的日期  
 * mode enum('date', 'time', 'datetime') 选择器模式
 * minDate 可选的最小日期
 * maxDate 可选的最大日期
 * onDateChange 当用户修改日期或时间时调用此回调函数
 * format 日期格式，参考http://momentjs.cn/
 * 下面仅用于ios
 * height 高度
 * cancelBtnText 左边取消按钮文字
 * confirmBtnText  右边确认按钮文字
 * customStyles { //样式对象
 * 	 datePickerCon:{}, //DatePickerIOS样式容器样式
 *   datePicker:{}, //DatePickerIOS样式
 *   btnCancel:{}, //取消按钮样式
 *   btnTextCancel:{}, //取消文字样式
 *   btnConfirm:{}, //确认按钮样式
 *   btnTextConfirm:{}, //确认文字样式
 * }
 */
'use strict';
import React, { Component } from 'react';
import {
	Text,
	TouchableOpacity,
} from 'react-native';

import { BaseView, DatePicker } from 'future/src/widgets/';

export default class Picker extends Component {

	constructor(props) {
		super(props);
		this.state = {
			date: '2016-05-11',
			time: '20:00',
			datetime: '2016-05-05 20:00'
		};
	}

	_onPressHandle() {
		this.picker.show();
	}
	_onPressHandle1() {
		this.picker1.show();
	}
	_onPressHandle2() {
		this.picker2.show();
	}
	render() {
		return (
			<BaseView
				style={{ justifyContent: 'center', alignItems: 'stretch' }}
				navigator={this.props.navigator}
				title={{ title: '日期选择', tintColor: '#fff' }}
			>
				<TouchableOpacity style={{ marginTop: 20, alignSelf: 'center' }} onPress={this._onPressHandle.bind(this)}>
					<Text>点我显示日期选择 {this.state.date}</Text>
				</TouchableOpacity>
				<DatePicker
					ref={picker => this.picker = picker}
					date={this.state.date}

					mode="date"
					format="YYYY-MM-DD" //时间日期显示时的模式
					minDate="2015-06-01"
					maxDate="2016-06-01"
					onDateChange={(date) => { this.setState({ date: date }); }} //选择好日期后的回调
				/>
				<TouchableOpacity style={{ marginTop: 20, alignSelf: 'center' }} onPress={this._onPressHandle1.bind(this)}>
					<Text>点我显示时间选择 {this.state.time}</Text>
				</TouchableOpacity>

				<DatePicker
					ref={picker => this.picker1 = picker}
					date={this.state.time}
					mode="time"
					format="HH:mm"
					customStyles={{
						datePickerCon: { backgroundColor: '#FFFF00' },
						datePicker: { backgroundColor: '#FF66FF' },
						btnCancel: { backgroundColor: '#00FF00' },
						btnTextCancel: { color: '#0000FF' },
						btnConfirm: { backgroundColor: '#00FF00' },
						btnTextConfirm: { color: '#0000FF' },
					}}
					onDateChange={(time) => { this.setState({ time: time }); }}
				/>
				<TouchableOpacity style={{ marginTop: 20, alignSelf: 'center' }} onPress={this._onPressHandle2.bind(this)}>
					<Text>点我显示 {this.state.datetime}</Text>
				</TouchableOpacity>
				<DatePicker
					ref={picker => this.picker2 = picker}
					date={this.state.datetime}
					mode="datetime"
					format="YYYY-MM-DD HH:mm"
					onDateChange={(datetime) => { this.setState({ datetime: datetime }); }}
				/>
			</BaseView>
		);
	}
};
