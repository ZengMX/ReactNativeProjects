import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	TouchableOpacity,
	ScrollView,
	findNodeHandle,
	Dimensions
} from 'react-native';
import {
	BaseView,
	Toast,
	TextInputC,
	Alerts,
} from 'future/public/widgets';
import {
	Fetch,
	imageUtil,
	ValidateUtil,
} from 'future/public/lib';
import { UIManager } from 'NativeModules';
import md5 from 'md5';
import styles from '../styles/ModifyPayPsd';
import dismissKeyboard from 'dismissKeyboard';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
const screenWidth = Dimensions.get('window').width;

class ModifyPayPsd extends Component {
	constructor(props) {
		super(props);

		let placeHolder = this.props.params.isSetedPsd ? '选择找回方式' : '选择设置方式';
		this.state = {
			placeholder: placeHolder,
			setPsdBtn: false,
			way: 2,    // 2-手机   1-邮箱
			isCanSend: true,   // 倒计时按钮是否可用
			message: '获取验证码',
			verifyCode: '',
			password: '',
			isHasCanSend: false,
			canSubmit: false,
			account: this.props.userInfo && this.props.userInfo.userMobile,
		}
		//设置默认发送验证码的时间间隔频率
		this.sendSmsFrequency = 60;
	}

	componentDidMount() {
		console.log('componentDidMount', this.props);
	}

	componentWillUnmount() {
		this.timer && clearInterval(this.timer);   //退出清除倒计时
	}

	_onPhonePress = () => {
		this._hideCustom();
		this.setState({
			placeholder: '手机' + (this.props.params.isSetedPsd ? '找回' : '设置'),
			way: 2,
			account: this.props.userInfo.userMobile
		});
	}

	_onEmailPress = () => {
		this._hideCustom();
		this.setState({
			placeholder: '邮箱' + (this.props.params.isSetedPsd ? '找回' : '设置'),
			way: 1,
			account: this.props.userInfo.userEmail
		});
	}

	_hideCustom() {
		Alerts.hideCustom({ backgroundColor: 'rgba(0,0,0,0.4)' });
	}
	// 选择设置方式
	_showWays = () => {
		dismissKeyboard();
		const element = findNodeHandle(this.element);
		UIManager.measure(element, (x, y, width, height, pageX, pageY) => {
			let content = <View style={[styles.setModeModal, { top: pageY + 30, }]} >
				<Image
					style={styles.sanjiao}
					source={require('../res/RetrievePassword/020sanjiao.png')}
					resizeMode='stretch'
				/>
				<View style={styles.setModeWrap}>
					<TouchableOpacity
						onPress={this._onPhonePress}
						style={[styles.modeItem, styles.border]}>
						<Text style={styles.modeItemText}>手机设置</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={this._onEmailPress}
						style={styles.modeItem}>
						<Text style={styles.modeItemText}>邮箱设置</Text>
					</TouchableOpacity>
				</View>
			</View>;
			Alerts.showCustom({
				contentView: content,
			});
		});
	}

