// 引入官方组件
import React, { Component } from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
// 引入自定义组件
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';


class OpenURLButton extends React.Component {

  handleClick = () => {
    // 判断设备上是否有已经安装的应用可以处理指定的URL
    Linking.canOpenURL(this.props.url).then(supported => {
      if (supported) {
        // 尝试使用设备上已经安装的应用打开指定的url
        Linking.openURL(this.props.url);
      } else {
        console.log('Don\'t know how to open URI: ' + this.props.url);
      }
    });
  };

  render() {
    return (
      <TouchableOpacity
        onPress={this.handleClick}>
        <View style={styles.btn}>
          <Text style={styles.text}>Open {this.props.url}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default class LinkingTest extends Component {
  constructor(props) {
    super(props);
  }



  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: 'Linking', tintColor: '#fff' }}
      >
        <OpenURLButton url={'https://www.baidu.com'} />
        <OpenURLButton url={'fb://notifications'} />
        <OpenURLButton url={'geo:37.484847,-122.148386'} />
        <OpenURLButton url={'tel:13012345678'} />
      </BaseView>
    );
  }
}

const styles = Styles.create({
  btn: {
    marginTop: 10,
    marginHorizontal: 10,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#3B5998',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
});