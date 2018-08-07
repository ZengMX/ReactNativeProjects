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
	TextInputC
} from 'future/public/widgets';

import {
	Fetch,
	imageUtil,
} from 'future/public/lib';
export default class ManufacturerList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchWord: '',
			data: this.props.params.data,
			selectedData: this.props.params.manufacture_factory_t || null,
		}
	}
	componentWillMount() {
	}
	componentDidMount() {
	}
	componentWillUnmount() {
	}

	onClickFactory(data) {
		this.setState({ selectedData: data });
	}

	onClickReset() {
		this.setState({ selectedData: null });
	}

	onClickSearch() {
		this.onClickReset();
		if (this.state.searchWord.trim() == '') {
			this.setState({ data: this.props.params.data });
		} else {
			this.setState({ data: this.filterData() });
		}
	}

	onClickConfirm() {
		// if (this.state.selectedData == null) { return Toast.show('请先选择生产厂家') }
		this.props.params.callback && this.props.params.callback(this.state.selectedData);
		this.props.navigator && this.props.navigator.pop && this.props.navigator.pop();
	}

	filterData() {
		let newData = [];
		this.state.data.forEach((item, index) => {
			if (item.name.indexOf(this.state.searchWord.trim()) != -1) {
				newData.push(item)
			}
		})
		return newData;
	}

	_renderHeader() {
		return (
			<View style={{ width: 160, alignItems: 'center' }}>
				<Text style={{ fontSize: 18, color: '#333333' }}>生产厂家</Text>
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

				<View style={{ flex: 1, backgroundColor: '#f4f3f4' }}>
					<View style={{ height: 45, justifyContent: 'center' }}>
						<View style={{
							backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center',
							borderRadius: 4, height: 30, marginHorizontal: 12
						}}>
							<TouchableOpacity
								onPress={() => {

								} }
								>
								<Image style={{ width: 16, height: 16, marginHorizontal: 10, }} source={require('../../home/res/search/a002sousuo.png')} />
							</TouchableOpacity>
							<TextInputC
								onSubmitEditing={() => {
									this.onClickSearch();
								} }
								onChangeText={(text) => {
									this.setState({
										searchWord: text
									});
								} }
								returnKeyType={'search'}
								numberOfLines={1}
								value={this.state.searchWord}
								clearButtonMode={'while-editing'}
								placeholder='搜索厂家名称'
								placeholderTextColor='#BBBBBB'
								style={{ color: '#333333', fontSize: 13, flex: 1 }}
								/>
						</View>
					</View>
					<View style={{ paddingTop: 15, paddingBottom: 10, paddingLeft: 15 }}>
						<Text style={{ color: '#333333', fontSize: 14, fontWeight: '500' }}>选择厂家</Text>
					</View>
					<ScrollView
						style={{ backgroundColor: '#fff' }}
						>
						{
							this.state.data.map((item, index) => {
								if (this.state.selectedData && this.state.selectedData.value == item.value) {
									return (
										<TouchableOpacity
											activeOpacity={0.7}
											key={'factory' + index}
											style={{ height: 50, paddingHorizontal: 13, alignItems: 'center', flexDirection: 'row' }}
											onPress={() => {
												this.onClickFactory(item);
											} }
											>
											<Text numberOfLines={1} style={{ flex: 1, fontSize: 15, color: '#333333' }}>{item.name}</Text>
											<Image style={{ width: 15, height: 10, marginLeft: 5 }} source={require('../res/images/ProductList/000gouxuan.png')} />
										</TouchableOpacity>
									)
								} else {
									return (
										<TouchableOpacity
											activeOpacity={0.7}
											key={'factory' + index}
											style={{ height: 50, paddingHorizontal: 13, alignItems: 'center', flexDirection: 'row' }}
											onPress={() => {
												this.onClickFactory(item);
											} }
											>
											<Text numberOfLines={1} style={{ flex: 1, fontSize: 15, color: '#333333' }}>{item.name}</Text>
											<View style={{ width: 15, height: 10, marginLeft: 5 }}></View>
										</TouchableOpacity>
									)

								}
							})
						}
					</ScrollView>
				</View>

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
