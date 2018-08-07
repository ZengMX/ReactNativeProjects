'use strict';

import React, { PropTypes, } from 'react';
import {
	StyleSheet,
	Text,
	View,
	PixelRatio,
} from 'react-native';
import _ from 'underscore';


export default class Badge extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			computedSize: null,
		};
		this.handleLayout = this._handleLayout.bind(this);
	}

	_handleLayout(event) {
		let { width, height } = event.nativeEvent.layout;
		let { computedSize } = this.state;
		if (computedSize && computedSize.height === height &&
			computedSize.width === width) {
			return;
		}

		this.setState({
			computedSize: { width, height },
		});

		if (this.props.onLayout) {
			this.props.onLayout(event);
		}
	}

	render() {
		let { computedSize } = this.state;
		let style = {};
		if (!computedSize) {
			style.opacity = 0;
		} else {
			style.width = Math.max(computedSize.height, computedSize.width);
		}
		if (_.isNull(this.props.children) || _.isUndefined(this.props.children)) {
			return null;
		}
		return (
			<View style={[styles.container, this.props.style, style]}
				onLayout={this.handleLayout}>
				<Text
					numberOfLines={1}
					style={[styles.text, this.props.textStyle, style]}>
					{this.props.children}
				</Text>
			</View>
		);
	}
}

let styles = StyleSheet.create({
	container: {
		backgroundColor: 'red',
		height: 15,
		borderWidth: 1 + (1 / PixelRatio.get()),
		borderColor: '#fefefe',
		borderRadius: 17 / 2,
		marginTop: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		fontSize: 12,
		textAlign: 'center',
		color: '#fff',
		padding: 0,
		margin: 0,
		borderRadius: 17 / 2,
		overflow: 'hidden',
	},
});
