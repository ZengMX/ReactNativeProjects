// TODO：使用新接口，修改相关字段
// TODO: 阴影效果暂未实施
// TODO: 自定义键盘未实现

import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	TouchableOpacity,
	Keyboard,
	PixelRatio,
	TextInput,
	Animated,
	Easing,
	InteractionManager,
} from 'react-native';
let screenWidth = require('Dimensions').get('window').width;
import KeyboardSpacer from 'react-native-keyboard-spacer';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

import _ from 'underscore';
import { Fetch, ValidateUtil } from 'future/public/lib/';
import { RefreshableListView, RightNavBtn, BaseView, MaskModal, TextInputC, Separator } from 'future/public/widgets';
import Styles from 'future/public/lib/styles/Styles';
import styles from '../styles/FastBuySearch';
import Toast from 'react-native-root-toast';
import StocksList from '../../stocksList/components/StocksList';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as StocksListActions from '../../stocksList/actions/stocksList';

class Search extends Component {

	constructor(props) {
		super(props);
		this.state = {
			searchField: '', // 搜索关键词
			rowData: {}, // 选中的商品信息
			value: '1', // 添加商品数目
			isShowToCart: false,
			opactyAnim: new Animated.Value(0),
		}
		this.fetchData = this._fetchData.bind(this);
		this.renderRow = this._renderRow.bind(this);
	}

	// 清除搜索刷新定时器
	componentWillUnmount() {
		this.onSubmitTimer && clearTimeout(this.onSubmitTimer);
		this.timer && clearTimeout(this.timer);
	}

	// 监听搜索框输入的内容
	onChangeText = (searchField) => {
		this.setState({ searchField: searchField });
		this.onSubmitTimer && clearTimeout(this.onSubmitTimer);
		this.onSubmitTimer = setTimeout(() => {
			this.onSubmitEditing();
		}, 500);
	};

	// 刷新搜索列表
	onSubmitEditing = () => {
		if (this.state.searchField == '') { return }
		this.refs.listView && this.refs.listView.pullRefresh();
	}

	// 获取搜索的数据
	_fetchData(page, success, error) {
		new Fetch({
			url: '/app/fastBuy/searchProduct.json',
			data: {
				keyword: this.state.searchField
			},
		}).dofetch().then((data) => {
			success(data.result, 10 * (page - 1) + data.result.length, data.totalCount);
		}).catch((err) => {
			console.log('=> catch: ', err);
			error && error();
			// Toast.show("请求失败")
		});
	}

	// 搜索项目
	_renderRow(rowData, sectionID, rowID, highlightRow) {
		console.log('rowDatarowDatarowData', rowData)
		let price = this.props.userType != '3' ? "¥" + rowData.price ? rowData.price.toFixed(2) : '--' : '--/--';
		let color = this.props.userType != '3' && rowData.isBannedProduct == 'N' ? 'rgb(255,138,0)' : '#ccc';
		// let price2 = rowData.isBannedProduct == 'N' ? '¥' + price : '该商品已禁销';
		let price2 = '¥' + price;
		// console.log('rowData', rowData)
		return (
			<View style={styles.list}>
				<Text numberOfLines={1} style={styles.listTitle}>{rowData.title}</Text>
				<Text numberOfLines={1} style={styles.listSpecPack}>规格：{rowData.specPack}</Text>
				<Text numberOfLines={1} style={styles.listSpecPack}>厂家：{rowData.factory}</Text>
				<Text numberOfLines={1} style={styles.listSpecPack}>供应商：{rowData.shopNm}</Text>
				<Text style={styles.listPrice}><Text style={styles.listPriceNum}>{price2}</Text></Text>

				<TouchableOpacity
					style={styles.listBtn}
					onPress={() => { this.setState({ rowData: rowData, value: '1' }); this.refs.SelectQuantity.show() } } >
					<Image source={require('../res/images/005jiarujinhuodan_02.png')} style={styles.listImg}></Image>
				</TouchableOpacity>
			</View>
		)
	}

