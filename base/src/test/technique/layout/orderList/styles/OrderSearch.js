import {
	PixelRatio,
	StyleSheet
} from 'react-native';

const screenWidth = require('Dimensions').get('window').width;

export default styles = StyleSheet.create({
	ipt: {
		flex: 1,
		height: 30,
		marginLeft: 10,
		marginRight: 65,
		paddingLeft: 10,
		paddingVertical: 0,
		backgroundColor: '#fff',
		borderColor: '#e5e5e5',
		borderWidth: 1 / PixelRatio.get(),
		fontSize: 12
	}
})