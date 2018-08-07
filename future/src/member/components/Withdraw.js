import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	TouchableHighlight,
	TouchableOpacity,
	Dimensions,
	PixelRatio,
	TextInput,
	ScrollView,
	InteractionManager
} from 'react-native';

import { BaseView, TextInputC, InputAlert, Alerts, EasyToast } from 'future/public/widgets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
	ValidateUtil,
	Fetch
} from 'future/public/lib';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import dismissKeyboard from 'dismissKeyboard';
import md5 from 'md5';
import ChooseBank from './ChooseBank';
import styles from '../styles/Withdraw';

const screenWidth = Dimensions.get('window').width;

export default class Withdraw extends Component {
	constructor(props) {
		super(props);
		this.state = {
			amount: '',   // 取现的金额
			reason: '',    //取现原因
			payPsw: '',     // 取现密码
			endAmount: 0,   //余额
			data: null       //银行卡信息
		}
		this.allBalance = this.allBalance.bind(this);
		this._inputAlert = this._inputAlert.bind(this);
		this._openChooseBank = this.openChooseBank.bind(this);
	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.getEndAmount()
		})
	}

	getEndAmount() {
		new Fetch({
			url: '/app/user/getUserPreStoreAndintegral.json',
		}).dofetch().then((data) => {
			
			this.setState({endAmount: data.prestore})
		}).catch((error) => {
			console.log('error',error)
		})
	}

	//全部提现
	allBalance() {
		this.setState({
			amount: this.state.endAmount.toString()
		})
	}
	//支付密码
	_inputAlert() {
		dismissKeyboard();
		if (this.state.data == undefined) {
			this.refs.toast.show('请选择银行卡');
			return;
		}
		if (isNaN(this.state.amount) || this.state.amount > this.props.params.endAmount) {
			this.refs.toast.show('请输入正确的提现金额');
			return;
		}
		if (ValidateUtil.isNull(this.state.reason)) {
			this.refs.toast.show('请输入提现原因');
			return;
		}
		Alerts.showInputConfirm({
			moduleBg: { backgroundColor: 'rgba(0,0,0,0.4)' },
			inputType: '',
			maxLength: 20,
			title: '输入密码',
			titleStyle: { color: '#333' },
			subTitle: '提现金额 ' + this.state.amount + '元',
			subTitleStyle: {},
			placeholder: '请输入6~20支付密码',
			confirmStyle: { color: '#007AFF' },
			cancelStyle: { color: '#007AFF' },
			inputStyle: {},
			autoFocus: true,
			secureTextEntry:true,
			onChangeText: (text) => {
				this.setState({
					payPsw: text
				})
			},
			onCancelPress: () => {

			},
			onConfirmPress: (text) => {
				this.fetchData()
			}
		});
	}

	fetchData() {
		
		new Fetch({
			url: '/app/user/saveCashWithdrawalRequest.json',
			method: 'POST',
			bodyType: 'json',
			data: {
				bankCode: this.state.data.bankCode,
				branchBank: this.state.data.branchBank,
				bankUserName: this.state.data.bankUserName,
				bankAccount: this.state.data.bankAccount,
				amount: this.state.amount,
				reason: this.state.reason,
				payPsw: md5(this.state.payPsw)
			}
		}).dofetch().then((data) => {
			if(data.success) {
				var endAmount = this.state.endAmount - this.state.amount;
				this.refs.toast.show('取现成功');
				this.props.params.callBack && this.props.params.callBack(endAmount);
				this.props.navigator.pop();
			}
		}).catch((error) => {
			console.log('error', error)
		})
	}

	openChooseBank() {
		this.props.navigator.push({
			component: ChooseBank,
			params: {
				callBack: (data) => {
					this.setState({
						data: data
					})
				}
			}
		})
	}

	render() {
		
		return (
			<BaseView
				ref={'base'}
				navigator={this.props.navigator}
				mainColor={'rgba(250,250,250,0.90)'}
				title={{ title: '余额提现', tintColor: '#333', fontSize: 18 }}
				mainBackColor={{ backgroundColor: '#f5f5f5' }}
				statusBarStyle={'default'}
			>
				{
					this.state.data == undefined ?
						(<TouchableOpacity
							onPress={this._openChooseBank}
						>
							<View style={styles.headerBox}>
								<Image
									source={require('../res/Withdraw/008jiahaoquan.png')}
									style={styles.jia}
									resizeMode="contain"
								/>
								<Text style={styles.jiaTitle}>添加银行卡</Text>
							</View>
						</TouchableOpacity>)
						:
						(
							<TouchableOpacity onPress={this._openChooseBank}>
								<View style={[styles.headerBox,{ justifyContent: 'space-between'}]}>
									<View style={styles.userView}>
										<Image
											source={require('../res/Withdraw/008yinhanka.png')}
											style={styles.yinhangka}
											resizeMode="contain"
										/>
										<View style={styles.userTitleView}>
											<Text style={styles.bankUserName}>{this.state.data.bankUserName}</Text>
											<Text style={styles.bankCode}>{this.state.data.bankCode}（{this.state.data.bankAccount.replace(/\s+/g, "").substr(-4)}）</Text>
										</View>
									</View>
									<Image
										source={require('../res/Buyer/000xiangyousanjiao.png')}
										style={styles.sanjiao}
										resizeMode="contain"
									/>
								</View>
							</TouchableOpacity>
						)
				}
				<View style={styles.container}>
					<View>
						<Text style={styles.moneyTip}>提现金额</Text>
						<View style={styles.inputWrap}>
							<Text style={styles.fuhao}>￥</Text>
							<View style={styles.inputView}>
								<TextInputC
									style={styles.input}
									keyboardType={'number-pad'}
									autoFocus={true}
									selectionColor={'#000'}
									value={this.state.amount}
									maxLength={15}
									keyboardType={'numeric'}
									onChangeText={(text) => {
										if (text.indexOf('.') != -1) {
											var arr = text.split('.')
											if (arr[1].length > 2) {
												arr[1] = arr[1].substr(0, 2);
												text = arr.join('.')
											}
										}
										this.setState({
											amount: text
										});
									}}
								/>
							</View>
						</View>
						<View style={styles.tipView}>
							{
								parseFloat(this.state.amount) > this.state.endAmount ?
									<Text style={styles.tipText}>输入金额超过可提现金额</Text>
									:
									<Text style={styles.warnText}>可提现金额{this.state.endAmount}元</Text>
							}
							<TouchableOpacity onPress={this.allBalance}>
								<Text style={styles.allText}>全部提现</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.reasonView}>
							<Text style={styles.reasonText}>提现原因</Text>
							<View style={styles.reasonInputView}>
								<TextInputC
									style={styles.reasonInput}
									clearButtonMode={'while-editing'}
									placeholder={'*必填'}
									value={this.state.reason}
									selectionColor={'#333'}
									onChangeText={(text) => {
										this.setState({
											reason: text
										})
									}}
								/>
							</View>
						</View>

					</View>
				</View>
				{
					this.state.amount.length > 0 ?
						(<TouchableOpacity onPress={this._inputAlert}>
							<View style={styles.buttonView}>
								<View style={styles.activeButton}>
									<Text style={styles.activeText}>立即提现</Text>
								</View>
							</View>
						</TouchableOpacity>)
						:
						<View style={styles.buttonView}>
							<View style={styles.button}>
								<Text style={styles.buttonText}>立即提现</Text>
							</View>
						</View>
				}
				<KeyboardSpacer />
				<EasyToast ref={'toast'} position={'bottom'} />
				
			</BaseView>
		)
	}
}