	//添加成功之后出现的浮层动画	
	startTipAnimate() {
		this.setState({ isShowToCart: true }, () => {
			Animated.timing(
				this.state.opactyAnim, {
					toValue: 1,
					duration: 300,
					easing: Easing.in
				}).start(() => {
					this.timer = setTimeout(() => {
						Animated.timing(
							this.state.opactyAnim,
							{
								toValue: 0,
								duration: 200,
								easing: Easing.in
							}
						).start(() => {
							this.timer && this.setState({ isShowToCart: false });
						})
					}, 2000)
				})
		})
	}


	// 加入进货单
	addToCart() {

		if (this.state.value == 0) {
			this.refs.SelectQuantity.toast("数量不能为0");
			return;
		}

		//加入购物车
		new Fetch({
			url: '/app/cart/add.json',
			method: 'POST',
			data: {
				type: "normal",
				handler: "sku",
				objectId: this.state.rowData.skuId,
				quantity: this.state.value,
			},
			forbidToast: true,
		}).dofetch().then((data) => {
			if (data.success) {
				this.refs.SelectQuantity.toast("加入进货单成功");
				this.refs.SelectQuantity.hide();
				this.startTipAnimate();
				this.props.actions && this.props.actions.setShoppingCartNum(data.allProductNum);
			}
		}).catch((err) => {
			this.refs.SelectQuantity.toast(err.object.errorText);
			console.log('=> catch: ', err);
		});

	}

	//底部弹出层
	renderSelectQuantity() {
		// console.log('>>>>>>>>>>>>KKKKKK',this.state.rowData)
		let { title, specPack, unit, factory, approvalNumber, limit, limitNum, remainStockRange, midPackTotal, isUnbundled, remainStock, shopNm } = this.state.rowData
		total = this.state.rowData.price * this.state.value
		let str = isUnbundled == 'N' ? "不可拆零" : "可拆零"
		let price = this.state.rowData && this.state.rowData.price ? this.state.rowData.price.toFixed(2) : '--/--';
		var maxLength = 0;
		if(remainStockRange && remainStockRange.startsWith('<')){
			maxLength = parseInt(remainStockRange).toString().length;
		}else {
			maxLength = 6;
		}
		
		return (
			<TouchableOpacity style={styles.modal} activeOpacity={1} onPress={Keyboard.dismiss}>

				<View style={styles.productBox} showsVerticalScrollIndicator={false}>

					<View style={[styles.productTitleBox]}>
						<Text numberOfLines={1} style={styles.productTitle}>{title}</Text>
						<TouchableOpacity
							onPress={() => {
								this.refs.SelectQuantity.hide();
								this.setState({
									value: null
								})
							} } activeOpacity={0.7}>
							<Image source={require('../res/images/003guanbi.png')} />
						</TouchableOpacity>
					</View>
					<Text style={styles.productspecPack}>规格：{specPack}</Text>
					<Text style={styles.productspecPack}>厂家：{factory} </Text>
					<Text style={styles.productspecPack}>供应商：{shopNm} </Text>
					<Text style={styles.productspecPack}>批准文号：{approvalNumber} </Text>
					<Text style={styles.productprice}>¥{price}</Text>

				</View>

				<View style={styles.purchaseBox}>
					<View style={styles.purchaseTitleBox}>
						<Text style={styles.purchaseTitleLeft}>采购数量</Text>
						<Text style={styles.purchaseTitleRight}>中包装：{midPackTotal}/{str}；库存：{remainStockRange}</Text>
					</View>

					<View style={styles.purchaseInputBox}>
						<TextInputC
							style={[styles.purchaseInput]}
							ref="textInput"
							keyboardType={'number-pad'}
							placeholderTextColor="#ff8a00"
							clearButtonMode='while-editing'
							underlineColorAndroid='transparent'
							value={this.state.value}
							maxLength={maxLength}
							onChangeText={(value) => {
								if(Number(value) > remainStock){
									this.setState({ value: remainStock.toString(),});
									this.refs.textInput.blur();
									this.refs.SelectQuantity.toast('库存不足');
								}else{
									this.setState({ value: value });
								}
							}}
							placeholderTextColor='#e5e5e5' />

						<Text style={styles.purchaseUnit}>{unit}</Text>
						<Text style={styles.packTitle}>小计：<Text style={styles.packPrice}>¥{total ? total.toFixed(2) : '--'}</Text></Text>
					</View>
					{/*TODO加入进货单的请求还没有添加*/}
					<TouchableOpacity onPress={() => { this.addToCart(); Keyboard.dismiss(); } } activeOpacity={0.7}>
						<View style={styles.btn}>
							<Text style={styles.btnTitle}>确定</Text>
						</View>
					</TouchableOpacity>
				</View>

				<KeyboardSpacer />
			</TouchableOpacity>)
	}

