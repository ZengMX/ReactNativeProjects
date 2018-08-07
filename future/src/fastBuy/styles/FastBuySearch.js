import Styles from 'future/public/lib/styles/Styles';

const styles = Styles.create({
  // 搜索框
  search: {
    height: 30,
    width: '$W - 73',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 13,
    marginRight: 60,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  searchImg: {
    resizeMode: 'contain',
    width: 15,
    height: 15,
    marginLeft: 10,
  },
  searchKeyword: {
    marginLeft: 7,
    height: 30,
    fontSize: 13,
    color: '#333',
    flex: 1,
    paddingVertical: 0,
  },
  // 商品列表
  list: {
    height: 145,
    width: '$W-13',
    marginLeft: 13,
    borderBottomColor: '#eee',
    borderBottomWidth: '$BW',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
  },
  listTitle: {
    fontSize: 15,
    color: '#333',
    marginVertical: 5,
  },
  listSpecPack: {
    fontSize: 12,
    color: '#8495A2',
    // marginBottom: 10,
  },
  listPrice: {
    fontSize: 13,
    color: '#f60',
    // marginTop: 18
  },
  listPriceNum: {
    fontSize: 18,
    marginVertical: 8,
  },
  listBtn: {
    position: 'absolute',
    right: 15,
    bottom: 13,
  },
  listImg: {
    width: 34,
    height: 34,
    resizeMode: 'contain'
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
    width: '$W * 0.5',
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

  // 进货单弹层 
  toCartBox: {
    // marginTop: IS_IOS ? 74 : 54,
    height: 69,
    width: '$W-20',
    marginHorizontal: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    borderColor: '#ddd', // TODO:添加阴影效果后修改这里
	borderWidth: '$BW',
	position: 'absolute',
	zIndex: 99,
	top:IS_IOS ? 74 : 74
  },
  toCartNumberBox: {
    marginLeft: 15,
    marginRight:10,
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toCartNumberImg: {
    height: 22,
    width: 26,
    resizeMode: 'contain',
  },
  toCartNumber: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 13,
    width: 13,
    backgroundColor: '#f60',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6.5,
  },
  toCartNumberTitle: {
    fontSize: 10,
    color: '#fff',
  },
  toCartTotal: {
    fontSize: 12,
    color: '#333',
    flex:1,
  },
  toCartSymbol: {
    fontSize: 13,
  },
  toCartMoney: {
    fontSize: 18,
  },
  toCartBtn: {
    height: 30,
    width: 100,
    backgroundColor: '#f60',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },
  toCartBtnTitle: {
    fontSize: 14,
    color: '#fff',
  },


});

export default styles;
