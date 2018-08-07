import React, { Component } from 'react';
import {
	View,
	ScrollView,
	Dimensions,
	StyleSheet,
	TouchableOpacity,
	Image,
	PixelRatio,
	TextInput,
	Platform
} from 'react-native';
import {
	Fetch,
	imageUtil,
	ValidateUtil
} from 'future/src/lib';
import {
	Text,
} from 'future/src/widgets';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import _ from 'underscore';

var fullWidth = require('Dimensions').get('window').width;
var fullHeight = require('Dimensions').get('window').height;
export default class ShoppingPopup extends Component {
	constructor(props) {
		super(props);
		let product = this.props.product;
		this.state = {
			buyNum: product.buyNum
		}
	}

	buyNumChange(buyNum){
		let product = this.props.product;
		let num = buyNum;
		if((buyNum <= 0 || !buyNum)){
			this.props.shoppingModal.toast("请输入正确商品数量");
			return;
		}
		if((buyNum > product.limit) && (product.limit > 0)){
			this.props.shoppingModal.toast("该商品限购" + product.limit + product.unit);
			return;
		}
		if ((product.isUnbundled == "N") && (buyNum % product.midPackTotal != 0)) {
			this.props.shoppingModal.toast("该商品不可拆零,已自动调整数量");
			this.setState({
				buyNum: ValidateUtil.fixedNum(buyNum, product.midPackTotal).toString()
			});
			return;
		}
		let changeValue = num > 0 ? (num * product.price - product.totalPrice) : 0;
		let selectedNorMap = this.props.selectedNorMap;
		selectedNorMap[product.skuId] = num;
		this.props.onBuyNumChange && this.props.onBuyNumChange(changeValue, selectedNorMap, num > 0 ? (num * product.price) : 0, this.props.itemIndex, num, product.skuId);
		this.props.shoppingModal.hide();
	}

	render() {
		let product = this.props.product;

		let limitNum = (product.limit > 0) ? product.limit : null;
		let buyNum = this.state.buyNum == null ? product.buyNum : this.state.buyNum;
		let price = Number(product.price * (buyNum || 0)).toFixed(2);
		let stock = product.remainStockRange;
		return (
			<View style={styles.shoppingView}>
				<View style={{ height: 117, paddingHorizontal: 12, justifyContent: 'space-around' }}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text style={{ color: "#323232", fontSize: 14 }}>采购数量</Text>
						<Text numberOfLines={1}
							text={[{ value: limitNum ? "限购" : "", style: { fontSize: 13, color: "#323232" } },
							{ value: limitNum, style: { fontSize: 13, color: "#ff8a00" } },
							{ value: limitNum ? "件 / " : "", style: { fontSize: 13, color: "#323232" } },
							{ value: "库存 : " + stock, style: { fontSize: 13, color: "#323232" } },
							]}></Text>
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
						<TextInput
						ref="textInput"
						style={{width: fullWidth-50, height:38, fontSize: Platform.OS === "ios" ? 40 : 35, color: "#ff8a00", padding: 0}}
						keyboardType='numeric'
						underlineColorAndroid={'transparent'}
						value={buyNum.toString()}
						blurOnSubmit={true}
						onChangeText={(buyNum) => {
							this.setState({ buyNum : ValidateUtil.isNumber(buyNum) ? buyNum : ""})
						}}
						maxLength={11}
						></TextInput>
						<Text style={{color: "#333", fontSize: 15}}>{product.unit || "盒"}</Text>
					</View>
				</View>
				<View style={{ width: fullWidth, height: 120, paddingTop: 15, paddingBottom: 20, justifyContent: 'space-between', borderTopColor: "#e5e5e5", borderTopWidth: 1 / PixelRatio.get() }}>
					<View style={{ width: fullWidth, justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 12 }}>
						<Text style={{ color: "#53606a", fontSize: 13 }}>中包装: {product.midPackTotal}/{product.isUnbundled == "N" ? "不可拆零" : "可拆零"}</Text>
						<Text numberOfLines={1}
						text={[{ value: "小计：", style: { fontSize: 13, color: "#53606a" } },
						{ value: "￥", style: { fontSize: 12, color: "#53606a" } },
						{ value: price, style: { fontSize: 15, color: "#53606a" } },
						]}></Text>
					</View>
					<TouchableOpacity style={{ height: 46, backgroundColor: '#3491df', justifyContent: 'center', alignItems: 'center', marginHorizontal: 12, borderRadius: 5, borderWidth: 1 / PixelRatio.get(), borderColor: '#3491df' }}
						onPress={() => { this.buyNumChange(this.state.buyNum) } }
						activeOpacity={0.7}>
						<Text style={{ color: "#fff", fontSize: 15 }}>确定</Text>
					</TouchableOpacity>
				</View>
				<KeyboardSpacer />
			</View>
		)
	}
}

const styles = StyleSheet.create({
	shoppingView: {
		position: "absolute",
		bottom: 0,
		width: fullWidth,
		backgroundColor: "#fff",
		justifyContent: "space-between"
	},
});