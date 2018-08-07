/**
 * Created by timhuo on 2017/6/19.
 */
'use strict';
import React, {Component} from 'react';
import {
	DeviceEventEmitter,
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	Alert,
	InteractionManager, TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as stocksListActions from '../../stocksList/actions/stocksList';
import NavBar from "../../../public/widgets/nav/NavBar";
import RefreshableListView from "../../../public/widgets/listview/RefreshableListView";
import Line from "../../../public/widgets/line/Line";
import {sizeToFit} from "../../../public/widgets/line/sizeToFix";
import NumberChange from "../../../public/widgets/numberInput/NumberChange";
import MBtnCheck from "../../../public/widgets/line/MBtnCheck";
import {Toast,Loading} from "../../../public/widgets";
import Fetch from "../../../public/lib/Fetch";
import MaskModal from "../../../public/widgets/maskModal/MaskModal";
import ShoppingPopup from "./ShoppingPopup";
import ShoppingPlan from "./ShoppingPlan";

const Model = {normal: 0, edit: 2};
const configData = {
	selectSet: new Set(),
	canSelectCount: -1,
	canSelectSet: [],
	editSelectSet: new Set(),
	canEditSelectCount: -1,
	canEditSelectSet: [],
	numberArray: [],
	currentModel: Model.normal,
	purchaseTemplateId:0,
	realyData:null,
	hasInCards:new Set(),
};

//得到商品ID 查数量
function getNumberByPID(productId) {
	let filterA = configData.numberArray.filter((data) => {
		return data.productId === productId;
	});
	if (filterA.length <= 0) {
		return 0;
	} else {
		return filterA[0].num;
	}
}
function setNumberByPID(productId,skuID,num) {
	
	new Fetch({
		url:"app/fastBuy/upPurchaseTemplateItem.json",
		method: "POST",
		data: {
			purchaseTemplateId:configData.purchaseTemplateId,
			skuId:skuID,
			num:num
		},
	}).dofetch().then((data) => {
		
		let filterA = configData.numberArray.filter((data) => {
			return data.productId === productId;
		});
		if (filterA.length <= 0) {
		} else {
			filterA[0].num=num;
		}
		
		configData.canSelectSet = getCanSeletSet();
		configData.canSelectCount = configData.canSelectSet.size;
		//可选和已选交集
		configData.selectSet = new Set([...configData.canSelectSet].filter( x => configData.selectSet.has(x)));
		
		DeviceEventEmitter.emit('checkCount');
		DeviceEventEmitter.emit('refresh');
		
	}).catch((error) => {
		console.log("修改商品数量失败：", error);
	});
}

function getCanSeletSet() {
	
	let canSelectSet = configData.numberArray.filter((data)=>{
		return data.num<data.remainStock
	});
	let result = canSelectSet.map((data)=>{
		return data.productId;
	});
	return new Set(result)
}
function getDataDetailByPID(pidSet) {
	
	let filterA = configData.numberArray.filter((data) => {
		return pidSet.has(data.productId);
	});
	
	return filterA;
}

class PurchaseDetailList extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			selectAll: false,
			editSelectAll: false,
			currentModel: Model.normal,
			countPrice: 0.0,
		};
		
		configData.selectSet = new Set();
		configData.editSelectSet = new Set();
		configData.purchaseTemplateId = props.params.purid;
		
		this.openComponent = this.openComponent.bind(this);
		this.fetchData = this.fetchData.bind(this);
		this.renderRow = this.renderRow.bind(this);
		this.refreshRows = this.refreshRows.bind(this);
		this.onChangeModel = this.onChangeModel.bind(this);
		this.checkCurrent = this.checkCurrent.bind(this);
		this.changeCurrentModel = this.changeCurrentModel.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.dataInit = this.dataInit.bind(this);
		this.addToCart = this.addToCart.bind(this);
		this.addUsualBuyAction = this.addUsualBuyAction.bind(this);
		this.addPurListPlanAction = this.addPurListPlanAction.bind(this);
		
	}
	
	componentWillMount() {
		InteractionManager.runAfterInteractions(() => {
			this.refresh();
		});
		//单击 row 上的勾
		this.singleEvent = DeviceEventEmitter.addListener('singleTap', (({productId, state}) => {
			let selectSet = this.checkCurrent(Model.normal) ? configData.selectSet : configData.editSelectSet;
			if (state === true) {
				selectSet.add(productId);
			} else {
				selectSet.delete(productId);
			}
			DeviceEventEmitter.emit('checkCount');
		}).bind(this));
		
		//自动检测全选
		this.checkCountEvent = DeviceEventEmitter.addListener('checkCount', (() => {
			//检查是否全选
			let selectSet = configData.selectSet;
			let canSelectCount = configData.canSelectCount;
			
			if (this.checkCurrent(Model.edit)) {
				selectSet = configData.editSelectSet;
				canSelectCount = configData.canEditSelectCount;
			}
			
			let temp = false;
			if (canSelectCount === -1 || canSelectCount === 0) {
				temp = false
			}
			if (canSelectCount === selectSet.size) {
				temp = true
			} else {
				temp = false
			}
			
			let filterA = configData.numberArray.filter((data) => {
				return configData.selectSet.has(data.productId);
			});
			let countPrice = 0.0;
			filterA.map((data) => {
				countPrice += data.price * data.num
			});
			
			if (this.checkCurrent(Model.normal)) {
				this.setState({selectAll: temp, countPrice: countPrice});
			} else {
				this.setState({editSelectAll: temp, countPrice: countPrice});
			}
			
		}).bind(this));
		
		this.refreshEvent = DeviceEventEmitter.addListener('refresh', (() => {
			this.refreshRows();
		}).bind(this));
	}
	
	componentWillUnmount() {
		this.singleEvent.remove();
		this.checkCountEvent.remove();
		this.refreshEvent.remove();
	}
	
	refresh() {
		this.refs && this.refs.listView && this.refs.listView.pullRefresh();
	}
	
	openComponent(component, params) {
		if (component === null) {
			return;
		}
		this.props.navigator.push({
			component: component,
			params: params
		});
	};
	
	//数据初始化化
	dataInit(data){
		let len = data;
		
		//可选的 productId
		let endB = len.map((data) => {
			return data.productId;
		});
		//初始化数量数组
		let numbers = len.map((data) => {
			return {
				productId: data.productId,
				num: data.num,
				price: data.price,
				remainStock:data.remainStock,
				skuId: data.skuId,
				purchaseTemplateItemId:data.purchaseTemplateItemId
			};
		});
		
		configData.numberArray = numbers;
		
		configData.canSelectSet = getCanSeletSet();
		configData.canSelectCount = configData.canSelectSet.size;
		
		configData.canEditSelectSet = new Set(endB);
		configData.canEditSelectCount = configData.canEditSelectSet.size;
		
		configData.editSelectSet = new Set([...configData.canEditSelectSet]);
		configData.selectSet = new Set([...configData.canSelectSet]);
		
		DeviceEventEmitter.emit('checkCount');
		
		return len.length;
	}
	
	fetchData(page, success, error) {
		
		InteractionManager.runAfterInteractions(() => {
			new Fetch({
				url:"app/fastBuy/listPurchaseTemplateProducts.json",
				data:{purchaseTemplateId:this.props.params.purid}
			}).dofetch().then((data) => {
				
				let dataRealy = data.result;
				configData.realyData = dataRealy;
				let length =  this.dataInit(dataRealy);
				success(dataRealy, length, length);
				
			}).catch((error) => {
				Toast.show('网络异常');
				console.log('catch: ', error);
			});
		});
	}
	
	changeCurrentModel() {
		
		if (this.checkCurrent(Model.normal)) {
			this.setState({
				currentModel: Model.edit
			});
			configData.currentModel = Model.edit;
		} else {
			this.setState({
				currentModel: Model.normal
			});
			configData.currentModel = Model.normal;
		}
	}
	
	checkCurrent(module) {
		return configData.currentModel === module;
	}
	
	/** cell 初始化 */
	renderRow(rowData, title, index) {
		let hasSelect = false;
		
		let selectSet = configData.selectSet;
		let isEdit = false;
		if (this.checkCurrent(Model.edit)) {
			selectSet = configData.editSelectSet;
			isEdit = true;
		}
		if (selectSet !== null) {
			hasSelect = selectSet.has(rowData.productId);
		}
		
		return <PurchaseDetailRow
			checked={hasSelect}
			isEdit={isEdit}
			rowData={rowData}
			showShoppingPopup={
				((product) => {
					this.setState({
						modalProduct: product,
					});
					this.refs.shoppingModal.show();
				}).bind(this)
			}
		/>
	}
	
	refreshRows() {
		//只设置刷新全部列表，不做其他事情
		let rows = this.refs.listView.getRows();
		let newRows = rows.map((data) => {
			let row = Object.assign({}, data);
			return row;
		});
		this.refs.listView.setRows(newRows);
	}
	
	onChangeModel() {
		this.changeCurrentModel();
		DeviceEventEmitter.emit('checkCount');
		this.refreshRows()
	}
	
	/**
	 * 删除选中商品
	 */
	onDelete() {
		let selectedEditArr = Array.from(configData.editSelectSet);
		if (selectedEditArr.length <= 0) {
			Toast.show("请选择至少一个商品");
			return;
		}
		let purchaseTemplateId = configData.purchaseTemplateId;
		let skuIds = getDataDetailByPID(configData.editSelectSet);
		skuIds = skuIds.map((data)=>{
			return data.skuId;
		});
		Alert.alert('温馨提醒', '确定要删除所选的商品?', [
			{
				text: '取消', onPress: () => {
			}
			},
			{
				text: '确定', onPress: () => {
				Loading.show();
				new Fetch({
					url: "app/fastBuy/delPurchaseTemplateItems.json",
					method: "POST",
					data: {
						purchaseTemplateId: purchaseTemplateId,
						skuIds:skuIds.toString(),
					},
				}).dofetch().then((data) => {
					Loading.hide();
					Toast.show("删除成功");
					//更新列表
					let rows = [].concat(this.refs.listView.getRows());
					let newRows = [];
					rows.map((item)=>{
						if(!configData.editSelectSet.has(item.productId)){
							newRows.push(item);
						}
					});
					this.dataInit(newRows);
					this.refs.listView.setRows(newRows);
				}).catch((error) => {
					Loading.hide();
					console.log("删除选中商品失败：", error);
				});
			}
			}
		]);
	}
	
	addToCart(){
		let pItemIdArr = [];
		let buyNumArr = [];
		let index = 0;
		configData.numberArray.map((data)=>{
			if(configData.selectSet.has(data.productId)){
				pItemIdArr[index]=data.purchaseTemplateItemId;
				buyNumArr[index]=data.num;
				index++;
			}
		});
		
		if (pItemIdArr.length <= 0 || buyNumArr.length <= 0) {
			Toast.show("请选择至少一个商品");
			return;
		}
		Loading.show();
		
		new Fetch({
			url:"app/fastBuy/addPurchaseTemplateItemToCart.json",
			data:{itemIdNums:this.returnObjectIdQuantityStr(pItemIdArr, buyNumArr),}
		}).dofetch().then((data) => {
			Loading.hide();
			if (data.success===true){
				let index = 0;
				configData.numberArray.map((data)=>{
					if(configData.selectSet.has(data.productId)){
						configData.hasInCards.add(data.productId);
						index++;
					}
				});
				DeviceEventEmitter.emit('refresh');
			}
			
		}).catch((error) => {
			Loading.hide();
			Toast.show('网络异常');
			console.log('catch: ', error);
		});
	}
	
	addUsualBuyAction() {
		let skuIds = [];
		let index = 0;
		configData.numberArray.map((data)=>{
			if(configData.editSelectSet.has(data.productId)){
				skuIds[index]=data.skuId;
				index++;
			}
		});
		
		if (skuIds.length <= 0 || skuIds.length <= 0) {
			Toast.show("请选择至少一个商品");
			return;
		}
		Loading.show();
		new Fetch({
			url: "app/fastBuy/addPurchase.json",
			data: {
				skuIds: skuIds.toString(),
			}
		}).dofetch().then(() => {
			Toast.show("加入常购成功！");
		}).catch((err) => {
			console.log("加入常购失败：", err);
		}).finally(() => {
			Loading.hide();
		});
	}
	
	addPurListPlanAction(){
		let skuIdArr = [];
		let buyNumArr = [];
		let index = 0;
		configData.numberArray.map((data)=>{
			if(configData.editSelectSet.has(data.productId)){
				skuIdArr[index]=data.skuId;
				buyNumArr[index]=data.num;
				index++;
			}
		});
		
		if (skuIdArr.length <= 0 || buyNumArr.length <= 0) {
			Toast.show("请选择至少一个商品");
			return;
		}
		
		this.props.navigator.push({
			component : ShoppingPlan,
			params:{
				skuIds : skuIdArr,
				prdNums : buyNumArr
			}
		})
	}
	
	/**
	 * 组装objectIdQuantityStr参数，形式：skuId + "-" + buyNum + "," + ...
	 */
	returnObjectIdQuantityStr(skuIdArr, buyNumArr) {
		let objectIdQuantityStr = "";
		for (let i = 0; i < skuIdArr.length; i++) {
			objectIdQuantityStr += skuIdArr[i] + "_" + buyNumArr[i] + ",";
		}
		return objectIdQuantityStr;
	}
	
	render() {
		
		let normalFoot = (
			<View style={{height: sizeToFit(50), flexDirection: 'row', alignItems: 'center'}}>
				<Line style={{position: 'absolute', top: 0}}/>
				<MBtnCheck
					style={{height: 19, width: 19, margin: 15}}
					checked={this.state.selectAll}
					uncheckedImage={require("../res/purchasePrdList/000weigouxuan.png")}
					checkedImage={require("../res/purchasePrdList/000gouxuan_s.png")}
					disabledImage={require("../res/purchasePrdList/000weigouxuangray.png")}
					onChange={() => {
						let newSelectAll = !this.state.selectAll;
						if (newSelectAll === true) {
							configData.selectSet = new Set(configData.canSelectSet);
						} else {
							configData.selectSet.clear();
						}
						DeviceEventEmitter.emit('checkCount');
						this.refreshRows();
					}}
				/>
				<Text>全选</Text>
				<Text style={{flex: 1, textAlign: "right", fontSize: 13, marginRight: 15}}>
					总计
					<Text style={{color: "orange"}}>￥{this.state.countPrice}</Text>
				</Text>
				<TouchableOpacity
					onPress={()=>{this.addToCart()}}
					style={{width: sizeToFit(110), height: sizeToFit(50), backgroundColor: "#34457D", justifyContent: 'center'}}>
					<Text style={{color: "white", alignSelf: 'center'}}>加入进货单</Text>
				</TouchableOpacity>
			</View>
		);
		
		let editFoot = (
			<View style={{height: sizeToFit(50), flexDirection: 'row', alignItems: 'center'}}>
				<Line style={{position: 'absolute', top: 0}}/>
				<MBtnCheck
					style={{height: 19, width: 19, margin: 15}}
					checked={this.state.editSelectAll}
					uncheckedImage={require("../res/purchasePrdList/000weigouxuan.png")}
					checkedImage={require("../res/purchasePrdList/000gouxuan_s.png")}
					disabledImage={require("../res/purchasePrdList/000weigouxuangray.png")}
					onChange={() => {
						let newSelectAll = !this.state.editSelectAll;
						if (newSelectAll === true) {
							configData.editSelectSet = new Set(configData.canEditSelectSet);
						} else {
							configData.editSelectSet.clear();
						}
						DeviceEventEmitter.emit('checkCount');
						this.refreshRows();
					}}
				/>
				<Text>全选</Text>
				<View style={{position: 'absolute', right: 0, flexDirection: 'row', paddingTop: 7}}>
					<TouchableOpacity onPress={()=>this.addUsualBuyAction()}>
						<View style={{alignItems: 'center', width: sizeToFit(65)}}>
							<View style={{width: sizeToFit(20), height: sizeToFit(20), backgroundColor: '#99C9F0'}}/>
							<Text style={{marginTop: 3, fontSize: 11}}>加常购</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={()=>this.addPurListPlanAction()}>
						<View style={{alignItems: 'center', width: sizeToFit(65)}}>
							<View style={{width: sizeToFit(20), height: sizeToFit(20), backgroundColor: '#99C9F0'}}/>
							<Text style={{marginTop: 3, fontSize: 11}}>加计划</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={this.onDelete}>
						<View style={{alignItems: 'center', width: sizeToFit(65)}}>
							<View style={{width: sizeToFit(20), height: sizeToFit(20), backgroundColor: '#99C9F0'}}/>
							<Text style={{marginTop: 3, fontSize: 11}}>删除</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		);
		
		let number = this.state.modalProduct ? getNumberByPID(this.state.modalProduct.productId) : 0;
		return (
			<View style={{flex: 1, backgroundColor: '#fff',}}>
				<NavBar navigator={this.props.navigator}
				        leftBtnStyle={{width: 10, height: 17, tintColor: '#444'}}
				        title={{title: '采购中西药材', style: {fontSize: 18}, tintColor: '#333333'}}
				        mainColor={'#fafafa'}
				        leftBtnHandler={()=>{
					        this.props.navigator.pop();
					        this.props.params.reloadCallBack && this.props.params.reloadCallBack();
				        }}
				        rightButton={
					        <View style={{alignSelf: 'center', marginRight: 10}}>
						        <TouchableOpacity onPress={this.onChangeModel}>
							        <Text style={styles.leftBtnStyle}>{this.checkCurrent(Model.normal) ? '编辑' : '完成'}</Text>
						        </TouchableOpacity>
					        </View>
				        }
				/>
				<Line />
				<RefreshableListView
					style={{backgroundColor: "#f5f5f5"}}
					ref="listView"
					pageSize={5}
					initialListSize={5}
					autoRefresh={true}
					autoLoadMore={true}
					refreshable={false}
					fetchData={this.fetchData}
					renderRow={this.renderRow}
					renderSeparator={this._renderSeparator}
					scrollRenderAheadDistance={100}
					onEndReachedThreshold={200}
					stickyHeaderIndices={[]}
					openCheckNetwork={false}
				/>
				{this.checkCurrent(Model.normal) ? normalFoot : editFoot}
				{/* 购买弹层 */}
				<MaskModal
					ref="shoppingModal"
					viewType="full"
					animationType='slide'
					contentView={
						<ShoppingPopup {...this.state.modalProduct}
						               num={number}
						               shoppingModal={this.refs.shoppingModal}
						               changeValue={
						               	(changeValue,productid,skuId) => {
							                setNumberByPID(productid,skuId,changeValue);
						                }
						               }
						/>
					}
				>
				</MaskModal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	rowTitleStyle: {
		marginTop: sizeToFit(17),
		marginLeft: 7,
		marginRight: 15,
		fontSize: sizeToFit(16),
		color: "#333",
	},
	rowDetailStyle: {
		marginTop: sizeToFit(13),
		marginLeft: 7,
		marginRight: 15,
		fontSize: sizeToFit(13),
		color: "#666",
	},
	rowGrayStyle: {
		fontSize: sizeToFit(13),
		color: "#666",
	},
});

