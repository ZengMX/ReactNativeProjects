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
		height: screenHeight,
		width: screenWidth,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		flexWrap: 'wrap',
	},
	tabView: {
		height: 40,
		width: screenWidth,
		flexDirection: 'row',
		backgroundColor: '#fff',
		borderBottomColor: '#ccc',
		borderBottomWidth: 1,
	},
	tabInnerView: {
		width: screenWidth / 2,
		height: 38,
		backgroundColor: '#fff',
		flexDirection: 'column',
		alignItems: 'center',
	},
	tabContView: {
		height: 38,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center'
	},
	tabContImg: {
		width: 20,
		height: 15,
		resizeMode: 'contain',
	},
	tabContSelectedTitle: {
		color: '#2fbdc8',
		fontSize: 14,
		marginLeft: 5,
	},
	tabContUnSelectedTitle: {
		color: '#333333',
		fontSize: 14,
		marginLeft: 5,
	},
	tabBottomLineSelected: {
		width: screenWidth / 2 - 20,
		height: 2,
		borderBottomWidth: 2,
		borderBottomColor: '#2fbdc8',
	},
	tabBottomLineUnSelected: {
		width: screenWidth / 2 - 20,
		height: 0,
	},


	byPartSelectBodyView: {
		flexDirection: 'row',
		marginTop: 45,
	},
	byPartSelectBodyLeftView: {
		flex: 2,
		flexDirection: 'column',
		alignItems: 'center',
	},
	byPartSelectBodyCenterView: {
		flex: 0.5,
		width: 103,
		height: 257,
		alignItems: 'center',
	},
	byPartSelectBodyCenterImg: {
		width: 110.6,
		height: 257,
		resizeMode: 'contain',
	},
	byPartSelectPartTextView: {
		width: 70,
		height: 30,
		marginTop: 15,
		padding: 2,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
		borderColor: '#cccccc',
		borderWidth: 1,
	},
	byPartSelectPartText: {
		color: '#333333',
		fontSize: 14,
	},
	byPartSelectSexView: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 10,
	},
	byPartSelectSexLeftView: {
		flex: 1,
		height: 40,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		// backgroundColor:'pink'
	},
	byPartSelectSexText: {
		color: '#333333',
		fontSize: 12
	},
	byPartSelectSexText2: {
		color: '#333333',
		fontSize: 12,
		marginLeft: 5,
	},
	byPartSelectSexImg: {
		width: 59,
		height: 29,
		resizeMode: 'contain',
		marginLeft: 5,
	},
	byPartSelectSexBlankView: {
		width: 100,
	},
	byPartBottomView: {
		width: screenWidth,
		height: 55,
		position: 'relative',
		// top: 100,
		flexDirection: 'row',
		backgroundColor: '#fff',
	},
	byPartBottomLeftView: {
		width: 88,
		height: 55,
		alignItems: 'center',
		justifyContent: 'center',
	},
	byPartBottomLeftResetView: {
		width: 50,
		height: 30,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#ccc',
	},
	byPartBottomLeftResetText: {
		color: '#666666',
		fontSize: 14,
	},
	byPartBottomRightView: {
		width: screenWidth - 88,
		height: 55,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},
	byPartBottomRightText: {
		color: '#666666',
		fontSize: 12,
	},
	byPartBottomRightNumText: {
		color: '#ff0000',
		fontSize: 12,
	},
	byPartBottomRightBtnView: {
		width: 130,
		height: 40,
		borderRadius: 5,
		marginLeft: 10,
	},
	byPartBottomRightBtnImg: {
		width: 151,
		height: 40,
		borderRadius: 5,
	},
	byPartBottomRightBtnText: {
		color: '#fff',
		backgroundColor: '#2fbdc8',
		fontSize: 14,
		position: 'absolute',
		right: 15,
		top: 12
	},
	byDPTMView: {
		height: screenHeight,
		flexDirection: 'row',
		width: screenWidth,
		backgroundColor: '#fff',
		borderTopWidth: 1/PixelRatio.get(),
		borderColor: '#e5e5e5'
	},
	byDPTMLeftView: {
		backgroundColor: '#edf1f7',
		flexDirection: 'column',
		width: 110,
		height: screenHeight - 64,
	},
	byDPTMLeftEachView: {
		backgroundColor: '#edf1f7',
		flexDirection: 'row',
		height: 50,

	},
	byDPTMLeftEachViewSelected: {
		backgroundColor: '#fff',
		flexDirection: 'row',
		height: 50,
		
	},
	byDPTMLeftLineViewSelected: {
		marginTop:12.5,
		backgroundColor: '#3491df',
		width: 5,
		height: 25,
	},
	byDPTMLeftLineView: {
		backgroundColor: '#edf1f7',
		width: 3,
		height: 50,
	},
	byDPTMLeftText: {
		color: '#596875',
		fontSize: 14,
		lineHeight: Platform.OS == 'android' ? 35 : 45,
		paddingLeft:12,
		paddingRight: 12,
	},
	byDPTMLeftTextSelected: {
		color: '#596875',
		fontWeight:'bold',
		fontSize: 15,
		paddingLeft:12,
		paddingRight: 12,
		lineHeight: Platform.OS == 'android' ? 35 : 45,
		backgroundColor: '#fff',
	},
	byDPTMRightView: {
		paddingLeft: 10,
		flexDirection: 'column',
		width: screenWidth - 140,
		backgroundColor: '#fff',
	},
	byDPTMRightEachView: {
		backgroundColor: '#fff',
		flexDirection: 'row',
		width: screenWidth - 130,
		height: 45,

	},
	shangSanJiao: {
		position: 'absolute',
		top: Platform.OS == 'android' ? 38 : 58,
		right: 20,
		height: 8,
		width: 14,
	},



});
export default styles;
