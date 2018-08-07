import Styles from 'future/public/lib/styles/Styles';
import {
	PixelRatio,
	Image,
	StyleSheet,
	Platform
} from 'react-native';
var fullWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;

const styles = Styles.create({
	//弹层背景
	float: {
		bottom: 0,
		flex: 1,
		width: fullWidth
	},
	promoteView: {
		position: "absolute",
		bottom: 0,
		height: 293,
		width: fullWidth,
		backgroundColor: "#fff",
		justifyContent: "space-between"
	},
	shoppingView: {
		position: "absolute",
		bottom: 0,
		width: fullWidth,
		backgroundColor: "#fff",
		justifyContent: "space-between"
	},
	//顶部商品数据（名称、价格、类型）
	prdName: {
		color: "#000",
		fontSize: 14
	},
	prdPrice: {
		color: "#fd790f",
		fontSize: 15
	},
	prdType: {
		flex: 1,
		color: "#666",
		fontSize: 11,
	},
	//属性
	paramsRow: {
		width: fullWidth,
		height: 60,
		backgroundColor: "#fff",
		flexDirection: 'row',
		borderBottomColor: "#eee",
		borderBottomWidth: 1 / PixelRatio.get()
	},
	leftParam: {
		flex: 1,
		height: 69,
		backgroundColor: "#fff",
		borderRightColor: "#eee",
		borderRightWidth: 1 / PixelRatio.get(),
		justifyContent: "space-between",
		paddingVertical: 13
	},
	rightParam: {
		flex: 1,
		height: 69,
		backgroundColor: "#fff",
		justifyContent: "space-between",
		paddingVertical: 13
	},
	paramTopText: {
		marginLeft: 12,
		color: "#8495a2",
		fontSize: 12
	},
	paramBottomText: {
		marginLeft: 12,
		color: "#81b1da",
		fontSize: 10
	},
	//行选项
	row: {
		flex: 1,
		height: 45,
		backgroundColor: "#fff",
		justifyContent: 'space-between',
		paddingHorizontal: 12,
		alignItems: 'center',
		flexDirection: 'row'
	},
	rowText: {
		color: "#555",
		fontSize: 13
	},


	// 弹层
  modal: {
    width: '$W',
    position: 'absolute',
    bottom: 0,
  },
  // 弹层内商品信息
  productBox: {
    paddingHorizontal: 10,
    backgroundColor: '#fafafa',
	height: 166,
  },
  productTitleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12
  },
  productTitle: {
    fontSize: 15,
	color: '#333',
	flex:1
  },
  productspecPack: {
    fontSize: 12,
    color: '#74818B',
    marginTop: 8
  },
  productprice: {
    marginTop: 13,
    fontSize: 14,
    color: '#333',
    paddingRight: 26
  },
  productStockRange: {
    marginTop: 14,
    fontSize: 11,
    color: 'rgb(50,50,50)'
  },
  // 采购
  purchaseBox: {
    paddingHorizontal: 10,
    backgroundColor: '#fff'
  },
  purchaseTitleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 13
  },
  purchaseTitleLeft: {
    fontSize: 14,
    color: '#333',
  },
  purchaseTitleRight: {
    fontSize: 12,
    color: '#333',
  },
  purchaseInputBox: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 18,
    marginTop: 18,
    borderBottomColor: '#e5e5e5',
    borderBottomWidth: '$BW',
  },
  purchaseInput: {
    fontSize: 40,
    paddingLeft: 6,
    color: '#f60',
    width: 90,
    height: 40,
    // lineHeight:40,
    // textAlignVertical:'bottom',
  },
  purchaseUnit: {
    color: '#333',
    fontSize: 13,
    flex: 1,
    marginBottom: 5,
  },

  // 包装
  packTitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 5,
  },
  packPrice: {
    fontSize: 13,
    color: '#333',
  },

  // 按键
  btn: {
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: '#3491df',
    marginTop: 15,
    marginBottom: 10,
    height: 40,
    width: '$W - 20',
    borderRadius: 5
  },
  btnTitle: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
  },
  KeyboardBtn: {
		width: fullWidth / 4, height: 54 * Styles.theme.IS, justifyContent: 'center', alignItems: 'center', borderWidth: 1 / PixelRatio.get(), borderColor: '#e5e5e5',
	}
});
export default styles;
