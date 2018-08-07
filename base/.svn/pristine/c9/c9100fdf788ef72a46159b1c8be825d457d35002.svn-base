/**
 * 用于自动切换loading视图和数据加载完成视图
 * 属性
 * data 当data无数据时，显示一个水纹般的加载动画
 */

import React, { Component } from 'react';
import {
	Text,
	View,
} from 'react-native';

import _ from 'underscore';

import Spinner from 'react-native-spinkit';

export default class DataController extends Component {
	constructor(props) {
		super(props);
	}
	static defaultProps = {
		data: undefined
	}
	static propTypes = {
		data: React.PropTypes.any,
	}
	render() {
		const data = this.props.data;
		let content = null;
		if (_.isNull(data) || _.isUndefined(data) || _.isNaN(data) || ((_.isObject(data) || _.isArray(data)) && _.isEmpty(data))) {
			content = (
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Spinner size={80} type={'Bounce'} color={'#0099cc'} />
				</View>
			)
		} else {
			content = this.props.children;
		}
		return (
			<View style={{ flex: 1 }}>
				{
					content
				}
			</View>
		)
	}
}