	// 显示时间
	_showTime = () => {
		var time = this.sendSmsFrequency;
		this.setState({
			isCanSend: false,
			isHasCanSend: true,
			message: time + '秒后重发'
		});
		this.timer = setInterval(() => {
			time--;
			if (time < 0) {
				this.timer && clearInterval(this.timer);
				this.setState({ isCanSend: true, message: '重新发送' });
			} else {
				this.setState({ message: time + '秒后重发', });
			}

		}, 1000);
	}
	// 获取验证码
	_getVerification = () => {
		if (this.state.isCanSend) {
			this._showTime();
			// 请求发送验证码
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
	_newPsdChangeText(text) {
		console.log('text', text);
		this.setState({
			password: text
		});
		if (text.length >= 8) {
			if (this.state.verifyCode.length == 6 && this.state.password.length < 16 && this.state.isHasCanSend == true) {
				this.setState({
					canSubmit: true
				});
			}
		}
	}
	_verifiCodeChangeText(text) {
		this.setState({
			verifyCode: text
		});
	}
	// 设置密码
	_setPassword = () => {
		dismissKeyboard();
		// 提交密码
		new Fetch({
			url: '/app/user/resetPayPsw.json',
			data: {
				type: this.state.way,
				value: this.state.account,
				payPsw: this.state.password,
				validateCode: this.state.verifyCode
			}
		}).dofetch().then((data) => {
			console.log('设置支付密码', data);
			if (data.success) {
				Toast.show("设置支付密码成功");
				this.props.navigator.pop();
			}
		}).catch((error) => {
			console.log('error', error);
			Toast.show("设置支付密码失败");
		});
	}
	replaceNum(phoneNum) {
		if (phoneNum.indexOf('@') > -1) {
			var arr = phoneNum.split('@');
			phoneNum = phoneNum.slice(0, 3) + '****' + arr[1];
		} else {
			var reg = /^(\d{3})\d{4}(\d{4})$/;
			phoneNum = phoneNum.replace(reg, "$1****$2");
		}
		return phoneNum;
	}
	render() {
		return (
			<BaseView
				mainBackColor={{ backgroundColor: '#f5f5f5' }}
				ref={base => this.base = base}
				navigator={this.props.navigator}
				mainColor={'#f5f5f5'}
				titlePosition={'center'}
				statusBarStyle={'default'}
				title={{ title: '支付密码', tintColor: '#333', fontSize: 18 }} >
				<View style={styles.infoWrap}>
					<View style={styles.item}>

						<Text style={styles.inputStyle}>{this.replaceNum(this.state.account)}</Text>
						<TouchableOpacity style={styles.settingMode} ref={element => this.element = element}
							onPress={this._showWays}>
							<Image source={require('../res/ModifyPayPsd/000gengduo.png')} style={styles.settingImg} />
						</TouchableOpacity>
					</View>
					<View style={[styles.item, styles.otherItem]}>
						<TextInputC
							clearButtonMode={'while-editing'}
							maxLength={32}
							autoFocus={false}
							underlineColorAndroid='transparent'
							onChangeText={(value) => { this._verifiCodeChangeText(value) }}
							value={this.state.verifyCode}
							style={styles.inputStyle}
							placeholderTextColor="#ACB4BE"
							placeholder="验证码"
							keyboardType='numeric'
						/>
						<TouchableOpacity style={[styles.btn, styles.codeBtnSize, this.state.isCanSend ? styles.btnAct : null]}
							disabled={!this.state.isCanSend}
							onPress={this._getVerification}>
							<Text style={[styles.btnText, styles.codeBtnTextSize, this.state.isCanSend ? styles.btnTextAct : null]}>{this.state.message}</Text>
						</TouchableOpacity>
					</View>
					<View style={[styles.item, styles.otherItem]}>
						<TextInputC
							clearButtonMode={'while-editing'}
							maxLength={32}
							autoFocus={false}
							underlineColorAndroid='transparent'
							style={styles.inputStyle}
							value={this.state.password}
							onChangeText={(value) => { this._newPsdChangeText(value) }}
							placeholder="8-16位字母、数字、符号组合密码"
							keyboardType='default'
							secureTextEntry={true}
						/>
					</View>
					<TouchableOpacity style={{
						width: screenWidth - 50,
						marginTop: 30,
						height: 46,
						backgroundColor: this.state.canSubmit == false ? "#E0E0E1" : "#34457D",
						justifyContent: 'center',
						alignItems: 'center'
					}}
						disabled={!this.state.canSubmit}
						onPress={this._setPassword}>
						<Text style={{ fontSize: 16, color: this.state.canSubmit == false ? "#BFBFBF" : "#fff" }}>设置密码</Text>
					</TouchableOpacity>

				</View>

			</BaseView>
		)
	}
}
function mapStateToProps(state) {
	return {
		userInfo: state.Member.userInfo,
	};
}
function mapDispatchToProps(dispatch) {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ModifyPayPsd);
