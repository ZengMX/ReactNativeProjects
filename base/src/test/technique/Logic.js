import React, { Component } from 'react';
import CommonList from 'future/src/test/CommonList';

import ListCountdown from './logic/Countdown/ListCountdown';
import Blank from 'future/src/blank/components/Blank';
import ShowNetInfo from "./logic/ShowNetInfo";
import TextInputTest from "./logic/TextInputTest";
import Timeable from "./logic/Timeable";

const datas = [
	{
		title: '列表倒计时',
		component: ListCountdown
	},
	{
		title: 'Redux的使用',
		component: Blank
	},
	{
		title: '断网提示ShowNetInfo',
		component: ShowNetInfo
	},
	{
		title: '输入处理TextInputTest',
		component: TextInputTest
	},
	{
		title: '倒计时',
		component: Timeable
	},
]

export default class Test extends Component {

	render() {
		return (
			<CommonList
				navigator={this.props.navigator}
				header={'逻辑类'}
				datas={datas}
			/>
		);
	}
}
