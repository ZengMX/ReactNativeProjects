import Styles from 'future/public/lib/styles/Styles';

const styles = Styles.create({
	tabStyle: {
		paddingLeft: 0,
		paddingRight: 0,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	tabsContainerStyle: {
		height: 45,
		borderWidth: 0,
		alignItems: 'center',
	},
	topView: {
		width: '$W', 
		height: 55,
		alignItems: 'center',
		justifyContent: 'center'
	},
	topViewItem: {
		width: '$W', 
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12
	},
	orderNum: {
		fontSize: 12,
		color: '#666',
		flex: 1
	},
	orderStat: {
		fontSize: 12,
		color: '#333'
	},
	productView: {
		width: '$W', 
		height: 100,
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10
	},
	productImg: {
		marginLeft: 12,
		width: 80,
		height: 80
	},
	wrap: {
		marginLeft: 12,
		marginRight: 12,
		width: '$W-116',
		height: 100,
	},
	wrap2: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '$W-116',
		height: 13,
	},
	wrap4: {
		marginTop: 15,
		height: 30,
		width: '$W-116',  // 参考计算
		flexDirection: 'row'
	},
	productNm: {
		fontSize: 13,
		color: '#0c1828',
		lineHeight: 16
	},
	bottomView: {
		width: '$W', 
		paddingHorizontal: 12
	},
	wrap3: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		height: 30,
	},
	saveBtn: {
		backgroundColor: 'transparent',
		borderColor: '#72bb38',
		borderWidth: 0.5,
		width: 75,
		height: 27,
		borderRadius: 2,
		justifyContent: 'center',
		alignItems: 'center' 
	},
	stateView: {
		width: (Styles.theme.W-30)/3,  // 常量用法
		height: 32, 
		marginBottom: 10, 
		marginLeft: 6, 
		alignItems: 'center', 
		justifyContent: 'center', 
		borderWidth: '$BW',						// 普通用法
		borderColor: '#8E939A',
		borderRadius: 2,
	},
	//列表
	List:{
		height:130,
		paddingVertical:13,
		backgroundColor:'#fff',
		paddingHorizontal:12,
		justifyContent:'space-between',
	}

});
export default styles;