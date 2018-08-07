/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 * textinput的一些属性 autoFocus是够自动获得焦点       placeholder提示语      defaultValue初始值  secureTextEntry是否为密码输入框
 * onchange输入框值改变时回调函数
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';

class pickerApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeValue : null
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          {this.state.changeValue}
        </Text>
        <View style={{ borderBottomColor: '#000000', borderBottomWidth: 1, }}> 
           <TextInput 
           style={{width:300,height:40}} 
           autoFocus={true}
           onChangeText={(value)=>{this.setState({changeValue:value})}}
           onChange={()=>{console.log('changeValueing!')}}
           placeholder='点击输入框输入'/>
        </View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('pickerApp', () => pickerApp);
