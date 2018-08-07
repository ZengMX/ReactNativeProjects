/**
 * 获取本地图片并进行上传
 * 用法:
 * ImageUploader.show(selectSuccess, uploadSuccess, uploadError)
 * selectSuccess(source, response) source：图片本地路径，response图片选择成功回应对象
 * uploadSuccess(res) 上传成功回调函数，returned with a status code and data.
 * uploadError(err) 上传错误回调函数，detailing the error
 */
import { ImagePicker, Toast } from 'future/src/widgets';
import { Uploader } from 'future/src/lib';
import config from 'future/src/config';

export default class ImageUploader {
	static show(selectSuccess, uploadSuccess, uploadError) {
		ImagePicker.show((source, response) => {
			selectSuccess && selectSuccess(source, response);
			Uploader.doUpload({
				url: config.host + 'app/upload/uploadPhoto.json',
				files: [{
					name: 'imageFile',
					filename: 'image.jpg',
					filepath: response.uri,
					filetype: 'image/jpeg',
				}],
				success: (res) => {
					uploadSuccess && uploadSuccess(res);
				},
				error: (err) => {
					uploadError && uploadError(err);
				}
			});
		});
	}
}
