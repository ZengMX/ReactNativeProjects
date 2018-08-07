import React, { Component } from 'react';
import {
	Text,
	View,
	WebView
} from 'react-native';

import { BaseView } from 'future/src/widgets';
import config from 'future/src/config';

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
		const {title, url, ...webViewProps} = this.props.params;
		if (url && url.indexOf('http://') == -1) {
			this.url = config.host + url;
		} else {
			this.url = url;
		}
		console.log('load url（%s） in webView ', this.url);
		return (
			<BaseView
				navigator={this.props.navigator}
				title={{ title: title, tintColor: '#fff' }}>
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
			</BaseView>
		)
	}
}
