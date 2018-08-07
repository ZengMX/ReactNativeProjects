import {
	PixelRatio,
	StyleSheet
} from 'react-native';

export default styles = StyleSheet.create({
	tabStyle: {
		paddingLeft: 0,
		paddingRight: 0,
		flex: 1,
		height: 30,
		alignItems: 'center',
		justifyContent: 'center',
	},
	tabsContainerStyle: {
		height: 35,
		borderWidth: 0,
		alignItems: 'center',
	},
	citySendShopBtn: {
		height: 40,
		paddingHorizontal: 10,
		borderBottomWidth: 1 / PixelRatio.get(),
		borderBottomColor: '#e5e5e5'
	},
	citySendShop: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},

	orderNotice: {
		flexDirection: "row",
		alignItems: 'center',
		height: 25,
		backgroundColor: '#fff7eb',
		paddingHorizontal: 10
	},

	orderNum: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingHorizontal: 10,
		paddingVertical: 10,
		borderBottomWidth: 1 / PixelRatio.get(),
		borderBottomColor: '#e5e5e5'
	},

	normalPrd: {
		height: 100,
		flexDirection: 'row',
		paddingHorizontal: 10,
		borderBottomWidth: 1 / PixelRatio.get(),
		borderBottomColor: '#e5e5e5'
	},

	giftCardPrd: {
		height: 85,
		flexDirection: 'row',
		paddingHorizontal: 10,
		borderBottomWidth: 1 / PixelRatio.get(),
		borderBottomColor: '#e5e5e5'
	},

	integralPrd: {
		height: 100,
		flexDirection: 'row',
		paddingHorizontal: 10,
		borderBottomWidth: 1 / PixelRatio.get(),
		borderBottomColor: '#e5e5e5'
	},

	orderAmount: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingVertical: 15,
		paddingHorizontal: 10,
		borderBottomWidth: 1 / PixelRatio.get(),
		borderBottomColor: '#e5e5e5'
	},
	groupDepositAmount: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingVertical: 15,
		paddingHorizontal: 10,
		borderBottomWidth: 1 / PixelRatio.get(),
		borderBottomColor: '#e5e5e5'
	},
	orderBtnWrap: {
		flexDirection: 'row',
		height: 68,
		paddingHorizontal: 10,
		alignItems: 'center',
		borderBottomWidth: 1 / PixelRatio.get(),
		borderBottomColor: '#e5e5e5'
	},
	leftBtn: {
		flex: 1,
		height: 37,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 14,
		borderColor: '#e5e5e5',
		borderRadius: 8,
		borderWidth: 1 / PixelRatio.get(),
		backgroundColor: '#fff'
	},
	rightBtn: {
		flex: 1,
		height: 37,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 14,
		borderColor: '#e5e5e5',
		borderRadius: 8,
		borderWidth: 1 / PixelRatio.get(),
		backgroundColor: '#2fbdc8'
	}
})