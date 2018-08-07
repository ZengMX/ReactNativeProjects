import React, { Component } from 'react';
import {
	View,
	ScrollView,
	Dimensions,
	Navigator,
	TouchableOpacity,
	Image,
	ListView,
	PixelRatio,
	Platform,
	Alert,
	InteractionManager
} from "react-native";
import {
	Fetch, 
	Themes,
	imageUtil,
	ValidateUtil
} from 'future/src/lib';
import {
	BaseView, 
	Text,
	Toast,
	RefreshableListView,
	Loading,
	NumberChange,
	DataController,
	MaskModal
} from 'future/src/widgets';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

import _ from "underscore"
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as shoppingCartActions from 'future/src/shoppingCart/actions/ShoppingCart';

import ProductDetail from 'future/src/product/components/ProductDetail';
import ShoppingCart from 'future/src/shoppingCart/components/ShoppingCart';
import ShoppingPopup from './ShoppingPopup';

import styles from '../styles/PurchasePrdList';

var fullWidth = require('Dimensions').get('window').width;
var fullHeight = require('Dimensions').get('window').height;
class PurChasePrdList extends Component{
	constructor(props){
		super(props);
		this.state = {
			num : 0,			//常购商品数量
			isEdit : false,		//是否编辑状态（true为编辑状态，false为普通状态）
			isSelectAll : true,	//是否全选（默认全选，不包括缺货等异常商品）
			// isEmpty : false,	//清单是否为空（true显示空状态页面，false显示正常页面）
			totalPrice : 0,		//总计

			selectedNorMap : {},		//记录普通状态已选中商品skuId、购买数量
			selectedEditMap : {},		//记录编辑状态已选中商品skuId
			type : 0		//根据type判断显示内容（加载中：0、列表：1、空：2）
		}
		this.canSelectLength = 0;		//可选择商品数量
		this.canEditLength = 0;			//可编辑商品数量
		this.count = 0;					//总计（用于计算，为this.state.totalPrice赋值）
	}

	componentWillUnmount(){
		//有回调的情况下执行回调
		this.props.params && this.props.params.callback && this.props.params.callback();
	}

	/**
	 * 设置listData
	 */
	changeType(type){
		this.setState({
			type : type
		})
	}

	/**
	 * 加入购物车
	 */
	addToCart(){
		let skuIdArr = _.keys(this.state.selectedNorMap);
		let buyNumArr = _.values(this.state.selectedNorMap);
		if (skuIdArr.length <= 0 || buyNumArr.length <= 0) {
			Toast.show("请选择至少一个商品");
			return;
		}
		let cartData = {
			type : "normal",
			handler : "sku",
			objectIdQuantityStr : this.returnObjectIdQuantityStr(skuIdArr, buyNumArr),
		};
		Loading.show();
		this.props.actions.addItemsToCart(cartData, (data)=>{
			Loading.hide();
			this.addToCartFeedback(data);
		}, ()=>{
			Loading.hide();
		});
	}
	
	/**
	 * 组装objectIdQuantityStr参数
	 */
	returnObjectIdQuantityStr(skuIdArr, buyNumArr) {
		let objectIdQuantityStr = "";
		// let skuIdArr = _.keys(this.state.selectedNorMap);
		// let buyNumArr = _.values(this.state.selectedNorMap);
		for (let i = 0; i < skuIdArr.length; i++) {
			objectIdQuantityStr += skuIdArr[i] + "-" + buyNumArr[i] + ",";
		}
		return objectIdQuantityStr;
	}

