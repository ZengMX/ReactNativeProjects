import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	StyleSheet,
	InteractionManager,
	TouchableHighlight,
	TouchableOpacity,
	ListView,
	Animated,
	Easing
} from 'react-native';

import {
	RefreshableListView,
	BaseView,
	Toast,
	FlexModal
} from 'future/public/widgets';

import {
	Fetch,
	imageUtil,
	ValidateUtil,
} from 'future/public/lib';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//单位和剂型页面
import SelectUnitPage from './SelectUnitPage';
//生产厂家页面
import ManufacturerList from './ManufacturerList';
//销售地区页面
import SaleAreaLIst from './SaleAreaLIst';

import Login from '../../member/components/Login';
import Search from '../../home/components/Search';
import ProductDetail from '../components/ProductDetail';
import MoreOperation from '../../commons/moreOperation/components/MoreOperation';

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
			totalPage: 0,									//总页数
			currentPage: 1,									//当前页
			isShowPage: false,								//是否展示页码指示器
			opacityAnim: new Animated.Value(0),				//渐变动画
			animateState: 'hide'								//hide,hiding,show,showing
		};
		this._fetchData = this.fetchData.bind(this);
		this._renderRow = this.renderRow.bind(this);
		this.searchParam = {
			//productlist.json和findCategoryBrand.json接口需要的参数sysObjectId
			categoryId: '',
			//搜索关键词
			keyword: '',						//String
			//内部查询用的字符串
			q: '',								//String
			//排序
			order: '',							//String
			zoneId: ''
		};
		this.momentumScroll = false;						//是否是有动力作用的滚动
		this.isStartAnim = false;							//是否已经开始了动画
		this.lock = false;
	}

	openComponent(component, params) {
		if (this.props.navigator && this.props.navigator.push) {
			this.props.navigator.push({
				component: component,
				params: params != undefined ? params : {}
			})
		}
	}

	//组件外调用的方法，重新按条件搜索商品
	searchProduct(searchObject) {
		this.searchParam.categoryId = searchObject.categoryId;
		this.searchParam.keyword = searchObject.keyword;
		this.searchParam.q = searchObject.q;
		this.searchParam.order = searchObject.order;
		this.searchParam.zoneId = searchObject.zoneId;

		this.refreshProduct();
	}

	refreshProduct() {
		InteractionManager.runAfterInteractions(() => {
			this.refs.listView.pullRefresh();
		})
	}

	showPageAnim() {
		this.isStartAnim = true;
		this.setState({ isShowPage: true });
		Animated.timing(
			this.state.opacityAnim,
			{
				toValue: 1,
				duration: 100,
				easing: Easing.ease
			}
		).start(() => {
			this.isStartAnim = false;
		})
	}

	hidePageAnim() {
		this.isStartAnim = true;
		Animated.timing(
			this.state.opacityAnim,
			{
				toValue: 0,
				duration: 200,
				easing: Easing.ease
			}
		).start(() => {
			this.setState({ isShowPage: false });
			this.isStartAnim = false;
		})
	}

	startAnim() {
		if (this.isStartAnim == true) { return; }
		if (this.state.isShowPage == false) {
			this.showPageAnim();
		} else {
			this.hidePageAnim();
		}
	}


	//判断当前页	
	changePage(visibleRows, changedRows) {
		if (global.IS_IOS) {
			let data = changedRows['s1'];
			for (let i in data) {
				if (data[i] == true) {
					let page = Math.floor(i / 10 + 1);
					if (this.state.currentPage != page) {
						this.setState({ currentPage: page });
					}
				}
			}
		}
	}

	onScroll(e) {

		if (!global.IS_IOS) {
			if (this.lock) { return; }
			let winH = e.nativeEvent.layoutMeasurement.height, scrollH = e.nativeEvent.contentOffset.y;
			if ((this.state.currentPage - 1) * 1160 >= winH + scrollH) {
				this.lock = true;
				this.setState({ currentPage: this.state.currentPage - 1 }, () => {
					//保证只执行一次
					this.lock = false;
				});
			}
			if (this.state.currentPage * 1160 < winH + scrollH) {
				this.lock = true;
				this.setState({ currentPage: this.state.currentPage + 1 }, () => {
					this.lock = false;
				});
			}
		}
	}

	onMomentumScrollBegin() {
		if (this.state.isShowPage != true) {
			this.startAnim();
		}
		this.momentumScroll = true;
	}

	onMomentumScrollEnd() {
		if (this.state.isShowPage != false) {
			this.startAnim();
		}
		this.momentumScroll = false;
	}

	onScrollBeginDrag() {
		if (this.state.isShowPage != true) {
			this.startAnim();
		}
	}

	onScrollEndDrag() {
		if (this.state.isShowPage != false && this.momentumScroll == false) {
			this.startAnim();
		}
	}

	//格式化价格
	formatPrice(num) {
		return Number.parseFloat(num).toFixed(2).toString().split('.');
	}

	fetchData(page, success, error) {
		new Fetch({
			url: '/app/product/productList.json',
			mothod: 'POST',
			data: {
				page: page,
				limit: 10,
				categoryId: this.props.categoryId || '',
				keyword: this.props.keyword || '',
				order: this.searchParam.order || '',
				q: this.searchParam.q || '',
				zoneId: this.searchParam.zoneId || ''
			}
		}).dofetch().then((data) => {
			if (data.result) {
				this.setState({ totalPage: data.totalPage });
			}
			success(data.result, 10 * (page - 1) + data.result.length, data.totalCount);
		}).catch((error) => {
			console.log("error===>>", error);
		});
	}

	renderRow(rowData, sectionID, rowID) {
		let price = this.formatPrice(rowData.price == null ? 0 : rowData.price);
		return (
			<TouchableHighlight
				underlayColor={'#fafafa'}
				onPress={() => {
					this.openComponent(ProductDetail, { productId: rowData.productId })
				} }
				>
				<View style={{ height: 116, paddingHorizontal: 13, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#EEE' }}>
					<Text numberOfLines={1} style={{ fontSize: 15, color: '#333333', fontWeight: 'bold', marginTop: 15, marginBottom: 12 }}>{rowData.title}</Text>
					<View style={{ flexDirection: 'row' }}>
						<View style={{ flex: 2, justifyContent: 'space-around' }}>
							<Text numberOfLines={1} style={{ fontSize: 11, color: '#8495A2' }}>规格：{rowData.specPack}</Text>	
							<Text numberOfLines={1} style={{ fontSize: 11, color: '#8495A2', marginVertical: 10 }}>厂家：{rowData.factory}</Text>
							<Text numberOfLines={1} style={{ fontSize: 11, color: '#8495A2' }}>供应商：{rowData.shopNm}</Text>

						</View>
						{
							rowData.price == null ?
								<View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'space-around' }}>
									<Text style={{ color: '#5A6576', fontSize: 11 }}>市场价:￥{rowData.marketPrice && rowData.marketPrice.toFixed(2)}</Text>
									<View style={{
										flexDirection: 'row', height: 21, width: 80,
										borderColor: '#8495A2', borderWidth: StyleSheet.hairlineWidth,
										justifyContent: 'space-around', alignItems: 'center',
										borderRadius: 2
									}}>
										<Image style={{ width: 13, height: 13 }} source={require('../res/images/ProductList/003denglukejian.png')} />
										<View style={{ backgroundColor: '#8495A2', width: StyleSheet.hairlineWidth, height: 11 }}></View>
										<Text style={{ fontSize: 11, color: '#8495A2' }}>登录可见</Text>
									</View>
								</View>
								:
								<View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'space-around' }}>
									<Text style={{ color: '#FF6600', fontSize: 13 }}>￥<Text style={{ fontSize: 18 }}>{price[0]}</Text>.{price[1]}</Text>
									<Text style={{ color: '#AAAEB9', fontSize: 11 }}>市场价:￥{rowData.marketPrice && rowData.marketPrice.toFixed(2)}</Text>
								</View>

						}
					</View>
				</View>
			</TouchableHighlight>
		)
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<RefreshableListView
					ref="listView"
					autoRefresh={true}
					refreshable={true}
					scrollRenderAheadDistance={200}
					pageSize={10}
					initialListSize={1}
					onEndReachedThreshold={200}
					dataSource={this.state.dataSource}
					fetchData={this._fetchData}
					renderRow={this._renderRow}
					onMomentumScrollBegin={(e) => { this.onMomentumScrollBegin() } }
					onMomentumScrollEnd={(e) => { this.onMomentumScrollEnd() } }
					onScrollBeginDrag={(e) => { this.onScrollBeginDrag() } }
					onScrollEndDrag={(e) => { this.onScrollEndDrag() } }
					onChangeVisibleRows={(visibleRows, changedRows) => { this.changePage(visibleRows, changedRows) } }
					onScroll={(e) => { this.onScroll(e) } }
					/>
				{/*底部登录提示*/}
				{
					this.props.isLogin == false ?
						<TouchableOpacity
							activeOpacity={1}
							onPress={() => {
								console.log('okkkkkk', this.props);
								this.props.navigator.push({
									component: Login,
									params: {
										callback: () => {
											this.refreshProduct();
										}
									}
								})
							} }
							style={{
								width: 280, height: 45, position: 'absolute',
								bottom: 40, left: global.SCREENWIDTH / 2 - 140,
								backgroundColor: '#fff', zIndex: 9, borderRadius: 5,
								justifyContent: 'center', alignItems: 'center',
								borderWidth: StyleSheet.hairlineWidth, borderColor: '#ddd'
							}}>
							<Text style={{ color: '#666666' }}>采购价登录可见哦！<Text style={{ fontSize: 14, color: '#FF6400' }}>去登录></Text></Text>
						</TouchableOpacity>
						:
						<View></View>
				}
				{/*底部page指示器*/}
				{
					this.state.totalPage != 0 && this.state.isShowPage ?
						<Animated.View style={{
							height: 20, width: 61, position: 'absolute',
							bottom: 12, left: global.SCREENWIDTH / 2 - 30,
							backgroundColor: 'rgba(0,0,0,0.6)', flexDirection: 'row',
							borderRadius: 4, opacity: this.state.opacityAnim
						}}>
							<View style={{ width: 30, justifyContent: 'center', alignItems: 'center' }}>
								<Text style={{ fontSize: 11, color: '#fff' }}>{this.state.currentPage}</Text>
							</View>
							<View style={{ height: 16, width: 1, alignSelf: 'center', backgroundColor: '#fff' }}></View>
							<View style={{ width: 30, justifyContent: 'center', alignItems: 'center' }}>
								<Text style={{ fontSize: 11, color: '#fff' }}>{this.state.totalPage}</Text>
							</View>
						</Animated.View>
						:
						<View></View>
				}
			</View>
		)
	}
}

