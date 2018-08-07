// 引入官方组件
import React, { Component } from 'react';
import {
  View,
  Animated,
  Text,
  Easing,
  PanResponder,
  PixelRatio,
} from 'react-native';
// 引入自定义组件
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';

export default class AnimatedTest extends Component {
  constructor(props) {
    super(props);
    this.previousLeft = 0;
    this.previousTop = 0;
    this.state = {
      pan: new Animated.ValueXY(), // inits to zero
    };

  }

  // 处理PanResponder方法
  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      this.state.pan.setValue({
        x: gestureState.dx + this.previousLeft,
        y: gestureState.dy + this.previousTop
      });
    },
    onPanResponderRelease: (e, gestureState) => {
      this.previousLeft += gestureState.dx;
      this.previousTop += gestureState.dy;
      this.state.pan.setValue({
        x: this.previousLeft,
        y: this.previousTop
      });
    },
  });

  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: 'Animated', tintColor: '#fff' }}
      >
        <Animated.View
          {...this.panResponder.panHandlers}
          style={this.state.pan.getLayout()}
        >
          {/*上面把PanResponder与组件绑定*/}
          <View style={styles.box} ></View>
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