	/**
	 * 加入进货单反馈
	 */
	addToCartFeedback(data){
		let rows = [].concat(this.refs.list.getRows());
		let selectedSkuIdArr = _.keys(this.state.selectedNorMap);

		_.each(selectedSkuIdArr, (item)=>{
			//changeData 用于改变rowData属性
			let changeData = {};
			let feedback = "";
			let isAddToCartSucc = false;
			let succItem = _.find(data.cart, (cartItem)=>{
				return cartItem.skuId == item;
			})
			
			let errItem = _.find(data.errMsg, (errMsgItem)=>{
				return errMsgItem.skuId == item;
			})

			let index = _.findIndex(rows, (row)=>{
				return row.skuId == item;
			});

			let row = Object.assign({}, rows[index]);

			if(errItem){
				if(errItem.errorCode === "0"){
					//下架
					//变为不可选状态、显示下架状态视图
					changeData.isOnSale = false;
					changeData.isSelected = false;
					delete this.state.selectedNorMap[errItem.skuId];
					this.count = (Number(this.count) - Number(row.totalPrice)).toFixed(2);
				} else if(errItem.errorCode === "1"){
					//库存不足
					//库存显示变化
					changeData.remainStockRange = errItem.stockRange;
					feedback = errItem.error;
				} else if(errItem.errorCode === "2"){
					//限购
					feedback = errItem.error;
				} else if(errItem.errorCode === "3"){
					//控销
					feedback = errItem.error.replace("该商品", errItem.productNm);
				} else if(errItem.errorCode === "4"){
					//禁销
					feedback = "抱歉，该商品在禁销期间不允许购买";
				} else {
					//其它错误信息
					feedback = errItem.error;
				}
				isAddToCartSucc = false;
			} else {
				feedback = "加入进货单成功";
				isAddToCartSucc = true;
			}
			changeData.isAddToCartSucc = isAddToCartSucc;
			changeData.feedback = feedback;
			row = Object.assign({}, row, changeData);
			rows[index] = row;
		});
		this.refs.list.setRows(rows);
		this.setState({
			totalPrice : this.count
		});
	}

	/**
	 * 删除选中商品
	 */
	onDelete(){
		let selectedEditArr = _.keys(this.state.selectedEditMap);
		if (selectedEditArr.length <= 0) {
			Toast.show("请选择至少一个商品");
			return;
		}
		let purchaseListIds = this.returnPurchaseListIds(selectedEditArr);
		Alert.alert('温馨提醒', '确定要删除所选的商品?', [
			{ text: '取消', onPress: () => { } },
			{
				text: '确定', onPress: () => {
					Loading.show();
					new Fetch ({
						url : "/app/user/delPurchaseList.json",
						method : "POST",
						data : {
							purchaseListIds : purchaseListIds
						},
					}).dofetch().then((data)=>{
						Loading.hide();
						Toast.show("删除成功");
						this.canEditLength = this.canEditLength - selectedEditArr.length;
						this.canSelectLength = this.canSelectLength - selectedEditArr.length;
						let rows = [].concat(this.refs.list.getRows());
						let newRows = [];
						_.map(rows, (item) => {
							if(_.has(this.state.selectedEditMap, item.purchaseListId)){
								if(item.isSelected){
									this.count = (Number(this.count) - Number(item.totalPrice)).toFixed(2);
								}
								delete this.state.selectedNorMap[item.skuId];
								delete this.state.selectedEditMap[item.purchaseListId];
							}else{
								newRows.push(item);
							}
						});
						this.refs.list.setRows(newRows);
						this.setState({
							type : (this.canEditLength <= 0) ? 2 : 1,
							num : this.canEditLength,
							totalPrice : this.count
						})
					}).catch((error) => {
						Loading.hide();
						console.log("删除选中商品失败：", error);
					});
				}
			}
		]);
	}

	/**
	 * 组装purchaseListIds参数,以","隔开
	 */
	returnPurchaseListIds(arr) {
		let purchaseListIds = "";
		_.each(arr, function(item) {
			purchaseListIds += item + ",";
		});
		return purchaseListIds;
	}

	/**
	 * 全选
	 * @param value
	 */
	onSelectAll(value) {
		
		let count = 0;
		let rows = [].concat(this.refs.list.getRows());
		if(this.state.isEdit){
			_.map(rows, (item,index)=>{
				let row = Object.assign({}, rows[index]);
				row = Object.assign({}, row, { isEditSelected: value });
				rows[index] = row;
				value && (this.state.selectedEditMap[rows[index].purchaseListId] = rows[index].itemIndex);
			})
			!value && (this.state.selectedEditMap = {});
			this.refs.list.setRows(rows);
			this.setState({
				isSelectAll : value,
				selectedEditMap : this.state.selectedEditMap
			})

		}else{
			_.map(rows, (item,index)=>{
				if(rows[index].isOutOfStock != "Y" && rows[index].isOnSale != "N" && rows[index].isBannedProduct != "Y"){
					let row = Object.assign({}, rows[index]);
					row = Object.assign({}, row, { isSelected: value });
					rows[index] = row;
					value && (this.state.selectedNorMap[rows[index].skuId] = rows[index].buyNum);
					count = (Number(count) + Number(rows[index].totalPrice)); 
				}
			})
			if(value){
				this.count = count;
			}else{
				this.count = 0;
				this.state.selectedNorMap = {};
			}
			this.refs.list.setRows(rows);
			this.setState({
				isSelectAll : _.keys(this.state.selectedNorMap).length > 0 ? value : false,
				totalPrice : this.count.toFixed(2),
				selectedNorMap : this.state.selectedNorMap
			})
		}
		
	}
	
