import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Animated,
  Easing,
  findNodeHandle,
} from 'react-native';
import { BaseView } from 'future/src/widgets/';
import Styles from 'future/src/lib/styles/Styles';
import { UIManager } from 'NativeModules';

import RootSiblings from 'react-native-root-siblings';

// 设置抛物线公式:y = a * x ^ 2 + b * x + c中的a,b值，动画起始组件视图中心坐标elementCenter, 目标组件视图targetCenter
let a = 0.005, b, elementCenter, targetCenter;

export default class Parabola extends Component {

  constructor(props) {
    super(props);
    this.state = {
      elementX: new Animated.Value(0),
      rotation: new Animated.Value(0),
    }
    this.defultTargetX = 1;
  }

  componentDidMount() {
    // 监测动画值变化，实现动画
    this.listener = this.state.elementX.addListener(result => {
      // 设置this.state.elementX.setValue(0)时this.sibling.update会创建一个组件，过虑掉
      if (this.state.elementX._value != 0) {
        this.sibling.update(this.animatedComponent());
      }
    });
  }

  componentWillMount() {
    this.listener && this.state.elementX.removeListener(this.listener);
  }

  // 点击后抛物线运动
  parabola = async () => {

    // 获取移动组件和目标组件的位置
    const element = findNodeHandle(this.element);
    const target = findNodeHandle(this.target);

    //  x、y:为视图的相对位置。width、height：为视图的宽度和高度。pageX、pageY为视图在屏幕上的绝对位置
    const elementView = await new Promise(resolve => {
      UIManager.measure(element, (x, y, width, height, pageX, pageY) => {
        resolve({ x, y, width, height, pageX, pageY });
      })
    });
    const targetView = await new Promise(resolve => {
      UIManager.measure(target, (x, y, width, height, pageX, pageY) => {
        resolve({ x, y, width, height, pageX, pageY });
      })
    });

    // 抛物线公式:y = a * x ^ 2 + b * x + c
    // a为曲率，手动配置
    // 建立虚拟坐标系：以elementView中心为坐标圆点
    // 抛物线必经过虚拟坐标系原点(0,0)，则 c=0, b = (y + a * x ^ 2 ) / x
    // 用Animated驱动x值变化，则 y = a * x ^ 2 + b * x
    // 最后x,y要转化回真实屏幕坐标
    // 设置动画属性 transform: [ { translate: [x,y] }]

    // 屏幕上的element,target中心坐标
    elementCenter = {
      x: elementView.pageX + elementView.width / 2,
      y: elementView.pageY + elementView.height / 2,
    };
    targetCenter = {
      x: targetView.pageX + targetView.width / 2,
      y: targetView.pageY + targetView.height / 2,
    };

    // 以elementCenter为原点，targetCenter的坐标
    let targetX = targetCenter.x - elementCenter.x;
    let targetY = targetCenter.y - elementCenter.y;

    if (targetX == 0) {
      targetX = 1
    }
    this.defultTargetX = targetX;
    // 确定a,b的值,已设置a = 0.001;
    b = (targetY - a * targetX * targetX) / targetX;

    // 使用timing过度动画驱动动画的值
    // Animated.timing(
    //   this.state.elementX,
    //   {
    //     toValue: targetX,
    //     easing: Easing.linear,  // 这里调整动画变化方式
    //     duration: 1000,         // 这里调整动画持续时间
    //   },
    // ).start(() => {
    //   // 删除动画组件
    //   this.del();
    //   // 初始化动画值
    //   this.state.elementX.setValue(0);
    // });

    Animated.parallel(['elementX', 'rotation'].map(property => {
      return Animated.timing(this.state[property], {
        toValue: targetX,
        duration: 1000,
        easing: Easing.linear
      });
    })).start(() => {
      // 删除动画组件
      this.del();
      // 初始化动画值
      this.state.elementX.setValue(0);
      this.state.rotation.setValue(0);
    });

    //创建动画组件
    this.sibling = new RootSiblings(this.animatedComponent());
  }

  // 生成动画组件
  animatedComponent = () => {
    //初始坐标中心与element中心对齐，10为动画视图宽高的一半
    return <Animated.View style={[styles.sibling, {
      transform: [
        {
          translate: [
            this.state.elementX._value + elementCenter.x - 10,
            a * this.state.elementX._value * this.state.elementX._value + b * this.state.elementX._value + elementCenter.y - 10
          ]
        },
        {
          rotateZ: this.state.rotation.interpolate({
            inputRange: [0, this.defultTargetX],
            outputRange: ['0deg', '360deg']
          })
        }
      ]
    }]} >
      <Text>图</Text>
    </Animated.View>;
  }

  // 删除动画组件
  del = () => {
    this.sibling && this.sibling.destroy();
  }

  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: '抛物线动画', tintColor: '#fff' }}
      >
        <ScrollView style={styles.content}>

          <View ref={element => this.element = element} style={styles.element}>
            <Text onPress={this.parabola} >点我加商品</Text>
          </View>

          <View ref={target => this.target = target} style={styles.target}>
            <Text>购物车</Text>
          </View>

        </ScrollView>
      </BaseView>
    );
  }
}
const styles = Styles.create({
  content: {
    backgroundColor: '#99CCFF',
    flex: 1,
  },

  element: {
    marginTop: 300,
    marginLeft: 50,
    width: 100,
    height: 45,
    backgroundColor: '#fff',
    borderColor: '#0f0',
    borderWidth: '$BW',
    alignItems: 'center',
    justifyContent: 'center',
  },

  target: {
    marginTop: 20,
    marginLeft: 280,
    width: 100,
    height: 45,
    backgroundColor: '#fff',
    borderColor: '#0f0',
    borderWidth: '$BW',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sibling: {
    position: 'absolute',
    height: 20,
    width: 20,
    backgroundColor: 'blue',
    opacity: 0.5
  }
});