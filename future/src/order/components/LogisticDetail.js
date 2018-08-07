import React, { Component } from 'react';

import {
	View,
	Image,
	TouchableOpacity,
	TouchableHighlight,
	Text,
	InteractionManager,
	Dimensions,
	ActivityIndicator,
	StyleSheet,
	PixelRatio,
	ScrollView,
	Alert,
} from 'react-native';

import {
	Fetch,
} from 'future/public/lib';

import {
	BaseView,
	MaskModal,
	Loading,
	Toast,
} from 'future/public/widgets';
import MoreOperation from '../../commons/moreOperation/components/MoreOperation';
import Swiper from 'react-native-swiper';

const SCREENWIDTH = Dimensions.get('window').width;

export default class LogisticDetail extends Component{
	constructor(props){
		super(props);

		this.state = {
			result: null,
			index: 0,
		}
		this.triangle = require('../res/OrderDetail/000sanjiaoxia.png');
	}

	componentDidMount(){
		Loading.show();
		InteractionManager.runAfterInteractions(() => {
			
			new Fetch({
				url: "/app/order/searchLogisticsStatus.json",
				method: 'POST',
				data: {
					orderId : this.props.params.orderId || 122,
				},
				forbidToast: true
			}).dofetch().then((data) => {
				Loading.hide();
				this.setState({
					result: data.result
				});
				
			}).catch((err) => {
				Loading.hide();
				console.log("获取物流详情失败：",err);
			});
		})
	}

	// 确认收货
	_confirmReceipt(logisData) {
		
		Alert.alert(
			'温馨提示',
			"确认收货？",
			[
				{text: '取消', onPress: () => {} },
				{text: '确定', onPress: () => {
					this.refs.modal.hide();
					if(logisData && logisData.packageId) {
						Loading.show();
						new Fetch({
							url: 'app/order/buyerSignedPackage.json',
							method:'POST',
							data: { packageId: logisData.packageId }
						}).dofetch().then((data)=>{
							Loading.hide();
							Toast.show("收货成功！");
							this.props.navigator && this.props.navigator.pop();
						}).catch((err)=>{
							console.log(err);
							Loading.hide();
							Toast.show("收货失败！");
						});
					}else {
						console.log("catch error ===> 没有packageId ");
						Toast.show("收货失败！");
					}
				}},
			]
		);
	}

	_renderRightButton = ()=>{
		return (
			<View style={{ justifyContent: 'center' }}>
				<MoreOperation
					navigator={this.props.navigator}
					order={
						[{
							module: 'index',
						},{
							module: 'message',
						}, {
							module: 'mine',
						}]
					}
					whiteIcon={true} />
			</View>
		)
	}

	_renderMessage = (logisticsLogs)=>{
		if(logisticsLogs && logisticsLogs.length > 0){
			let last = logisticsLogs.length - 1;
			return logisticsLogs.map((e,i)=>{
				return (
					<View
						key={i}
						style={{flexDirection:'row',}}
					>
						<View style={{width:83,justifyContent: 'center', alignItems: 'center', }}>
							<Text style={{fontSize:12,color:'#5E656D', textAlign: 'center'}}>{e.logDateTime}</Text>
						</View>
						{
							i === 0?(
								<View style={{width:15,alignItems:'center',}}>
									<View>
										<View style={{width:15,height:15,borderRadius:7.5,backgroundColor:'#0082FF',opacity: 0.4}}/>
										<View style={{width:10,height:10,borderRadius:5,backgroundColor:'#0082FF',position:'absolute',top:2.5,left:2.5,}}/>
									</View>
									<View style={{backgroundColor:'#BCC5D7',width:2/PixelRatio.get(),flex:1,}} />
								</View>
							) : (
								<View style={{width:15,alignItems:'center',}}>
									<View style={{width:12,height:12,borderRadius:6,backgroundColor:'#BCC5D7',}}/>
									{i !== last && <View style={{backgroundColor:'#BCC5D7',width:2/PixelRatio.get(),flex:1,}} /> }
								</View>
							)
						}
						<View style={{flex:1,paddingBottom:40,marginLeft:10, marginRight: 5}}>
							<Text style={{fontSize: 14}}>{e.log}</Text>
						</View>
					</View>
				)
			})
		}
	}

	_renderHeader = (data)=>{
		let result = data?data:[{}, {}];
		if(result){
			let packageSize = result.length;
			return result.map((e,i)=>{
				let title = '包裹' + ((packageSize > 1) ? i+1 : '');
				title += e.kind ? ' (' + e.kind + '品种)': '';
				return (
					<View
						style={{justifyContent: 'center',alignItems: 'center',}}
						key={'header'+i}
					>
						<TouchableHighlight
							style={{paddingHorizontal: 16,width: SCREENWIDTH - 70, height:105, borderRadius: 5,backgroundColor:'#fff',overflow:'hidden',borderWidth: 1/PixelRatio.get(),borderColor:'#ccc',}}
							underlayColor={'#eee'}
							onPress={()=>{
								this.refs.modal.show();
							}}
						>
							<View style={{flex:1,}}>
								<Text style={{fontSize:14,color:'#333',fontWeight: '500',paddingVertical: 15,}}>{ title }</Text>
								<Text style={{fontSize:14,color:'#333',paddingBottom:9,}}>物流公司  {e.companyNm?e.companyNm:'--'}</Text>
								<Text style={{fontSize:14,color:'#333',}}>运单编号  {e.logisticsOrderNum?e.logisticsOrderNum:'--'}</Text>
								<Image source={this.triangle} style={{width:11,height:6,transform:[{rotate:'-90deg'}],position:'absolute',right:0,top:50,}} />
							</View>
						</TouchableHighlight>
					</View>
				)
			})
		}
		return <View />;
		

	}