	/**
	 * 单选（分普通状态、编辑状态）
	 * @param 
	 * data :{
	 * 	isSelected		//是否选中
	 * 	skuId			//商品skuId
	 * 	purchaseListId	//商品purchaseListId(编辑状态用)
	 * 	buyNum			//购买数量(普通状态用)
	 * 	changeValue		//价格变化(此处为加减商品小计)(普通状态用)
	 * 	itemIndex		//商品位置(下标)
	 * }
	 */
	onSelect(data) {
		if(this.state.isEdit){
			this.updateListViewRowData({isEditSelected: data.isSelected}, data.itemIndex)
			//更新主类state
			let isSelectAll = false;
			if (data.isSelected) {
				this.state.selectedEditMap[data.purchaseListId] = data.itemIndex;
				if(_.size(this.state.selectedEditMap) == this.canEditLength){
					isSelectAll = true;
				}
			} else {
				delete this.state.selectedEditMap[data.purchaseListId];
			}
			this.setState({
				selectedEditMap : this.state.selectedEditMap,
				isSelectAll : isSelectAll
			})
		}else{
			this.updateListViewRowData({isSelected: data.isSelected}, data.itemIndex)
			//更新主类state
			let isSelectAll = false;
			this.count = (Number(this.count) + Number(data.changeValue)).toFixed(2);
			if (data.isSelected) {
				this.state.selectedNorMap[data.skuId] = data.buyNum;
				if(_.size(this.state.selectedNorMap) == this.canSelectLength){
					isSelectAll = true;
				}
			} else {
				delete this.state.selectedNorMap[data.skuId];
			}
			this.setState({
				selectedNorMap : this.state.selectedNorMap,
				totalPrice : this.count,
				isSelectAll : isSelectAll
			})
		}
	}

	/**
	 * 商品数量或勾选状态改变时更新底部总计及selectedNorMap
	 * @param changeValue
	 * @param selectedNorMap
	 * @param prdTotalPrice
	 * @param itemIndex
	 * @param buyNum
	 */
	onBuyNumChange(changeValue, selectedNorMap, prdTotalPrice, itemIndex, buyNum){
		//更新列表数据
		this.updateListViewRowData({totalPrice: prdTotalPrice, buyNum: buyNum}, itemIndex)
		//更新主类state
		this.count = (Number(this.count) + Number(changeValue)).toFixed(2);
		this.setState({
			totalPrice : this.count,
			selectedNorMap : selectedNorMap
		})
	}

	/**
	 * 更新单个列表数据
	 */
	updateListViewRowData(data, itemIndex){
		let rows = [].concat(this.refs.list.getRows());
		let row = Object.assign({}, rows[itemIndex]);
		row = Object.assign({}, row, data);
		rows[itemIndex] = row;
		this.refs.list.setRows(rows);
	}

	/**
	 * 设置可选商品数量、初始总计、已选商品Map（普通状态）
	 * @param count
	 * @param canSelectLength
	 * @param canEditLength
	 * @param selectedNorMap
	 * @param selectedEditMap
	 */
	setMainData(count, canSelectLength, canEditLength, selectedNorMap, selectedEditMap){
		this.count = Number(count).toFixed(2);
		this.canSelectLength = canSelectLength;
		this.canEditLength = canEditLength;
		this.setState({
			num : canEditLength,
			totalPrice : this.count,
			selectedNorMap : selectedNorMap,
			selectedEditMap : selectedEditMap
		})
	}

	/**
	 * 前往商品详情
	 */
	goProductDetail(productId){
		this.props.navigator.push({
			component: ProductDetail,
			params : {
				productId : productId
			}
		});
	}

