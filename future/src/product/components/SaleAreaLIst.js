import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	StyleSheet,
	InteractionManager,
	TouchableHighlight,
	TouchableOpacity,
	ListView,
	Animated,
	Easing,
	ScrollView
} from 'react-native';

import {
	RefreshableListView,
	BaseView,
	Toast,
	DataController
} from 'future/public/widgets';

import {
	Fetch,
	imageUtil,
} from 'future/public/lib';

export default class SaleAreaList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			provinceData: null,
			cityData: null,
			selectedProvinceObj: this.props.params.province || null,
			selectedCityObj: this.props.params.city || null,
			provinceName: this.props.params.province && this.props.params.province.sysTreeNodeNm || '',
			cityName: this.props.params.city && this.props.params.city.sysTreeNodeNm || '',
		}
	}
	componentWillMount() {
		InteractionManager.runAfterInteractions(() => {
			this.getArea();
		})
	}
	componentDidMount() {
	}
	componentWillUnmount() {
	}

	getArea(sysTreeNodeId = 9) {
		new Fetch({
			url: '/app/product/getAreaNode.json',
			data: {
				sysTreeNodeId: sysTreeNodeId,
			}
		}).dofetch().then((data) => {
			if (sysTreeNodeId == 9) {
				if (this.state.selectedProvinceObj) {
					this.getArea(this.state.selectedProvinceObj.sysTreeNodeId);
				} else {
					this.setState({ selectedProvinceObj: data.result[0], provinceName: data.result[0].sysTreeNodeNm });
					this.getArea(data.result[0].sysTreeNodeId);
				}
				this.setState({ provinceData: data.result });
			} else {
				this.setState({ cityData: data.result });
			}
		}).catch((error) => {
			console.log('error', error);
		})
	}

	onClickReset() {
		this.setState({
			provinceName: '',
			cityName: '',
			selectedCityObj: null
		});
	}

	onClickCity(cityObj) {
		this.setState({
			provinceName: this.state.selectedProvinceObj.sysTreeNodeNm,
			selectedCityObj: cityObj,
			cityName: cityObj.sysTreeNodeNm
		});
	}

	onClickProvince(provinceObj) {
		this.getArea(provinceObj.sysTreeNodeId);
		this.setState({
			selectedProvinceObj: provinceObj,
			provinceName: provinceObj.sysTreeNodeNm,
			selectedCityObj: null,
			cityName: ''
		});
	}

	onClickConfirm() {
		// if (this.state.selectedProvinceObj == null) { return Toast.show('请先选择省份') };
		// if (this.state.selectedCityObj == null) { return Toast.show('请先选择城市') };
		this.props.params.callback && this.props.params.callback(
			this.state.provinceName != '' ? this.state.selectedProvinceObj : null,
			this.state.cityName != '' ? this.state.selectedCityObj : null
		);
		this.props.navigator && this.props.navigator.pop && this.props.navigator.pop();
	}

	renderCity() {
		if (this.state.cityData == null) { return; }
		let list = null;
		list = this.state.cityData.map((item, index) => {
			if (this.state.selectedCityObj && this.state.selectedCityObj.sysTreeNodeId == item.sysTreeNodeId) {
				return (
					<TouchableOpacity
						key={'city' + index}
						style={{ height: 45, flexDirection: 'row', alignItems: 'center', paddingLeft: 20, paddingRight: 30 }}
						onPress={() => {
							this.onClickCity(item);
						} }
						>
						<Text style={{ flex: 1, fontSize: 14, color: '#0C1828' }}>{item.sysTreeNodeNm}</Text>
						<Image style={{ width: 15, height: 10 }} source={require('../res/images/ProductList/000gouxuan.png')} />
					</TouchableOpacity>
				)
			} else {
				return (
					<TouchableOpacity
						key={'city' + index}
						style={{ height: 45, flexDirection: 'row', alignItems: 'center', paddingLeft: 20, paddingRight: 30 }}
						onPress={() => {
							this.onClickCity(item);
						} }
						>
						<Text style={{ flex: 1, fontSize: 14, color: '#0C1828' }}>{item.sysTreeNodeNm}</Text>
						<View style={{ width: 15, height: 10 }}></View>
					</TouchableOpacity>
				)
			}
		})
		return list;
	}

	renderProvince() {
		if (this.state.provinceData == null) { return; }
		let list = null;
		list = this.state.provinceData.map((item, index) => {
			if (this.state.selectedProvinceObj && this.state.selectedProvinceObj.sysTreeNodeId == item.sysTreeNodeId) {
				return (
					<TouchableOpacity
						key={'province' + index}
						style={{
							width: 110, height: 50, backgroundColor: '#fff',
							flexDirection: 'row', alignItems: 'center'
						}}
						onPress={() => {
							this.onClickProvince(item);
						} }
						>
						<View style={{ width: 5, height: 25, backgroundColor: '#0082FF', marginRight: 8 }}></View>
						<Text numberOfLines={1} style={{ fontSize: 16, color: '#596875', fontWeight: '400' }}>{item.sysTreeNodeNm}</Text>
					</TouchableOpacity>
				)

			} else {
				return (
					<TouchableOpacity
						key={'province' + index}
						style={{
							width: 110, height: 50, backgroundColor: '#EDF1F7',
							flexDirection: 'row', alignItems: 'center'
						}}
						onPress={() => {
							this.onClickProvince(item);
						} }
						>
						<View style={{ width: 5, height: 25, backgroundColor: 'transparent', marginRight: 8 }}></View>
						<Text numberOfLines={1} style={{ fontSize: 14, color: '#596875' }}>{item.sysTreeNodeNm}</Text>
					</TouchableOpacity>
				)
			}

		})
		return list;
	}

	_renderHeader() {
		return (
			<View style={{ width: 160, alignItems: 'center' }}>
				<Text style={{ fontSize: 11, color: '#8E929E', marginBottom: 4 }}>销售地区</Text>
				<Text style={{ fontSize: 14, color: '#333333' }}>{this.state.provinceName}{this.state.cityName != '' ? ',' : ''}{this.state.cityName}</Text>
			</View>
		)
	}

	_renderRightButton() {
		return (
			<TouchableOpacity
				style={{ paddingRight: 13, justifyContent: 'center' }}
				onPress={() => {
					this.onClickReset();
				} }
				>
				<Text style={{ color: '#444444', fontSize: 16 }}>重置</Text>
			</TouchableOpacity>
		)
	}

	_renderLeftButton() {
		return (
			<TouchableOpacity
				style={{ paddingLeft: 13, justifyContent: 'center' }}
				onPress={() => {
					this.props.navigator && this.props.navigator.pop && this.props.navigator.pop();
				} }
				>
				<Text style={{ color: '#444444', fontSize: 16 }}>关闭</Text>
			</TouchableOpacity>
		)
	}

	render() {
		return (
			<BaseView
				mainColor={'#fafafa'}
				navigator={this.props.navigator}
				head={this._renderHeader()}
				rightButton={this._renderRightButton()}
				leftButton={this._renderLeftButton()}
				statusBarStyle={'default'}
				>
				<DataController
					data={this.state.cityData}
					>
					<View style={{ flex: 1, backgroundColor: '#fff', flexDirection: 'row' }}>
						<ScrollView
							style={{ width: 110, }}
							showsVerticalScrollIndicator={false}
							>
							{
								this.renderProvince()
							}
						</ScrollView>
						<ScrollView
							style={{ width: global.SCREENWIDTH - 110, }}
							showsVerticalScrollIndicator={false}
							>

							{
								this.renderCity()
							}



						</ScrollView>
					</View>
				</DataController>

				<View style={{
					height: 65, justifyContent: 'center', alignItems: 'center',
					backgroundColor: '#fff', borderTopWidth: StyleSheet.hairlineWidth,
					borderTopColor: '#E5E5E5'
				}}>
					<TouchableOpacity
						activeOpacity={0.7}
						style={{ width: 290, height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: '#34457D', borderRadius: 4 }}
						onPress={() => {
							this.onClickConfirm();
						} }
						>
						<Text style={{ color: '#fff', fontSize: 16 }}>确认</Text>
					</TouchableOpacity>
				</View>
			</BaseView>
		)
	}
}
const styles = StyleSheet.create({
})
