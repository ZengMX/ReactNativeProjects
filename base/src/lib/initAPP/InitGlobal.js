// 存在的全局变量
//global.storage storage实例
//global.userCookie 当前用户的cookie 会同步存储在AsyncStorage(key:IMALL_COOKIES)、cookie(name)中
import { Platform } from 'react-native';
// 使用平台判断
global.IS_IOS = Platform.OS == 'ios';
// APP启动时间
global.APP_LAUNCH_TIME = new Date();
// 状态栏高度，当前仅用于android，ios固定为20dp
global.STATUS_HIGHT = 20;
