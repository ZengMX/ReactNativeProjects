
'use strict';

import React, { Component } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions
} from 'react-native';

import { BaseView ,ItemPicker} from 'future/src/widgets';
import { DataPicker } from '@imall-test/rnkit-actionsheet-picker';
import Pickers from '@imall-test/react-native-picker';
export default class Picker extends Component {
	//https://github.com/rnkit/rnkit-actionsheet-picker
	//$npm install -S rnkit-actionsheet-picker
	//$react-native link rnkit-actionsheet-picker
	//在项目的node_modules中找到rnkit-actionsheet-picker android-> app -> bind.gradle 拖到android studio中修改 compileSdkVersion 23 
	//buildToolsVersion "23.0.1" 然后再build一下，也可以下载对应的sdk版本。
	constructor(props) {
		super(props);
		this.state = {
			pickerData: ['item1', 'item2', 'item3'],
			selectedValue: 'item2'
		};
	}
	_onPressHandle1() {
		DataPicker.show({
			// dataSource: ["男", "女"],
			// dataSource: [{"北京": ["123123", "ssssss"]}, {"广东省": ["深圳"]}],
			// dataSource: [{"北京": [{"北京x": ["123123", "ssssss"]}, {"北京xasdfasdf": ["123123", "ssssss"]}]},{"广东省": [{"深圳": ["福田区", "宝安区"]}]}],
			dataSource: ["广东11111120ddddddd", '深圳市dddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
				'福田区dddddddddddddddddddddddddddddddddddddddddddddddddddddddddd'],
			onPickerConfirm: (selectedData, selectedIndex) => {
				alert("onPickerConfirm" + selectedData + selectedIndex);
			},
			onPickerCancel: () => {
			},
			onPickerDidSelect: (selectedData, selectedIndex) => {
				//这个方法不用
			}
		})
	}
	_onPressHandle3() {
        this.refs.itemPicker.show();
	}
	render() {
		return (
			<View style={{ flex: 1 }}>
				<BaseView style={{ flex: 1 }}
					navigator={this.props.navigator}>
					<TouchableOpacity style={{ marginTop: 20, alignSelf: 'center' }} onPress={this._onPressHandle1.bind(this)}>
						<Text>点我显示 rnkit-actionsheet-picker</Text>
					</TouchableOpacity>
					

					<TouchableOpacity style={{ marginTop: 50, alignSelf: 'center' }} onPress={this._onPressHandle3.bind(this)}>
						<Text>widgets ItemPicker</Text>
					</TouchableOpacity>
                   
				</BaseView>
                 <ItemPicker 
				 ref="itemPicker"
				 cancelText={'取消'}
				 titleText={'请选择1'}
				 confirmText={'确定'}
				 dataSource={["广东11111120ddddddd", '深圳市dddddddddddddddddddddddddddddddddddddddddddddddddddddddddd','福田区dddddddddddddddddddddddddddddddddddddddddddddddddddddddddd']}
				 onPickerConfirm={(selectedData)=>{
                      alert(selectedData);
				 }}
				 onPickerCancel={()=>{
                      alert("onPickerCancel");
				 }}
				 />
			</View>
		);
	}
};
