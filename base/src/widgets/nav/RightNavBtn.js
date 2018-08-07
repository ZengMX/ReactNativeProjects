import React, { Component, PropTypes } from 'react';
import {
	TouchableOpacity,
	Text,
	View,
	StyleSheet
} from 'react-native';

export default class RightNavButton extends Component {
	render() {
		const { style, title, handler } = this.props;
		return (
			<TouchableOpacity
				style={styles.navBarButton}
				onPress={handler}
				hitSlop={{ top: 15, left: 15, bottom: 15, right: 15 }}
			>
				<View style={[styles.navBarView, style]}>
					<Text style={styles.navBarText} numberOfLines={1}>
						{title}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	navBarButton: {
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10,
	},
	navBarView: {
		height: 24,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: '#fff',
		borderRadius: 2,
		paddingHorizontal: 3
	},
	navBarText: {
		color: '#fff',
		textAlign: 'center'
	}
});