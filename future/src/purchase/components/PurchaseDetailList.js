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
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as stocksListActions from '../../stocksList/actions/stocksList';
import NavBar from "../../../public/widgets/nav/NavBar";
import RefreshableListView from "../../../public/widgets/listview/RefreshableListView";
import Line from "../../../public/widgets/line/Line";
import {sizeToFit} from "../../../public/widgets/line/sizeToFix";
import NumberChange from "../../../public/widgets/numberInput/NumberChange";
import MBtnCheck from "../../../public/widgets/line/MBtnCheck";
import {Toast, Loading} from "../../../public/widgets";
import Fetch from "../../../public/lib/Fetch";
import MaskModal from "../../../public/widgets/maskModal/MaskModal";
import ShoppingPopup from "./ShoppingPopup";
import ShoppingPlan from "./ShoppingPlan";
import MDataController from "../../../public/widgets/controller/MDataController";

class PurchaseDetailList extends Component {
	
	constructor(props) {
		super(props);
		this.isEdit = false;
		this.state = {
			selectAll: false,
			editSelectAll: false,
			countPrice: 0.0,
			selectSet: new Set(),
			canSelectSet: [],
			editSelectSet: new Set(),
			canEditSelectSet: [],
			numberArray: [],
			purchaseTemplateId: props.params.purid,
			realyData: null,
			hasInCards: new Set(),
			isEdit: false,
			loading: null,
		};
		
		this.openComponent = this.openComponent.bind(this);
		this.fetchData = this.fetchData.bind(this);
		this.renderRow = this.renderRow.bind(this);
		this.refreshRows = this.refreshRows.bind(this);
		this.onChangeModel = this.onChangeModel.bind(this);
		this.changeCurrentModel = this.changeCurrentModel.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.dataInit = this.dataInit.bind(this);
		this.addToCart = this.addToCart.bind(this);
		this.addUsualBuyAction = this.addUsualBuyAction.bind(this);
		this.addPurListPlanAction = this.addPurListPlanAction.bind(this);
		
	}
	
	componentWillMount() {
		//单击 row 上的勾
		this.singleEvent = DeviceEventEmitter.addListener('singleTap',
			(({productId, state}) => {
				let selectSet = !this.isEdit ? this.state.selectSet : this.state.editSelectSet;
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
			let selectSet = this.state.selectSet;
			let canSelectSet = this.state.canSelectSet;
			
			if (this.isEdit) {
				selectSet = this.state.editSelectSet;
				canSelectSet = this.state.canEditSelectSet;
			}
			
			let temp = false;
			if (canSelectSet.size === selectSet.size) {
				temp = true
			} else {
				temp = false
			}
			
			let filterA = this.state.numberArray.filter((data) => {
				return this.state.selectSet.has(data.productId);
			});
			let countPrice = 0.0;
			filterA.map((data) => {
				countPrice += data.price * data.num
			});
			
			if (this.isEdit) {
				this.setState({editSelectAll: temp});
			} else {
				this.setState({selectAll: temp, countPrice: countPrice});
			}
			
		}).bind(this));
		
		this.refreshEvent = DeviceEventEmitter.addListener('refresh', (() => {
			this.refreshRows();
		}).bind(this));
		
		this.changeNumberEvent = DeviceEventEmitter.addListener('changeNumber',
			(({productId, skuID, num}) => {
				new Fetch({
					url: "app/fastBuy/upPurchaseTemplateItem.json",
					method: "POST",
					data: {
						purchaseTemplateId: this.state.purchaseTemplateId,
						skuId: skuID,
						num: num
					},
				}).dofetch().then((data) => {
					
					let tempNumberArray = this.state.numberArray.map((data) => {
						if (data.productId === productId) {
							data.num = num;
						}
						return data;
					});
					
					let canSelectSet = this.getCanSeletSet();
					//可选和已选交集
					let selectSet = new Set([...canSelectSet].filter(x => this.state.selectSet.has(x)));
					
					this.state.canSelectSet = canSelectSet;
					this.state.selectSet = selectSet;
					this.state.numberArray = tempNumberArray;
					
					DeviceEventEmitter.emit('checkCount');
					DeviceEventEmitter.emit('refresh');
					
				}).catch((error) => {
					console.log("修改商品数量失败：", error);
				});
			}).bind(this));
	}
	
