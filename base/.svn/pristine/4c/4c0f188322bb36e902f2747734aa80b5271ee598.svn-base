import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  NativeModules,
  Button
} from 'react-native';
import { BaseView } from 'future/src/widgets';
import RCTRipple from '@imall-test/react-native-ripple';
const screenWidth = require('Dimensions').get('window').width;
const screenHeight = require('Dimensions').get('window').height;

export default class RippleAndroid extends Component {
  render() {
    let content = null
    if (!IS_IOS) { // IS_IOS是全局变量,在base/src/lib/initAPP/InitGlobal中配置
      content = <View style={styles.container}>
        <RCTRipple style={styles.ripple}>
          <Text>Text</Text>
        </RCTRipple>
      </View>
    }
    return (
      <BaseView navigator={this.props.navigator} ref={base => this.base = base}>
        {content}
      </BaseView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ripple: {
    width: 150,
    height: 40,
    backgroundColor: "red",
    marginTop: 10
  },
});
