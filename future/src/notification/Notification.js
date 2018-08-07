/**
 * Created by timhuo on 2017/6/28.
 */
'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import jpush from '@imall-test/react-native-jpush'

export default class Notification extends Component {

  render() {
    return (
      <View style={styles.container}>
	      <TouchableOpacity style={styles.btnStyle} onPress={()=>{
		      //先删除再添加
		      jpush.removeLocalNotification(['123']);
		      jpush.addLocalNotification({                            //添加本地通知
			      title: "采购计划提醒",
			      subtitle: '',
			      repeat: true,
			      body: "message",
			      fireDate: '10',
			      requestId: "123",
		      });
	      }}>
		      <Text>本地通知</Text>
	      </TouchableOpacity>
	      <TouchableOpacity style={styles.btnStyle} onPress={()=>{
		
	      }}>
		      <Text>本地通知</Text>
	      </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
	btnStyle:{
		margin:14
	}
});