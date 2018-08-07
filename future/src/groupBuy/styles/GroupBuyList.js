import Styles from 'future/public/lib/styles/Styles';
import {
	PixelRatio,
	Image,
	StyleSheet,
	Platform
} from 'react-native';
var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;

const styles = Styles.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#f2f4f5'
	},

	// 头部
	header: {
		height: 50,
		width: screenWidth,
		flexDirection: 'row',
	},
	topView: {
		width: screenWidth,
		height: 45,
		backgroundColor: '#fff',
		flexDirection: 'row'
	},
	topViewItem: {
		width: screenWidth / 3,
		height: 45,
		alignItems: 'center',
		justifyContent: 'center'
	},
	topTextView: {
		flex: 1,
		height: 45,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},
	topText: {
		fontSize: 14,
	},
	topLine: {
		width: 10,
		height: 3,
		backgroundColor: '#3491df',
	},

	prdItem: {
		width: screenWidth - 24,
		marginLeft: 12,
		flex: 1,
		flexDirection: 'column',
		height: 90,
		borderColor: '#eee',
		borderBottomWidth: 1 / PixelRatio.get(),
	},
	prdItemText: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	shangSanJiao: {
		position: 'absolute',
		top: Platform.OS == 'android' ? 40 : 58,
		right: 20,
		height: 4,
		width: 8,
	},
	cont:{
		width: screenWidth-130-24,
		flexDirection:'column',
		alignItems: 'flex-start',
		justifyContent:'center',
		marginLeft:12,
		paddingVertical: 5
	},
	time:{
		height:40,
		width:screenWidth-130-12,
		alignItems:'center',
		flexDirection:'row',
		justifyContent:'flex-start',
		borderBottomColor:'#ccc',
		borderBottomWidth:1/PixelRatio.get(),
	},
	price:{
		height:20,
		width:screenWidth-130-12,
		alignItems:'center',
		flexDirection:'row',
		justifyContent:'flex-start',
	},


});
export default styles;
