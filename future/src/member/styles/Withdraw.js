import  { Dimensions, PixelRatio } from 'react-native';
import Styles from 'future/public/lib/styles/Styles';
const screenWidth = Dimensions.get('window').width;

const styles = Styles.create({
	headerBox: {
		height: 60, 
		backgroundColor: '#fff', 
		flexDirection: 'row', 
		alignItems: 'center', 
		marginVertical: 10, 
		paddingLeft: 13
	},
	jia: {
		width: 20, 
		height: 20
	},
	jiaTitle: {
		fontSize: 15, 
		color: '#333', 
		marginLeft: 5
	},
	userView: {
		flexDirection: 'row', 
		alignItems: 'center'
	},
	yinhangka: {
		width: 30, 
		height: 30 
	},
	userTitleView: {
		justifyContent: 'space-between', 
		marginLeft: 15,
	},
	bankUserName: {
		fontSize: 14, 
		color: '#333'
	},
	bankCode: {
		fontSize: 12, 
		color: '#666', 
		marginTop: 5
	},
	sanjiao: {
		width: 6, 
		height: 11,
		marginRight: 13
	},
	container: {
		backgroundColor: '#fff', 
		paddingLeft: 13, 
		paddingTop: 15
	},
	moneyTip: {
		fontSize: 13, 
		color: '#333'
	},
	inputWrap: {
		height: 70, 
		alignItems: 'center', 
		flexDirection: 'row'
	},
	fuhao: {
		fontSize: 40, 
		color: '#333'
	},
	inputView: {
		flex: 1, 
		height: 40
	},
	input: {
		 height: 40, 
		 fontSize: 40, 
		 color: '#333'
	},
	tipView: {
		flexDirection: 'row', 
		alignItems: 'center', 
		justifyContent: 'space-between', 
		paddingRight: 13, 
		paddingBottom: 15
	},
	tipText: {
		fontSize: 13, 
		color: 'red'
	},
	wranText: {
		fontSize: 13, 
		color: '#aaaeb9'
	},
	allText: {
		fontSize: 13, 
		color: '#0082ff'
	},
	reasonView: {
		height: 53, 
		borderTopWidth: 1 / PixelRatio.get(), 
		borderTopColor: '#eee', 
		flexDirection: 'row', 
		alignItems: 'center'
	},
	reasonText: {
		fontSize: 15, 
		color: '#aaaeb9' 
	},
	reasonInputView: {
		flex: 1, 
		height: 30, 
		marginLeft: 30 
	},
	reasonInput: {
		flex: 1, 
		height: 30, 
		color: '#333', 
		fontSize: 15
	},
	buttonView: {
		alignItems: 'center', 
		marginTop: 20
	},
	activeButton: {
		width: screenWidth * 0.9, 
		height: 45, 
		backgroundColor: '#34457d', 
		alignItems: 'center', 
		justifyContent: 'center', 
		borderRadius: 2
	},
	activeText: {
		fontSize: 16, 
		color: '#fff'
	},
	button: {
		width: screenWidth * 0.9, 
		height: 45, 
		backgroundColor: '#e0e0e1', 
		alignItems: 'center', 
		justifyContent: 'center', 
		borderRadius: 2
	},
	buttonText: {
		fontSize: 16, 
		color: '#bfbfbf'
	}
})

export default styles;