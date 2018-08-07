import React, { Component } from 'react';
import {
	Text,
	Image,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
	TextInput,
	ScrollView,
	Platform
} from 'react-native';
import {
	Fetch,
	ImallCookies
} from 'future/public/lib';

import {
	BaseView,
	Toast,
	TextInputC
} from 'future/public/widgets';

import styles from '../styles/PerfectInformation';
import ValidateUtil from 'future/public/lib/ValidateUtil';;
import Chrosslocation from '@imall-test/react-native-chrosslocation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import dismissKeyboard from 'dismissKeyboard';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import md5 from 'md5';
import PrefeStep2 from './PrefeStep2';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/Member';

class PerfectInformation extends Component {
	constructor(props) {
		super(props);
		this.state = {

		}

	}

	onClickBackHome() {
		this.props.actions.logout().then(() => {
			ImallCookies.clearUser();
			RCTDeviceEventEmitter.emit('changeTabBarIdx', { idx: 0, goTop: true });
		}).catch(err => {
			console.log('err', err);
		});
	}

	renderRightBtn() {
		return (
			<TouchableOpacity
				activeOpacity={0.7}
				onPress={() => {
					this.onClickBackHome();
				} }
				style={{ justifyContent: 'center', paddingRight: 13, }}
				>
				<Text style={{ color: '#333', fontSize: 13, top: 2 }}>退出</Text>
			</TouchableOpacity>
		)
	}

