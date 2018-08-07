import React, { Component } from 'react';
import {
	Text,
	View,
	WebView
} from 'react-native';

import { BaseView } from 'future/public/widgets';
import config from 'future/public/config';

export default class WebViewPage extends Component {
	constructor(props) {
		super(props);
		this.url = '';
	}
	render() {
		const { title, url, ...webViewProps } = this.props.params;
		if (url && url.indexOf('http://') == -1) {
			this.url = config.host + url;
		} else {
			this.url = url;
		}
		console.log('load url in webView: ', this.url);
		return (
			<BaseView
				navigator={this.props.navigator}
				statusBarStyle={'default'}
				title={{ title: title, tintColor: '#333333', style: { fontSize: 18 } }}
			>
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
			</BaseView >
		)
	}
}