	/**
	 * 渲染navbar右边按钮
	 */
	renderRightNavBtn(){
		let cartNum = this.props.cartNum;
		let messageNumImg = require('future/src/home/res/home/000shuzibeijing_22x22.png');
		if(cartNum > 0 && cartNum < 10){
			messageNumImg = require('future/src/home/res/home/000shuzibeijing_22x22.png');
		}else if(cartNum >= 10 && cartNum < 100){
			messageNumImg = require('future/src/home/res/home/000shuzibeijing_36x22.png');
		}else if(cartNum >= 100){
			messageNumImg = require('future/src/home/res/home/000shuzibeijing_46x22.png');
		}
		return (
			<View style={styles.navbarContainer}>
				{/* 编辑 */}
				{
					!this.props.params.isFast && <TouchableOpacity
					activeOpacity={0.7}
					onPress={()=>{
						let rows = [].concat(this.refs.list.getRows());
						_.map(rows, (item,index)=>{
							let row = Object.assign({}, rows[index]);
							row = Object.assign({}, row, { isEdit: !this.state.isEdit });
							rows[index] = row;
						})
						let isSelectAll = !this.state.isEdit ? (_.size(this.state.selectedEditMap) == this.canEditLength) : (_.size(this.state.selectedNorMap) == this.canSelectLength)
						this.refs.list.setRows(rows);
						this.setState({
							isEdit : !this.state.isEdit,
							isSelectAll : isSelectAll
						})
					}}>
						<Text style={styles.leftBtn}>{this.state.isEdit ? "完成" : "编辑"}</Text>
					</TouchableOpacity>
				}
				{/* 前往购物车 */}
				<TouchableOpacity
				onPress={() => {
					//TODO 类型未传递
					this.props.navigator.push({
						component: ShoppingCart,
					})
				}}
				activeOpacity={0.7}>
					<Image style={styles.rightBtnImg} source={require('future/src/product/res/images/ProductDetail/000jinhuodan.png')}>
						{(cartNum > 0) && <Image style={styles.rightBtnNumImg} source={messageNumImg}>
							<Text style={styles.rightBtnNum} numberOfLines={1}>{cartNum >= 100 ? "99+" : cartNum}</Text>
						</Image>}
					</Image>
				</TouchableOpacity>
			</View>
		)
	}

	/**
	 * 渲染底部视图
	 */
	renderBottomView(){
		let allImg = (this.state.isSelectAll && _.keys(this.state.selectedNorMap).length > 0) ? require('../res/purchasePrdList/000gouxuan_s.png') : require('../res/purchasePrdList/000weigouxuan.png')
		return (
			<View style={styles.bottomViewContainer}>
				<TouchableOpacity style={styles.selectAllBtn}
					activeOpacity={0.7}
					onPress={()=>{
						this.onSelectAll(!this.state.isSelectAll);
					}}>
					<Image style={styles.selectAllImg} source={allImg}></Image>
					<Text style={styles.selectAllText}>全选</Text>
				</TouchableOpacity>
				{
					this.state.isEdit ? 
					<View style={styles.editBottomView}>
						<TouchableOpacity style={styles.delBtn}
							activeOpacity={0.7}
							onPress={()=>{
								// Toast.show("删除");
								this.onDelete();
							}}>
							<Image style={styles.delBtnImg} source={require('../res/purchasePrdList/065shanchu.png')}></Image>
							<Text style={styles.delBtnText}>删除</Text>
						</TouchableOpacity>
					</View>
					: <View style={styles.noEditBottomView}>
						<Text style={{marginRight: 8}} numberOfLines={1}
						text={[
						{ value: "总计:", style: {fontSize: 14, color: "#53606a"} },
						{ value: "￥", style: {fontSize: 11, color: "#ff8a00"} },
						{ value: this.state.totalPrice, style: {fontSize: 18, color: "#ff8a00"} },
						]}></Text>
						<TouchableOpacity style={styles.addToCartBtn}
						activeOpacity={0.7}
						onPress={()=>{
							this.addToCart();
						}}>
							<Text style={{ color: "#fff", fontSize:13,}}>加入进货单</Text>
						</TouchableOpacity>
					</View>
				}
			</View>
		)
	}
	
