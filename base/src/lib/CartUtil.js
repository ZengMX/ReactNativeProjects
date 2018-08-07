// 设置底部Tab右上角数字
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

exports.setCartNum = function (type, info) {
	if (type == 'normal') {
		RCTDeviceEventEmitter.emit('setTabBadge', { idx: 3, text: info <= 0 ? null : info });
	}
}