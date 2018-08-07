import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	TouchableOpacity,
	InteractionManager,
	Scrollview,
	LayoutAnimation,
	UIManager,
	Animated,
	Easing
} from 'react-native';

import { Fetch } from 'future/public/lib';
import {
	RefreshableListView,
	BaseView,
	MaskModal,
	NumberInput,
	Toast,
	DataControllerForList
} from 'future/public/widgets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import RefreshableListView_old from 'future/public/widgets/listview/RefreshableListView_old';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import styles from "../styles/ProcureProgram";
import PrdListItem from './PrdListItem';
import ProductDetail from '../../product/components/ProductDetail';
import StocksList from '../../stocksList/components/StocksList';

let fullWidth = require('Dimensions').get('window').width;
let fullHeight = require('Dimensions').get('window').height;
let _purchaseTemplateId = 0;
let seletAll = true;
let localChange = false;
let templateData = [];
//plan
let planSelectIndex = 0;
let isDisable;

// 计划列表
class PlanList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectIndex: -1,
			data: this.props.data,
		}
	}

	static propTypes = {
		selectPlanBuyId: React.PropTypes.func
	}
	static defaultProps = {
		selectPlanBuyId: () => { }
	}

	_selectPlanBuyId(purchaseTemplateId, index) {
		planSelectIndex = index;
		this.props.selectPlanBuyId(purchaseTemplateId);
	}

	render() {

		return (
			<View>
				{
					this.state.data.map((item, index) => {
						return (
							<View key={'planlist' + index} style={styles.list}>
								<TouchableOpacity style={styles.list} onPress={() => { this._selectPlanBuyId(item.purchaseTemplateId, index) } }>
									<Text style={styles.listText} numberOfLines={1} >
										{item.templateNm}({item.itemCount}品种)
                					</Text>
									{index == planSelectIndex && <Image style={styles.listImage} source={require('../res/images/000gouxuan.png')} />}
								</TouchableOpacity>
							</View>
						)
					})
				}
			</View>
		)
	}
}