	render(){
		let title = this.state.type === 1 ? "常购品种(" + this.state.num + ")" : "常购品种";
		return (
			<BaseView navigator={this.props.navigator}
				ref='base'
				rightButton={ this.state.type === 1 ? this.renderRightNavBtn() : undefined}
				title={{title: title, tintColor: "#fff"}}>
					{!this.canEditLength && <DataController />}
					<View style={styles.container}>
						<List
						ref="list"
						changeType={(type)=>{this.changeType(type)}}
						selectedNorMap={this.state.selectedNorMap}
						selectedEditMap={this.state.selectedEditMap}
						setMainData={(count, canSelectLength, canEditLength, selectedNorMap, selectedEditMap)=>{this.setMainData(count, canSelectLength, canEditLength, selectedNorMap, selectedEditMap)}}
						onSelect={(data)=>{this.onSelect(data)}}
						goProductDetail={(productId)=>{this.goProductDetail(productId)}}
						showShoppingPopup={(product, itemIndex)=>{
							this.setState({
								modalProduct : product,
								itemIndex : itemIndex
							});
							this.refs.shoppingModal.show();
						}}
						onBuyNumChange={(changeValue, selectedNorMap, prdTotalPrice, itemIndex, buyNum)=>{this.onBuyNumChange(changeValue, selectedNorMap, prdTotalPrice, itemIndex, buyNum)}}/>
						{ this.state.type === 1 && this.renderBottomView() }
					</View>
					<View style={{overflow:"hidden", height: this.state.type === 2 ? fullHeight : 0 , width: fullWidth, backgroundColor: "#f2f4f5", alignItems:"center", position: "absolute", top: 0 }}>
						<Image style={{marginTop:130}} source={require('../res/purchasePrdList/changgou_kong.png')}></Image>
						<Text style={{fontSize: 14, color: "#999", marginTop: 10, marginBottom: 10}}>您还没有常购清单哦!</Text>
						{
							this.props.params.isFast && <TouchableOpacity
							style={{width: 105, height: 35, backgroundColor:"#3491df", justifyContent: "center", alignItems: "center", borderColor: "#3491df", borderWidth: 1/PixelRatio.get(), borderRadius: 5}}
							activeOpacity={0.7}
							onPress={()=>{
								RCTDeviceEventEmitter.emit('changeTabBarIdx', { idx: 1, goTop: true });
							}} >
								<Text style={{fontSize: 13, color: "#fff"}} >返回速购</Text>
							</TouchableOpacity>
						}
					</View>
					{/* 购买弹层 */}
					<MaskModal
						ref="shoppingModal"
						viewType="full"
						animationType='slide'
						contentView={<ShoppingPopup product={this.state.modalProduct}
							itemIndex={this.state.itemIndex}
							selectedNorMap={this.state.selectedNorMap}
							onBuyNumChange={(changeValue, selectedNorMap, prdTotalPrice, itemIndex, buyNum)=>{this.onBuyNumChange(changeValue, selectedNorMap, prdTotalPrice, itemIndex, buyNum)}}
							shoppingModal={this.refs.shoppingModal}/>}>
						></MaskModal>
			</BaseView>
		)
	}
}

class List extends Component{
	constructor(props){
		super();
	}

	setRows(rows){
		this.refs.listView.setRows(rows);
	}

	getRows(){
		return this.refs.listView.getRows();
	}

	_fetchData(page, success, error){
		//礼让动画
		InteractionManager.runAfterInteractions(() => {
			//动画执行完毕再执行
			new Fetch ({
				url : "/app/fastBuy/purchasePrdList.json",
				mothod : 'POST',
			}).dofetch().then((data)=>{
				let result = data.result;
				let count = 0;	//计算总计
				let canSelectLength = 0;
				this.props.changeType(result.length>0 ? 1 : 2);
				//遍历商品，确认异常商品(下架/缺货/禁销商品)
				//异常商品不计入总计、不可选中、不计入可选长度
				for(let i = 0; i < result.length; i++){
					if((result[i].isOutOfStock != "Y" && result[i].isOnSale != "N" && result[i].isBannedProduct != "Y")){
						//为列表商品数据添加参数
						//购买数量：buyNum
						//是否编辑状态：isEdit
						//普通状态是否选中（默认选中）：isSelected
						//编辑状态是否选中（默认不选）：isEditSelected
						//小计：totalPrice
						result[i].isEdit = false;
						result[i].isSelected = true;
						result[i].isEditSelected = false;
						result[i].buyNum = !(result[i].isUnbundled == "Y") ? result[i].midPackTotal : 1;
						result[i].totalPrice = result[i].price * result[i].buyNum;
						result[i].prdLimit = result[i].limit;
						result[i].feedback = "";
						result[i].isAddToCartSucc = false;

						canSelectLength++;
						count += result[i].price * result[i].buyNum;
						this.props.selectedNorMap[result[i].skuId] = result[i].buyNum;
					} else {
						result[i].isSelected = false;
					}
				}
				this.props.setMainData(count, canSelectLength, result.length, this.props.selectedNorMap, {});
				success(result, 5 * (page - 1) + result.length, result.length);
			})
			.catch((err)=>{
				error && error();
				console.log("常购清单数据获取错误：",err);
			});
		});
	}

