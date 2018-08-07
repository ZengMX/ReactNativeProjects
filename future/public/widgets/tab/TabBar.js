/**
 * 一个底部Tab示例， 使用react-native-tab-navigator控件
 * 添加依赖
 * npm install react-native-tab-navigator --save
 *
 * API doc:
 * https://github.com/exponentjs/react-native-tab-navigator
 */
'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	Image,
	Text,
	View,
	Navigator
} from 'react-native';
import {
	Toast,
} from 'future/public/widgets';

import _ from 'underscore';

import TabNavigator from 'react-native-tab-navigator';
import Badge from './Badge';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

const styles = StyleSheet.create({
	tab: {
		height: 49,
		backgroundColor: '#fff',
		alignItems: 'center',
	},
	tabIcon: {
		width: 20,
		height: 20,
		resizeMode: 'stretch',
	}
});

export default class TabBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedTab: this.props.initialTabIndex,
		 	BadgeInfo: {}
        }
        this.changeTab2 = this.changeTab.bind(this);
	}
	static defaultProps = {
		initialTabIndex: 0
	}
	componentDidMount() {
		this.changeTabBarIdxListener = RCTDeviceEventEmitter.addListener('changeTabBarIdx2', ({idx}) => {
			this.setState({
				selectedTab: idx
			});
		});
		 this.setTabBadgeListener = RCTDeviceEventEmitter.addListener('setTabBadge', ({idx, text}) => {
            if (!_.isNumber(idx)) {
                return false;
            }
            if (_.isString(text) || _.isNumber(text)) {
                this.setState({
                    BadgeInfo: Object.assign({}, this.state.BadgeInfo, { [idx]: text })
                })
            } else {
                this.setState({
                    BadgeInfo: Object.assign({}, this.state.BadgeInfo, { [idx]: null })
                })
            }
            return true;
        });
	}
	componentWillUnmount() {
		this.changeTabBarIdxListener.remove();
		this.setTabBadgeListener.remove();
	}
	componentWillReceiveProps(nextProps) {

	}
	changeTab(index) {
		if (this.state.selectedTab != index) {
			this.setState({
				selectedTab: index
			});
		}
	}
	_renderTabItem(data, index) {
		return (
			<TabNavigator.Item
				key={data.title}
				title={data.title}
				titleStyle={{ marginTop: 7.5, color: '#999999' }}
				selectedTitleStyle={{ marginTop: 7.5, color: '#34457D' }}
				selected={this.state.selectedTab === index}
				renderIcon={() => <Image style={styles.tabIcon} source={data.icon} />}
				renderSelectedIcon={() => <Image style={styles.tabIcon} source={data.selectedIcon} />}
				renderBadge={ () => this.props.userType == "2" ? <Badge>{this.state.BadgeInfo[index]}</Badge> : <View/>}
				onPress={() => {
					if(this.props.userType == '3' && (index == 1 || index == 2)){
						Toast.show('您不是采购商');
						return;
					}
					if (this.state.selectedTab != index) {
						this.setState({
							lastSelectedTab: this.state.selectedTab,
							selectedTab: index
						});
						this.props.onChangeTab && this.props.onChangeTab(index);
					}
				} }>
				{data.view}
			</TabNavigator.Item>
		);
	}

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
