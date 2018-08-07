import React, { Component } from 'react';
import CommonList from 'future/src/test/CommonList';

import Basis from './official/Basis';
import FlexTest from './official/FlexTest';
import Lifecycle from './official/Lifecycle';
import ActivityIndicatorTest from './official/ActivityIndicatorTest';
import ImageTest from './official/ImageTest';
import ListViewTest from './official/ListViewTest';
import ModalTest from './official/ModalTest';
import NavigatorTest from './official/navigatorTest/NavigatorTest';
import NavigatorOfficial from './official/NavigatorOfficial';
import ScrollViewTest from './official/ScrollViewTest';
import SliderTest from './official/SliderTest';
import SwitchTest from './official/SwitchTest';
import TextTest from './official/TextTest';
import TextInputTest from './official/TextInputTest';
import TouchableTest from './official/TouchableTest';
import WebViewTest from './official/WebViewTest';
import AlertTest from './official/AlertTest';
import AnimatedTest from './official/AnimatedTest';
import AnimatedTest2 from './official/AnimatedTest2';
import AsyncStorageTest from './official/AsyncStorageTest';
import ClipboardTest from './official/ClipboardTest';
import LinkingTest from './official/LinkingTest';
import NetInfoTest from './official/NetInfoTest';
import PanResponderTest from './official/PanResponderTest';
import KeyboardTest from './official/KeyboardTest';



const datas = [
	{
		title: '几点说明Basis',
		component: Basis
	},
	{
		title: '盒子布局Flexbox',
		component: FlexTest
	},
	{
		title: '生命周期Lifecycle',
		component: Lifecycle
	},
	{
		title: 'ActivityIndicator',
		component: ActivityIndicatorTest
	},
	{
		title: 'Image',
		component: ImageTest
	},
	{
		title: 'ListView',
		component: ListViewTest
	},
	{
		title: 'Modal',
		component: ModalTest
	},

	{
		title: 'Navigator官方',
		component: NavigatorOfficial
	},
	{
		title: 'Navigator项目',
		component: NavigatorTest
	},
	{
		title: 'ScrollView',
		component: ScrollViewTest
	},
	{
		title: 'Slider',
		component: SliderTest
	},
	{
		title: 'Switch',
		component: SwitchTest
	},
	{
		title: 'Text',
		component: TextTest
	},
	{
		title: 'TextInput',
		component: TextInputTest
	},
	{
		title: 'Touchable',
		component: TouchableTest
	},
	{
		title: 'WebView',
		component: WebViewTest
	},
	{
		title: 'Alert',
		component: AlertTest
	},
	{
		title: 'Animated',
		component: AnimatedTest
	},
	{
		title: 'Animated综合',
		component: AnimatedTest2
	},
	{
		title: 'AsyncStorage',
		component: AsyncStorageTest
	},
	{
		title: 'Clipboard',
		component: ClipboardTest
	},
	{
		title: 'Linking',
		component: LinkingTest
	},
	{
		title: 'NetInfo',
		component: NetInfoTest
	},
	{
		title: 'PanResponder',
		component: PanResponderTest
	},
	{
		title: 'Keyboard',
		component: KeyboardTest
	},

]

export default class Test extends Component {
	render() {
		return (
			<CommonList
				navigator={this.props.navigator}
				header={'官方'}
				datas={datas}
			/>
		);
	}
}