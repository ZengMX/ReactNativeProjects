import React, { Component } from 'react';
import {
	View,
	Image,
	InteractionManager,
	Text,
	TouchableOpacity,
	TouchableHighlight,
	Dimensions,
	PixelRatio,
	StyleSheet,
	Animated,
	Platform,
	Easing,
	Alert,
	ActivityIndicator,
	Linking
} from 'react-native';

import {
	NavBar,
	RefreshableListView,
	DataController,
	CustomMaskBoard,
	Loading,
	Toast,
} from 'future/public/widgets';

import {
	imageUtil,
	Fetch,
} from 'future/public/lib';

import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import SupplierDetail from './SupplierDetail';
import SupplierHomeSearch from './SupplierHomeSearch';
import MoreOperation from '../../commons/moreOperation/components/MoreOperation';
import ProductDetail from '../../product/components/ProductDetail';
// this.refs.img.setNativeProps({
// 	style: { top: (e.nativeEvent.contentOffset.y) / 2 }
// })

const SCREENWIDTH = Dimensions.get('window').width;

class TarBar extends Component {
	constructor(props) {
		super(props);

	}

	static defaultProps = {
		activeTextColor: '#34457d',
		inactiveTextColor: '#333',
	}

	renderTab = (name, page, isTabActive, onPressHandler) => {
		let title = name.split(',')[0];
		let numTitle = name.split(',')[1];
		const { activeTextColor, inactiveTextColor, textStyle, } = this.props;
		const textColor = isTabActive ? activeTextColor : inactiveTextColor;

		return (
			<TouchableOpacity
				style={{ flex: 1, }}
				key={title}
				accessible={true}
				accessibilityLabel={title}
				accessibilityTraits='button'
				onPress={() => onPressHandler(page)}
			>
				<View style={[styles.tab, this.props.tabStyle,]}>
					<Text style={{ fontSize: 11, color: textColor, paddingBottom: 5, fontWeight:'bold',}}>{numTitle}</Text>
					<Text style={[{ color: textColor, fontSize: 11, fontWeight:'bold',}, textStyle,]}>
						{title}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}

	render() {
		const containerWidth = this.props.containerWidth;
		const numberOfTabs = this.props.tabs.length;
		const tabUnderlineStyle = {
			position: 'absolute',
			width: (containerWidth / numberOfTabs) - 10,
			height: 2,
			backgroundColor: '#34457d',
			bottom: 0,
			marginLeft: 5,
		};
		const left = this.props.scrollValue.interpolate({
			inputRange: [0, 1,],
			outputRange: [0, containerWidth / numberOfTabs,],
		});
		return (
			<View style={[styles.tabs, this.props.style,]}>
				{this.props.tabs.map((name, page) => {
					const isTabActive = this.props.activeTab === page;
					const renderTab = this.props.renderTab || this.renderTab;
					return renderTab(name, page, isTabActive, this.props.goToPage);
				})}
				<Animated.View style={[tabUnderlineStyle, { left, }, this.props.underlineStyle,]} />
			</View>
		);
	}
}

class List extends Component{
	constructor(props){
		super(props);
		
		this.state = {
			showLoading: true,
			childTab: 'default',
			desc: false,   //是否是降序，默认否
		}
		this.fetchData = this._fetchData.bind(this);
		this.renderRow = this._renderRow.bind(this);
		this.handleEndDrag = this._handleEndDrag.bind(this);
		this.changeChildTab = this._changeChildTab.bind(this);
	}

	componentDidMount(){
		InteractionManager.runAfterInteractions(() => {
			this.refs.list && this.refs.list.pullRefresh();
		})
	}

	_fetchData(page,success,error){
		if(page === 1){
			this.setState({showLoading: true,});
		}
		let childTab = this.state.childTab;
		let paramsData = {
			page: page,
			pageSize: 10,
			shopId: this.props.shopData.shopInfId,
		};
		let tabThemes = this.props.tabThemes;
		let url = '';
		switch (tabThemes) {
			case 'allProduct':
				paramsData.order = '';
				if (this.props.searchParams) {
					this.props.searchParams.children.forEach((e, i) => {
						if (e.hasSelected) {
							paramsData.shopCategoryId = e.categoryId;
						}
					})
				}
				url = 'shop/shopProductList.json';
				break;
			case 'hotProduct':
				url = 'shop/shopHotSaleProduct.json';
				break;
			case 'newProduct':
				url = 'shop/shopNewProduct.json';
				break;
			default:
				break;
		}
		// 如果是全部商品，根据全部商品的下一级传递参数
		switch (childTab) {
			case 'price':
				paramsData.order = this.state.desc ? 'marketPrice,desc' : 'marketPrice,asc';
				break;
			case 'sales':
				paramsData.order = 'salesVolume,desc';
				break;
			case 'news':
				paramsData.order = 'lastOnSaleDate,desc';
				break;
		}
		new Fetch({
			url: 'app/' + url,
			data: paramsData,
		}).dofetch().then((data) => {
			let currentData = data.result;
			let totalCount = currentData.totalCount;
			if(this.state.showLoading){
				this.setState({showLoading: false,});
			}
			success(currentData.result, (page - 1) * 10 + currentData.result.length, totalCount);
		}).catch((err) => {
			console.log('err', err);
		});
	}

