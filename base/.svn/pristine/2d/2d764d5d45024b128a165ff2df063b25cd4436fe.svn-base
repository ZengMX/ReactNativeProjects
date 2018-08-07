// 引入官方组件
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
// 引入自定义组件
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';


class Element extends Component {
  constructor(props) {
    super(props);
    this.state={
      stateTest:'观察state变化'
    }
  }

  componentWillMount() {
    console.log('1.componentWillMount', this.props,this.state);
  }

  componentDidMount() {
    console.log('2.componentDidMount', this.props,this.state);
  }

  componentWillReceiveProps(nextProps) {
    console.log('3.componentWillReceiveProps', nextProps,this.state);
    this.setState({
      stateTest:'state变化了',
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('4.shouldComponentUpdate', nextProps, nextState);
    return true; // 返回false表示跳过后续的生命周期方法
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('5.componentWillUpdate', nextProps, nextState);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('6.componentDidUpdate', prevProps, prevState);
  }

  componentWillUnmount() {
    console.log('7.componentWillUnmount',this.props,this.state);
  }

  render() {
    return (
      <Text>接收新的参数: {this.props.propsTest}</Text>
    );
  }
}

export default class Lifecycle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      change: false,
    };
  }

  onPress = () => {
    this.setState({
      change: !this.state.change,
    });
  };

  render() {
    let propsTest = this.state.change ? '新props' : '';
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: '生命周期', tintColor: '#fff' }}
      >
        <TouchableOpacity onPress={this.onPress} style={styles.content}>
          <Element propsTest={propsTest} />
        </TouchableOpacity>
      </BaseView>
    );
  }
}

const styles = Styles.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBEBEB',
    flex: 1
  }
});