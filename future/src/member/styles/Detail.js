import  { Dimensions, PixelRatio } from 'react-native';
import Styles from 'future/public/lib/styles/Styles';
const screenWidth = Dimensions.get('window').width;

const styles = Styles.create({
	wrap: {
		backgroundColor: '#fff', 
		paddingLeft: 15
	},
	view: {
		height: 53, 
		flexDirection: 'row', 
		justifyContent: 'space-between', 
		alignItems: 'center', 
		paddingRight: 15, 
		borderBottomWidth: 1 / PixelRatio.get(), 
		borderBottomColor: '#e5e5e5'
	},
	rightTitle: {
		 fontSize: 14, 
		 color: '#333' 
	},
	scrollView: {
		flex: 1, 
		marginTop:10
	},
	payTitle: {
		color: '#333',
		fontSize: 15, 
		fontWeight: '600'
	},
	getTitle: {
		fontSize: 14, 
		color: '#959fa7'
	},
	saveTitle: {
		fontSize: 14, 
		color: '#13c76f'
	},
	waitTitle: {
		color: '#f60', 
		fontSize: 15, 
		fontWeight: '600'
	}
})

export default styles;