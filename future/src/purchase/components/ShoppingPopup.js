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
// import {
// 	Fetch,
// 	imageUtil,
// 	ValidateUtil
// } from 'future/public/lib';
// import {
// 	Text,
// } from 'future/public/src/widgets';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Text from "../../../public/widgets/text/Text";
import * as ValidateUtil from "../../../public/lib/ValidateUtil";

var fullWidth = require('Dimensions').get('window').width;
var fullHeight = require('Dimensions').get('window').height;
export default class ShoppingPopup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			buyNum: props.num
		}
	}

	buyNumChange(buyNum){
		if((buyNum <= 0 || !buyNum)){
			this.props.shoppingModal.toast("请输入正确商品数量");
			return;
		}
		if((buyNum > this.props.limitNum) && (this.props.limitNum > 0)){
			this.props.shoppingModal.toast("该商品限购" + this.props.limitNum + this.props.unit);
			return;
		}
		let changeValue = buyNum > 0 ? buyNum : 0;
		this.props.changeValue(changeValue,this.props.productId,this.props.skuId);
		this.props.shoppingModal.hide();
	}

	render() {

		let limitNum = (this.props.limit > 0) ? this.props.limit : null;
		let price = Number(this.props.price * (this.state.buyNum || 0)).toFixed(2);
		let stock = this.props.remainStockRange;
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
							]}/>
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
						<TextInput
						ref="textInput"
						style={{width: fullWidth-50, height:38, fontSize: Platform.OS === "ios" ? 40 : 35, color: "#ff8a00", padding: 0}}
						keyboardType='numeric'
						underlineColorAndroid={'transparent'}
						value={this.state.buyNum.toString()}
						blurOnSubmit={true}
						onChangeText={(buyNum) => {
							this.setState({ buyNum : ValidateUtil.isNumber(buyNum) ? buyNum : ""})
						}}
						maxLength={11}
						/>
						<Text style={{color: "#333", fontSize: 15}}>{this.props.unit}</Text>
					</View>
				</View>
				<View style={{ width: fullWidth, height: 120, paddingTop: 15, paddingBottom: 20, justifyContent: 'space-between', borderTopColor: "#e5e5e5", borderTopWidth: 1 / PixelRatio.get() }}>
					<View style={{ width: fullWidth, justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 12 }}>
						<Text style={{ color: "#53606a", fontSize: 13 }}>{this.props.specPack}</Text>
						<Text numberOfLines={1}
						text={[{ value: "小计：", style: { fontSize: 13, color: "#53606a" } },
						{ value: "￥", style: { fontSize: 12, color: "#53606a" } },
						{ value: price, style: { fontSize: 15, color: "#53606a" } },
						]}/>
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