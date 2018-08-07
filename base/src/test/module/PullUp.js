import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
 
//导入加载动画控件
// import Loading from '@imall-test/react-native-loading';
import { BaseView } from 'future/src/widgets';
var fullWidth = require('Dimensions').get('window').width;
var fullHeight = require('Dimensions').get('window').height;
 
var contentOffset = 0;
 
var temp = [];
 
export default class PullUp extends Component {
  state = {
    isLoadMore: false,  //是否正在加载数据，true显示Loading动画，false不显示Loading动画
    hasLoadMore: true,  //是否还有更多数据，false显示“已没有更多数据”，true不显示，
    Data: null,         //加载出来的数据
  }
 
  _layoutContent() {
    return (
      <View style={{ width: fullWidth, height: 900, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text>内容</Text>
      </View>);
  }
 
  //保存每次加载出来的view,再返回去
  renderPage() {
    var views = [];
    for (var i = 0; i < this.state.Data.length; i++) {
      views.push(       //这里返回实际加载出来的view
        <View style={{ width: fullWidth, height: 200, backgroundColor: '#f00' }} key={i}>
          <Text style={{ alignItems: 'center', textAlign: 'center' }}>新加载的数据</Text>
        </View>
      );
    }
    return views;
  }
 
  //处理数据
  renderSome() {
    return (
      this.state.Data == null ? null : this.renderPage()
    );
  }
 
  //请求网络数据
  reqData() {
    if (!this.state.isLoadMore) {
      this.setState({
        isLoadMore: true,
      });
      setTimeout(() => {
        for (var i = 0; i < 1; i++) {
          temp.push(i + "");
        }
        this.setState({
          isLoadMore: false,
          hasLoadMore: true,
          Data: temp,
        });
      }, 2000);
    }
  }
 
  render() {
    return (
            <BaseView navigator={this.props.navigator} style={styles.container}>

        <ScrollView
          ref='scrollview'
          scrollEventThrottle={0}
          onContentSizeChange={(contentWidth, contentHeight) => {
            scrollViewContentHeight = contentHeight;
          } }
          onLayout={(event) => {
            scrollViewLayoutHeight = event.nativeEvent.layout.height;
          } }
          ref={scroll => this.scroll = scroll}
          onScroll={(e) => {
            if (e.nativeEvent.contentOffset.y == scrollViewContentHeight - scrollViewLayoutHeight) {            //此处表示ScrollView滑动到底部
              this.reqData();
 
              // fetch().doFetch().then(data => {
              //   this.state({
              //     isLoadMore: false,
              //     hasLoadMore: true,
              //     Data: Data
              //   });
              // });
            }
          } }
          >
          {this._layoutContent()}
          {this.renderSome()}
        </ScrollView>
        {/*this.state.isLoadMore ?<Loading loading={this.state.hasLoadMore}/> : null*/}
        {this.state.isLoadMore ?<ActivityIndicator color="#000" size='large' animating={this.state.hasLoadMore}/> : null}
        {this.state.hasLoadMore ? null :
          <View style={{ width: fullWidth, height: 50, backgroundColor: '#fff' }}>
            <Text style={{ alignItems: 'center', textAlign: 'center' }}>已没有更多数据</Text>
          </View>
        }
      </BaseView>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});