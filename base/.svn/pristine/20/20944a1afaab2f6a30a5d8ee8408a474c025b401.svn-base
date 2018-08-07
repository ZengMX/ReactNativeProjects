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
export function show(message, params) {
	// 默认属性
	var _params = {
		position: 0, // 居中
		duration: Toast.durations.SHORT,
		animation: true,
		delay: 0,
	}
	for (let key in params) {
		_params[key] = params[key];
	}
	return Toast.show(message, _params);
}