import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	ScrollView,
	Dimensions,
	TouchableOpacity,
	Animated,
	StatusBar,
	PixelRatio,
	Platform,
	Easing,
	RefreshControl,
	InteractionManager,
	AppState,
} from 'react-native';
import {
	NavBar,
	BannerA,
	RefreshableListView,
	NoticeBanner,
	Toast
} from 'future/public/widgets';
import styles from '../styles/Home';
import { Fetch, imageUtil, ImallCookies, ValidateUtil } from 'future/public/lib';
import _ from 'underscore';
import SwiperAPI from 'react-native-swiper';
import * as homeActions from 'future/src/home/actions/Home';
import * as userActions from 'future/src/member/actions/Member';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
let fullwidth = Dimensions.get('window').width;
let imageArrViewHeight = fullwidth * 0.6875 / 2;

import ProductDetail from 'future/src/product/components/ProductDetail';
import WebViewPage from 'future/public/commons/WebViewPage';
import GroupBuyList from 'future/src/groupBuy/components/GroupBuyList';
import FlashSale from 'future/src/flashSale/components/FlashSale';
import OrderList from 'future/src/order/components/OrderList';
import MallPoints from 'future/src/prdPoints/components/MallPoints';
import PurchaseList from 'future/src/purchase/components/PurchaseList';
import ProcureProgram from 'future/src/fastBuy/components/ProcureProgram';
import Search from './Search';
import FindProduct from '../../product/components/FindProduct';
import MessageCenter from '../../member/components/MessageCenter';
import GetCoupon from '../../stocksList/components/GetCoupon';
import InforChannel from '../../inforChannel/components/InforChannel';
import ProductList from '../../product/components/ProductList';
import SupplierHome from '../../supplierHome/components/SupplierHome';
import config from 'future/public/config';

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			scrollY: new Animated.Value(0),
			barState: false,
			showMessageTip: false,
			isRefreshing: false,
			isShowToTop: false,
			selectTabIndex: 0,
			toggleNavBarImg: false,
		}
		this._renderHeader = this._renderHeader.bind(this);
		this._renderEntryPage = this._renderEntryPage.bind(this);
		this._onTabPress = this._onTabPress.bind(this);
		this.refreshingCall = this._refreshingCall.bind(this);
		this.bannerData = [];//轮播数据
		this.noticeData = [];//公共数据
		this.entryPageHeight = 102;
		this.tabPressBg = { backgroundColor: '#2e0f50' }
		this.tabPressTextBg = { color: '#fff' }
		this.appModuleId = '';
		this.moduleTabId = '';
		this.sysOrgId = '';
		this.refreshHome = false;
		this.isLoginRender = false;					//判断首页是否是登录状态对应的render
	}
	async componentDidMount() {
		this.props.actions.getHome().then((data) => {
			let tabListData = this.searchtabList('app_module_index_product');
			if (tabListData != null) {
				this.appModuleId = tabListData[0].appModuleId;
				this.moduleTabId = tabListData[0].appModuleTabId;
				this.sysOrgId = tabListData[0].sysOrgId;
				this.refs.list.reloadData();
			}
		});
		new Fetch({
			url: '/app/user/getUser.json',
			method: "POST",
			forbidToast: true,
		}).dofetch().then((data) => {
			//判断账户是否通过了审核，通过审核才算登录成功
			if (data.result.isApprove) {
				this.props.actions.setLogined(true);
				this.isLoginRender = true;
			}
			if (data.result.messageNum > 0) {
				this.setState({
					showMessageTip: true,
				});
			}
		}).catch((err) => {
			console.log(err)
		})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.focusTime != this.props.focusTime && !this.refreshHome) {
			console.log('-------------------11111');
			//如果当前home状态和redux的状态同，需要重新请求数据
			if (this.isLoginRender != this.props.isLogin) {
				console.log('-------------------22222');
				this.reloadHomeData();
				this.isLoginRender = this.props.isLogin;
			}
		}
	}

	//重新获取Home的数据	
	reloadHomeData() {
		this.props.actions.getHome().then((data) => {
			let tabListData = this.searchtabList('app_module_index_product');
			if (tabListData != null) {
				this.appModuleId = tabListData[0].appModuleId;
				this.moduleTabId = tabListData[0].appModuleTabId;
				this.sysOrgId = tabListData[0].sysOrgId;
				this.refs.list.reloadData();
			}
		}).catch((err) => {
			console.log("获取首页数据：", err)
		});
	}

	//获取数据
	_fetchData(page, success, error) {
		//请求分页列表
		new Fetch({
			url: 'app/index/pageTabObjects.json',
			data: {
				pageNumber: page,
				pageSize: 10,
				appModuleId: this.appModuleId,
				moduleTabId: this.moduleTabId,
				sysOrgId: this.sysOrgId
			}
		}).dofetch().then((data) => {
			// if (data.totalCount != 0) {
				success(data.result, page * 10, data.totalCount);
			// }
		}).catch((err) => { 
			error && error();
			console.log(err);
		 });

	}
	_refreshingCall() {
		this.setState({
			isRefreshing: true
		});
		this.props.actions.getHome().then((data) => {
			let tabListData = this.searchtabList('app_module_index_product');
			if (tabListData != null) {
				this.appModuleId = tabListData[0].appModuleId;
				this.moduleTabId = tabListData[0].appModuleTabId;
				this.sysOrgId = tabListData[0].sysOrgId;
				this.refs.list.reloadData();
				console.log('_refreshingCall');
			}
		}).catch((err) => {
			console.log("获取首页数据：", err)
		}).finally(() => {
			this.setState({
				isRefreshing: false
			});
		});
	}

	openComponent = (component, params = {}) => {
		this.refreshHome = true;
		setTimeout(() => {
			this.refreshHome = false;
		}, 0)
		let navigator = this.props.navigator;
		if (navigator) {
			navigator.push({
				component,
				params,
			})
		}
	}
	/*
	根据后台配置的URL打开指定的页面
		1.自定义页面：userPage/8/   
		2.商品列表页：productlist?categoryId=xxx&keyword=太极    
		3.商家页面：shop?shopId=xx
	*/
	_selfSetURLAction=(data)=>{
		let url = data.openUrl;
		if(ValidateUtil.isBlank(url)){
			return;
		}
		let typeWord = url.split('/')[0];
		let paramTypeWord = url.split('?')[0];
		if(typeWord == 'userPage'){
			this.openComponent(WebViewPage, { title: null, url: config.host + data.openUrl });
		}
		if(paramTypeWord == 'productlist'){
			let categoryId = ((url.split('?')[1]).split('&')[0]).split('=')[1];
			let keyword = ((url.split('?')[1]).split('&')[1]).split('=')[1];
			this.openComponent(ProductList, { categoryId: categoryId, keyword: keyword });
		} else if(paramTypeWord == 'shop'){
			let shopId = (url.split('?')[1]).split('=')[1];
			this.openComponent(SupplierHome, { shopInfId: shopId })
		}
	}

	//分类
	_onCatePress() {
		this.openComponent(FindProduct)
	}
	//通知点击
	_onMessagePress() {
		this.openComponent(MessageCenter)
	}
	//点击搜索
	_onSearchPress() {
		this.openComponent(Search)
	}
	//轮播点击 ￥￥￥￥￥
	pressBanner(index) {
		console.log('轮播点击数据', this.bannerData[index]);
		if(this.bannerData[index].openUrl){
			this._selfSetURLAction(this.bannerData[index])
		} else {
			this._openPage(this.bannerData[index]);
		}
	}
	//功能入口点击 ￥￥￥￥￥
	_onEntryPress(data) {
		console.log('功能入口点击数据', data);
		if(data.openUrl){
			this._selfSetURLAction(data)
		} else {
			this._openPage(data);
		}
	}
	//首页公告点击
	_onNoticePress(data) {
		console.log('首页公告点击数据', data);
		this.noticeData.map((item, index) => {
			if (item.text == data) {
				console.log('首页公告数据', item);
				this._openPage(item);
			}
		});
	}
	//左边图片点击 ￥￥￥￥￥
	_onImageLeftArrPress(data) {
		console.log('左边图片点击数据', data);
		if(data.openUrl){
			this._selfSetURLAction(data)
		} else {
			this._openPage(data);
		}
	}
	//右边图片点击  ￥￥￥￥￥
	_onImageRightArrPress(data) {
		console.log('右边图片点击数据', data);
		if(data.openUrl){
			this._selfSetURLAction(data)
		} else {
			this._openPage(data);
		}
	}
	//商品条目点击
	_onProducPress(data) {
		console.log('商品条目点击数据', data);
		this._openPage(data);
	}
	_openPage(item) {
		if (item == undefined || item.actionTypeCode == undefined) return;
		switch (item.actionTypeCode) {
			case '0':
				Toast.show('暂无此功能!');
				break;
			//商品
			case '1':
				this.openComponent(ProductDetail, { productId: item.targetObjectId, })
				break;
			//主题
			case '2':

				break;
			//链接url
			case '3':
				this.openComponent(WebViewPage, { title: item.text, url: item.openUrl });
				break;
			//抢购活动
			case '4':
				this.openComponent(FlashSale)
				break;
			//团购活动
			case '5':
				this.openComponent(GroupBuyList)
				break;
			//订单列表
			case '6':
				this.openComponent(OrderList)
				break;
			//积分商品
			case '7':
				this.openComponent(MallPoints)
				break;
			//采购计划
			case '8':
				this.openComponent(PurchaseList)
				break;
			//常购清单
			case '9':
				this.openComponent(ProcureProgram, { purchaseType: 1, })
				break;
			//领券爽
			case '10':
				this.openComponent(GetCoupon)
				break;
			//分类
			case '11':
				this.props.navigator.push({
					component: ProductList,
					params: {
						categoryId: 3,
					}
				});
				break;
			//资讯
			case '12':
				this.openComponent(InforChannel)
				break;
		}
	}
	_renderHeader() {
		let bgcolor = this.state.scrollY.interpolate({
			inputRange: [0, 120],
			outputRange: ['rgba(255,255,255,0)', 'rgba(255,255,255,1)'],
			//easing映射函数设置
			easing: Easing.ease,
			extrapolateLeft: 'clamp'
		})
		let inpcolor = this.state.scrollY.interpolate({
			inputRange: [110, 120],
			outputRange: ['rgba(249,249,249,0.9)', 'rgba(243,243,243,1)'],
			//阻止output超出范围，默认可以extend可以超出
			extrapolate: 'clamp'
		})
		let opacity = this.state.scrollY.interpolate({
			inputRange: [-10, -4],
			outputRange: [0, 1],
			extrapolateRight: 'clamp'
		});

		const fenleiImg = require('../res/home/001fenlei.png');
		const fenleiImg_s = require('../res/home/001fenlei_s.png');
		const xiaoxiImg = require('../res/home/000xiaoxi.png');
		const xiaoxiImg_s = require('../res/home/000xiaoxi_s.png');

		return (
			<Animated.View style={[styles.header, { backgroundColor: bgcolor, opacity: this.state.isRefreshing == false ? 1 : 0 }]} >
				<NavBar
					style={{ backgroundColor: 'transparent', height: Platform.OS == 'ios' ? 40 : 46, width: fullwidth, flexDirection: 'row', }}
					mainColor={'#00000000'}
					navigator={this.props.navigator}
					hideLeftBtn={true}
					rightButton={
						<TouchableOpacity style={{ width: 45, height: 32, marginTop: 7, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} onPress={() => { this._onMessagePress() }}>
							<Image source={this.state.toggleNavBarImg ? xiaoxiImg_s : xiaoxiImg} resizeMode='stretch' style={{ width: 16, height: 19.5 }}>
							</Image>
							{this.state && this.state.showMessageTip == true ?
								<View style={{ position: 'absolute', height: 8, width: 8, backgroundColor: '#e81f25', right: 10, top: 3.5, borderRadius: 4, borderWidth: 1, borderColor: '#fff' }}></View>
								: null}
						</TouchableOpacity>}
				>

					<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 45, justifyContent: 'center' }}>
						<TouchableOpacity style={{ width: 45, height: 32, alignItems: 'center', justifyContent: 'center' }} onPress={() => { this._onCatePress() }} >
							<Image source={this.state.toggleNavBarImg ? fenleiImg_s : fenleiImg} resizeMode='stretch' style={{ width: 20, height: 15.5 }} />
						</TouchableOpacity>
						<TouchableOpacity
							style={{ height: 30, flex: 1, backgroundColor: inpcolor, alignItems: 'center', flexDirection: 'row', borderRadius: 25, justifyContent: 'center' }}
							onPress={() => { this._onSearchPress() }}
							activeOpacity={1}>
							<Image source={require('../res/home/a002sousuo.png')} resizeMode='stretch' style={styles.inp} />
							<Text style={{ color: '#999' }}>搜索商品/品牌</Text>
						</TouchableOpacity>
					</View>
				</NavBar>
			</Animated.View>
		);
	}
	//首页轮换广告 'app_module_index_banner'
	//首页功能入口 app_module_index_entry
	//首页公告：'app_module_index_notice'
	//"首页左边广告"：'app_module_index_adv_left'
	//"首页右边广告"：'app_module_index_adv_right'
	//首页品牌推荐 "app_module_index_brand"
	//首页商品推荐：'app_module_index_product'
	searchModuleObjects(innerCode) {
		let obj = null;
		_.each(this.props.homeData, (item, index) => {
			if (item.innerCode == innerCode && item.moduleObjects.length != 0) {
				obj = item.moduleObjects;
			}
		});
		return obj;
	}
	_getBannerImg() {
		let data = this.searchModuleObjects('app_module_index_banner');
		this.bannerData = data;
		console.log('app_module_index_banner', data);
		let img = [];
		if (data != null && data.length > 0) {
			_.each(data, (item, index) => {
				img[index] = item.iconFileUrl;
			});
		}
		return img;
	}
	_renderEntryItems(data, index) {
		let size = 35*fullwidth/320
		let indexs = index * 4;
		//console.log('data', data);
		return (<View style={{ flex: 1, flexDirection: 'row', alignItems: "center", justifyContent: 'space-around'}}>
			<TouchableOpacity onPress={() => { this._onEntryPress(data[indexs + 0]) }}>
				<View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
					<Image source={data[indexs + 0] == undefined ? require('../res/home/Rectangle.png') : imageUtil.get(data[indexs + 0].iconFileUrl)} style={{ width: size, height: size }} resizeMode='stretch' />
					<Text style={{ fontSize: 11, color: '#000', marginTop: 6 }}>{data[indexs + 0] == undefined ? "" : data[indexs + 0].text}</Text>
				</View>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => { this._onEntryPress(data[indexs + 1]) }}>
				<View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
					<Image source={data[indexs + 1] == undefined ? require('../res/home/Rectangle.png') : imageUtil.get(data[indexs + 1].iconFileUrl)} style={{ width: size, height:  size }} resizeMode='stretch' />
					<Text style={{ fontSize: 11, color: '#000', marginTop: 6 }}>{data[indexs + 1] == undefined ? "" : data[indexs + 1].text}</Text>
				</View>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => { this._onEntryPress(data[indexs + 2]) }}>
				<View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
					<Image source={data[indexs + 2] == undefined ? require('../res/home/Rectangle.png') : imageUtil.get(data[indexs + 2].iconFileUrl)} style={{ width: size, height:  size }} resizeMode='stretch' />
					<Text style={{ fontSize: 11, color: '#000', marginTop: 6 }}>{data[indexs + 2] == undefined ? "" : data[indexs + 2].text}</Text>
				</View>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => { this._onEntryPress(data[indexs + 3]) }}>
				<View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
					<Image source={data[indexs + 3] == undefined ? require('../res/home/Rectangle.png') : imageUtil.get(data[indexs + 3].iconFileUrl)} style={{ width: size, height:  size }} resizeMode='stretch' />
					<Text style={{ fontSize: 11, color: '#000', marginTop: 6 }}>{data[indexs + 3] == undefined ? "" : data[indexs + 3].text}</Text>
				</View>
			</TouchableOpacity>
		</View>);
	}
	_renderEntryPage(data) {
		this.entryPageHeight = 102;
		let length = data.length / 4;
		let pageCount = [];
		for (var i = 0; i < length; i++) {
			pageCount.push('page' + i);
		}
		return pageCount.map((item, index) => {
			return (
				<View style={{ flex: 1, flexDirection: 'row' }} key={index}>
					{this._renderEntryItems(data, index)}
				</View>
			);
		});
	}
	_renderEntry() {
		let data = this.searchModuleObjects('app_module_index_entry');
		//console.log('_renderEntryPage data', data);
		if (data != null && data.length > 0) {
			return (
				<SwiperAPI
					width={fullwidth}
					height={this.entryPageHeight}
					showsButtons={false}
					dot={<View style={{ backgroundColor: '#DBDBDB', width: 4, height: 4, borderRadius: 2, marginRight: 5, }} />}
					activeDot={<View style={{ backgroundColor: '#34457D', width: 4, height: 4, borderRadius: 2, marginRight: 5, }} />}
					paginationStyle={{
						bottom: 8
					}}
				>
					{this._renderEntryPage(data)}
				</SwiperAPI>
			);
		}
	}
	_renderNotice() {
		let datas = this.searchModuleObjects('app_module_index_notice');
		this.noticeData = datas;
		//console.log('app_module_index_notice data', datas);
		let dataAr = [];
		if (datas != null) {
			datas.map((item, index) => {				
				dataAr.push(item.text);				
			});
			return (
				<View style={styles.noticeView}>										
					<Text style={{ fontSize: 13, color: '#444' }}>电商</Text>
					<Image style={{height:15,width:30,justifyContent:'center',alignItems:'center'}} source={require('../res/home/001zixundi.png')}>	
						<Text style={{ fontSize: 12, color: '#fff',backgroundColor:'transparent'}}>资讯</Text>
					</Image>
					<NoticeBanner
						style={styles.noticeBanner}
						textStyle={{color: "#444", fontSize: 12, marginLeft: 5,}}
						pressActions={(Value) => { this._onNoticePress(Value) }}
						dataArr={dataAr}
						num={3}
					></NoticeBanner>
					<View style={{width:1,height:14,backgroundColor:'#eee',marginLeft:19}}/>
					<Text style={{fontSize:12,color:'#444',marginLeft:10}} 
						onPress={()=>{
							this.props.navigator.push({component:InforChannel})
						}}>更多</Text>
				</View>
			);
		} else {
			return null;
		}
	}
	_renderRight(right, index) {
		let dataIndex = index * 4;
		if (right == null || right.length == 0) {
			return <View />
		}
		let items1 = right[dataIndex] == undefined ? undefined : right[dataIndex];
		let items2 = right[dataIndex + 1] == undefined ? undefined : right[dataIndex + 1];
		let items3 = right[dataIndex + 2] == undefined ? undefined : right[dataIndex + 2];
		let items4 = right[dataIndex + 3] == undefined ? undefined : right[dataIndex + 3];
		return (
			<View style={styles.rightView}>
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<TouchableOpacity onPress={() => { this._onImageRightArrPress(items1) }}>
						<Image style={[styles.imageRight, { height: items1 == undefined ? 0 : imageArrViewHeight }]} source={items1 == undefined ? {} : imageUtil.get(items1.iconFileUrl)} resizeMode='stretch' />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => { this._onImageRightArrPress(items2) }}>
						<Image style={[styles.imageRight, { height: items2 == undefined ? 0 : imageArrViewHeight }]} source={items2 == undefined ? {} : imageUtil.get(items2.iconFileUrl)} resizeMode='stretch' />
					</TouchableOpacity>
				</View>
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<TouchableOpacity onPress={() => { this._onImageRightArrPress(items3) }}>
						<Image style={[styles.imageRight, { height: items3 == undefined ? 0 : imageArrViewHeight }]} source={items3 == undefined ? {} : imageUtil.get(items3.iconFileUrl)} resizeMode='stretch' />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => { this._onImageRightArrPress(items4) }}>
						<Image style={[styles.imageRight, { height: items4 == undefined ? 0 : imageArrViewHeight }]} source={items4 == undefined ? {} : imageUtil.get(items4.iconFileUrl)} resizeMode='stretch' />
					</TouchableOpacity>
				</View>
			</View>
		);
	}
	_renderImageArr() {//	source={require('../res/home/001xiaoxi-_baise.png')}
		let left = this.searchModuleObjects('app_module_index_adv_left');
		let right = this.searchModuleObjects('app_module_index_adv_right');
		let dataAr = [];
		if (left != null) {
			return left.map((item, index) => {
				return (
					<View style={styles.imageArrView} key={index}>
						<TouchableOpacity onPress={() => { this._onImageLeftArrPress(item) }}>
							<Image
								style={styles.imageLeft}
								resizeMode='stretch'
								source={imageUtil.get(item.iconFileUrl)}
							/>
						</TouchableOpacity>
						{this._renderRight(right, index)}
					</View>
				);
			})
		} else {
			return null;
		}
	}
	_renderTitle() {
		return (
			<View style={styles.titleShow}>
				<View style={{ backgroundColor: '#E5E5E5', width: 2, height: 2, borderRadius: 1, marginRight: 6, }} />
				<View style={{ backgroundColor: '#666', width: 3, height: 3, borderRadius: 1.5, marginRight: 6, }} />
				<View style={{ backgroundColor: '#999', width: 4, height: 4, borderRadius: 2, marginRight: 6, }} />
				<Text style={{ fontSize: 16, color: '#333' }}>为你精选</Text>
				<View style={{ backgroundColor: '#999', width: 4, height: 4, borderRadius: 2, marginLeft: 6, }} />
				<View style={{ backgroundColor: '#666', width: 3, height: 3, borderRadius: 1.5, marginLeft: 6, }} />
				<View style={{ backgroundColor: '#E5E5E5', width: 2, height: 2, borderRadius: 1, marginLeft: 6, }} />
			</View>);
	}
	_onTabPress(item, index) {
		if (this.state.selectTabIndex === index) {
			return;
		}
		this.setState({
			selectTabIndex: index
		});
		this.appModuleId = item.appModuleId;
		this.moduleTabId = item.appModuleTabId;
		this.sysOrgId = item.sysOrgId;
		InteractionManager.runAfterInteractions(() => {
			this.refs.list.pullRefresh();
		})
	}
	searchtabList(innerCode) {
		let obj = null;
		_.each(this.props.homeData, (item, index) => {
			if (item.innerCode == innerCode && item.tabList.length != 0) {
				obj = item.tabList;
			}
		});
		return obj;
	}
	_renderTabItem() {
		let data = this.searchtabList('app_module_index_product');
		if (data != null) {
			return data.map((item, index) => {
				if (this.state.selectTabIndex == index) {
					this.tabPressBg = { backgroundColor: '#34457d' }
					this.tabPressTextBg = { color: '#fff' }
				} else {
					this.tabPressBg = { backgroundColor: '#fff' }
					this.tabPressTextBg = { color: '#333' }
				}
				return (
					<TouchableOpacity
						style={[styles.tabViewItems, this.tabPressBg]} key={index}
						onPress={() => { this._onTabPress(item, index) }}>
						<Text style={[{ fontSize: 12 }, this.tabPressTextBg]}>{item.tabNm}</Text>
					</TouchableOpacity>
				);
			})
		} else {
			return <View />
		}
	}
	_renderTab() {
		return (
			<ScrollView
				style={styles.tabView}
				horizontal={true}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				directionalLockEnabled={true}
				bounces={false}
			>
				<View style={{
					flex: 1,					
					flexDirection: 'row',
					alignItems: 'center',
					borderBottomWidth: 1,
					borderColor: '#eee'
				}}>
					{this._renderTabItem()}
				</View>
			</ScrollView>);
	}
	_formatePrice(num) {
		return Number.parseFloat(num).toFixed(2).toString().split('.');
	}
	_renderRow(rowData, sectionID, rowID, highlightRow) {
		let price = rowData.product.price == null ? rowData.product.marketPrice : rowData.product.price;
		let leftPrice = this._formatePrice(price);
		let icon = imageUtil.get(rowData.product.picUrl);
		//console.log('>>>>>>>>>>',rowData);
		return (
			<TouchableOpacity style={styles.listViewItem} onPress={() => { this._onProducPress(rowData) }}>
				<View style={{ flex: 1, flexDirection: 'column',padding:15,justifyContent:'space-between'}}>
					<Image style={styles.recomImg} resizeMode='stretch' source={icon} />					
					<View>
						{
							rowData.product.price == null ?
							<View style={{ width: 79, height: 21, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderWidth: 1 / PixelRatio.get(), borderColor: '#8495a2',marginBottom:10 }}>
									<Image style={{ width: 13, resizeMode: 'contain' }} source={require('../res/home/003denglukejian.png')} />
									<View style={{ width: 1, height: 13, backgroundColor: '#8495a2' }} />
									<Text style={{ fontSize: 11, color: '#8495a2' }}>登录可见</Text>
								</View>
								: <Text style={{ color: '#000', fontSize: 16, marginBottom:5 }}>￥{leftPrice[0]}.{leftPrice[1]}</Text>
							}
						<Text style={{ color: '#333', fontSize: 13,  }} numberOfLines={1}>{rowData.text}</Text>
						<Text style={{ color: '#333', fontSize: 13,  }} numberOfLines={1}>{rowData.product.specPack}</Text>
					</View>					
				</View>
			</TouchableOpacity>
		)
	}
	_onContentSizeChange() {

	}
	_winScroll(event) {
		
		if (event.nativeEvent.contentOffset.y > 400 && this.state.isShowToTop != true) {
			this.setState({ isShowToTop: true });
		}
		if (event.nativeEvent.contentOffset.y <= 400 && this.state.isShowToTop != false) {
			this.setState({ isShowToTop: false });
		}

		this.state.scrollY.setValue(event.nativeEvent.contentOffset.y);
		if (event.nativeEvent.contentOffset.y >= 120 && this.state.barState != true) {
			this.setState({
				barState: true,
			});
		}
		if (event.nativeEvent.contentOffset.y < 120 && this.state.barState != false) {
			this.setState({
				barState: false,
			});
		}
		if(event.nativeEvent.contentOffset.y > 60 && this.state.toggleNavBarImg === false) {
			this.setState({ toggleNavBarImg: true });
		} else if(event.nativeEvent.contentOffset.y < 60 && this.state.toggleNavBarImg === true) {
			this.setState({ toggleNavBarImg: false });
		}
	}

	render() {
		return (
			<View style={styles.container}>
				{this._renderHeader()}
				<ScrollView style={{ flex: 1, backgroundColor: '#f4f3f3' }}
					showsVerticalScrollIndicator={false}
					ref={(c) => { this.scrollvew = c }}
					scrollEventThrottle={10}
					onScroll={this._winScroll.bind(this)}
					onContentSizeChange={this._onContentSizeChange.bind(this)}
					refreshControl={<RefreshControl
						refreshing={this.state.isRefreshing}
						onRefresh={this.refreshingCall}
						title={'刷新中'}
					/>}
				>
					<BannerA
						ref={(e) => { this.banner = e }}
						onPress={this.pressBanner.bind(this)}
						autoplay={true}
						height={fullwidth * 0.53}
						width={fullwidth}
						images={this._getBannerImg()}
						dot={<View style={{ backgroundColor: 'rgba(255,255,255,.3)', width: 4, height: 4, borderRadius: 2, marginLeft: 5 }} />}
						activeDot={<View style={{ backgroundColor: '#fff', width: 4, height: 4, borderRadius: 2, marginLeft: 5 }} />}
						paginationStyle={{
							bottom: 10, right: 13
						}}
					/>
					{this._renderEntry()}
					{this._renderNotice()}
					{this._renderImageArr()}
					<View style={{ backgroundColor: '#f8f8f8' }}>
						{this._renderTitle()}
						{this._renderTab()}
						<RefreshableListView
							ref="list"
							//取消下拉和自动刷新
							refreshable={false}
							autoRefresh={true}
							autoLoadMore={true}
							showsVerticalScrollIndicator={false}
							contentInset={{ bottom: 0 }}
							pageSize={10}
							onEndReachedThreshold={200}
							initialListSize={1}
							fetchData={this._fetchData.bind(this)}
							contentContainerStyle={styles.recomView}
							renderRow={this._renderRow.bind(this)} />
					</View>
				</ScrollView>
				{
					//置顶按钮
					this.state.isShowToTop == true ?
						<View style={styles.toTop}>
							<TouchableOpacity onPress={() => {
								if (this.scrollvew) {
									this.scrollvew.scrollTo({ x: 0, y: 0, animated: true })
								}
							}}>
								<Image style={{ width: 40, height: 40 }} resizeMode='stretch' source={require('../res/home/001zhiding.png')} />
							</TouchableOpacity>
						</View>
						: <View></View>
				}
			</View>
		)
	}
}
function mapStateToProps(state) {
	return {
		homeData: state.Home,
		isLogin: state.Member.isLogin
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({ ...homeActions, ...userActions }, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);

