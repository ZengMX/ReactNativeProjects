// 用于自动切换loading视图和数据加载完成视图

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
		data		: undefined
  	}
	static propTypes = {
		data	 	: React.PropTypes.any,
	}
	render() {
		const data = this.props.data;
		let content = null;
		if(_.isEmpty(data) || _.isNaN(data) || _.isNull(data) || _.isUndefined(data)){
			content = (
				<View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
					<Spinner size={80} type={'Bounce'} color={'#34457D'}/>
				</View>
			)
		}else{
			content = this.props.children;
		}
		return (
			<View style={{flex :1 }}>
				{
					content
				}
			</View>
		)
	}
}
