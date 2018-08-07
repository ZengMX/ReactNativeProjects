import Styles from 'future/public/lib/styles/Styles';
const styles = Styles.create({
	productInfo: {
		height: 120, 
		borderBottomColor: '#eee', 
		borderBottomWidth: '$BW', 
		paddingRight: 13, 
		flexDirection: 'row'
	},
	productItem: {
		backgroundColor: '#fff', paddingLeft: 13
	},
	productImg: {
		height: 90, width: 90, marginTop: 15
	},
	productView: {
		flex: 1, marginLeft: 10, 
		justifyContent: 'space-between', 
		paddingTop: 18, paddingBottom: 19
	},
	pdName: {
		fontSize: 14, color: '#333', lineHeight: 18
	},
	integralView: {
		flexDirection: 'row', 
		justifyContent: 'space-between', 
		alignItems: 'center'
	},
	integral: {
		fontSize: 14, color: '#FF6600',
	},
	delWrap: {
		width: 16, alignItems: 'center', 
		height: 16, justifyContent: 'center'
	},
	delIcon: {
		width: 10, height: 10
	},
	exchangeWrap: {
		height: 55, flexDirection: 'row', 
		justifyContent: 'space-between', 
		alignItems: 'center', paddingRight: 13
	},
	exchangeText: {
		fontSize: 13,
		color: '#333'
	},
	receiveInfo: {
		backgroundColor:'#5D6780',
		height:95,
		width:'$W', 
		marginBottom: 10,
	},
	userInfo: {
		color:'#fff',
		fontSize:15,
		marginLeft:13,
		marginTop:13
	},
	address: {
		color:'#fff',
		fontSize:14,
		marginLeft:13,
		marginTop:11,
		width: '$W - 60'
	},
	noReceiver: {
		backgroundColor:'#5D6780',
		height:40,
		width:'$W', 
		marginBottom: 10,
		justifyContent: 'center',
		paddingLeft: 13
	},
	footer: {
		height: 99, 
		paddingHorizontal: 13, 
		borderTopColor: '#eee', 
		borderTopWidth: 1, 
		justifyContent: 'center', 
		backgroundColor: '#fff'
	},
	btn: {
		height: 45, 
		backgroundColor: '#34457D', 
		borderRadius: 4, 
		alignItems: 'center', 
		justifyContent: 'center', 
		marginTop: 12
	},
	btnText: {
		color: '#fff', fontSize: 16
	},
	btnDisable: {
		backgroundColor: '#e0e0e1',
	},
	btnTextDisable: {
		color: '#bfbfbf'
	},
	statisInfo: {
		flexDirection: 'row', 
		alignItems: 'center', 
		justifyContent: 'center'
	},
	quantity: {
		fontSize: 13, color: '#333'
	},
	price: {
		fontSize: 17, color: '#ff6600'
	},
	text: {
		fontSize: 15, color:'#ff6600'
	},
	maskModalView:{ 
		width: SCREENWIDTH, 
		height: 330, 
		backgroundColor: '#fff', 
		marginTop: SCREENHEIGHT - 394, 
		justifyContent: 'space-between' 
	},
	maskModalTitle:{ 
		marginTop: 20, 
		fontSize: 15, 
		color: "#333", 
		marginLeft: 13, 
		fontWeight: 'bold' 
	},
	maskItem:{ 
		width: SCREENWIDTH, 
		height: 95, 
		flexDirection: 'row', 
		justifyContent: 'space-between' 
	},
	maskAddrTopTxt:{ 
		marginTop: 15, 
		fontSize: 15, 
		color: "#333", 
		marginLeft: 13 
	},
	maskAddrBottomTxt:{ 
		marginTop: 7, 
		fontSize: 15, 
		color: "#333", 
		marginLeft: 13, 
		width: SCREENWIDTH - 45 
	},
	imgView:{ 
		width: 32, 
		height: 95, 
		justifyContent: 'center', 
		alignItems: 'center' 
	},
	sureBtn:{ 
		width: SCREENWIDTH, 
		height: 50, 
		backgroundColor: '#34457D', 
		justifyContent: 'center', 
		alignItems: 'center', 
		alignSelf: 'flex-end' 
	},
	addAddrBtn:{
		flexDirection:'row',
		marginLeft:13,
		marginBottom:13,
		alignItems:'center',
		marginTop:13
	}
});

export default styles;