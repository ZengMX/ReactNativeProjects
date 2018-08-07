import React, { Component, PropTypes } from 'react';
import {
	TouchableOpacity,
	Image,
	StyleSheet
} from 'react-native';

export default class BackButton extends Component {
	render() {
		const { style, tintColor, margin, title, handler } = this.props;
		return (
			<TouchableOpacity
				style={styles.navBarButton}
				hitSlop={{ top: 15, left: 15, bottom: 15, right: 15 }}
				onPress={handler}
			>
				<Image style={[{ width: 13, height: 24 }, style]} source={require('./img/000famhui.png')} />
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	navBarButton: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: 10,
	},
});
