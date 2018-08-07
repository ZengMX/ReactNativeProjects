import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	PixelRatio,
	Dimensions,
	TextInput,
	Image,
	InteractionManager
} from 'react-native';
import {
	BaseView,
	Arrow,
	Separator,
	Toast,
	TextInputC
} from 'future/public/widgets';
import styles from '../styles/BaseInfor';
import Fetch from 'future/public/lib/Fetch';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as actions from "../actions/Member";
import StorageUtils from 'future/public/lib/StorageUtils';
var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;
import ValidateUtil from 'future/public/lib/ValidateUtil';;
import Fillinfor from 'future/src/member/components/Fillinfor';
import dismissKeyboard from 'dismissKeyboard';

class ManageType extends Component {
	constructor(props) {
		super(props);
		//经营范围
		this.map = new Map();
		this.state = {
			renderSelect: false,//让界面刷新
		}
		this.defaultSelectBorder = { borderColor: '#8E9399' };
		this.defaultSelectText = { color: '#444' };
	}
	componentDidMount() {
		this._initData();
	}
	_initData() {
		let beforeBusinessRanges = this.props.params.beforeBusinessRanges;
		console.log('beforeBusinessRanges', beforeBusinessRanges);
		if (beforeBusinessRanges) {
			beforeBusinessRanges.map((item, index) => {
				let itemIndex = item.businessRangeId;
				this.map.set(itemIndex, item);
			})
			console.log('this.map', this.map);
			this.setState({
				renderSelect: !this.state.renderSelect
			});
		}
	}
	_reSet() {
		this.map.clear();
		this.setState({
			renderSelect: !this.state.renderSelect
		});
	}

	_onSelectItem(selectItem) {
		let index = selectItem.businessRangeId;
		let select = this.map.get(index);
		if (select == undefined) {
			this.map.set(index, selectItem);
		} else {
			this.map.delete(index);
		}
		this.setState({
			renderSelect: !this.state.renderSelect
		});
	}
	//经营范围确认
	_comfirm() {
		let data = {};
		if (this.map.size > 0) {
			let tempId = '';
			let tempName = '';
			let backData = [];
			this.map.forEach((value, key, map) => {
				let item = map.get(key);
				backData.push(item);
				tempId = tempId + item.businessRangeId + ',';
				tempName = tempName + item.name + '、';
			});
			let businessRanges = tempId.substring(0, tempId.length - 1);
			data.businessRanges = businessRanges;
			data.businessRangesName = tempName;
			data.backData = backData;
			this.props.params.callback(data);
		}else{
			data.businessRanges = '';
			data.isreSet = true;
			data.businessRangesName = '';
			data.backData = '';
			this.props.params.callback(data);
		}
		if (this.props.navigator) {
			this.props.navigator.pop()
		}
	}

	render() {
		let data = this.props.params.data;
		return (
			<BaseView
				mainBackColor={{ backgroundColor: '#f5f5f5' }}
				ref={'base'}
				navigator={this.props.navigator}
				mainColor={'#f9f9f9'}
				title={{ title: '经营范围', tintColor: '#333', style: { fontSize: 18, fontWeight: 'normal' } }}
				statusBarStyle={'default'}
				leftButton={
					<TouchableOpacity style={{ alignSelf: 'center', }} onPress={() => { this.props.navigator.pop() }}>
						<Text style={{ marginLeft: 13, fontSize: 16, color: '#444' }}>关闭</Text>
					</TouchableOpacity>
				}
				rightButton={
					<TouchableOpacity style={{ alignSelf: 'center', }} onPress={() => { this._reSet() }}>
						<Text style={{ marginRight: 13, fontSize: 16, color: '#444' }}>重置</Text>
					</TouchableOpacity>
				}
			>
				<ScrollView >
					{data && data.map((item, index) => {
						return (
							<View style={{ paddingHorizontal: 0 }} key={index}>
								<Text style={{ marginTop: 20, marginBottom: 5, marginLeft: 15 }}>{item.businessCategoryCode}</Text>
								<View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10 }}>
									{item.businessRangeVoList && item.businessRangeVoList.map((mapItem, selectIndex) => {
										let select = this.map.get(mapItem.businessRangeId);
										console.log('this.map select', select);
										if (select && select.businessRangeId && select.businessRangeId == mapItem.businessRangeId) {
											//选中的
											console.log('this.map select 选中的', select)
											this.defaultSelectBorder = { borderColor: '#0082FF' };
											this.defaultSelectText = { color: '#0082FF' };
										} else {
											//没选中的
											this.defaultSelectBorder = { borderColor: '#8E9399' };
											this.defaultSelectText = { color: '#444' };
										}
										return (
											<TouchableOpacity style={[styles.select, this.defaultSelectBorder]} key={selectIndex} onPress={() => { this._onSelectItem(mapItem) }}>
												<Text style={[{ fontSize: 12 }, this.defaultSelectText]}>{mapItem.name}</Text>
											</TouchableOpacity>
										)
									})}
								</View>
							</View>
						)
					})}
				</ScrollView>
				<View style={{ alignItems: 'stretch', height: 65, backgroundColor: '#fff', paddingHorizontal: 13, paddingVertical: 10 }}>
					<TouchableOpacity
						style={{
							flex: 1,
							backgroundColor: '#34457D',
							justifyContent: 'center',
							alignItems: 'center'
						}}
						onPress={() => { this._comfirm() }}>
						<Text style={{ fontSize: 16, color: '#fcfcfc' }}>确认</Text>
					</TouchableOpacity>
				</View>
			</BaseView>
		)
	}
}

