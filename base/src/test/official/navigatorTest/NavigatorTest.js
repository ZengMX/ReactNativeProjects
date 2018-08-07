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

// 引入要切换的页面
import Navigator2 from './Navigator2';

export default class ImageTest extends Component {
  constructor(props) {
    super(props);
  }
  onClick = () => {
    // 调用Navigator的方法进行页面切换,下面介绍的是项目封装后的写法，属性名固定
    this.props.navigator.push({
      component:Navigator2,   // 要进入的组件，要在开关先引入
      sceneConfig:Navigator.SceneConfigs.FloatFromBottom, // 切换页面时的动画
      params:{        // 传到下一面的数据，在下一页用this.props.params取出，内容自定义
        data:'来自第一页的数据'  
      }
    });
  }

  // 项目在BaseView组件中封装了导航栏，
  // navigator={this.props.navigator}可以获取Navigator
  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: '第一页', tintColor: '#fff' }}
      >
        <Text>我是第一页</Text>
        <Text style={styles.text} onPress={this.onClick}>点我进入下一页(push方式)</Text>
      </BaseView>
    );
  }
}

const styles = Styles.create({
  text:{
    marginVertical: 20,
    backgroundColor:'#FFFF00'
  }
});