import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	View,
	ScrollView,
	Dimensions,
	Text,
	Image,
	TouchableOpacity,
	Platform,
	TouchableHighlight,
	InteractionManager,
	StyleSheet,
	PixelRatio,
	Alert
} from 'react-native';
var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;
import _ from 'underscore';
import { Fetch, UtilDateTime } from 'future/public/lib';
import { BaseView, MaskModal, RefreshableListView, Toast, Loading } from 'future/public/widgets';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollableTabBar from 'future/public/commons/ScrollableTabBar';
 import OrderDetail from './OrderDetail';
import OrderSearch from './OrderSearch';
import PublishComment from './PublishComment';
import CancelOrderInfosSet from './CancelOrderInfosSet';
import CashierDesk from '../../settleCenter/components/CashierDesk';
import ChooseReturnProduct from "../../member/components/ChooseReturnProduct";
import LogisticDetail from './LogisticDetail';
import StocksList from "../../stocksList/components/StocksList";
import CommentDetail from "future/src/product/components/CommentDetail";
import SupplierHome from '../../supplierHome/components/SupplierHome';

export default class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			List: [],
			promotionTypeCode: this.props.promotionTypeCode,
			extraParams: null,
		}
		this.fetchData = this._fetchData.bind(this);
		this.renderRow = this._renderRow.bind(this);
		this.pullRefresh = this._pullRefresh.bind(this);
		this.deleteRows = this.deleteRows.bind(this);
	}
	_pullRefresh() {
		InteractionManager.runAfterInteractions(() => {	
		  		this.refs.list && this.refs.list.pullRefresh && this.refs.list.pullRefresh();
		});
	}

	// 倒计时功能函数
	startChangeTime() {
		if(!this.refs.list.getRows()){
			return;
		}
		const rows = [].concat(this.refs.list.getRows());
		for (let i = 0; i < rows.length; i++) {
			if(rows[i] && rows[i].leftseconds && rows[i].leftseconds > 0){
				rows[i].leftseconds = rows[i].leftseconds - 1;
				rows[i] = Object.assign({}, {}, rows[i])
			}
		}		
		
		this.refs.list.setRows(rows);
	}

	//删除某一项
	deleteRows(rowId){
		let rows = [].concat(this.refs.list.getRows());
		rows.splice(rowId,1);
		this.refs.list.setRows(rows);
	}

	componentDidMount() {
		this.setState({
			//promotionTypeCode: this.props.params.promotionTypeCode,
			extraParams: this.props.params.extraParams
		})
		this.pullRefresh();
		this.timer = setInterval(
			() => { this.startChangeTime(); },
			1000
		);
	}

	//关闭倒计时
	componentWillUnmount() {
		this.timer && clearInterval(this.timer);
	}

	componentWillReceiveProps(nextProps) {		
		if(nextProps.promotionTypeCode != this.props.promotionTypeCode){
			setTimeout(() => { 			
				this.pullRefresh(); 				
			}, 50)
		}
		this.setState({
			promotionTypeCode: nextProps.promotionTypeCode,
			extraParams: nextProps.params.extraParams
		})
	}


	_fetchData(page, success, error) {		
		let requestParam = {}
		requestParam.pageNumber = page || 1;
		requestParam.limit = 10;
		requestParam.sysUserId = this.props.sysUserId;
		requestParam.status = this.props.params.status;	
		
		//订单状态
		// requestParam.orderType = this.props.params.orderType;
		//订单类型
		requestParam.promotionTypeCode = this.props.promotionTypeCode;	
		
		
		if (this.state.extraParams) {
			Object.assign(requestParam, this.state.extraParams);
		}
		new Fetch({
			url: "/app/order/orderList.json",			
			data: requestParam
		}).dofetch().then((data) => {			
			let result = data.result.result;
			for(let i = 0; i < result.length; i++){
					result[i].leftseconds = result[i].canPayTime?(result[i].canPayTime - new Date().getTime()) / 1000 :null;
					
			}
			// console.log('>>>>>>>>>11',10 * (page - 1) + data.result.result.length,data.result.totalCount);
			success(result, 10 * (page - 1) + data.result.result.length, data.result.totalCount);
		}).catch((err) => {						
			error && error(err);
			//console.log("订单列表数据获取失败：",err);
			//success(data.result, 10 * (page - 1) + data.result.length, data.totalCount);
		});
	}

	//执行以下操作后重新渲染指定项
	//取消订单、确认收货、提醒发货、立即支付
	reloadItemAterAction(orderId, index){
		new Fetch({
			url: "/app/order/orderDetail.json",
			method: 'POST',
			data: {
				orderId: orderId
			},
		}).dofetch().then((data) => {
			let result = data.result;
			if(result.orderStat == "待付款" && result.canPayTime){
				result.leftseconds = result.canPayTime?(result.canPayTime - new Date().getTime()) / 1000 :null;
			}
			const rows = [].concat(this.refs.list.getRows());
			const row = Object.assign({}, rows[index], result)
			rows[index] = row;
			this.refs.list.setRows(rows);
		}).catch((err) => {
			console.log("订单列表获取详情数据失败：",err);
		});
	}

	//取消订单
	cancelOrder (orderId ,rowID){
		Alert.alert(
			'温馨提示',
			'是否确定取消订单',
			[
				{ text: '取消', onPress: () => { } },
				{
					text: '确定', onPress: () => {
						Loading.show();
						new Fetch({
							url: "/app/order/cancelOrder.json",
							method: 'POST',
							data: {
								orderId: orderId
							},
						}).dofetch().then((data) => {
							Toast.show("取消订单成功");
							this.deleteRows(rowID)
							// this.reloadItemAterAction(orderId, rowID);
						}).catch((err) => {
							console.log("订单列表取消订单失败：",err);
						}).finally(()=>{
							Loading.hide();
						});
					}
				},
			]
		)
	}

	//取消待发货订单
	cancelWaitSendOrder (orderId ,rowID){
		Alert.alert(
			'温馨提示',
			'是否确定取消订单',
			[
				{ text: '取消', onPress: () => { } },
				{
					text: '确定', onPress: () => {
						this.props.navigator.push({
							component:CancelOrderInfosSet,
							params:{
								orderId:orderId,
                                callback:()=>{
									this.refs.list.reloadData();
								}
							}
						})
					}
				},
			]
		)
	}
	//撤销取消申请
	revokeApplay(orderId){
	}

	//确认收货，订单
	buyerSigned(orderId, rowID) {
		Alert.alert(
			'温馨提示',
			'是否确定收货',
			[
				{ text: '取消', onPress: () => {  } },
				{
					text: '确定', onPress: () => {
						Loading.show();
						new Fetch({
							url: "/app/order/buyerSigned.json",
							method: 'POST',
							data: {
								orderId: orderId
							},
						}).dofetch().then((data) => {
							Toast.show("确认收货成功");
							this.deleteRows(rowID);
							// this.reloadItemAterAction(orderId, rowID);
						}).catch((err) => {
							console.log("订单列表确认收货失败：",err);
						}).finally(()=>{
							Loading.hide();
						});
					}
				},
			]
		)
	}

	//提醒发货
	remind(orderId, rowID) {
		Loading.show();
		new Fetch({
			url: "/app/order/remindOrder.json",
			method: 'POST',
			data: {
				orderId: orderId
			},
		}).dofetch().then((data) => {
			Toast.show("提醒发货成功");
			this.reloadItemAterAction(orderId, rowID);
		}).catch((err) => {
			console.log("订单列表提醒发货失败：", err)
		}).finally(()=>{
			Loading.hide();
		});
	}

	//再次购买
	buyAgain(orderId, promotionTypeCode) {
		Loading.show();
		new Fetch({
			url: "/app/order/buyAgain.json",
			method: 'POST',
			data: {
				orderId: orderId
			},
		}).dofetch().then((data) => {
			Toast.show("加入购物车成功")
			this.props.navigator.push({
				component: StocksList
			})
		}).catch((err) => {
			console.log("err", err);
		}).finally(()=>{
			Loading.hide();
		});

	}

	//物流详情
	logisticsDetail(orderId) {
		this.props.navigator.push({
			component: LogisticDetail,
			params: {
				orderId: orderId,
				callback: () => { this.reloadItemAterAction(orderId, rowID); }
			}
		})
	}

	//立即支付
	gotoPay(orderId, orderTotalAmount) {
		this.props.navigator.push({
			component: CashierDesk,
			params: {
				orderIds: [orderId],
				needPayAmount:orderTotalAmount,
				// TODO 支付回调 待调整 尝试使用this.reloadItemAterAction(orderId, rowID);
				callback: () => { this.reloadItemAterAction(orderId, rowID); }
			}
		})
	}

	//售后
	afterSale(orderId, packageId, rowID,shopInfId) {		
		this.props.navigator.push({
			component: ChooseReturnProduct,
			params: {
				type: 'order',
				data: {
					orderId:orderId,
					shopInfId:shopInfId
				},				
			}
		})
	}

	//用户评价
	goToRemarkPage(orderData){
		if(orderData.isCommentFinish=='Y'){
			this.props.navigator.push({
				component: CommentDetail,
				params: {
					type: 'order',
					orderId:orderData.orderId,	
					callback:()=>{
						this.refs.list && this.refs.list.reloadData();
					}			
				}
			})
		} else if(orderData.isCommentFinish=='N') {
			this.props.navigator.push({
				component: PublishComment,
				params: {
					type: 'order',
					orderId:orderData.orderId,	
					callback:()=>{
						this.refs.list && this.refs.list.reloadData();
					}			
				}
			})
		}
		
	}

	_renderRow(rowData, sectionID, rowID, highlightRow) {		
		//商品详情数据		
		let prdDetail = {};
		let batchNum;
		if (rowData.defaultPackage && rowData.defaultPackage.itemExts.length > 0) {
			prdDetail = rowData.defaultPackage.itemExts[0].appProductBaseVo;
		 	batchNum = rowData.defaultPackage.itemExts[0].batchNum;
		} else if(rowData && rowData.defaultOrderProduct){
			prdDetail = rowData.defaultOrderProduct;
		}	
		//价格数据	
		//let	price = rowData.orderTotalAmount.toFixed(2);			
		//console.log('>>>>>>price',price);	
		// intPrice = Math.floor(price*100/100);
		// dicimalPrice = Math.floor(price*100 - intPrice*100);
		// let price = String(rowData.orderTotalAmount).split('.');	
		let price=Number.parseFloat(rowData.orderTotalAmount).toFixed(2).toString().split('.');
		intPrice = price[0];
		dicimalPrice = price[1];
		// if(!dicimalPrice){
		// 	dicimalPrice = '00';
		// }else if(dicimalPrice < 10){
		// 	dicimalPrice = dicimalPrice + '0';
		// }	

		//倒计时秒数
		let leftseconds = rowData && rowData.leftseconds ? rowData.leftseconds : 0;
		if (leftseconds < 0) {
			leftseconds = 0;
		}
		let data = UtilDateTime.getLeftTimeString(leftseconds);		

		//取消订单按钮
		let cancelBtn = null;
		if(rowData.isCancelable == "Y"){
			cancelBtn = <TouchableOpacity activeOpacity={0.7} onPress={() => { this.cancelOrder(rowData.orderId, rowID) } }>
							<View style={{height: 28,paddingHorizontal:10, borderRadius: 3, borderColor: '#8e939a', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
								<Text style={{ fontSize: 13, color: '#444' }}>取消订单</Text>
							</View>
						</TouchableOpacity>
		}
		//待发货取消按钮
		let waitSendCancelBtn = null;
		if(rowData.orderStat == "待发货" && rowData.hadCancelApplay != 'Y'){
			waitSendCancelBtn = <TouchableOpacity activeOpacity={0.7} onPress={() => { 
				if(rowData.hadCancelApplay == 'Y')
					this.revokeApplay(rowData.orderId, rowID)
				else
					this.cancelWaitSendOrder(rowData.orderId, rowID) } 
				}>
							<View style={{height: 28,paddingHorizontal:10, borderRadius: 3, borderColor: '#8e939a', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
								<Text style={{ fontSize: 13, color: '#444' }}>{/*暂不添加撤销模块rowData.hadCancelApplay == 'Y' && rowData.orderStat!='已取消'?'撤销申请':*/'取消订单'}</Text>
							</View>
						</TouchableOpacity>
		}
		//支付按钮		
		let payBtn = null;
		let payBtnText = "立即支付";		
		if(leftseconds > 0 ){			
			payBtn = <TouchableOpacity onPress={() => { this.gotoPay(rowData.orderId, rowData.orderTotalAmount) } }>
					<View style={{height: 28,width:130, borderRadius: 3, marginLeft: 8, justifyContent: 'center', alignItems: 'center', backgroundColor:'#0082ff' }}>
						<Text style={{ fontSize: 13, color: '#fff' }}>{payBtnText+' '}{data.hourStr}:{data.minuteStr}:{data.secondStr}</Text>
					</View>
				</TouchableOpacity>			
		}else{
			payBtn = <View style={{ width: 80, height: 30, borderRadius: 5, backgroundColor: '#ddd', marginLeft: 8, justifyContent: 'center', alignItems: 'center' }}>
						<Text style={{ fontSize: 12, color: '#c2c2c2' }}>{payBtnText}</Text>
					</View>
		}
		//提醒发货按钮
		let noticeBtn = null;
		noticeBtn = <TouchableOpacity activeOpacity={0.7} onPress={() => { this.remind(rowData.orderId, rowID) } }>
							<View style={styles.itemBtn}>
								<Text style={{ fontSize: 13, color: '#0082ff' }}>{rowData.isRemind == "Y"?'已提醒发货':'提醒发货'}</Text>
							</View>
						</TouchableOpacity>
		
		//查看物流按钮
		let logisticsBtn = <TouchableOpacity activeOpacity={0.7} onPress={() => { this.logisticsDetail(rowData.orderId) } }>
							<View style={styles.itemBtnGray}>
								<Text style={{ fontSize: 13, color: '#444' }}>查看物流</Text>
							</View>
						</TouchableOpacity>
		//确认收货按钮
		let certainBtn = <TouchableOpacity activeOpacity={0.7} onPress={() => { this.buyerSigned(rowData.orderId, rowID) } }>
							<View style={styles.itemBtn}>
								<Text style={{ fontSize: 13, color: '#0082ff' }}>确认收货</Text>
							</View>
						</TouchableOpacity>
		//申请退货按钮
		let returnBtn = null;	
		if(rowData.isReturnable == 'Y'){
			returnBtn = <TouchableOpacity onPress={() => { this.afterSale(rowData.orderId, rowData.defaultPackage && rowData.defaultPackage.packageId, rowID,rowData.sysShopInf.shopInfId) } }>
								<View style={styles.itemBtnGray}>
									<Text style={{ fontSize: 13, color: '#444' }}>申请退货</Text>
								</View>
							</TouchableOpacity>			
		}	
		
		//再次购买按钮
		let buyAgainBtn = null;
		if(rowData.promotionTypeCode == "0"){//是否显示再次购买，只有普通订单才有再次购买，团购、抢购、近效期等等都没有再次购买
			buyAgainBtn = <TouchableOpacity onPress={() => { this.buyAgain(rowData.orderId, this.state.promotionTypeCode) } }>
							<View style={styles.itemBtn}>
								<Text style={{ fontSize: 13, color: '#0082ff' }}>再次购买</Text>
							</View>
							</TouchableOpacity>
		}
		//用户确认收货后用户评价按钮isCommentFinish
		let remarkBtn = null;
		if(rowData.orderStat == "已完成"){
			remarkBtn = <TouchableOpacity onPress={() => { this.goToRemarkPage(rowData) } }>
							<View style={rowData.isCommentFinish=='Y'?styles.itemBtnGray:styles.itemBtn}>
								<Text style={{ fontSize: 13, color: rowData.isCommentFinish=='Y'?'#444':'#0082ff' }}>{rowData.isCommentFinish=='Y'?'查看评价':'用户评价'}</Text>
							</View>
						</TouchableOpacity>
		}

			
		return (
			<View>
			{/*基础信息*/}
				<TouchableOpacity style={{ marginTop: 10, backgroundColor: '#fff' }} activeOpacity={0.8} onPress={() => {
					this.props.navigator.push({
						component: OrderDetail,
						params: {
							orderId: rowData.orderId,							
						}
					})}}>
					{/*商家-订单状态*/}
					<View style={{ paddingHorizontal: 13, flexDirection: 'row', justifyContent: 'space-between', height: 40, alignItems: 'center' }}>
						<TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} 
							onPress={()=>{
								this.props.navigator.push({
									component:SupplierHome,
									params:{shopInfId:rowData.sysShopInf.shopInfId}
									})
								}}
							>
							<Image style={{width:16,height:16}} source={require('../res/orderlist/008mendian.png')}/>
							<Text style={{ fontSize: 13,marginLeft:10,color:'#4f5665' }}>{rowData.shopNm}</Text>
							<Image style={{marginLeft:10}} source={require('../res/orderlist/000xiangyousanjiao.png')}/>
						</TouchableOpacity>
						<Text style={{ fontSize: 12, color: '#ff6600'}}>{(rowData.hadCancelApplay=='Y' && rowData.orderStat!='已取消')?'取消中':rowData.orderStat}</Text>
					</View>

					{/********横条通知*********/}
					{rowData.orderStat == "待收货" && rowData.isAllSend != "Y" && <View style={styles.itemTintLab}>
						<Text style={{ fontSize: 12,color:'#ff9c3a' }}>您的订单由于特殊原因，部分商品还未发货，请你耐心等待</Text></View>}

					{rowData.returnOrderProductVoList && rowData.returnOrderProductVoList.length == 1 && <View style={styles.itemTintLab}>
						<Text style={{ fontSize: 12,color:'#ff9c3a' }}>您申请的{rowData.returnOrderProductVoList[0].productNm}1种药品已退货成功</Text></View>}

					{rowData.returnOrderProductVoList && rowData.returnOrderProductVoList.length > 1 && <View style={styles.itemTintLab}>
						<Text style={{ fontSize: 12,color:'#ff9c3a' }}>您申请的{rowData.returnOrderProductVoList[0].productNm}等{rowData.returnOrderProductVoList.length}种药品已退货成功</Text></View>}
					
					{/*您的取消订单申请已提交*/}
					{rowData.hadCancelApplay == 'Y' && rowData.orderStat!='已取消' && <View style={styles.itemTintLab}>
						<Text style={{ fontSize: 12,color:'#ff9c3a' }}>您的取消订单申请已提交</Text></View>}
					{/********横条通知*********/}

					<View style={{ backgroundColor: '#fafafa', paddingHorizontal: 13, paddingVertical: 15 }}>
						<Text style={{ fontSize: 14, color: '#333'}}>{prdDetail.title}</Text>
						<View style={{flexDirection:'row',justifyContent:'space-between', marginTop:10}}>
							<Text style={{ fontSize: 12, color: '#8495a2', }}>规格: {prdDetail.specPack}</Text>
							<Text style={{ fontSize: 12, color: '#8495a2', }}>¥{prdDetail && prdDetail.price && prdDetail.price.toFixed(2)}</Text>
						</View>
						<View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
							<Text style={{ fontSize: 12, color: '#8495a2', }}>厂家: {prdDetail.factory}</Text>
							<Text style={{ fontSize: 12, color: '#8495a2', }}>×{prdDetail.buyQuantity}</Text>
						</View>
						{batchNum && <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
							<Text style={{ fontSize: 12, color: '#8495a2', }}>批号: {batchNum}</Text>
						</View>}
					</View>
					<View style={styles.itemTotalInfo}>						
						<View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
							<Text style={{ fontSize: 12,color:'#666' }}>共 {rowData.kind} 种商品</Text>
							<Text style={{ fontSize: 12,color:'#666', marginLeft: 7 }}>实付款: </Text>
							<Text style={{ fontSize: 12,color:'#333',}}>¥</Text>
							<Text style={{ fontSize: 16,color:'#333'}}>{intPrice}</Text>
							<Text style={{ fontSize: 14,color:'#333'}}>.</Text>
							<Text style={{ fontSize: 14,color:'#333'}}>{dicimalPrice}</Text>
						</View>
					</View>
				</TouchableOpacity>
			{/*基础信息*/}
				{/*待付款*/}
				{rowData.orderStat == "待付款" && 
					<View style={styles.itemStat}>	
						<View style={{ flexDirection: 'row', backgroundColor: '#fff' }}>
							{cancelBtn}
							{payBtn}
						</View>
					</View>}
				
				{/*待发货*/}
				{rowData.orderStat == "待发货" &&
					<View style={styles.itemStat}>
						{waitSendCancelBtn}
						{noticeBtn}
					</View>}

				{/*发货中*/}
				{rowData.orderStat == "待收货" && rowData.isAllSend=='Y' &&
					<View style={styles.itemStat}>
						{logisticsBtn}
						{certainBtn}
					</View>}
				{/*分割发货*/}
				{rowData.orderStat == "待收货" && rowData.isAllSend !== 'Y' &&
					<View style={styles.itemStat}>
						{logisticsBtn}						
					</View>}
				{/*已完成*/}
				{rowData.orderStat == "已完成" &&
					<View style={styles.itemStat}>
						{remarkBtn}
						{returnBtn}
						{buyAgainBtn}
					</View>
				}
				{/*已取消*/}
				{rowData.orderStat == "已取消" && rowData.promotionTypeCode == 0 &&
					<View style={styles.itemStat}>
						{remarkBtn}						
						{buyAgainBtn}
					</View>
				}
			</View>
		)
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<RefreshableListView
					ref="list"
					style={{ flex: 1,backgroundColor:'#f5f5f5' }}
					fetchData={this.fetchData}
					scrollRenderAheadDistance={100} //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行。
					pageSize={10} // 每次事件循环（每帧）渲染的行数。
					initialListSize={0}
					onEndReachedThreshold={200}
					renderRow={this.renderRow}
					stickyHeaderIndices={[]}
					>
				</RefreshableListView>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	itemBtn:{ 
		height: 28,
		paddingHorizontal:10, 
		borderRadius: 3, 
		borderColor: '#0082ff', 
		borderWidth: 1 / PixelRatio.get(), 
		marginLeft: 8, 
		justifyContent: 'center', 
		alignItems: 'center' 
	},
	itemBtnGray:{ 
		paddingHorizontal:10, 
		height: 28, 
		marginLeft: 8, 
		borderRadius: 3, 
		borderColor: '#8e939a', 
		borderWidth: 1, 
		justifyContent: 'center', 
		alignItems: 'center' 
	},
	itemTotalInfo:{
		flexDirection: 'row', 
		justifyContent: 'flex-end', 
		alignItems: 'center', 
		paddingHorizontal: 13,
		marginTop:14,
		paddingBottom:13 
	},
	itemTintLab:{ 
		backgroundColor: '#fff3cb', 
		paddingHorizontal: 13, 
		height: 30, 
		justifyContent: 'center' 
	},
	itemStat:{ 
		backgroundColor: '#fff', 
		height: 37, 
		paddingHorizontal: 13, 
		flexDirection: 'row', 
		justifyContent: 'flex-end', 
		alignItems: 'flex-start'
	}
})
