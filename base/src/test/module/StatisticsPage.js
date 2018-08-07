/**
 * Created by timhuo on 2017/2/4.
 */
import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Platform,
	TouchableOpacity,
} from 'react-native';
import { BaseView } from 'future/src/widgets';
import Statistics from '@imall-test/react-native-statistics';

export default class StatisticsPage extends Component {
	constructor(props) {
		super(props);
	}


	componentWillMount() {
		Statistics.trackPageBegin("index.jsp");                //进入某个页面
	}

	componentWillUnmount() {
		Statistics.trackPageEnd("index.jsp");                  //离开某个页面
	}


	onBtnPress() {
		Statistics.trackEvent('custom-event-id',               //参数1 自定义事件ID       必选
			'custom-event-lable',                              //参数2 自定义事件标记   可选 ，不选时传null
			{ name: '张三', age: 1, jiehunlema: false }                //参数3 自定义事件参数   可选 ，不选时传null
		);
		console.log('onBtnPress');
	}

	render() {
		return (
			<BaseView navigator={this.props.navigator} ref={base => this.base = base}>
				<TouchableOpacity style={styles.btnStyle} onPress={() => { this.onBtnPress() }} >
					<Text>自定义事件</Text>
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