	_renderRow(rowData, sectionID, rowID){
		return (
			<PrdItem key={rowID}
			itemIndex={rowID}
			selectedNorMap={this.props.selectedNorMap}
			selectedEditMap={this.props.selectedEditMap}

			isEdit={rowData.isEdit}
			isSelected={rowData.isSelected}
			isEditSelected={rowData.isEditSelected}
			isOnSale={rowData.isOnSale == "Y"}
			isOutOfStock={rowData.isOutOfStock == "Y"}
			isBannedProduct={rowData.isBannedProduct == "Y"}
			isUnbundled={rowData.isUnbundled == "Y"}

			prdPrice={rowData.price}
			prdName={rowData.title}
			prdSpecPack={rowData.specPack}
			prdFactory={rowData.factory}
			prdRemainStockRange={rowData.remainStockRange}
			prdTotalPrice={rowData.totalPrice}
			prdLimit={rowData.prdLimit}
			prdMidPackTotal={rowData.midPackTotal}
			prdUnit={rowData.unit}

			skuId={rowData.skuId}
			purchaseListId={rowData.purchaseListId}
			buyNum={rowData.buyNum}

			feedback={rowData.feedback}
			isAddToCartSucc={rowData.isAddToCartSucc}

			onBuyNumChange={(changeValue, selectedNorMap, prdTotalPrice, itemIndex, buyNum)=>{
				this.props.onBuyNumChange(changeValue, selectedNorMap, prdTotalPrice, itemIndex, buyNum);
			}}
			goProductDetail={()=>{this.props.goProductDetail(rowData.productId)}}
			showShoppingPopup={()=>{this.props.showShoppingPopup && this.props.showShoppingPopup(rowData, rowID);}}
			onSelect={(data)=>{
				this.props.onSelect(data);
			}}/>
		);
	}

	_renderSeparator(sectionID, rowID){
		return(
			<View key={rowID} style={{ backgroundColor: '#f2f4f5', height: 10 }}></View>
		)
	}

	render(){
		return (
			<RefreshableListView
			style={{width: fullWidth, flex: 1}}
			ref="listView"
			pageSize={5}
			initialListSize={5}
			autoRefresh={true}
			autoLoadMore={true}
			refreshable={false}
			fetchData={this._fetchData.bind(this)}
			renderRow={this._renderRow.bind(this)}
			renderSeparator={this._renderSeparator}
			scrollRenderAheadDistance={100}
			onEndReachedThreshold={200}
			stickyHeaderIndices={[]}
			openCheckNetwork={false}
			/>
		)
	}
}

class PrdItem extends Component{
	//特殊状态：缺货、下架、禁销
	constructor(props){
		super(props);
		this.state = {
			// isEdit : this.props.isEdit,						//是否编辑状态
			// isOnSale : this.props.isOnSale,					//是否在售
			// isOutOfStock : this.props.isOutOfStock,			//是否缺货
			// isBannedProduct : this.props.isBannedProduct,	//是否禁销
			// isUnbundled : this.props.isUnbundled,			//是否可拆零

			// prdPrice : this.props.prdPrice,					//商品价格
			// prdName : this.props.prdName,					//商品名
			// prdSpecPack : this.props.prdSpecPack,			//商品规格
			// prdFactory : this.props.prdFactory,				//商品厂家
			// prdRemainStockRange : this.props.prdRemainStockRange,//商品库存
			// prdTotalPrice : this.props.prdTotalPrice,		//小计
			// prdLimit : this.props.prdLimit,						//限购
			// prdMidPackTotal : this.props.prdMidPackTotal,		//中包装

			// skuId : this.props.skuId,						//skuId
			// purchaseListId : this.props.purchaseListId,		//purchaseListId
			// buyNum : this.props.buyNum,				//购买数量

			// feedback: "",									//加入进货单反馈
			// isAddToCartSucc: false,							//是否加入进货单成功
		}
	}

