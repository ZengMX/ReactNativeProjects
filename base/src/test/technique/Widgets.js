import React, { Component } from 'react';
import CommonList from 'future/src/test/CommonList';

import TestText from './widgets/TestText';
import Loading from './widgets/Loading';
import LoadingView from './widgets/LoadingView';
import TestBanner from './widgets/TestBanner';
import ReList from './widgets/RefreshableListView';
import ImagePicker from './widgets/ImagePicker';
import TestNumberInput from './widgets/TestNumberInput';
import ItemPicker from './widgets/ItemPicker';
import DatePicker from './widgets/DatePicker';
import Star from './widgets/Star';
import ScalePopupView from './widgets/ScalePopupView';
import Cookies from './widgets/Cookies';
import TabBadge from './widgets/TabBadge';
import Toast from './widgets/Toast';
import ImageUploader from "./widgets/ImageUploader";
import NewRefreshableListView from "./widgets/NewRefreshableListView";
import Panels from "./widgets/Panels";
import NoticeBanner from "./widgets/NoticeBannerTest";

const datas = [
	{
		title: 'Text',
		component: TestText
	},
	{
		title: 'Loading',
		component: Loading
	},
	{
		title: 'Loading2',
		component: LoadingView
	},
	{
		title: '图片选择ImagePicker',
		component: ImagePicker
	},
	{
		title: '上传图片ImageUploader',
		component: ImageUploader
	},
	{
		title: 'NumberInput',
		component: TestNumberInput
	},
	{
		title: '单项选择ItemPicker',
		component: ItemPicker
	},
	{
		title: '日期选择DatePicker',
		component: DatePicker
	},
	{
		title: '星星StarRating',
		component: Star
	},

	{
		title: '弹出层ScalePopupView',
		component: ScalePopupView
	},
	{
		title: 'Cookies',
		component: Cookies
	},
	{
		title: '设置Tab角标TabBadge',
		component: TabBadge
	},
	{
		title: 'Toast',
		component: Toast
	},
	{
		title: '上下拉刷新列表RefreshableListView',
		component: ReList
	},
	{
		title: 'New上下拉刷新列表NewRefreshableListView',
		component: NewRefreshableListView
	},
	{
		title: '缓慢展开和收起的组件',
		component: Panels
	},
	{
		title: '公告轮播',
		component: NoticeBanner
	},
]

export default class Test extends Component {
	render() {
		return (
			<CommonList
				navigator={this.props.navigator}
				header={'Widgets'}
				type="column"
				datas={datas}
			/>
		);
	}
}
