import Styles from 'future/public/lib/styles/Styles';
import {
	PixelRatio,
	Image,
	StyleSheet,
	Platform,	
} from 'react-native';
var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;

const styles = Styles.create({
	//分类
	categroys: {
		width: screenWidth,
		flexDirection: 'row',
		flexWrap: 'wrap',
		backgroundColor: '#fff',

	},
	contentContainerStyle: {
		flex:1,
		width: screenWidth,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		flexWrap: 'wrap',
		borderTopWidth: 1/PixelRatio.get(),
		borderColor: '#e5e5e5',
		backgroundColor:'#f5f5f5'
	},
	listItem: {
		width: screenWidth / 2,
		// backgroundColor:'#fff',
		height: 160,
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	listImg: {
		width: 60,
		height: 60,
	},

	//品牌

	sectionHeaderText: {
		marginLeft:10, 
		backgroundColor: '#f2f4f5',
		fontSize:14,
		color:'#333',
	},
	sectionItemText: {
		fontSize:12,
		color: '#81b1da'

	},
	cellView: {
		height: 50,
		backgroundColor: '#fff'
	},
	cellInnerView: {
		height: 50,
		flexDirection: 'column',
		backgroundColor: '#fff'
	},
	cellItemView: {
		height: 49,
		paddingLeft: 8,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},

	cellText: {
		width: screenWidth - 45,
		marginLeft: 10,
		fontSize: 14,
		color: '#333333',
	},
	cellLineView: {
		width: screenWidth - 30,
		marginLeft: 10,
		height: 1,
		borderWidth: 1/PixelRatio.get(),
		borderColor: '#f2f4f5',
	},
	shangSanJiao: {
		position: 'absolute',
		top: Platform.OS == 'android' ? 40 : 58,
		right: 20,
		height: 4,
		width: 8,
	},
});
export default styles;
