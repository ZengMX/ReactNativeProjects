/**
 * 优化列表倒计时（1个倒计时搞定全部行）
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  ListView,
  TouchableOpacity,
} from 'react-native'

import { BaseView } from 'future/src/widgets';
import Countdown from './Countdown';
import SingleCountdown from './SingleCountdown';

// 模拟一个有10行数据的后台返回数组，leftSeconds为剩余时间
const datas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => {
  return {
    leftSeconds: new Date().getTime() + new Date(Math.floor((Math.random() * 172800000) + 100000)).getTime(),
  };
});

export default class ListCountdown extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      serverTime: new Date().getTime(), // 初始化当前时间，项目中要用服务器时间初始化，更靠谱
      dataSource: this.ds.cloneWithRows(datas)
    };
    this.renderRow = this._renderRow.bind(this);
    this.renderSeparator = this._renderSeparator.bind(this);
    this.toSingleCountdown = this._toSingleCountdown.bind(this);
  }

  //开启倒计时
  componentDidMount() {
    this.timer = setInterval(
      () => { this.startChangeTime(); },
      1000
    );
  }

  //关闭倒计时
  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }

  // 倒计时
  startChangeTime() {
    this.setState({
      dataSource: this.ds.cloneWithRows(datas), // 刷新数据源，用于刷新整个页面，一般项目中不需要
      serverTime: this.state.serverTime + 1000
    })
  }

  // 页面中单个倒计时的例子
  _toSingleCountdown(leftSeconds) {
    this.props.navigator.push({
      component: SingleCountdown,
      params: {
        leftSeconds: leftSeconds
      }
    });
  }

  //  当使用RefreshableListView时，仍可用下面的_renderRow，这里调用了Countdown组件
  _renderRow(rowData, rowId) {

    let leftSeconds = Math.floor((rowData.leftSeconds - this.state.serverTime) / 1000);

    return (
      <TouchableOpacity
        key={`{rowId}`}
        style={{ height: 45, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
        onPress={() => { this.toSingleCountdown(leftSeconds) }}
      >

        <Countdown
          type={2}
          leftSeconds={leftSeconds}
        />

      </TouchableOpacity>
    );
  }

  _renderSeparator(sectionID, rowID) {
    return (
      <View key={'key' + rowID} style={{ height: 1, backgroundColor: '#CCC' }} />
    );
  }

  render() {

    return (
      <BaseView style={{ flex: 1 }}
        navigator={this.props.navigator}
        title={{ title: '列表倒计时', tintColor: '#fff' }}
      >
        <ListView style={{ flexDirection: 'column' }}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderSeparator={this.renderSeparator}
        />

      </BaseView>
    )
  }
}

