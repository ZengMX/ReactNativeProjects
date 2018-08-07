import React, {Component} from 'react';
import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	PixelRatio,
	TouchableOpacity,
	ListView,
	Image,
	Platform,
	Modal,
	TextInput,
	InteractionManager,
	ScrollView,
	Keyboard, StatusBar
} from 'react-native';
import _ from 'underscore';
import KeyboardSpacer from 'react-native-keyboard-spacer';
var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;

import Fetch from '../../../public/lib/Fetch';
import ValidateUtil from '../../../public/lib/ValidateUtil';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import {sizeToFit} from "../../../public/widgets/line/sizeToFix";
import {
	NavBar,
	BaseView,
	RefreshableListView,
	Toast,
	MaskModal,
	DataController,
	Loading
} from "../../../public/widgets/index";
import Line from "../../../public/widgets/line/Line";

// 全局的变量
var cols = 3;
var cellW = 75;
var cellH = 75;
var vMargin = (screenWidth - cellW * cols) / (cols + 1);

class PlanList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			templateNm: '',
		};
	}
	
	render() {
		return (
			<ScrollView showsVerticalScrollIndicator={false} style={{flex: 1, flexWrap: 'wrap', width: screenWidth}}>
				<View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', width: screenWidth}}>
					{
						_.map(this.props.templates, (item, index) => {
							return (
								<TouchableOpacity key={index} style={{width: 75, height: 75, marginTop: 10, marginLeft: vMargin}}
								                  onPress={() => {
									                  this.props.setTemplateNmAndPurchaseTemplateId(item.templateNm, item.purchaseTemplateId);
									                  this.setState({templateNm: item.templateNm});
								                  } }>
									<Image
										source={item.templateNm == this.state.templateNm ? require('../res/images/003jihua_s.png') : require('../res/images/003jihua.png')}
										style={{width: 75, height: 75}}>
										<Text style={{
											marginTop: 58,
											fontSize: 12,
											color: '#fff',
											textAlign: 'center',
											backgroundColor: 'transparent'
										}} numberOfLines={1}>{item.templateNm}</Text>
									</Image>
								</TouchableOpacity>
							);
						})
					}
					<TouchableOpacity style={{width: 75, height: 75, marginTop: 10, marginLeft: vMargin}} onPress={() => {
						this.props.showModal()
					} }>
						<Image source={require('../res/images/010xinjianjihua.png')} style={{width: 75, height: 75}}>
							<Text style={{
								marginTop: 55,
								fontSize: 12,
								color: '#aaa',
								textAlign: 'center',
								backgroundColor: 'transparent',
							}}>新建计划</Text>
						</Image>
					</TouchableOpacity>
				</View>
			</ScrollView>
		)
	}
}


