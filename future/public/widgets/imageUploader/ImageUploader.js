import {ImagePicker, Toast} from 'future/public/widgets';
import {Uploader} from 'future/public/lib';
import config from 'future/public/config';

export default class ImageUploader {
	static show(selectSuccess, uploadSuccess, uploadError, options) {
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
				error: () => {
					uploadError && uploadError()
				}
			});
		},options);
	}
}
