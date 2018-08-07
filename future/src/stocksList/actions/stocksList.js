import * as types from './ActionTypes';
import Fetch from 'future/public/lib/Fetch';
import { Toast } from 'future/public/widgets';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

//保存普通购物车商品数量
export function setShoppingCartNum(data){
	RCTDeviceEventEmitter.emit('setTabBadge', { idx: 2, text: data });	//设置进货单的BadgeNumber
	return {
		type : types.SHOPPINGCART_NUM,
		data 
	};
}
//保存近效期购物车商品数量
export function setExpiryDateShoppingCartNum(data){
	return {
		type : types.SHOPPINGCART_EXPIRYDATE_NUM,
		data 
	};
}

// 保存购物车数据
export function saveCart(data) {
	return {
		type: types.CART_DETAIL,
		data
	}
}

export function getCart() {
	return (dispatch) => {
		return new Fetch({
			url: 'app/cart/getShoppingCartList.json',
			method: 'POST',
			data: {
				type: 'normal'
			}
		}).dofetch().then((data) => {
			// dispatch(saveCart(data.result));
			dispatch(setShoppingCartNum(data.cartList.allProductNum));
			return data.result;
		});
	}
}

/**
 * 添加商品到指定类型购物车
 * data数据格式：
 * let cartData = {
 *		type : "normal",
 *		handler : "sku",
 *		objectId : this.state.skuId,
 *		quantity : this.state.buyNum,
 *	};
 */
export function addToCart(cartData, successCallback, errorCallback, actionUrl) {
	let url = null;
	if (actionUrl != null) {
		url = actionUrl;
	} else {
		url = "/app/cart/add.json";
	}
	return (dispatch) => {
		return new Fetch({
			url: url,
			method: 'POST',
			data: cartData
		}).dofetch().then((data) => {
			if (data && data.success === true) {				
				successCallback && successCallback();
				if(cartData.type == 'normal'){
					dispatch(setShoppingCartNum(data.allProductNum));
				}
			}
		}).catch((err)=>{
			console.log("加入"+cartData.type+"购物车错误:",err);
			errorCallback && errorCallback(err);
			// return err;
		});
	}
}

/**
 * 添加多个商品到指定类型购物车
 * data数据格式：
 * let cartData = {
 *		type : "normal",
 *		handler : "sku",
 *		objectIdQuantityStr : objectIdQuantityStr,
 *	};
 */
export function addItemsToCart(cartData, successCallback, errorCallback, actionUrl) {
	let url = null;
	if (actionUrl != null) {
		url = actionUrl;
	} else {
		url = "/app/cart/addItems.json";
	}
	return (dispatch) => {
		return new Fetch({
			url: url,
			method: 'POST',
			data: cartData
		}).dofetch().then((data) => {
			if (data && data.success === true) {
				successCallback && successCallback(data);
				if(cartData.type == 'normal'){
					dispatch(setShoppingCartNum(data.cartNum));
				}
			}
		}).catch((err)=>{
			// Toast.show(err);
			console.log("多商品加入"+cartData.type+"购物车错误:",err);
			errorCallback && errorCallback(err);
		});
	}
}

export function cartChangePrdNums(type,quantity,itemKey,orgId,successCallback,errorCallback){
	return (dispatch)=> {
		new Fetch({
			url: 'app/cart/updateQuantity.json',
			method: 'POST',
			data: {
				type:type,
				handler:'sku',
				itemKey:itemKey,
				quantity:quantity,
				orgId:orgId
			},
		}).dofetch().then((data) => {
			successCallback&&successCallback(data);
			dispatch(setShoppingCartNum(data.cartList.allProductNum));
		}).catch((error) => {
			errorCallback&&errorCallback(error)
			console.log('获取进货单数据失败:', error);
		});
	}
	
}