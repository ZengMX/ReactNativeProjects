import  { Dimensions, PixelRatio } from 'react-native';
import Styles from 'future/public/lib/styles/Styles';
const screenWidth = Dimensions.get('window').width;

const styles = Styles.create({
	wrap: {
		backgroundColor: '#fff', 
		paddingLeft: 15
	},
	select:{
		marginHorizontal: 4,
		marginTop: 10, 
		height: 30, 
		minWidth: 90, 
		paddingHorizontal: 15, 
		justifyContent: 'center', 
		alignItems: 'center', 
		borderWidth: 1, 
		borderColor: '#8E9399', 
		borderRadius: 2
	},
})

export default styles;