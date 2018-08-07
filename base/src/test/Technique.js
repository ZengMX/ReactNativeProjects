import React, { Component } from 'react';
import CommonList from 'future/src/test/CommonList';

import Widgets from './technique/Widgets';
import Layout from './technique/Layout';
import Logic from './technique/Logic';

const datas = [
	{
		title: 'Widgets',
		component: Widgets
	},
	{
		title: '布局类',
		component: Layout
	},
	{
		title: '逻辑类',
		component: Logic
	}
]

export default class Test extends Component {

	render() {
		return (
			<CommonList
				navigator={this.props.navigator}
				type="column"
				header={'技巧'}
				datas={datas}
			/>
		);
	}
}