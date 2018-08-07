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
	LayoutAnimation,
	UIManager
} from 'react-native';

import {
	RefreshableListView,
	BaseView,
	Toast,
	FlexModal,
	TextInputC,
	DataController,
	NumberInput
} from 'future/public/widgets';

import {
	Fetch,
	imageUtil,
	ValidateUtil,
} from 'future/public/lib';
import ReturnProductOrder from './ReturnProductOrder';
import MoreOperation from '../../commons/moreOperation/components/MoreOperation';

export default class ChooseReturnProduct extends Component {
	constructor(props) {
		super(props);
		this.state = {
			productData: [],
			type: this.props.params.type,			//'order','packege'
			data: this.props.params.data,			//前一个组件传过来的data
			allSelect: false,
		}
	}
	componentWillMount() {
		InteractionManager.runAfterInteractions(() => {
			this.open();
		});
		UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
	}
	componentDidMount() {
	}
	componentWillUnmount() {
	}

	open() {
		let url = '', data = {};
		if (this.state.type == 'order') {
			url = '/app/returnOrder/listCanReturnOrderItemsByOrderId.json';
			data.orderId = this.state.data.orderId;
		}
		if (this.state.type == 'packge') {
			url = '/app/returnOrder/listCanReturnOrderItemsByPackageId.json';
			// data.packageId = this.state.data.packageId;
		}
		new Fetch({
			url: url,
			// method: 'POST',
			data: data
		}).dofetch().then((data) => {
			let product = [];
			if (data.result) {
				product = data.result.slice(0);
				product.forEach((item, index) => {
					item.hasSelected = false;
					item.selectNumber = 1;
				})
			}
			this.setState({ productData: product });
		}).catch((e) => {
			error && error();
			console.log('=====>错误 CATCH>>', e);
		});
	}

	//单个商品选择事件
	onClickSelect(item, index) {
		LayoutAnimation.easeInEaseOut();
		let temp = this.state.productData.slice(0), allSelectFlag = true;
		temp[index].hasSelected = !temp[index].hasSelected;
		temp.forEach((item, index) => {
			if (item.hasSelected == false) {
				allSelectFlag = false;
			}
		})
		if (this.state.allSelect != allSelectFlag) {
			this.setState({ allSelect: allSelectFlag });
		}
		this.setState({ productData: temp });
	}

	//选所有退货商品
	onClickSelectAll() {
		let temp = this.state.productData.slice(0);
		this.state.productData.forEach((item, index) => {
			if (item.hasSelected == this.state.allSelect) {
				temp[index].hasSelected = !this.state.allSelect;
			}
		})
		this.setState({ productData: temp, allSelect: !this.state.allSelect });
	}

	onClickConfirm() {
		let totalSelected = 0, totalSelectedNum = 0, selectedData = [];
		this.state.productData.forEach((item, index) => {
			if (item.hasSelected == true) {
				totalSelected++;
				totalSelectedNum = totalSelectedNum + item.selectNumber;
				selectedData.push(item);
			}
		})
		if (totalSelected == 0) {
			return Toast.show('请先选择退货商品');
		}

		this.props.navigator.push({
			component: ReturnProductOrder,
			params: {
				selectedProduct: selectedData,
				orderData: this.state.data,
				callback: () => {
					this.props.params && this.props.params.callback && this.props.params.callback();
				}
			}
		})
	}

	//选择数量	
	onClickChangeNum(item, index, value) {
		let temp = this.state.productData.slice(0);
		temp[index].selectNumber = value;
		this.setState({ productData: temp });
	}