	_renderRow(rowData,sectionId,rowId,highlight){
		let spec = rowData.specPack?rowData.specPack: '--',
			unit = rowData.unit?rowData.unit: '--',
			marketPrice = Math.floor(rowData.marketPrice.toString()).toFixed(2);
		return (
			<TouchableHighlight
				onPress={()=>{
					this.props.openWindow(ProductDetail,{
						productId: rowData.productId,
					})
				}}
				style={styles.item}
				underlayColor='#eee'
			>
				<View style={{flex:1,justifyContent:'space-between'}}>
					<Text style={{fontSize:15,color:'#333',fontWeight:'500',}} numberOfLines={1}>{rowData.productNm}</Text>
					<View style={{flexDirection: 'row', alignItems:'center',marginBottom: 2,}}>
						<Text style={{fontSize:12,color:'#8495A2',flex:1,}} numberOfLines={1}>规格：{spec}</Text>
						{
							rowData.price === null ? (
								<View style={{width:84,height:20,flexDirection:'row',justifyContent:'space-around',alignItems:'center',borderWidth:1/PixelRatio.get(),borderColor:'#8495a2'}}>
									<Image style={{width:14,resizeMode:'contain'}} source={require('../res/images/003denglukejian.png')}/>
									<View style={{width:1,height:13,backgroundColor:'#8495a2'}}/>
									<Text style={{fontSize:12,color:'#8495a2'}}>登录可见</Text>
								</View>
							) : (
								<Text style={{fontSize:13,color:'#FF6600',}}>￥
									<Text style={{fontSize:18,}}>{parseInt(rowData.price)}.</Text>
									<Text style={{fontSize:13,}}>{parseFloat(rowData.price).toFixed(2).toString().split('.')[1]}</Text>
								</Text>
							)
						}
					</View>
					<View style={{flexDirection: 'row', alignItems:'center',}}>
						<Text style={{fontSize:12,color:'#8495A2',flex:1,}} numberOfLines={1}>厂家：{rowData.factory}</Text>
						<Text style={{fontSize:11,color:'#AAAEB9',marginLeft:23,}}>市场价:￥{marketPrice}</Text>
					</View>
				</View>
			</TouchableHighlight>
		)
	}

	// 点击改变全部商品下的子一级搜索条件 (扩充doit参数，点击商品分类的时候，强行设回默认，并刷新商品列表)
	_changeChildTab(tab, doit=false) {
		if(tab === this.state.childTab && !doit && tab !== 'price'){
			return ;
		}else if(tab === 'price' && this.state.childTab === 'price'){
			this.setState({desc:!this.state.desc})
		}else{
			this.setState({childTab:tab});
		}
		
		InteractionManager.runAfterInteractions(()=>{
			this.refs.list.pullRefresh();
		});
	}

	_handleEndDrag(event){
		let y = event.nativeEvent.contentOffset.y;
		if (y > 30) {
			this.props.changeShowShop && this.props.changeShowShop(118);
		} else {
			this.props.changeShowShop && this.props.changeShowShop(0);
		}
	}

