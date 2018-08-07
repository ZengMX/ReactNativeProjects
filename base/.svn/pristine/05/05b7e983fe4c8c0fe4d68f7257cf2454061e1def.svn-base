/**
 * 一个底部Tab示例， 使用react-native-tab-navigator控件
 * 添加依赖
 * npm install react-native-tab-navigator --save
 *
 * API doc:
 * https://github.com/exponentjs/react-native-tab-navigator
 * 封装后使用方法
 * initialTabIndex   默认显示的tab，0是第一个
 * tabs  tab对象数组：
 * 	 {
 * 	 	icon: require('future/src/widgets/tab/img/tab1.png'),                 未选中的图标
 * 	  	selectedIcon: require('future/src/widgets/tab/img/tab1_s.png'),       选中的图标
 * 	  	title: '首页',                                                         title
 * 	  	view: <Home navigator={this.props.navigator} focusTime={this.state.focusTime} />  要显示的组件
 * 	 }
 *  onChangeTab 切换Tab的回调函数
 */
'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
} from 'react-native';

import _ from 'underscore';

import TabNavigator from 'react-native-tab-navigator';
// 底部Tab角标组件
import Badge from './Badge';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

export default class TabBar extends Component {
    static defaultProps = {
        initialTabIndex: 0 //默认显示的tab
    };
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: this.props.initialTabIndex,
            BadgeInfo: { 1: 5, 2: 3 } //默认角标
        }
        this.changeTab = this.changeTab.bind(this);

    }
    componentDidMount() {
        // 监听，App全局触发changeTabBarIdx2事件后执行Tab切换
        this.changeTabBarIdxListener = RCTDeviceEventEmitter.addListener('changeTabBarIdx2', ({ idx }) => {
            this.changeTab(idx);
        });
        // 监听，App全局触发setTabBadge事件后执行角标更新
        // 使用方法：RCTDeviceEventEmitter.emit('setTabBadge', { index:1, count:9 });
        this.setTabBadgeListener = RCTDeviceEventEmitter.addListener('setTabBadge', ({ index, count }) => {
            if (!_.isNumber(index)) {
                return false;
            }
            if ((_.isString(count) || _.isNumber(count)) && parseInt(count) > 0) {
                count = parseInt(count) > 99 ? 99 : parseInt(count);
                this.setState({
                    BadgeInfo: Object.assign({}, this.state.BadgeInfo, { [index]: count })
                })
            } else {
                this.setState({
                    BadgeInfo: Object.assign({}, this.state.BadgeInfo, { [index]: null })
                })
            }
            return true;
        });
    }
    componentWillUnmount() {
        this.changeTabBarIdxListener.remove();
        this.setTabBadgeListener.remove();
    }
    // Tab切换
    changeTab(index) {
        if (this.state.selectedTab != index) {
            this.setState({
                lastSelectedTab: this.state.selectedTab,
                selectedTab: index
            });
            this.props.onChangeTab && this.props.onChangeTab(index);
        }
    }

    // 对应https://github.com/exponentjs/react-native-tab-navigator介绍，修改对应属性值，变成自己需要的样式
    _renderTabItem(data, index) {
        return (
            <TabNavigator.Item
                key={data.title}
                title={data.title}
                titleStyle={{ marginTop: 0, color: '#999999' }}
                selectedTitleStyle={{ marginTop: 0, color: '#2fbdc8' }}
                selected={this.state.selectedTab === index}
                renderIcon={() => <Image style={styles.tabIcon} source={data.icon} />}
                renderSelectedIcon={() => <Image style={styles.tabIcon} source={data.selectedIcon} />}
                renderBadge={() => <Badge>{this.state.BadgeInfo[index]}</Badge>}
                onPress={() => {
                    this.changeTab(index);
                }}>
                {data.view}
            </TabNavigator.Item>
        );
    }
    // 如果对应tab内无view属性，即无要显示的组件，用下面的代替
    static _createChildView(tag) {
        return (
            <View style={{ flex: 1, backgroundColor: '#00baff', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 22 }}>{tag}</Text>
            </View>
        )
    }

    render() {
        const tabs = this.props.tabs.map((params, index) => {
            params.view = params.view ? params.view : TabBar._createChildView(params.title);
            return this._renderTabItem(params, index);
        });
        return (
            <View style={{ flex: 1 }}>
                <TabNavigator hidesTabTouch={true} tabBarStyle={styles.tab}>
                    {tabs}
                </TabNavigator>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    // 底部TabBar样式
    tab: {
        height: 50,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    tabIcon: {
        height: 25,
        resizeMode: 'contain',
        marginBottom: 5
    }
});