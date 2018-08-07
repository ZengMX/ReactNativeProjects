import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  NativeModules,
  Image
} from 'react-native';
import { BaseView } from 'future/src/widgets';
import BlurView from '@imall-test/react-native-blur';
const screenWidth = require('Dimensions').get('window').width;
const screenHeight = require('Dimensions').get('window').height;

export default class Blur extends Component {
  render() {
    return (
      <BaseView navigator={this.props.navigator} ref={base => this.base = base}>
        <View>
          <View style={{ width: screenWidth, height: screenHeight }}>
            <Image style={{ width: screenWidth, height: screenHeight }} source={require('./res/bg_1.jpg')}></Image>
          </View>
          <BlurView
            style={{ width: 400, height: 400, position: 'absolute', top: 100, left: 10 }}
            zoomLevel={5}
            blurRadius={5}
          />
          <View style={{ width: screenWidth, height: 500, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 0 }}>
            <Text style={{ width: 100, height: 100 }}>
              Welcome to React Native!
            </Text>
          </View>
        </View>
      </BaseView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
