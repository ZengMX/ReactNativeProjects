import {
	Platform
} from 'react-native';
import Styles from 'future/public/lib/styles/Styles';

const styles = Styles.create({
	page: {
		flex: 1,
		backgroundColor: '#f8f8f8'
	},
	header: {
		width: '$W',
		height: 200,
		backgroundColor: 'transparent',
	},
	navBg: {
		height: 64,
		width: '$W'
	},
	headerBg: {
		height: 175,
		width: '$W'
	},
	navBtn: {
		width: 47.5, 
		alignItems: 'center', 
		justifyContent: 'center'
	},
	navLeftImg: {
		width: 20.5, height: 19
	},
	navRightImg: {
		width: 16, height: 19.5
	},
	dot: {
		width: 10, 
		height: 10, 
		borderRadius: 5, 
		backgroundColor: '#ff6600', 
		borderWidth: 1, 
		borderColor: '#fff',
		position: 'absolute',
		right: 7,
		top: 10
	},
	headInfo: {
		flex: 1, alignItems: 'center'
	},
	userImg: {
		width: 72, height: 72, marginTop: 3,
		borderRadius: 36
	},
	userType: {
		fontSize: 16, color: '#fff', marginTop: 12
	},
	userName: {
		fontSize: 14, color: '#fff', paddingTop: 9
	},
	accountInfo: {
		position: 'absolute', left: 8, 
		justifyContent:'space-between',
		right: 8, height: 50, 
		backgroundColor: '#fff', 
		bottom: 0, borderRadius: 29,
		borderWidth: 1,
		borderColor: 'rgba(37, 144 ,233, 0.2)',
		borderTopWidth: 0,
		shadowColor: 'rgb(37, 144 ,233)',
		shadowOffset: {width: 2, height: 4},
		shadowOpacity: 0.2,
		flexDirection: 'row',
		alignItems: 'center',
	},
	accountWrap: {
		flex:1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	accountText: {
		fontSize: 12,
		color: '#666',
		backgroundColor:'rgba(255,255,255,0)'
	},
	accountNum: {
		fontSize: 16,
		color: '#051b28',
		paddingHorizontal: 5,
		backgroundColor:'rgba(255,255,255,0)'
	},
	divider: {
		width: '$BW', height: 14, backgroundColor: '#ddd'
	},
	myOrder: {
		marginTop: 10, height: 50, backgroundColor: '#fff',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 13,
		justifyContent: 'space-between'
	},
	myOrderText: {
		fontSize: 16, color: '#051b28'
	},
	allOrder: {
		flexDirection: 'row', alignItems: 'center'
	},
	allOrderText: {
		paddingRight: 7, 
		fontSize: 12, 
		color: '#94999e'
	},
	arrowIcon: {
		width: 6, height: 11
	},
	orderCategory: {
		height: 78, 
		flexDirection: 'row', 
		backgroundColor: '#fff',
		marginBottom: 5
	},
	orderCategoryItem: {
		width: '$W * 0.2',
		height: 78,
		alignItems: 'center',
		justifyContent: 'center',
		
	},
	categoryItemImg: {
		width: 22,
		height: 21
	},
	categoryItemText: {
		fontSize: 12,
		color: '#666',
		marginTop: 12
	},
	brage: {
		width: 18, 
		height: 18, 
		borderWidth: 1, 
		borderColor: '#ff6600', 
		borderRadius: 9, 
		position: 'absolute', 
		alignItems: "center", 
		justifyContent: 'center', 
		top: 5, 
		right: '10% -31'
	},
	brageText: {
		fontSize: 11, 
		color: '#ff6600'
	},
	section: {
		marginBottom: 5
	},
	sectionItem: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
		height: 50,
		backgroundColor: '#fff',
		paddingHorizontal: 13,
	},
	sectionIcon: {
		width: 18, height: 18
	},
	sectionTitle: {
		flex: 1, marginLeft: 14,
		fontSize: 15,
		color: '#051b28'
	},
	mb20: {
		marginBottom: 20
	}
})

export default styles;