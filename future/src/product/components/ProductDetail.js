import React, { Component } from 'react';
import {
	View,
	ScrollView,
	Dimensions,
	StyleSheet,
	Navigator,
	TouchableOpacity,
	TouchableHighlight,
	Image,
	PixelRatio,
	Modal,
	TextInput,
	Platform,
	findNodeHandle
} from 'react-native';
import {
	Fetch,
	imageUtil,
	ValidateUtil
} from 'future/public/lib';
import {
	BaseView,
	Banner,
	Text,
	Toast,
	Page,
	DataController,
	MaskModal,
	Loading,
	TextInputC,
	CheckBox,StarRating,
} from 'future/public/widgets';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import _ from 'underscore';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as stocksListActions from '../../stocksList/actions/stocksList';
import PhotoBrowser from '@imall-test/react-native-photobrowser'
import ProductDetailOther from './productDetailOther'
import PreSalesAdvice from './PreSalesAdvice'
import FrontToast from 'react-native-easy-toast';
import SupplierHome from '../../supplierHome/components/SupplierHome';
import SignIn from "../../member/components/Login";
import Styles from 'future/public/lib/styles/Styles';
import CookieManager from 'react-native-cookiemanager';
import MoreOperation from '../../commons/moreOperation/components/MoreOperation';
import StocksList from "../../stocksList/components/StocksList";
import Comment from "./comment";

var fullWidth = require('Dimensions').get('window').width;
var fullHeight = require('Dimensions').get('window').height;

var scrollViewHeight = fullHeight - 52 - 64;

// 倒计时
class Countdown extends Component {
	constructor(props) {
		super(props);
		this.state = {
			leftSeconds: this.props.leftSeconds / 1000,
			countdown: {
				dayStr: 0,
				hourStr: 0,
				minuteStr: 0,
				secondStr: 0,
			}
		}
		this.endData = this._endData.bind(this);
	}

	componentDidMount() {
		//开启倒计时
		this.timer = setInterval(
			() => { this.startChangeTime(); },
			1000
		);
	}
	componentWillUnmount() {
		//关闭倒计时
		this.timer && clearInterval(this.timer);
	}

	startChangeTime() {
		if (this.state.leftSeconds == null || this.state.leftSeconds == '') {
			return;
		}
		let leftSecondsInt = parseInt(this.state.leftSeconds);
		if (leftSecondsInt <= 0) {
			this.timer && clearInterval(this.timer);
			return;
		}
		this.setState({
			leftSeconds: leftSecondsInt == 0 ? 0 : --leftSecondsInt
		})
	}

	renderCountDown(leftSeconds) {
		this.state.countdown.dayStr = Math.floor(leftSeconds / (60 * 60 * 24));
		this.state.countdown.hourStr = Math.floor((leftSeconds - this.state.countdown.dayStr * 24 * 60 * 60) / 3600);
		this.state.countdown.minuteStr = Math.floor((leftSeconds - this.state.countdown.dayStr * 24 * 60 * 60 - this.state.countdown.hourStr * 3600) / 60);
		this.state.countdown.secondStr = Math.floor(leftSeconds - this.state.countdown.dayStr * 24 * 60 * 60 - this.state.countdown.hourStr * 3600 - this.state.countdown.minuteStr * 60);
	}

