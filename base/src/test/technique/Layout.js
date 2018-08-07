import React, { Component } from 'react';
import CommonList from 'future/src/test/CommonList';

import SingleRowSelfAdaption from './layout/SingleRowSelfAdaption';
import TextImageMixture from './layout/TextImageMixture';
import MultiTabNavBar from './layout/MultiTabNavBar';
import OrderList from './layout/orderList/components/OrderList';
import MultiFunctionTab from './layout/MultiFunctionTab';
import TwoDrawer from './layout/TwoDrawer/TwoDrawer';
import RowAutoLayout from './layout/RowAutoLayout';
import Badge from './layout/Badge';
import PopupMask from './layout/PopupMask';
import RemovableList from './layout/RemovableList';
import ScrollListener from './layout/jingdongScroll/scrollUpDown';
import ScrollDrow from './layout/jingdongScroll/scrollDrowAction';
import NavigatorMenu from './layout/NavigatorMenu';
import DialogsTest from './layout/DialogsTest';
import Swipeout from './layout/SwipeoutExample';
import AlphabetListView from './layout/AlphabetListView';
import Parabola from './layout/Parabola';


const datas = [
	{
		title: '小图片与文本混合布局',
		component: TextImageMixture
	},
	{
		title: '单行N个组件自适应',
		component: SingleRowSelfAdaption
	},
	{
		title: '小红点数字上标',
		component: Badge
	},
	{
		title: '自定义Tab导航栏',
		component: MultiTabNavBar
	},
	{
		title: '多功能列表TAB',
		component: MultiFunctionTab
	},
	{
		title: '完整多TAB列表示例',
		component: OrderList
	},
	{
		title: '每行N个布局',
		component: RowAutoLayout
	},
	{
		title: '两层抽屉',
		component: TwoDrawer
	},
	{
		title: '蒙版弹层',
		component: PopupMask
	},
	{
		title: '可拖动列表',
		component: RemovableList
	},
	{
		title: '京东上下拉显示隐藏导航条',
		component: ScrollListener
	},
	{
		title: '京东上下拉显示抽屉效果展示',
		component: ScrollDrow
	},
	{
		title: '导航上的菜单',
		component: NavigatorMenu
	},
	{
		title: '弹出确认框DialogsTest',
		component: DialogsTest
	},
	{
		title: '滑动删除Swipeout',
		component: Swipeout
	},
	{
		title: '字母检索列表',
		component: AlphabetListView
	},
	{
		title: '抛物线动画',
		component: Parabola
	},


]

export default class Test extends Component {

	render() {
		return (
			<CommonList
				navigator={this.props.navigator}
				header={'布局类'}
				datas={datas} />
		);
	}
}