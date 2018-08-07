'use strict';
import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  PanResponder,
  Platform,
} from 'react-native';

import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';

// 拖动时偏移修正,待修改
const correction = Platform.OS == 'ios' ? 40 : 20;

export default class ManageGrouping extends Component {

  constructor(props) {
    super(props);
    this.items = [];       //可拖动组件实例数组
    this.scrollOffsetY = 0;    //可拖动组件的父组件在屏幕上滚动后的偏移值
    this.parentTop = global.STATUS_HIGHT + 44; // BaseView中，状态栏和导航栏高度

    // 响应函数
    this._onStartShouldSetPanResponderCapture = this._onStartShouldSetPanResponderCapture.bind(this);
    this._onMoveShouldSetPanResponder = this._onMoveShouldSetPanResponder.bind(this);
    this._onPanResponderGrant = this._onPanResponderGrant.bind(this);
    this._onPanResponderMove = this._onPanResponderMove.bind(this);
    this._onPanResponderRelease = this._onPanResponderRelease.bind(this);
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponderCapture: this._onStartShouldSetPanResponderCapture,
      onMoveShouldSetPanResponder: this._onMoveShouldSetPanResponder,
      onPanResponderGrant: this._onPanResponderGrant,
      onPanResponderMove: this._onPanResponderMove,
      onPanResponderRelease: this._onPanResponderRelease,
    });
  }

  // 开始移动时成为响应者
  _onStartShouldSetPanResponderCapture(evt, gestureState) {
    console.log('Start', evt.nativeEvent);
    return true;
  }
  // 开始移动时成为响应者
  _onMoveShouldSetPanResponder(evt, gestureState) {
    return true;
  }

  // 开始响应触摸事件 这也是需要做高亮的时候，使用户知道他到底点到了哪里
  _onPanResponderGrant(evt, gestureState) {
    // 获取触摸相对根组件（屏幕）和父组件的纵坐标
    const { pageY, locationY } = evt.nativeEvent
    // 获取触摸的可拖动组件index
    this.index = this._getIdByPosition(pageY);
    if (this.index !== -1) {
      // 设置ScrollView不可滚动
      this.scrollView.setNativeProps({
        scrollEnabled: false
      });
      // 获取触摸的可拖动组件top值，用了绝对定位，这里是相对ScrollView
      this.preY = pageY - locationY;
      //设置触摸的可拖动组件样式
      let item = this.items[this.index];
      item.setNativeProps({
        style: {
          shadowColor: "#000",
          shadowOffset: { height: 1, width: -1 },
          shadowRadius: 3,
          shadowOpacity: 0.8,
          elevation: 5,
          zIndex: 999,
        }
      });
    }
  }

  // 用户正在屏幕上移动手指时
  _onPanResponderMove(evt, gestureState) {
    if (this.index !== -1) {
      // 修改被拖动组件的top值
      let top = this.preY + gestureState.dy - this.parentTop + this.scrollOffsetY - correction;
      let item = this.items[this.index];
      item.setNativeProps({
        style: { top: top }
      });

      // 调换被拖动组件与被覆盖组件位置
      let collideIndex = this._getIdByPosition(evt.nativeEvent.pageY);
      if (collideIndex !== this.index && collideIndex !== -1) {
        let collideItem = this.items[collideIndex];
        collideItem.setNativeProps({
          style: { top: this._getTopValueYById(this.index) }
        });
        //同步调换它们在this.items数组中的位置
        [this.items[this.index], this.items[collideIndex]] = [this.items[collideIndex], this.items[this.index]];
        this.index = collideIndex;
      }
    }
  }

  // 触摸操作结束时触发
  _onPanResponderRelease(evt, gestureState) {
    if (this.index !== -1) {
      // 设置回被拖动组件样式的位置
      const shadowStyle = {
        shadowColor: "#000",
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { height: 0, width: 0, },
        elevation: 0,
        zIndex: 0,
      };
      let item = this.items[this.index];
      item.setNativeProps({
        style: { ...shadowStyle, top: this._getTopValueYById(this.index) }
      });
      // 设置ScrollView可拖动
      this.scrollView.setNativeProps({
        scrollEnabled: true
      });
    }
  }

  // 获取触摸位置分组的index
  // 这个index是按当前页面显示的顺序计算，即同一位置无论实际是哪个分组，index不变
  _getIdByPosition(pageY) {
    const RowH = 50;
    let index = Math.floor((pageY - this.parentTop + this.scrollOffsetY) / RowH);
    return index >= this.items.length ? -1 : index;
  }

  // 计算分组绝对定位下的top值，index应理解为_getIdByPosition的返回值
  _getTopValueYById(index) {
    const height = 50;
    return (index * height);
  }

  render() {
    // 模拟数据
    let groupList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

    return (
      <BaseView
        ref={base => this.base = base}
        title={{ title: '管理分组', tintColor:'#fff' }}
        navigator={this.props.navigator}
      >
        <ScrollView
          ref={(ref) => this.scrollView = ref}
          style={styles.scroll}
          contentContainerStyle={{ height: groupList.length * 50, backgroundColor: 'transparent' }}
          scrollEventThrottle={12}
          automaticallyAdjustContentInsets={false}
          onScroll={e => {
            this.scrollOffsetY = e.nativeEvent.contentOffset.y <= 0 ? 0 : e.nativeEvent.contentOffset.y
          }}
        >

          {
            groupList.map((item, index) => {
              return (
                <Item
                  key={`${index}`}
                  ref={ref => this.items[index] = ref}
                  index={index}
                  data={{ item: item }}
                  panHandlers={this._panResponder.panHandlers}
                />
              );
            })
          }

        </ScrollView>
      </BaseView >
    );
  }
}

class Item extends Component {
  constructor(props) {
    super(props);
  }

  // 局部刷新界面
  setNativeProps(nativeProps) {
    this.item.setNativeProps(nativeProps);
  }

  render() {
    let { data, panHandlers, index } = this.props;

    return (
      <View ref={item => this.item = item} style={[styles.item, { top: index * 50 }]}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>分组{data.item}</Text>
        </View>
        <View style={styles.drawable} {...panHandlers}>
          <Image style={styles.drawableIco} source={require('./res/a011yidong.png')} />
        </View>
      </View>
    );
  }
}

const styles = Styles.create({
  scroll: {
    backgroundColor: '#f9f9f9',
  },
  item: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'absolute',
    borderBottomColor: '#0066FF',
    borderBottomWidth: '$BW',
  },
  titleBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    marginLeft: 12,
    maxWidth: '100% - 150',
    fontSize: 16,
    color: '#333'
  },
  drawable: {
    justifyContent: 'center',
    alignItems: 'center',
    // height: 49,
    // width: 50,
    backgroundColor: '#00FF00',
  },
  drawableIco: {
    width: 22,
    height: 10.5,
    marginRight: 15,
    resizeMode: 'contain',
    backgroundColor: '#00FF00',
  },
});