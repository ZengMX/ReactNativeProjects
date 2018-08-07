
'use strict';

import React, { Component } from 'react';
import {
	ScrollView,
} from 'react-native';

import Pullable from './Pullable';
/**
支持android&ios可以下拉刷新的PullView组件
Demo:
import {PullView} from 'react-native-pullview';
<PullView onPulling={} onPullOk={} onPullRelease={} isPullEnd={true}
topIndicatorRender={({pulling, pullok, pullrelease}) => {}} topIndicatorHeight={60}
>
Demo2:
    topIndicatorRender(pulling, pullok, pullrelease) {
        return <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 60}}>
            <ActivityIndicator size="small" color="gray" />
            {pulling ? <Text>下拉刷新2...</Text> : null}
            {pullok ? <Text>松开刷新2......</Text> : null}
            {pullrelease ? <Text>玩命刷新中2......</Text> : null}
        </View>;
    }
    <PullView onPullRelease={this.props.onRefresh} topIndicatorRender={this.topIndicatorRender} topIndicatorHeight={60} >
        <Children />
    </PullView>
Demo3:
    onRefresh() {
        this.setState({refreshing: true});
        return new Promise((resolve) => {
            setTimeout(() => {resolve()}, 9000);
        }).then(() => {
            this.setState({refreshing: false})
        })
        // setTimeout(() => {
        //     this.setState({refreshing: false});
        // }, 3000);
    }
    <PullView refreshControl={} onRefresh={this.onRefresh} refreshing={this.state.refreshing}>
        <Children />
    </PullView>

    style: 设置组件样式，比如可以设置width/height/backgroudColor等
    onPulling: 处于pulling状态时执行的方法
    onPullOk: 处于pullok状态时执行的方法
    onPullRelease: 处于pullrelease状态时执行的方法，接受一个参数：resolve，最后执行完操作后应该调用resolve()。
    onPushing: 当从下往上推时执行的方法，接受一个参数：gesturePosition。gesturePosition是json格式{x, y}对象，当从上往下拉时gesturePosition.y > 0，当从下往上推时gesturePosition.y < 0。
    topIndicatorRender: 顶部刷新指示组件的渲染方法, 接受4个参数: ispulling, ispullok, ispullrelease，gesturePosition，你可以使用gesturePosition定义动画头部。
    topIndicatorHeight: 顶部刷新指示组件的高度, 若定义了topIndicatorRender则同时需要此属性

    isPullEnd: 是否已经下拉结束，若为true则隐藏顶部刷新指示组件，非必须

    仅PullView支持的普通refreshcontrol的相关属性

    onRefresh: 开始刷新时调用的方法
    refreshing: 指示是否正在刷新

    user
    //下拉刷新的数据
	_onPullRelease(resolve) {
		setTimeout(()=>{
            this.props.actions.getHome().then((data)=>{
				resolve();// 隐藏加载中
		    });
		    this.props.actions.getShopList();
		},500);//要设个时间让动画执行完再去加载数据
    }
    <PullView  style={styles.scrollView} 				 
	onPullRelease={this._onPullRelease.bind(this)}>
       。。。otherView					
	</PullView>
*/

export default class extends Pullable {

	constructor(props) {
		super(props);
	}

	getScrollable(refreshControl) {
		return (
			<ScrollView ref={(c) => { this.scroll = c; } } refreshControl={refreshControl} scrollEnabled={this.state.scrollEnabled} onScroll={this.onScroll}>
				{this.props.children}
			</ScrollView>
		);
	}

}