//常购品种item组件
class OftenBuyItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			stepNum: this.props.prdData && this.props.prdData.isUnbundled == 'N' ? this.props.prdData.midPackTotal : 1,
			isSelected: this.props.prdData ? this.props.prdData.selected : true,
			rowData: this.props.prdData,
		}
	}

	componentWillMount() {
		UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
	}

	openComponent(component, params) {
		if (this.props.navigator && this.props.navigator.push) {
			this.props.navigator.push({
				component: component,
				params: params != undefined ? params : {}
			})
		}
	}

	changeSelectState(state) {
		if (this.state.isSelected != state) {
			this.setState({ isSelected: state });
		}
	}

	setPlanNum(num = 1) {
		if (num != this.state.stepNum) {
			this.setState({ stepNum: num });
		}
	}

	callbackData() {
		if (this.state.isSelected == true && isDisable === false) {
			let data = this.state.rowData;
			data.selectNum = this.state.stepNum;
			return data;
		} else {
			return null;
		}
	}

	onClickSelectBtn() {
		LayoutAnimation.easeInEaseOut();
		this.setState({
			isSelected: !this.state.isSelected
		}, () => {
			this.props.callback && this.props.callback();
		});
	}

	render() {

		let rowData = this.props.prdData;
		
		isDisable = rowData.remainStock > 0 ? false : true;
		return (
			<View>
				<View style={{ width: fullWidth, flex: 1, flexDirection: 'row', backgroundColor: '#fff' }}>
					<TouchableOpacity
						activeOpacity={1}
						disabled={isDisable}
						onPress={() => {
							this.onClickSelectBtn();
						} }
						>
						<View style={{ width: 50, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<Image
								style={{ width: 16, height: 16 }}
								source={this.state.isSelected == true && !isDisable ? require('../../stocksList/res/images/000gouxuan_s.png') : require('../../stocksList/res/images/000weigouxuan.png')}
								resizeMode='contain' />
						</View>
					</TouchableOpacity>
					<View style={{ width: fullWidth - 50, flex: 1, backgroundColor: '#fff' }}>
						<TouchableOpacity
							activeOpacity={0.5}
							onPress={() => {
								this.openComponent(ProductDetail, { productId: rowData.productId });
							} }
							>
							<Text style={{ marginTop: 15, fontSize: 14, color: '#333' }}>{rowData.productNm}</Text>
							<View style={{ marginTop: 10, width: fullWidth - 60, flex: 1, paddingBottom: 15, borderBottomWidth: 0.5, borderBottomColor: '#EEEEEE' }}>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
									<Text style={{ color: '#8495A2', fontSize: 12, }}>规格：{rowData.specPack}</Text>
									{
										!this.state.isSelected && <Text style={{ color: '#8495A2', fontSize: 12, }}>￥{Number.parseInt(rowData.price).toFixed(2)}</Text>
									}
								</View>
								<Text style={{ color: '#8495A2', fontSize: 12, marginTop: 10 }}>厂家：{rowData.factory}</Text>
								<Text style={{ color: '#8495A2', fontSize: 12, marginTop: 10 }}>供应商：{rowData.shopNm}</Text>
							</View>
							{this.state.isSelected && <View style={{ height: 60, width: fullWidth - 65, backgroundColor: '#F8F8F8', flexDirection: 'row', justifyContent: 'space-between' }}>
								<View style={{ marginLeft: 15 }}>
									<Text style={{ marginTop: 10, fontSize: 13, color: '#333' }}>¥{Number.parseInt(rowData.price).toFixed(2)}</Text>
									<Text style={{ marginTop: 10, fontSize: 12, color: '#5C6A74' }}>库存：{rowData.remainStock}</Text>
								</View>
								<View style={{ marginTop: 15, marginRight: 15 }}>
									<NumberInput
										value={this.state.stepNum}
										onChange={(value) => { this.setState({ stepNum: value }) } }
										max={rowData.remainStock} 
									/>
								</View>
							</View>}
							<View style={{ width: fullWidth - 60, height: 40,  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
								{
									isDisable ? <Text style={{fontSize: 12, color: 'red'}}>此商品库存为0，请选择其它商品</Text>
											   : <Text></Text>
								}
								
								{
									this.state.isSelected ?
										<Text style={{ fontSize: 13, color: '#333' }}>
											小计<Text style={{ color: '#FF6600' }}>   ¥{(this.state.stepNum * rowData.price).toFixed(2)}</Text>
										</Text>
										:
										<Text style={{ fontSize: 13, color: '#333' }}>
											共{this.state.stepNum}件<Text style={{ color: '#FF6600' }}>   ¥{(this.state.stepNum * rowData.price).toFixed(2)}</Text>
										</Text>
								}

							</View>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		)
	}
}


export default class ProcureProgram extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isPlanListShow: false,
			PlanNm: this.props.params.purchaseType == 0 ? '采购计划' : '常购品种',
			isSeletcAll: true,
			planListData: [],
			oftenBuyData: [],
			dataState: null,
			isShowToCart: false,
			opactyAnim: new Animated.Value(0),
			totalNum: 0,
			totalPrice: 0,
			isShowAddToCart: true,    //是否展示 加入进货单 按钮
			
		};
		this.prdListRef = [];
		_purchaseTemplateId = this.props.params.purchaseTemplateId;
	}

	componentWillMount() {
		InteractionManager.runAfterInteractions(() => {
			if (this.props.params.purchaseType == 0) {
				this.getPlanlistData();
			}
		})
	}

	componentWillUnmount() {
		planSelectIndex = -1;
		this.timer && clearTimeout(this.timer);
	}

	getPlanlistData() {
		new Fetch({
			url: 'app/fastBuy/purchaseTemplateList.json',
			method: 'POST'
		}).dofetch().then((data) => {
			if (data.result) {

				this.setState({ planListData: data.result });
			}
		}).catch((err) => {
			console.log('=> catch: ', err);
			error && error();
		});
	}


	// 打开计划列表
	showPlanList = () => {
		if (this.props.params.purchaseType == 1) { return; }
		this.refs.planListModal.show();
		this.setState({
			isPlanListShow: true,
		});
	};
	// 关闭计划列表
	hidePlanList = () => {
		this.refs.planListModal.hide();
		this.setState({
			isPlanListShow: false,
		});
	};



	_loadSelectPlanById(purchaseTemplateId) {
		_purchaseTemplateId = purchaseTemplateId;
		this.hidePlanList();
		this.refs.listView && this.refs.listView.reloadData();
	}


	_fetchData(page, success, error) {
		var url;
		url = this.props.params.purchaseType == 0 ? "app/fastBuy/getPurchaseTemplateDetail.json" : "app/fastBuy/purchaseList.json";
		new Fetch({
			url: url,
			data: {
				purchaseTemplateId: _purchaseTemplateId,
			}
		}).dofetch().then((data) => {
			//为了去掉loading弹跳图
			this.setState({ dataState: 'data' });
			//end
			if (this.props.params.purchaseType == 0) {

				templateData = data.result.productList.map((item, tag) => {
					item.selected = seletAll;
					return item;
				});
				let name;
				name = data.result.templateNm ? data.result.templateNm + '(' + data.result.productList.length + ')' : '采购计划';
				this.setState({
					PlanNm: name,
					isShowAddToCart: templateData.length === 0 ? false : true
				});
				console.log('data====>', templateData);
				//重置数据,下一次设置才能初始化item
				success([], 0, 0);
				success(templateData, 5 * (page - 1) + templateData.length, templateData.length);

			} else {
				let templateData = data.result.map((item, tag) => {
					item.selected = seletAll;
					return item;
				});
				if (data.result) {
					let name = `常购品种(${data.result.length})`;
					this.setState({
						PlanNm: name,
						isShowAddToCart: templateData.length === 0 ? false : true
					});
				}

				success([], 0, 0);
				success(templateData, 5 * (page - 1) + templateData.length, templateData.length);
			}

		}).catch((err) => {
			console.log("采购计划数据获取错误：", err);
		});
	}

	_renderRow(rowData, sectionID, rowID) {		
		return (
			<View>
				{
					this.props.params.purchaseType == 0 &&
					<PrdListItem
						navigator={this.props.navigator}
						key={'item' + rowID}
						ref={(e) => { this.prdListRef[rowID] = e } }
						showStock={true}
						localChangeEvent={(allSeleted, index) => {
							localChange = true;

						} }
						prdData={rowData}
						callback={() => {
							this.onClickSelectBtn();
						} }
						/>
				}
				{
					this.props.params.purchaseType == 1 &&
					<OftenBuyItem
						navigator={this.props.navigator}
						key={'oftenItem' + rowID}
						ref={(e) => { this.prdListRef[rowID] = e } }
						prdData={rowData}
						callback={() => {
							this.onClickSelectBtn();
						} }
						/>
				}
			</View>
		);
	}

	_renderSeparator(sectionID, rowID) {
		return (
			<View key={rowID} style={{ backgroundColor: '#f2f4f5', height: 10 }}></View>
		)
	}

	_leftBarItemAction() {
		this.setState({
			isSeletcAll: !this.state.isSeletcAll
		}, () => {
			this.prdListRef.forEach((item, index) => {
				if (item != null) {
					item.changeSelectState(this.state.isSeletcAll);
				}
			})
		});

	}

	//添加成功之后出现的浮层动画	
	startTipAnimate() {
		this.setState({ isShowToCart: true }, () => {
			Animated.timing(
				this.state.opactyAnim, {
					toValue: 1,
					duration: 300,
					easing: Easing.in
				}).start(() => {
					this.timer = setTimeout(() => {
						Animated.timing(
							this.state.opactyAnim,
							{
								toValue: 0,
								duration: 200,
								easing: Easing.in
							}
						).start(() => {
							this.timer && this.setState({ isShowToCart: false });
						})
					}, 2000)
				})
		})
	}

	onClickSelectBtn() {
		let isAllSelect = true;
		this.prdListRef.forEach((item, index) => {
			if (item && item.state.isSelected == false) {
				isAllSelect = false
			}
		})
		if (this.state.isSeletcAll != isAllSelect) {
			this.setState({ isSeletcAll: isAllSelect });
		}
	}

	onClickAddToCart() {
		//采购计划
		if (this.props.params.purchaseType == 0) {
			//selectItem选择的计划的项，itemIdNums格式化后的参数			
			let selectItem = [],
				itemIdNums = [],
				totalNum = 0,
				totalPrice = 0;
			this.prdListRef.forEach((item, index) => {
				if (item && item.callbackData() != null) {
					let data = item.callbackData();
					selectItem.push(data);
					itemIdNums.push(data.purchaseTemplateItemId + '_' + data.selectNum);
				}
			})

			selectItem.forEach((item, index) => {
				totalNum = totalNum + item.selectNum;
				totalPrice = totalPrice + item.selectNum * item.price;
			})
			this.setState({ totalNum: totalNum, totalPrice: totalPrice });

			if (selectItem.length == 0) {
				return Toast.show('请选择至少一个商品')
			}

			new Fetch({
				url: 'app/fastBuy/addPurchaseTemplateItemToCart.json',
				method: 'POST',
				data: {
					itemIdNums: itemIdNums.join(',')
				}
			}).dofetch().then((data) => {
				if (data.success) {
					Toast.show('加入进货单成功');
					this.startTipAnimate();
				} else {
					Toast.show('加入进货单失败');
				}
			}).catch((err) => {
				console.log('=> catch: ', err);
				error && error();
			});
		}

		//常购清单
		if (this.props.params.purchaseType == 1) {
			let selectItem = [],
				itemIdNums = [],
				totalNum = 0,
				totalPrice = 0;
			this.prdListRef.forEach((item, index) => {
				if (item && item.callbackData() != null) {
					let data = item.callbackData();
					selectItem.push(data);
					itemIdNums.push(data.purchaseListId + '_' + data.selectNum);
				}
			})

			selectItem.forEach((item, index) => {
				totalNum = totalNum + item.selectNum;
				totalPrice = totalPrice + item.selectNum * item.price;
			})
			this.setState({ totalNum: totalNum, totalPrice: totalPrice });

			if (selectItem.length == 0) {
				return Toast.show('请选择至少一个商品')
			}

			new Fetch({
				url: 'app/fastBuy/addPurchaseListToCart.json',
				method: 'POST',
				data: {
					purchaseListIdNums: itemIdNums.join(',')
				}
			}).dofetch().then((data) => {
				if (data.success) {
					Toast.show('加入进货单成功');
					this.startTipAnimate();
				} else {
					Toast.show('加入进货单失败');
				}
			}).catch((err) => {
				console.log('=> catch: ', err);
				error && error();
			});
		}

	}

	onClickGoToCart() {
		// RCTDeviceEventEmitter.emit('changeTabBarIdx', { idx: 2, goTop: true });
		this.props.navigator.push({
			component: StocksList
		})
	}

	render() {
		let arrow = this.state.isPlanListShow ? require('future/public/commons/res/002shouqi.png') : require('future/public/commons/res/001xiala.png');

		let head = (
			<TouchableOpacity
				activeOpacity={0.7}
				onPress={this.showPlanList}
				style={styles.head}>
				<Text style={styles.headTitle}>{this.state.PlanNm}</Text>
				{this.props.params.purchaseType == 0 && <Image style={styles.headImg} source={arrow} />}
			</TouchableOpacity>
		);

		let leftButton = (
			<TouchableOpacity style={styles.headBtn} activeOpacity={0.5} onPress={this._leftBarItemAction.bind(this)}>
				<Text style={styles.headBtnTitle}>{this.state.isSeletcAll == true ? '全不选' : '全选'}</Text>
			</TouchableOpacity>
		);

		let rightButton = (
			<TouchableOpacity onPress={this.props.navigator.pop} style={styles.headBtn}>
				<Text style={styles.headBtnTitle}>关闭</Text>
			</TouchableOpacity>
		);
		console.log('render---------');
		return (
			<View style={{ flex: 1 }}>
				<BaseView
					ref='baseview'
					navigator={this.props.navigator}
					leftButton={leftButton}
					rightButton={rightButton}
					statusBarStyle={'default'}
					head={head}
					>
					<DataControllerForList data={this.state.dataState} />

					<KeyboardAwareScrollView
						contentInset={{ bottom: 0 }}
						style={{ backgroundColor: '#f2f4f5' }}
						>
						<RefreshableListView_old
							style={{ backgroundColor: '#f2f4f5' }}
							ref="listView"
							pageSize={5}
							initialListSize={5}
							autoRefresh={true}
							autoLoadMore={true}
							refreshable={false}
							fetchData={this._fetchData.bind(this)}
							renderRow={this._renderRow.bind(this)}
							renderSeparator={this._renderSeparator.bind(this)}
							scrollRenderAheadDistance={100}
							onEndReachedThreshold={200}
							stickyHeaderIndices={[]}
							openCheckNetwork={false}
							/>
					</KeyboardAwareScrollView>


					{/*计划列表弹层*/}
					<MaskModal
						ref='planListModal'
						viewType="top"
						contentView={
							<PlanList
								data={this.state.planListData}
								selectPlanBuyId={(purchaseTemplateId) => { this._loadSelectPlanById(purchaseTemplateId) } } />
						}
						closeCallback={() => { this.setState({ isPlanListShow: false }) } }
						/>
					{
						this.state.isShowAddToCart ? (
							<View style={{ width: fullWidth, height: 75, borderTopWidth: 0.5, borderTopColor: '#EEE', alignItems: 'center', backgroundColor: '#fff', opacity: 0.74 }}>
								<TouchableOpacity style={{ alignItems: 'center' }}
									onPress={() => {
										this.onClickAddToCart();
									} }>
									<Image style={{ width: 22, height: 25, marginTop: 16 }} source={require('../res/fastBuy/005jiarujinhuodan.png')} />
									<Text style={{ color: '#0082FF', fontSize: 12, marginTop: 4 }}>加入进货单</Text>
								</TouchableOpacity>
							</View>
						) : null
					}
				</BaseView>
				{/*前往进货单弹窗*/}
				{
					this.state.isShowToCart == true ?
						<Animated.View style={[styles.toCartBox, { opacity: this.state.opactyAnim }]}>
							<View style={styles.toCartNumberBox}>
								<Image style={styles.toCartNumberImg} source={require('../res/images/005jinhuodan.png')} />
								{true &&
									<View style={styles.toCartNumber}>
										<Text style={styles.toCartNumberTitle}>{this.state.totalNum}</Text>
									</View>
								}
							</View>
							<Text style={styles.toCartTotal}>合计:
						<Text style={styles.toCartSymbol}>¥
							<Text style={styles.toCartMoney}>
								{Number.parseInt(this.state.totalPrice).toFixed(2)}
							</Text>
						</Text>
						</Text>
						<TouchableOpacity
							onPress={() => {
									this.onClickGoToCart();
							} }
							style={styles.toCartBtn}>
							<Text style={styles.toCartBtnTitle}>前往进货单</Text>
						</TouchableOpacity>
					</Animated.View>
					:
					<View></View>
				}
			</View>
		)
	}
}




