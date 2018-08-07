import React, { Component } from 'react';
import {
	Text,
	Image,
	TouchableOpacity,
	View,
	findNodeHandle,
	PixelRatio
} from 'react-native';
import Fetch from 'future/public/lib/Fetch';
import {
	BaseView,
	Toast,
	ScalePopupView,
	Alerts,
	TextInputC
} from 'future/public/widgets';
import { UIManager } from 'NativeModules';
import styles from '../styles/RetrievePassword';
import md5 from 'md5';
import ValidateUtil from 'future/public/lib/ValidateUtil';
import dismissKeyboard from 'dismissKeyboard';
import Login from './Login';
export default class RetrievePassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			verification: '',
			rePassword: '',
			placeholder: '选择找回密码方式',
			way: 0, //验证的2手机、1邮箱
			account: '',//手机、邮箱
			isCanSend: true, //倒计时按钮是否可用
			message: '获取验证码',
			imageHeight: 0, //显示验证码是否正确
			isVerificationCode: false,//验证码是否正确
		}
		this._showWays = this._showWays.bind(this);
		this._resSetPssword = this._resSetPssword.bind(this);
		this._getVerification = this._getVerification.bind(this);
		this._hideCustom = this._hideCustom.bind(this);
		this._onPhonePress = this._onPhonePress.bind(this);
		this._onEmailPress = this._onEmailPress.bind(this);
		this._onChangeText = this._onChangeText.bind(this);
		//设置默认发送验证码的时间间隔频率
		this.sendSmsFrequency = 60;
		//设置默认发送验证码的时间间隔频率
		this.veriBackColor = { backgroundColor: '#E0E0E1' };
		this.veriTextColor = { color: '#BFBFBF' };
		this.reSetBackColor = { backgroundColor: '#E0E0E1' };
		this.reSetTextColor = { color: '#BFBFBF' };
	}
	//退出清除倒计时
	componentWillUnmount() {
		this.timer && clearInterval(this.timer);
	}

	_hideCustom() {
		Alerts.hideCustom({ backgroundColor: 'rgba(0,0,0,0.4)' });
	}

	//输入状态
	_changeBg() {
		this.veriBackColor = { backgroundColor: '#34457D' };
		this.veriTextColor = { color: '#fff' };
		this.reSetBackColor = { backgroundColor: '#34457D' };
		this.reSetTextColor = { color: '#fff' };
	}
	_onEmailPress() {
		this._changeBg();
		this.setState({
			placeholder: '请输入邮箱',
			way: 1
		});
		this._hideCustom();
	}
	_onPhonePress() {
		this._changeBg();
		this.setState({
			placeholder: '请输入手机号',
			way: 2
		});
		this._hideCustom();
	}
	_showWays() {
		dismissKeyboard();
		const element = findNodeHandle(this.element);
		UIManager.measure(element, (x, y, width, height, pageX, pageY) => {
			let content = <View style={{
				width: 190,
				height: 100,
				backgroundColor: 'rgba(255,255,255,0)',
				position: 'absolute',
				top: pageY + 17,
				right: 14,
				alignItems: 'flex-end',
				flexDirection: 'column',
			}}>

				<Image
					style={{
						width: 23,
						height: 11,
						backgroundColor: 'rgba(255,255,255,0)',
						marginRight: 10.5,
						top: 1
					}}
					source={require('../res/RetrievePassword/020sanjiao.png')}
					resizeMode='stretch'
				/>
				<View style={{
					width: 185,
					height: 89,
					flexDirection: 'column',
					backgroundColor: '#fff',
					paddingLeft: 7.5,
					paddingRight: 7.5,
					borderRadius: 3,
				}}>
					<TouchableOpacity
						onPress={this._onPhonePress}
						style={{
							height: 44.5,
							borderBottomWidth: 1,
							borderColor: '#eee',
							flexDirection: 'row',
							alignItems: 'center',
							backgroundColor: '#fff'
						}}>
						<Text style={{ fontSize: 15, color: '#333' }}>手机找回</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={this._onEmailPress}
						style={{
							height: 44.5,
							backgroundColor: '#fff',
							flexDirection: 'row',
							alignItems: 'center',
						}}>
						<Text style={{ fontSize: 15, color: '#333' }}>邮箱找回</Text>
					</TouchableOpacity>
				</View>
			</View>;
			Alerts.showCustom({
				contentView: content,
			});
		});
	}
	//显示时间
	_showTime() {
		this.setState({
			isCanSend: false
		});
		var time = this.sendSmsFrequency;
		this.timer = setInterval(() => {
			if (time < 0) {
				this.veriBackColor = { backgroundColor: '#34457D' };
				this.veriTextColor = { color: '#fff' };
				this.setState({
					message: '重新发送',
					isCanSend: true,
				});
				this.timer && clearInterval(this.timer);
			}

			if (time >= 0) {
				this.veriBackColor = { backgroundColor: '#E0E0E1' };
				this.veriTextColor = { color: '#ccc' };
				this.setState({
					message: time + '秒后重发',
				});
			}
			time--;
		}, 1000);
	}
	_validateInput() {
		if (!ValidateUtil.isPhone(this.state.account) && this.state.way == 2) {
			Toast.show('请输入正确的手机号!');
			return;
		}
		if (!ValidateUtil.isEmail(this.state.account) && this.state.way == 1) {
			Toast.show('请输入正确的邮箱!');
			return;
		}
		return true;
	}


	//输入的时候去检查验证码是否正确
	_onChangeText(verification) {
		this.setState({
			verification: verification,
			imageHeight: 0,
		});
		if (verification.length == 6 && this.state.way != 0) {
			new Fetch({
				url: '/app/user/checkVerificationCode.json',
				data: {
					type: this.state.way,
					value: this.state.account,
					verificationCode: verification
				}
			}).dofetch().then((data) => {
				console.log('检查验证码是否正确', data);
				if (data.success) {
					this.setState({
						imageHeight: 16,
						isVerificationCode: true
					});
				} else {
					this.setState({
						imageHeight: 0,
						isVerificationCode: false
					});
					Toast.show("验证码不正确!"); return;
				}
			}).catch((error) => { console.info('检查验证码是否正确失败', error) });
		}
	}

	checkValidity() {
        return (
            this.state.way!=0 &&
            !ValidateUtil.isBlank(this.state.verification) &&
			!ValidateUtil.isBlank(this.state.rePassword) &&
			!ValidateUtil.isBlank(this.state.account) 
        );
    }

	//重新获取验证码 ||获取验证码
	_getVerification() {
		if (this.state.way == null) {
			Toast.show('请选择找回密码的方式!'); return;
		}
		if (this.state.isCanSend && this._validateInput()) {
			console.log('sendVerificationCode');
			this._showTime();
			new Fetch({
				url: 'app/user/sendVerificationCode.json',
				data: {
					type: this.state.way,
					value: this.state.account
				}
			}).dofetch().then((data) => {
				console.log('验证码', data);
				if (data.success) {
					Toast.show('验证码已发送');
				}
			}).catch((error) => { console.info('验证码发送失败', error) });
		}
	}

	//重置密码
	_resSetPssword() {
		dismissKeyboard();
		if (this.state.way == null) {
			Toast.show("请选择找回密码的方式!"); return;
		}
		if (this.state.verification == null || !this.state.isVerificationCode) {
			Toast.show("验证码不正确!"); return;
		}
		if (this.state.rePassword == null) {
			Toast.show("密码不能为空!"); return;
		}

		var rePassword = this.state.rePassword && this.state.rePassword.replace(/\s+/g, "");
		if (rePassword.length == 0) {
			Toast.show("密码不能为空!"); return;
		}
		if (rePassword.length < 8) {
			Toast.show("密码必须是8-16位的!"); return;
		}
		console.log('Fetch');
		new Fetch({
			url: 'app/user/resetUserPwd.json',
			data: {
				type: this.state.way,
				value: this.state.account,
				verificationCode: this.state.verification,
				newPwd: md5(this.state.rePassword),
			}
		}).dofetch().then((data) => {
			if (data.success) {
				//DOTO
				const { navigator } = this.props;
				if (navigator) {
					navigator.push({
						component: Login,
					});
				}
				Toast.show("重置密码成功了!"); return;
			}
		}).catch((error) => { console.info('重置密码失败', error) });
	}

	render() {
		let disabled;
        let backgroundColor;
        let textColor;
        if(this.checkValidity()){
            disabled=false;
            backgroundColor="#34457D";
            textColor='#FFFFFF';
        }else{
            disabled=true;
            backgroundColor='#E0E0E1'
            textColor='#BFBFBF';
        }
		return (
			<BaseView
				mainBackColor={{ backgroundColor: '#f5f5f5' }}
				ref={base => this.base = base}
				navigator={this.props.navigator}
				mainColor={'#f5f5f5'}
				titlePosition={'center'}
				title={{ title: '找回密码', tintColor: '#333', fontSize: 18 }}>
				<View style={styles.way}>
					<TextInputC
						clearButtonMode='while-editing'
						autoFocus={true}
						autoCorrect={false}
						onChangeText={(account) => this.setState({ account })}
						value={this.state.account}
						style={styles.input}
						maxLength={20}
						placeholder={this.state.placeholder}>
					</TextInputC>
					<TouchableOpacity style={styles.selectWay} onPress={this._showWays} ref={element => this.element = element}>
						<View style={{ width: 36, height: 9, alignItems: 'center', justifyContent: 'center' }}>
							<Image
								style={{ width: 22, height: 4, }}
								source={require('../res/RetrievePassword/000dian.png')}
								resizeMode='stretch'
							/>
						</View>
					</TouchableOpacity>
				</View>

				<View style={styles.way}>
					<TextInputC
						clearButtonMode='while-editing'
						autoCorrect={false}
						keyboardType='numeric'
						onChangeText={(verification) => { this._onChangeText(verification) }}
						value={this.state.verification}
						style={styles.input}
						maxLength={6}
						placeholder="验证码">
					</TextInputC>
					<TouchableOpacity  disabled={this.state.way!=0?false:true} style={[styles.verification, this.veriBackColor]} onPress={this._getVerification}>
						<Text style={[{ fontSize: 13 }, this.veriTextColor]}>{this.state.message}</Text>
					</TouchableOpacity>
					<Image
						style={{ width: 18.95, height: this.state.imageHeight, position: 'absolute', top: 14, left: 70 }}
						source={require('../res/RetrievePassword/006zhengque.png')}
						resizeMode='stretch'
					/>
				</View>

				<View style={styles.way}>
					<TextInputC
						clearButtonMode='while-editing'
						autoCorrect={false}
						onChangeText={(rePassword) => this.setState({ rePassword })}
						value={this.state.rePassword}
						style={styles.input}
						maxLength={16}
						placeholder="8-16位字母、数字、符号组合密码">
					</TextInputC>
				</View>
				<TouchableOpacity disabled={disabled} style={[styles.reSet, this.reSetBackColor,{backgroundColor:backgroundColor}]} onPress={this._resSetPssword}>
					<Text style={[{ fontSize: 16 }, this.reSetTextColor,{color:textColor}]}>重置密码</Text>
				</TouchableOpacity>
			</BaseView>
		);
	}
}
