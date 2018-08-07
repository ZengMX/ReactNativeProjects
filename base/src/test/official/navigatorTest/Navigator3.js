// 引入官方组件
import React, { Component } from 'react';
import {
  View,
  Text,
  Navigator,
} from 'react-native';
// 引入自定义组件
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';


import Navigator4 from './Navigator4';

export default class ImageTest extends Component {
  constructor(props) {
    super(props);
  }
  onPop = () => {
    this.props.navigator.pop();
  }
  onClick = () => {
    this.props.navigator.push({
      component: Navigator4,
      sceneConfig: Navigator.SceneConfigs.HorizontalSwipeJump,
      params: {
        data: '来自第三页的数据'
      }
    });
  }
  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: '第三页', tintColor: '#fff' }}
      >
        <Text>我是第三页</Text>
        <Text style={styles.text} onPress={this.onPop}>点我返回上一页</Text>
        <Text onPress={this.onClick}>点我进入下一页(push方式)</Text>
      </BaseView>
    );
  }
}

const styles = Styles.create({
  text: {
    marginVertical: 20,
    backgroundColor: '#FF33FF',
  }
});