/**
 * Created by timhuo on 2017/6/22.
 */
'use strict';
import React, {Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity, TextInput, Keyboard,Switch,NativeModules,LayoutAnimation
} from 'react-native';
import Line from "../../../public/widgets/line/Line";
import NavBar from "../../../public/widgets/nav/NavBar";
import {sizeToFit} from "../../../public/widgets/line/sizeToFix";
import * as Toast from "../../../public/widgets/toast/index";
import {TextInputC} from "../../../public/widgets/index";
import Fetch from "../../../public/lib/Fetch";

class PurchaseTitleEdit extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			length: 0,
			title: props.params.title || '',
			detail: props.params.detail,
			purid:props.params.purid
		};
		this.submitInfo = this.submitInfo.bind(this);
	}
	
	submitInfo() {
		//校验数据的正确性
		if (this.state.title === '') {
			Toast.show('计划名称未填写!');
			return;
		}
		console.log(this.state.purid);
		if(this.state.purid){
			new Fetch({
				url: "app/fastBuy/updatePurchaseTemplate.json",
				method: 'POST',
				data: {
					purchaseTemplateId: this.state.purid,
					templateNm: this.state.title,
					remarks: this.state.detail
				}
			}).dofetch().then((data) => {
				if (data.success) {
					this.props.navigator.pop();
					this.props.params.callback && this.props.params.callback(this.state.title,this.state.detail);
				}
			}).catch((error) => {
				Toast.show(error.object.errorText);
				console.log('catch: ', error);
			});
		}else {
			new Fetch({
				url: "app/fastBuy/createPurchaseTemplate.json",
				method: 'POST',
				bodyType: 'json',
				data: {
					templateNm: this.state.title,
					remarks: this.state.detail
				}
			}).dofetch().then((data) => {
				if (data.success) {
					this.props.navigator.pop();
					this.props.params.callback && this.props.params.callback(this.state.title,this.state.detail);
				}
			}).catch((error) => {
				Toast.show(response.errorObject.errorText)
				console.log('catch: ', error);
			});
		}
		
		
	}
	
	render() {
		return (
			<View style={{flex: 1, backgroundColor: '#f5f5f5',}}>
				<NavBar navigator={this.props.navigator}
				        leftBtnStyle={{width: 10, height: 17, tintColor: '#444'}}
				        title={{title: '编辑计划', style: {fontSize: 18}, tintColor: '#333333'}}
				        mainColor={'#fafafa'}
				/>
				<Line />
				<View style={[styles.textInputStyle, {marginTop: 10, height: 53,}]}>
					<TextInput style={{flex: 1, fontSize: 14,width:sizeToFit(300),height:53}} placeholder='请输入计划名称'
					           value={this.state.title}
					           onChangeText={(text) => {
								   this.setState({title: text})			
					           }}/>
				</View>
				<Line left={13}/>
				<View style={[styles.mutuiliInputStyle, {height: 100}]}>
					<TextInput style={{fontSize: 14,width:sizeToFit(300),height: 100,textAlignVertical:'top'}}
					           multiline={true}
					           placeholder='还没有任何计划描述'
					           underlineColorAndroid='transparent'
					           value={this.state.detail}
					           onChangeText={(text) => {
						           this.setState({length: text.length,detail:text});
					           }}
					           maxLength={20}/>
					<Text style={{
						position: "absolute",
						fontSize: 10,
						right: 13,
						bottom: 10,
						backgroundColor: "transparent",
						color: "#AAAEB9"
					}}>{this.state.length}/20</Text>
				</View>
				
				<TouchableOpacity underlayColor='#eee' style={{
					margin: 15,
					marginTop: 25,
					width: (sizeToFit(320) - 30),
					backgroundColor: "#34457D",
					height: sizeToFit(45),
					justifyContent: 'center',
					alignItems: 'center'
				}}
				                  onPress={() => {
					                  Keyboard.dismiss();
					                  this.submitInfo()
				                  }}>
					<Text style={{color: "#fff", fontSize: 15}}>保存</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

class PurchaseMessageEdit extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			length: 0,
			message: props.params.message,
		};
		this.submitInfo = this.submitInfo.bind(this);
	}
	
	submitInfo() {
		//校验数据的正确性
		if (this.state.message === null||this.state.message.length===0) {
			Toast.show('计划名称未填写!');
			return;
		}
		this.props.navigator.pop();
		this.props.params.callback && this.props.params.callback(this.state.message);
	}
	
	render() {
		return (
			<View style={{flex: 1, backgroundColor: '#f5f5f5',}}>
				<NavBar navigator={this.props.navigator}
				        leftBtnStyle={{width: 10, height: 17, tintColor: '#444'}}
				        title={{title: '提醒内容', style: {fontSize: 18}, tintColor: '#333333'}}
				        mainColor={'#fafafa'}
				/>
				<Line />
				<View style={[styles.mutuiliInputStyle, {height: 125,paddingBottom: 23,}]}>
					<TextInput style={{fontSize: 14, textAlignVertical:'top',width:sizeToFit(300),height:125}}
					           multiline={true}
					           placeholder='请输入提醒的内容'
					           value={this.state.message}
					           onChangeText={(text) => {
						           this.setState({length: text.length,message:text});
					           }}
					           maxLength={200}/>
					<Text style={{
						position: "absolute",
						fontSize: 10,
						right: 13,
						bottom: 10,
						backgroundColor: "transparent",
						color: "#AAAEB9"
					}}>{this.state.length}/200</Text>
				</View>
				
				<TouchableOpacity underlayColor='#eee' style={{
					margin: 15,
					marginTop: 25,
					width: (sizeToFit(320) - 30),
					backgroundColor: "#34457D",
					height: sizeToFit(45),
					justifyContent: 'center',
					alignItems: 'center'
				}}
				                  onPress={() => {
					                  Keyboard.dismiss();
					                  this.submitInfo()
				                  }}>
					<Text style={{color: "#fff", fontSize: 15}}>保存</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const {UIManager} = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

class PurchaseRemindMessageEdit extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			remindDay:props.params.remindDay,
			remindState:props.params.remindDay > 0,
		};
		this.submitInfo = this.submitInfo.bind(this);
		this.remindStateChange = this.remindStateChange.bind(this);
	}
	
	remindStateChange(state) {
		LayoutAnimation.spring();
		this.setState({remindState: state})
	}
	
	submitInfo() {
		
		this.props.navigator.pop();
		if(this.state.remindState===false){
			this.props.params.callback && this.props.params.callback(0);
		}else {
			this.props.params.callback && this.props.params.callback(parseInt(this.state.remindDay));
		}
	}
	
	render() {
		
		let remindView = (
			<View style={styles.row}>
				<Text style={{ fontSize: 13 }}>每隔</Text>
				<View style={{ marginLeft: 12, borderRadius: 5, borderColor: '#C5CEDB', borderWidth: 1 }}>
					<TextInputC
						value={this.state.remindDay}
						autoFocus = {true}
						clearButtonMode='while-editing'
						keyboardType='number-pad'
						underlineColorAndroid='transparent'
						maxLength={3}
						defaultValue={this.state.remindDay.toString()}
						onChangeText={(txt) => { this.setState({ remindDay: txt }) } }
						style={{ width: 85, height: 35, marginLeft: 10 }} />
				</View>
				
				<Text style={{ marginLeft: 12, fontSize: 13 }}>天重复提醒我</Text>
			</View>
		);
		
		return (
			<View style={{flex: 1, backgroundColor: '#f5f5f5',}}>
				<NavBar navigator={this.props.navigator}
				        leftBtnStyle={{width: 10, height: 17, tintColor: '#444'}}
				        title={{title: '重复提醒', style: {fontSize: 18}, tintColor: '#333333'}}
				        mainColor={'#fafafa'}
				/>
				<Line />
				<View style={styles.row}>
					<Text style={styles.titleStyle}>重复提醒</Text>
					<Switch
						style={{alignSelf: 'center'}}
						onValueChange={(value) => this.remindStateChange(value)}
						value={this.state.remindState}
						onTintColor="#0082FF"
						thumbTintColor="#fff"
						tintColor="#0082FF"
					/>
				</View>
				{this.state.remindState?(<Line left={13}/>):null}
				{this.state.remindState?remindView:null}
				
				<TouchableOpacity underlayColor='#eee' style={{
					margin: 15,
					marginTop: 25,
					width: (sizeToFit(320) - 30),
					backgroundColor: "#34457D",
					height: sizeToFit(45),
					justifyContent: 'center',
					alignItems: 'center'
				}}
				                  onPress={() => {
					                  Keyboard.dismiss();
					                  this.submitInfo()
				                  }}>
					<Text style={{color: "#fff", fontSize: 15}}>保存</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	row: {
		backgroundColor: "#fff",
		height: 53,
		width: sizeToFit(320),
		paddingLeft: 13,
		paddingRight: 13,
		alignItems: "center",
		flexDirection: 'row',
	},
	titleStyle: {
		flex: 1,
		color: "#333"
	},
	textInputStyle: {
		padding: 13,
		backgroundColor: "#fff",
		width: sizeToFit(320),
		justifyContent: 'center',
		alignItems: 'center'
	},
	mutuiliInputStyle: {
		padding: 13,
		backgroundColor: "#fff",
		width: sizeToFit(320),
		alignItems: 'flex-start'
	}
});

exports.PurchaseTitleEdit = PurchaseTitleEdit;
exports.PurchaseMessageEdit = PurchaseMessageEdit;
exports.PurchaseRemindMessageEdit = PurchaseRemindMessageEdit;