	//获取品种和件数
	getProductSelected() {
		let totalSelected = 0, totalSelectedNum = 0, returnData = []
		this.state.productData.forEach((item, index) => {
			if (item.hasSelected == true) {
				totalSelected++;
				totalSelectedNum = totalSelectedNum + item.selectNumber;
			}
		})
		returnData[0] = totalSelected;
		returnData[1] = totalSelectedNum;
		return returnData;
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
						}, {
							module: 'mine',
						}]
					}
					/>
			</View>
		)
	}

	render() {
		const selectImg = require('../res/afterSale/000yigouxuan.png'),
			unSelectImg = require('../res/afterSale/006weigouxuan.png');
		let total = this.getProductSelected();
		return (
			<BaseView
				mainColor={'#fafafa'}
				navigator={this.props.navigator}
				title={{ title: '选择退货商品', tintColor: '#333333' }}
				titlePosition={"center"}
				rightButton={this._renderRightButton()}
				statusBarStyle={'default'}
				>
				<DataController
					data={this.state.productData}
					>
					<ScrollView
						style={{ backgroundColor: '#f5f5f5' }}
						>
						{
							this.state.productData && this.state.productData.map((item, index) => {
								return (
									<View
										key={index}
										style={{ marginBottom: 10 }}
										>
										<View
											style={{ flexDirection: 'row', alignItems: 'center', height: 116, backgroundColor: '#fff', }}
											>
											<TouchableOpacity
												activeOpacity={1}
												style={{ paddingHorizontal: 15, paddingVertical: 20, }}
												onPress={() => {
													this.onClickSelect(item, index);
												} }
												>
												<Image
													source={item.hasSelected ? selectImg : unSelectImg}
													style={{ width: 19, height: 19, }}
													/>
											</TouchableOpacity>

											<View style={{ flex: 1, paddingRight: 12, }}>
												<View style={{ marginTop: 15 }}>
													<Text style={{ fontSize: 14, color: '#333333' }}>{item.productNm}</Text>
												</View>
												<View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
													<Text numberOfLines={1} style={{ fontSize: 12, color: '#8495A2', flex: 1 }}>规格：{item.specNm}</Text>
													<Text style={{ fontSize: 12, color: '#8495A2' }}>￥{Number.parseInt(item.unitPrice).toFixed(2)}</Text>
												</View>
												<View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
													<Text numberOfLines={1} style={{ fontSize: 12, color: '#8495A2', flex: 1 }}>厂家：{item.factory}</Text>
													<Text style={{ fontSize: 12, color: '#8495A2' }}>x{item.canReturnQuantity}</Text>
												</View>
												<View style={{ marginTop: 10, marginBottom: 15, flexDirection: 'row', alignItems: 'center' }}>
													<Text numberOfLines={1} style={{ fontSize: 12, color: '#8495A2', flex: 1 }}>批号：{item.batchNum}</Text>
												</View>
											</View>
										</View>
										{
											item.hasSelected ?
												<View style={{ backgroundColor: '#fff' }}>
													<View style={{
														backgroundColor: '#F8F8F8',
														height: 60, width: global.SCREENWIDTH - 55,
														marginLeft: 42, marginVertical: 15,
														flexDirection: 'row', alignItems: 'center'
													}}>
														<Text numberOfLines={1} style={{ fontSize: 12, color: '#333333', flex: 1, marginLeft: 15 }}>最多可退{item.canReturnQuantity}件</Text>
														<NumberInput
															style={{ marginRight: 15, borderRadius: 2, borderColor: "#999", borderWidth: StyleSheet.hairlineWidth }}
															inputWrapStyle={{ borderLeftColor: "#999", borderLeftWidth: StyleSheet.hairlineWidth, borderRightColor: "#999", borderRightWidth: StyleSheet.hairlineWidth }}
															min={1}
															max={item.canReturnQuantity}
															value={item.selectNumber}
															onChange={(value) => {
																this.onClickChangeNum(item, index, value);
															} }
															/>
													</View>
												</View>
												: null
										}
									</View>
								)
							})
						}
					</ScrollView>
					<View style={{ height: 50, flexDirection: 'row', alignItems: 'center', }}>
						<TouchableOpacity
							activeOpacity={1}
							style={{ paddingHorizontal: 15, }}
							onPress={() => {
								this.onClickSelectAll()
							} }
							>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Image
									source={this.state.allSelect ? selectImg : unSelectImg}
									style={{ width: 19, height: 19, marginRight: 7, }}
									/>
								<Text style={{ fontSize: 14, color: '#333', }}>全选</Text>
							</View>
						</TouchableOpacity>
						<Text style={{ flex: 1, fontSize: 13, color: '#333', textAlign: 'right', paddingRight: 10, }}>
							共<Text style={{ color: '#FF6600', }}> {total[0]} </Text>个品种<Text style={{ color: '#FF6600', }}> {total[1]} </Text>件
						</Text>
						<TouchableOpacity
							activeOpacity={0.7}
							style={{ alignItems: 'center', justifyContent: 'center', height: 50, backgroundColor: '#34457D', paddingHorizontal: 16, }}
							onPress={() => {
								this.onClickConfirm()
							} }
							>
							<Text style={{ fontSize: 16, color: '#fff', }}>填写退货单</Text>
						</TouchableOpacity>
					</View>
				</DataController>
			</BaseView>
		)
	}
}
const styles = StyleSheet.create({
})