	_renderModal = ()=>{
		let result = this.state.result,
			index = this.state.index;
		let title = '包裹';
		let isSigned = false;
		if(result && result[index]) {
			title += (result.length > 1 ? index+1 : '') + (result[index].kind ? ' (' + result[index].kind + '品种)': '');
			isSigned = (result[index] && result[index].isBuyerSigned === 'Y') ? true : false;
		}

		return (
			<View style={{height:300,width:SCREENWIDTH,backgroundColor:'#fff'}}>
				<Text style={{fontSize:14,color:'#333',paddingVertical:12.5,paddingHorizontal:12,}}>{title}</Text>
				<ScrollView
					style={{height:273,}}
				>
					{
						result && result[index].itemExts.map((prdDetail,i)=>{
							return (
								<View style={{ backgroundColor: '#fafafa', paddingHorizontal: 13, paddingVertical: 15 }} key={'pro'+i}>
									<Text style={{ fontSize: 14, color: '#333'}}>{prdDetail.productNm}</Text>
									<View style={{flexDirection:'row',justifyContent:'space-between', marginTop:10}}>
										<Text style={{ fontSize: 12, color: '#8495a2', }}>规格: {prdDetail.appProductBaseVo.specPack?prdDetail.appProductBaseVo.specPack:'--'}</Text>
										<Text style={{ fontSize: 12, color: '#8495a2', }}>¥{prdDetail && prdDetail.productUnitPrice && prdDetail.productUnitPrice.toFixed(2)}</Text>
									</View>
									<View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
										<Text style={{ fontSize: 12, color: '#8495a2', }}>厂家: {prdDetail.appProductBaseVo.factory?prdDetail.appProductBaseVo.factory:'--'}</Text>
										<Text style={{ fontSize: 12, color: '#8495a2', }}>×{prdDetail.quantity}</Text>
									</View>
									{prdDetail.batchNum && <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
										<Text style={{ fontSize: 12, color: '#8495a2', }}>批号: {prdDetail.batchNum}</Text>
									</View>}
								</View>
							)
						})
					}
				</ScrollView>
				<TouchableOpacity
					style={[styles.btn, isSigned ? styles.btn_s : null]}
					onPress={() => { this._confirmReceipt(result[index]) }}
					disabled={isSigned}
				>
					<Text style={[styles.btnText, isSigned ? styles.btnText_s : null]}>确认收货</Text>
				</TouchableOpacity>
			</View>
		)
	}

	

	render(){
		let logisticsLogs = !this.state.result?null:this.state.result[this.state.index].logisticsLogs;
		return (
			<BaseView
				mainBackColor={{ backgroundColor: '#f5f5f5'}}
				mainColor={'#34457D'}
				navigator={this.props.navigator}
				title={{title:'物流详情',tintColor:'#fff',}}
				rightButton={this._renderRightButton()}
			>
				<View style={{backgroundColor:'#34457D',height:64,}} />
				<View style={{backgroundColor:'transparent',position:'absolute',top:12,}}>
					<Swiper
						style={styles.wrapper}
						width={SCREENWIDTH}
						height={105}
						showsPagination={false}
						showsButtons={this.state.result && this.state.result.length >1?true:false}
						buttonWrapperStyle={{backgroundColor: 'transparent',position: 'absolute', top: 0, left: 0,}}
						nextButton={
							<View
								style={{position:'absolute',top:-52.5,right:-10,width:35,height:105}}
							>
								<Image
									source={require('../res/OrderDetail/000sanjiao.png')}
									style={{width:11,height:6,top:20,left:13,transform:[{rotate:'-90deg'}],}}
								/>
							</View>
						}
						prevButton={
							<View
								style={{position:'absolute',top:-52.5,left:-10,width:35,height:105}}
							>
								<Image
									source={require('../res/OrderDetail/000sanjiao.png')}
									style={{width:11,height:6,top:20,left:10,transform:[{rotate:'90deg'}],}}
								/>
							</View>
						}
						onMomentumScrollEnd={(e,i)=>{
							this.setState({
								index: i.index,
							})
						}}
					>
						 {this._renderHeader(this.state.result)} 
					</Swiper>
				</View>
				<ScrollView
					style={{flex:1,backgroundColor:'transparent',marginTop:70, paddingTop: 5}}
					showsVerticalScrollIndicator={false}
				>
					{this._renderMessage(logisticsLogs)}
				</ScrollView>
				<MaskModal
					ref="modal"
					viewType="full"
					containerStyle2={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}
					contentView={this._renderModal()}
				/>
			</BaseView>
		)
	}
}

const styles = StyleSheet.create({
	box: {
		width: 200,
		height: 105,
		backgroundColor:'red',
	},
	wrapper:{
		backgroundColor:'transparent',
	},

	btn: {
		backgroundColor:'#34457D',height:50,justifyContent:'center',alignItems:'center',
	},
	btnText: {
		fontSize:16,color:'#fff',
	},
	btn_s: {
		backgroundColor: '#e0e0e1'
	},
	btnText_s: {
		color: '#bfbfbf'
	}
})