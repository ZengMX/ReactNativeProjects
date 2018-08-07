import { 
	Dimensions,
	PixelRatio 
} from 'react-native';
import Styles from 'future/public/lib/styles/Styles';
const screenWidth = Dimensions.get('window').width;

const styles = Styles.create({
	itemWrap: {
		backgroundColor: '#fff', 
		paddingLeft: 15 
	},
	itemView: {
		height: 75, 
		flexDirection: 'row', 
		justifyContent: 'space-between', 
		alignItems: 'center', 
		paddingRight: 15, 
		borderBottomWidth: 1 / PixelRatio.get(), 
		borderBottomColor: '#e5e5e5'
	},
	titleView: {
		width: screenWidth*0.5
	},
	title: {
		fontSize: 14, 
		color: '#333'
	},
	itemRightView: {
		alignItems: 'flex-end'
	},
	money: {
		fontSize: 18, 
		fontWeight: 'bold'
	},
	time: {
		fontSize: 12, 
		color: '#999' 
	},
	flex: {
		flex: 1
	},
	bannerView: {
		width: screenWidth, 
		height: 174, 
		backgroundColor: '#5591fa'
	},
	bannerTitle: {
		fontSize: 13, 
		color: 'rgba(255,255,255,0.8)', 
		marginTop: 20, 
		marginLeft: 15
	},
	bannerAmount: {
		fontSize: 40, 
		color: '#fff', 
		marginTop: 15, 
		marginLeft: 20, 
		letterSpacing: 2
	},
	buttonWrap: {
		width: screenWidth, 
		height: 45, 
		alignItems: 'center', 
		marginTop: 15
	},
	button: {
		width: screenWidth * 0.9, 
		height: 45, 
		backgroundColor: '#fff', 
		justifyContent: 'center', 
		alignItems: 'center', 
		borderRadius: 2
	},
	buttonTitle: {
		fontSize: 16, 
		color: '#5591fa'
	},
	tip: {
		fontSize: 13, 
		color: '#666', 
		marginTop: 10, 
		marginBottom: 7, 
		marginLeft: 15
	}
})

export default styles;