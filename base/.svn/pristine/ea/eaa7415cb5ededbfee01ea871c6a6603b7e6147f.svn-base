/**
 * Created by timhuo on 2017/2/4.
 * 功能正常 2017/2/27
 */
import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	processColor,
} from 'react-native';
import { BaseView } from 'future/src/widgets';
import Chrosslocation from '@imall-test/react-native-chrosslocation';

export default class AddPickerPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			addressStr: "宁夏 石嘴山市 平罗县",
			addressCode: "34519"
		};
	}

	_location() {
		//设置请求的 host
		Chrosslocation.sethost("http://eyb2b.imall.com.cn/");
		Chrosslocation.show({
			areaCode: this.state.addressCode, //参数一为，打开即选中地区，用于第二次打开时打开选中地区
			color: '#0f0cd6', //参数二 为选中颜色
			block: (areaCode, addressString) => { //参数三 回调函数   areaCode为返回地区 ID code，addressString为 全部地址名称
				console.log(areaCode + '-----' + addressString);
				if (addressString != "") {
					this.setState({ addressStr: addressString, addressCode: areaCode })
				}
			}
		});
	}

	render() {
		return (
			<BaseView navigator={this.props.navigator} ref={base => this.base = base}>
				<View style={{ flexDirection: 'row', marginBottom: 20 }}>
					<Text>地址：</Text>
					<Text>{this.state.addressStr}</Text>
				</View>
				<TouchableOpacity style={{ padding: 20, backgroundColor: 'yellow' }} onPress={this._location.bind(this)}>
					<Text>地址选择</Text>
				</TouchableOpacity>
			</BaseView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	}
});