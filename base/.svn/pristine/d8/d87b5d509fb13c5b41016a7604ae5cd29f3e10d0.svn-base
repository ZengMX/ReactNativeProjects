// 引入官方组件
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
// 引入自定义组件
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';

// 自定义文字闪烁组件
class Blink extends Component {
  constructor(props) {
    super(props);
    // 初始化state
    this.state = {
      showText: true
    };
  }
  componentDidMount() {
    // 每1000毫秒对showText状态做一次取反操作
    this.timer = setInterval(() => {
      this.setState({ showText: !this.state.showText });
    }, 1000);
  }
  // 页面卸载时清除定时器
  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }

  render() {
    // 根据当前showText的值重新渲染页面,决定是否显示text内容
    // this.props.text 接收自父组件
    let display = this.state.showText ? this.props.text : ' ';
    return (
      <View style={{ backgroundColor: '#f1c232' }} >
        <Text style={styles.tetx}>{display}</Text>
        <Text style={[styles.text, { color: '#cc0000' }]}>{display}</Text>
      </View>
    );
  }
}

export default class Basis extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // 删除注释可打印出BaseView定义的方法
    // console.log('BaseView中有什么', this.base);
  }

  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: '几点说明', tintColor: '#fff' }}
      >
        {/*上面的ref属性定义了组件初始化完成后,this.base就是实例化后的BaseView
          可以调用BaseView的方法等*/}
        <View>
          {/*引用两次Blink*/}
          <Blink text='I love to blink' />
          <Blink text='Yes blinking is so great' />
        </View>

      </BaseView>
    );
  }
}

const styles = Styles.create({
  tetx: {
    color: '#0000ff',
  }
});