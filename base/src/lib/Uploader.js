/**
A React Native module for uploading files and camera roll assets in Android and iOS. 
https://github.com/tranquangvu/react-native-uploader
示例参考/src/widgets/imageUploader/ImageUploader.js
用法：
Uploader.doUpload(args) args是一个对象，属性：
url 上传地址
files 上传文件对象数组
params 附加选项
success 上传成功回调函数，returned with a status code and data.
error 上传错误回调函数，detailing the error
 */
import { Platform } from 'react-native';
var RNUploader = require('react-native-uploader');
export default class Uploader {
  static doUpload(args) {
    let opts = {
      url: args.url,
      files: args.files,
      method: 'POST',                             // optional: POST or PUT
      headers: { 'Accept': 'application/json' },  // optional
      params: Object.assign({ size: '100X100' }, args.params),   // optional
    };
    RNUploader.upload(opts, (err, response) => {
      // console.log('文件上传RNUploader==>>>', response);
      if (err) {
        args.error && args.error(err);
        return;
      }
      if (Platform.OS == 'android') {
        args.success && args.success(JSON.parse(response));
      } else {
        args.success && args.success(JSON.parse(response.data));
      }
    });
  }
}