	/**
	 * 数量控制
	 */
	_onChange(buyNum){
		let num = buyNum;
		if(buyNum > this.props.prdLimit && this.props.prdLimit > 0){
			Toast.show("该商品限购" + this.props.prdLimit + "件");
		}
		// if(!this.props.isUnbundled && buyNum > 0){
		// 	num = ValidateUtil.fixedNum(buyNum, this.props.prdMidPackTotal);
		// }
		this.timer && clearTimeout(this.timer);
		this.timer = setTimeout(()=>{
			let changeValue = num > 0 ? (num * this.props.prdPrice - this.props.prdTotalPrice) : 0;
			let selectedNorMap = this.props.selectedNorMap;
			selectedNorMap[this.props.skuId] = num;
			this.props.onBuyNumChange && this.props.onBuyNumChange(changeValue, selectedNorMap, num > 0 ? (num * this.props.prdPrice) : 0, this.props.itemIndex, num);
		},200); 
	}

	/**
	 * 渲染普通状态商品
	 */
	renderNormalPrd(){
		let isSelected = this.props.isSelected;
		let selImg = isSelected ? require('../res/purchasePrdList/000gouxuan_s.png') : require('../res/purchasePrdList/000weigouxuan.png')
		let stateImg = require('../res/purchasePrdList/057yixiajia.png');
		let showState = false;
		if(this.props.isOnSale){
			if(this.props.isOutOfStock){
				stateImg = require('../res/purchasePrdList/057quehuo.png');
				showState = true;
			}
		} else {
			showState = true;
		}
		let priceColor = (showState || this.props.isBannedProduct) ? "#999" : "#ff8a00"
		return (
			<View style={{}}>
				{/* 商品顶部视图 */}
				<View style={styles.topView}>
					<TouchableOpacity
					style={{width: 50, height: 105, justifyContent: "center", alignItems: "center"}}
					activeOpacity={1}
					onPress={()=>{
						if(showState || this.props.isBannedProduct){
							return;
						}
						this.props.onSelect({
							isSelected : !isSelected,
							skuId : this.props.skuId,
							buyNum : this.props.buyNum,
							changeValue : !isSelected ? this.props.prdTotalPrice : -this.props.prdTotalPrice,
							itemIndex : this.props.itemIndex,
						});
					}} >
						<Image style={styles.selectAllImg} source={selImg}></Image>
					</TouchableOpacity>
					<View style={{flex: 1}}>
						<TouchableOpacity
						style={{height:68, justifyContent: 'space-between', paddingTop: 13}}
						activeOpacity={1}
						onPress={()=>{
							this.props.goProductDetail();
						}} >
							<Text style={{fontSize: 14, color: (showState || this.props.isBannedProduct) ? "#999" : "#0c1828"}} numberOfLines={1}>{this.props.prdName}</Text>
							<Text style={{fontSize: 10, color: "#8495a2"}} numberOfLines={1}>规格 : {this.props.prdSpecPack}</Text>
							<Text style={{fontSize: 10, color: "#8495a2"}} numberOfLines={1}>厂家 : {this.props.prdFactory}</Text>
						</TouchableOpacity>
						<View style={{height: 37, justifyContent:'center'}}>
							<Text style={{marginRight: 8}} numberOfLines={1}
							text={[
							{ value: this.props.isBannedProduct ? "" : "￥", style: {fontSize: 10, color: priceColor} },
							{ value: this.props.isBannedProduct ? "该商品禁销" : (this.props.prdPrice).toFixed(2), style: {fontSize: 13, color: priceColor} },
							]}></Text>
						</View>
					</View>
					<View style={{ alignItems: "center", marginRight: 10}}>
						<Image style={{ width: 76, height: showState ? 76.5 : 0}} source={stateImg}></Image>
					</View>
				</View>
				{/* 商品底部视图 */}
				{ 
					isSelected && <View style={styles.bottomView}>
						<View style={{flex: 1, height: 55, backgroundColor: "#fafafa", paddingHorizontal: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
							<View style={{height: 55, justifyContent: "space-between", paddingVertical: 8}}>
								<Text style={{marginRight: 8}} numberOfLines={1}
								text={[
								{ value: "￥", style: {fontSize: 10, color: "#53606a"} },
								{ value: (this.props.prdPrice).toFixed(2), style: {fontSize: 13, color: "#53606a"} },
								]}></Text>
								<Text style={{fontSize: 12, color: "#323232"}} numberOfLines={1}>库存:{this.props.prdRemainStockRange}</Text>
							</View>
							<View style={{alignItems:"center"}}>
								<NumberChange
								value={this.props.buyNum.toString()}
								min={!this.props.isUnbundled ? this.props.prdMidPackTotal : 1}
								onTextClick={()=>{
									this.props.showShoppingPopup();
								}}
								max={this.props.prdLimit > 0 ? this.props.prdLimit : undefined}
								minusIcon={require("../res/purchasePrdList/000jianqu.png")}
								minusDisabledIcon={require("../res/purchasePrdList/000jianqu_d.png")}
								plusIcon={require("../res/purchasePrdList/000tianjia.png")}
								plusDisabledIcon={require("../res/purchasePrdList/000tianjia_d.png")}
								inputProps={{ editable: true, disabled: true }}
								increment={!this.props.isUnbundled ? this.props.prdMidPackTotal : 1}
								onChange={(value) => this._onChange(value)}
								/>
								{(this.props.prdLimit > 0) && <Text style={{fontSize: 10, color: "#ff8a00"}} >限购{this.props.prdLimit}件</Text>}
							</View>
						</View>
						<View style={{flex: 1, height: 40, marginTop: 15, borderTopWidth: 1/PixelRatio.get(), borderTopColor: "#e5e5e5", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
							<Text style={{fontSize: 9, flex: 1, color: this.props.isAddToCartSucc ? "#ff8a00" : "#e82f2f"}} numberOfLines={2}>{this.props.feedback}</Text>
							<Text style={{marginRight: 8}} numberOfLines={1}
							text={[
							{ value: "小计:￥", style: {fontSize: 10, color: "#53606a"} },
							{ value: (this.props.prdTotalPrice).toFixed(2), style: {fontSize: 14, color: "#53606a"} },
							]}></Text>
						</View>
					</View>
				}
			</View>
		)
	}

	/**
	 * 渲染编辑状态商品
	 */
	renderEditPrd(){
		let isSelected = this.props.isEditSelected;
		let selImg = isSelected ? require('../res/purchasePrdList/000gouxuan_s.png') : require('../res/purchasePrdList/000weigouxuan.png')
		let priceColor = (this.props.isBannedProduct) ? "#999" : "#ff8a00"
		return (
			<View style={{}}>
				{/* 商品顶部视图 */}
				<View style={styles.topView}>
					<TouchableOpacity
					style={{width: 50, height: 105, justifyContent: "center", alignItems: "center"}}
					activeOpacity={1}
					onPress={()=>{
						this.props.onSelect({
							isSelected : !isSelected,
							skuId : this.props.skuId,
							itemIndex : this.props.itemIndex,
							purchaseListId : this.props.purchaseListId,
						});
					}} >
						<Image style={styles.selectAllImg} source={selImg}></Image>
					</TouchableOpacity>
					<View style={{flex: 1}}>
						<TouchableOpacity
						style={{height:68, justifyContent: 'space-between', paddingTop: 13}}
						activeOpacity={1}
						onPress={()=>{
							this.props.goProductDetail();
						}} >
							<Text style={{fontSize: 14, color: "#0c1828"}} numberOfLines={1}>{this.props.prdName}</Text>
							<Text style={{fontSize: 10, color: "#8495a2"}} numberOfLines={1}>规格 : {this.props.prdSpecPack}</Text>
							<Text style={{fontSize: 10, color: "#8495a2"}} numberOfLines={1}>厂家 : {this.props.prdFactory}</Text>
						</TouchableOpacity>
						<View style={{height: 37, justifyContent:'center'}}>
							<Text style={{marginRight: 8}} numberOfLines={1}
							text={[
							{ value: this.props.isBannedProduct ? "" : "￥", style: {fontSize: 10, color: priceColor} },
							{ value: this.props.isBannedProduct ? "该商品禁销" : (this.props.prdPrice).toFixed(2), style: {fontSize: 13, color: priceColor} },
							]}></Text>
						</View>
					</View>
				</View>
			</View>
		)
	}

	render(){
		return (
			<View style={styles.prdContainer}>
				{this.props.isEdit ? this.renderEditPrd() : this.renderNormalPrd()}
			</View>
		)
	}
}

function mapStateToProps(state) {
	return {
		cartNum: state.ShoppingCart.shoppingCartNum,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({...shoppingCartActions}, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(PurChasePrdList);