	_dealHMS() {
		let time = {
			d: this.state.countdown.dayStr,
			h: this.state.countdown.hourStr,
			m: this.state.countdown.minuteStr,
			s: this.state.countdown.secondStr
		};
		if (time.d < 10) {
			time.d = '0' + time.d;
		}
		if (time.h < 10) {
			time.h = '0' + time.h;
		}
		if (time.m < 10) {
			time.m = '0' + time.m;
		}
		if (time.s < 10) {
			time.s = '0' + time.s;
		}
		return time;
	}
	_endData() {
		return this.state.leftSeconds;
	}
	render() {
		this.renderCountDown(this.state.leftSeconds);
		let time = this._dealHMS();
		return (
			<View>
				{
					this.state.leftSeconds > 0 ?
						<View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
							<View style={{ borderRadius: 3, width: 18, height: 18, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e7141a' }}><Text style={{ fontSize: 13, color: '#fff' }}>{time.d}</Text></View>
							<View style={{ borderRadius: 3, paddingHorizontal: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 9, color: '#e7141a' }}>天</Text></View>
							<View style={{ borderRadius: 3, width: 18, height: 18, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e7141a' }}><Text style={{ fontSize: 13, color: '#fff' }}>{time.h}</Text></View>
							<View style={{ borderRadius: 3, paddingHorizontal: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 10, color: '#e7141a' }}>:</Text></View>
							<View style={{ borderRadius: 3, width: 18, height: 18, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e7141a' }}><Text style={{ fontSize: 13, color: '#fff' }}>{time.m}</Text></View>
							<View style={{ borderRadius: 3, paddingHorizontal: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 14, color: '#e7141a' }}>:</Text></View>
							<View style={{ borderRadius: 3, width: 18, height: 18, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e7141a' }}><Text style={{ fontSize: 13, color: '#fff' }}>{time.s}</Text></View>
						</View> :
						<Text style={{ color: '#fff', fontSize: 11, backgroundColor: 'transparent', alignSelf: 'flex-end' }}>活动已结束</Text>
				}
			</View>

		)
	}
}

//价格


//业务员不可在商品详情代客加常购、加计划、加进货单（PC可以，APP、Wap不行）
class ShoppingPopup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			product: this.props.product || null,
			sku: this.props.sku || null,
			unitPrice: this.props.price,
			limitNum: this.props.product.amountDetailVo.limitBuy,
			buyNum: '1',
			cursorShow: false,

		}
		this.setBuyNum = this.setBuyNum.bind(this);
	}

	blink() {
		this.setState({ cursorShow: !this.state.cursorShow });
	}

	// componentWillReceiveProps(nextProps) {		
	//     if (nextProps.KeyboardShow) {
	//         this.setState({inputFocus: true});
	//     }else{
	//         this.setState({inputFocus: false});
	// 	}
	// }
	componentDidMount() {
		this.timer = setInterval(
			() => {
				this.blink();
			},
			1000
		);
	}

	//关闭光标闪烁
	componentWillUnmount() {
		this.timer && clearInterval(this.timer);
	}

	addToCart() {
		let product = this.state.product;
		let buyNum = Number(this.state.buyNum) || 0;
		if (buyNum <= 0 || !ValidateUtil.isNumber(buyNum)) {
			this.props.shoppingModal.toast("请输入正确购买数量");
			return;
		}
		if ((product.isUnbundled == "N") && (buyNum % product.midPackTotal != 0)) {
			this.props.shoppingModal.toast("该商品不可拆零,已自动调整数量");
			// fixedNum(buyNum);
			this.setState({
				buyNum: ValidateUtil.fixedNum(buyNum, product.midPackTotal).toString()
			});
			return;
		}
		let cartData = {
			type: "normal",
			handler: "sku",
			objectId: this.state.sku,
			quantity: buyNum,

		};
		this.props.shoppingModal.showLoading();
		this.props.actions.addToCart(cartData, () => {
			this.props.actions.getCart();
			this.props.shoppingModal.hideLoading();
			this.props.shoppingModal.hide();
			this.props.showJoin();
		},
			(err) => {
				console.log("加入购物车异常提示", err);
				let toastContent = "";
				if (err.name == "Error") {
					if (err.message == "timeout") {
						toastContent = "网络连接超时";
					}
					if (err.message == "noNetwork") {
						toastContent = "网络连接异常，请检查网络设置";
					}
				} else {
					err.object && (toastContent = err.object.errorText);
				}
				this.props.shoppingModal.toast(toastContent);
				this.props.shoppingModal.hideLoading();
			});
	}

	setBuyNum(num) {
		let buyNum = this.state.buyNum + num;
		// 限制采购数量，让Text框不会变形
		if(buyNum.length > 11) {
			this.refs.toast.show('该商品单次添加数量已达上限');
			return
		}	
		if (this.state.limitNum > 0) {
			if (Number(buyNum) > this.state.limitNum) {
				this.refs.toast.show('该商品限购数量为' + this.state.limitNum);
				this.setState({ buyNum: this.state.limitNum + '' });
			} else {
				this.setState({ buyNum: buyNum });
			}
		} else {
			this.setState({ buyNum: buyNum });
		}
	}

	closeModal = () => {
		this.props.shoppingModal.hide();
	}

	render() {
		let product = this.state.product;
		let price = (this.state.unitPrice * this.state.buyNum).toFixed(2);
		let pTip = "￥";
		let buyNum = this.state.buyNum;
		return (
			<View style={[styles.shoppingView, { backgroundColor: '#fff' }]}>
				<View style={{ height: 142, paddingHorizontal: 12 }}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
						<Text style={{ color: "#333", fontSize: 14 }}>采购数量</Text>
						<Text style={{ color: "#333", fontSize: 11 }}>中包装: {product.midPackTotal}/{product.isUnbundled == "N" ? "不可拆零" : "可拆零"}；库存：{product.remainStockRange}</Text>
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingVertical: 5 }}>
						<View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
							<TouchableOpacity style={{ height: 56, flexDirection: 'row', alignItems: 'flex-end', paddingBottom: 4 }}
								onPress={() => { }}>
								<Text style={{ fontSize: 40, marginLeft: 2, color: this.state.buyNum == '' ? '#e5e5e5' : '#ff6600' }}>{this.state.buyNum == '' ? '0' : this.state.buyNum}</Text>
								{this.state.cursorShow && <View style={[{ position: 'absolute', top: 8, height: 40, width: 2, backgroundColor: 'blue' }, this.state.buyNum == '' ? { left: 0 } : { right: 17 }]} />}
								<Text style={{ color: "#c9d1de", fontSize: 14, marginLeft: 5, marginBottom: 8 }}>{product.productUnit || "盒"}</Text>
							</TouchableOpacity>
						</View>
						{this.state.limitNum > 0 ?
							<Text text={[
								{ value: '限购数量', style: { fontSize: 13, color: "#333" } },
								{ value: this.state.limitNum, style: { fontSize: 12, color: "#ff6600" } },
							]}>
							</Text> : <View />
						}
					</View>
					<View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 12, borderTopWidth: 1 / PixelRatio.get(), borderColor: '#e5e5e5', marginTop: 0, alignItems: 'center' }}>
						<Text text={[
							{ value: '小计：', style: { fontSize: 12, color: "#999" } },
							{ value: pTip + price, style: { fontSize: 15, color: "#333" } },
						]}>
						</Text>
						<Text text={[
							{ value: '采购价：', style: { fontSize: 13, color: "#999" } },
							{ value: pTip + this.state.unitPrice, style: { fontSize: 15, color: "#333" } },
						]}>
						</Text>
					</View>
				</View>
				{/*虚拟键盘*/}
				<View style={{ flexDirection: 'row', }}>
					<View style={{ width: fullWidth / 4 * 3 }}>
						<View style={{ flexDirection: 'row' }}>
							<TouchableOpacity style={styles.KeyboardBtn} onPress={() => { this.setBuyNum(1) }}>
								<Text style={{ fontSize: 27, color: '#000' }}>1</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.KeyboardBtn} onPress={() => { this.setBuyNum(2) }}>
								<Text style={{ fontSize: 27, color: '#000' }}>2</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.KeyboardBtn} onPress={() => { this.setBuyNum(3) }}>
								<Text style={{ fontSize: 27, color: '#000' }}>3</Text>
							</TouchableOpacity>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<TouchableOpacity style={styles.KeyboardBtn} onPress={() => { this.setBuyNum(4) }}>
								<Text style={{ fontSize: 27, color: '#000' }}>4</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.KeyboardBtn} onPress={() => { this.setBuyNum(5) }}>
								<Text style={{ fontSize: 27, color: '#000' }}>5</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.KeyboardBtn} onPress={() => { this.setBuyNum(6) }}>
								<Text style={{ fontSize: 27, color: '#000' }}>6</Text>
							</TouchableOpacity>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<TouchableOpacity style={styles.KeyboardBtn} onPress={() => { this.setBuyNum(7) }}>
								<Text style={{ fontSize: 27, color: '#000' }}>7</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.KeyboardBtn} onPress={() => { this.setBuyNum(8) }}>
								<Text style={{ fontSize: 27, color: '#000' }}>8</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.KeyboardBtn} onPress={() => { this.setBuyNum(9) }}>
								<Text style={{ fontSize: 27, color: '#000' }}>9</Text>
							</TouchableOpacity>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<TouchableOpacity style={styles.KeyboardBtn}>
								<Text style={{ fontSize: 27, color: '#ccc' }}>.</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.KeyboardBtn} onPress={() => { this.setBuyNum(0) }}>
								<Text style={{ fontSize: 27, color: '#000' }}>0</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.KeyboardBtn} onPress={this.closeModal } >
								<Image style={{ tintColor: '#ccc' }} source={require('../res/images/ProductDetail/key.png')} />
							</TouchableOpacity>
						</View>
					</View>
					<View style={{ width: fullWidth / 4 }}>
						<TouchableOpacity style={{ height: 108 * Styles.theme.IS, justifyContent: 'center', alignItems: 'center', borderWidth: 1 / PixelRatio.get(), borderColor: '#e5e5e5', }}
							onPress={() => {
								this.setState({ buyNum: buyNum.substr(0, buyNum.length - 1) });

							}}>
							<Image source={require('../res/images/ProductDetail/003back.png')} />
						</TouchableOpacity>
						<TouchableOpacity style={{ height: 108 * Styles.theme.IS, backgroundColor: '#34457D', justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.addToCart() }}>
							<Text style={{ color: '#fff', fontSize: 18 }}>确定</Text>
						</TouchableOpacity>
					</View>
				</View>
				{/*置顶提示*/}
				<FrontToast
					ref="toast"
					style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
					position='top'
					positionValue={100}
					textStyle={{ color: '#fff' }}
				/>
			</View>
		)
	}
}

