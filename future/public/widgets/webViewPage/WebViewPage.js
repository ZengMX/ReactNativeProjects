import React, { Component } from 'react';
import {
	Text,
	View,
	WebView
} from 'react-native';

import { NavBar } from 'future/public/widgets';
import config from 'future/public/config';

export default class WebViewPage extends Component {
	constructor(props) {
		super(props);

	}
	onShouldStartLoadWithRequest(event) {
		return true;
	}

	onNavigationStateChange(navState) {

	}

	render() {
		const { title, url, tintColor, ...webViewProps } = this.props.params;
		if (url && url.indexOf('http://') == -1) {
			this.url = config.host + url;
		} else {
			this.url = url;
		}
		if (tintColor) {
			this.tintColor = tintColor;
		} else {
			this.tintColor = '#fff';
		}
		console.log('load url（%s） in webView ', this.url);
		return (
			<View style={{ flex: 1 }}>
				<NavBar navigator={this.props.navigator}
					title={{ title: title, tintColor: this.tintColor }}
				/>
				<WebView
					ref="webView"
					automaticallyAdjustContentInsets={false}
					style={{ flex: 1 }}
					source={{ uri: this.url }}
					javaScriptEnabled={true}
					domStorageEnabled={true}
					decelerationRate='normal'
					startInLoadingState={true}
					scalesPageToFit={true}

					{...webViewProps}
				/>
			</View>
		)
	}
}
