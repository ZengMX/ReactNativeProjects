/**
 * 上下拉刷新测试demo
 *
 * 图片缓存测试demo
 *
 * 图片加载进度测试demo
 *
 * 测试服务器在servce中，npm install安装依赖后，npm start启动
 */
'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TouchableHighlight
} from 'react-native';

import Fetch from '../lib/Fetch';
import {BaseView, RefreshableListView, Toast} from '../widgets';
import * as httpCache from '@imall-test/react-native-http-cache';
console.log(Toast)
const styles = StyleSheet.create({
	container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  navBar: {
    height: 64,
    backgroundColor: '#CCC'
  },
  row: {
    padding: 10,
    height: 44,
  }
});

export default class Example extends Component {
   constructor() {
      super(...arguments);
      let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {
        return r1 !== r2
      }});
      this.dataSource = ds;

      this.state = {
        http : 0,
        image : 0,
        all : 0
      };
  }
  componentDidMount(){
     // fix 线程错误http://bbs.reactnative.cn/topic/535/
     setTimeout(()=>this.getData(), 5000);
  }
  fetchData(page, success, error) {
    const promise = new Fetch({
		    url: 'http://localhost:3000/'+ page,
        method : 'GET'
    }).dofetch();

    promise.then((data) => {
      success(data, page*10, 50);
    }).catch((err) => {
      console.log('=> catch: ', err);
      error();
    });
  }
  async getData(){
    try {
      this.setState({
        'http': await httpCache.getHttpCacheSize(),
        'image': await httpCache.getImageCacheSize(),
        'all': await httpCache.getSize(),
      });
    } catch(err){
      alert('错误', err.message);
    }
  }
  async clearCache(){
    try {
      await httpCache.clear();
      alert('清除缓存成功');
      await this.getData();
    } catch(err){
      alert('错误', err.message);
    }
  }
  renderHeader() {
        return (
          <View style={{ flex: 1 }}>
            <View>
              <Text>Http缓存大小：{this.state.http}</Text>
              <Text>图片缓存大小：{this.state.image}</Text>
              <Text>总缓存大小：{this.state.all}</Text>
            </View>
            <TouchableHighlight onPress={() => this.getData() }>
              <Text>刷新缓存大小</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => this.clearCache() }>
              <Text>清除缓存</Text>
            </TouchableHighlight>
          </View>
        );
  }
  _onPress(row){
      Toast.show("这只是一个测试消息！");
  }
  renderRow(rowData, sectionID, rowID, highlightRow){
		return (
			<TouchableHighlight
					style={{height:60, flex: 1, justifyContent:'center',alignItems:'center'}}
					underlayColor='#c8c7cc'
					onPress={this._onPress.bind(this)}>
          <View style={{flexDirection:'row'}}>
            <Image source={{uri: 'http://localhost:3000/static/1.png'}}
              style={{width: 40, height: 40}} />
            <Text style={{fontSize:14}}>
          	  {rowData.id}
            </Text>
					</View>
				</TouchableHighlight>
		)
	}
  renderSeparator(sectionID, rowID){
      return (
        <View key={'key' + rowID} style={{height: 1,backgroundColor: '#CCC'}} />
      )
  }
  render() {
    return (
      <BaseView style={styles.container}
	  navigator={this.props.navigator}>
          
          <RefreshableListView
              ref="list"
              autoLoadMore={true}
              fetchData={this.fetchData.bind(this)}
              renderSeparator={this.renderSeparator}
              scrollRenderAheadDistance={100} //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行。
              pageSize={10} // 每次事件循环（每帧）渲染的行数。
              initialListSize={0}
              onEndReachedThreshold={200}
              dataSource={this.dataSource}
              renderHeader={this.renderHeader.bind(this)}
              renderRow={this.renderRow.bind(this)} />

      </BaseView>
    );
  }
}
