/**
 * npm install react-native-http-cache --save
 * rnpm link react-native-http-cache
 * 
 * use:
 * import * as httpCache from 'react-native-http-cache';
 * httpCache.getHttpCacheSize();
 * 
 * bug:
 *  http://bbs.reactnative.cn/topic/535/
 *  imageLoader的线程队列还没有创建，我就调用了，就会出现线程错误
 * 临时使用setTimeout解决，一般不会触发这个bug
 *  //setTimeout(()=>this.getData(), 5000);
 */