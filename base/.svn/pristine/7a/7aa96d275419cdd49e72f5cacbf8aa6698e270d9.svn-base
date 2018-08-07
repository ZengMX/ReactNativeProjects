'use strict'
import React, { Component } from 'react'
import {
  Navigator,
  Platform,
  BackAndroid,
} from 'react-native'

import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import { Toast } from 'future/src/widgets';
import Index from 'future/src/Index';

export default class _Navigator extends Component {
  constructor(props) {
    super(props);
    this.renderScene = this._renderScene.bind(this);
    this.onBackAndroid = this._onBackAndroid.bind(this);
  }

  componentDidMount() {

    this.changeTabBarIdxListener = RCTDeviceEventEmitter.addListener('changeTabBarIdx', ({ idx, goTop = false }) => {
      // if (true === goTop) {
      //   let nav = this.navigator;
      //   const routers = nav.getCurrentRoutes();
      //   if (routers.length > 1) {
      //     nav.popToTop();
      //   }
      // }
      this.navigator.popToTop();
      // 在src/widgets/tab/TabBar.js里接收changeTabBarIdx2事件，切换最外层Tab标签页
      this.timer = setTimeout(() => {
        RCTDeviceEventEmitter.emit('changeTabBarIdx2', { idx: idx });
      }, 100);
      return true;
    });

    // android2秒内按两次Back键退出应用
    if (Platform.OS === 'android') {
      this.backHand = BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  componentWillUnmount() {
    // 移除 一定要写
    this.backHand && this.backHand.remove();
    this.changeTabBarIdxListener && this.changeTabBarIdxListener.remove();
    this.timer && clearTimeout(this.timer);
  }

  _onBackAndroid() {
    let nav = this.navigator;
    const routers = nav.getCurrentRoutes();
    // 兼容按Back键隐藏弹层
    if (global.isShowPopup == true) {
      global.isShowPopup = false;
      return true;
    }
    // 正常按Back键返回上一页
    if (routers.length > 1) {
      nav.pop();
    } else if (routers.length == 1) {
      //最近2秒内按过back键，可以退出应用。
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        return false;
      } else {
        Toast.show('再按一次退出应用');
        this.lastBackPressed = Date.now();
      }
    }
    return true;
  };

  _renderScene(route, navigator) {
    //切换视图,Component是被push进来的component属性指定的组件
    let Component = route.component;
    return <Component navigator={navigator} params={route.params} />
  }

  render() {
    return (
      <Navigator
        ref={navigator => this.navigator = navigator}
        initialRoute={{ params: { name: 'Home页面' }, component: Index }}
        configureScene={(route) => {
          // sceneConfig属性定制切换动画
          if (route.sceneConfig) {
            return route.sceneConfig;
          }
          return Navigator.SceneConfigs.PushFromRight;
        }}
        renderScene={this.renderScene}
      />
    );
  }
}