	render(){
		return(
			<View style={{flex:1,}}>
				{
					this.props.tabThemes === 'allProduct' && (
						<View style={{height:45,backgroundColor:'#fff',borderBottomWidth:1/PixelRatio.get(),borderColor:'#e5e5e5',flexDirection:'row',}}>
							<TouchableOpacity
								style={styles.headerTouch}
								onPress={()=>{ this.changeChildTab('default') }}
								underlayColor='#eee'
							>
								<Text style={[styles.headerTitle,{color:this.state.childTab==='default'?'#34457D':'#90A4AE',}]}>默认</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.headerTouch}
								onPress={()=>{ this.changeChildTab('price') }}
								underlayColor='#eee'
							>
								<View>
									<Text style={[styles.headerTitle,{color:this.state.childTab==='price'?'#34457D':'#90A4AE',}]}>价格</Text>
									<View style={[styles.triangle,styles.tri_up,{borderBottomColor:this.state.childTab === 'price' && this.state.desc == false?'#34457D':'#90A4AE'}]}/>
									<View style={[styles.triangle,styles.tri_down,{borderTopColor:this.state.childTab === 'price' && this.state.desc == true?'#34457D':'#90A4AE'}]}/>
								</View>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.headerTouch}
								onPress={()=>{ this.changeChildTab('sales') }}
								underlayColor='#eee'
							>
								<Text style={[styles.headerTitle,{color:this.state.childTab==='sales'?'#34457D':'#90A4AE',}]}>销量</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.headerTouch}
								onPress={()=>{ this.changeChildTab('news') }}
								underlayColor='#eee'
							>
								<Text style={[styles.headerTitle,{color:this.state.childTab==='news'?'#34457D':'#90A4AE',}]}>新品</Text>
							</TouchableOpacity>
						</View>
					)
				}
				{
					this.state.showLoading &&
					<ActivityIndicator
						animating={true}
						color='#333'
						size='small'
						style={{marginVertical:10,}}
					/>
				}
				<RefreshableListView
					ref="list"
					style={{width:SCREENWIDTH,}}
					fetchData={this.fetchData}
					scrollRenderAheadDistance={100} //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行。
					pageSize={10} // 每次事件循环（每帧）渲染的行数。
					initialListSize={1}
					onEndReachedThreshold={200}
					renderRow={this.renderRow}
					showsVerticalScrollIndicator={false}
					refreshable={false}
					onScrollEndDrag={this.handleEndDrag}
				/>
			</View>
		)
	}
}

export default class SupplierHome extends Component{
	constructor(props){
		super(props);
		
		this.state = {
			shopInf: null,
			prodCategory: null,
			showShop: new Animated.Value(0),
			shopCollectNum: 0, //店铺收藏人数
			hasCollectShop: false, //是否有收藏店铺
		}
		this.collected = require('../res/images/001yishoucang.png');
		this.unCollected = require('../res/images/001shoucang.png');
		this.seleceImg = require('future/public/commons/res/danxuan.png');
	}

	componentWillMount(){
		InteractionManager.runAfterInteractions(()=>{
			let shopId = this.props.params ? this.props.params.shopInfId: 1;
			// 请求店铺首页数据
			this.getSupplierHomeInfo(shopId);

			// 请求店铺分类数据
			new Fetch({
				url: '/app/shop/shopCategory.json?shopId=1&',
				method: 'GET',
			}).dofetch().then((data)=>{
				let categoryData = data.result;
				categoryData.children.forEach((e, i) => {
					e.hasSelected = false;
				})
				categoryData.children.unshift({
					name: '全部',
					categoryId: categoryData.categoryId,
					hasSelected: true,
				});
				this.setState({prodCategory:categoryData,});
			}).catch((err)=>{
				console.log(err);
			})
		})
	}

	openWindow = (component, params={}) => {
		let navigator = this.props.navigator;
		if(navigator){
			navigator.push({
				component: component,
				params: params,
			})
		}
	}

	// 请求店铺首页数据
	getSupplierHomeInfo = () => {
		let shopId = this.props.params ? this.props.params.shopInfId: 1;
		new Fetch({
			url: '/app/shop/getShopInf.json?shopId=' + shopId + '&',
			method: 'GET',
		}).dofetch().then((data)=>{
			console.log('getShopInf-------->>>>>',data);
			this.setState({
				shopInf: data.result,
				shopCollectNum: data.result.shopCollectNum,
				hasCollectShop: data.result.isCollect,
			});
		}).catch((err)=>{
			console.log(err);
		});
	}

	//隐藏店铺背景动画
	changeShowShop = (height) => {
		Animated.timing(this.state.showShop,{
			toValue: height,
			duration: 200,
			easing: Easing.linear,
		}).start();
	}

	// 联系卖家
	callShopManager(){
		if(this.state.shopInf.tel){
			Alert.alert('温馨提示','拔打'+this.state.shopInf.tel,
			    [
			      {text: '取消', onPress: () => {}},
			      {text: '确认', onPress: () => Linking.openURL('tel:'+this.state.shopInf.tel)},
			    ]
			)
		}else{
			Alert.alert('温馨提示', '该商家暂时没有提供联系电话',)
		}
	}

