import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	TouchableOpacity,
	StyleSheet,
	Platform,
	TextInput
} from 'react-native';
import DeviceEventEmitter from 'RCTDeviceEventEmitter';
import { RefreshableListView, BaseView } from '../../widgets';
import Switch from './MXSwitch';

let CALLBACK = {};
import { TextInputC, Toast } from '../../widgets';
let SCREENWIDTH = require('Dimensions').get('window').width;
let SCREENHEIGHT = require('Dimensions').get('window').height;
export default class SetAlertParams extends Component {
	constructor(props) {
		super(props);

		this.state = {
			checked: props.params.isEnableRepeatNotice == 'Y',
			value: props.params.isEnableRepeatNotice == 'Y',
			phone: '',
			day: 0,
			content: ''
		}
	}
	_onValueChange(e) {
		Platform.OS == 'ios' && this.setState({ value: e });

		Platform.OS == 'android' && this.setState({
			checked: !this.state.checked
		})
	}
	_save() {
		CALLBACK.type = this.props.params.type;
		if (this.props.params.type == 'phone') {
			if (this.state.checked || this.state.value) {
				let phone = this.state.phone.replace(/\s/g, '');
				if (phone.length != 11) {
					Toast.show("请输入正确的联系电话！");
					return;
				} else {
					CALLBACK.isMobileNotice = 'Y';
					CALLBACK.receiveMobile = this.state.phone;
				}
			} else {
				CALLBACK.isMobileNotice = 'N';
				CALLBACK.receiveMobile = '';
			}
		}
		if (this.props.params.type == 'realert') {
			if (this.state.checked || this.state.value) {
				CALLBACK.isEnableRepeatNotice = 'Y';
				CALLBACK.noticePeriod = this.state.day;
			} else {
				CALLBACK.isEnableRepeatNotice = 'N';
				CALLBACK.noticePeriod = '';
			}
		}
		if (this.props.params.type == 'content') {
			CALLBACK.noticeContent = this.state.content;
		}
		DeviceEventEmitter.emit('Remind', CALLBACK);
		this.props.navigator.pop();
	}
	render() {
		let open
		if (this.props.params.isEnableRepeatNotice == 'Y') {
			open = true
		} else {
			open = false
		}
		if (Platform.OS == 'ios' && this.state.value) {
			open = true;
		}
		if (Platform.OS == 'android' && this.state.checked) {
			open = true;
		}
		return (

			<BaseView
				title={{ title: this.props.params.title, fontSize: 16, tintColor: '#fff' }}
				navigator={this.props.navigator}>
				{this.props.params.type == 'realert' && <View style={{ width: SCREENWIDTH, height: 105, marginTop: 10 }}>
					<View style={{ flexDirection: 'row', height: 45, width: SCREENWIDTH, backgroundColor: '#fff', justifyContent: 'space-between', alignItems: 'center' }}>
						<Text style={{ marginLeft: 12, fontSize: 14 }}>重复提醒</Text>
						<Switch
							checked={this.state.checked}
							value={this.state.value}
							onCheckedChange={(e) => { this._onValueChange(e) } }
							onValueChange={(value) => { this._onValueChange(value) } } />
					</View>
					<View style={{ left: open ? 0 : -SCREENWIDTH, flexDirection: 'row', height: 60, width: SCREENWIDTH, backgroundColor: '#fff', alignItems: 'center' }}>
						<Text style={{ marginLeft: 12, fontSize: 13 }}>每隔</Text>
						<View style={{ marginLeft: 12, borderRadius: 5, borderColor: '#C5CEDB', borderWidth: 1 }}>
							<TextInputC
								value={this.state.day}
								autoFocus = {true}
								clearButtonMode='while-editing'
								keyboardType='number-pad'
								underlineColorAndroid='transparent'
								maxLength={3}
								underlineColorAndroid='transparent'
								defaultValue={this.props.params.noticePeriod.toString()}
								onChangeText={(txt) => { this.setState({ day: txt }) } }
								style={{ width: 85, height: 35, marginLeft: 10 }} />
						</View>

						<Text style={{ marginLeft: 12, fontSize: 13 }}>天重复提醒我</Text>
					</View>
				</View>}
				{this.props.params.type == 'content' && <View style={{ width: SCREENWIDTH, height: 95, backgroundColor: '#fff', marginTop: 10 }}>
					<TextInputC
						value={this.state.content}
						clearButtonMode='while-editing'
						underlineColorAndroid='transparent'
						maxLength={255}
						onChangeText={(txt) => { this.setState({ content: txt }) } }
						multiline={true} placeholder='还没有任何内容...'
						defaultValue={this.props.params.noticeContent}
						style={{ fontSize: 14, width: SCREENWIDTH - 24, height: 105, marginLeft: 12, marginTop: 5, textAlignVertical: 'top' }} />
				</View>}
				{this.props.params.type == 'phone' && <View style={{ width: SCREENWIDTH, height: 90, marginTop: 10 }}>
					<View style={{ flexDirection: 'row', height: 45, width: SCREENWIDTH, backgroundColor: '#fff', justifyContent: 'space-between', alignItems: 'center' }}>
						<Text style={{ marginLeft: 12, fontSize: 14 }}>短信提醒</Text>
						<Switch
							checked={this.state.checked}
							value={this.state.value}
							onCheckedChange={(e) => { this._onValueChange(e) } }
							onValueChange={(value) => { this._onValueChange(value) } } />
					</View>
					<View style={{ left: open ? 0 : -SCREENWIDTH, height: 45, width: SCREENWIDTH, backgroundColor: '#fff', justifyContent: 'center' }}>
						<TextInputC
							value={this.state.phone}
							clearButtonMode='while-editing'
							keyboardType='number-pad'
							underlineColorAndroid='transparent'
							maxLength={11}
							defaultValue={this.props.params.receiveMobile}
							onChangeText={(txt) => { this.setState({ phone: txt }) } }
							style={{ fontSize: 14, marginLeft: 12, width: SCREENWIDTH - 24, height: 45 }} placeholder='请输入手机号码' />
					</View>
				</View>}
				<View style={{ justifyContent: 'center', alignItems: 'center', height: 70 }}>
					<TouchableOpacity
						onPress={this._save.bind(this)}
						style={{ width: 296, height: 40, backgroundColor: '#3491df', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
						<Text style={{ color: '#fff', fontSize: 13 }}>保存</Text>
					</TouchableOpacity>
				</View>
			</BaseView>
		)
	}
}
const styles = StyleSheet.create({
})
