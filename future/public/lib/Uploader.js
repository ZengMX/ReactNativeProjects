
import {Platform} from 'react-native';
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
		console.log('inininininin',RNUploader);
		RNUploader.upload(opts, (err, response) => {
			console.log('this is error upload',err);
			if (err) {
				console.log('this is error');
				args.error && args.error(err);
				return;
			}
			console.log('RNUploader———upload—>>>',response);
			if(Platform.OS == 'android'){
				args.success && args.success(JSON.parse(response));
			}else{
				args.success && args.success(JSON.parse(response.data));
			}
		});
	}
}
//https://github.com/tranquangvu/react-native-uploader
//user
// npm install https://github.com/tranquangvu/react-native-uploader.git —save
// rnpm link react-native-uploader