export default class ShoppingPlan extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			templates: [],
			templateNm: "",
			purchaseTemplateId: undefined,
			newTemplateNm: null,
			
			showDataController: null,	//是否显示datDataController：null（显示）、"1"（隐藏）
		}
	}
	
	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.fetchData();
		});
		
	}
	
	setTemplateNmAndPurchaseTemplateId(templateNm, purchaseTemplateId) {
		this.setState({
			templateNm: templateNm,
			purchaseTemplateId: purchaseTemplateId
		})
	}
	
	fetchData() {
		new Fetch({
			url: '/app/fastBuy/purchaseTemplateList.json',
			method: 'POST',
		}).dofetch().then((data) => {
			let arr = data != null ? data.result : [];
			// if (arr != null && arr.length > 0) {
			this.setState({
				templates: arr
			});
			// }
		}).catch((error) => {
			console.log('=> catch: ', error);
		}).finally(() => {
			this.setState({
				showDataController: '1'
			});
		});
	}
	
	addToPlan() {
		if (!this.state.templateNm) {
			Toast.show("请先选择计划");
			return;
		}
		Loading.show();
		new Fetch({
			url: '/app/fastBuy/addPurchaseTemplateItems.json',
			method: 'POST',
			bodyType: 'json',
			data: {
				purchaseTemplateId: this.state.purchaseTemplateId,
				skuIds:this.props.params.skuIds,
				nums:this.returnObjectIdQuantityArray(this.props.params.skuIds,this.props.params.prdNums)
			},
		}).dofetch().then((data) => {
			Toast.show("加入计划成功");
			this.props.navigator.pop();
		}).catch((error) => {
			console.log('=> catch: ', error);
		}).finally(() => {
			Loading.hide();
		})
		
	}
	
	newPlan() {
		if (ValidateUtil.isNull(this.state.newTemplateNm)) {
			this.refs.addPurchaseModal.toast("请先输入计划名称");
			return;
		}
		this.refs.addPurchaseModal.showLoading();
		new Fetch({
			url: "app/fastBuy/createPurchaseTemplate.json",
			method: 'POST',
			data: {
				templateNm: this.state.newTemplateNm,
			},
			bodyType: 'json',
			forbidToast: true
		}).dofetch().then((data) => {
			if (data.success === true) {
				this.fetchData();
			}
			this.refs.addPurchaseModal && this.refs.addPurchaseModal.hideLoading();
			this.refs.addPurchaseModal && this.refs.addPurchaseModal.hide();
		}).catch((err) => {
			let toastContent = "";
			if (err.name === "Error") {
				if (err.message === "timeout") {
					toastContent = "网络连接超时";
				}
				if (err.message === "noNetwork") {
					toastContent = "网络连接异常，请检查网络设置";
				}
			} else if (err && err.object) {
				toastContent = err.object.errorText;
			}
			this.refs.addPurchaseModal.toast(toastContent);
			// Toast.show(toastContent);
		}).finally(() => {
			this.refs.addPurchaseModal && this.refs.addPurchaseModal.hideLoading();
		})
	}
	
	/**
	 * 组装objectIdQuantityArray参数，形式：skuId + "-" + buyNum + "," + ...
	 */
	returnObjectIdQuantityArray(skuIdArr, buyNumArr) {
		let objectIdQuantityArray = [];
		for (let i = 0; i < skuIdArr.length; i++) {
			objectIdQuantityArray.push(skuIdArr[i] + "_" + buyNumArr[i]);
		}
		return objectIdQuantityArray;
	}
	
	render() {
		return (
			<BaseView
				mainBackColor={{flex: 1, backgroundColor: '#f5f5f5'}}
				ref='baseview'
				title={{title: '加入采购计划', fontSize: 18, tintColor: '#333333'}}
				navigator={this.props.navigator}
				reload={() => this.fetchData()}
				statusBarStyle="default"
			>
				<Line/>
				<DataController data={this.state.showDataController}>
					<PlanList ref='PlanList' style={{flex: 1}}
					          setTemplateNmAndPurchaseTemplateId={(templateNm, purchaseTemplateId) => {
						          this.setTemplateNmAndPurchaseTemplateId(templateNm, purchaseTemplateId)
					          } }
					          showModal={() => {
						          this.refs.addPurchaseModal.show()
					          } }
					          templates={this.state.templates}
					/>
					<View
						style={{
							borderTopWidth: 1 / PixelRatio.get(),
							borderTopColor: '#e5e5e5',
							height: 90,
						}}>
						<Text style={{
							lineHeight: 30,
							height: 30,
							textAlign: 'center',
							color: '#333',
							fontSize: 13
						}}>{this.state.templateNm}</Text>
						<TouchableOpacity underlayColor='#eee' style={{
							margin: 15,
							marginTop: 4,
							width: (sizeToFit(320) - 30),
							backgroundColor: "#34457D",
							height: sizeToFit(45),
							justifyContent: 'center',
							alignItems: 'center'
						}}
						                  onPress={() => {
							                  Keyboard.dismiss();
							                  this.addToPlan()
						                  }}>
							<Text style={{color: "#fff", fontSize: 15}}>确定</Text>
						</TouchableOpacity>
					</View>
				</DataController>
				
				<MaskModal
					ref="addPurchaseModal"
					viewType="full"
					contentView={
						<View>
							<View style={{
								width: 260,
								height: 160,
								backgroundColor: '#fff',
								borderRadius: 10,
								justifyContent: 'center',
								alignSelf: 'center',
								marginTop: 44
							}}>
								<Text style={{fontSize: 14, textAlign: 'center', color: 'rgb(102,102,102)'}}>新建采购计划</Text>
								<TextInput maxLength={124} ref='textinput' placeholder='请输入采购计划名称' style={{
									width: 240,
									height: 33,
									marginHorizontal: 10,
									fontSize: 14,
									padding: 5,
									borderColor: '#ccc',
									borderWidth: 1 / PixelRatio.get(),
									margin: 20
								}}
								           clearButtonMode='while-editing' autoFocus={true} autoCapitalize='none'
								           onChangeText={(newTemplateNm) => {
									           this.setState({newTemplateNm})
								           }}
								/>
								<TouchableOpacity activeOpacity={0.5} onPress={() => {
									this.newPlan()
								}}>
									<View style={{
										justifyContent: 'center',
										alignItems: "center",
										marginHorizontal: 10,
										width: 240,
										height: 40,
										borderRadius: 5,
										backgroundColor: '#34457D'
									}}>
										<Text style={{backgroundColor: 'transparent', color: '#fff'}}>
											确定
										</Text>
									</View>
								</TouchableOpacity>
								
								<TouchableOpacity
									activeOpacity={0.5}
									onPress={() => {
										this.refs.addPurchaseModal.hide()
									}}
									style={{position: 'absolute', width: 16, height: 16, top: 11, right: 14, alignSelf: 'flex-end'}}
								>
									<Image
										source={require('../res/images/004guanbi.png')}
										style={{width: 16, height: 16}}
										resizeMode='contain'/>
								</TouchableOpacity>
							</View>
							<KeyboardSpacer/>
						</View>
					}>
					></MaskModal>
			</BaseView>
		)
	}
	
}


