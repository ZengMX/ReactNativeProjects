import { Dimensions, PixelRatio } from 'react-native';
import Styles from 'future/public/lib/styles/Styles';
const screenWidth = Dimensions.get('window').width;

const styles = Styles.create({
	topIcon: {
		width: screenWidth,
		height: 174
	},
	back: {
		width: 16,
		height: 16,
		backgroundColor: '#f00',
		position: 'absolute',
		top: 5,
		left: 0
	},
	blur: {
		width: screenWidth,
		height: 64,
		position: 'absolute',
		top: 0,
		left: 0
	},
	topTitle: {
		width: screenWidth,
		height: 26,
		flexDirection: 'row',
		position: 'absolute',
		top: 32,
		left: 0,
		alignItems: 'center',
	},
	avatarView: {
		width: screenWidth - 26,
		flexWrap:'wrap',
		position: 'absolute',
		top: 87,
		left: 13,
		backgroundColor: '#00000000',
		flexDirection: 'column',
		borderRadius: 4,
	},
	avatarIcon: {
		width: 41,
		height: 41,
		position: 'absolute',
		top: 0,
		left: (screenWidth - 26 - 20.5) / 2,
		borderRadius: 20.5,
	},
	opacityView: {
		width: screenWidth,
		height: 22,
		backgroundColor: '#0000',
	},
	avater: {
		width: screenWidth - 26,
		flexWrap:'wrap',
		backgroundColor: '#fff',
		shadowColor: '#ccc',
		shadowOffset: { h: 2, w: 2 },
		shadowRadius: 3,
		shadowOpacity: 0.8,
		borderRadius: 4,
		paddingBottom:6,
		flexDirection: "column"
	},
	company: {
		width: screenWidth - 26,
		height: 20,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: "#fff",
		alignItems: 'center',

	},
	exView: {
		height: 20,
		width: screenWidth - 26,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingRight: 10,
		paddingLeft: 10,
		backgroundColor: '#fff'
	},
	panelTopView: {
		flexDirection: 'column',
		marginLeft: 13,
		height: 60,
		width: screenWidth - 26,
		backgroundColor: "#fff"
	},
	panelTop: {
		height: 20,
		width: screenWidth - 26,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingRight: 10,
		paddingLeft: 10,
		marginTop: 15,
		backgroundColor: '#fff',
		alignItems: "center"
	},
	panelView: {
		width: screenWidth - 26,
		height: 110,
		marginLeft: 13,
		flexDirection: 'row',
		backgroundColor: "#fff",
		marginBottom: 5,
		paddingLeft: 10
	},
	line:{
		width: screenWidth - 26,
		height: 110,
		marginBottom:5,
		marginTop:5,
		height:1,
		backgroundColor:'#eee'
	},
	companyTe: {
		width: screenWidth - 26,
		height: 33 / 2,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: "#fff"
	},
	avaterTextView: {
		flex: 1,
		flexDirection: 'row',
		marginTop: 6,
		flexWrap:'wrap',
		backgroundColor: "#fff"
	},
	commView: {
		width: screenWidth - 26,
		height: 120,
		flexDirection: 'column',
		marginLeft: 13,
		backgroundColor: '#fff',
		marginBottom: 5
	},
	commSelect: {
		width: screenWidth - 26,
		height: 50,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10,
		borderBottomWidth: 1 / PixelRatio.get(),
		borderColor: '#ccc'
	},
	qualificationView: {
		width: screenWidth - 26,
		height: 145,
		flexDirection: 'column',
		marginLeft: 13,
		backgroundColor: '#fff',
		marginBottom: 5
	},
	qualificationTe: {
		width: screenWidth - 26,
		height: 50,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10,
		borderBottomWidth: 1 / PixelRatio.get(),
		borderColor: '#ccc'
	},
	empytIconView: {
		flex: 1,
		width: screenWidth - 26,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	iconView:{
		flex: 1,
		width: screenWidth - 26,
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft:10,
	},
	iconTop:{
		width: 15,
		height: 15,
		position: 'absolute',
		top: 0,
		right: 0,
		borderRadius: 7.5,
	},
	icon:{
		width:45,
		height:60,
	},
	commitView: {
		borderTopWidth: 1 / PixelRatio.get(),
		borderColor: '#ccc',
		width: screenWidth,
		height: 65,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor:'#fff'
	},
	commit: {
		width: screenWidth - 30,
		height: 45,
		backgroundColor: "#34457D",
		justifyContent: 'center',
		alignItems: 'center'
	},
})

export default styles;