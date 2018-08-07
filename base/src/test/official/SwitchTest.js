// 引入官方组件
import React, { Component } from 'react';
import {
  View,
  Text,
  Switch,
} from 'react-native';
// 引入自定义组件
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';


export default class SwitchTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: false,
    };
  }

  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: 'Switch', tintColor: '#fff' }}
      >
        <Switch
          style={{ marginBottom: 10 }}
          onValueChange={(value) => this.setState({ status: value })}
          value={this.state.status}
          onTintColor="#00FF00"
          thumbTintColor="#0066FF"
          tintColor="#FF3333"
        />


      </BaseView>
    );
  }
}

const styles = Styles.create({

});