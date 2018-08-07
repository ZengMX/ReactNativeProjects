// 引入官方组件
import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Keyboard,
  Platform,
  TouchableOpacity,
} from 'react-native';
// 引入自定义组件
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';
// 引入隐藏键盘的内部函数
import dismissKeyboard from 'dismissKeyboard';

export default class KeyboardTest extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    // 平台不同，监听的事件名不同
    if (Platform.OS == 'ios') {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
      this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);
    } else {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    }
  }

  // 页面退出时删除听
  componentWillUnmount() {
    this.remove();
  }
  remove = () => {
    if (Platform.OS == 'ios') {
      // this.keyboardDidShowListener.remove();也可
      this.keyboardDidShowListener && Keyboard.removeAllListeners('keyboardWillShow');
      this.keyboardDidHideListener && Keyboard.removeAllListeners('keyboardWillHide');
    } else {
      this.keyboardDidShowListener && Keyboard.removeAllListeners('keyboardDidShow');
      this.keyboardDidHideListener && Keyboard.removeAllListeners('keyboardDidHide');
    }
  }
  keyboardDidShow = (frames) => {
    console.log('键盘高宽', frames.endCoordinates);
  };

  keyboardDidHide = (frames) => {
    console.log('键盘不见了');
  };

  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: 'Keyboard', tintColor: '#fff' }}
      >
        <TouchableOpacity style={styles.btn} onPress={dismissKeyboard} >
          <Text style={styles.text} >点我隐藏键盘</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={this.remove} >
          <Text style={styles.text} >点我清除监听 </Text>
        </TouchableOpacity>
        <TextInput
          style={styles.inputText}
          onSubmitEditing={Keyboard.dismiss}
          placeholder="点我弹出键盘"
        />
      </BaseView>
    );
  }
}

const styles = Styles.create({
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3366FF',
  },
  inputText: {
    height: 45,
    borderColor: '#00FF00',
    borderWidth: '$BW',
    margin: 12,
    borderRadius: 10,
  },
  btn: {
    marginTop: 10,
    marginHorizontal: 10,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#3B5998',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
});