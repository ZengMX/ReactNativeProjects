import { Dimensions, PixelRatio, Platform } from 'react-native';
import Styles from 'future/public/lib/styles/Styles';
const screenWidth = Dimensions.get('window').width;

const styles = Styles.create({
	itemWrap: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 53,
		justifyContent: 'space-between',
		borderBottomWidth: 1 / PixelRatio.get(),
		borderBottomColor: '#eee',
		paddingRight: 20
	},
	itemView: {
		justifyContent: 'center'
	},
	bankUserName: {
		fontSize: 15,
		color: '#333'
	},
	bankAccount: {
		fontSize: 12,
		color: '#666',
		marginTop: 4
	},
	gou: {
		width: 15,
		height: 10
	},
	container: {
		backgroundColor: '#fff',
		paddingLeft: 13,
		marginTop: 10
	},
	mainView: {
		borderBottomWidth: 1 / PixelRatio.get(),
		borderBottomColor: '#eee',
		height: 53,
		justifyContent: 'center'
	},
	title: {
		fontSize: 15,
		color: '#333'
	},
	newView: {
		borderBottomWidth: 1 / PixelRatio.get(),
		borderBottomColor: '#eee',
		height: 53,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	inputView: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 53,
		borderBottomWidth: 1 / PixelRatio.get(),
		borderBottomColor: '#eee'
	},
	inputTitle: {
		fontSize: 15,
		color: '#aaaeb9',
		marginRight: 30
	},
	chooseBank: {
		flex: 1,
		height: 53,
	},
	inputWrap: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	inputCView: {
		flex: 1,
		height: 21,
	},
	input: {
		flex: 1,
		fontSize: 15,
		color: '#0c1828',
		justifyContent: 'center',
		height: 21,
	},
	sanjiao: {
		width: 6,
		height: 11
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
	},
	maskView: {
		backgroundColor: '#3491df',
		width: screenWidth,
		height: Platform.OS == 'ios' ? 52 : 30,
		alignItems: 'center',
		justifyContent: 'center'
	},
	maskTitleView: {
		marginTop: Platform.OS == 'ios' ? 22 : 0
	},
	maskTitle: {
		fontSize: 14,
		color: '#fff',
	},
	maskItem: {
		height: 40, 
		marginHorizontal: 15,
		borderBottomColor: '#eee',
		borderBottomWidth: 1 / PixelRatio.get(),
		justifyContent: 'center', 
		flexDirection: 'row'
	},
	maskItemView: {
		justifyContent: 'space-around', 
		flex: 1, 
		paddingVertical: 5, 
		paddingHorizontal: 3
	},
	maskText: {
		fontSize: 13, 
		color: '#0c1828'
	}
})

export default styles;