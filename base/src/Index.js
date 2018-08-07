import React, { Component } from 'react';
import { Linking, DeviceEventEmitter } from 'react-native';
import md5 from 'md5';
import { Fetch } from 'future/src/lib';
// 引入封装的TabBar
import { TabBar } from 'future/src/widgets';
// 引入TabBar要显示页面
import Home from 'future/src/home/components/Home';
import Module from 'future/src/test/Module';
import Technique from 'future/src/test/Technique';
import Official from 'future/src/test/Official';

export default class Index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			focusTime: Date.now(),
		};
	}

	componentDidMount() {
		console.log('演示系统，自动登录');
		new Fetch({
			url: 'app/member/login.json',
			show_error: false,
			data: {
				loginId: 'mytest2',
				userPsw: md5('123456')
			}
		}).dofetch().then((data) => {

		}).catch((error) => {
			console.log('=> catch: ', error);
		});

		// App被唤醒时执行
		Linking.getInitialURL().then(url => {
			if (url) {
				alert('Initial url is: ' + url);
			}
		}).catch(err => alert('An error occurred', err));

		// ios在后台时被唤醒时执行
		if (IS_IOS) {
			Linking.addEventListener('url', (event) => {
				alert('Initial url is: ' + event.url);
			});
		}

	}

	// 配置TabBar中的item
	getTabs() {
		return [
			{
				icon: require('future/src/widgets/tab/img/tab1.png'),
				selectedIcon: require('future/src/widgets/tab/img/tab1_s.png'),
				title: '首页',
				view: <Home navigator={this.props.navigator} focusTime={this.state.focusTime} />
			},
			{
				icon: require('future/src/widgets/tab/img/tab2.png'),
				selectedIcon: require('future/src/widgets/tab/img/tab2_s.png'),
				title: '组件',
				view: <Module navigator={this.props.navigator} focusTime={this.state.focusTime} />
			},
			{
				icon: require('future/src/widgets/tab/img/tab5.png'),
				selectedIcon: require('future/src/widgets/tab/img/tab5_s.png'),
				title: '技巧',
				view: <Technique navigator={this.props.navigator} focusTime={this.state.focusTime} />
			},
			{
				icon: require('future/src/widgets/tab/img/tab4.png'),
				selectedIcon: require('future/src/widgets/tab/img/tab4_s.png'),
				title: '官方',
				view: <Official navigator={this.props.navigator} focusTime={this.state.focusTime} />
			},
		];
	}

	//initialTabIndex 进入APP初始页
	render() {
		return (
			<TabBar
				initialTabIndex={0}
				tabs={this.getTabs()}
				onChangeTab={(index) => {
					this.setState({
						focusTime: Date.now()
					});
				}}
			/>
		);
	}
};
