// 引入官方组件
import React, { Component } from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  NetInfo,
} from 'react-native';
// 引入自定义组件
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';


export default class NetInfoTest extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // 查询网络状态
    NetInfo.fetch().done((isConnected) => {
      this.handleChange(isConnected);
    });
    // 监听网络状态变化
    NetInfo.addEventListener('change', this.handleChange);
  }

  componentWillUnmount() {
    // 移除监听网络状态变化
    NetInfo.removeEventListener('change', this.handleChange);
  }

  handleChange = (isConnected) => {
    Alert.alert('Then isConnected ' + isConnected);
  }

  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: 'NetInfo', tintColor: '#fff' }}
      >

      </BaseView>
    );
  }
}

const styles = Styles.create({

});