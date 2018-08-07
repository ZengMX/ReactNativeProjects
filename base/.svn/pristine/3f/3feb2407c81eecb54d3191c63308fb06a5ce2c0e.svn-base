import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	TouchableOpacity,
	PixelRatio,
	StyleSheet
} from 'react-native';
import { BaseView } from 'future/src/widgets';

export default class ProductDetail extends Component {
	static defaultProps = {
		userInfo: {
			toPayTotalCount: 56,
			toSendTotalCount: 20,
		}
	}
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<BaseView style={[{ backgroundColor: '#fff' }]}
				navigator={this.props.navigator}
				title={{ title: '  ', tintColor: '#fff' }}>


				<View style={{ flex: 1, height: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', }}>

					<TouchableOpacity onPress={() => { }}
						style={{ justifyContent: 'center', alignItems: 'center' }}
						hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}>
						<View style={{ justifyContent: 'center', alignItems: 'center' }}>
							<Image source={require('./res/001daifukuan.png')}
								sreresizeMode='stretch'
								style={styles.orderTabImg}>
								{
									this.props.userInfo.toPayTotalCount > 0 &&
									<View style={styles.orderNumberImg}>
										<Text style={styles.orderNumberText} numberOfLines={1}>{this.props.userInfo.toPayTotalCount}</Text>
									</View>
								}
							</Image>
							<Text style={{ textAlign: 'center', fontSize: 10, color: '#666', }}>待付款</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => { }}
						style={{ justifyContent: 'center', alignItems: 'center' }}
						hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}>
						<View style={{ justifyContent: 'center', alignItems: 'center' }}>
							<Image source={require('./res/001daifhuo.png')}
								sreresizeMode='stretch'
								style={styles.orderTabImg}>
								{
									this.props.userInfo.toSendTotalCount > 0 &&
									<View style={styles.orderNumberImg}>
										<Text style={styles.orderNumberText} numberOfLines={1}>{this.props.userInfo.toSendTotalCount}</Text>
									</View>
								}
							</Image>
							<Text style={{ textAlign: 'center', fontSize: 10, color: '#666' }}>待发货</Text>
						</View>
					</TouchableOpacity>

				</View >
			</BaseView>
		);
	}
}


let styles = StyleSheet.create({

	orderTabImg: {
		width: 28,
		height: 28,
		justifyContent: 'flex-start',
		alignItems: 'flex-end',

	},
	orderNumberImg: {
		width: 13,
		height: 13,
		borderRadius: 6.5,
		borderWidth: 2 / PixelRatio.get(),
		backgroundColor: 'red',
		borderColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
	},
	orderNumberText: {
		fontSize: 7,
		color: '#fff',
	},
});