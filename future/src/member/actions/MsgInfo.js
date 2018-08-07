import * as types from './ActionTypes';
import {
	Fetch,
} from 'future/public/lib';

export function setMsgNum(number){
	return {
		type: types.SET_MSGNUMBER,
		data: number,
	}
}

export function getMsgNum(){
	return (dispatch)=>{
		return new Fetch({
			url: '/app/push/getUnReadNum.json',
			data: {
				messageIndexType: 2,
			}
		}).dofetch().then((data)=>{
			if(data.success){
				dispatch(setMsgNum(data.unReadNum));
			}else{
				dispatch(setMsgNum(0));
			}
			return data;
		})
	}
}