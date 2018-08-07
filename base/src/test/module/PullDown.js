import React, { Component } from 'react';

import {
  View,
  TouchableHighlight,
  Text,
  ScrollView,
  Animated,
  StyleSheet,
  AppRegistry,
  Dimensions,
  Platform,
  RefreshControl
} from 'react-native';
import { BaseView } from 'future/src/widgets';
var dimensW = require('Dimensions').get('window').width;
var dimensH = require('Dimensions').get('window').height;
var contentOffset = 0;
var scrollVTo = 0;
export default class PullDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      widths: dimensW,
      heights: dimensH,
      contentWidth: dimensH,
      isRefreshing: false,
    };
  }
  transformStart(value) {
    this.scroll.scrollTo({ x: 0, y: value, animated: true });
  }
  _layoutContent() {
    return (
      <View style={{ width: dimensW, height: 900, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text>内容</Text>
      </View>);
  }
  _layoutdDtails() {
    return (
      <View style={{ width: dimensW, height: dimensH + 300, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text>详情</Text>
      </View>);
  }
  _onRefresh() {
    this.setState({ isRefreshing: true });
    setTimeout(() => {
      this.setState({ isRefreshing: false });
    }, 4000)
  }
  render() {
    return (
      <BaseView navigator={this.props.navigator} ref={base => this.base = base}>
        <ScrollView
          scrollEventThrottle={0}
          ref={scroll => this.scroll = scroll}
          onScroll={(e) => {
            console.log('>>>>>>>>>>', e.nativeEvent.contentOffset.y)
          }}
          scrollEnabled={false}>
          <View style={{ flex: 1 }}>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this._onRefresh.bind(this)}
                  tintColor="#ff0000"
                  title="Loading..."
                  titleColor="#00ff00"
                  colors={['#ff0000', '#00ff00', '#0000ff']}
                  progressBackgroundColor="#ffff00"
                />
              }
              onContentSizeChange={(contentWidth, contentHeight) => {
                console.log("contentWidth", contentWidth);
                console.log("contentHeight", contentHeight);
                console.log("dimensH", dimensH);
                contentOffset = contentHeight - dimensH;
                scrollVTo = contentHeight;
              }}
              ref={scroll => this.scroll = scroll}
              scrollEventThrottle={0}
              onScroll={(e) => {
                console.log('ScrollView1>>>>>>>>>>', e.nativeEvent.contentOffset.y)
                if (e.nativeEvent.contentOffset.y == contentOffset) {
                  console.log('ScrollView1 scroll to ', e.nativeEvent.contentOffset.y)
                  this.transformStart(dimensH + 20);
                }
              }}
              style={{ width: dimensW, height: dimensH, backgroundColor: '#f00', flexDirection: 'column' }}>
              {this._layoutContent()}
              <View style={{
                width: dimensW, height: 60, backgroundColor: '#f44',
                justifyContent: 'center', alignItems: 'center', marginBottom: 20
              }}>
                <Text>商品详情</Text>
              </View>
            </ScrollView>
          </View>
          <View style={{ flex: 1 }}>
            <ScrollView
              onContentSizeChange={(contentWidth, contentHeight) => {
                console.log("contentWidth", contentWidth);
                console.log("contentHeight", contentHeight);
                console.log("dimensH", dimensH);
              }}
              ref={scroll => this.scroll = scroll}
              scrollEventThrottle={0}
              onScroll={(e) => {
                console.log('ScrollView2>>>>>>>>>>', e.nativeEvent.contentOffset.y)
                if (e.nativeEvent.contentOffset.y == 0) {
                  this.transformStart(0);
                  console.log('ScrollView2 scroll to 0')
                }
              }}
              style={{ width: dimensW, height: dimensH, backgroundColor: '#f00', flexDirection: 'column' }}>
              <View style={{ width: dimensW, height: 60, backgroundColor: '#f44', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <Text>返回商品</Text>
              </View>
              {this._layoutdDtails()}
            </ScrollView>
          </View>
        </ScrollView>
      </BaseView>
    );
  }
}
const styles = StyleSheet.create({//960 - 393 内容 900 + 60 高度 592
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
  text: {
    padding: 4,
    paddingBottom: 10,
    fontWeight: 'bold',
    fontSize: 18,
    backgroundColor: 'transparent',
  },
  bunny: {
    backgroundColor: 'transparent',
    position: 'absolute',
    height: 160,
    width: 160,
  },
  page: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});