	// 选择店铺分类
	selectShopCategory(index) {
		prodCategory = Object.assign({}, this.state.prodCategory);
		// console.log('prodCategory', prodCategory);
		prodCategory.children.forEach((e, i) => {
			e.hasSelected = i === index ? true : false;
		})
		this.setState({ prodCategory: prodCategory });
		InteractionManager.runAfterInteractions(() => {
			this.refs.tabView.goToPage(0);
			this.refs.allProduct.changeChildTab('default', true);
		})
	}

	// 收藏店铺
	_collectShop = () => {
		let hasCollectShop = this.state.hasCollectShop,
			type = hasCollectShop?'N':'Y',  // params: action Y:收藏 N:取消收藏
			shopId = this.state.shopInf.shopInfId;

		//Loading的方式
		Loading.show();
		new Fetch({
			url: 'app/user/collectionShop.json?type=' + type + '&shopId=' + shopId,
			method: 'GET',
		}).dofetch().then((data)=>{
			Loading.hide();
			let msg = !hasCollectShop?'收藏成功':'已取消收藏';
			if(data && data.success){
				RCTDeviceEventEmitter.emit('changeShopCollect',shopId);
				this.setState({
					hasCollectShop: !hasCollectShop,
					shopCollectNum: !hasCollectShop?this.state.shopCollectNum+1:this.state.shopCollectNum-1,
				});
				return Toast.show(msg);
			}else if(data.errorCode === "errors.login.noexist"){
				return Toast.show('请先登录');
			}else{
				return Toast.show('收藏失败');
			}
		}).catch((err)=>{
			Loading.hide();
			console.log('修改收藏失败 ----->',err);
		});
	}

	refreshComponent = (status) => {
		if(!status) return ;
		let shopId = this.props.params ? this.props.params.shopInfId: 1;
		let navArr = this.props.navigator.getCurrentRoutes();
		this.props.navigator.replaceAtIndex({
			component: SupplierHome,
			params: {
				shopInfId: shopId,
			},
		},navArr.length-2)
	}

