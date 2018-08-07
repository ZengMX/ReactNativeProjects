// 引入官方组件
import React, { Component } from 'react';
import {
  View,
  WebView,
} from 'react-native';
// 引入自定义组件
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';


export default class TextTest extends Component {

  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: 'WebView', tintColor: '#fff' }}
      >
        <WebView
          style={styles.box}
          scalesPageToFit={true}
          startInLoadingState={true}
          source={{ uri: 'https://www.baidu.com/' }}
        />
      </BaseView>
    );
  }
}

const styles = Styles.create({
  box: {
    flex: 1,
    backgroundColor: '#3366FF',
  }
});