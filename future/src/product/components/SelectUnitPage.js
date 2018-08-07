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
} from 'future/public/widgets';

import {
	Fetch,
	imageUtil,
} from 'future/public/lib';
export default class SelectUnitPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: this.props.params.type,
			data: this.props.params.data || [],
			selectedData: this.props.params.selectedData || [],
		}
	}
	componentWillMount() {
	}
	componentDidMount() {
	}
	componentWillUnmount() {
	}

	searchSelectedData(data) {
		let copySelectedData = this.state.selectedData.slice(0), tempIndex = -1;
		this.state.selectedData.forEach((item, index) => {
			if (item.value == data.value) {
				tempIndex = index;
			}
		});
		if (tempIndex == -1) {
			copySelectedData.push(data);
		} else {
			copySelectedData.splice(tempIndex, 1)
		}
		return copySelectedData;
	}

	isInSelectedData(data) {
		let result = false;
		this.state.selectedData.forEach((item, index) => {
			if (data.value == item.value) {
				result = true;
			}
		})
		return result;
	}

	selectedDataStr() {
		let str = [];
		this.state.selectedData.forEach((item, index) => {
			str.push(item.name);
		})
		return str.join(',');
	}

	onClickReset() {
		this.setState({ selectedData: [] });
	}

	onClickUnit(item) {
		let newSelectedData = this.searchSelectedData(item);
		this.setState({ selectedData: newSelectedData });
	}

	onClickConfirm() {
		this.props.params.callback && this.props.params.callback(this.state.selectedData);
		this.props.navigator && this.props.navigator.pop && this.props.navigator.pop();
	}

	_renderHeader() {
		return (
			<View style={{ width: 160, alignItems: 'center' }}>
				<Text style={{ fontSize: 11, color: '#8E929E', marginBottom: 4 }}>{this.state.type == 'form_t' ? '选择剂型' : '选择单位'}</Text>
				<Text numberOfLines={1} style={{ fontSize: 14, color: '#333333' }}>{this.selectedDataStr()}</Text>
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
				<View style={{ backgroundColor: '#F4F3F4', flex: 1 }}>
					<View style={{ paddingTop: 20, paddingBottom: 10, paddingLeft: 15 }}>
						<Text style={{ color: '#333333', fontSize: 14, fontWeight: '500' }}>{this.state.type == 'form_t' ? '选择剂型' : '选择单位'}</Text>
					</View>
					<ScrollView
						style={{ width: global.SCREENWIDTH }}
						contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10 }}
						>
						{
							this.state.data.map((item, index) => {
								if (this.isInSelectedData(item)) {
									return (
										<TouchableOpacity
											key={'unit' + index}
											style={{
												width: (global.SCREENWIDTH - 50) / 3, height: 30, backgroundColor: '#fff', margin: 5,
												justifyContent: 'center', alignItems: 'center', borderRadius: 4,
												borderColor: '#0082FF', borderWidth: StyleSheet.hairlineWidth,
											}}
											onPress={() => {
												this.onClickUnit(item)
											} }
											>
											<Text style={{ fontSize: 12, color: '#0082FF' }}>{item.name}</Text>
										</TouchableOpacity>
									)

								} else {
									return (
										<TouchableOpacity
											key={'unit' + index}
											style={{
												width: (global.SCREENWIDTH - 50) / 3, height: 30, backgroundColor: '#fff', margin: 5,
												justifyContent: 'center', alignItems: 'center', borderRadius: 4,
												borderColor: '#8E939A', borderWidth: StyleSheet.hairlineWidth,
											}}
											onPress={() => {
												this.onClickUnit(item)
											} }
											>
											<Text style={{ fontSize: 12, color: '#444444' }}>{item.name}</Text>
										</TouchableOpacity>
									)
								}

							})
						}

						{
							// <TouchableOpacity style={{
							// 	width: (global.SCREENWIDTH - 50) / 3, height: 30, backgroundColor: '#fff', margin: 5,
							// 	justifyContent: 'center', alignItems: 'center', borderRadius: 4,
							// 	borderColor: '#0082FF', borderWidth: StyleSheet.hairlineWidth,
							// }}
							// 	onPress={() => {

							// 	} }
							// 	>
							// 	<Text style={{ fontSize: 12, color: '#0082FF' }}>片</Text>
							// </TouchableOpacity>
							// <TouchableOpacity style={{
							// 	width: (global.SCREENWIDTH - 50) / 3, height: 30, backgroundColor: '#fff', margin: 5,
							// 	justifyContent: 'center', alignItems: 'center', borderRadius: 4,
							// 	borderColor: '#0082FF', borderWidth: StyleSheet.hairlineWidth,
							// }}
							// 	onPress={() => {

							// 	} }
							// 	>
							// 	<Text style={{ fontSize: 12, color: '#0082FF' }}>片</Text>
							// </TouchableOpacity>
						}
					</ScrollView>
					<View style={{ height: 65, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
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
				</View>
			</BaseView>
		)
	}
}
const styles = StyleSheet.create({
})