class BaseInfor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			customerType: undefined,
			unitNm: '',//单位名称、公司名称
			customerTypeId: '',//客户类型
			customerTypeNm: '',//客户类型名称（数据回显用）
			businessRanges: '',//经营范围
			businessRangesName: '',
			nextPagebusinessRangesName: '',//选择后传到下一页
			checkIndex:null
		}
		this.beforeDatas = null;
		this.businessRangesData = null;
		this.beforeBusinessRanges = null;
	}
	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this._fetchCustomerType();
			this._fetchBusinessRanges();
			this.props.actions.getUser().then(() => {
				this._fetchBeforeData();
			});
		})
	}
	_fetchCustomerType() {
		new Fetch({
			url: '/app/user/findCustomerTypeList.json',
		}).dofetch().then((data) => {
			this.setState({ customerType: data.result })
		}).catch((err) => {
			console.log('=> catch: ', err);
		});
	}
	_fetchBusinessRanges() {
		new Fetch({
			url: "app/user/findBusinessRangeList.json",
		}).dofetch().then(data => {
			this.businessRangesData = data.result;
		}).catch(error => {
			console.info("error", error);
		});
	}
	_fetchBeforeData() {
		new Fetch({
			url: 'app/user/findRegisterDetail.json',
			method: 'POST',
			data: {
				buyersId: this.props.userInfo.buyersId,
			}
		}).dofetch().then((data) => {//this.props.params.loginId 
			console.log('findRegisterDetail data', data);
			this.beforeDatas = data.result;
			this._initData(data.result);
		}).catch((error) => { console.info('完善信息失败', error) });
	}
	_initData(data) {
		if (data && data.appRegisterDetailOneVo) {
			let res = data.appRegisterDetailOneVo;
			if (res && res.businessRanges != null) {
				let busTemp = res.businessRanges.split(",");
				let allData = [];
				let businessRangesName = '';
				if (res.businessRangesList) {
					let data = {};
					res.businessRangesList.map((item, index) => {
						data.name = item;
						businessRangesName = businessRangesName + item + "、";
						data.businessRangeId = parseInt(busTemp[index]);
						allData.push(data);
						data = {};
					})
				}
				if (businessRangesName != '') {
					businessRangesName = businessRangesName.substring(0, businessRangesName.length - 1);
				}
				this.beforeBusinessRanges = allData;
				this.setState({
					unitNm: res.unitNm,
					customerTypeNm: res.customerTypeNm,
					customerTypeId: res.customerTypeId,
					businessRanges: res.businessRanges,
					businessRangesName: businessRangesName
				});
			}
		}
	}
	renderModalScence() {
		let data = this.state.customerType;
		return (
			<View style={{ position: 'absolute', width: screenWidth, height: 400, bottom: 0, backgroundColor: '#fff', flexDirection: 'column' }}>
				<View style={{ paddingHorizontal: 13, paddingVertical: 10, marginTop: 10 }}>
					<Text style={{ fontSize: 15, color: '#333' }}>客户类型</Text>
				</View>
				<ScrollView >
					{data && data.map((item, i) => {
						return (
							<TouchableOpacity key={i} style={{ paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
								onPress={() => {
									this.setState({
										customerType: Object.assign([], data),
										customerTypeNm: item.customerTypeName,
										customerTypeId: item.customerTypeId,
										checkIndex:i
									});
								}}>
								<Text style={{ fontSize: 14, color: item.check ? '#0082ff' : '#53606A' }}>{item.customerTypeName}</Text>
								{this.state.checkIndex == i ? <Image source={require('../res/BaseInfor/000gouxuan.png')} /> :<View style={{height:0}}/>}
							</TouchableOpacity>
						)
					})}
				</ScrollView>
				<TouchableOpacity
					style={{
						height: 50,
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: '#34457D'
					}}
					onPress={() => { this.refs.base.hideModal() }}>
					<Text style={{ fontSize: 16, color: '#fff' }}>确定</Text>
				</TouchableOpacity>
			</View>
		)
	}
	_isPerfect() {
		if (ValidateUtil.isNull(this.state.unitNm)) {
			return true;
		}
		if (ValidateUtil.isNull(this.state.customerTypeId)) {
			return true;
		}
		if (ValidateUtil.isNull(this.state.businessRanges)) {
			return true;
		}
		return false;
	}
	_comit() {
		// if (ValidateUtil.isNull(this.state.unitNm)) {
		// 	Toast.show('请填写企业全称!');
		// 	return;
		// }
		// if (ValidateUtil.isNull(this.state.customerTypeId)) {
		// 	Toast.show('请选择药品批发企业类型!');
		// 	return;
		// }
		// if (ValidateUtil.isNull(this.state.businessRanges)) {
		// 	Toast.show('请选择经营范围!');
		// 	return;
		// }
		new Fetch({
			url: 'app/user/saveRegisterOne.json',
			bodyType: 'json',
			data: {
				buyersId: this.props.userInfo.buyersId,
				unitNm: this.state.unitNm,
				customerTypeId: this.state.customerTypeId,
				customerTypeNm: this.state.customerTypeNm,
				businessRanges: this.state.businessRanges,
			}
		}).dofetch().then((data) => {
			console.log('saveRegisterInfo data', data);
			if (this.state.unitNm != '') {
				if (this.beforeDatas && this.beforeDatas.appRegisterDetailOneVo && this.beforeDatas.appRegisterDetailOneVo.unitNm) {
					this.beforeDatas.appRegisterDetailOneVo.unitNm = this.state.unitNm;
				}
			}
			if (data.success) {
				this._initUserData();
				this.props.navigator.push({
					component: Fillinfor,
					params: {
						nextPagebusinessRangesName: this.state.nextPagebusinessRangesName,
						beforeDatas: this.beforeDatas,
						buyersId: this.props.userInfo.buyersId,
						businessRanges: this.state.businessRanges,
						customerTypeId: this.state.customerTypeId,
						isForRegist: this.props.params.isForRegist
					}
				});
			}
		}).catch((error) => { console.info('error', error) });
	}
	_initUserData() {
		let userInfo = {};
		userInfo.userName = this.props.userInfo.userName;
		userInfo.businessRanges = this.state.businessRanges;
		userInfo.customerTypeId = this.state.customerTypeId;
		StorageUtils.saveInfo('BASEINFOR', userInfo);
	}
	render() {
		return (
			<BaseView
				mainBackColor={{ backgroundColor: '#f5f5f5' }}
				ref={'base'}
				navigator={this.props.navigator}
				mainColor={'#f9f9f9'}
				title={{ title: '基础信息', tintColor: '#333', style: { fontSize: 18, fontWeight: 'normal' } }}
				statusBarStyle={'default'}
				renderModalScence={this.renderModalScence.bind(this)}
			>
				<View style={{ flex: 1, }}>
					<View style={{ flexDirection: 'row', alignItems: 'center', height: 50, backgroundColor: '#fff', paddingHorizontal: 13 }}>
						<Text style={{ fontSize: 14, color: '#0c1828' }}>企业全称</Text>
						<TextInputC
							style={{ flex: 1, fontSize: 14, color: '#0c1828', marginLeft: 35 }}
							clearButtonMode='while-editing'
							maxLength={30}
							value={this.state.unitNm}
							onChangeText={(txt) => { this.setState({ unitNm: txt }) }}
							placeholder={'填写营业执照上的企业全称'}
						/>
					</View>
					<Separator color='#f5f5f5' type='hor' width={5} />
					<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', height: 50, backgroundColor: '#fff', paddingHorizontal: 13 }}
						onPress={() => {
							dismissKeyboard();
							this.refs.base.showModal()
						}}>
						<Text style={{ fontSize: 14, color: '#0c1828' }}>客户类型</Text>
						<Text style={{ flex: 1, fontSize: 14, color: '#aaaeb9', marginLeft: 35, textAlign: 'right' }} numberOfLines={1}>{this.state.customerTypeNm}</Text>
						<Arrow />
					</TouchableOpacity>
					<Separator color='#f5f5f5' type='hor' style={{ marginLeft: 13 }} />
					<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', height: 50, backgroundColor: '#fff', paddingHorizontal: 13, }}
						onPress={() => {
							dismissKeyboard();
							this.props.navigator.push({
								component: ManageType,
								params: {
									data: this.businessRangesData,
									beforeBusinessRanges: this.beforeBusinessRanges,
									callback: (data) => {
										let name = '';
										let nextPagebusinessRangesName = '';
										if (data.businessRangesName!='') {
											name = data.businessRangesName.substring(0, data.businessRangesName.length - 1);
											nextPagebusinessRangesName = name.replace(/、/g, ' | ');
										}
										console.log('data.backData', data);
										if (data.backData != '') {
											this.beforeBusinessRanges = data.backData;
										}
										if(data.isreSet !=undefined && data.isreSet){
											this.beforeBusinessRanges = null;
										}
										this.setState({
											businessRanges: data.businessRanges,
											businessRangesName: name,
											nextPagebusinessRangesName: nextPagebusinessRangesName
										});
									}
								}
							})
						}
						}>
						<Text style={{ fontSize: 14, color: '#0c1828' }}>经营范围</Text>
						<Text style={{ flex: 1, fontSize: 14, color: '#aaaeb9', marginLeft: 35, textAlign: 'right' }} numberOfLines={1}>{this.state.businessRangesName}</Text>
						<Arrow />
					</TouchableOpacity>
					<Separator color='#f5f5f5' type='hor' width={10} />
					<View style={{ flexDirection: 'row', alignItems: 'center', height: 37, paddingHorizontal: 13 }}>
						<Text style={{ flex: 1, fontSize: 13, color: '#aaaeb9' }}>以上信息决定了下一步企业资料的内容，请确保无误！</Text>
					</View>
					<View style={{ flex: 1 }} />
					<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
						<Text style={{ fontSize: 12, color: '#53606A' }}>账号注册</Text><Arrow style={{ height: 25, width: 25, tintColor: '#000' }} />
						<Text style={{ fontSize: 12, color: '#53606A' }}>基础信息</Text><Arrow style={{ height: 25, width: 25, tintColor: '#ACB3BE' }} />
						<Text style={{ fontSize: 12, color: '#ACB3BE' }}>填写资料</Text>
					</View>
					<Separator color='#f5f5f5' type='hor' width={28} />
					<View style={{ alignItems: 'stretch', height: 65, backgroundColor: '#fff', paddingHorizontal: 13, paddingVertical: 10 }}>
						<TouchableOpacity
							disabled={this._isPerfect()}
							style={{
								flex: 1,
								backgroundColor: this._isPerfect() ? '#E0E0E1' : '#34457D',
								justifyContent: 'center',
								alignItems: 'center'
							}}
							onPress={() => { this._comit() }}>
							<Text style={{ fontSize: 16, color: this._isPerfect() ? '#BFBFBF' : '#fff' }}>下一步</Text>
						</TouchableOpacity>
					</View>
				</View>
			</BaseView>
		)
	}
}

//获取数据在下面添加
function mapStateToProps(state) {
	return {
		userInfo: state.Member.userInfo,
		isLogin: state.Member.isLogin,
	};
}
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(BaseInfor);
