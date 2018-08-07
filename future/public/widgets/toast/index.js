/**
 * https://github.com/magicismight/react-native-root-toast
 * 
 * params:
 * duration 	Toast.durations.SHORT 	Number 	The duration of the toast. (Only for api calling method)
 * visible 	false 	Bool 	The visibility of toast. (Only for Toast Component)
 * position 	Toast.positions.BOTTOM 	Number 	The position of toast showing on screen (A negative number represents the distance from the bottom of screen. A positive number represents the distance form the top of screen. 0 will position the toast to the middle of screen.)
 * animation 	true 	Bool 	Should preform an animation on toast appearing or disappearing.
 * shadow 	true 	Bool 	Should drop shadow around Toast element.
 * delay 	0 	Number 	The delay duration before toast start appearing on screen.
 * onShow 	null 	Function 	Callback for toast`s appear animation start
 * onShown 	null 	Function 	Callback for toast`s appear animation end
 * onHide 	null 	Function 	Callback for toast`s hide animation start
 * onHidden 	null 	Function 	Callback for toast`s hide animation end
 * 
 */
import Toast from 'react-native-root-toast';
let toast = null;
let messageTemp = null;
export function show(message, params) {
	//防止toast重复内容弹出
	if (messageTemp == null) {
		messageTemp = message;
	} else if (messageTemp == message) {
		return;
	} else { 
		if (toast != null) { 
			Toast.hide(toast);
			messageTemp = message;
		}
	}

	var _params = {
		position : 0,
		duration : Toast.durations.SHORT,
		animation : true,
		delay: 0,
		onHidden: () => {
			//恢复初始状态，外部覆盖调用的时候不要忘记加上
			toast = null;
			messageTemp = null;
		}
	}
	for (let key in params) {
		if (key == 'onHidden') { continue}
		_params[key] = params[key];
	}
	console.log('Toast show params > ', _params);
	toast=Toast.show(message, _params);
	return toast;
}
//BackAndroid.exitApp()退出应用需要手动清空toast，messageTemp变量，
//因为应用退出后，不触发onHidden()事件
export function clear() { 
	toast = null;
	messageTemp = null;
}