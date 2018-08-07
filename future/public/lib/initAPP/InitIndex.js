
import { NetInfo } from 'react-native';
import { Storage, ImallCookies } from 'future/public/lib';
import config from 'future/public/config';

if (config.debug != true) {
  //任何reactnative红页错误都会被捕捉，但是页面会死掉可以发送一个通知出来 默认的通知事件是返回上一页
  var errUtils = require('ErrorUtils').setGlobalHandler(function (err) {
    alert('发生未知错误!');
  });
  // 发布时屏蔽log
  console.log = () => { };
  console.disableYellowBox = true;
}

// 引入并执行分类初始化任务文件
import './InitGlobal';
import './InitNumber';
import './InitString';
import './InitFetch';
import './InitStyles';
import './InitDate';
// 初始化storage实例，方便直接调用
Storage.init();

// 初始化当前用户的cookie 会同步存储在AsyncStorage(key:IMALL_COOKIES)、cookie(name)中
ImallCookies.init();

//网络状态监听，用于解决IOS的bug
NetInfo.isConnected.addEventListener('change', () => { });

// 由于react-native-root-toast、react-native-root-siblings 内部调用的是AppRegistry.registerComponent方法，
// 所以要先引用一次，解决消息不显示的bug
import RootBug from 'react-native-root-toast';
