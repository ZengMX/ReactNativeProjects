// 用于自动切换loading视图和数据加载完成视图

import React, { Component } from 'react';
import {
	Text,
	View,
} from 'react-native';

import _ from 'underscore';

import Spinner from 'react-native-spinkit';

export default class DataControllerForList extends Component {
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
		if (_.isEmpty(data) || _.isNaN(data) || _.isNull(data) || _.isUndefined(data)) {
			content = (
				<View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9, justifyContent: 'center', alignItems: 'center' , backgroundColor: '#fff' },this.props.containerStyle]}>
					<Spinner size={80} type={'Bounce'} color={'#34457D'} />
				</View>
			)
		} else {
			content = (<View></View>)
		}
		return content;
	}
}