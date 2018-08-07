import { Dimensions, Platform, StyleSheet } from 'react-native';
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
	messageView: {
		alignItems: 'center', 
		paddingHorizontal: 12.5, 
		marginTop: 20
	},
	timeView: {
		alignItems: 'center', 
		marginBottom: 15
	},
	time: {
		fontSize: 12, 
		color: '#999'
	},
	container: {
		backgroundColor: '#fff', 
		padding: 15, 
		flexDirection: 'row', 
		alignItems: 'center', 
		justifyContent: 'space-between'
	},
	flex: {
		flex: 1
	},
	pushTitle: {
		fontSize: 14, 
		color: '#0c1828', 
		fontWeight: '500'
	},
	pushMessage: {
		fontSize: 13, 
		color: '#666', 
		lineHeight:16 ,
		width: screenWidth * 0.8
	},
	sanjiao: {
		width: 6, 
		height: 22
	},
	more: {
		width: 16, 
		height: 3	
	}
});

export default styles;