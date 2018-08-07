import React, { Component } from 'react';
import {
  Text,
  Image,
  TouchableOpacity,
  View,
  InteractionManager,
} from 'react-native';

import { BaseView, ScrollableTabBar } from 'future/src/widgets';
import ScrollableTabView from 'react-native-scrollable-tab-view';

export default class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.order = '';
  }
  componentDidMount() {
    this.timer = null;
  }
  componentWillUnmount() {
    // 如果存在this.timer，则使用clearTimeout清空。
    // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
    this.timer && clearTimeout(this.timer);
  }

  //渲染TAB
  renderTab = (isTabActive, title, page) => {
    const textColor = isTabActive ? '#2fbdc8' : '#666666';
    const fontWeight = isTabActive ? 'bold' : 'normal';
    let priceImg = require('./res/000jiagejiantou.png');
    if (page == 1 && isTabActive) {
      if (this.order == null || this.order == "minPrice,asc") {
        priceImg = require('./res/000jiagedidaogaoi_s.png');
      } else if (this.order == "minPrice,desc") {
        priceImg = require('./res/000jiagegaodapdi_s.png');
      }
    }
    return (
      <TouchableOpacity style={{ width: 100, height: 35 }} activeOpacity={1}>
        <View style={{ height: 35, alignItems: "center", flexDirection: "row", justifyContent: "center" }}>
          <Text style={[{ color: textColor, fontWeight }, { fontSize: 12 }]}>{title}</Text>
          {
            page == 1 ? (<Image style={{ width: 8, height: 10.5, marginLeft: 3 }} source={priceImg} />) : null
          }
        </View>
      </TouchableOpacity>
    )
  }

  //TAB切换时
  onChangeTab = ({ i, ref, from }) => {
    let activeList = this.refs[ref.ref];
    //有切换效果的TAB
    if (i == 1) {
      this.order = 'minPrice,desc' != this.order ? 'minPrice,desc' : 'minPrice,asc'
      //强制更新
      this.forceUpdate();
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        //刷新列表
        // InteractionManager.runAfterInteractions(() => {
        // 	activeList && activeList.pullRefresh();
        // });
      }, 100);
    }
    //无需TAB切换效果，切换其它TAB才刷新目标TAB
    else if (i !== from) {
      if (i == 2) {
        this.order = "salesVolume,desc";
      } else {
        this.order = '';
      }
      //强制更新界面
      this.forceUpdate();
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        //刷新列表
        // InteractionManager.runAfterInteractions(() => {
        // 	activeList && activeList.pullRefresh();
        // });
      }, 100);
    }
  }

  //渲染主界面
  render() {
    return (
      <BaseView style={{ flex: 1, backgroundColor: "#f0f8f8" }}
        navigator={this.props.navigator}>
        <ScrollableTabView
          tabBarBackgroundColor='#fff'
          initialPage={0}
          onChangeTab={this.onChangeTab}
          renderTabBar={() => (
            <ScrollableTabBar
              style={{
                height: 35,
                borderBottomWidth: 0
              }}
              renderTab={this.renderTab}
            />
          )}
        >
          <View tabLabel='默认' />
          <View tabLabel='价格' />
          <View tabLabel='销量' />
        </ScrollableTabView>
      </BaseView>
    );
  }
}