import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	Dimensions,
	PixelRatio,
	Platform,
	Switch,
	ScrollView,
	Modal
} from 'react-native';
import { Fetch, ValidateUtil } from 'future/public/lib';
import { 
	BaseView, 
	RefreshableListView,
	TextInput, 
	TextInputC, 
	EasyToast, 
	MaskModal 
} from 'future/public/widgets';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import styles from '../styles/ChooseBank';
import _ from 'underscore';

const screenWidth = Dimensions.get('window').width;

export default class ChooseBank extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isSwitch: false,
			bankName: '',  // 到账银行
			bankAddress: '',  // 分行地址
			userName: '',  // 用户姓名
			bankNum: '',    // 银行卡号
			data: [],
			bankList: [],
		}
	}

	componentDidMount() {
		new Fetch({
			url: '/app/user/getRecentlyUsedBank.json'
		}).dofetch().then((data) => {
			this.setState({
				data: this.state.data.concat(data.result)
			})
		}).catch((error) => console.log('error',error));

		this.getBankList()
	}
	getBankList() {
		new Fetch({
			url: '/app/user/getBanks.json'
		}).dofetch().then((data) => {
			console.log('lllllllllllllllllll',data)
			this.setState({bankList: data.result})
		}).catch((error) => console.log('error',error))
	}
	//选择银行卡
	backWithdraw(item) {
		if (item) {
			this.props.params.callBack(item);
			this.props.navigator.pop();
		} else {
			if (!this.state.bankName) {
				this.refs.toast.show('请先选择收款银行');
				return;
			}
			if (!this.state.bankAddress) {
				this.refs.toast.show('请先输入分行地址');
				return;
			}
			if (!this.state.userName) {
				this.refs.toast.show('请先输入用户姓名');
				return;
			}
			if (!(/^[\d\s]+$/.test(this.state.bankNum)) || this.state.bankNum.length > 23) {
				this.refs.toast.show('请正确填写银行卡号');
				return;
			}
			var obj = {
				bankCode: this.state.bankName,
				branchBank: this.state.bankAddress,
				bankUserName: this.state.userName,
				bankAccount: this.state.bankNum
			};
			this.props.params.callBack(obj);
			this.props.navigator.pop();
		}
	}

	renderView() {
		return (
			this.state.data.map((item, index) => {
				return (
					<TouchableOpacity key={index} onPress={this.backWithdraw.bind(this, item)} >
						<View style={styles.itemWrap}>
							<View style={styles.itemView}>
								<Text style={styles.bankUserName}>{item.bankUserName}</Text>
								<Text style={styles.bankAccount}>{item.bankCode}（{item.bankAccount.substr(-4)}）</Text>
							</View>
							{
								index == 0 ?
									<Image
										source={require('../res/ChooseBank/gou.png')}
										style={styles.gou}
										resizeMode="contain"
									/>
									: null
							}
						</View>
					</TouchableOpacity>
				)
			})
		)
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
				<ScrollView>
					<View style={styles.container}>
						<View style={styles.mainView}>
							<Text style={styles.title}>最近使用银行卡</Text>
						</View>
						{this.renderView()}
					</View>
					<View style={[styles.container, { paddingRight: 15 }]}>
						<View style={styles.newView}>
							<Text style={styles.title}>使用新银行卡</Text>
							<Switch
								onValueChange={(value) => this.setState({ isSwitch: value })}
								onTintColor={'#0082ff'}
								thumbTintColor={'#fff'}
								value={this.state.isSwitch}
							/>
						</View>
						{
							this.state.isSwitch ?
								<View>
									<View style={styles.inputView}>
										<Text style={styles.inputTitle}>到账银行</Text>
										<TouchableOpacity style={styles.chooseBank} onPress={() => this.refs.stateModal.show()}>
											<View style={styles.inputWrap}>
												<View style={styles.inputCView}>
													<Text style={[styles.input,{lineHeight: 18}]}>{this.state.bankName}</Text>
												</View>
												<Image
													source={require('../res/Buyer/000xiangyousanjiao.png')}
													style={styles.sanjiao}
													resizeMode="contain"
												/>
											</View>
										</TouchableOpacity>
									</View>
									<MaskModal 
										ref='stateModal'
										viewType="full"
										contentView={
											<View>
												<View style={styles.maskView}>
													
													<View style={styles.maskTitleView}>
														<Text style={styles.maskTitle}>选择银行</Text>
													</View>
												</View>
												<View style={{ backgroundColor: '#fff' }}>
													{
														_.map(this.state.bankList, (item, index, arr) => {
															return (
																<View key={index}>
																	<TouchableOpacity activeOpacity={0.7}
																		onPress={() => {
																			this.refs.stateModal.hide();
																			this.setState({
																				bankName: item,
																			});			
																		}}
																		style={styles.maskItem}>
																		<View style={styles.maskItemView}>
																			<Text style={styles.maskText}>{item}</Text>
																		</View>
																		
																	</TouchableOpacity>
																</View>
															)
														})
													}
												</View>
												
											</View>
										}
									/>
									<View style={styles.inputView}>
										<Text style={styles.inputTitle}>分行地址</Text>
										<View style={styles.inputCView}>
											<TextInputC
												style={styles.input}
												value={this.state.bankAddress}
												onChangeText={(text) => this.setState({ bankAddress: text })}
												maxLength={20}
												valueType={'default'}
											/>
										</View>
									</View>
									<View style={styles.inputView}>
										<Text style={styles.inputTitle}>用户姓名</Text>
										<View style={styles.inputCView}>
											<TextInputC
												style={styles.input}
												value={this.state.userName}
												onChangeText={(text) => this.setState({ userName: text })}
												valueType={'default'}
												maxLength={10}
											/>
										</View>
									</View>
									<View style={styles.inputView}>
										<Text style={styles.inputTitle}>银行卡号</Text>
										<View style={styles.inputCView}>
											<TextInputC
												style={styles.input}
												value={this.state.bankNum ? this.state.bankNum.replace(/\s/g, '').replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, "$1 ") : ''}
												onChangeText={(text) => this.setState({ bankNum: text })}
												valueType={'default'}
												maxLength={23}
											/>
										</View>
									</View>
									<TouchableOpacity onPress={() => this.backWithdraw()}>
										<View style={styles.buttonView}>
											<View style={styles.activeButton}>
												<Text style={styles.activeText}>确定使用新卡</Text>
											</View>
										</View>
									</TouchableOpacity>
								</View>
								: null
						}
					</View>
				</ScrollView>
				<KeyboardSpacer />
				<EasyToast ref={'toast'} />
			</BaseView>
		)
	}
}