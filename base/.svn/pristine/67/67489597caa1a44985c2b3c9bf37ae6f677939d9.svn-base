import React, { Component } from 'react';
import CommonList from 'future/src/test/CommonList';

import TimePage from "./module/TimePickPage";
import AddressPage from "./module/AddPickerPage";
import ADPage from "./module/ADPage";
import PhotoPage from "./module/PhotoPage";
import CheckBoxPage from "./module/CheckBoxPage";
import DrawPage from "./module/DrawPage";
import QrcodePage from "./module/QrCodePage";
import ShareSDKPage from "./module/ShareSDKPage";
import LoginPage from "./module/LoginPage";
import IMPage from "./module/IMPage";
import PushPage from "./module/PushPage";
import StatisticsPage from "./module/StatisticsPage";
import Blur from "./module/Blur";
import RippleAndroid from "./module/RippleAndroid";
import Map from './module/BMKMap';
import Payment from './module/Payment';
import ImallVersion from './module/ImallVersion';
import PullUp from "./module/PullUp";
import PullDown from "./module/PullDown";

const datas = [
	{
		title: '时间控件TimePickPage',
		component: TimePage
	},
	{
		title: '地区选择器AddPickerPage',
		component: AddressPage
	},
	{
		title: '广告滚动条ADPage',
		component: ADPage
	},
	{
		title: '图片浏览器PhotoPage',
		component: PhotoPage
	},
	{
		title: 'CheckBoxPage',
		component: CheckBoxPage
	},
	{
		title: '签名DrawPage',
		component: DrawPage
	},
	{
		title: '二维码QrCodePage',
		component: QrcodePage
	},
	{
		title: '分享ShareSDKPage',
		component: ShareSDKPage
	},
	{
		title: '多渠道登录LoginPage',
		component: LoginPage
	},
	{
		title: 'IM组件IMPage',
		component: IMPage
	},
	{
		title: '极光推送PushPage',
		component: PushPage
	},
	{
		title: '数据统计StatisticsPage',
		component: StatisticsPage
	},
	{
		title: '毛玻璃效果Blur',
		component: Blur
	},
	{
		title: '水波纹(仅安卓)RippleAndroid',
		component: RippleAndroid
	},
	{
		title: '百度地图',
		component: Map
	},
	{
		title: '支付宝微信银联',
		component: Payment
	},
	{
		title: '获取版本号',
		component: ImallVersion
	},
	{
		title: '下拉加载更多PullUp',
		component: PullUp
	},
	{
		title: '下拉加载详情PullDown',
		component: PullDown
	},
]

export default class Test extends Component {
	render() {
		return (
			<CommonList
				navigator={this.props.navigator}
				type="column"
				header={'模块'}
				datas={datas}
			/>
		);
	}
}