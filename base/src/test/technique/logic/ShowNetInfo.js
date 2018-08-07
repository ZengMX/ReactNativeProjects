'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
} from 'react-native';
import { BaseView } from 'future/src/widgets';
import md5 from 'md5';
import { Fetch } from 'future/src/lib';

export default class ShowNetInfo extends Component {
	constructor(props) {
		super(props);
	}

	_loginIn = () => {
		new Fetch({
			url: 'app/member/login.json',
			method: "POST",
			data: {
				loginId: 'mytest2',
				userPsw: md5('123456')
			}
		}).dofetch().then((data) => {
			// 网络请求正常时，控制正常显示页面
			this.base.controlViewByErr(data);
		}).catch((error) => {
			console.log('=> catch: ', error);
			// 网络请求异常时，控制显示无网络页面
			this.base.controlViewByErr(error);
		});
	}

	onBtnPress() {
		this._loginIn()
	}

	// openCheckNetwork={true} 需要检查网络
	// reload={() => this._loginIn()} 重新加载回调
	render() {
		return (
			<BaseView
				navigator={this.props.navigator}
				ref={base => this.base = base}
				title={{ title: '断网提示' }}
				openCheckNetwork={true}
				reload={() => this._loginIn()}
			>
				<TouchableOpacity style={styles.btnStyle} onPress={() => { this.onBtnPress() }} >
					<Text>开关网络后点击</Text>
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