class AddPlanPopup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			product: this.props.product || null,
			planList: [],
			skuId: this.props.sku,
			showNewPlan: false,
			planNm: '',
		}
		this.fetchData();
		this.addToPlan = this.addToPlan.bind(this);
	}
	// 获取计划
	fetchData() {
		new Fetch({
			url: "app/fastBuy/purchaseTemplateList.json",
			method: "GET",
		}).dofetch().then((data) => {
			//扩展数据,
			for (i of data.result) {
				i.checked = false;
				for (idx of i.skuIds) {
					if (idx == this.state.skuId) {
						i.checked = true;
						break;
					}
				}
			}
			this.setState({
				planList: data.result,
			})
			console.log("data: ", data);
		}).catch((err) => {
			console.log("获取计划失败: ", err);
		})
	}
	// 添加商品到计划
	addToPlan(idx) {
		Loading.show()
		new Fetch({
			url: "app/fastBuy/addPurchaseTemplateItems.json",
			bodyType: 'json',
			data: {
				purchaseTemplateId: this.state.planList[idx].purchaseTemplateId,
				skuIds: [this.state.skuId],
				nums: [this.props.product.productId + '_' + 1]
			}
		}).dofetch().then((data) => {
//			this.refs.toast.show('成功添加');
			Toast.show('成功添加');
			this.props.addPlanModal.hide();	
		}).catch((err) => {
			console.log("添加失败: ", err);
		}).finally(() => {
			Loading.hide()
		})
	}
	//从计划删除商品
	delFormPlan(idx) {
		Loading.show()
		new Fetch({
			url: "app/fastBuy/delPurchaseTemplateItems.json",
			data: {
				purchaseTemplateId: this.state.planList[idx].purchaseTemplateId,
				skuIds: [this.state.skuId],
			}
		}).dofetch().then((data) => {
//			this.refs.toast.show('成功删除');
			Toast.show('成功删除');
			this.props.addPlanModal.hide();	
		}).catch((err) => {
			console.log("删除失败: ", err);
		}).finally(() => {
			Loading.hide()
		})
	}
	//添加进入计划开关
	_selectClick(index) {
		for (let i = 0; i < this.state.planList.length; i++) {
			if (i == index) {
				this.state.planList[i].checked = !this.state.planList[i].checked;
				if (this.state.planList[i].checked) {
					this.addToPlan(i);
				} else {
					this.delFormPlan(i);
				}
			}
		}
		this.forceUpdate();

	}
	_addNewPlan() {
		this.refs.addNewPlan.show();
	}
	cancel() {
		this.refs.addNewPlan.hide();
	}
	//创建计划
	submit() {
		Loading.show();
		new Fetch({
			url: "app/fastBuy/createPurchaseTemplate.json",
			bodyType: 'json',
			data: { templateNm: this.state.planNm, remarks: '', skuIds: [], nums: [] }
		}).dofetch().then((data) => {
			this.fetchData();
			this.refs.addNewPlan.hide();
		}).catch((err) => {
			console.log("新建计划失败: ", err);
		}).finally(() => {
			Loading.hide()
		})
	}

	renderRow(list) {
		return (
			_.map(list, (item, index) => {
				return (
					<View key={index} style={{ height: 50, alignItems: 'center', flexDirection: 'row' }}>
						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', height: 50,}} activeOpacity={1}
							onPress={this._selectClick.bind(this, index)}>
							<View style={{ width: 19, height: 19, borderRadius: 9, borderColor: item.checked ? '#fff' : '#c9c9c9', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
								{item.checked ? <Image style={{ width: 17, height: 17, resizeMode: 'contain' }} source={require('../res/images/ProductDetail/checked.png')} /> : <View />}
							</View>
							<Text style={{ fontSize: 16, color: '#333', marginLeft: 12 }}>{item.templateNm}</Text>
						</TouchableOpacity>
					</View>
				)
			})
		)
	}

	render() {
		return (
			<View style={[styles.shoppingView, { height: 320, paddingHorizontal: 12, justifyContent: 'flex-start', backgroundColor: '#fff' }]}>
				<View style={{ height: 50, justifyContent: 'center' }}>
					<Text style={{ fontSize: 16, color: '#333', }}>选择计划</Text>
				</View>
				<View style={{ height: 50, alignItems: 'center', flexDirection: 'row' }}>
					<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', height: 50, }} activeOpacity={1}
						onPress={this._addNewPlan.bind(this)}>
						<Image style={{ width: 14, height: 14, resizeMode: 'contain' }} source={require('../res/images/ProductDetail/a006xinjianfenzu.png')}></Image>
						<Text style={{ fontSize: 16, color: '#333', marginLeft: 17 }}>新建计划</Text>
					</TouchableOpacity>
					
				</View>
				<ScrollView style={{ flex: 1 }} howsVerticalScrollIndicator={false}>
					{this.renderRow(this.state.planList)}
				</ScrollView>
				{/*添加新计划*/}
				<MaskModal
					ref="addNewPlan"
					viewType="top"
					animationType='slide'
					containerStyle2={{ alignItems: 'center' }}
					contentView={
						<View style={{ width: 270, height: 150, top: 125, backgroundColor: 'rgba(234,234,234,0.90)', borderRadius: 12, alignItems: 'center', justifyContent: 'space-between' }}>
							<Text style={{ fontSize: 17, color: '#333', marginVertical: 15 }}>新建计划</Text>
							<TextInputC
								ref="textInput"
								style={{ width: 240, height: 33, fontSize: 14, padding: 0, backgroundColor: '#fff', marginTop: 3 }}
								clearButtonMode='while-editing'
								autoFocus={true}
								placeholder={'1~10个字符'}
								underlineColorAndroid='transparent'
								value={this.state.planNm}
								blurOnSubmit={true}
								onChangeText={(planNm) => {
									this.setState({ planNm: planNm })
								}}
								maxLength={10}
							/>
							<View style={{ marginTop: 15, height: 45, flexDirection: 'row', borderTopWidth: 1 / PixelRatio.get(), borderColor: '#999' }}>
								<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1 / PixelRatio.get(), borderColor: '#999' }}
									onPress={this.cancel.bind(this)}>
									<Text style={{ color: '#007aff', fontSize: 16 }}>取消</Text>
								</TouchableOpacity>
								<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
									onPress={this.submit.bind(this)}>
									<Text style={{ color: '#007aff', fontSize: 16 }}>确定</Text>
								</TouchableOpacity>
							</View>
						</View>}>
				</MaskModal>
				{/*置顶提示*/}
				<FrontToast
					ref="toast"
					style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
					position='top'
					positionValue={100}
					textStyle={{ color: '#fff' }}
				/>
			</View>

		)
	}
}

class AddPurchasePopup extends Component {
	constructor(props) {
		super(props);
		let productArr = this.props.product.productReferSpecVos,
			skuId = this.props.product.amountDetailVo.skuId;

		let selectProduct = productArr.filter((e, i) => {
			return e.productId === skuId;
		})

		this.state = {
			product: this.props.product || null,
			selectProduct: selectProduct.length <= 0 ? productArr[0] : selectProduct[0],
			skuId,
		}
	}

