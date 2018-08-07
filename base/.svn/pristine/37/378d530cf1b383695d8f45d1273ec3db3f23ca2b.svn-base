// 引入官方组件
import React, { Component } from 'react';
import {
  AsyncStorage,
  Picker,
  Text,
  View,
} from 'react-native';
// 引入自定义组件
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';


const STORAGEKEY = 'AsyncStorageKey';
const COLORS = ['red', 'orange', 'yellow', 'green', 'blue'];


export default class AnimatedTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: COLORS[0],
      messages: [],
    };
  }

  componentDidMount() {
    // 获取本地保存的值
    AsyncStorage.getItem(STORAGEKEY, (error, result) => {
      if (error) {
        this.appendMessage('AsyncStorage读取错误: ' + error.message);
      } else if (result !== null) {
        this.setState({ selectedValue: result });
        this.appendMessage('从本地读取数据: ' + result);
      } else {
        this.appendMessage('本地未保存数据.');
      }
    });
  }


  onValueChange = (selectedValue) => {
    this.setState({ selectedValue });
    // 保存数据到本地
    AsyncStorage.setItem(STORAGEKEY, selectedValue, (error, result) => {
      if (error) {
        this.appendMessage('AsyncStorage设置错误: ' + error.message);
      } else {
        this.appendMessage('已保存数据到本地: ' + selectedValue);
      }
    });
  };

  removeStorage = () => {
    // 删除一条数据
    AsyncStorage.removeItem(STORAGEKEY, (error) => {
      if (error) {
        this.appendMessage('AsyncStorage删除错误: ' + error.message);
      } else {
        this.appendMessage('已删除保存到本地的数据.');
      }
    });
  };

  appendMessage = (message) => {
    this.setState({ messages: this.state.messages.concat(message) });
  };

  render() {
    let color = this.state.selectedValue;
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: 'AsyncStorage', tintColor: '#fff' }}
      >
        <View style={styles.screen}>

          <Picker
            selectedValue={color}
            onValueChange={this.onValueChange}
          >
            {COLORS.map((value) => (
              <Picker.Item
                key={value}
                value={value}
                label={value}
              />
            ))}
          </Picker>

          <Text>'点击或拖动上面选择: '<Text style={{ color, marginTop: 10 }}>{this.state.selectedValue}</Text></Text>

          <Text style={{ marginVertical: 10, backgroundColor: '#eee' }} onPress={this.removeStorage}>点我删除本地数据.</Text>

          <Text>Messages:</Text>
          {this.state.messages.map((m) => <Text key={m + Math.random()}>{m}</Text>)}
        </View>
      </BaseView>
    );
  }
}

const styles = Styles.create({

});