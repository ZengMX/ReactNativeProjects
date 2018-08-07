import React, { Component, PropTypes } from 'react';
import {
	TouchableOpacity,
	Image,
	StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
	navBarButton: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 20,
	},
});

export default class BackButton extends Component {
	render() {
		const { style, tintColor, margin, title, handler, deep } = this.props;
		
		return (
			<TouchableOpacity style={styles.navBarButton}
				hitSlop={{ top: 15, left: 15, bottom: 15, right: 15 }}
				onPress={handler}>
				{/* <Image style={[{ width: 9, height: 16,resizeMode:'contain',}, style]} source={deep?require('./img/000fanhui.png'):require('./img/000famhui.png')} /> */}
				<Image style={[{ width: 9, height: 16,resizeMode:'contain',}, style]} source={require('./img/000fanhui.png')} />
			</TouchableOpacity>
		);
	}

}