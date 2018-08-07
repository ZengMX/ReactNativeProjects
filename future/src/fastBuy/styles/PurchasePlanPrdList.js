import {
	PixelRatio,
} from 'react-native';
import Styles from 'future/src/lib/styles/Styles';
var fullWidth = require('Dimensions').get('window').width;
var fullHeight = require('Dimensions').get('window').height;

const styles = Styles.create({
	//navbar
	navbarContainer: {
		flexDirection: "row",
		bottom: 7,
		alignItems: "center"
	},
	leftBtn: {
		color: "#fff",
		fontSize: 16,
		marginTop: 12
	},
	rightBtnImg: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginHorizontal: 15
	},
	rightBtnNumImg: {
		marginTop:10,
		justifyContent: 'center',
		alignItems: 'center'
	},
	rightBtnNum: {
		backgroundColor: 'rgba(0, 0, 0, 0)',
		color: "#fff",
		fontSize: 10,
		textAlign: "center"
	},
	//容器
	container: {
		flex: 1,
		width: fullWidth,
		justifyContent: "space-between"
	},
	//底部视图
	bottomViewContainer: {
		backgroundColor: "#fff",
		height: 45,
		width: fullWidth,
		flexDirection: "row",
		justifyContent: "space-between"
	},
	selectAllBtn: {
		flexDirection:"row",
		alignItems: "center",
		paddingHorizontal: 14
	},
	selectAllImg: {
		width:16,
		height:16
	},
	selectAllText: {
		color: "#666",
		fontSize:14,
		marginLeft: 10
	},
	editBottomView: {
		height: 45,
		flexDirection: "row",
		alignItems:"center"
	},
	delBtn: {
		paddingHorizontal: 14,
		paddingVertical: 6,
		height: 45,
		justifyContent: "space-between",
		alignItems: "center"
	},
	delBtnImg: {
		width: 20,
		height: 20
	},
	delBtnText: {
		fontSize: 9,
		color: "#333"
	},
	noEditBottomView: {
		flexDirection:"row",
		justifyContent:"flex-end",
		alignItems: "center"
	},
	addToCartBtn: {
		width:100,
		height:45,
		backgroundColor:"#3491df",
		justifyContent:'center',
		alignItems: 'center'
	},
	//商品项
	prdContainer: {
		backgroundColor: "#fff",
		overflow:'hidden'
	},
	topView: {
		height: 105,
		width: fullWidth,
		flexDirection: "row",
		alignItems: "center"
	},
	bottomView: {
		height: 110,
		marginTop: -25,
		marginLeft: 50,
		marginRight: 12,
		backgroundColor: "#fff"
	}
})
export default styles;