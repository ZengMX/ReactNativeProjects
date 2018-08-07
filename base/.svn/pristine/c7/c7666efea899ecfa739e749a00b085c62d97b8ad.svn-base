/**
 * 图片选择测试
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
import {
  BaseView,
  ImageUploader,
  Loading,
  Toast,
} from 'future/src/widgets';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarSource: null
    }
  }

  selectPhotoTapped() {
    ImageUploader.show((source, res) => {
      this.setState({
        avatarSource: source
      });
      //选择成功
      // console.log('图片选择成功', source, res);
      Loading.show();
    }, (res) => {
      //上传成功
      // console.log('图片上传成功', res);
      Loading.hide();
    }, () => {
      //上传失败
      Loading.hide();
      Toast.show('图片上传失败');
    });
  }

  render() {
    return (
      <BaseView style={{ flex: 1 }}
        navigator={this.props.navigator}>

        <View style={styles.container}>
          <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
            <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 20 }]}>
              {
                this.state.avatarSource === null
                  ?
                  <Text>Select a Photo</Text>
                  :
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