	render(){
		let shopInf = this.state.shopInf?this.state.shopInf:{},
			shopCollectNum = this.state.shopCollectNum;
		let prodCategory = this.state.prodCategory;
		// 店铺收藏人数
		let collectNumber = 0,decimals = 0,unitStr = '人';
		if((shopCollectNum) / 10000 >= 1){
			collectNumber = ((shopCollectNum) / 10000).toFixed(2);
			unitStr = '万'+unitStr;
			decimals = 2;
		}else{
			collectNumber = shopCollectNum;
		}
		let tabLabel = ['全部商品,','热卖商品,','上新,'];
		let shopData = Object.assign({},shopInf);
		if (shopData) {
			if (typeof shopData.allProductNum === 'number') {
				tabLabel[0] += shopData.allProductNum;
			} else {
				tabLabel[0] += 0;
			}
			if (typeof shopData.hotSaleProductNum === 'number') {
				tabLabel[1] += shopData.hotSaleProductNum;
			} else {
				tabLabel[1] += 0;
			}
			if (typeof shopData.newProductNum === 'number') {
				tabLabel[2] += shopData.newProductNum;
			} else {
				tabLabel[2] += 0;
			}
		}

		//构造商品分类 children{categoryId,name,shopId}
		let prodCategoryHtml = prodCategory !== null ? prodCategory.children.map((e,i)=>{
			return (
				<TouchableOpacity
					style={[{ height: 36, justifyContent: 'center',flexDirection:'row',alignItems:'center',},
						i !== prodCategory.children.length - 1 ? { borderBottomWidth: 1 / PixelRatio.get(), borderColor: '#eee' } : {borderBottomLeftRadius:5,borderBottomRightRadius:5,},
						i === 0?{borderTopLeftRadius:5,borderTopRightRadius:5,}:null,
					]}
					onPress={() => {
						this.refs.category.hide();
						this.selectShopCategory(i);
					}}
					key={i}
					disabled={e.hasSelected}
				>
					<Text style={{paddingHorizontal:10,fontSize:12,color:'#333',flex:1,}} numberOfLines={1}>{e.name}</Text>
					{
						e.hasSelected && (
							<Image
								source={this.seleceImg}
								style={{width:15.5,height:10,marginRight:12}}
							/>
						)
					}
				</TouchableOpacity>
			)
		}) : null;

		return (
			<View style={styles.page}>
				<NavBar
					navigator={this.props.navigator}
					style={{zIndex:100,alignItems:'center',}}
					mainColor={'#fff'}
					deep={true}
					containerStyle={{justifyContent:'center',}}
					rightButton={(
						<MoreOperation
							navigator={this.props.navigator}
							order={
								[{
									module:'index',
								},{
									module:'search',
									params: {
										component: SupplierHomeSearch,
										params: {
											shopInfo: shopInf,
										}
									},
								},{
									module:'message',
									params:{
										callback: this.refreshComponent,
									},
								},{
									module:'mine',
									params: {
										callback: this.refreshComponent,
									},
								}]
							}
						/>
					)}
				>
					<TouchableOpacity
						style={styles.navBtn}
						onPress={()=>{ this.openWindow(SupplierHomeSearch,{shopInfo: this.state.shopInf,});}}
					>
						<Image
							source={require('../res/images/a002sousuo.png')}
							style={styles.searchImg}
						/>
						<Text style={{fontSize:13,color:'#73777c',fontWeight:'bold'}}>搜索店铺商品</Text>
					</TouchableOpacity>
				</NavBar>
				<DataController data={this.state.shopInf}>
					<View style={{flex:1,zIndex:10,overflow:'hidden',}}>
						<Animated.Image
							/* source={imageUtil.get(shopInf.backgroundUrl)} */
							source = {require('../res/images/002shangjiabeijing.png')}
							style={[styles.bgImg,{
								marginTop:this.state.showShop.interpolate({
									inputRange:[0,118],
									outputRange: [0,-118],
									extrapolate: 'clamp',
								})
							}]}
						>
							<View style={styles.bgImgBox}>
								<View style={styles.bgContent}>
									<Image
										source={imageUtil.get(shopInf.shopLogo)}
										style={styles.logoImg}
									/>
									<Text style={{fontSize:14,color:'#fff',flex:1,paddingTop:15,}}>{this.state.shopInf == null ? '' : this.state.shopInf.shopNm}</Text>
									<View style={styles.collectArea}>
										<TouchableOpacity
											style={{alignItems:'center',}}
											onPress={this._collectShop}
										>
											<Image
												source={this.state.hasCollectShop?this.collected:this.unCollected}
												style={styles.collectImg}
											/>
											<Text style={{fontSize:11,color:'#fff',}}>{collectNumber+''+unitStr}</Text>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						</Animated.Image>
						<ScrollableTabView
							ref="tabView"
							renderTabBar={() =><TarBar />}
							style={{overflow:'hidden',}}
							onChangeTab={()=>{
								Animated.timing(this.state.showShop,{
									toValue: 0,
									duration: 200,
								}).start();
							}}
						>
							<List
								ref="allProduct"
								tabLabel={tabLabel[0]}
								openWindow={(component, params) => this.openWindow(component, params)}
								tabThemes={'allProduct'}
								shopData={shopData}
								changeShowShop={(y) => { this.changeShowShop(y) } }
								searchParams={prodCategory}
							/>
							<List
								ref="hotProduct"
								tabLabel={tabLabel[1]}
								openWindow={(component, params) => this.openWindow(component, params)}
								tabThemes={'hotProduct'}
								shopData={shopData}
								changeShowShop={(y) => { this.changeShowShop(y) } }
							/>
							<List
								ref="newProduct"	
								tabLabel={tabLabel[2]}
								openWindow={(component, params) => this.openWindow(component, params)}
								tabThemes={'newProduct'}
								shopData={shopData}
								changeShowShop={(y) => { this.changeShowShop(y) } }
							/>
						</ScrollableTabView>
						<View style={{flexDirection:'row',alignItems:'center',height:44,backgroundColor:'#fff',borderTopWidth:1/PixelRatio.get(),borderTopColor:'#dfdfdf',}}>
							<TouchableOpacity
								style={{flex:1,height:44,alignItems:'center',justifyContent:'center',}}
								onPress={() => {
									this.openWindow(SupplierDetail, {
										shopInfo: this.state.shopInf,
										hasCollectShop: this.state.hasCollectShop,
										shopCollectNum: this.state.shopCollectNum,
										callback: (state) => {
											this.setState(state);
										}
									})
								} }
							>
								<Text style={{fontSize:12,color:'#5A6576',}}>店铺详情</Text>
							</TouchableOpacity>
							<View style={{height:15,width:1/PixelRatio.get(),backgroundColor:'#ccc'}} />
							<TouchableOpacity
								style={{flex:1,height:44,alignItems:'center',justifyContent:'center',flexDirection:'row',}}
								disabled={prodCategory!== null && prodCategory.children.length <= 0}
								onPress={()=>{
									this.refs.category.show();
								}}
							>
								<View style={{width:8,height:6,borderColor:'#C5CEDB',borderTopWidth:1,borderBottomWidth:1,marginRight:8,}} />
								<Text style={{fontSize:12,color:'#5A6576',}}>商品分类</Text>
							</TouchableOpacity>
							<View style={{height:15,width:1/PixelRatio.get(),backgroundColor:'#ccc'}} />
							<TouchableOpacity
								style={{flex:1,height:44,alignItems:'center',justifyContent:'center',}}
								onPress={()=>this.callShopManager()}
							>
								<Text style={{fontSize:12,color:'#5A6576',}}>联系卖家</Text>
							</TouchableOpacity>
						</View>
					</View>
				</DataController>
				{
					prodCategory !== null && prodCategory.children.length > 0 &&
					<CustomMaskBoard
						ref='category'
						modalStyle={{ backgroundColor:'transparent', zIndex:888,}}
						onHide={()=>{ }}
						isOverlayClickClose={true}
						isOverlay={true}
					>
						<View style={[styles.productCategory, styles.shadowSet,]}>
							<View style={{ overflow: 'hidden', }}>	
								{prodCategoryHtml}
							</View>	
						</View>
					</CustomMaskBoard>
				}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	page: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	navBtn: {
		flexDirection: 'row',
		width: SCREENWIDTH - 90,
		backgroundColor: '#ececec',
		alignItems: 'center',
		height: 30,
	},
	searchImg: {
		width: 16.5,
		height: 17,
		marginHorizontal: 10,
	},
	bgImg: {
		width: SCREENWIDTH,
		// height: SCREENWIDTH * (100/320),
		height: 100,
		resizeMode:'stretch'
	},
	bgImgBox: {
		backgroundColor:'rgba(0,0,0,0.4)',
		flex:1,
		paddingBottom: 5,
		justifyContent: 'flex-end',
	},
	bgContent: {
		flexDirection: 'row',
		backgroundColor:'transparent',
	},
	logoImg: {
		width: 50,
		height: 50,
		marginLeft: 5,
		marginRight: 10,
	},
	collectArea: {
		width: 60,
		marginRight: 15,
		alignItems: 'center',
		justifyContent: 'flex-end',
		marginBottom: 5,
	},
	collectImg: {
		width: 60,
		height: 24,
		marginBottom: 4,
	},
	tab: {
	    flex: 1,
	    alignItems: 'center',
	    justifyContent: 'flex-start',
	    backgroundColor: '#fff',
	    paddingTop: 5,
	},
	tabs: {
		height: 50,
		flexDirection: 'row',
		justifyContent: 'space-around',
		borderWidth: 0,
		marginBottom: 5,
	},
	item: {
		height: 96.5,
		overflow: 'hidden',
		paddingLeft: 13,
		paddingRight: 15,
		backgroundColor: '#fff',
		borderBottomWidth: 1/PixelRatio.get(),
		borderColor: '#e5e5e5',
		paddingVertical: 15,
	},
	headerTitle: {
		fontSize: 14,
		color: '#90A4AE',
	},
	headerTouch: {
		alignItems: 'center',
		justifyContent: 'center',
		flex:1,
	},
	triangle: {
		position: 'absolute',
		right: -11,
		width: 0,
		height: 0,
		borderLeftWidth: 4,
		borderRightWidth: 4,
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent',
	},
	tri_up: {
		top: Platform.OS === 'ios'?2:4,
		borderBottomWidth: 4,
	},
	tri_down: {
		bottom: Platform.OS === 'ios'?1:3,
		borderTopWidth: 4,
	},
	productCategory: {
		position:'absolute',
		zIndex:900,
		bottom: 44,
		left: SCREENWIDTH/3,
		width:SCREENWIDTH/3,
		backgroundColor:'#fff',
		borderColor: '#e5e5e5',
	},
	shadowSet: {
		borderWidth:1/PixelRatio.get(),
		borderRadius:5,
		shadowColor:'#d2d3d5',
		shadowOpacity:1,
		shadowRadius:4,
		shadowOffset: { width: 0, height: 0, },
	},
})