	render() {
		return (
			<BaseView
				mainBackColor={{ backgroundColor: '#f4f3f3' }}
				ref={base => this.base = base}
				navigator={this.props.navigator}
				mainColor={'#f5f5f5'}
				leftButton={<View></View>}
				rightButton={this.renderRightBtn()}
				titlePosition={'center'}
				statusBarStyle={'default'}
				title={{ title: '完善资料', tintColor: '#333', fontSize: 18 }}>
				<Step1 navigator={this.props.navigator} />
			</BaseView>
		);
	}
}
class Step1 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			unitNm: '',//单位名称、公司名称
			orgCode: '', //营业执照统一社会信用代码
			regCapital: '',//注册资本
			entZoneId: '',//所在地区id
			regAddr: '',//详细地址
		}
		this.rentZoneStr = '';
		this._openStep2 = this._openStep2.bind(this);
		this._onEntPress = this._onEntPress.bind(this);
		this.defaultBg = { backgroundColor: '#E0E0E1' };
		this.defaultTextBg = { color: '#BFBFBF' };
		this.inpoutConut = 0;
		this.beforeDatas = null;
	}
	componentDidMount() {
		new Fetch({
			url: 'app/user/getRegisterInfo.json',
		}).dofetch().then((data) => {
			console.log('完善信息', data);
			this.beforeDatas = data.result;
			if (this.beforeDatas != null) {
				console.log('this.beforeDatas', this.beforeDatas);
				this.setState({
					unitNm: this.beforeDatas.unitNm == null ? '' : this.beforeDatas.unitNm,//单位名称、公司名称
					orgCode: this.beforeDatas.orgCode == null ? '' : this.beforeDatas.orgCode, //营业执照统一社会信用代码
					regCapital: this.beforeDatas.regCapital == null ? '' : this.beforeDatas.regCapital + '',//注册资本
					entZoneId: this.beforeDatas.entZoneId == null ? '' : this.beforeDatas.entZoneId,//所在地区id
					regAddr: this.beforeDatas.regAddr == null ? '' : this.beforeDatas.regAddr,//详细地址
				});
			}
		}).catch((error) => { console.info('完善信息失败', error) });
	}

	_onEntPress() {
		Chrosslocation.sethost("http://eyb2b.imall.com.cn");
		Chrosslocation.show({
			areaCode: null,
			color: "#3484df",
			block: (areaCode, addressString) => {
				if (!ValidateUtil.isBlank(areaCode) && !ValidateUtil.isBlank(addressString)) {
					if (Platform.OS == 'ios') {
						console.log('areaCode', areaCode);
						console.log('addressString', addressString);
						let end = addressString.indexOf(" ");
						let address = addressString.substring(0, end) + '省' + addressString.substring(end, addressString.length);
						this.rentZoneStr = address.trim().replace(/\s/g, "-");
					} else {
						this.rentZoneStr = addressString;
					}
					this.setState({
						entZoneId: areaCode,
					})
				}
			}
		});
	}
	_changerBg() {
		this.defaultBg = { backgroundColor: '#34457D' };
		this.defaultTextBg = { color: '#fff' };
	}

	checkValidity() {
		return (
			!ValidateUtil.isBlank(this.state.unitNm) &&
			!ValidateUtil.isBlank(this.state.orgCode) &&
			!ValidateUtil.isBlank(this.state.regCapital) &&
			!ValidateUtil.isBlank(this.state.entZoneId) &&
			!ValidateUtil.isBlank(this.state.regAddr)
		);
	}

	_openStep2() {
		if (ValidateUtil.isNull(this.state.unitNm)) {
			Toast.show('请输入单位名称!');
			return;
		}
		if (ValidateUtil.isNull(this.state.orgCode)) {
			Toast.show('请输入社会信用代码!');
			return;
		}
		if (ValidateUtil.isNull(this.state.regCapital)) {
			Toast.show('请输入注册资本!');
			return;
		}
		if (ValidateUtil.isNull(this.state.entZoneId)) {
			Toast.show('请选择所在地区!');
			return;
		}
		if (ValidateUtil.isNull(this.state.regAddr)) {
			Toast.show('请输入详细地址!');
			return;
		}
		dismissKeyboard();
		const { navigator } = this.props;
		if (navigator) {
			navigator.push({
				component: PrefeStep2,
				params: {
					user: this.state,
					beforeDatas: this.beforeDatas
				}
			})
		}
	}
	_renderNnitNm() {
		return (
			<TouchableWithoutFeedback
				style={styles.ItemsView}
				onPress={() => {
					this.refs.unitNm.focus();
				} }
				>
				<View style={styles.ItemsView}>
					<Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>单位名称</Text>
					<TextInputC
						ref={'unitNm'}
						clearButtonMode='while-editing'
						autoFocus={false}
						autoCorrect={false}
						onChangeText={(unitNm) => {
							{/*this._changerBg();*/ }
							this.setState({
								unitNm: unitNm,
							})
						}
						}
						value={this.state.unitNm}
						style={styles.textInput}
						maxLength={20} />
				</View>
			</TouchableWithoutFeedback>
		);
	}
	_renderOrgCode() {
		return (
			<TouchableWithoutFeedback
				style={styles.ItemsView}
				onPress={() => {
					this.refs.orgCode.focus();
				} }
				>
				<View style={styles.ItemsView}>
					<Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>统一社会信用代码</Text>
					<TextInputC
						ref={'orgCode'}
						clearButtonMode='while-editing'
						autoFocus={false}
						autoCorrect={false}
						onChangeText={(orgCode) => {
							{/*this._changerBg();*/ }
							this.setState({
								orgCode: orgCode,
							})
						}
						}
						value={this.state.orgCode}
						style={styles.textInput}
						maxLength={20} />
				</View>
			</TouchableWithoutFeedback>
		);
	}

	_renderRegCapital() {
		return (
			<TouchableWithoutFeedback
				style={styles.ItemsView}
				onPress={() => {
					this.refs.regCapital.focus();
				} }
				>
				<View style={styles.ItemsView}>
					<Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>注册资本(万元)</Text>
					<TextInputC
						ref={'regCapital'}
						keyboardType='numeric'
						clearButtonMode='while-editing'
						autoFocus={false}
						autoCorrect={false}
						onChangeText={(regCapital) => {
							{/*this._changerBg();*/ }
							this.setState({
								regCapital: regCapital,
							})
						}
						}
						value={this.state.regCapital}
						style={styles.textInput}
						maxLength={20} />
				</View>
			</TouchableWithoutFeedback>
		);
	}

	_rendeRentZoneId() {
		return (
			<TouchableOpacity onPress={this._onEntPress}>
				<View style={styles.rentZone}>
					<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
						<Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 20 }}>所在地区</Text>
						<Text style={{ flex:1,color: "#0C1828", fontSize: 15 }} numberOfLines={1}>{this.rentZoneStr}</Text>
					</View>
					<Image source={require('../res/RerfectInformation/000youjiantou.png')} style={{ width: 6, height: 11 }} resizeMode='stretch' />
				</View>
			</TouchableOpacity>
		);
	}

	_rendeRegAddr() {
		return (
			<View style={styles.regAddr}>
				<TextInput
					autoFocus={false}
					autoCorrect={false}
					multiline={true}
					autoCapitalize='none'
					autoCorrect={true}
					underlineColorAndroid='transparent'
					onChangeText={(regAddr) => {
						{/*this._changerBg();*/ }
						this.inpoutConut = regAddr.length;
						this.setState({
							regAddr: regAddr
						})
					}
					}
					value={this.state.regAddr}
					style={styles.regAddrTextInput}
					maxLength={200}
					placeholder={'详细地址'} />
				<Text style={{ fontSize: 10, color: '#AAAEB9', position: "absolute", right: 13, bottom: 10 }}>{this.inpoutConut}/200</Text>
			</View>
		);
	}

	render() {
		if (this.checkValidity()) {
			this.defaultBg = { backgroundColor: '#34457D' };
			this.defaultTextBg = { color: '#fff' };
		} else {
			this.defaultBg = { backgroundColor: '#E0E0E1' };
			this.defaultTextBg = { color: '#BFBFBF' };
		}

		return (
			<View style={{ flex: 1, flexDirection: 'column' }}>
				<KeyboardAwareScrollView>
					<View style={{ flex: 1, flexDirection: 'column' }}>
						<View style={styles.lineView}>
							<View style={[styles.lineItem, { backgroundColor: '#34457D' }]} />
							<View style={styles.lineItem} />
							<View style={styles.lineItem} />
							<View style={styles.lineItem} />
							<View style={styles.lineItem} />
							<View style={styles.lineItem} />
						</View>
						<View style={styles.marTop}></View>
						{this._renderNnitNm()}
						{this._renderOrgCode()}
						{this._renderRegCapital()}
						{this._rendeRentZoneId()}
						{this._rendeRegAddr()}
					</View>
				</KeyboardAwareScrollView>
				<TouchableOpacity
					style={[styles.buttomView, this.defaultBg]}
					onPress={this._openStep2}
					disabled={this.checkValidity() ? false : true}
					>
					<Text style={[{ fontSize: 16 }, this.defaultTextBg]}>下一步(1/6)</Text>
				</TouchableOpacity>

			</View>
		);
	}
}

function mapStateToProps(state) {
	return {
		userInfo: state.Member.userInfo,
	};
}
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PerfectInformation);