	onClickGoToCart() {
		// RCTDeviceEventEmitter.emit('changeTabBarIdx', { idx: 2, goTop: true });
		this.props.navigator.push({
			component: StocksList
		})
	}

	render() {
		let head = <View style={styles.search}>
			<Image source={require('future/public/commons/res/000sousuo.png')} style={styles.searchImg} />
			<TextInputC
				style={styles.searchKeyword}
				autoFocus={true}
				value={this.state.searchField}
				placeholder="搜索药品名／厂家／准字号"
				placeholderTextColor='#73777C'
				numberOfLines={1}
				maxLength={20}
				underlineColorAndroid='transparent'
				clearButtonMode='while-editing'
				onChangeText={this.onChangeText}
				onSubmitEditing={() => { } }
				/>
		</View>;

		{/*右上角的按钮*/ }
		let rightButton = (
			<RightNavBtn
				title="取消"
				titleStyle={{ color: '#fff', fontSize: 16 }}
				handler={() => {
					this.props.navigator.pop();
					this.props.params && this.props.params.callback && this.props.params.callback('');
				} } />
		);

		return (
			<View style={{ flex: 1 }}>
				<BaseView
					ref={base => this.base = base}
					navigator={this.props.navigator}
					mainColor={'#34457D'}
					statusBarStyle={'light-content'}
					head={head}
					hideLeftBtn={true}
					rightButton={rightButton}>

					<RefreshableListView
						ref="listView"
						initialListSize={1}
						pageSize={10}
						refreshable={false}
						autoLoadMore={true}
						autoRefresh={false}
						keyboardDismissMode={'on-drag'}
						fetchData={this.fetchData}
						renderRow={this.renderRow.bind(this)}
						scrollRenderAheadDistance={200}
						onEndReachedThreshold={200}
						/>

					<MaskModal
						ref="SelectQuantity"
						viewType="full"
						animationType='slide'
						contentView={this.renderSelectQuantity()}
						/>

				</BaseView>
				{/*前往进货单弹窗*/}
				{
					this.state.isShowToCart == true ?
						<Animated.View style={[styles.toCartBox, { opacity: this.state.opactyAnim }]}>
							<View style={styles.toCartNumberBox}>
								<Image style={styles.toCartNumberImg} source={require('../res/images/005jinhuodan.png')} />
								{/*TODO：进货单有数据时显示*/}
								{true &&
									<View style={styles.toCartNumber}>
										<Text style={styles.toCartNumberTitle}>{this.state.value}</Text>
									</View>
								}
							</View>
							<Text style={styles.toCartTotal}>合计:
						<Text style={styles.toCartSymbol}>¥
							<Text style={styles.toCartMoney}>
								{Number.parseInt(this.state.rowData.price * this.state.value).toFixed(2)}
							</Text>
						</Text>
						</Text>
						<TouchableOpacity
							onPress={() => {
									this.onClickGoToCart();
							} }
							style={styles.toCartBtn}>
							<Text style={styles.toCartBtnTitle}>前往进货单</Text>
						</TouchableOpacity>
					</Animated.View>
					:
					<View></View>
				}
		</View>	
		);
	}
}

function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(StocksListActions,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Search);