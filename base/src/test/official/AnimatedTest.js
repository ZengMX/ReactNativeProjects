// 引入官方组件
import React, { Component } from 'react';
import {
  View,
  Animated,
  Text,
  Easing,
} from 'react-native';
// 引入自定义组件
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';

export default class AnimatedTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0), // 初始化动画及值为0
    };
  }

  componentDidMount() {
    Animated.timing(          // 使用timing过度动画
      this.state.fadeAnim,    // 驱动动画的值
      {                       // 配置
        toValue: 1,           // 目标值1
        easing: Easing.bounce,
        duration: 3000,       // 持续时间3秒
      },
    ).start();                // 开启动画
  }

  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: 'Animated', tintColor: '#fff' }}
      >
        {/*绑定动画值到属性上，属性值会自动改变，形成动画*/}
        <Animated.View
          style={[styles.box, {
            opacity: this.state.fadeAnim,
            transform: [{
              translateY: this.state.fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [300, 0]  // 0 : 300, 0.5 : 150, 1 : 0
              }),
            }],
          }]}>
          <Text>动画</Text>
        </Animated.View>
      </BaseView>
    );
  }
}

const styles = Styles.create({
  box: {
    height: 100,
    width: 100,
    backgroundColor: '#0033FF',
  },
});