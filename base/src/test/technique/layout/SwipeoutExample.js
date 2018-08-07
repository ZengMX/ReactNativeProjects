/**
 * https://github.com/dancormier/react-native-swipeout
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Swipeout from 'react-native-swipeout';
import { BaseView } from 'future/src/widgets';

const leftBtn = [
  {
    text: '置顶', //按钮文本 
    color: '#0099FF', //按钮颜色
    backgroundColor: '#FF6633',
    underlayColor: '#DDDDDD',
    disabled: true, //是否可用
    onPress: () => { // 点击函数
      alert('置顶');
    },
  }
];
const rightBtns = [
  {
    text: '按钮1',
    onPress: () => {
      alert('按钮1');
    },
  },
  {
    text: '按钮2',
    onPress: () => {
      alert('按钮2');
    },
  }
];


export default class SwipeoutExample extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <BaseView style={styles.container}
        navigator={this.props.navigator}>
        <Swipeout
          style={styles.swipeout}
          left={leftBtn}
          right={rightBtns}
          autoClose={true}
        >
          <View style={styles.btn}>
            <Text style={styles.title}>左右拖动</Text>
          </View>
        </Swipeout>
      </BaseView>
    );
  }
}
const styles = StyleSheet.create({
  swipeout: {
    height: 45,
    backgroundColor: '#09f'
  },
  btn: {
    height: 45,
    justifyContent: 'center',
  },
  title: {
    color: '#003300',
    fontSize: 16,
  },
});