import React, { Component } from 'react';
import {
	Text,
	View,
	PixelRatio,
	StyleSheet,
	Platform
} from 'react-native';
let screenWidth = require('Dimensions').get('window').width;
import { NavBar, RightNavBtn, TextInputC} from 'future/public/widgets';

export default class Search extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.params.value
		}
		this.onSubmitEditing = this._onSubmitEditing.bind(this);
	}

	_onSubmitEditing() {
		this.props.navigator.pop();
		this.props.params.callback && this.props.params.callback(this.state.value);
	}

	render() {
		return (
			<View style={{ flex: 1, backgroundColor: '#fff', }}>
				<NavBar
					navigator={this.props.navigator}
					hideLeftBtn={true}
					rightButton={(
						<RightNavBtn title="取消" handler={() => {
								this.props.navigator.pop();
								this.props.params.callback && this.props.params.callback('');
							} }
							titleStyle={{color:'#fff'}}
						/>
					) }
					mainColor={'#34457D'}
				>
					<View style={{alignItems:'center',height:30}}>
						<View style={{ height: 30,justifyContent:'center', marginLeft: 10, width: screenWidth - 70, marginRight: 60, backgroundColor: '#fff',borderRadius:4, }}>
							<TextInputC
								style={{ marginLeft: 10,height:35, fontSize: 12,width: screenWidth - 80, color: '#666', flex: 1 ,paddingVertical: 0}}
								autoFocus={true}
								defaultValue={this.props.params.value}
								value={this.state.value}
								placeholder="请输入关键字"
								numberOfLines={1}
								maxLength={20}
								underlineColorAndroid = 'transparent'
								onChangeText={value => this.setState({ value }) }
								onSubmitEditing={this.onSubmitEditing}
								/>
						</View>
					</View>
				</NavBar>
			</View>
		);
	}
}