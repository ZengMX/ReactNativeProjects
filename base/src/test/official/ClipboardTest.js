// 引入官方组件
import React, { Component } from 'react';
import {
  Clipboard,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
// 引入自定义组件
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';

export default class ClipboardTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      clipboard: '',
    };
  }


  //设置Clipboard
  setClipboard = () => {
    Clipboard.setString(this.state.input);
  };

  //读取Clipboard
  getClipboard = async () => {
    try {
      let clipboard = await Clipboard.getString();
      this.setState({ clipboard });
    } catch (e) {
      Alert.alert(e.message);
    }
  };


  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: 'Clipboard', tintColor: '#fff' }}
      >

        <TextInput
          style={styles.textInput}
          value={this.state.input}
          onChangeText={input => { this.setState({ input }) }}
        />
        <TouchableOpacity onPress={this.setClipboard} style={styles.btn}>
          <Text style={styles.btnText}>点击设置Clipboard内容</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.getClipboard} style={styles.btn}>
          <Text style={styles.btnText}>点击显示Clipboard内容</Text>
        </TouchableOpacity>
        <Text style={styles.content}> 下面是从Clipboard读取的内容 </Text>
        <Text style={styles.content}> {this.state.clipboard} </Text>
      </BaseView>
    );
  }
}

const styles = Styles.create({
  textInput: {
    marginTop: 10,
    marginHorizontal: 10,
    height: 45,
    borderColor: '#3333FF',
    borderWidth: '$BW',
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
  btnText: {
    color: 'white',
  },
  content: {
    marginTop: 10,
    marginHorizontal: 10,
  },
});