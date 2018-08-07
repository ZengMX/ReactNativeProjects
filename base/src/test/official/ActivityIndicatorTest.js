// 引入官方组件
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native';
// 引入自定义组件
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';


export default class ActivityIndicatorTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animating: true,
    };
  }

  componentDidMount() {
    this.setToggleTimeout();
  }

  componentWillUnmount() {
    clearTimeout(this._timer);
  }

  setToggleTimeout() {
    this._timer = setTimeout(() => {
      this.setState({ animating: !this.state.animating });
      this.setToggleTimeout();
    }, 2000);
  }

  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: 'ActivityIndicator', tintColor: '#fff' }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
        <ActivityIndicator size="small" color="#aa3300" />
        <ActivityIndicator animating={this.state.animating} size="large" color="#00aa00" />
      </BaseView>
    );
  }
}

const styles = Styles.create({

});