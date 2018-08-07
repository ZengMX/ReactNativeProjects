/**
 * Created by timhuo on 2017/2/4.
 * 功能完成 2/27
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  NativeAppEventEmitter,
  DeviceEventEmitter,
  Platform,
} from 'react-native';
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';

// import ImallVersion from '@imall-test/react-native-imall-version';

export default class ImallVersionTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      versionName: '',
      versionCode: ''
    }
  }
  onBtnPress = () => {
    // ImallVersion.getCFBundleShortVersionString((version) => {
    //   console.log('version', version);
    //   this.setState({
    //     versionName: version.versionName,
    //     versionCode: version.versionCode
    //   });
    // });
  }
  render() {
    return (
      <BaseView navigator={this.props.navigator}>
        <TouchableOpacity style={styles.btnStyle} onPress={this.onBtnPress}>
          <Text>获取版本</Text>
        </TouchableOpacity>
        <View>
          <Text>组件未安装</Text>
          <Text>{`versionName:${this.state.versionName}\nversionCode:${this.state.versionCode}`}</Text>
        </View>
      </BaseView>
    );
  }
}

const styles = Styles.create({
  btnStyle: {
    padding: 20,
    backgroundColor: 'yellow'
  }
});