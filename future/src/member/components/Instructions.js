import React, { Component } from 'react';
import {
	Text,
	View,
} from 'react-native';
import { BaseView, } from 'future/public/widgets';
export default class Instructions extends Component {
	render() {
		return (
			<BaseView
				mainBackColor={{ backgroundColor: '#f5f5f5' }}
                ref={base => this.base = base}
                navigator={this.props.navigator}
                mainColor={'#f9f9f9'}
                titlePosition={'center'}
				statusBarStyle={'default'}
                title={{ title: '特别说明', tintColor: '#333', fontSize: 18 }}
				navBarStyle={styles.borderStyle} >
				<Text style={{fontSize:13,paddingHorizontal:13}}>易淘药在此声明，您通过本软件参加的商业活动，与 Apple Inc. 无关。</Text>
			</BaseView>
		)
	}
}