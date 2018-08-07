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
		Clock.setClock((date) => {
			console.log('时钟==>',date.getHours(),':',date.getMinutes());
		});
	}

	_onClock2() {
		Clock.setCalendarWithColor('#77dd6b',(date) => {
			console.log('日历==>',date.getFullYear(),'-',date.getMonth()+1,'-',date.getDate());
		});
	}

	_onClock3() {
		// processColor("#ff0000")
		Clock.setCalendarAndClockWithColor("#ff0000", (date) => {
			console.log(date);
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