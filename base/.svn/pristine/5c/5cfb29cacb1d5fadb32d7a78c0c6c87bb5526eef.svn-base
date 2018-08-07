/**
 * 使用react-native-image-picker依赖
 * https://github.com/marcshilling/react-native-image-picker
 *
 * npm install react-native-image-picker@latest --save
 * rnpm link react-native-image-picker
 *
 * options:
 *  title: 'Select Avatar', // 选择框title, null时不显示
 *  cancelButtonTitle: 'Cancel', // 取消按钮title, null时不显示
 *  takePhotoButtonTitle: 'Take Photo...', // 拍照按钮title, null时不显示
 *  chooseFromLibraryButtonTitle: 'Choose from Library...', // 从相册选择按钮title, null时不显示
 *  // 自定义按钮
 *  customButtons: {
 *      'Choose Photo from Facebook': 'fb', // [Button Text] : [String returned upon selection]
 *  },
 *  cameraType: 'back', // 前摄像头还是后摄像头 'front' or 'back'
 *  mediaType: 'photo', // 图片还是视频 'photo' or 'video'
 *  videoQuality: 'high', //视频质量 'low', 'medium', or 'high'
 *  durationLimit: 10, // 视频录制的最大时间秒
 *  maxWidth: 100, // 图片最大宽度,最终返回的像素
 *  maxHeight: 100, // 图片最大高度,最终返回的像素
 *  aspectX: 2, // android only - aspectX:aspectY, 裁剪图像的宽度与高度的比值
 *  aspectY: 1, // android only - aspectX:aspectY, 裁剪图像的宽度与高度的比值
 *  quality: 0.2, // 0 到 1, 图片质量
 *  angle: 0, // android only, photos only, 图片角度
 *  allowsEditing: false, // 图片编辑
 *  noData: false, // 是否返回base64 data数据
 *  storageOptions: { // 如果设置该值，将保存图片, 安卓保存到用户相册
 *      skipBackup: true, // ios only - 跳过icloud备份
 *      path: 'images' //ios only - 保存文件到 /Documents/images
 *  }
 *
 *
 * use:
 *  import ImagePicker from './ImagePicker';
 *  const options = {
 *    quality: 0.5
 *  };
 *
 *  ImagePicker.show((source, response) => {
 *        // do something
 *  });
 * static show(success, options, cancel, error, callback)
 * success(source, response) source：图片本地路径，response图片选择成功回应对象
 * options 选择图片选项，即上面的介绍
 * cancel() 用户取消回调函数
 * error(response) 错误回调函数，response为图片选择错误回应对象
 * callback(response) 自定义回调函数,response图片选择后的回应对象
 */
import { Platform } from 'react-native';
import ImagePickerManager from '@imall-test/react-native-image-picker';
export default class ImagePicker {
	static show(success, options, cancel, error, callback) {
		const _options = {
			title: '',  //根据设计师的要求暂时不用title
			takePhotoButtonTitle: '拍照',
			chooseFromLibraryButtonTitle: '选择本地照片',
			cancelButtonTitle: '取消',
			quality: 0.5,
			maxWidth: 300,
			maxHeight: 300,
			storageOptions: {
				skipBackup: true
			},
			allowsEditing: true
		};
		for (let key in options) {
			_options[key] = options[key];
		}
		ImagePickerManager.showImagePicker(_options, (response) => {
			// console.log('图片选择ImagePicker =>>>', response);

			if (response.didCancel) {
				cancel && cancel();
			} else if (response.error) {
				error && error(response);
			} else {

				// You can display the image using either:
				//const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
				var source;
				if (Platform.OS === 'android') {
					source = { uri: response.uri, isStatic: true };
				} else {
					source = { uri: response.uri.replace('file://', ''), isStatic: true };
				}
				success && success(source, response);
			}
			callback && callback(response);
		});
	}
}
