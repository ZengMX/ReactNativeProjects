/**
 * 使用react-native-image-picker依赖
 * https://github.com/marcshilling/react-native-image-picker
 *
 * 调用时的选项:
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
 * 返回数据属性：
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  PixelRatio,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
import { BaseView } from 'future/src/widgets/';
import ImagePicker from '@imall-test/react-native-image-picker';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarSource: null
    }
  }

  selectPhotoTapped = () => {
    const _options = {
      title: '选择图片',  //根据设计师的要求暂时不用title
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
    ImagePicker.showImagePicker(_options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either:
        //const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        // var source;
        // if (Platform.OS === 'android') {
        //   source = { uri: response.uri, isStatic: true };
        // } else {
        //   source = { uri: response.uri.replace('file://', ''), isStatic: true };
        // }

        this.setState({
          avatarSource: { uri: response.uri }
        });
      }
    });
  }

  render() {
    return (
      <BaseView style={{ flex: 1 }}
        navigator={this.props.navigator}>

        <View style={styles.container}>
          <TouchableOpacity onPress={this.selectPhotoTapped}>
            <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 20 }]}>
              {this.state.avatarSource === null ? <Text>Select a Photo</Text> :
                <Image style={styles.avatar} source={this.state.avatarSource} />
              }
            </View>
          </TouchableOpacity>
        </View>
      </BaseView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150
  }
});
