// 引入官方组件
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';
// 引入自定义组件
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';

export default class ImageTest extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: 'Image', tintColor: '#fff' }}
      >
        <Image style={styles.contain} source={require('./res/bd_logo1.png')} />
        <Image style={styles.stretch} source={{ uri: 'https://www.baidu.com/img/bd_logo1.png' }} />
        <Image style={styles.circular} source={require('./res/bd_logo1.png')} />
      </BaseView>
    );
  }
}

const styles = Styles.create({
  contain: {
    height: 100,
    width: 100,
    borderWidth:1,
    borderColor:'#FF3300',
    resizeMode: 'contain',
    backgroundColor: '#66FF33',
  },
  stretch: {
    marginVertical: 10,
    height: 100,
    width: 100,
    borderWidth:1,
    borderColor:'#FF3300',
    resizeMode: 'stretch',
    backgroundColor: '#66FF33',
  },
  circular: {
    height: 100,
    width: 100,
    borderWidth:1,
    borderColor:'#FF3300',
    borderRadius: 50,
    backgroundColor: '#66FF33',
  },
});