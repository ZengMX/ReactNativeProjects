/**
 * Created by timhuo on 2017/6/22.
 */
'use strict';
import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Switch,
	TouchableOpacity,
	ScrollView,
	Image,
	NativeModules,
	LayoutAnimation,
	InteractionManager
} from 'react-native';
import { NavBar, Alerts, Toast } from "../../../public/widgets";
import Line from "../../../public/widgets/line/Line";
import { sizeToFit } from "../../../public/widgets/line/sizeToFix";
import { PurchaseTitleEdit, PurchaseMessageEdit, PurchaseRemindMessageEdit } from "./PurchaseEdit";
import * as Clock from "@imall-test/react-native-clock/index";
import {
	ValidateUtil,
	Fetch
} from 'future/public/lib';
import { BaseView } from "../../../public/widgets/index";
import jpush from '@imall-test/react-native-jpush'

const moment = require('moment');
const leftArrow = require('../res/000xiangyousanjiao.png');

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
	UIManager.setLayoutAnimationEnabledExperimental(true);

export default class PurchaseAdding extends Component {

	constructor(props) {
		super(props);
		this.state = {
			remindState: true,
			remindData: new Date(),
			remindDay: 0,
			pushState: true,
			messageState: false,
			title: '',
			detail: '',
			message: '',
			isPushNotice:'',
			phone: '',
		};
		this.goToComponent = this.goToComponent.bind(this);
		this.remindStateChange = this.remindStateChange.bind(this);
		// this.saveBtnPress = this.saveBtnPress.bind(this);
		this.deleBtnPress = this.deleBtnPress.bind(this);
	}


	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.refs.baseview.showLoading();
			new Fetch({
				url: "app/fastBuy/getPurchaseTemplateDetail.json",
				data: { purchaseTemplateId: this.props.params.purid }
			}).dofetch().then((data) => {
				let result = data.result;
				this.refs.baseview.hideLoading();
				InteractionManager.runAfterInteractions(() => {
					this.setState({
						remindState: ValidateUtil.isTrue(result.isEnableNotice),
						remindData: new Date(result.noticeDate),
						remindDay: parseInt(result.noticePeriod),
						pushState: true,
						messageState: ValidateUtil.isTrue(result.isMobileNotice),
						title: result.templateNm,
						isPushNotice:result.isPushNotice,
						detail: result.remarks,
						message: ValidateUtil.isEmptyStr(result.noticeContent),
						phone: ValidateUtil.isEmptyStr(result.receiveMobile),
					})
				});
			}).catch((error) => {
				this.refs.baseview.hideLoading();
				Toast.show('网络异常');
				console.log('catch: ', error);
			});
		})
	}

	saveBtnPress() {
		
		if (this.state.remindState) {
			let fireDate = (this.state.remindData - new Date()) / 1000;
			if (fireDate < 0) {
				Toast.show("提醒日期必须在当前日期之后，请检查！");
				return;
			}
			this.refs.baseview.showLoading();
			new Fetch({
				url: "app/fastBuy/addPurchaseTemplateRemind.json",
				method: 'POST',
				bodyType: 'json',
				data: {
					isPushNotice:this.state.isPushNotice,
					purchaseTemplateId: this.props.params.purid,
					isEnableNotice: this.state.remindState ? 'Y' : 'N',
					isMobileNotice: this.state.messageState ? 'Y' : 'N',
					isEmailNotice: 'N',
					isEnableRepeatNotice: this.state.remindDay > 0 ? 'Y' : 'N',
					receiveMobile: this.state.phone,
					noticeDateString: moment(this.state.remindData).format('Y-MM-D HH:mm:ss'),
					noticeContent: this.state.message,
					noticePeriod: this.state.remindDay > 0 ? this.state.remindDay : '0',
				}
			}).dofetch().then((data) => {
				this.refs.baseview.hideLoading();
				if (data.success) {
					this.props.navigator.pop();
					Toast.show('保存成功');
					this.props.params.reloadCallBack && this.props.params.reloadCallBack(this.props.params.purid);
				}
			}).catch((error) => {
				this.refs.baseview.hideLoading();
				Toast.show('网络异常');
				console.log('catch: ', error);
			});
		} else {
			this.refs.baseview.showLoading();
			new Fetch({
				url: "app/fastBuy/cancelPurchaseTemplateRemind.json",
				data: { purchaseTemplateId: this.props.params.purid }
			}).dofetch().then((data) => {
				this.refs.baseview.hideLoading();
				if (data.success) {
					this.props.navigator.pop();
					Toast.show('保存成功');
					this.props.params.delCallBack && this.props.params.delCallBack(this.props.params.purid);
				}
			}).catch((error) => {
				this.refs.baseview.hideLoading();
				Toast.show('网络异常');
				console.log('catch: ', error);
			});
		}
	}

	deleBtnPress() {
		this.refs.baseview.showLoading();
		new Fetch({
			url: "app/fastBuy/delPurchaseTemplate.json",
			method: 'POST',
			data: {
				purchaseTemplateId: this.props.params.purid,
			}
		}).dofetch().then((data) => {
			this.refs.baseview.hideLoading();
			if (data.success) {
				this.props.navigator.pop();
				this.props.params.delCallBack && this.props.params.delCallBack(this.props.params.purid);
				Toast.show('删除成功');
			}
		}).catch((error) => {
			this.refs.baseview.hideLoading();
			Toast.show('网络异常');
			console.log('catch: ', error);
		});
	}

	goToComponent(component) {
		this.props.navigator.push({
			component: component,
		})
	}

	remindStateChange(state) {
		LayoutAnimation.spring();
		this.setState({ remindState: state })
	}

	render() {
		let message = this.state.message;
		if (message.length > 10) {
			message = message.substr(0, 10) + '...';
		}
		let timestamp = new Date();
		let remindEditView = (<View>
			<TouchableOpacity underlayColor='#eee' onPress={() => {
				//设置日历和时间  （参数参考上面）
				Clock.setCalendarAndClock({
					minDate: timestamp,
					defaultDate: (this.state.remindData),
					color: "#0082FF",
					titleDic: { confirm_btn: "完成", cancle_btn: "移除" },
					block: (date) => {
						this.setState({ remindData: date });
						console.log(date.getTime());
						console.log(moment(date).format('Y-MM-D HH:mm:ss'));
					}
				});
			}}>
				<View style={[styles.row, { marginTop: 10 }]}>
					<Text style={styles.titleStyle}>提醒日期/时间</Text>
					<Text style={styles.detailStyle}>{moment(this.state.remindData).format('Y-MM-DD HH:mm')}</Text>
					<Image source={leftArrow} style={{ margin: 6, marginRight: 0 }} resizeMode='contain' />
				</View>
			</TouchableOpacity>
			<Line style={{ marginLeft: 13 }} />

			<TouchableOpacity underlayColor='#eee' onPress={() => {
				this.props.navigator.push({
					component: PurchaseRemindMessageEdit,
					params: {
						remindDay: this.state.remindDay,
						callback: (day) => {
							this.setState({ remindDay: day })
						}
					},
				});
			}}>
				<View style={styles.row}>
					<Text style={styles.titleStyle}>重复提醒</Text>
					<Text style={styles.detailStyle}>{this.state.remindDay > 0 ? this.state.remindDay.toString() + '天' : ''}</Text>
					<Image source={leftArrow} style={{ margin: 6, marginRight: 0 }} resizeMode='contain' />
				</View>
			</TouchableOpacity>

			{/*<View style={[styles.row, {marginTop: 10}]}>*/}
			{/*<Text style={styles.titleStyle}>开启消息推送</Text>*/}
			{/*<Switch*/}
			{/*style={{alignSelf: 'center'}}*/}
			{/*onValueChange={(value) => this.setState({pushState: value})}*/}
			{/*value={this.state.pushState}*/}
			{/*onTintColor="#0082FF"*/}
			{/*thumbTintColor="#fff"*/}
			{/*tintColor="#0082FF"*/}
			{/*/>*/}
			{/*</View>*/}
			{/*<Line style={{marginLeft: 13}}/>*/}

			<View style={[styles.row, { marginTop: 10 }]}>
				<Text style={styles.titleStyle}>开启消息推送</Text>
				<Switch
				    value={this.state.isPushNotice=='Y'}
					style={{ width: 50, height: 31 }}
					onValueChange={(value) => {
						 if(value){this.setState({isPushNotice:'Y'})}
						 else{this.setState({isPushNotice:'N'})}
					}}
					onTintColor="#0082FF"
				/>
			</View>
            <Line style={{ marginLeft: 13 }} />
			<View style={styles.row}>
				<Text style={styles.titleStyle}>开启手机短信</Text>
				<Text style={[styles.detailStyle, { marginRight: 7 }]}>{this.state.phone}</Text>
				<Switch
					style={{ width: 50, height: 31 }}
					onValueChange={(value) => {
						if (value === true) {
							Alerts.showInputConfirm({
								moduleBg: { backgroundColor: 'rgba(0,5,18,0.1)' },
								inputType: 'number',
								maxLength: 11,
								title: '开启手机短信',
								titleStyle: { color: '#000', fontSize: 19, fontWeight: '600', marginTop: 22 },
								subTitle: '',
								subTitleStyle: { height: 7 },
								placeholder: '请输入11位手机号码',
								confirmStyle: { color: '#007AFF' },
								cancelStyle: { color: '#007AFF' },
								inputStyle: {},
								onCancelPress: () => {
								},
								onConfirmPress: (text) => {
									if (ValidateUtil.isPhone(text)) {
										this.setState({ phone: text, messageState: value });
									} else {
										Toast.show('填写的不是电话号码');
									}
								}
							});
						} else {
							this.setState({ phone: '', messageState: value });
						}
					}}
					value={this.state.messageState}
					onTintColor="#0082FF"
				/>
			</View>
			<TouchableOpacity underlayColor='#eee' onPress={() => {
				let params = {
					message: this.state.message,
					callback: (messageText) => {
						this.setState({ message: messageText });
					}
				};
				this.props.navigator.push({
					component: PurchaseMessageEdit,
					params: params,
				});
			}}>
				<View style={[styles.row, { marginTop: 10 }]}>
					<Text style={styles.titleStyle}>提醒内容</Text>
					<Text style={styles.detailStyle}>{message}</Text>
					<Image source={leftArrow} style={{ margin: 6, marginRight: 0 }} resizeMode='contain' />
				</View>
			</TouchableOpacity>
		</View>);

		return (
			<BaseView mainBackColor={{ flex: 1, backgroundColor: '#f5f5f5' }}
				ref='baseview'
				title={{ title: '计划设置', fontSize: 18, tintColor: '#333333' }}
				navigator={this.props.navigator}
				statusBarStyle='default'
				rightButton={(
					<View style={{ alignSelf: 'center', marginRight: 10 }}>
						<TouchableOpacity onPress={() => {
							this.deleBtnPress();
						}}>
							<Text style={styles.leftBtnStyle}>删除</Text>
						</TouchableOpacity>
					</View>
				)}
			>
				<Line />
				<ScrollView>
					<TouchableOpacity underlayColor='#eee' onPress={() => {
						let params = {
							title: this.state.title,
							detail: this.state.detail,
							purid: this.props.params.purid,
							callback: (titleText, detailText) => {
								this.setState({ title: titleText, detail: detailText });
								this.props.params.callback && this.props.params.callback(titleText, detailText);
							}
						};
						this.props.navigator.push({
							component: PurchaseTitleEdit,
							params: params,
						});
					}}>
						<View style={styles.rowHead}>
							<Text style={[styles.titleStyle, { fontSize: 14 }]}>{this.state.title}</Text>
							<Text style={{ fontSize: 13 }}>编辑</Text>
						</View>
					</TouchableOpacity>
					<View style={styles.row}>
						<Text style={styles.titleStyle}>开启提醒</Text>
						<Switch
							style={{ width: 50, height: 31 }}
							onValueChange={(value) => this.remindStateChange(value)}
							value={this.state.remindState}
							onTintColor="#0082FF"
						/>
					</View>

					{this.state.remindState === true ? remindEditView : null}

					<TouchableOpacity
						underlayColor='#eee'
						style={{
							margin: 15,
							marginTop: 25,
							width: (sizeToFit(320) - 30),
							backgroundColor: "#34457D",
							height: sizeToFit(45),
							justifyContent: 'center',
							alignItems: 'center'
						}}
						onPress={this.saveBtnPress.bind(this)}
					>
						<Text style={{ color: "#fff", fontSize: 15 }}>保存</Text>
					</TouchableOpacity>

				</ScrollView>


			</BaseView>
		);
	}
}

const styles = StyleSheet.create({
	leftBtnStyle: {
		fontSize: 16,
		color: "#444",
	},
	row: {
		backgroundColor: "#fff",
		height: 53,
		width: sizeToFit(320),
		paddingLeft: 13,
		paddingRight: 13,
		alignItems: "center",
		flexDirection: 'row',
	},
	rowHead: {
		backgroundColor: "#f5f5f5",
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
	detailStyle: {
		color: "#959FA7"
	}
});