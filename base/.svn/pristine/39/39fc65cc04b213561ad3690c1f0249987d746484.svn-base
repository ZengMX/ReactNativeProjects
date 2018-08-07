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


import Navigator3 from './Navigator3';

export default class ImageTest extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log('打印出Navigator传来的数据',this.props.params.data);
  }
  
  onPop = () => {
    this.props.navigator.pop();
  }
  onClick = () => {
    this.props.navigator.replace({
      sceneConfig: Navigator.SceneConfigs.VerticalDownSwipeJump,
      component: Navigator3,
      params: {
        data: '来自第二页的数据'
      }
    });
  }

  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: '第二页', tintColor: '#fff' }}
      >
        <Text>我是第二页</Text>
        <Text style={styles.text} onPress={this.onPop}>点我返回上一页</Text>
        <Text onPress={this.onClick}>点我进入下一页(replace方式)</Text>
      </BaseView>
    );
  }
}

const styles = Styles.create({
  text: {
    marginVertical: 20,
    backgroundColor: '#3366FF'
  }
});