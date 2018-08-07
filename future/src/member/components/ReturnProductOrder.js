import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	StyleSheet,
	InteractionManager,
	TouchableHighlight,
	TouchableOpacity,
	ScrollView,
	Alert
} from 'react-native';

import {
	BaseView,
	Toast,
	FlexModal,
	TextInputC,
	ImageUploader,
	MaskModal,
	Loading
} from 'future/public/widgets';

import {
	Fetch,
	imageUtil,
	ValidateUtil,
} from 'future/public/lib';
import { connect } from 'react-redux';
import MoreOperation from '../../commons/moreOperation/components/MoreOperation';

let selectIndex = 0;

class ReturnProductOrder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			returnProduct: this.props.params.selectedProduct || [],
			orderData: this.props.params.orderData,						//主要用来获取orderId
			returnDescr: '',
			returnTel: '',
			photoUri: [],
			photoFileId: [],
			addressPath:'请选择退回地址',
			addrList:[],
			applierInf:{}
		}
		this.maxPhotoNum = 3;
	}
	componentDidMount() {
		new Fetch({
			url: '/app/returnOrder/getReturnedInfo.json',
			method: 'POST',
			data:{
				shopInfId:this.props.params.orderData.shopInfId
			}
		}).dofetch().then((data) => {
			if (data.success) {
				this.setState({
					addrList:data.shipperAddrs,
					applierInf:data,
				})
			}
		}).catch((error) => {
			console.log('=====>错误 CATCH>>', error);
		});
	}

	onClickAddImage() {
		ImageUploader.show((source, res) => {
			//选择成功
			Loading.show();
		}, (res) => {
			//上传成功
			// let prescriptionVo = this.state.prescriptionVo;
			// prescriptionVo.prescriptionPictId = res.fileId;
			let photoFileId_temp = this.state.photoFileId.slice(0), photoUri_temp = this.state.photoUri.slice(0);
			photoUri_temp.push({ uri: res.url });
			photoFileId_temp.push(res.fileId);
			console.log('res===========', photoUri_temp, photoFileId_temp, res);
			this.setState({
				// prescriptionVo: prescriptionVo,
				photoUri: photoUri_temp,
				photoFileId: photoFileId_temp,
			});
			Loading.hide();
		}, () => {
			//上传失败
			// this.setState({
			// 	photoUri: null,
			// 	photoFileId: null
			// });
			Loading.hide();
			Toast.show('图片上传失败');
		});
	}

	onClickDeleteImage(item, index) {
		Alert.alert('温馨提醒', '确定删除图片吗?', [
			{ text: '取消', onPress: () => { } },
			{
				text: '确定', onPress: () => {
					let photoFileId_temp = this.state.photoFileId.slice(0), photoUri_temp = this.state.photoUri.slice(0);
					photoFileId_temp.splice(index, 1);
					photoUri_temp.splice(index, 1);
					this.setState({
						photoUri: photoUri_temp,
						photoFileId: photoFileId_temp
					});
				}
			}
		]);
	}

	onClickSubmit() {
		if (this.state.returnDescr.trim() == '') {
			return Toast.show('请填写退货说明');
		}

		let data = {};
		data.orderItems = [];
		this.state.returnProduct.forEach((item, index) => {
			let a = {};
			a.batchNum = item.batchNum;
			a.orderItemId = item.orderItemId;
			a.quantity = item.selectNumber;
			data.orderItems.push(a);
		})
		data.orderId = this.state.orderData.orderId;
		data.descr = this.state.returnDescr;
		data.tel = this.props.userInfo.userMobile;
		data.photoFileId = this.state.photoFileId.join(',') || '';
		data.shipperAddrId = this.state.addrList[selectIndex].shipperAddrId;

		new Fetch({
			url: '/app/returnOrder/saveReturnOrder.json',
			method: 'POST',
			bodyType: 'json',
			data: data,
		}).dofetch().then((data) => {
			if (data.success) {
				Toast.show('提交申请成功');
				let poproute = this.props.navigator.getCurrentRoutes()[this.props.navigator.getCurrentRoutes().length - 3];
				//pop 2次
				this.props.navigator.popToRoute(poproute);
				this.props.params && this.props.params.callback && this.props.params.callback();
			}
		}).catch((error) => {
			console.log('=====>错误 CATCH>>', error);
		});
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

	_submitSelectAddress(){
		this.refs.stateModal.hide();
	}

	_selectAddr(index){
		selectIndex = index;
		for (let i = 0; i < this.state.addrList.length; i++) {
			this.state.addrList[i].isSelected = false;
		}
		this.state.addrList[index].isSelected = !this.state.addrList[index].isSelected;
		this.setState({
			addrList: this.state.addrList,
			addressPath: this.state.addrList[index].addressPath
		})
	}

	//地址选择弹出层
	_renderAddrMask(MaskInfos) {
		return (
			<View style={{ width: SCREENWIDTH, height: 330, backgroundColor: '#fff', marginTop: SCREENHEIGHT - 394, justifyContent: 'space-between' }}>
				<View>
					<Text style={{ marginTop: 20, fontSize: 15, color: "#333", marginLeft: 13, fontWeight: 'bold' }}>退回地址</Text>

					{MaskInfos.map((address, index) => {
						return (<TouchableOpacity key={'mask' + index} onPress={this._selectAddr.bind(this, index)}>
							<View style={{ width: SCREENWIDTH, height: 95, flexDirection: 'row', justifyContent: 'space-between' }}>
								<View>
									<Text style={{ marginTop: 15, fontSize: 15, color: "#333", marginLeft: 13 }}>{address.name}     {address.mobile}</Text>
									<Text style={{ marginTop: 7, fontSize: 15, color: "#333", marginLeft: 13, width:SCREENWIDTH-45 }} numberOfLines={2}>{address.addressPath} {address.addr}</Text>
								</View>
								<View style={{ width: 32, height: 95, justifyContent: 'center', alignItems: 'center' }}>
									<Image
										style={{ width: 16, height: 16 }}
										source={address.isSelected == true ? 
										require('../res/afterSale/000yigouxuan.png') : 
										require('../res/afterSale/006weigouxuan.png')}
										resizeMode='contain' />
								</View>
							</View>
						</TouchableOpacity>)
					})}
				</View>
				<TouchableOpacity style={{ width: SCREENWIDTH, height: 50, backgroundColor: '#34457D', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end' }} onPress={this._submitSelectAddress.bind(this)}>
					<Text style={{ color: '#fff', fontSize: 16 }}>确定</Text>
				</TouchableOpacity>
			</View>
		)
	}

	render() {
		return (
			<BaseView
				mainColor={'#fafafa'}
				navigator={this.props.navigator}
				title={{ title: '填写退货单', tintColor: '#333333' }}
				titlePosition={"center"}
				rightButton={this._renderRightButton()}
				statusBarStyle={'default'}
				>
				<ScrollView  style={{ backgroundColor: '#f5f5f5' }}>
					{
						this.state.returnProduct.map((item, index) => {
							return (
								<View key={index} style={{ backgroundColor: '#fff', paddingHorizontal: 13, marginBottom: 10 }}>
									<View style={{ marginTop: 15 }}>
										<Text numberOfLines={1} style={{ fontSize: 14, color: '#333333' }}>{item.productNm}</Text>
									</View>
									<View style={{ marginTop: 10 }}>
										<Text style={{ fontSize: 12, color: '#8495A2' }}>规格：{item.specNm}</Text>
									</View>
									<View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
										<Text numberOfLines={1} style={{ fontSize: 12, color: '#8495A2', flex: 1 }}>厂家：{item.factory}</Text>
									</View>
									<View style={{ marginTop: 10, marginBottom: 15, flexDirection: 'row', alignItems: 'center' }}>
										<Text numberOfLines={1} style={{ fontSize: 12, color: '#8495A2', flex: 1 }}>批号：{item.batchNum}</Text>
										<Text style={{ fontSize: 13, color: '#333333' }}>数量:x{item.selectNumber}</Text>
									</View>
								</View>
							)
						})
					}
					<TouchableOpacity 
					onPress={()=>{
						this.refs.stateModal.show();
					}}
					style={{ flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', paddingHorizontal: 13,marginBottom:10 }}>
						<Text style={{ fontSize: 15, color: '#0C1828', marginRight: 20 }}>退回地址</Text>
						<View style={{flex:1, height: 53,flexDirection:'row',alignItems:'center'}}>
							<View style={{flex:1}}/>
							<Text style={{ color: '#AAAEB9',marginRight:10}}>{this.state.addressPath}</Text>
							<Image style={{width:4,height:8}} source={require('../res/afterSale/000xiangyousanjiao.png')}/>
						</View>
						
					</TouchableOpacity>
					<View style={{ flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', paddingHorizontal: 13, }}>
						<Text style={{ fontSize: 15, color: '#AAAEB9', marginRight: 20 }}>退货说明</Text>
						<View style={{ height: 53, justifyContent: 'center', backgroundColor: '#fff', flex: 1 }}>
							<TextInputC
								clearButtonMode={'while-editing'}
								autoFocus={false}
								onChangeText={(text) => {
									this.setState({ returnDescr: text });
								} }
								placeholderTextColor="#ccc"
								maxLength={512}
								placeholder='(必填)'
								style={{ fontSize: 15, color: '#0C1828', flex: 1 }} />
						</View>
					</View>
					<View style={{
						flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center',
						paddingHorizontal: 13, borderTopColor: '#eee', borderTopWidth: StyleSheet.hairlineWidth
					}}>
						<Text style={{ fontSize: 15, color: '#AAAEB9', marginRight: 6 }}>采购负责人</Text>
						<View style={{ height: 53, justifyContent: 'center', backgroundColor: '#fff', flex: 1 }}>
							{/*<TextInputC
								clearButtonMode={'while-editing'}
								autoFocus={false}
								onChangeText={(text) => {} }
								placeholderTextColor="#ccc"
								maxLength={512}
								placeholder='(必填)'
								style={{ fontSize: 15, color: '#0C1828', flex: 1 }} />*/}
							<Text style={{ fontSize: 15, color: '#0C1828'}}>{this.state.applierInf.buyManagerNm}</Text>
						</View>
					</View>
					<View style={{
						flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', marginBottom: 10,
						paddingHorizontal: 13, borderTopColor: '#eee', borderTopWidth: StyleSheet.hairlineWidth
					}}>
						<Text style={{ fontSize: 15, color: '#AAAEB9', marginRight: 20 }}>手机号码</Text>
						<View style={{ height: 53, justifyContent: 'center', backgroundColor: '#fff', flex: 1 }}>
							{/*<TextInputC
								clearButtonMode={'while-editing'}
								autoFocus={false}
								onChangeText={(text) => {
									this.setState({ returnTel: text });
								} }
								placeholderTextColor="#ccc"
								maxLength={11}
								placeholder='(必填)'
								style={{ fontSize: 15, color: '#0C1828', flex: 1 }} />*/}
							<Text style={{ fontSize: 15, color: '#0C1828'}}>{this.state.applierInf.buyManagerMobile}</Text>
						</View>
					</View>
					<View style={{ backgroundColor: '#fff', paddingHorizontal: 7, paddingBottom: 11 }}>
						<Text style={{ fontSize: 14, color: '#333333', marginLeft: 6, marginTop: 15, marginBottom: 8 }}>上传图片</Text>
						<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
							{
								this.state.photoUri.map((item, index) => {
									return (
										<View
											key={'photo' + index}
											style={{ marginVertical: 7, marginHorizontal: 6, height: 61, width: 61 }}
											>
											<View style={{
												width: 61, height: 61, borderRadius: 4,
												justifyContent: 'center', alignItems: 'center',
												borderColor: '#DDDDDD', borderWidth: 1
											}}
												>
												<Image style={{ width: 61, height: 61 }} source={item} />
												<TouchableOpacity
													style={{ position: 'absolute', zIndex: 9, top: 20, left: 20 }}
													activeOpacity={0.7}
													onPress={() => {
														this.onClickDeleteImage(item, index)
													} }
													>
													<Image style={{ width: 20, height: 20 }} source={require('../res/afterSale/008heicha.png')} />
												</TouchableOpacity>
											</View>
										</View>
									)
								})
							}
							{
								this.state.photoUri.length == this.maxPhotoNum ?
									<View></View>
									:
									<View style={{ marginVertical: 7, marginHorizontal: 6, height: 61, width: 61 }}>
										<TouchableOpacity
											style={{
												width: 61, height: 61, borderRadius: 4,
												justifyContent: 'center', alignItems: 'center',
												borderColor: '#DDDDDD', borderWidth: 1
											}}
											activeOpacity={1}
											onPress={() => {
												this.onClickAddImage()
											} }
											>
											<Image style={{ width: 20, height: 20 }} source={require('../res/afterSale/a006xinjianfenzu.png')} />
										</TouchableOpacity>
									</View>
							}
						</View>
					</View>
				</ScrollView>
				<View style={{ backgroundColor: 'rgba(255,255,255,0.7)', height: 65, alignItems: 'center', justifyContent: 'center' }}>
					<TouchableOpacity
						style={{
							backgroundColor: '#34457D', height: 45, width: 290,
							borderRadius: 2, justifyContent: 'center', alignItems: 'center'
						}}
						activeOpacity={0.6}
						onPress={() => {
							this.onClickSubmit();
						} }
						>
						<Text style={{ color: '#fff', fontSize: 16 }}>提交申请</Text>
					</TouchableOpacity>
				</View>
				<MaskModal ref='stateModal' contentView={
					this._renderAddrMask(this.state.addrList)
				} />
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

export default connect(mapStateToProps)(ReturnProductOrder);
