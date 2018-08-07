import React, { Component } from 'react';
import {
	Text,
	View,
	PixelRatio,
	InteractionManager,
	StyleSheet
} from 'react-native';

import { BaseView, RightNavBtn, TextInput } from 'future/src/widgets';
import styles from '../styles/OrderSearch';
let timeout = null;
export default class Search extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.params.value
		}
		this.onSubmitEditing = this._onSubmitEditing.bind(this);
	}
	componentWillUnmount() {
		this.props.params.callback && this.props.params.callback(this.state.value);
	}
	_onSubmitEditing() {
		//避免安卓BUG触发2次
		if (timeout) clearTimeout(timeout)
		timeout = setTimeout(() => {
			this.props.navigator.pop();
			if (timeout) clearTimeout(timeout);
		}, 200)
	}
	render() {
		return (
			<BaseView style={{ flex: 1, backgroundColor: '#fff' }}
			navigator={this.props.navigator}
					hideLeftBtn={true}
					rightButton={(<RightNavBtn title="取消" handler={() => {
						this.props.navigator.pop();
					} } />)}
					head={(<TextInput
						style={styles.ipt}
						maxLength={20}
						autoFocus={true}
						defaultValue={this.props.params.value}
						value={this.state.value}
						placeholder="输入关键字"
						returnKeyType="search"
						numberOfLines={1}
						clearButtonMode="while-editing"
						onChangeText={value => this.setState({ value })}
						onSubmitEditing={this.onSubmitEditing}
						/>)}>
				
			</BaseView>
		);
	}
}