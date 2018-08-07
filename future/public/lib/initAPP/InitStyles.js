import { Platform, PixelRatio } from 'react-native';
import StatusAPI from '@imall-test/react-native-status-android';
import EStyleSheet from 'react-native-extended-stylesheet';
import ThemeSel from '../styles/ThemeDefault';

(function (self) {
	'use strict';
	if (self.StyleInit) {
		return
	}


	EStyleSheet.build(ThemeSel);
	// 初始化EStyleSheet
	if (Platform.OS === 'android') {
		// android skd 19以下无法设置状态栏
		if (Platform.Version > 18) {
			StatusAPI.getStatusHeight((statusHeight) => {
				// 获取android状态栏高度后，更新global.STATUS_HIGHT和常用样式表内的STATUS_HIGHT值
				global.STATUS_HIGHT = statusHeight / PixelRatio.get();
				EStyleSheet.build(Object.assign({}, ThemeSel, {
					STATUS_HIGHT: statusHeight / PixelRatio.get(),// 状态栏高度
				}));
			});
		} else {
			// 获取android状态栏高度后，更新global.STATUS_HIGHT和常用样式表内的STATUS_HIGHT值
			global.STATUS_HIGHT = 0;
			EStyleSheet.build(Object.assign({}, ThemeSel, {
				STATUS_HIGHT: 0,// 状态栏高度
			}));
		}
	} else {
		global.STATUS_HIGHT = 20;
	}
	self.StyleInit = true;
})(typeof self !== 'undefined' ? self : this);
