
import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

export default class {
	static init(){
		global.storage = new Storage({
			// maximum capacity, default 1000
			// 最大容量，默认值1000条数据循环存储
			size: 1000,

			// 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
			defaultExpires: null,//1000 * 3600 * 24

			// 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
			// 如果不指定则数据只会保存在内存中，重启后即丢失
			storageBackend: AsyncStorage,

			// cache data in the memory. default is true.
			/// 读写时在内存中缓存数据。默认启用。
			enableCache: true,
			
			// 如果storage中没有相应数据，或数据已过期，
			// 则会调用相应的sync同步方法，无缝返回最新数据。
			// if data was not found in storage or expired,
			// the corresponding sync method will be invoked and return
			// the latest data.
			sync : {	
			}
		})
	}
}
// 最好在全局范围内创建一个（且只有一个）storage实例，方便直接调用

// 对于web
// window.storage = storage;

// 对于react native
// global.storage = storage;

// 这样在之后的任意位置即可以直接调用storage