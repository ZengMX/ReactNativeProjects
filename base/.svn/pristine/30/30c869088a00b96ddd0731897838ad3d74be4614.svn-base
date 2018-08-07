// 引入官方组件
import React, { Component } from 'react';
import {
  View,
  Alert,
  Text,
  TouchableHighlight,
} from 'react-native';
// 引入自定义组件
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';

// corporate ipsum > lorem ipsum
var alertMessage = 'Alert message,这里写提示信息';


export default class TextTest extends Component {

  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: 'Alert', tintColor: '#fff' }}
      >

        <TouchableHighlight style={styles.wrapper}
          onPress={() => Alert.alert(
            'Alert Title',
            alertMessage,
            [
              { text: '确认', onPress: () => console.log('OK Pressed!') },
            ]
          )}>
          <View style={styles.button}>
            <Text>一个按钮</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight style={styles.wrapper}
          onPress={() => Alert.alert(
            'Alert Title',
            alertMessage,
            [
              { text: '取消', onPress: () => console.log('Cancel Pressed!') },
              { text: '确认', onPress: () => console.log('OK Pressed!') },
            ]
          )}>
          <View style={styles.button}>
            <Text>二个按钮</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight style={styles.wrapper}
          onPress={() => Alert.alert(
            'Alert Title',
            alertMessage,
            [
              { text: 'Foo', onPress: () => console.log('Foo Pressed!') },
              { text: 'Bar', onPress: () => console.log('Bar Pressed!') },
              { text: 'Baz', onPress: () => console.log('Baz Pressed!') },
            ]
          )}>
          <View style={styles.button}>
            <Text>三个按钮</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight style={styles.wrapper}
          onPress={() => Alert.alert(
            'Alert Title',
            null,
            [
              { text: '确认', onPress: () => console.log('OK Pressed!') },
            ],
            {
              cancelable: false
            }
          )}>
          <View style={styles.button}>
            <Text>无取消按钮</Text>
          </View>
        </TouchableHighlight>

      </BaseView>
    );
  }
}

const styles = Styles.create({
  wrapper: {
    borderRadius: 5,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#eeeeee',
    padding: 10,
  },
});