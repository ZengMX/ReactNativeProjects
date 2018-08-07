/**
 *   采购计划的PrdListItem
 */

import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	TouchableOpacity
} from 'react-native';
var fullWidth = require('Dimensions').get('window').width;
import styles from '../styles/StocksList.css.js'
import { NumberInput } from 'future/public/widgets';
import ProductDetail from '../../product/components/ProductDetail';

export default class PrdListItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			stepNum: this.props.prdData ? this.props.prdData.num : 1,
			isSelected: this.props.prdData ? this.props.prdData.selected : true,
			rowData: this.props.prdData,
		}
	}
	static propTypes = {
		showStock: React.PropTypes.bool,
		localChangeEvent: React.PropTypes.func
	}
	static defaultProps = {
		showStock: false,
		localChangeEvent: () => { }
	}

	openComponent(component, params) {
		if (this.props.navigator && this.props.navigator.push) {
			this.props.navigator.push({
				component: component,
				params: params != undefined ? params : {}
			})
		}
	}

	changeSelectState(state) {
		if (this.state.isSelected != state) {
			this.setState({ isSelected: state });
		}
	}

	componentDidMount() {
	}

	componentWillReceiveProps(nextProps) {
		// this.timer && clearTimeout(this.timer);
		// this.timer = setTimeout(() => {
		// 	nextProps.prdData && this.setState({
		// 		isSelected: this.props.prdData.selected
		// 	});
		// }, 1000)
	}

	componentWillUnmount() {
		// this.timer && clearTimeout(this.timer);
	}

	setPlanNum(num = 1) {
		if (num != this.state.stepNum) {
			this.setState({ stepNum: num });
		}
	}

	callbackData() {
		if (this.state.isSelected == true) {
			let data = this.state.rowData;
			data.selectNum = this.state.stepNum;
			return data;
		} else {
			return null;
		}
	}

	render() {
		var remainStock;
		if (this.props.prdData) {
			if (this.props.prdData.remainStock <= 0) {
				remainStock = '<0';
			}
			if (this.props.prdData.remainStock > 0 && this.props.prdData.remainStock <= 1000) {
				remainStock = '<=1000';
			}
			if (this.props.prdData.remainStock > 1000 && this.props.prdData.remainStock <= 1500) {
				remainStock = '>1000';
			}
			if (this.props.prdData.remainStock > 1500) {
				remainStock = '>1500';
			}
		}

		let totalPrice = this.props.prdData ? this.state.stepNum * this.props.prdData.price : '';
		return (
			<View style={{ width: fullWidth, flex: 1, flexDirection: 'row', backgroundColor: '#fff' }}>
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => {
						this.setState({
							isSelected: !this.state.isSelected
						}, () => {
							this.props.callback && this.props.callback();
						});
					} }>
					<View style={{ width: 50, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						{this.state.isSelected == true ? <Image
							style={{ width: 16, height: 16 }}
							source={require('../res/images/000gouxuan_s.png')}
							resizeMode='contain' /> : <Image
								style={{ width: 16, height: 16 }}
								source={require('../res/images/000weigouxuan.png')}
								resizeMode='contain' />}
					</View>
				</TouchableOpacity>
				{this.props.prdData ? <View style={{ width: fullWidth - 50, flex: 1, backgroundColor: '#fff' }}>
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={() => {
							this.openComponent(ProductDetail, { productId: this.props.prdData.productId })
						} }
						>
						<Text style={{ marginTop: 15, fontSize: 14, color: '#333' }}>{this.props.prdData.productNm}</Text>
						<View style={{ marginTop: 10, width: fullWidth - 60, flex: 1, paddingBottom: 15, borderBottomWidth: 0.5, borderBottomColor: '#EEEEEE' }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
								<Text style={{ color: '#8495A2', fontSize: 12 }}>{this.props.prdData.specPack}</Text>
							</View>
							<Text style={{ color: '#8495A2', fontSize: 12, marginTop: 10 }}>厂家：{this.props.prdData.factory}</Text>
							{this.props.prdData.factory && <Text style={{ color: '#8495A2', fontSize: 12, marginTop: 10 }}>供应商：{this.props.prdData.shopNm}</Text>}
						</View>
						{this.props.showStock && <View style={{ height: 60, width: fullWidth - 65, backgroundColor: '#F8F8F8', flexDirection: 'row', justifyContent: 'space-between' }}>
							<View style={{ marginLeft: 15 }}>
								<Text style={{ marginTop: 10, fontSize: 13, color: '#333' }}>¥{this.props.prdData.price}</Text>
								<Text style={{ marginTop: 10, fontSize: 12, color: '#5C6A74' }}>库存：{remainStock}</Text>
							</View>
							<View style={{ marginTop: 15, marginRight: 15 }}>
								<NumberInput
									value={this.state.stepNum}
									onChange={(value) => { this.setState({ stepNum: value }) } }
									max={this.props.prdData.remainStock} />
							</View>
						</View>}
						<View style={{ width: fullWidth - 60, flex: 1, paddingBottom: 10 }}>
							<Text style={{ alignSelf: 'flex-end', fontSize: 13, marginTop: 10, color: '#333' }}>小计<Text style={{ color: '#FF6600' }}>   ¥{totalPrice.toFixed(2)}</Text></Text>
						</View>
					</TouchableOpacity>
				</View>
					:
					<View style={{ width: fullWidth - 50, flex: 1, backgroundColor: '#fff' }}>
						<TouchableOpacity>
							<Text style={{ marginTop: 15, fontSize: 14, color: '#333' }}>商品名称</Text>
							<View style={{ marginTop: 10, width: fullWidth - 60, flex: 1, paddingBottom: 15, borderBottomWidth: 0.5, borderBottomColor: '#EEEEEE' }}>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
									<Text style={{ color: '#8495A2', fontSize: 12 }}>规格/单位：50mg*30T/盒</Text>
									{/*!this.props.showStock && <Text style={{color:'#B4B9C7',fontSize:13}}>¥78.60</Text>*/}
								</View>
								<Text style={{ color: '#8495A2', fontSize: 12, marginTop: 10 }}>厂家：厂家名称</Text>
							</View>
							{this.props.showStock && <View style={{ height: 60, width: fullWidth - 65, backgroundColor: '#F8F8F8', flexDirection: 'row', justifyContent: 'space-between' }}>
								<View style={{ marginLeft: 15 }}>
									<Text style={{ marginTop: 10, fontSize: 13, color: '#333' }}>¥76.80</Text>
									<Text style={{ marginTop: 10, fontSize: 12, color: '#5C6A74' }}>库存：+{'<0'}</Text>
								</View>
								<View style={{ marginTop: 15, marginRight: 15 }}>
									<NumberInput
										value={this.state.stepNum}
										onChange={(value) => { this.setState({ stepNum: value }) } }
										max={this.props.prdData.remainStock} />
								</View>
							</View>}
							<View style={{ width: fullWidth - 60, flex: 1, paddingBottom: 10 }}>
								<Text style={{ alignSelf: 'flex-end', fontSize: 13, marginTop: 10, color: '#333' }}>共1件<Text style={{ color: '#FF6600' }}>   ¥76.80</Text></Text>
							</View>
						</TouchableOpacity>
					</View>}
			</View>
		)
	}
}