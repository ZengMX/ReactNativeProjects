
import React, { Component } from 'react';
import {
	View,
	ScrollView,
	Dimensions,
	Navigator,
	Text,
	Platform,
	InteractionManager
} from 'react-native';
import { Fetch } from 'future/public/lib';
import StorageUtils from 'future/public/lib/StorageUtils';
import { Loading, Toast, BaseView } from 'future/public/widgets';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TabBar from 'future/public/widgets/tab/TabBar';
import Badge from 'future/public/widgets/tab/Badge'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
//首页
import Home from './home/components/Home';
//购物车
// import ShoppingCart from './shoppingCart/components/ShoppingCart';
//我的
import Buyer from './member/components/Buyer';
// import Mine from './user/components/Mine'
//代客下单
import FastBuy from './fastBuy/components/FastBuy'
import Login from './member/components/Login';
import StocksList from "./stocksList/components/StocksList";
//消息中心
// import MessageCenter from './member/components/MessageCenter';
import Test from './Test';
import SplashScreen from "rn-splash-screen";
import Guide from './commons/guide/Guide';
import ScreenDensityUtils from './commons/guide/ScreenDensityUtils';
var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;
class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: 0,
			initialTabIndex: this.props.initialTabIndex,
			focusTime: Date.now(),
			showType: 'splash'
		};
		this.datas = null;
	}
	componentDidMount() {
		this._initTab();
		InteractionManager.runAfterInteractions(() => {
			this._initSplash();
		});
	}
	_initTab() {
		if (Platform.OS == 'android') {
			SplashScreen.hide();
		}
		this.changeTabBarIdxListener = RCTDeviceEventEmitter.addListener('changeTabBarIdx', ({ idx, goTop = false }) => {
			new Promise((resolve, reject) => {
				RCTDeviceEventEmitter.emit('changeTabBarIdx2', { idx: idx });
				resolve(goTop);
			}).then((goTop) => {
				if (true === goTop) {
					this.props.navigator.popToTop();
				}
			}).catch((err) => {
				console.log("tab切换/返回第一层出错：", err);
			});
		});
	}
	_initSplash() {
		new Fetch({
			url: 'app/index/splash.json?platformCode=' + ScreenDensityUtils.getPlatform()
			+ '&densityCode=' + ScreenDensityUtils.getDensityLeve(),
			method: 'GET',
		}).dofetch().then((data) => {
			this.datas = data.result;
			// this.setState({
			// 	showType: 'guide'
			// });
			StorageUtils.readInfo('appSplash').then((result) => {
				if (result.data) {
					this.setState({
						showType: 'index'
					});
				}
			}, (error) => {
				StorageUtils.saveInfo('appSplash', true);
				this.setState({
					showType: 'guide'
				});
			});
		}, (err) => {
			console.log('getSplash err', err)
		});
	}
	componentWillUnmount() {
		// 移除 一定要写
		this.changeTabBarIdxListener.remove();
	}
	getTabs(userType) {
		let index = userType == 1 ?
			[
				// {
				// 	icon: require('future/public/widgets/tab/img/000shouye.png'),
				// 	selectedIcon: require('future/public/widgets/tab/img/000shouye_s.png'),
				// 	title: '工作台',
				// 	view: <Salesman navigator={this.props.navigator} focusTime={this.state.focusTime} />
				// },
				{
					icon: require('future/public/widgets/tab/img/000daikexiadan.png'),
					selectedIcon: require('future/public/widgets/tab/img/000daikexiadan_s.png'),
					title: '代客下单',
					view: <FastBuy navigator={this.props.navigator} focusTime={this.state.focusTime} />
				},
				// {
				// 	icon: require('future/public/widgets/tab/img/000xiaoxi.png'),
				// 	selectedIcon: require('future/public/widgets/tab/img/000xiaoxi_s.png'),
				// 	title: '消息',
				// 	view: <MessageCenter navigator={this.props.navigator} focusTime={this.state.focusTime} />
				// },
			] :
			[
				{
					icon: require('future/public/widgets/tab/img/000shouye.png'),
					selectedIcon: require('future/public/widgets/tab/img/000shouye_s.png'),
					title: '首页',
					view: <Home navigator={this.props.navigator} focusTime={Date.now()} />
				},
				{
					icon: require('future/public/widgets/tab/img/000sugou.png'),
					selectedIcon: require('future/public/widgets/tab/img/000sugou_s.png'),
					title: '速购',
					view: <FastBuy navigator={this.props.navigator} focusTime={Date.now()} />
				},
				{
					icon: require('future/public/widgets/tab/img/000jinhuodan.png'),
					selectedIcon: require('future/public/widgets/tab/img/000jinhuodan_s.png'),
					title: '进货单',
					view: <StocksList ref='shoppingCart' navigator={this.props.navigator} isFromTab={true} focusTime={Date.now()} />
				},
				{
					icon: require('future/public/widgets/tab/img/000wode.png'),
					selectedIcon: require('future/public/widgets/tab/img/000wode_s.png'),
					title: '我的',
					view: <Buyer navigator={this.props.navigator} focusTime={Date.now()} />
				},
				// {
				// 	icon: require('future/public/widgets/tab/img/000wode.png'),
				// 	selectedIcon: require('future/public/widgets/tab/img/000wode_s.png'),
				// 	title: '测试页面',
				// 	view: <Test navigator={this.props.navigator} />
				// },
			]
		return index;
	}

	//页面初始化时展示启动图，在componentDidMount中更新state判断要显示的页面：首页或活动页
	render() {
		let content = undefined;
		switch (this.state.showType) {
			case 'guide':
				content = <Guide navigator={this.props.navigator} datas={this.datas} />;
				break;
			default:
				//initialTabIndex 进入APP初始页
				content = <TabBar
					initialTabIndex={this.state.initialTabIndex}
					ref={tabBar => this.tabBar = tabBar}
					tabs={this.getTabs(2)}
					userType={2}
					onChangeTab={(index) => {
						//如果没有登录，自动跳转到登录页面
						// if ((index == 1 || index == 2 || index == 3) && !this.props.isLogin) {
						// 	this.props.navigator.push({
						// 		component: Login,
						// 		//以下两个参数同时存在时点击安卓物理返回键跳转到首页
						// 		//具体实现可以查看navigator.js文件中的 onBackAndroid 方法
						// 		name: 'Login',
						// 		needToBackHome: 'true',
						// 		params:{
						// 			isFromTab:true,
						// 			callback: ()=>{
						// 				//进货单登录回调
						// 				// InteractionManager.runAfterInteractions(() => {
						// 				// 	index == 2 && this.refs.shoppingCart.getWrappedInstance().fetchData();
						// 				// });
						// 			}
						// 		}
						// 	});
						// }
						this.setState({
							selected: index,
							focusTime: Date.now()
						});
					}} />
		}
		return content;
	}
}
export default Index;
