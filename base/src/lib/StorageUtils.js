/**
 操作AsyncStorage
 示例
 import StorageUtils from 'future/src/lib/StorageUtils';
 1.保存
 StorageUtils.saveInfo(key, data);
 2.删除
 StorageUtils.removeInfo(key);
 3.读取
 StorageUtils.readInfo(key).then(ret => {
   // console.log(ret);
 }).catch(err => {
  // console.log(err);
 });
*/

//keys要读取的key
var read = function readInfo(keys) {
	var promise = new Promise((resolve, reject) => {
		global.storage.load({
			key: keys,
			autoSync: true,
			syncInBackground: true
		}).then(ret => {
			// console.log("storage data", ret);
			resolve(ret);
		}).catch(err => {
			switch (err.name) {
				case 'NotFoundError':
					reject("NotFoundError");
					break;
				case 'ExpiredError':
					reject("ExpiredError");
					break;
			}
		});
	});
	return promise;
}
//key 给数据设置一个key data 要保存的数据。注意:请不要在key中使用_下划线符号!
var save = function saveInfo(keys, datas) {
	if (keys && datas) {
		global.storage.save({
			key: keys,
			rawData: {
				data: datas,
			},
			expires: null
		});
	} else {
		console.log("key data 不能为空");
	}
}
// 删除单个key下数据
var remove = function removeInfo(keys) {
	if (keys) {
		global.storage.remove({
			key: keys,
		});
	}
}

var getId = function getIdsForKey(keys) {
	if (keys) {
		global.storage.getIdsForKey(keys).then(key => {
			// console.log("ids getIdsForKey", key);
		});
	}
}

var getAll = function getAllDataForKey(keys) {
	if (keys) {
		global.storage.getAllDataForKey(keys).then(data => {
			// console.log("data getAllDataForKey", data);
		});
	}
}
const methods = {
	get saveInfo() { return save; },
	get readInfo() { return read; },
	get removeInfo() { return remove; },
	get getIdsForKey() { return getId; },
	get getAllDataForKey() { return getAll; },
}
module.exports = methods;

// isHasKey(keys){
// 		var isHas = new Promise((resolve,reject)=>{
//             global.storage.getIdsForKey("info").then(ids => {
// 				console.log("keys===",ids);
// 				if(ids.length != 0){
// 					resolve(true);
// 				}else{
// 					reject(false);
// 				}
//             });
// 		});
//         return isHas;
// 	}