import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
import { BaseView } from 'future/src/widgets';
import Countdown from './Countdown';

export default class SingleCountdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverTime: new Date().getTime(), // 初始化当前时间，项目中要用服务器时间初始化，更靠谱
      leftSeconds: this.props.params.leftSeconds || 0
    }
    this.startChangeTime = this._startChangeTime.bind(this);
  }
  //回调函数，每秒被倒计时组件Countdown调用一次,用于刷新本页面，更新serverTime时间，可获取剩余时间leftSeconds
  _startChangeTime(leftSeconds) {
    this.setState({
      serverTime: this.state.serverTime + 1000
    });
    // console.log('leftSeconds',leftSeconds);
  }

  render() {
    return (

      <BaseView style={[layout.ver, { backgroundColor: '#fff' }]}
	  navigator={this.props.navigator} title={{ title: '单个倒计时', tintColor: '#fff' }} >
        {/*当startChangeTime存在时，Countdown组件启动一个倒计时事件*/}
        <Countdown
          startChangeTime={this.startChangeTime}
          leftSeconds={this.state.leftSeconds}
        />

      </BaseView>
    );
  }

}