	componentWillUnmount() {
		this.singleEvent.remove();
		this.checkCountEvent.remove();
		this.refreshEvent.remove();
		this.changeNumberEvent.remove();
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
	dataInit(data) {
		
		//可选的 productId
		let endB = data.map((data) => {
			return data.productId;
		});
		//初始化数量数组
		let numbers = data.map((data) => {
			return {
				productId: data.productId,
				num: data.num,
				price: data.price,
				remainStock: data.remainStock,
				skuId: data.skuId,
				purchaseTemplateItemId: data.purchaseTemplateItemId
			};
		});
		
		let canSelectSet = numbers.filter((data) => {
			return data.num < data.remainStock
		});
		let result = canSelectSet.map((data) => {
			return data.productId;
		});
		
		this.setState({
			numberArray: numbers,
			canSelectSet: new Set([...result]),
			canEditSelectSet: new Set(endB),
			editSelectSet: new Set(endB),
			selectSet: new Set([...result]),
			selectAll: true,
			editSelectAll: true,
		});
		
		DeviceEventEmitter.emit('checkCount');
		
		return data.length;
	}
	
	fetchData(page, success, error) {
		
		InteractionManager.runAfterInteractions(() => {
			new Fetch({
				url: "app/fastBuy/listPurchaseTemplateProducts.json",
				data: {purchaseTemplateId: this.props.params.purid}
			}).dofetch().then((data) => {
				
				this.setState({loading: ['1']});
				
				let dataRealy = data.result;
				let length = this.dataInit(dataRealy);
				success(dataRealy, length, length);
				
			}).catch((error) => {
				
				this.setState({loading: ['1']});
				
				Toast.show('网络异常');
				console.log('catch: ', error);
			});
		});
	}
	
	changeCurrentModel() {
		
		if (this.isEdit) {
			this.setState({
				isEdit: false
			});
			this.isEdit = false;
		} else {
			this.setState({
				isEdit: true
			});
			this.isEdit = true;
		}
	}
	
	//得到商品ID 查数量
	getNumberByPID(productId) {
		let filterA = this.state.numberArray.filter((data) => {
			return data.productId === productId;
		});
		if (filterA.length <= 0) {
			return 0;
		} else {
			return filterA[0].num;
		}
	}
	
	getCanSeletSet() {
		
		let canSelectSet = this.state.numberArray.filter((data) => {
			return data.num < data.remainStock
		});
		let result = canSelectSet.map((data) => {
			return data.productId;
		});
		return new Set(result)
	}
	
	getDataDetailByPID(pidSet) {
		
		let filterA = this.state.numberArray.filter((data) => {
			return pidSet.has(data.productId);
		});
		
		return filterA;
	}
	
	/** cell 初始化 */
	renderRow(rowData, title, index) {
		let hasSelect = false;
		
		let selectSet = this.state.selectSet;
		let isEdit = false;
		if (this.isEdit) {
			selectSet = this.state.editSelectSet;
			isEdit = true;
		}
		if (selectSet !== null) {
			hasSelect = selectSet.has(rowData.productId);
		}
		
		let number = this.getNumberByPID(rowData.productId);
		let hasInCar = this.state.hasInCards.has(rowData.productId);
		
		return <PurchaseDetailRow
			checked={hasSelect}
			isEdit={isEdit}
			rowData={rowData}
			number={number}
			hasInCar={hasInCar}
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
		let selectedEditArr = Array.from(this.state.editSelectSet);
		if (selectedEditArr.length <= 0) {
			Toast.show("请选择至少一个商品");
			return;
		}
		let purchaseTemplateId = this.state.purchaseTemplateId;
		let skuIds = this.getDataDetailByPID(this.state.editSelectSet);
		skuIds = skuIds.map((data) => {
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
						skuIds: skuIds.toString(),
					},
				}).dofetch().then((data) => {
					Loading.hide();
					Toast.show("删除成功");
					//更新列表
					let rows = [].concat(this.refs.listView.getRows());
					let newRows = [];
					rows.map((item) => {
						if (!this.state.editSelectSet.has(item.productId)) {
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
	
	addToCart() {
		let pItemIdArr = [];
		let buyNumArr = [];
		let index = 0;
		this.state.numberArray.map((data) => {
			if (this.state.selectSet.has(data.productId)) {
				pItemIdArr[index] = data.purchaseTemplateItemId;
				buyNumArr[index] = data.num;
				index++;
			}
		});
		
		if (pItemIdArr.length <= 0 || buyNumArr.length <= 0) {
			Toast.show("请选择至少一个商品");
			return;
		}
		Loading.show();
		
		new Fetch({
			url: "app/fastBuy/addPurchaseTemplateItemToCart.json",
			data: {itemIdNums: this.returnObjectIdQuantityStr(pItemIdArr, buyNumArr),}
		}).dofetch().then((data) => {
			Loading.hide();
			if (data.success === true) {
				let tempHasInCards = new Set(this.state.hasInCards);
				this.state.numberArray.map((data) => {
					if (this.state.selectSet.has(data.productId) && !tempHasInCards.has(data.productId)) {
						tempHasInCards.add(data.productId);
					}
				});
				this.setState({
					hasInCards: tempHasInCards
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
		this.state.numberArray.map((data) => {
			if (this.state.editSelectSet.has(data.productId)) {
				skuIds[index] = data.skuId;
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
	
	addPurListPlanAction() {
		let skuIdArr = [];
		let buyNumArr = [];
		let index = 0;
		this.state.numberArray.map((data) => {
			if (this.state.editSelectSet.has(data.productId)) {
				skuIdArr[index] = data.skuId;
				buyNumArr[index] = data.num;
				index++;
			}
		});
		
		if (skuIdArr.length <= 0 || buyNumArr.length <= 0) {
			Toast.show("请选择至少一个商品");
			return;
		}
		
		this.props.navigator.push({
			component: ShoppingPlan,
			params: {
				skuIds: skuIdArr,
				prdNums: buyNumArr
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
						console.log("=======>", newSelectAll);
						let selectSet = null;
						if (newSelectAll === true) {
							selectSet = new Set(this.state.canSelectSet);
						} else {
							selectSet = new Set();
						}
						this.state.selectSet = selectSet;
						
						DeviceEventEmitter.emit('checkCount');
						this.refreshRows();
					}}
				/>
				<Text>全选</Text>
				<Text style={{flex: 1, textAlign: "right", fontSize: 13, marginRight: 15}}>
					总计
					<Text style={{color: "orange"}}>￥{this.state.countPrice.toFixed(2)}</Text>
				</Text>
				<TouchableOpacity
					onPress={() => {
						this.addToCart()
					}}
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
						let editSelectSet = null;
						if (newSelectAll === true) {
							editSelectSet = new Set(this.state.canEditSelectSet);
						} else {
							editSelectSet = new Set();
						}
						this.state.editSelectSet = editSelectSet;
						DeviceEventEmitter.emit('checkCount');
						this.refreshRows();
					}}
				/>
				<Text>全选</Text>
				<View style={{position: 'absolute', right: 0, flexDirection: 'row', paddingTop: 7}}>
					<TouchableOpacity onPress={() => this.addUsualBuyAction()}>
						<View style={{alignItems: 'center', width: sizeToFit(65)}}>
							<Image style={{width: sizeToFit(20), height: sizeToFit(20)}}
							       source={require('../res/purchasePrdList/065jiachanggou.png')}/>
							<Text style={{marginTop: 3, fontSize: 11}}>加常购</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.addPurListPlanAction()}>
						<View style={{alignItems: 'center', width: sizeToFit(65)}}>
							<Image style={{width: sizeToFit(20), height: sizeToFit(20)}}
							       source={require('../res/purchasePrdList/065jiajihua.png')}/>
							<Text style={{marginTop: 3, fontSize: 11}}>加计划</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={this.onDelete}>
						<View style={{alignItems: 'center', width: sizeToFit(65)}}>
							<Image style={{width: sizeToFit(20), height: sizeToFit(20)}}
							       source={require('../res/purchasePrdList/065shanchu.png')}/>
							<Text style={{marginTop: 3, fontSize: 11}}>删除</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		);
		
		let number = this.state.modalProduct ? this.getNumberByPID(this.state.modalProduct.productId) : 0;
		return (
			<View style={{flex: 1, backgroundColor: '#fff',}}>
				<NavBar navigator={this.props.navigator}
				        leftBtnStyle={{width: 10, height: 17, tintColor: '#444'}}
				        title={{title: this.props.params.title, style: {fontSize: 18}, tintColor: '#333333'}}
				        mainColor={'#fafafa'}
				        leftBtnHandler={() => {
					        this.props.navigator.pop();
					        this.props.params.reloadCallBack && this.props.params.reloadCallBack();
				        }}
				        rightButton={
					        <View style={{alignSelf: 'center', marginRight: 10}}>
						        <TouchableOpacity onPress={this.onChangeModel}>
							        <Text style={styles.leftBtnStyle}>{!this.isEdit ? '编辑' : '完成'}</Text>
						        </TouchableOpacity>
					        </View>
				        }
				/>
				<Line />
				<View style={{flex: 1}}>
					<RefreshableListView
						style={{backgroundColor: "#f5f5f5", flex: 1}}
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
					{!this.isEdit ? normalFoot : editFoot}
					
					<MDataController
						style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'white'}}
						data={this.state.loading}
					/>
				</View>
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
							               (changeValue, productid, skuId) => {
								               DeviceEventEmitter.emit('changeNumber', {
									               productId: productid,
									               skuID: skuId,
									               num: changeValue
								               });
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
					enable={!!this.state.isEdit}
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
		let countInternet = parseInt(this.props.number);
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
			let textMesaage = this.props.hasInCar ? '加入进货单成功' : '';
			let price = data.price * countInternet;
			resultCountCom = (
				<View style={{flexDirection: 'row'}}>
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
						<Text style={{color: "orange"}}>￥{price.toFixed(2)}</Text>
					</Text>
				</View>
			)
		}
		let st = data.limitNum > 0 ? {margin: 15, marginBottom: 4} : {margin: 15};
		let en = error === undefined ? true : !!this.state.isEdit;
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
						if (en) {
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
							<Text>￥{data.price.toFixed(2)}</Text>
							<Text style={styles.rowGrayStyle}>库存:{data.remainStockRange}</Text>
						</View>
						
						<View style={{alignItems: 'center'}}>
							<NumberChange
								style={st}
								value={countInternet}
								min={1}
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
									if (value >= data.remainStock) {
										if (this.state.checked === true) {
											let newCheck = !this.state.checked;
											this.setState({checked: newCheck});
											DeviceEventEmitter.emit('singleTap', {productId: data.productId, state: newCheck});
										}
									}
									DeviceEventEmitter.emit('changeNumber', {productId: data.productId, skuID: data.skuId, num: value});
								}}
							/>
							{(data.limitNum > 0) &&
							<Text style={{marginBottom: 7, fontSize: 10, color: "#ff8a00"}}>限购{data.limitNum}件</Text>}
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
		
		let countInternet = parseInt(this.props.number);
		if (countInternet >= rowData.remainStock) {
			error = {detail: "当前库存不足"}
		}
		return this.renderNormal(error, rowData);
		
	}
}

export default PurchaseDetailList;