class ProductList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			province: null,
			city: null,
			isModalSortShow: false,

			categoryId: this.props.params && this.props.params.categoryId || '',						//categoryId:68188,测试的时候暂时写死,跳转的时候再修改！！！！
			keyword: this.props.params && this.props.params.keyword || '',
			zoneId: this.props.params && this.props.params.zoneId || '',								//地区id
			q: this.props.params && this.props.params.q || '',											//筛选条件字符串
			order: this.props.params && this.props.params.order || '',									//排序条件字符串

			sortType: 'default',					//default,lowToHigh,highToLow,saleFirst,newFirst
			filter: [],								//筛选条件数组
			manufacture_factory_t: null,			//生产厂家被选中的对象
			form_t: [],								//剂型字段
			product_unit_t: [],						//单位字段

		};
	}
	componentWillMount() {
		InteractionManager.runAfterInteractions(() => {
			this.getFilterCondition();
		})
	}
	componentDidMount() {
	}
	componentWillUnmount() {
	}

	refreshProdulist() {
		this.formatFilter();
		this.formatSort();
		let searchObject = {};
		setTimeout(() => {
			searchObject.categoryId = this.state.categoryId;
			searchObject.keyword = this.state.keyword;
			searchObject.zoneId = this.state.zoneId;
			searchObject.q = this.state.q;
			searchObject.order = this.state.order;
			this.refs.productList.searchProduct(searchObject);
		}, 0)
	}

	formatFilter() {
		let q = '', zoneId = '';
		if (this.state.manufacture_factory_t != null) {
			q = q + 'manufacture_factory_t:' + this.state.manufacture_factory_t.value + ';';
		}
		if (this.state.form_t.length != 0) {
			let temp = [];
			this.state.form_t.forEach((item, index) => {
				temp.push(item.value);
			});
			q = q + 'form_t:' + temp.join(',') + ';';
		}
		if (this.state.product_unit_t.length != 0) {
			let temp = [];
			this.state.product_unit_t.forEach((item, index) => {
				temp.push(item.value);
			});
			q = q + 'product_unit_t:' + temp.join(',') + ';';
		}

		if (this.state.province && this.state.province.sysTreeNodeId) {
			zoneId = this.state.province.sysTreeNodeId;
		}
		if (this.state.city && this.state.city.sysTreeNodeId) {
			zoneId = this.state.city.sysTreeNodeId;
		}

		this.setState({
			zoneId: zoneId,
			q: q
		})
	}

	formatSort() {
		let order = '';
		switch (this.state.sortType) {
			case 'lowToHigh':
				order = 'marketPrice,asc';
				break;
			case 'highToLow':
				order = 'marketPrice,desc';
				break;
			case 'saleFirst':
				order = 'salesVolume,desc';
				break;
			case 'newFirst':
				order = 'lastOnSaleDate,desc';
				break;
			default:
				order = '';
				break;
		}
		this.setState({ order: order });
	}

	getFilterCondition() {
		new Fetch({
			url: '/app/product/getFacet.json',
			data: {
				categoryId: this.props.params && this.props.params.categoryId || '',
			}
		}).dofetch().then((data) => {
			let filterData = data.result.allSelections.slice(0), filterResultData = [];
			filterData.forEach((item, index) => {
				if (item.field == 'manufacture_factory_t' || item.field == 'form_t' || item.field == 'product_unit_t') {
					filterResultData.push(item);
				}
			});
			this.setState({ filter: filterResultData });
		}).catch((error) => {
			console.log('error', error);
		})
	}

	openComponent(component, params) {
		if (this.props.navigator && this.props.navigator.push) {
			this.props.navigator.push({
				component: component,
				params: params != undefined ? params : {}
			})
		}
	}

	dealOrder(sortType) {
		this.setState({ sortType: sortType });
		if (this.state.isModalSortShow == true) {
			this.refs.modalSort.hide();
		}
		setTimeout(() => {
			this.refreshProdulist();
		}, 0)
	}

	renderModalSortView() {
		return (
			<View style={{
				height: 150, width: global.SCREENWIDTH,
				backgroundColor: '#fff', zIndex: 9, position: 'absolute', top: 0, left: 0
			}}>
				<TouchableOpacity
					style={{ height: 50, alignItems: 'center', paddingLeft: 20, paddingRight: 30, flexDirection: 'row' }}
					onPress={() => {
						this.dealOrder('default');
					} }
					>
					<Text style={{ fontSize: 14, color: this.state.sortType == 'default' ? '#0082FF' : '#53606A', flex: 1 }}>默认排序</Text>
					{this.state.sortType == 'default' ? <Image style={{ width: 15, height: 10 }} source={require('../res/images/ProductList/000gouxuan.png')} /> : null}
				</TouchableOpacity>
				<TouchableOpacity
					style={{ height: 50, alignItems: 'center', paddingLeft: 20, paddingRight: 30, flexDirection: 'row' }}
					onPress={() => {
						this.dealOrder('lowToHigh');
					} }
					>
					<Text style={{ fontSize: 14, color: this.state.sortType == 'lowToHigh' ? '#0082FF' : '#53606A', flex: 1 }}>价格低到高</Text>
					{this.state.sortType == 'lowToHigh' ? <Image style={{ width: 15, height: 10 }} source={require('../res/images/ProductList/000gouxuan.png')} /> : null}
				</TouchableOpacity>
				<TouchableOpacity
					style={{ height: 50, alignItems: 'center', paddingLeft: 20, paddingRight: 30, flexDirection: 'row' }}
					onPress={() => {
						this.dealOrder('highToLow');
					} }
					>
					<Text style={{ fontSize: 14, color: this.state.sortType == 'highToLow' ? '#0082FF' : '#53606A', flex: 1 }}>价格高到低</Text>
					{this.state.sortType == 'highToLow' ? <Image style={{ width: 15, height: 10 }} source={require('../res/images/ProductList/000gouxuan.png')} /> : null}
				</TouchableOpacity>
			</View>
		)
	}

	selectedDataStr(type) {
		let str = [];
		if (type == 'form_t') {
			this.state.form_t.forEach((item, index) => {
				str.push(item.name);
			})
		} else {
			this.state.product_unit_t.forEach((item, index) => {
				str.push(item.name);
			})
		}
		return str.join(',');
	}

	onClickSearchBtn() {
		InteractionManager.runAfterInteractions(() => {
			if(this.props.params.fromSearch){
				this.props.navigator.jumpBack(); 
				return;
			}
			this.props.navigator.push({
				params: {
					searchWord: this.state.keyword
				},
				component: Search
			})
		})
	}

	renderFilter(item) {
		if (item.field == 'manufacture_factory_t' && this.state.manufacture_factory_t != null) {
			return (
				<View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center' }}>
					<Text style={{ fontSize: 14, color: '#8495A2', marginRight: 4 }}>{item.title}</Text>
					<Text numberOfLines={1} style={{ flex: 1, textAlign: 'right', fontSize: 14, color: '#333333' }}>{this.state.manufacture_factory_t.name}</Text>
					<Image style={{ width: 6, height: 11, marginLeft: 10 }} source={require('../res/images/ProductList/000xiangyousanjiao.png')} />
				</View>
			)
		}
		if (item.field == 'form_t' && this.state.form_t.length != 0) {
			return (
				<View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center' }}>
					<Text style={{ fontSize: 14, color: '#8495A2', marginRight: 4 }}>{item.title}</Text>
					<Text numberOfLines={1} style={{ flex: 1, textAlign: 'right', fontSize: 14, color: '#333333' }}>{this.selectedDataStr('form_t')}</Text>
					<Image style={{ width: 6, height: 11, marginLeft: 10 }} source={require('../res/images/ProductList/000xiangyousanjiao.png')} />
				</View>
			)
		}

		if (item.field == 'product_unit_t' && this.state.product_unit_t.length != 0) {
			return (
				<View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center' }}>
					<Text style={{ fontSize: 14, color: '#8495A2', marginRight: 4 }}>{item.title}</Text>
					<Text numberOfLines={1} style={{ flex: 1, textAlign: 'right', fontSize: 14, color: '#333333' }}>{this.selectedDataStr('product_unit_t')}</Text>
					<Image style={{ width: 6, height: 11, marginLeft: 10 }} source={require('../res/images/ProductList/000xiangyousanjiao.png')} />
				</View>
			)
		}

		return (
			<View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center' }}>
				<Text style={{ fontSize: 14, color: '#333333', marginRight: 4 }}>{item.title}</Text>
				<Text numberOfLines={1} style={{ flex: 1, textAlign: 'right', fontSize: 14, color: '#333333' }}></Text>
				<Image style={{ width: 6, height: 11, marginLeft: 10 }} source={require('../res/images/ProductList/000xiangyousanjiao.png')} />
			</View>
		)
	}

	renderModalFilterView() {
		return (
			<View style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }}>
				<View style={{ position: 'absolute', top: 0, right: 0, left: 0, zIndex: 10, backgroundColor: '#F9F9F9', paddingTop: 20 }}>
					<View style={{ height: 44, justifyContent: 'center', alignItems: 'center' }}>
						<Text style={{ fontSize: 18, color: '#333333' }}>筛选</Text>
					</View>
					<View style={{ height: 130 + this.state.filter.length * 60, backgroundColor: '#fff', alignItems: 'center' }}>
						<TouchableHighlight
							style={{ height: 40, width: 294, backgroundColor: '#f9f9f9', marginTop: 28 }}
							underlayColor={'#fafafa'}
							onPress={() => {
								this.openComponent(SaleAreaLIst, {
									province: this.state.province,
									city: this.state.city,
									callback: (province, city) => {
										this.setState({ province: province, city: city });
									}
								});
							} }
							>
							{
								this.state.province != null || this.state.city != null ?
									<View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center' }}>
										<Text style={{ fontSize: 14, color: '#8495A2', marginRight: 4 }}>销售区域</Text>
										<Text numberOfLines={1} style={{ flex: 1, textAlign: 'right', fontSize: 14, color: '#333333' }}>
											{
												this.state.city == null ? this.state.province.sysTreeNodeNm : this.state.city.sysTreeNodeNm
											}
										</Text>
										<Image style={{ width: 6, height: 11, marginLeft: 10 }} source={require('../res/images/ProductList/000xiangyousanjiao.png')} />
									</View>
									:
									<View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center' }}>
										<Text style={{ fontSize: 14, color: '#333333', marginRight: 4 }}>销售区域</Text>
										<Text numberOfLines={1} style={{ flex: 1, textAlign: 'right', fontSize: 14, color: '#333333' }}></Text>
										<Image style={{ width: 6, height: 11, marginLeft: 10 }} source={require('../res/images/ProductList/000xiangyousanjiao.png')} />
									</View>
							}

						</TouchableHighlight>
						{
							this.state.filter.map((item, index) => {
								return (
									<TouchableHighlight
										key={'filter' + index}
										style={{ height: 40, width: 294, backgroundColor: '#f9f9f9', marginTop: 20 }}
										underlayColor={'#fafafa'}
										onPress={() => {
											if (item.field == 'manufacture_factory_t') {
												this.openComponent(ManufacturerList, {
													data: item.couts,
													manufacture_factory_t: this.state.manufacture_factory_t,
													callback: (selectedData) => {
														this.setState({ manufacture_factory_t: selectedData })
													}
												});
											}
											if (item.field == 'form_t') {
												this.openComponent(SelectUnitPage, {
													data: item.couts,
													type: item.field,
													selectedData: this.state.form_t,
													callback: (selectedData) => {
														this.setState({ form_t: selectedData })
													}
												})
											}
											if (item.field == 'product_unit_t') {
												this.openComponent(SelectUnitPage, {
													data: item.couts,
													type: item.field,
													selectedData: this.state.product_unit_t,
													callback: (selectedData) => {
														this.setState({ product_unit_t: selectedData })
													}
												})
											}

										} }
										>
										{
											this.renderFilter(item)
										}
									</TouchableHighlight>
								)
							})
						}

					</View>
				</View>
				<View style={{ position: 'absolute', top: 171 + this.state.filter.length * 60, zIndex: 10, right: 0, left: 0, height: 45, alignItems: 'center' }}>
					<TouchableOpacity
						activeOpacity={1}
						style={{ height: 45, width: 290, backgroundColor: '#34457D', justifyContent: 'center', alignItems: 'center', borderRadius: 2 }}
						onPress={() => {
							this.refreshProdulist();
							this.refs.modalFilter.hide();
						} }
						>
						<Text style={{ color: '#FFFFFF', fontSize: 16 }}>确认</Text>
					</TouchableOpacity>
				</View>
				<Text
					style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, zIndex: 9 }}
					onPress={() => {
						this.refs.modalFilter.hide();
					} }
					>
				</Text>
			</View>
		)
	}

	_renderHeader() {
		return (
			<View style={{ flexDirection: 'row', alignItems: 'center', top: global.IS_IOS ? 0 : 0 }}>
				<TouchableHighlight
					style={styles.navContentToch}
					onPress={() => {
						this.onClickSearchBtn()
					} }
					underlayColor={'transparent'}
					>
					<View style={styles.navContentView}>
						{
							// <Image style={styles.navContentImage} source={require('../../home/res/search/a002sousuo.png')} />
						}
						{
							this.state.keyword != '' ?
								<Text style={[styles.navContentText, { color: '#3B3D40' }]}>{this.state.keyword}</Text>
								:
								<Text style={styles.navContentText}>搜索商品 / 品牌</Text>
						}
					</View>
				</TouchableHighlight>
			</View>

		)
	}

	_renderRightButton() {
		return (
			<View style={{ justifyContent: 'center' }}>
				<MoreOperation
					navigator={this.props.navigator}
					order={
						[{
							module: 'index',
						}, {
							module: 'message',
							params: {},
						}, {
							module: 'mine',
							params: {
								callback: (status) => {
									if (!status) return;
									let shopId = this.props.params ? this.props.params.shopInfId : 1;
									let navArr = this.props.navigator.getCurrentRoutes();
									this.props.navigator.replaceAtIndex({
										component: ProductList,
										params: {
											categoryId: this.props.params && this.props.params.categoryId || '',
											keyword: this.props.params && this.props.params.keyword || ''
										},
									}, navArr.length - 2)
								}
							},
						}]
					}
					/>
			</View>
		)
	}

	render() {
		const downImgUnselect = require('../res/images/ProductList/000sanjiaoxia.png'),
			upImgUnselect = require('../res/images/ProductList/000sanjiaoshang.png'),
			downImgSelect = require('../res/images/ProductList/Triangle.png'),
			upImgSelect = require('../res/images/ProductList/003sanjiao_s.png');
		//三角图标
		let sanjiaoImg = null;
		if (this.state.sortType == 'default' || this.state.sortType == 'lowToHigh' || this.state.sortType == 'highToLow') {
			if (this.state.isModalSortShow) {
				sanjiaoImg = upImgSelect;
			} else {
				sanjiaoImg = downImgSelect;
			}
		} else {
			if (this.state.isModalSortShow) {
				sanjiaoImg = upImgUnselect;
			} else {
				sanjiaoImg = downImgUnselect;
			}
		}
		let modalTitle = '默认';
		if (this.state.sortType == 'lowToHigh') {
			modalTitle = '价格低到高';
		}
		if (this.state.sortType == 'highToLow') {
			modalTitle = '价格高到低';
		}
		return (
			<View style={{ flex: 1 }}>
				<BaseView
					mainColor={'#fafafa'}
					navigator={this.props.navigator}
					head={this._renderHeader()}
					rightButton={this._renderRightButton()}
					statusBarStyle={'default'}
					>
					<View style={{ height: 41, flexDirection: 'row', backgroundColor: '#fafafa' }}>
						<TouchableOpacity
							style={{ width: global.SCREENWIDTH / 4, paddingHorizontal: 13, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
							onPress={() => {
								this.refs.modalSort.show();
								this.setState({ isModalSortShow: true });
							} }
							>
							<Text
								numberOfLines={1}
								style={{
									fontSize: 14,
									color: this.state.sortType == 'default' || this.state.sortType == 'lowToHigh' || this.state.sortType == 'highToLow' ? '#0082FF' : '#4B5963'
								}}
								>
								{modalTitle}
							</Text>
							<Image style={{ height: 3.5, width: 7, marginLeft: 5 }} source={sanjiaoImg} />
						</TouchableOpacity>
						<TouchableOpacity
							style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
							onPress={() => {
								this.dealOrder('saleFirst');
							} }
							>
							<Text style={{ fontSize: 14, color: this.state.sortType == 'saleFirst' ? '#0082FF' : '#4B5963' }}>销量</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
							onPress={() => {
								this.dealOrder('newFirst');
							} }
							>
							<Text style={{ fontSize: 14, color: this.state.sortType == 'newFirst' ? '#0082FF' : '#4B5963' }}>新品</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
							onPress={() => {
								this.refs.modalFilter.show();
							} }
							>
							<Image style={{ height: 16, width: 15, marginRight: 5 }} source={require('../res/images/ProductList/003saixuan.png')} />
							<Text style={{ fontSize: 14, color: '#4B5963' }}>筛选</Text>
						</TouchableOpacity>
					</View>
					<List
						ref="productList"
						{...this.props}
						navigator={this.props.navigator}
						categoryId={this.state.categoryId}
						keyword={this.state.keyword}
						/>
					<FlexModal
						ref='modalSort'
						contentView={this.renderModalSortView()}
						containerStyle={{ top: 41 }}
						animationType='fade'
						closeCallBack={() => { this.setState({ isModalSortShow: false }) } }
						/>
				</BaseView>
				<FlexModal
					ref='modalFilter'
					contentView={this.renderModalFilterView()}
					// containerStyle={{ top: 41 }}
					animationType='slideDown'
					closeCallBack={() => { } }
					/>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	backImage: {
		width: 16,
		height: 3
	},
	navRightView: {
		paddingLeft: 10,
		paddingRight: 15,
		height: 44,
		justifyContent: 'center',
	},
	navContentToch: {
		flex: 1,
		marginHorizontal: 45,
		height: 44,
		justifyContent: 'center',
	},
	navContentView: {
		flexDirection: 'row',
		backgroundColor: '#edeef2',
		height: 32,
		alignItems: 'center',
		borderRadius: 6,
	},
	navContentImage: {
		width: 16,
		height: 16,
		marginLeft: 7
	},
	navContentText: {
		fontSize: 14,
		color: '#bbb',
		// color:'#3B3D40',
		marginLeft: 7
	}
})

function mapStateToProps(state) {
	return {
		isLogin: state.Member.isLogin
	}
}

function mapDispatchToProps(dispatch) {
	return {

	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
