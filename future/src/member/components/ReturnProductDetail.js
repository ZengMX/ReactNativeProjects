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
	Easing,
	ScrollView,
	Alert
} from 'react-native';

import {
	RefreshableListView,
	BaseView,
	Toast,
	FlexModal,
	TextInputC,
	DataController,
} from 'future/public/widgets';

import {
	Fetch,
	imageUtil,
	ValidateUtil,
} from 'future/public/lib';
import _ from 'underscore';

export default class ReturnProductDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: this.props.params.data,				//传递过来的参数
			productDetailData: null,
			logisticsCompany: '',
			logisticsOrderNum: '',
		}
	}
	componentWillMount() {
		InteractionManager.runAfterInteractions(() => {
			this.open();
		})
	}
	componentDidMount() {
	}
	componentWillUnmount() {
	}

	open() {
		new Fetch({
			url: '/app/returnOrder/getReturnedOrderDetail.json',
			data: {
				returnedPurchaseOrderId: this.state.data.returnedPurchaseOrderId
			}
		}).dofetch().then((data) => {
			this.setState({
				productDetailData: data.result,
				logisticsCompany: data.result.logisticsCompany || '',
				logisticsOrderNum: data.result.logisticsOrderCode || '',
			});
		}).catch((e) => {
			error && error();
			console.log('=====>错误 CATCH>>', e);
		});
	}

	onClickCancelApply() {
		Alert.alert(
			'温馨提示',
			'确定取消申请?',
			[
				{ text: '取消', onPress: () => {} },
				{
					text: '确定', onPress: () => {
						new Fetch({
							url: '/app/returnOrder/canceledReturnPurchaseOrder.json',
							method: 'POST',
							data: {
								returnedPurchaseOrderId: this.state.productDetailData.returnedPurchaseOrderId
							}
						}).dofetch().then((data) => {
							if (data.success == true) {
								this.open();
								Toast.show('取消申请成功');
								let newdata = this.state.data;
								newdata.stat = '3';
								newdata.statStr = '已取消';
								this.props.params.callback && this.props.params.callback(newdata);
							} else {
								Toast.show('取消申请失败');
							}
						}).catch((error) => {
							console.log('=====>错误 CATCH>>', error);
						});
					}
				},
			]
		);
	}

	onClickWriteLogistics() {
		this.logisticsModal && this.logisticsModal.show();
	}

	onClickLogisticsConfirm() {
		new Fetch({
			url: '/app/returnOrder/updateReturnedLogistics.json',
			method: 'POST',
			data: {
				returnedPurchaseOrderId: this.state.productDetailData.returnedPurchaseOrderId,
				logisticsOrderCode: this.state.logisticsOrderNum,
				logisticsCompany: this.state.logisticsCompany
			}
		}).dofetch().then((data) => {
			if (data.success == true) {
				Toast.show('物流信息更新成功');
			} else {
				Toast.show('物流信息更新失败');
				this.setState({
					logisticsCompany: this.state.productDetailData.logisticsCompany || '',
					logisticsOrderNum: this.state.productDetailData.logisticsOrderCode || ''
				})
			}
		}).catch((error) => {
			console.log('=====>错误 CATCH>>', error);
			Toast.show('物流信息更新失败');
			this.setState({
				logisticsCompany: this.state.productDetailData.logisticsCompany || '',
				logisticsOrderNum: this.state.productDetailData.logisticsOrderCode || ''
			});
		});
		this.logisticsModal && this.logisticsModal.hide();
	}

	//退货流程进度	
	renderProgress(data) {
		const blueDot = require('../res/afterSale/008dadian.png'),
			grayDot = require('../res/afterSale/008xiaodian.png');
		let view = null;
		switch (data.stat) {
			case '0':
				view = <View style={{ height: 95, backgroundColor: '#fff' }}>
					<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
						<Image style={{ height: 12, width: 12 }} source={blueDot} />
						<View style={{ height: 1, width: 56, backgroundColor: '#BCC5D7' }}></View>
						<Image style={{ height: 12, width: 12 }} source={grayDot} />
						<View style={{ height: 1, width: 68, backgroundColor: '#BCC5D7' }}></View>
						<Image style={{ height: 12, width: 12 }} source={grayDot} />
						<View style={{ height: 1, width: 81, backgroundColor: '#BCC5D7' }}></View>
						<Image style={{ height: 12, width: 12 }} source={grayDot} />
					</View>
					<View style={{
						flexDirection: 'row', alignItems: 'center',
						justifyContent: 'space-between', marginHorizontal: (global.SCREENWIDTH - 247) / 4,
						marginTop: 20,
					}}>
						<Text style={{ color: '#1B82D8', fontSize: 12 }}>提交申请</Text>
						<Text style={{ color: '#53606A', fontSize: 12 }}>商家审核</Text>
						<Text style={{ color: '#53606A', fontSize: 12 }}>等待商家收货</Text>
						<Text style={{ color: '#53606A', fontSize: 12 }}>验货入库/完成</Text>
					</View>
				</View>
				break;
			case '1':
				view = <View style={{ height: 95, backgroundColor: '#fff' }}>
					<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
						<Image style={{ height: 12, width: 12 }} source={blueDot} />
						<View style={{ height: 1, width: 56, backgroundColor: '#0082FF' }}></View>
						<Image style={{ height: 12, width: 12 }} source={blueDot} />
						<View style={{ height: 1, width: 68, backgroundColor: '#BCC5D7' }}></View>
						<Image style={{ height: 12, width: 12 }} source={grayDot} />
						<View style={{ height: 1, width: 81, backgroundColor: '#BCC5D7' }}></View>
						<Image style={{ height: 12, width: 12 }} source={grayDot} />
					</View>
					<View style={{
						flexDirection: 'row', alignItems: 'center',
						justifyContent: 'space-between', marginHorizontal: (global.SCREENWIDTH - 247) / 4,
						marginTop: 20,
					}}>
						<Text style={{ color: '#1B82D8', fontSize: 12 }}>提交申请</Text>
						<Text style={{ color: '#1B82D8', fontSize: 12 }}>商家审核</Text>
						<Text style={{ color: '#53606A', fontSize: 12 }}>等待商家收货</Text>
						<Text style={{ color: '#53606A', fontSize: 12 }}>验货入库/完成</Text>
					</View>
				</View>
				break;
			case '2':
				view = <View style={{ height: 95, backgroundColor: '#fff' }}>
					<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
						<Image style={{ height: 12, width: 12 }} source={blueDot} />
						<View style={{ height: 1, width: 56, backgroundColor: '#0082FF' }}></View>
						<Image style={{ height: 12, width: 12 }} source={blueDot} />
						<View style={{ height: 1, width: 68, backgroundColor: '#0082FF' }}></View>
						<Image style={{ height: 12, width: 12 }} source={blueDot} />
						<View style={{ height: 1, width: 81, backgroundColor: '#0082FF' }}></View>
						<Image style={{ height: 12, width: 12 }} source={blueDot} />
					</View>
					<View style={{
						flexDirection: 'row', alignItems: 'center',
						justifyContent: 'space-between', marginHorizontal: (global.SCREENWIDTH - 247) / 4,
						marginTop: 20,
					}}>
						<Text style={{ color: '#1B82D8', fontSize: 12 }}>提交申请</Text>
						<Text style={{ color: '#1B82D8', fontSize: 12 }}>商家审核</Text>
						<Text style={{ color: '#1B82D8', fontSize: 12 }}>等待商家收货</Text>
						<Text style={{ color: '#1B82D8', fontSize: 12 }}>验货入库/完成</Text>
					</View>
				</View>
				break;
			case '3':
				break;
			case '4':
				view = <View style={{ height: 95, backgroundColor: '#fff' }}>
					<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
						<Image style={{ height: 12, width: 12 }} source={blueDot} />
						<View style={{ height: 1, width: 56, backgroundColor: '#0082FF' }}></View>
						<Image style={{ height: 12, width: 12 }} source={blueDot} />
						<View style={{ height: 1, width: 68, backgroundColor: '#0082FF' }}></View>
						<Image style={{ height: 12, width: 12 }} source={blueDot} />
						<View style={{ height: 1, width: 81, backgroundColor: '#BCC5D7' }}></View>
						<Image style={{ height: 12, width: 12 }} source={grayDot} />
					</View>
					<View style={{
						flexDirection: 'row', alignItems: 'center',
						justifyContent: 'space-between', marginHorizontal: (global.SCREENWIDTH - 247) / 4,
						marginTop: 20,
					}}>
						<Text style={{ color: '#1B82D8', fontSize: 12 }}>提交申请</Text>
						<Text style={{ color: '#1B82D8', fontSize: 12 }}>商家审核</Text>
						<Text style={{ color: '#1B82D8', fontSize: 12 }}>等待商家收货</Text>
						<Text style={{ color: '#53606A', fontSize: 12 }}>验货入库/完成</Text>
					</View>
				</View>
				break;
		}

		return view;
	}

	//填写物流信息
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
							this.logisticsModal && this.logisticsModal.hide()
						}}
						>
						<Text style={{ color: '#007AFF', fontSize: 16 }}>取消</Text>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={0.5}
						style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
						onPress={() => {
							this.onClickLogisticsConfirm();
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
			<TouchableOpacity
				onPress={() => {

				} }
				>
				<View style={{ paddingLeft: 10, paddingRight: 15, height: 44, justifyContent: 'center' }}>
					<Image style={{ width: 16, height: 3 }} source={require('../../product/res/images/ProductList/000dian.png')} />
				</View>
			</TouchableOpacity>
		)
	}

	render() {
		const blueDot = require('../res/afterSale/008dadian.png'),
			grayDot = require('../res/afterSale/008xiaodian.png');
		let detailData = this.state.productDetailData;
		return (
			<View style={{ flex: 1 }}>
				<BaseView
					mainColor={'#fafafa'}
					navigator={this.props.navigator}
					title={{ title: '退货详情', tintColor: '#333333' }}
					titlePosition={"center"}
					rightButton={this._renderRightButton()}
					statusBarStyle={'default'}
					>
					<DataController
						data={this.state.productDetailData}
						>
						<ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
							<View style={{ backgroundColor: '#FFF3CB', height: 85, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
								<Image style={{ height: 23, width: 33 }} source={require('../res/afterSale/008qiche.png')} />
								<Text style={{ fontSize: 19, color: '#FF9C3A', marginLeft: 5 }}>{detailData && detailData.statStr}</Text>
							</View>

							{/*退货流程进度*/}
							{detailData && this.renderProgress(detailData)}

							<View style={{ backgroundColor: '#fff', marginTop: 10 }}>
								<View style={{ height: 45, alignItems: 'center', flexDirection: 'row', paddingHorizontal: 13 }}>
									<Text numberOfLines={1} style={{ fontSize: 13, color: '#4F5665', flex: 1 }}>订单编号：{detailData && detailData.orderNum}</Text>
								</View>
								<View>
									{
										detailData && detailData.items && _.map(detailData.items, (item, index, arr) => {
											return (
												<View key={index} style={{ backgroundColor: '#fafafa', paddingHorizontal: 13, marginTop: index == 0 ? 0 : 5 ,paddingBottom:17}}>
													<View style={{ marginTop: 15 }}>
														<Text style={{ fontSize: 13, color: '#333333' }}>{item.productNm}</Text>
													</View>
													<View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
														<Text numberOfLines={1} style={{ fontSize: 12, color: '#8495A2', flex: 1 }}>规格：{item.specNm}</Text>
														<Text style={{ fontSize: 12, color: '#8495A2' }}>￥{item.unitPrice.toFixed(2)}</Text>
													</View>
													<View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
														<Text numberOfLines={1} style={{ fontSize: 12, color: '#8495A2', flex: 1 }}>厂家：{item.factory}</Text>
														<Text style={{ fontSize: 12, color: '#8495A2' }}>X{item.returnedQuantity}</Text>
													</View>
													<View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
														<Text numberOfLines={1} style={{ fontSize: 12, color: '#8495A2', flex: 1 }}>批号：{item.batchNum}</Text>
													</View>
												</View>
											)
										})
									}
								</View>
								<View style={{ height: 48, justifyContent: 'center', paddingHorizontal: 13}}>
									<Text style={{ fontSize: 13, color: '#333333', textAlign:'right'}}>{detailData && detailData.stat=='0'?'预计退款金额':'退款金额'}:{detailData && detailData.orderTotalAmount.toFixed(2)}</Text>
								</View>
							</View>

							{
								detailData && detailData.photoFileUrls ?
									<View style={{ backgroundColor: '#fff', paddingHorizontal: 8, marginBottom: 10, flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 8 }}>
										{
											detailData.photoFileUrls.map((item, index) => {
												return (
													<View
														key={'imgge' + index}
														style={{
															width: 61, height: 61, borderRadius: 4,
															justifyContent: 'center', alignItems: 'center',
															borderColor: '#DDDDDD', borderWidth: 1,
															marginVertical: 8, marginHorizontal: 8,
														}}
														>
														<Image style={{ width: 60, height: 60 }} source={imageUtil.get(item)} />
													</View>
												)
											})
										}
									</View>
									: null
							}


							<View style={{ marginBottom: 15, paddingHorizontal: 13, backgroundColor: '#fff' }}>
								<View style={{ flexDirection: 'row', marginTop: 9 }}>
									<Text style={{ color: '#333333', fontSize: 13 }}>下单时间</Text>
									<Text style={{ flex: 1, textAlign: 'right', color: '#333333', fontSize: 13 }}>{detailData && detailData.orderCreateTimeStr}</Text>
								</View>
								<View style={{ flexDirection: 'row', marginTop: 9,  }}>
									<Text style={{ color: '#333333', fontSize: 13 }}>申请时间</Text>
									<Text style={{ flex: 1, textAlign: 'right', color: '#333333', fontSize: 13 }}>{detailData && detailData.returnCreateTimeStr}</Text>
								</View>
								<View style={{ flexDirection: 'row', marginTop: 9,  }}>
									<Text style={{ color: '#333333', fontSize: 13 }}>采购负责人</Text>
									<Text style={{ flex: 1, textAlign: 'right', color: '#333333', fontSize: 13 }}>{detailData && detailData.buyManagerNm}  {detailData&&detailData.buyManagerMobile}</Text>
								</View>
								<View style={{ flexDirection: 'row', marginTop: 9, marginBottom: 10 }}>
									<Text style={{ color: '#333333', fontSize: 13,paddingRight:50 }}>退回地址</Text>
									<Text style={{ flex: 1, textAlign: 'right', color: '#333333', fontSize: 13 }}>{detailData && detailData.shopShipperAddr&& detailData.shopShipperAddr.addressPath}</Text>
								</View>
							</View>
						</ScrollView>
						<View style={{flexDirection:'row',justifyContent:'flex-end'}}>
							{/*填写物流*/}
						{
							detailData && detailData.stat == '1' ?
								<View style={{
									height: 60, backgroundColor: '#fff', paddingHorizontal: 0,
									justifyContent: 'center', alignItems: 'flex-end',
									borderTopColor: '#e5e5e5', borderTopWidth: StyleSheet.hairlineWidth
								}}>
									<TouchableOpacity
										activeOpacity={0.6}
										style={{
											paddingHorizontal: 9, paddingVertical: 5,
											borderColor: '#0082FF', borderRadius: 2,
											borderWidth: StyleSheet.hairlineWidth
										}}
										onPress={() => {
											this.onClickWriteLogistics()
										} }
										>
										<Text style={{ color: '#0082FF', fontSize: 13 }}>{detailData.logisticsOrderCode == null || detailData.logisticsCompany == null ? '修改物流信息' : '填写物流信息'}</Text>
									</TouchableOpacity>
								</View>
								: null
						}
						{/*取消申请*/}
						{
							detailData && detailData.statStr !== '已取消'&& detailData.statStr !== '已完成' ?
								<View style={{
									height: 60, backgroundColor: '#fff', paddingHorizontal: 13,
									justifyContent: 'center', alignItems: 'flex-end',
									borderTopColor: '#e5e5e5', borderTopWidth: StyleSheet.hairlineWidth
								}}>
									<TouchableOpacity
										activeOpacity={0.6}
										style={{
											paddingHorizontal: 9, paddingVertical: 5,
											borderColor: '#0082FF', borderRadius: 2,
											borderWidth: StyleSheet.hairlineWidth
										}}
										onPress={() => {
											this.onClickCancelApply()
										} }
										>
										<Text style={{ color: '#0082FF', fontSize: 13 }}>取消申请</Text>
									</TouchableOpacity>
								</View>
								: null
						}
						</View>
					</DataController>

				</BaseView>
				<FlexModal
					ref={(e) => { this.logisticsModal = e } }
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
})
