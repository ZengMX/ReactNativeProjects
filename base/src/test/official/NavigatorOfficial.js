import React, { Component } from 'react';
import {
  Navigator,
  StyleSheet,
  ScrollView,
  Text,
  TouchableHighlight,
} from 'react-native';

import { BaseView } from 'future/src/widgets';

// 设置路由集合和初始路由
// 路由内放组件参考项目封装路由的文件 /src/widgets/navigation/Navigator.js
let ROUTE_STACK = [{ scene: '前一场景' }, { scene: '中间场景' }, { scene: '后一场景' }];
let INIT_ROUTE_INDEX = 1;

class NavButton extends Component {
  render() {
    return (
      <TouchableHighlight
        style={styles.button}
        underlayColor="#B5B5B5"
        onPress={this.props.onPress}>
        <Text style={styles.buttonText}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

export default class JumpingNavSample extends React.Component {
  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: 'Navigator官方', tintColor: '#fff' }}
      >
        <Navigator
          initialRoute={ROUTE_STACK[INIT_ROUTE_INDEX]}
          initialRouteStack={ROUTE_STACK}
          renderScene={this.renderScene}
          configureScene={() => {
            return Navigator.SceneConfigs.HorizontalSwipeJump;
          }}
        />
      </BaseView>
    );
  }
  // route里其实就是我们传递的场景如{ scene: '前一场景' }，navigator是一个Navigator的对象
  renderScene = (route, navigator) => {
    console.log(route, navigator);
    let backBtn;
    let forwardBtn;
    if (ROUTE_STACK.indexOf(route) !== 0) {
      backBtn = (
        <NavButton
          onPress={() => {
            navigator.jumpBack();
          }}
          text="回前一场景"
        />
      );
    }
    if (ROUTE_STACK.indexOf(route) !== ROUTE_STACK.length - 1) {
      forwardBtn = (
        <NavButton
          onPress={() => {
            navigator.jumpForward();
          }}
          text="向下一场景"
        />
      );
    }
    // 这里根据需要可返回任意组件
    return (
      <ScrollView style={styles.scene}>
        <Text style={styles.messageText}>场景：{route.scene}</Text>
        {backBtn}
        <NavButton
          onPress={() => {
            navigator.jumpTo(ROUTE_STACK[1]);
          }}
          text="到中间场景"
        />
        {forwardBtn}
      </ScrollView>
    );
  };
}

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    marginHorizontal: 10,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#3B5998',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
    color: 'white',
  },
  scene: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#EAEAEA',
  },
  messageText: {
    fontSize: 17,
    textAlign: 'center',
  },
});