import React, { Component } from 'react';
import {
	View,
	ScrollView,
	Dimensions,
	StyleSheet,
	Navigator,
	TouchableOpacity,
	Image,
	PixelRatio,
	Modal,
	TextInput,
	Platform,
	WebView,
	PanResponder
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
	Loading,
	TextInputC,
	MaskModal,
} from 'future/public/widgets';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from 'future/src/member/actions/Member';
import * as stocksListActions from 'future/src/stocksList/actions/stocksList';
import * as groupbuyStyle from '../styles/GroupBuyDetail';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import WebViewPage from 'future/public/commons/WebViewPage';
import _ from 'underscore';
import PhotoBrowser from '@imall-test/react-native-photobrowser';
import GroupBuyDetailOther from './GroupBuyDetailOther';
import MessageCenter from 'future/src/member/components/MessageCenter';
import Login from 'future/src/member/components/Login';
import Search from "future/src/home/components/Search";
import StocksList from "future/src/stocksList/components/StocksList";
import MoreOperation from '../../commons/moreOperation/components/MoreOperation';
import Styles from 'future/public/lib/styles/Styles';
import FrontToast from 'react-native-easy-toast';

var fullWidth = require('Dimensions').get('window').width;
var fullHeight = require('Dimensions').get('window').height;
var scrollViewHeight = fullHeight - 52 - 64;
let keyStyles = StyleSheet.create({
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
		flex: 1,
		color: "#bbbbbb",
		fontSize: 11,
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
		height: 69,
		backgroundColor: "#fff",
		borderRightColor: "#eee",
		borderRightWidth: 1 / PixelRatio.get(),
		justifyContent: "space-between",
		paddingVertical: 13
	},
	rightParam: {
		flex: 1,
		height: 69,
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
		fontSize: 10
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
let styles = Object.assign({}, groupbuyStyle.default, keyStyles);

// 倒计时
class Countdown extends Component {
	constructor(props) {
		super(props);

		this.state = {
			leftSeconds: this.props.leftSeconds,
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
		if (time.d == 0) {
			time.d = '00';
		}
		if (time.h < 10) {
			time.h = '0' + time.h;
			if (time.h == 0) {
				time.h = '00';
			}
		}
		if (time.m < 10) {
			time.m = '0' + time.m;
			if (time.m == 0) {
				time.m = '00';
			}
		}
		if (time.s < 10) {
			time.s = '0' + time.s;
		}
		return time;
	}
	_endData() {
		return this.state.leftSeconds;
	}
	//<Text style={{ color: '#fff', fontSize: 11, backgroundColor: 'transparent', }}>仅剩  {time.d}天{time.h}:{time.m}:{time.s}</Text>
	_rendOverTimes(time) {
		return (
			<View style={{ width: 135, height: 54, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>
				<Text style={{ fontSize: 12, color: '#ff7b00', marginRight: Platform.OS === 'ios' ? 20 : 10 }}>距结束剩余</Text>
				<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, marginRight: Platform.OS === 'ios' ? 20 : 10 }}>
					<View style={{ height: 19, backgroundColor: '#ff7b00', borderRadius: 4, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 }}>
						<Text style={{ color: '#fff', fontSize: 10 }}>{time.d}</Text>
					</View>
					<Text style={{ color: '#ff7b00', fontSize: 10, marginHorizontal: 2 }}>{'天'}</Text>
					<View style={{ width: 19, height: 19, backgroundColor: '#ff7b00', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
						<Text style={{ color: '#fff', fontSize: 10 }}>{time.h}</Text>
					</View>
					<Text style={{ color: '#ff7b00', fontSize: 10, marginHorizontal: 2 }}>{':'}</Text>
					<View style={{ width: 19, height: 19, backgroundColor: '#ff7b00', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
						<Text style={{ color: '#fff', fontSize: 10 }}>{time.m}</Text>
					</View>
					<Text style={{ color: '#ff7b00', fontSize: 10, marginHorizontal: 2 }}>{':'}</Text>
					<View style={{ width: 19, height: 19, backgroundColor: '#ff7b00', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
						<Text style={{ color: '#fff', fontSize: 10 }}>{time.s}</Text>
					</View>
				</View>
			</View>

		);
	}
	render() {
		this.renderCountDown(this.state.leftSeconds);
		let time = this._dealHMS();
		return (
			<View style={{ width: 135, height: 54, backgroundColor: '#ffe3be', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
				{
					this.state.leftSeconds > 0 ?
						this._rendOverTimes(time)
						: <Text style={{ color: '#ff7b00', fontSize: 11, backgroundColor: 'transparent', }}>活动已结束</Text>
				}
			</View>

		)
	}
}

class ShoppingPopup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			product: this.props.product || null,
			sku: this.props.sku || null,
			unitPrice: this.props.price,
			limitNum: this.props.product.limitBuy,
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
			type: "groupBuy",
			handler: "groupBuy",
			objectId: this.state.sku,
			quantity: buyNum,

		};
		this.props.shoppingModal.showLoading();
		this.props.actions.addToCart(cartData, () => {
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
							<TouchableOpacity style={styles.KeyboardBtn} onPress={() => { this.props.closeModal(); }}>
								<Image style={{ tintColor: '#ccc' }} source={require('../res/images/key.png')} />
							</TouchableOpacity>
						</View>
					</View>
					<View style={{ width: fullWidth / 4 }}>
						<TouchableOpacity style={{ height: 108 * Styles.theme.IS, justifyContent: 'center', alignItems: 'center', borderWidth: 1 / PixelRatio.get(), borderColor: '#e5e5e5', }}
							onPress={() => {
								this.setState({ buyNum: buyNum.substr(0, buyNum.length - 1) });

							}}>
							<Image source={require('../res/images/003back.png')} />
						</TouchableOpacity>
						<TouchableOpacity style={{ height: 108 * Styles.theme.IS, backgroundColor: '#0082ff', justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.addToCart() }}>
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

//TODO 缺少登录回调（价格未登录返回null，登录后需重新请求数据）
class GroupBuyDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisibleModal: false,	//图片Modal是否显示
			imgIndex: 0,			//图片下标
			promoteText: null,		//促销信息字段
			product: null,			//商品数据
			cartNum: this.props.cartNum || 0,	//购物车数量
			sku: null,		//当前sku（默认选中第一个sku）
			showUpImg: false,
			beJoin: false,
		}

		this.image = [];	//商品图片资源
		this.scrollViewHeight = fullHeight - 64 - 52;
	}

	onOpen() {
		this.fetchData();
	}

	scrollNextPage(e) {
		if (e.nativeEvent.contentSize.height > e.nativeEvent.layoutMeasurement.height) {
			if (Platform.OS == 'ios') {
				if (e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - e.nativeEvent.layoutMeasurement.height + 60) {
					this.transformStart(scrollViewHeight + 60);
					this.setState({ showUpImg: true });
				}
			} else {
				if (e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - e.nativeEvent.layoutMeasurement.height - 2) {
					this.transformStart(scrollViewHeight + 60);
					this.setState({ showUpImg: true });
				}
			}
		} else {
			if (e.nativeEvent.contentOffset.y >= 0) {
				this.transformStart(scrollViewHeight + 60);
				this.setState({ showUpImg: true });
			}
		}
	}

	scrollPreviousPage(e) {
		if (e.nativeEvent.contentSize.height > e.nativeEvent.layoutMeasurement.height) {
			if (Platform.OS == 'ios') {
				if (e.nativeEvent.contentOffset.y <= -60) {
					this.transformStart(0);
					this.setState({ showUpImg: false });
				}
			} else {
				if (e.nativeEvent.contentOffset.y <= 2) {
					this.transformStart(0);
					this.setState({ showUpImg: false });
				}
			}
		} else {
			if (e.nativeEvent.contentOffset.y <= 0) {
				this.transformStart(0);
				this.setState({ showUpImg: false });
			}
		}
	}

	scrollToTop = () => {
		this.scroll.scrollTo({ y: 0 });
		this.scroll1.scrollTo({ y: 0 });
		this.setState({ showUpImg: false });
	}

	transformStart(value) {
		this.scroll.scrollTo({ x: 0, y: value, animated: true });
	}


	fetchData() {
		let defultGroupBuyId = this.props.params.groupBuyId == undefined ? null : this.props.params.groupBuyId;
		new Fetch({
			url: "/app/groupbuy/groupbuyDetail.json",
			method: "POST",
			data: {
				groupBuyId: defultGroupBuyId,
			}
		}).dofetch().then((data) => {
			console.log("data: ", data);
			this.setState({
				product: data.result,
			})
		}).catch((err) => {
			console.log("获取普通商品详情数据失败: ", err);
			this.refs.base.controlViewByErr(err);
		})
	}

	//渲染navbar右边按钮
	renderRightButton() {
		return (
			<View style={{ flexDirection: "row", alignItems: 'center', width: 83, flex: 1, justifyContent: 'flex-end' }}>
				{/*订单*/}
				<TouchableOpacity
					onPress={() => {
						this.props.navigator.push({
							component: StocksList,
							params: {
								type: 'groupBuy',
							}
						})
					}}
					activeOpacity={0.7}>
					<Image style={{ width: 16, height: 20 }} source={require('../res/000jinhuodan.png')} resizeMode='stretch' />
				</TouchableOpacity>
				{/*更多*/}
				<View style={{ justifyContent: 'center', marginLeft: 10, }}>
					<MoreOperation
						navigator={this.props.navigator}
						order={
							[{
								module: 'index',
							}, {
								module: 'search',
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
			</View>
		)
	}

	_addToGroudBuy() {
		if (!this.props.isLogin) {
			Toast.show("请登录");
			this.props.navigator.push({
				component: Login,
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
	}
	//查看大图
	showMaskImage = (images, index) => {
		PhotoBrowser.browserWithImages(images, index);
	}

	showJoin() {
		this.setState({ beJoin: true });
		this.timer = setTimeout(() => {
			this.setState({ beJoin: false });
		}, 1500)
	}

	/* 底部按钮 */
	_renderButtom() {
		return (
			<View style={{ width: fullWidth, height: 50, backgroundColor: '#34457d' }}>
				<TouchableOpacity style={{ flex: 1, height: 52, backgroundColor: '#34457d', justifyContent: 'center', alignItems: 'center' }}
					onPress={() => {
						this._addToGroudBuy();
					}}>
					<Text style={{ color: "#fff", fontSize: 14 }}>立即参团</Text>
				</TouchableOpacity>
			</View>);
	}
	_subPrice(params) {
		let data = params.toString();
		let result = [];
		if (data.indexOf('.') == -1) {
			result[0] = data;
			result[1] = '00';
		} else {
			result = data.split(".");
		}
		return result;
	}

	render() {
		let product = this.state.product || null;
		let picList = [];
		let price = [];
		let orgPrice = [];
		if (product) {
			picList.push(product.pictFileId);
			price = this._subPrice(product.price);
			orgPrice = this._subPrice(product.orgPrice);
		}
		return (
			<Page onOpen={this.onOpen.bind(this)}
				navigator={this.props.navigator}>
				<View style={{ flex: 1 }}>
					<BaseView navigator={this.props.navigator}
						ref='base'
						statusBarStyle={'default'}
						title={{ title: '团购详情', tintColor: '#333333' }}
						titlePosition={'center'}
						rightButton={this.renderRightButton()}
						reload={() => this.fetchData()}
						triangleStyle={
							{
								// right: 20,
								height: 4,
								width: 8
							}}>
						<DataController data={product}>
							{product &&
								<View style={{ flex: 1 }}>
									<ScrollView
										ref={scroll => this.scroll = scroll}
										scrollEnabled={false}
										showsVerticalScrollIndicator={false}
										style={{ flex: 1 }}>
										<View style={{ height: fullHeight - 64, justifyContent: 'space-between' }}>
											<ScrollView style={{ width: fullWidth, height: this.scrollViewHeight }}
												showsVerticalScrollIndicator={false}
												ref={scroll1 => this.scroll1 = scroll1}
												scrollEnabled={true}
												onScrollEndDrag={this.scrollNextPage.bind(this)}>
												{/*轮播图片*/}
												<Banner
													removeClippedSubviews={false}
													style={{ backgroundColor: '#fff' }}
													images={picList}
													height={240}
													imageWidth={fullWidth}
													autoplay={false}
													imageProps={{ resizeMode: 'contain' }}
													onPress={(index) => {
														this.showMaskImage(picList, index);
													}}
													paginationStyle={{
														bottom: 10, left: 0, right: 0
													}}
													loop={true}>
												</Banner>
												{
													<View style={{ height: 72, width: fullWidth, backgroundColor: '#fff', flexDirection: 'row' }}>
														<View style={{ width: fullWidth, height: 54, flexDirection: 'row', backgroundColor: '#fff', alignSelf: 'flex-end' }}>
															<Image style={{ flex: fullWidth - 135, height: 54, flexDirection: 'row', backgroundColor: '#00000000', paddingLeft: 14, alignItems: 'center' }} source={require('../res/tuangoujianbian.png')} resizeMode='stretch'>
																<View style={{ alignItems: 'flex-end', flexDirection: 'row', height: 30 }}>
																	<Text style={{ fontSize: 13, color: '#fff' }}>￥</Text>
																	<Text style={{ fontSize: 25, color: '#fff', marginLeft: 5, marginBottom: -3 }}>{[price[0]]}.</Text>
																	<Text style={{ fontSize: 17, color: '#fff', marginBottom: -2 }}>{[price[1]]}</Text>
																	<Text style={{ fontSize: 11, color: '#fff', marginLeft: 8, textDecorationLine: 'line-through' }}>￥{orgPrice[0]}.{[orgPrice[1]]}</Text>
																</View>
															</Image>
															<Countdown leftSeconds={product.leftTime} ref="Count"></Countdown>
														</View>
														<View style={{
															width: 42,
															height: 21,
															backgroundColor: '#fff',
															position: "absolute",
															left: 10,
															top: 9,
															justifyContent: 'center',
															alignItems: 'center',
															borderRadius: 10.5,
															shadowOffset: { width: 2, height: 2 },
															shadowColor: 'black',
															shadowOpacity: 0.2,
															shadowRadius: 3
														}}>
															<Text style={{ fontSize: 12, color: '#ff964f' }}>团购</Text>
														</View>
													</View>
												}
												<View style={{ width: fullWidth, backgroundColor: '#fff', paddingHorizontal: 12 }}>
													<View style={{ flex: 1, height: 76, flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'center' }}>
														<Text style={{ fontSize: 15, color: '#333' }} numberOfLines={2}>{product.productNm}</Text>
														<Text style={{ fontSize: 13, color: '#546E7A', marginTop: 10 }}>供应商 {product.shopNm ? product.shopNm : "暂无"}</Text>
													</View>

													<View style={{ flex: 1, height: 35, borderTopColor: "#e5e5e5", borderTopWidth: 1 / PixelRatio.get(), alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
														<Text style={[styles.prdType, { textAlign: 'left' }]}>类型 {product.prescriptionType ? product.prescriptionType : "无"}</Text>
														<Text style={[styles.prdType, { textAlign: 'center' }]}>已抢 {product.soldQuantity}</Text>
														<Text style={[styles.prdType, { textAlign: 'right' }]}>{product.isUnbundled == "N" ? "不可拆零" : "可拆零"}</Text>
													</View>
												</View>
												{/* 商品属性 */}
												<View style={[styles.paramsRow, { marginTop: 10, borderBottomColor: "#eee", borderBottomWidth: 1 / PixelRatio.get() }]}>
													<View style={styles.leftParam}>
														<Text style={styles.paramTopText}>规格</Text>
														<Text style={styles.paramBottomText} numberOfLines={1}>{product.specNm ? product.specNm : "暂无"}</Text>
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
														<Text style={styles.paramBottomText} numberOfLines={1}>{product.form ? product.form : "暂无"}</Text>
													</View>
												</View>
												<View style={styles.paramsRow}>
													<View style={styles.leftParam}>
														<Text style={styles.paramTopText}>生产产家</Text>
														<Text style={styles.paramBottomText} numberOfLines={1}>{product.factory ? product.factory : "暂无"}</Text>
													</View>
													<View style={styles.rightParam}>
														<Text style={styles.paramTopText}>批准文号</Text>
														<Text style={styles.paramBottomText} numberOfLines={1}>{product.approvalNumber ? product.approvalNumber : "暂无"}</Text>
													</View>
												</View>
												<View style={styles.paramsRow}>
													<View style={styles.leftParam}>
														<Text style={styles.paramTopText}>建议售价</Text>
														<Text style={styles.paramBottomText} numberOfLines={1}>{product.orgPrice ? ("￥" + product.orgPrice) : "暂无"}</Text>
													</View>
													<View style={styles.rightParam}>
														<Text style={styles.paramTopText}>商品编码</Text>
														<Text style={styles.paramBottomText} numberOfLines={1}>{product.productCoding ? product.productCoding : "暂无"}</Text>
													</View>
												</View>
												<View style={{ height: 50, backgroundColor: '#f8f8f8', justifyContent: 'center', alignItems: 'center' }}>
													<Text style={{ fontSize: 12, color: '#666' }}>继续拖动，查看图文详情</Text>
												</View>

											</ScrollView>

										</View>
										<ScrollView
											showsVerticalScrollIndicator={false}
											scrollEnabled={true}
											onScrollEndDrag={this.scrollPreviousPage.bind(this)}
											style={{ height: this.scrollViewHeight }}>
											<View style={{ marginTop: -60, height: 60, backgroundColor: '#f8f8f8', justifyContent: 'center', alignItems: 'center' }}>
												<Text style={{ fontSize: 12, color: '#666' }}>释放返回商品简介</Text>
											</View>
											<GroupBuyDetailOther url={'/app/productDetail.jsp?productId=' + product.productId} productId={product.productId} />
										</ScrollView>
									</ScrollView>
									{/* 底部按钮 */}
									{this._renderButtom()}
								</View>
							}
						</DataController>
					</BaseView>
					{/*回到顶层*/}
					{this.state.showUpImg && <TouchableOpacity onPress={() => { this.scrollToTop(); }} style={{ width: 44, height: 44, position: 'absolute', bottom: 70, right: 10 }}>
						<Image style={{ width: 44, height: 44 }} source={require('../res/000zhiding.png')} />
					</TouchableOpacity>}
					{/* 购买弹层 */}
					<MaskModal
						ref="shoppingModal"
						viewType="top"
						animationType='slide'
						contentView={
							<ShoppingPopup
								shoppingModal={this.refs.shoppingModal}
								showJoin={this.showJoin.bind(this)}
								actions={this.props.actions}
								price={product && product.price}
								sku={product && product.groupBuyId}
								product={product}
								navigator={this.props.navigator}
								closeModal={() => {
									this.refs.shoppingModal.hide()
								}}
							/>
						}
					/>
				</View>
			</Page>
		);
	}
}

function mapStateToProps(state) {
	return {
		isLogin: state.Member.isLogin
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({ ...userActions, ...stocksListActions }, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(GroupBuyDetail);