	//渲染多规格
	renderMultiSpecs(data) {
		return (
			_.map(data, (item, index) => {
				return (
					<View style={{ flexDirection: "row", marginRight: 12, marginBottom: 12 }} key={index}>
						<TouchableOpacity
							style={{
								justifyContent: 'center', alignItems: 'center', padding: 8, borderColor: (this.state.selectProduct.productId == item.productId) ? "#ff6600" : "#81939a",
								borderRadius: 5, borderWidth: 1 / PixelRatio.get(), marginBottom: 10
							}}
							onPress={() => {
								let productArr = this.props.product.productReferSpecVos;
								let selectProduct = productArr.filter((e, i) => {
									return e.productId === item.productId;
								})
								this.setState({
									selectProduct: selectProduct[0],
								})
							}}
							activeOpacity={0.7}>
							<Text style={{ color: (this.state.selectProduct.productId == item.productId) ? "#ff6600" : "#333", fontSize: 15 }}>{item.specNm}</Text>
						</TouchableOpacity>
					</View>
				)
			})
		)
	}
	//渲染图片
	renderImage = (data) => {
		for (idx of data) {
			if (idx.productId == this.state.selectProduct.productId) {
				if (Platform.OS == 'ios') {
					return (
						<Image style={{ width: 70, height: 70, position: 'absolute', left: 12, top: 0, borderWidth: 1 / PixelRatio.get(), borderColor: '#e5e5e5', backgroundColor: '#fff', borderRadius: 5 }}
							source={imageUtil.get(idx.picUrl)}>
						</Image>
					)
				} else {
					return (
						<View style={{ width: 70, height: 70, position: 'absolute', left: 12, top: 0, borderWidth: 1 / PixelRatio.get(), borderColor: '#e5e5e5', backgroundColor: '#fff', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
							<Image style={{ width: 60, height: 60 }}
								source={imageUtil.get(idx.picUrl)}>
							</Image>
						</View>
					)
				}
			}
		}

	}

	render() {
		return (
			<View style={[styles.shoppingView, { height: 330 }]}>
				{/* 多规格视图 */}
				<View style={{ height: 10, backgroundColor: 'transparent' }} />
				<View style={[styles.borderBottom, { flex: 1, paddingHorizontal: 12, backgroundColor: '#fff' }]}>
					<View style={[styles.borderBottom, { height: 75, flexDirection: 'row' }]}>

						<View style={{ marginLeft: 85, justifyContent: 'space-around', paddingVertical: 15 }}>
							<Text style={{ color: "#ff8a00", fontSize: 11, }}
								text={['￥',
									{
										value: this.state.product.amountDetailVo.unitPrice, style: { fontSize: 15 }
									}]}
							/>
							<Text style={{ color: "#999", fontSize: 11, }}>{'商品编码: ' + this.state.product.productCode}</Text>
						</View>
					</View>
					<View style={{ height: 45, justifyContent: 'center' }}>
						<Text style={{ fontSize: 13, color: '#666666' }}>规格</Text>
					</View>
					<ScrollView style={{ flex: 1, }} showsVerticalScrollIndicator={false}>
						<View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
							{this.renderMultiSpecs(this.state.product.productReferSpecVos)}
						</View>
					</ScrollView>
				</View>
				<TouchableOpacity style={styles.bottomBtn} //mark1
					onPress={() => {
						//加入常购
						this.props.update(this.state.selectProduct.productId);
						this.props.addPurchaseModal.hide();
					}}
					activeOpacity={0.7}>
					<Text style={styles.bottomBtnFont}>确定</Text>
				</TouchableOpacity>
				{this.renderImage(this.props.product.productReferSpecVos)}
			</View>
		)
	}
}
//TODO 缺少登录回调（价格未登录返回null，登录后需重新请求数据）
class ProductDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisibleModal: false,	//图片Modal是否显示
			imgIndex: 0,			//图片下标
			promoteText: null,		//促销信息字段
			product: null,			//商品数据
			cartNum: this.props.cartNum || 0,	//购物车数量
			// cartNum: 10,	//购物车数量
			sku: null,
			beJoin: false,
			beaddUsualBuy: false,
			beApplyRecord: false,
			hadRecordSta: undefined,
			discountType: null,
			//KeyboardShow:true,
			hasCollectShop: false,   // 是否收藏店铺
			shopCollectNum: 0,    // 收藏店铺人数
		}
		this.productId = this.props.params.productId
		this.image = [];	//商品图片资源
		this.timer = null;
		this.collectedImg = require('../res/images/ProductDetail/003shouchang_s.png');
		this.unCollectedImg = require('../res/images/ProductDetail/003shouchang.png');
		this.goToComment = this.goToComment.bind(this);
	}

	componentDidMount() {
		this.collectShopListener = RCTDeviceEventEmitter.addListener('changeShopCollect', (shopId) => {
			let id = this.state.product && this.state.product.shop && this.state.product.shop.shopInfId;
			if (id && shopId === id) {
				this.fetchData();
			}
		})
	}

	componentWillReceiveProps(nextProps) {		
        if (nextProps.cartNum) {
            this.setState({
                cartNum: nextProps.cartNum
            });
        }
    }

	componentWillUnmount() {
		if (this.timer) {
			clearTimeout(this.timer);
		}
		if (this.timer1) {
			clearTimeout(this.timer1);
		}
		if (this.timer2) {
			clearTimeout(this.timer2);
		}
		this.collectShopListener.remove();
	}

	onOpen() {
		this.fetchData();
	}
	fetchData = () => {
		new Fetch({
			url: "/app/product/productDetail.json",
			method: "POST",
			data: {
				productId: this.productId,
			}
		}).dofetch().then((data) => {			
			this.setState({
				product: data.result,
				sku: data.result.amountDetailVo.skuId,//（默认选中第一个sku）
				discountType: data.result.amountDetailVo.discountType ? data.result.amountDetailVo.discountType : null,
				hasCollectShop: data.result.shop.isCollect,
				shopCollectNum: data.result.shop.shopCollectNum,
				hadRecordSta: data.result.hadRecordSta,
			})
			//this.refs.base.controlViewByErr(data);
		}).catch((err) => {
			console.log("获取普通商品详情数据失败: ", err);
			//this.refs.base.controlViewByErr(err);
		})
	}

	//渲染促销信息（简）
	renderPromoteInfo(data) {
		return (
			<View style={{ justifyContent: 'center', alignSelf: 'center', flex: 1, }}>
				{_.map(data, (item, index) => {
					if(index == 1){
						return (
							<View key={index} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexDirection: 'row', marginVertical: 5 }}>
								<Text style={{ marginLeft: 15, color: "#ff6600", fontSize: 10, borderWidth: 1 / PixelRatio.get(), borderColor: '#ffb98b', backgroundColor: '#ffe9db', paddingHorizontal: 10, paddingVertical: 5 }} numberOfLines={1}>{item.name}</Text>
								<Text style={{ flex: 1, marginLeft: 10, color: "#0c1828", fontSize: 12, paddingVertical: 5 }} numberOfLines={1}>{item.describe}</Text>
							</View>
						)
					}
				})}
			</View>
		)
	}

	//渲染促销信息（详）
	renderPromoteDetail(data) {
		return (
			_.map(data, (item, index) => {
				return (
					<View key={index} style={{ marginVertical: 12, marginHorizontal: 20, flexDirection: 'row', alignItems: "flex-start" }}>
						<Text style={{ color: "#ff6600", fontSize: 10, borderWidth: 1 / PixelRatio.get(), borderColor: '#ffb98b', backgroundColor: '#ffe9db', paddingHorizontal: 10, paddingVertical: 5 }} numberOfLines={1}>{item.name}</Text>
						<Text style={{ flex: 1, marginLeft: 10, color: "#333", fontSize: 12, paddingVertical: 5 }}>{item.describe}</Text>
					</View>
				)
			})
		)
	}
	//售前咨询
	jumpToPreSalesAdvice(productId) {
		if (!this.props.isLogin) {
			Toast.show("请登录");
			this.props.navigator.push({
				component: SignIn,
				params: {
					callback: () => {
						this.fetchData();
					}
				}
			});
		} else {
			this.props.navigator.push({
				component: PreSalesAdvice,
				params: {
					productId: productId
				}
			});
		}
	}
	//加入常购
	addUsualBuy() {
		if (!this.props.isLogin) {
			Toast.show("请登录");
			this.props.navigator.push({
				component: SignIn,
				params: {
					callback: () => {
						this.fetchData();
					}
				}
			});
		} else {
			this.addUsualBuyAction(this.productId);
		}
	}

	// 收藏店铺
	_collectShop = () => {
		let hasCollectShop = this.state.hasCollectShop,
			type = hasCollectShop ? 'N' : 'Y',  // params: action Y:收藏 N:取消收藏
			shopId = this.state.product.shop.shopInfId;

		//Loading的方式
		Loading.show();
		new Fetch({
			url: 'app/user/collectionShop.json?type=' + type + '&shopId=' + shopId,
			method: 'GET',
		}).dofetch().then((data) => {
			Loading.hide();
			let msg = !hasCollectShop ? '收藏成功' : '已取消收藏';
			if (data && data.success) {
				// this.setState({
				// 	hasCollectShop: !hasCollectShop,
				// 	shopCollectNum: !hasCollectShop?this.state.shopCollectNum+1:this.state.shopCollectNum-1,
				// });
				RCTDeviceEventEmitter.emit('changeShopCollect', shopId);
				return Toast.show(msg);
			} else if (data.errorCode === "errors.login.noexist") {
				return Toast.show('请先登录');
			} else {
				return Toast.show('收藏失败');
			}
		}).catch((err) => {
			Loading.hide();
			console.log('修改收藏失败 ----->', err);
		});
	}

	addUsualBuyAction(skuId) {
		Loading.show();
		new Fetch({
			url: "app/fastBuy/addPurchase.json",
			data: {
				skuIds: [skuId],
			}
		}).dofetch().then(() => {
			this.setState({ beaddUsualBuy: true });
			this.timer1 = setTimeout(() => {
				this.setState({ beaddUsualBuy: false });
			}, 1000)
		}).catch((err) => {
			console.log("加入常购失败：", err);
		}).finally(() => {
			Loading.hide();
		});
	}

	//查看大图
	showMaskImage = (images, index) => {
		if (Platform.OS == "android") {
			this.refs.banner.measure((x, y, width, height, locationX, locationY) => {
			  PhotoBrowser.browserWithUrlBanner_android({
				locationArray: [width,height,locationX,locationY] /**位置数组**/,
				urlArray: images /**图片url数组**/,
				position: index /**index为图片当前的索引，索引从0开始**/,
				rnPageName: null /**是否要在原生嵌入RN页面。要嵌入就填js文件名称，如test.js就填test,在此之前需要生成test.bundle文件(生成bundle操作看下面)，如果不要嵌入RN页面此处填null**/
			  });
			});
		  } else {
		  //   let coms = this.getComs();
		  //   let comsTag = coms.map((value, i) => {
		       //return parseFloat(findNodeHandle(value.com));
		  //   });
			PhotoBrowser.browserWithUrlImages_ios({
			    // comArray: [parseFloat(findNodeHandle(this.com))], //（数组）  Component的 reactTag 的数组 （可与 url 数组数量不相等）,不传默认为空数组
			  urls: images,
			  index: index, //（Int）   点击的图片index 不传，默认为0
			  start: 0 //（Int）   参数一的第一个Component 对应的 图片 index  不传，默认为0
			  // detailCom:renderCom                                                       //（数组）  扩展的内容的Component数组 不传，默认空数组
			});
		  }
	}

	openComponent = (component, params = {}) => {
		let navigator = this.props.navigator;
		if (navigator) {
			navigator.push({
				component: component,
				params,
			})
		}
	}

	scrollNextPage(e) {
		if (e.nativeEvent.contentSize.height > e.nativeEvent.layoutMeasurement.height) {
			if (Platform.OS == 'ios') {
				if (e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - e.nativeEvent.layoutMeasurement.height + 60) {
					this.transformStart(scrollViewHeight);
					this.setState({ showUpImg: true });
					this.base.alterTitle({ title: '图文详情', tintColor: '#333333', style: { fontSize: 18 } });
				}
			} else {
				if (e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - e.nativeEvent.layoutMeasurement.height - 2) {
					this.transformStart(scrollViewHeight);
					this.setState({ showUpImg: true });
					this.base.alterTitle({ title: '图文详情', tintColor: '#333333', style: { fontSize: 18 } });
				}
			}
		} else {
			if (e.nativeEvent.contentOffset.y >= 0) {
				this.transformStart(scrollViewHeight);
				this.setState({ showUpImg: true });
				this.base.alterTitle({ title: '图文详情', tintColor: '#333333', style: { fontSize: 18 } });
			}
		}
	}

	scrollPreviousPage(e) {
		if (e.nativeEvent.contentSize.height > e.nativeEvent.layoutMeasurement.height) {
			if (Platform.OS == 'ios') {
				if (e.nativeEvent.contentOffset.y <= -60) {
					this.transformStart(0);
					this.setState({ showUpImg: false });
					this.base.alterTitle({ title: '商品详情', tintColor: '#333333', style: { fontSize: 18 } });
				}
			} else {
				if (e.nativeEvent.contentOffset.y <= 2) {
					this.transformStart(0);
					this.setState({ showUpImg: false });
					this.base.alterTitle({ title: '商品详情', tintColor: '#333333', style: { fontSize: 18 } });
				}
			}
		} else {
			if (e.nativeEvent.contentOffset.y <= 0) {
				this.transformStart(0);
				this.setState({ showUpImg: false });
				this.base.alterTitle({ title: '商品详情', tintColor: '#333333', style: { fontSize: 18 } });
			}
		}
	}

	scrollToTop = () => {
		this.scroll.scrollTo({ y: 0 });
		this.scroll1.scrollTo({ y: 0 });
		this.setState({ showUpImg: false });
		this.base.alterTitle({ title: '商品详情', tintColor: '#333333', style: { fontSize: 18 } });
	}

	transformStart(value) {
		this.scroll.scrollTo({ x: 0, y: value, animated: true });
	}
	update(sku) {
		this.productId = sku;
		this.fetchData();
	}

	showJoin() {		
		this.setState({ beJoin: true });
		this.timer = setTimeout(() => {
			this.setState({ beJoin: false });
		}, 1500)
	}
	applyHadRecord() {	
		new Fetch({
			url: "app/user/applyHadRecord.json",
			data:{shopId:this.state.product.shop.shopInfId}
		}).dofetch().then((data) => {
			this.setState({beApplyRecord:true,hadRecordSta:0})
			this.timer2 = setTimeout(() => {
				this.setState({ beApplyRecord: false });
			}, 1500)
			console.log("data: ", data);
		}).catch((err) => {
			console.log("获取计划失败: ", err);
		})															
	}
	goToComment(){		
		this.props.navigator.push({
			component:Comment,
			params:{productId:this.state.product.productId}
		})
	}
	

	render() {
		let product = this.state.product || null;
		let sku = this.state.sku || null;
		let price = null;
		let price1 = null;
		let intPrice, dicimalPrice;
		let specNm = '';
		let pTip = "￥";
		let btnActiveOpacity = 0.7;

		if (product) {			
			price = product.amountDetailVo.unitPrice.toFixed(2);			
			price1=Number.parseFloat(product.amountDetailVo.unitPrice).toFixed(2).toString().split('.');
			intPrice = price1[0];
			dicimalPrice = price1[1];
			specNm = product.specPack;
		}
		let picList = product && product.imageList ? product.imageList : [];
		return (
			<Page onOpen={this.onOpen.bind(this)}
				navigator={this.props.navigator}>
				<View style={{ flex: 1 }}>
					<BaseView navigator={this.props.navigator}
						ref={base => this.base = base}
						statusBarStyle={'default'}
						title={{ title: '商品详情', tintColor: '#333333', style: { fontSize: 18 } }}
						reload={() => this.fetchData()}
						leftBtnStyle={{ width: 10, height: 17, tintColor: '#444444' }}
						rightButton={
							<View style={{ flexDirection: 'row',  alignItems: 'center',}}>
								<TouchableOpacity style={{flexDirection: 'row', alignItems:'center',justifyContent:'center'}}
									onPress={() => {
										if (!this.props.isLogin) {
											Toast.show("请登录");
											this.props.navigator.push({
												component: SignIn,
												params: {
													callback: () => {
														this.fetchData();
													}
												}
											});
											return;
										} 											
										this.props.navigator.push({
											component: StocksList
										})
									}}>
									<Image style={{ width: 40, tintColor: '#444', resizeMode: 'contain',marginRight: 5, }} source={require('../res/images/ProductDetail/000jinhuodan.png')} />
								</TouchableOpacity>
								{this.state.cartNum != 0 && <View style={{ height: 14, width: this.state.cartNum >9 ? 20 : 14, borderRadius: 7, backgroundColor: '#ff6600', position: 'absolute', left: 22, top: 5, justifyContent: 'center', alignItems: 'center' }}>
									<Text style={{ fontSize: 10, color: '#fff' }}>{this.state.cartNum > 9 ? '9+' : this.state.cartNum}</Text>
								</View>}
								<MoreOperation navigator={this.props.navigator}> </MoreOperation>
							</View>
						}
					>
						<DataController data={product}>
							{product &&
								<View style={{ flex: 1 }}>
									<ScrollView
										ref={scroll => this.scroll = scroll}
										scrollEnabled={false}
										showsVerticalScrollIndicator={false}
										style={{ flex: 1 }}>
										<ScrollView
											style={{ height: scrollViewHeight, borderTopWidth: 1 / PixelRatio.get(), borderColor: '#e5e5e5', backgroundColor: '#f5f5f5' }}
											ref={scroll1 => this.scroll1 = scroll1}
											scrollEnabled={true}
											onScrollEndDrag={this.scrollNextPage.bind(this)}
											showsVerticalScrollIndicator={false}>
											{/*轮播图片*/}
											<View ref="banner"
						onLayout={(event) => {//若没有onLayout回调，measure回调方法的数值都为undefind，搞不懂
							{/*let locationX = event.nativeEvent.layout.x;
								let locationY = event.nativeEvent.layout.y;
								let bannerWidth = event.nativeEvent.layout.width;
								let bannerHeight = event.nativeEvent.layout.height;*/}
						}} >
											<Banner
											ref={(com)=>this.com=com}
												removeClippedSubviews={false}
												style={{ backgroundColor: '#fff' }}
												images={picList}
												height={255}
												imageWidth={fullWidth}
												autoplay={false}
												imageProps={{ resizeMode: 'contain' }}
												onPress={(index) => {
													this.showMaskImage(picList, index);
												}}
												loop={true}
												dot={<View style={{ backgroundColor: 'rgba(255,255,255,0.3)', width: 8, height: 8, borderRadius: 4, marginLeft: 7, marginRight: 7, borderWidth: 1, borderColor: '#0082ff' }} />}
												activeDot={<View style={{ backgroundColor: '#0082ff', width: 8, height: 8, borderRadius: 4, marginLeft: 7, marginRight: 7 }} />}
											>

											</Banner>
											</View>
											{/*抢购*/}
											{this.state.discountType ?
												<View style={{ height: 53 * Styles.theme.IS, flexDirection: 'row' }}>
													<View style={{ width: 200 * Styles.theme.IS }}>
														<Image style={{ height: 53 * Styles.theme.IS, paddingLeft: 12, justifyContent: 'center', resizeMode: 'cover' }} source={require('../res/images/ProductDetail/back.png')}>
															<View style={{ flexDirection: 'row', height: 45, paddingBottom: 5, alignItems: 'flex-end' }}>
																<Text style={{ fontSize: 18, color: '#fff', backgroundColor: 'transparent' }}>￥</Text>
																{this.props.isLogin&&<View style={{ flexDirection: 'row',alignItems: 'flex-end'}}>
																<Text style={{ fontSize: 32, color: '#fff', backgroundColor: 'transparent', top: 2 }}>{intPrice}</Text>
																<Text style={{ fontSize: 21, color: '#fff', backgroundColor: 'transparent' }}>{'.' + dicimalPrice}</Text>
																</View>}
																{!this.props.isLogin&&<View>
																<Text style={{ fontSize: 18, color: '#fff', backgroundColor: 'transparent' }}>--/--</Text>
																</View>}
																<View style={{ marginLeft: 5 }}>
																	<Text style={{ fontSize: 12, color: '#fff', backgroundColor: 'transparent' }}>{'￥' + product.amountDetailVo.originalUnitPrice.toFixed(2)}</Text>
																	<View style={{ height: 1, alignSelf: 'stretch', backgroundColor: '#fff', top: -7 }} />
																</View>
															</View>
														</Image>
													</View>
													<View style={{ width: 120 * Styles.theme.IS, backgroundColor: '#ffd7d7', justifyContent: 'space-around', paddingVertical: 5, paddingHorizontal: 12 }}>
														<Text style={{ fontSize: 12, color: '#e7141a', alignSelf: 'flex-end' }}>距结束剩余</Text>
														<Countdown leftSeconds={new Date(product.amountDetailVo.endTime) - new Date()} ref="Count"></Countdown>
													</View>
													<View style={{
														position: 'absolute', paddingHorizontal: 10, height: 18, borderRadius: 9, top: -9, left: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff',
														shadowOffset: { width: 2, height: 2 }, shadowColor: 'black', shadowOpacity: 0.2, shadowRadius: 3
													}}>
														<Text style={{ fontSize: 12, color: '#e7141a' }}>{product.amountDetailVo.amountNm}</Text>
													</View>
												</View> : <View />
											}
											{/*基本信息*/}
											<View style={{ width: fullWidth,backgroundColor: '#fff', paddingHorizontal: 12 }}>
												<View style={{ height: 80, justifyContent: 'space-around', paddingVertical: 8}}>
													<Text style={styles.prdName} numberOfLines={2}>{product.title}</Text>
													{this.state.discountType ?//是否折扣
														<View style={{ flexDirection: 'row', alignItems: 'center' }}>
															<Text style={{ fontSize: 13, color: '#54617a' }}>供应商</Text>
															<Text style={{ paddingHorizontal: 10, fontSize: 13, color: '#54617a', flex: 1 }} numberOfLines={1}>{product.shopNm}</Text>
														</View> :
														<View style={{ flexDirection: 'row', alignItems: 'center' }}>
															{this.props.isLogin ?//是否登陆
																<Text text={[
																	{ value: pTip, style: styles.prdPrice },
																	{ value: intPrice, style: { fontSize: 22, color: '#ff6600' } },
																	{ value: '.', style: { fontSize: 19, color: '#ff6600' } },
																	{ value: dicimalPrice, style: { fontSize: 19, color: '#ff6600' } },
																]}
																/> :
																<View style={{ width: 84, height: 25, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderWidth: 1 / PixelRatio.get(), borderColor: '#8495a2' }}>
																	<Image style={{ width: 14, resizeMode: 'contain' }} source={require('../res/images/ProductDetail/003denglukejian.png')} />
																	<View style={{ width: 1, height: 13, backgroundColor: '#8495a2' }} />
																	<Text style={{ fontSize: 12, color: '#8495a2' }}>登录可见</Text>
																</View>
															}
															<Text style={{ fontSize: 11, color: '#aaaeb9', marginLeft: 10 }}>市场价:{pTip}{product.marketPrice.toFixed(2)}</Text>
														</View>
													}
												</View>

												<View style={{alignItems: 'center', flexDirection: 'row',marginBottom:15}}>
													<Text style={styles.prdType}>类型 {product.prescriptionType ? product.prescriptionType : "无"}</Text>
													<Text style={[styles.prdType,{marginLeft:15}]}>{this.state.discountType ? '已抢' : '成交'} {product.salesVolume}</Text>
													<Text style={[styles.prdType,{marginLeft:15}]}>{product.isUnbundled == "N" ? "不可拆零" : "可拆零"}</Text>
												</View>
											</View>
											{/* 申请首营 */}
											{this.state.hadRecordSta != 1 && <View style={{ flex: 1,height:45, borderTopColor: "#e5e5e5", borderTopWidth: 1 / PixelRatio.get(), alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row',backgroundColor:'#fff',paddingHorizontal:12 }}>						
													<Image style={{width:74,height:15,}} source={require('../res/images/ProductDetail/006weijianli02.png')}/>
													<Text style={{fontSize:13,color:'#333'}}>未与供应商建立首营关系</Text>
													<TouchableOpacity style={{width:70,height:25,justifyContent:'center',alignItems:'center',borderWidth:1/PixelRatio.get(),borderColor:this.state.hadRecordSta != 0 ? '#ffb37f' : '#bbbbbb'}}
														onPress={this.applyHadRecord.bind(this)}>
														<Text style={{fontSize:12,color:this.state.hadRecordSta !=0 ? '#ff6600' : '#9CA9B4'}}> {this.state.hadRecordSta != 0  ? '申请首营' : '已申请首营'}</Text>
													</TouchableOpacity>
											</View>
											}


											{/* 商品属性 */}
											<View style={[styles.paramsRow, { marginTop: 10, borderBottomColor: "#eee", borderBottomWidth: 1 / PixelRatio.get() }]}>
												<View style={styles.leftParam}>
													<Text style={styles.paramTopText}>规格</Text>
													<Text style={styles.paramBottomText} numberOfLines={1}>{product.specPack ? product.specPack : "暂无"}</Text>
												</View>
												<View style={styles.rightParam}>
													<Text style={styles.paramTopText}>单位</Text>
													<Text style={styles.paramBottomText} numberOfLines={1}>{product.unit ? product.unit : "暂无"}</Text>
												</View>
											</View>
											<View style={styles.paramsRow}>
												<View style={styles.leftParam}>
													<Text style={styles.paramTopText}>件/中包装</Text>
													<Text style={styles.paramBottomText} numberOfLines={1}>{(product.packTotal && product.midPackTotal) ? (product.packTotal + "/" + product.midPackTotal) : "暂无"}</Text>
												</View>
												<View style={styles.rightParam}>
													<Text style={styles.paramTopText}>剂型</Text>
													<Text style={styles.paramBottomText} numberOfLines={1}>{product.specPack ? product.form : "暂无"}</Text>
												</View>
											</View>
											<View style={styles.paramsRow}>
												<View style={styles.leftParam}>
													<Text style={styles.paramTopText}>生产产家</Text>
													<Text style={styles.paramBottomText} numberOfLines={1}>{product.specPack ? product.factory : "暂无"}</Text>
												</View>
												<View style={styles.rightParam}>
													<Text style={styles.paramTopText}>批准文号</Text>
													<Text style={styles.paramBottomText} numberOfLines={1}>{product.approvalNumber ? product.approvalNumber : "暂无"}</Text>
												</View>
											</View>
											<View style={styles.paramsRow}>
												<View style={styles.leftParam}>
													<Text style={styles.paramTopText}>建议售价</Text>
													<Text style={styles.paramBottomText} numberOfLines={1}>{product.marketPrice ? ("￥" + product.marketPrice.toFixed(2)) : "暂无"}</Text>
												</View>
												<View style={styles.rightParam}>
													<Text style={styles.paramTopText}>商品编码</Text>
													<Text style={styles.paramBottomText} numberOfLines={1}>{product.productCode ? product.productCode : "暂无"}</Text>
												</View>
											</View>

											{/*选择规格*/}
											{product && !this.state.discountType && <View style={[styles.row, { marginTop: 10, height: 50 }]}>
												<View style={{ flexDirection: 'row' }}>
													<Text style={styles.rowText}>规格</Text>
													<Text style={{ marginLeft: 20, fontSize: 13 }}>【{specNm}】</Text>
												</View>
												{product.productReferSpecVos.length >0 &&
													<TouchableOpacity 													
														hitSlop={{top:10,left: 0, bottom: 10, right: 0}}
														onPress={() => {this.refs.addPurchaseModal.show()}}>
														<Image style={{width:17,height:3}} source={require('../res/images/ProductDetail/010cuxiaoxiangxi.png')}></Image>
													</TouchableOpacity>
												}
											</View>
											}
											{/*促销信息*/}
											{(product && !this.state.discountType && product.appProductRuleVos.length) > 0 ?
												<View style={{paddingVertical: 16,paddingHorizontal:12, flexDirection:'row',backgroundColor:'#fff',marginTop:10,alignItems:'center'}}>
													<Text style={[styles.rowText]}>促销</Text>													
													<Text style={{ marginLeft: 15,paddingVertical:5, color: "#ff6600", fontSize: 10, borderWidth: 1 / PixelRatio.get(), borderColor: '#ffb98b', backgroundColor: '#ffe9db', paddingHorizontal: 10}} numberOfLines={1}>{product.appProductRuleVos[0].name}</Text>
													<Text style={{ flex: 1, marginLeft: 10, color: "#0c1828", fontSize: 13}} numberOfLines={1}>{product.appProductRuleVos[0].describe}</Text>																									
													<TouchableOpacity 
														hitSlop={{top:10,left: 0, bottom: 10, right: 0}}
														onPress={()=>{this.refs.promoteModal.show();}}>
														<Image style={{width:17,height:4}} source={require('../res/images/ProductDetail/010cuxiaoxiangxi.png')}></Image>
													</TouchableOpacity>
												</View> : <View />}
											{/* 统计 */}
											{!this.state.discountType && <View style={{ backgroundColor: '#fff' }}>
												<View style={{ height: 15, backgroundColor: '#f5f5f5' }} />
												<View style={{ height: 137.5, alignItems: 'center', paddingTop: 30 }}>
													<View style={{ width: 36, height: 36, position: 'absolute', top: -10, left: fullWidth / 2 - 18, backgroundColor: 'transparent'}}>
														<Image style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }} source={require('../res/images/ProductDetail/003shangjia.png')} resizeMode='contain'>
															<Image style={{ width: 18, height: 18,  top: -3 }} source={imageUtil.get(product.shop.shopLogo)}resizeMode='contain'></Image>
														</Image>
													</View>
													<Text style={{ fontSize: 13, color: '#0c1828' }}>{product.shop.shopNm}</Text>
													<View style={[styles.row, { width: fullWidth, justifyContent: 'space-around' }]}>
														<Text style={{ fontSize: 11, color: '#999' }}
															text={['全部商品 ',
																{ value: product.shop.allProductNum, style: { fontSize: 13, color: '#0c1828' } }]}
														/>
														<Text style={{ fontSize: 11, color: '#999' }}
															text={['收藏人数 ',
																{ value: product.shop.shopCollectNum, style: { fontSize: 13, color: '#0c1828' } }]}
														/>
														<Text style={{ fontSize: 11, color: '#999' }}
															text={['成交笔数 ',
																{ value: product.shop.orderNum, style: { fontSize: 13, color: '#0c1828' } }]}
														/>
													</View>
													<View style={{ width: fullWidth - 20, height: 1 / PixelRatio.get(), backgroundColor: '#e5e5e5' }} />
													<View style={{ flex: 1, width: fullWidth, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
														<TouchableOpacity
															style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}
															onPress={this._collectShop}
														>
															<Image style={{ marginRight: 10, width: 16, height: 16, }} source={product.shop.isCollect ? this.collectedImg : this.unCollectedImg}></Image>
															<Text style={{ color: '#5a6576' }}>收藏店铺</Text>
														</TouchableOpacity>
														<TouchableOpacity
															style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}
															onPress={() => this.openComponent(SupplierHome, { shopInfId: product.shop.shopInfId, })}
														>
															<Image style={{ marginRight: 10, width: 16, height: 16 }} source={require('../res/images/ProductDetail/003jindianguang.png')}></Image>
															<Text style={{ color: '#5a6576' }}>进店逛逛</Text>
														</TouchableOpacity>
													</View>
												</View></View>}
											{/* 评价 */}
											<View style={{marginTop:10,backgroundColor:'#fff',paddingHorizontal:12,paddingBottom:15}}>
												<View style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:17}}>
													<Text style={{fontSize:14,color:'#53606A'}}>{product.commentTotal ? '评价('+product.commentTotal+')' : '评价'}</Text>
													<TouchableOpacity style={{flexDirection:'row',alignItems:'center'}}
														onPress={this.goToComment}>
														<Text style={{fontSize:14,color:'#999'}}>{product.commentTotal ? '全部评价 ':'暂无，购买后来发表评价吧！'}</Text>
														<Image style={{width:6}} source={require('../res/images/ProductDetail/000xiangyousanjiao.png')}/>
													</TouchableOpacity>
												</View>
												{product.commentTotal ?
													<ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{flexDirection:'row',backgroundColor:'#fff'}}>
														{product.commentVos.map((item,i)=>{
															return(
																<View key={i} style={{flexDirection:'row',height:90,width:260,borderWidth:1/PixelRatio.get(),borderColor:'#eee', marginRight:10,alignItems:'center'}}>
																	<View style={{height:90,flex:1}}>	
																		<View style={{flexDirection:'row', justifyContent:'space-between',paddingHorizontal:13,marginTop:10}}>
																			<View style={{flexDirection:'row',alignItems:'center'}}>
																				<Image style={{width:25,height:25}} source={imageUtil.get(item.userIcon)}/>
																				<View style={{marginLeft:7,justifyContent:'space-between'}}>
																					<StarRating
																						style={{ justifyContent: 'center', alignItems: 'center' }}
																						space={1}
																						maxStars={5}
																						rating={item.score}
																						disabled={true}
																						starSize={10}																						
																					/>
																					<Text style={{fontSize:12,color:'#53606a'}}>{item.userName}</Text>
																				</View>
																			</View>																			
																		</View>	
																		<Text style={{marginTop:10,fontSize:11,color:'#53606a',paddingHorizontal:13}} numberOfLines={2}>{item.commentCont}</Text>
																	</View>
																	{item.commentPictList !== null ?
																		<Image key={i} style={{width:80,height:80,marginHorizontal:5}} source={imageUtil.get(item.commentPictList[0])}>
																			<View style={{height:14,width:30,borderRadius:10,backgroundColor:'rgba(0,0,0,0.50)',position:'absolute',top:2,right:2,justifyContent:'center',alignItems:'center'}}>
																				<Text style={{fontSize:10,color:'#fff'}}>5张</Text>	
																			</View>	
																		</Image>:
																		null
																	}
																															
																</View>
															)
														})}
														<TouchableOpacity style={{width:50,height:90,backgroundColor:'#f6f6f6',justifyContent:'center',alignItems:'center',paddingHorizontal:10}}
															onPress={this.goToComment}>
															<Text style={{fontSize:12,color:'#53606a'}}>更多评价</Text>
														</TouchableOpacity>
													</ScrollView> :
													<View style={{height:40,borderWidth:1/PixelRatio.get(),borderColor:'#8E939A',borderRadius:3,justifyContent:'center',alignItems:'center'}}>
														<Text style={{fontSize:14,color:'#53606A'}}
															onPress={() => {
																this.jumpToPreSalesAdvice(this.productId);
														}}>购买咨询</Text>
													</View>
												}
											</View>
											{/*上拉查看图文详情*/}
											<View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
												<Text style={{ fontSize: 12, color: '#666' }}>上拉查看图文详情</Text>
											</View>
										</ScrollView>
										{/*第二页*/}
										<ScrollView
											showsVerticalScrollIndicator={false}
											scrollEnabled={true}
											onScrollEndDrag={this.scrollPreviousPage.bind(this)}
											style={{ height: scrollViewHeight }}>
											<View style={{ marginTop: -60, height: 60, backgroundColor: '#f8f8f8', justifyContent: 'center', alignItems: 'center' }}>
												<Text style={{ fontSize: 12, color: '#666' }}>释放返回商品简介</Text>
											</View>
											<ProductDetailOther url={'/app/productDetail.jsp?productId=' + this.productId} productId={this.productId} />
										</ScrollView>
									</ScrollView>
									{/*滚动状态*/}
									{this.state.beJoin && <View style={{ position: 'absolute', width: 130, height: 85, top: (fullHeight - 85) / 2 - 64, left: (fullWidth - 130) / 2, backgroundColor: 'rgba(0,0,0,0.86)', borderRadius: 6, justifyContent: 'center', alignItems: 'center' }}>
										<Image style={{ height: 32, resizeMode: 'contain' }} source={require('../res/images/ProductDetail/jinhuodanfocus.png')} />
										<Text style={{ fontSize: 13, color: '#fff', marginTop: 12 }}>已添加到进货单</Text>
									</View>}
									{/*成功加常购提示*/}
									{this.state.beaddUsualBuy && !this.state.discountType && <View style={{ position: 'absolute', width: 130, height: 85, top: (fullHeight - 85) / 2 - 64, left: (fullWidth - 130) / 2, backgroundColor: 'rgba(0,0,0,0.86)', borderRadius: 6, justifyContent: 'center', alignItems: 'center' }}>
										<Image style={{ height: 26, resizeMode: 'contain' }} source={require('../res/images/ProductDetail/usualbuy.png')} />
										<Text style={{ fontSize: 13, color: '#fff', marginTop: 12 }}>已添加到常购品种</Text>
									</View>}
									{/*成功申请首营提示*/}
									{this.state.beApplyRecord && !this.state.discountType && <View style={{ position: 'absolute', width: 130, height: 85, top: (fullHeight - 85) / 2 - 64, left: (fullWidth - 130) / 2, backgroundColor: 'rgba(0,0,0,0.86)', borderRadius: 6, justifyContent: 'center', alignItems: 'center' }}>
										<Image style={{ height: 26, resizeMode: 'contain' }} source={require('../res/images/ProductDetail/usualbuy.png')} />
										<Text style={{ fontSize: 13, color: '#fff', marginTop: 12 }}>申请首营关系成功</Text>
									</View>}
									{/* 底部按钮 */}
									{!this.state.discountType ?
										<View style={{ width: fullWidth, height: 52, flexDirection: 'row', borderTopColor: '#e5e5e5', borderTopWidth: 1 / PixelRatio.get() }}>
											<TouchableOpacity style={{ flex: 1, height: 52, backgroundColor: '#fff', paddingVertical: 5, justifyContent: 'space-around', alignItems: 'center' }}
												onPress={() => {
													this.jumpToPreSalesAdvice(this.productId);
												}}>
												<Image style={{ width: 18, height: 18 }} source={require('../res/images/ProductDetail/003kefu.png')}></Image>
												<Text style={{ color: "#333333", fontSize: 10 }}>客服</Text>
											</TouchableOpacity>
											<TouchableOpacity style={{ flex: 1, height: 52, backgroundColor: '#fff', paddingVertical: 5, justifyContent: 'space-around', alignItems: 'center' }}
												onPress={() => {
													this.addUsualBuy();
												}}>
												<Image style={{ width: 18, height: 18, resizeMode: 'contain' }} source={require('../res/images/ProductDetail/003jiachanggou.png')}></Image>
												<Text style={{ color: "#333333", fontSize: 10 }}>加常购</Text>
											</TouchableOpacity>
											<TouchableOpacity style={{ flex: 1, height: 52, backgroundColor: '#fff', paddingVertical: 5, justifyContent: 'space-around', alignItems: 'center' }}
												onPress={() => {
													if (!this.props.isLogin) {
														Toast.show("请登录");
														this.props.navigator.push({
															component: SignIn,
															params: {
																callback: () => {
																	this.fetchData();
																}
															}
														});
														return;
													}
													this.refs.addPlanModal.show();
												}}
												activeOpacity={0.7}>
												<Image style={{ width: 18, height: 18 }} source={require('../res/images/ProductDetail/003jaijihua.png')}></Image>
												<Text style={{ color: "#333333", fontSize: 10 }}>加计划</Text>
											</TouchableOpacity>
											<TouchableOpacity style={{ flex: 2, height: 52, backgroundColor: '#34457D', justifyContent: 'center', alignItems: 'center' }}
												onPress={() => {
													if (!this.props.isLogin) {
														Toast.show("请登录");
														this.props.navigator.push({
															component: SignIn,
															params: {
																callback: () => {
																	this.fetchData();
																}
															}
														});
														return;
													}
													this.setState({ KeyboardShow: true });
													this.refs.shoppingModal.show();
												}}
												activeOpacity={btnActiveOpacity}>
												<Text style={{ color: "#fff", fontSize: 15 }}>加入进货单</Text>
											</TouchableOpacity>
										</View> :
										<TouchableOpacity style={{ height: 52, justifyContent: 'center', alignItems: 'center', backgroundColor: '#34457d' }}
												onPress={() => {
													if (!this.props.isLogin) {
														Toast.show("请登录");
														this.props.navigator.push({
															component: SignIn,
															params: {
																callback: () => {
																	this.fetchData();
																}
															}
														});
														return;
													}
													this.setState({ KeyboardShow: true });
													this.refs.shoppingModal.show();
												}}
											>
											<Text style={{ fontSize: 16, color: '#fff' }}>立即抢购</Text>
										</TouchableOpacity>
									}
								</View>}
						</DataController>
					</BaseView>
					{/*回到顶层*/}
					{this.state.showUpImg && <TouchableOpacity onPress={() => { this.scrollToTop(); }} style={{ width: 44, height: 44, position: 'absolute', bottom: 70, right: 10 }}>
						<Image style={{ width: 44, height: 44 }} source={require('../res/images/ProductDetail/000zhiding.png')} />
					</TouchableOpacity>}
					{/* 购买弹层 */}
					<MaskModal
						ref="shoppingModal"
						viewType="top"
						animationType='slide'
						contentView={<ShoppingPopup shoppingModal={this.refs.shoppingModal} showJoin={this.showJoin.bind(this)} actions={this.props.actions} price={price} sku={this.state.sku} product={product} navigator={this.props.navigator} />}>
						></MaskModal>
					{/* 多规格弹层 */}
					<MaskModal
						ref="addPurchaseModal"
						viewType="top"
						animationType='slide'
						contentView={<AddPurchasePopup addPurchaseModal={this.refs.addPurchaseModal} product={product} update={this.update.bind(this)} navigator={this.props.navigator} />}>
						></MaskModal>
					{/* 加计划弹层 */}
					<MaskModal
						ref="addPlanModal"
						viewType="top"
						animationType='slide'
						contentView={<AddPlanPopup addPlanModal={this.refs.addPlanModal} product={product} sku={this.productId} navigator={this.props.navigator} />}>
						></MaskModal>
					{/* 促销弹层 */}
					{(product && product.appProductRuleVos.length) > 0 ? <MaskModal
						ref="promoteModal"
						animationType='slide'
						viewType="full"
						contentView={
							<View style={[styles.shoppingView, { height: 320, backgroundColor: '#fff' }]}>
								<View style={{ flex: 1 }}
									activeOpacity={1}>
									<View style={{ marginTop: 16, marginBottom: 25, justifyContent: "center", alignItems: "center" }}>
										<Text style={{ color: "#0c1828", fontSize: 14 }}>促销</Text>
									</View>
									<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
										{this.renderPromoteDetail(product.appProductRuleVos)}
									</ScrollView>
								</View>
								<TouchableOpacity style={styles.bottomBtn}
									onPress={() => {
										this.refs.promoteModal.hide();
									}}
									activeOpacity={0.7}>
									<Text style={styles.bottomBtnFont}>关闭</Text>
								</TouchableOpacity>
							</View>
						}></MaskModal> : <View></View>}			
				</View>
			</Page>
		);
	}
}

