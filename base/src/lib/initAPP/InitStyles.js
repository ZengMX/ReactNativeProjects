import {
	Platform,
	StatusBar
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
// 引入常用样式变量表
import ThemeDefault from 'future/src/lib/styles/ThemeDefault';

(function (self) {
	'use strict';
	if (self.StyleInit) {
		return
	}
	// 利用react-native-extended-stylesheet创建内部全局变量
	// 此后页面用此组件创建样式表都可用这里创建的变量
	EStyleSheet.build(ThemeDefault);

	if (Platform.OS === 'android') {
		// android skd 19以下无法设置状态栏
		// 获取android状态栏高度后，更新global.STATUS_HIGHT和常用样式表内的STATUS_HIGHT值
		if (Platform.Version > 18) {
			global.STATUS_HIGHT = StatusBar.currentHeight;
			EStyleSheet.build({ ...ThemeDefault, STATUS_HIGHT });
		}
	}
	self.StyleInit = true;
})(typeof self !== 'undefined' ? self : this);