class PurchaseDetailRow extends Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			isEdit: props.isEdit,						//是否编辑状态
			checked: props.checked,           //选中状态
		}
	}
	
	componentWillReceiveProps(nextProps) {
		this.setState({
			checked: nextProps.checked,
			isEdit: nextProps.isEdit,
		})
	}
	
	//已经下架
	renderDown(data) {
		return (
			<View style={{backgroundColor: "#fff", flexDirection: 'row', marginBottom: 9}}>
				<MBtnCheck
					style={{height: 19, width: 19, margin: 15, marginTop: 38}}
					checked={this.state.checked}
					enable={this.state.isEdit ? true : false}
					uncheckedImage={require("../res/purchasePrdList/000weigouxuan.png")}
					checkedImage={require("../res/purchasePrdList/000gouxuan_s.png")}
					disabledImage={require("../res/purchasePrdList/000weigouxuangray.png")}
					onChange={() => {
						let newCheck = !this.state.checked;
						this.setState({checked: newCheck});
						DeviceEventEmitter.emit('singleTap', {productId: data.productId, state: newCheck});
					}}
				/>
				<View style={{flex: 1, marginBottom: 15}}>
					<Text style={[styles.rowTitleStyle, {color: "#AAAEB9"}]}>{data.productNm}</Text>
					<Text style={[styles.rowDetailStyle, {color: "#AAAEB9"}]}>规格:{data.specPack}</Text>
					<Text style={[styles.rowDetailStyle, {color: "#AAAEB9"}]}>厂家:{data.factory}</Text>
				</View>
				<Image style={{width: 65, height: 65, marginRight: 15, alignSelf: 'center'}}
				       source={require("../res/purchasePrdList/057yixiajia.png")}/>
			</View>
		)
	}
	
	renderNormal(error, data) {
		
		let errorCom = null;
		
		let resultCountCom = null;
		let countInternet = parseInt(getNumberByPID(data.productId));
		if (error) {
			errorCom = (
				<Text style={[styles.rowGrayStyle, {
					flex: 1,
					margin: 15,
					marginLeft: 0,
					textAlign: 'left',
					justifyContent: 'center',
					color: "red",
					fontSize: 10
				}]}>{error.detail}</Text>
			);
		} else {
			let textMesaage = configData.hasInCards.has(data.productId)?'加入进货单成功':'';
			let price = data.price * countInternet;
			resultCountCom = (
				<View style={{flexDirection:'row'}}>
					<Text style={[styles.rowGrayStyle, {
						flex: 1,
						margin: 15,
						marginLeft: 0,
						textAlign: 'left',
						justifyContent: 'center',
						color: "orange",
					}]}>{textMesaage}</Text>
					<Text
						style={[styles.rowGrayStyle, {flex: 1, margin: 15, textAlign: 'right', justifyContent: 'center'}]}>
						小计：
						<Text style={{color: "orange"}}>￥{price}</Text>
					</Text>
				</View>
			)
		}
		let st = data.limitNum>0?{margin: 15,marginBottom:4}:{margin: 15};
		let en = error===undefined?true:!!this.state.isEdit;
		return (
			<View style={{backgroundColor: "#fff", flexDirection: 'row', marginBottom: 9}}>
				<MBtnCheck
					style={{height: 19, width: 19, margin: 15, marginTop: 38}}
					checked={this.state.checked}
					enable={en}
					uncheckedImage={require("../res/purchasePrdList/000weigouxuan.png")}
					checkedImage={require("../res/purchasePrdList/000gouxuan_s.png")}
					disabledImage={require("../res/purchasePrdList/000weigouxuangray.png")}
					onChange={() => {
						if (en){
							let newCheck = !this.state.checked;
							this.setState({checked: newCheck});
							DeviceEventEmitter.emit('singleTap', {productId: data.productId, state: newCheck});
						}
					}}
				/>
				<View style={{flex: 1}}>
					<Text style={styles.rowTitleStyle}>{data.productNm}</Text>
					<Text style={styles.rowDetailStyle}>规格:{data.specPack}</Text>
					<Text style={styles.rowDetailStyle}>厂家:{data.factory}</Text>
					<View style={{backgroundColor: "#eee", marginTop: sizeToFit(15), flexDirection: 'row', marginRight: 15}}>
						<View style={{flex: 1, padding: 9, paddingLeft: 15, justifyContent: 'space-around'}}>
							<Text>￥{data.price}</Text>
							<Text style={styles.rowGrayStyle}>库存:{data.remainStockRange}</Text>
						</View>
						
						<View style={{alignItems:'center'}}>
							<NumberChange
								style={st}
								value={countInternet}
								min={0}
								onTextClick={() => {
									this.props.showShoppingPopup(data);
								}}
								max={data.limitNum > 0 ? data.limitNum : undefined}
								minusIcon={require("../res/purchasePrdList/000jianqu.png")}
								minusDisabledIcon={require("../res/purchasePrdList/000jianqu_d.png")}
								plusIcon={require("../res/purchasePrdList/000tianjia.png")}
								plusDisabledIcon={require("../res/purchasePrdList/000tianjia_d.png")}
								inputProps={{editable: true, disabled: true}}
								increment={1}
								onChange={(value) => {
									if (value>=data.remainStock){
										if(this.state.checked===true){
											let newCheck = !this.state.checked;
											this.setState({checked: newCheck});
											DeviceEventEmitter.emit('singleTap', {productId: data.productId, state: newCheck});
										}
									}
									setNumberByPID(data.productId,data.skuId,value)
								}}
							/>
							{(data.limitNum > 0) && <Text style={{marginBottom:7,fontSize: 10, color: "#ff8a00"}} >限购{data.limitNum}件</Text>}
						</View>
					</View>
					{errorCom}
					{resultCountCom}
				</View>
			</View>
		);
	}
	
	render() {
		let rowData = this.props.rowData;
		let error = rowData.error;
		if (error) {
			if (error.code) {
				return this.renderDown(rowData);
			}
		}
		
		let countInternet = parseInt(getNumberByPID(rowData.productId));
		if (countInternet>=rowData.remainStock){
			error={detail:"当前库存不足"}
		}
		return this.renderNormal(error, rowData);
		
	}
}

export default PurchaseDetailList;