function mapStateToProps(state) {
	return {
		cartNum: state.StocksList.shoppingCartNum,
		isLogin: state.Member.isLogin,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({ ...stocksListActions }, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);

const styles = StyleSheet.create({
	//弹层背景
	float: {
		bottom: 0,
		flex: 1,
		width: fullWidth
	},
	shoppingView: {
		position: "absolute",
		bottom: 0,
		width: fullWidth,
		justifyContent: "space-between"
	},
	bottomBtn: {
		height: 50, backgroundColor: '#34457d', justifyContent: 'center', alignItems: 'center'
	},
	bottomBtnFont: {
		color: "#fff", fontSize: 15
	},
	//顶部商品数据（名称、价格、类型）
	prdName: {
		color: "#333333",
		fontSize: 15
	},
	prdPrice: {
		color: "#ff6600",
		fontSize: 16
	},
	prdType: {		
		color: "#bbbbbb",
		fontSize: 12,
	},
	//属性
	paramsRow: {
		width: fullWidth,
		backgroundColor: "#fff",
		flexDirection: 'row',
		borderBottomColor: "#eee",
		borderBottomWidth: 1 / PixelRatio.get()
	},
	leftParam: {
		flex: 1,
		height: 65,
		backgroundColor: "#fff",
		borderRightColor: "#eee",
		borderRightWidth: 1 / PixelRatio.get(),
		justifyContent: "space-between",
		paddingVertical: 13
	},
	rightParam: {
		flex: 1,
		height: 65,
		backgroundColor: "#fff",
		justifyContent: "space-between",
		paddingVertical: 13
	},
	paramTopText: {
		marginLeft: 12,
		color: "#8495a2",
		fontSize: 12
	},
	paramBottomText: {
		marginLeft: 12,
		color: "#7aaad3",
		fontSize: 12
	},
	//行选项
	row: {
		flex: 1,
		backgroundColor: "#fff",
		justifyContent: 'space-between',
		paddingHorizontal: 12,
		alignItems: 'center',
		flexDirection: 'row'
		// borderBottomColor: "#eee",
		// borderBottomWidth: 1/PixelRatio.get()
	},
	rowText: {
		color: "#53606a",
		fontSize: 13
	},
	borderBottom: {
		borderBottomColor: "#e5e5e5",
		borderBottomWidth: 1 / PixelRatio.get()
	},
	KeyboardBtn: {
		width: fullWidth / 4, height: 54 * Styles.theme.IS, justifyContent: 'center', alignItems: 'center', borderWidth: 1 / PixelRatio.get(), borderColor: '#e5e5e5',
	}
});