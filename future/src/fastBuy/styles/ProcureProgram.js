import Styles from 'future/public/lib/styles/Styles';

const styles = Styles.create({
  // 计划
  list: {
    height: 35,
    width: '$W',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  listText: {
    color: '#53606A',
    fontSize: 14,
    marginLeft: 20,
    flex: 1,
  },
  listImage: {
    height: 10,
    width: 15,
    resizeMode: 'contain',
    marginRight: 30,
  },

  // 导航栏
  head: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headTitle: {
    color: '#333',
    fontSize: 18,
  },
  headImg: {
    width: 10,
    height: 5,
    resizeMode: 'contain',
    marginLeft: 5,
  },
  headBtn: {
    height: 44,
    justifyContent: 'center',
    marginHorizontal: 13,
  },
  headBtnTitle: {
    color: '#444',
    fontSize: 16,
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