import {
	PixelRatio,
	StyleSheet,
	Platform
} from 'react-native'
import Styles from 'future/public/lib/styles/Styles';
const screenWidth = require('Dimensions').get('window').width;
const screenHeight = require('Dimensions').get('window').height;

var scrollViewHeight = screenHeight - 52 - 64;

const styles = Styles.create({
	container: {		
		height:scrollViewHeight,//请别注释
		flexDirection: 'column',
		backgroundColor: '#fff',	
	},

	tapView: {
		flexDirection: 'row',		
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 12,
		height: 45,		
	},
	leftBtnView: {
		flex:1,
		height:45,
		flexDirection: 'column', 
		alignItems: 'center',	
		justifyContent:'flex-end',				
	},
	tapBottom: {
		marginTop: 12,
		width: Platform.OS == 'android' ? 80 : 80,
		height: Platform.OS == 'android' ? 3 : 3,
	},
	textR: {		
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderRightColor: '#ccc',
		borderRightWidth: 1,
	},
	text: {
		textAlign: 'center',
		fontSize: 14,
		color: "#53606a",
	},


});
export default styles;