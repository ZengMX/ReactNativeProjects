import * as types from '../actions/ActionTypes';

const initialState = {
	shoppingCartNum : 0,
	expiryDateShoppingCartNum : 0,
}




export default function ShoppingCart(state = initialState, action = {}) {

	switch (action.type) {
		case types.SHOPPINGCART_NUM:
			return Object.assign(
				{}, state, { shoppingCartNum : action.data }
			)
		case types.SHOPPINGCART_EXPIRYDATE_NUM:
			return Object.assign(
				{}, state, { expiryDateShoppingCartNum : action.data }
			)
		case types.CART_DETAIL:
			return Object.assign(
				{}, state,{ shoppingCartData : action.data } 
				// {}, state, action.data 
			);
		default:
			return state;
	}
}
