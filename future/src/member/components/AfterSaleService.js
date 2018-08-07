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
	FlexModal,
	TextInputC
} from 'future/public/widgets';

import {
	Fetch,
	imageUtil,
	ValidateUtil,
} from 'future/public/lib';
import _ from 'underscore';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view';

import ChooseReturnProduct from './ChooseReturnProduct';
import ReturnProductDetail from './ReturnProductDetail';
import MoreOperation from '../../commons/moreOperation/components/MoreOperation';

let logisticsModalRef = null;

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchWord: ''
		}
		this.listData = null;			//存储被点击了填写物流信息的rowdata
	}

	openComponent(component, params) {
		if (this.props.navigator && this.props.navigator.push) {
			this.props.navigator.push({
				component: component,
				params: params != undefined ? params : {}
			})
		}
	}

	refreshApplyList() {
		InteractionManager.runAfterInteractions(() => {
			this.refs.applyList.pullRefresh();
		});
	}

	refreshReturnList() {
		InteractionManager.runAfterInteractions(() => {
			this.refs.returnList.pullRefresh();
		});
	}

	onClickSearchOrder() {
		this.refreshApplyList();
	}

	onClickLogistics(data) {
		this.listData = data;
		logisticsModalRef && logisticsModalRef.show();
	}

	onClickGotoDetail(rowData, rowID) {
		this.openComponent(ReturnProductDetail, {
			data: rowData,
			callback: (newRowData) => {
				this._updateARowOfListView(newRowData, rowID);
				this.props.refreshOtherList && this.props.refreshOtherList();
			}
		})
	}

	//单独更新returnList的数据
	_updateARowOfListView(rowData, rowID) {
		const rows = [].concat(this.refs.returnList.getRows());
		const row = Object.assign({}, rows[Number(rowID)], rowData)
		rows[Number(rowID)] = row;
		this.refs.returnList.setRows(rows);
	}

	_fetchData(page, success, error) {
		let url = '', data = {
			pageNum: page,
			pageSize: 10
		};
		if (this.props.type == 'apply') {
			url = '/app/returnOrder/listCanReturnOrderList.json';
			data.searchFiled = this.state.searchWord;
		}
		if (this.props.type == 'return') {
			url = '/app/returnOrder/listReturnedOrderList.json';
			data.purchaseOrderCode = '';
		}
		new Fetch({
			url: url,
			// method: 'POST',
			data: data
		}).dofetch().then((data) => {
			data = data.result;
			if (data == null) {
				success([], 0, 0);
			} else {
				success(data.result, 10 * (page - 1) + data.result.length, data.totalCount);
			}
		}).catch((e) => {
			error && error();
			console.log('=====>错误 CATCH>>', e);
		});
	}

	_cancelApply(returnedPurchaseOrderId){
		new Fetch({
			url: 'app/returnOrder/canceledReturnPurchaseOrder.json',
			data: {
				returnedPurchaseOrderId:returnedPurchaseOrderId
			}
		}).dofetch().then((data) => {
			if(data.success){
				Toast.show('取消成功！')
				this.refs.returnList && this.refs.returnList.reloadData();
			}
		}).catch((e) => {
			error && error();
			console.log('=====>错误 CATCH>>', e);
		});
	}

	_renderRow(rowData, sectionID, rowID, highlightRow) {
		let list = null;
		if (this.props.type == 'apply') {
			list = (
				<TouchableOpacity
					activeOpacity={0.6}
					onPress={() => {

					} }
					key={rowID}>
					<View style={{ backgroundColor: '#fff', marginBottom: 10 }}>
						<View style={{ height: 45, alignItems: 'center', flexDirection: 'row', paddingHorizontal: 13 }}>
							<Text style={{ fontSize: 13, color: '#4F5665', flex: 1 }}>订单编号：{rowData.orderNum}</Text>
						</View>
						<View>
							{
								_.map(rowData.items, (item, index, arr) => {
									return (
										<View key={index} style={{ backgroundColor: '#fafafa', paddingHorizontal: 13, marginBottom: 5 }}>
											<View style={{ marginTop: 15 }}>
												<Text numberOfLines={1} style={{ fontSize: 14, color: '#333333' }}>{item.productNm}</Text>
											</View>
											<View style={{ marginTop: 10 }}>
												<Text style={{ fontSize: 12, color: '#8495A2' }}>规格：{item.specNm}</Text>
											</View>
											<View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
												<Text numberOfLines={1} style={{ fontSize: 12, color: '#8495A2', flex: 1 }}>厂家：{item.factory}</Text>
												<Text style={{ fontSize: 12, color: '#8495A2' }}>￥{item.unitPrice.toFixed(2)}</Text>
											</View>
											<View style={{ marginTop: 10, marginBottom: 17, flexDirection: 'row', alignItems: 'center' }}>
												<Text numberOfLines={1} style={{ fontSize: 12, color: '#8495A2', flex: 1 }}>批号：{item.batchNum}</Text>
												<Text style={{ fontSize: 12, color: '#8495A2' }}>x{item.canReturnQuantity}</Text>
											</View>
										</View>
									)
								})
							}
						</View>
						<View style={{ height: 50, justifyContent: 'center', flex: 1, paddingHorizontal: 13 }}>
							<TouchableOpacity style={{
								justifyContent: 'center', alignItems: 'center', width: 70, height: 28,
								borderColor: '#0082FF', borderWidth: StyleSheet.hairlineWidth,
								borderRadius: 2, alignSelf: 'flex-end'
							}}
								onPress={() => {
									this.openComponent(ChooseReturnProduct, {
										type: 'order',
										data: rowData,
										callback: () => {
											this.refreshApplyList();
											this.props.refreshOtherList && this.props.refreshOtherList();
										}
									})
								} }
								>
								<Text style={{ fontSize: 13, color: '#0082FF' }}>申请退货</Text>
							</TouchableOpacity>
						</View>
					</View>
				</TouchableOpacity>
			)
		}

		if (this.props.type == 'return') {
			let stateColor = rowData.stat == '0' || rowData.stat == '1' ? '#FF6600' : '#333333';
			list = (
				<TouchableOpacity
					activeOpacity={0.6}
					onPress={() => {
						this.onClickGotoDetail(rowData, rowID);
					} }
					key={rowID}>
					<View style={{ backgroundColor: '#fff', marginTop: 10 }}>
						<View style={{ height: 45, alignItems: 'center', flexDirection: 'row', paddingHorizontal: 13 }}>
							<Text numberOfLines={1} style={{ fontSize: 13, color: '#4F5665', flex: 1 }}>订单编号：{rowData.orderNum}</Text>
							<Text style={{ fontSize: 13, color: stateColor }}>{rowData.statStr}</Text>
						</View>
						<View>
							{
								_.map(rowData.items, (item, index, arr) => {
									return (
										<View key={index} style={{ backgroundColor: '#fafafa', paddingHorizontal: 13, marginBottom: 5 }}>
											<View style={{ marginTop: 15 }}>
												<Text style={{ fontSize: 13, color: '#333333' }}>{item.productNm}</Text>
											</View>
											<View style={{ marginTop: 10 }}>
												<Text style={{ fontSize: 12, color: '#8495A2' }}>规格：{item.specNm}</Text>
											</View>
											<View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
												<Text numberOfLines={1} style={{ fontSize: 12, color: '#8495A2', flex: 1 }}>厂家：{item.factory}</Text>
												<Text style={{ fontSize: 12, color: '#8495A2' }}>￥{item.unitPrice.toFixed(2)}</Text>
											</View>
											<View style={{ marginTop: 10, marginBottom: 17, flexDirection: 'row', alignItems: 'center' }}>
												<Text numberOfLines={1} style={{ fontSize: 12, color: '#8495A2', flex: 1 }}>批号：{item.batchNum}</Text>
												<Text style={{ fontSize: 12, color: '#8495A2' }}>X{item.returnedQuantity}</Text>
											</View>
										</View>
									)
								})
							}
						</View>
						{
							rowData.stat == '1' ?
								<View style={{ height: 45, alignItems: 'flex-end', paddingHorizontal: 13, justifyContent: 'center' }}>
									<View style={{width:SCREENWIDTH-26,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
									<Text style={{ fontSize: 13, color: '#333333'}}>预计退货金额：￥{rowData.orderTotalAmount.toFixed(2)}</Text>
									<TouchableOpacity style={{
										justifyContent: 'center', alignItems: 'center', width: 90, height: 28,
										borderColor: '#0082FF', borderWidth: StyleSheet.hairlineWidth,
										borderRadius: 2, alignSelf: 'flex-end',
									}}
										onPress={() => {
											this.onClickLogistics(rowData);
										} }
										>
										<Text style={{ fontSize: 13, color: '#0082FF' }}>填写物流信息</Text>
									</TouchableOpacity>
									</View>
								</View>
								:
								<View style={{ height: 45, alignItems: 'flex-end', paddingHorizontal: 13, justifyContent: 'center' }}>
									{rowData.stat == '0'?
									<View style={{width:SCREENWIDTH-26,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
										<Text style={{ fontSize: 13, color: '#333333' }}>预计退货金额：￥{rowData.orderTotalAmount.toFixed(2)}</Text>
										<TouchableOpacity 
										onPress={this._cancelApply.bind(this,rowData.returnedPurchaseOrderId)}
										style={{width:70,height:28,borderRadius: 3,justifyContent:'center',alignItems:'center',borderColor:'#0082FF',borderWidth:StyleSheet.hairlineWidth}}>
											<Text style={{fontSize:13,color:'#0082FF'}}>取消申请</Text>
										</TouchableOpacity>
									</View>:
									<Text style={{ fontSize: 13, color: '#333333' }}>预计退货金额：￥{rowData.orderTotalAmount.toFixed(2)}</Text>}
								</View>
						}
					</View>
				</TouchableOpacity>
			)
		}

		return list;
	}

	render() {
		if (this.props.type == 'apply') {
			return (
				<View style={{ backgroundColor: '#F5F5F5', flex: 1 }}>
					<View style={{ height: 45, justifyContent: 'center', backgroundColor: '#F5F5F5' }}>
						<View style={{
							backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center',
							borderRadius: 4, height: 30, marginHorizontal: 12,
							paddingHorizontal: global.SCREENWIDTH / 2 - 134
						}}>
							<TouchableOpacity
								onPress={() => {

								} }
								>
								<Image style={{ width: 16, height: 16, marginHorizontal: 10, }} source={require('../../home/res/search/a002sousuo.png')} />
							</TouchableOpacity>
							<TextInputC
								onSubmitEditing={() => {
								} }
								onChangeText={(text) => {
									this.setState({
										searchWord: text
									});
								} }
								onBlur={() => {
									this.onClickSearchOrder();
								} }
								returnKeyType={'search'}
								numberOfLines={1}
								value={this.state.searchWord}
								clearButtonMode={'while-editing'}
								placeholder='商品名称/商品编号/订单编号'
								placeholderTextColor='#BBBBBB'
								style={{ color: '#333333', fontSize: 14, flex: 1 }}
								/>
						</View>
					</View>
					<RefreshableListView
						autoRefresh={true}
						// refreshable={false}
						ref="applyList"
						fetchData={this._fetchData.bind(this)}
						scrollRenderAheadDistance={100} //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行。
						pageSize={10} // 每次事件循环（每帧）渲染的行数。
						initialListSize={1}
						onEndReachedThreshold={200}
						renderRow={this._renderRow.bind(this)}
						/>
				</View>
			)
		} else {
			return (
				<View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
					<RefreshableListView
						autoRefresh={true}
						// refreshable={false}
						ref="returnList"
						fetchData={this._fetchData.bind(this)}
						scrollRenderAheadDistance={100} //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行。
						pageSize={10} // 每次事件循环（每帧）渲染的行数。
						initialListSize={1}
						onEndReachedThreshold={200}
						renderRow={this._renderRow.bind(this)}
						/>
				</View>

			)
		}

	}
}

export default class AfterSaleService extends Component {
	constructor(props) {
		super(props);
		this.state = {
			logisticsCompany: '',
			logisticsOrderNum: '',

		}
	}
	componentWillMount() {
	}
	componentDidMount() {
	}
	componentWillUnmount() {
		//解除引用
		if (logisticsModalRef) { logisticsModalRef = null; }
	}

	refreshApplyList() {
		this.refs.apply.refreshApplyList();
	}

	refreshReturnList() {
		this.refs.return.refreshReturnList();
	}

	onClickLogisticsConfirm() {
		new Fetch({
			url: '/app/returnOrder/updateReturnedLogistics.json',
			method: 'POST',
			data: {
				returnedPurchaseOrderId: this.refs.return.listData.returnedPurchaseOrderId,
				logisticsOrderCode: this.state.logisticsOrderNum,
				logisticsCompany: this.state.logisticsCompany
			}
		}).dofetch().then((data) => {
			if (data.success == true) {
				Toast.show('物流信息更新成功');
			} else {
				Toast.show('物流信息更新失败');
				this.setState({ logisticsCompany: '', logisticsOrderNum: '' });
			}
		}).catch((error) => {
			console.log('=====>错误 CATCH>>', error);
			Toast.show('物流信息更新失败');
			this.setState({ logisticsCompany: '', logisticsOrderNum: '' });
		});
		logisticsModalRef && logisticsModalRef.hide();
	}

	renderModalView() {
		return (
			<View style={{
				backgroundColor: 'rgba(240,240,240,0.94)', position: 'absolute',
				width: 270, height: 200,
				left: (global.SCREENWIDTH - 270) / 2, top: 90, borderRadius: 12, alignItems: 'center'
			}}>
				<Text style={{ color: '#333333', fontSize: 17, marginTop: 15, marginBottom: 18 }}>填写物流信息</Text>
				<View style={{
					backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center',
					borderRadius: 2, height: 33, marginHorizontal: 13, marginBottom: 15
				}}>
					<TextInputC
						onSubmitEditing={() => {

						} }
						onChangeText={(text) => {
							this.setState({
								logisticsCompany: text
							});
						} }
						autoFocus={true}
						returnKeyType={'default'}
						numberOfLines={1}
						value={this.state.logisticsCompany}
						clearButtonMode={'while-editing'}
						placeholder='物流公司'
						placeholderTextColor='#C7C7CD'
						style={{ color: '#333333', fontSize: 14, flex: 1, paddingHorizontal: 7 }}
						/>
				</View>
				<View style={{
					backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center',
					borderRadius: 2, height: 33, marginHorizontal: 13, marginBottom: 15
				}}>
					<TextInputC
						onSubmitEditing={() => {

						} }
						onChangeText={(text) => {
							this.setState({
								logisticsOrderNum: text
							});
						} }
						returnKeyType={'default'}
						numberOfLines={1}
						value={this.state.logisticsOrderNum}
						clearButtonMode={'while-editing'}
						placeholder='物流单号'
						placeholderTextColor='#C7C7CD'
						style={{ color: '#333333', fontSize: 14, flex: 1, paddingHorizontal: 7 }}
						/>
				</View>
				<View style={{
					flexDirection: 'row', width: 270,
					borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
					flex: 1, borderTopWidth: StyleSheet.hairlineWidth,
					borderTopColor: '#999999', overflow: 'hidden'
				}}>
					<TouchableOpacity
						activeOpacity={0.5}
						style={{
							flex: 1, justifyContent: 'center', alignItems: 'center',
							borderRightWidth: StyleSheet.hairlineWidth,
							borderRightColor: '#999999'
						}}
						onPress={() => {
							logisticsModalRef && logisticsModalRef.hide();
						} }
						>
						<Text style={{ color: '#007AFF', fontSize: 16 }}>取消</Text>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={0.5}
						style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
						onPress={() => {
							this.onClickLogisticsConfirm()
						} }
						>
						<Text style={{ color: '#007AFF', fontSize: 16 }}>确定</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}

	_renderRightButton() {
		return (
			<View style={{ justifyContent: 'center' }}>
				<MoreOperation
					navigator={this.props.navigator}
					/>
			</View>
		)
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<BaseView
					mainColor={'#fafafa'}
					navigator={this.props.navigator}
					title={{ title: '售后服务', tintColor: '#333' }}
					titlePosition={"center"}
					rightButton={this._renderRightButton()}
					statusBarStyle={'default'}
					>
					<ScrollableTabView
						tabBarBackgroundColor='#FAFAFA'
						tabBarInactiveTextColor='#4B5963'
						tabBarUnderlineColor='#0082FF'
						tabBarActiveTextColor='#0082FF'
						tabBarTextStyle={{ fontSize: 14, fontWeight: '400' }}
						onChangeTab={() => {

						} }
						renderTabBar={() => <ScrollableTabBar
							style={{ height: 40, borderWidth: 0 }}
							tabStyle={{ height: 35, width: 100, flexDirection: 'row', justifyContent: 'center', }}
							tabsContainerStyle={{ height: 40 }}
							underlineHeight={2}
							/>}
						>
						<List
							ref="apply"
							navigator={this.props.navigator}
							tabLabel="售后申请"
							type={'apply'}
							refreshOtherList={() => {
								this.refreshReturnList();
							} }
							/>
						<List
							ref="return"
							navigator={this.props.navigator}
							tabLabel="退货进度"
							type={'return'}
							refreshOtherList={() => {
								this.refreshApplyList();
							} }
							/>
					</ScrollableTabView>
				</BaseView>
				<FlexModal
					ref={(e) => { logisticsModalRef = e } }
					contentView={this.renderModalView()}
					// containerStyle={{ top: 41 }}
					animationType='fade'
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
})
