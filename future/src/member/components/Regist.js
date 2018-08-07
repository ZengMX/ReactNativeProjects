import React, { Component } from 'react';
import {
    Text,
    Image,
    TouchableOpacity,
    View,
    Platform,
    Dimensions
} from 'react-native';
import {
    Fetch,
    ValidateUtil
} from 'future/public/lib';
import {
    BaseView,
    Toast,
    Alerts,
    TextInputC,
    WebViewPage,
    Arrow
} from 'future/public/widgets';
import styles from '../styles/Regist';
import md5 from 'md5';
import BaseInfor from 'future/src/member/components/BaseInfor';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import StorageUtils from 'future/public/lib/StorageUtils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import dismissKeyboard from 'dismissKeyboard';
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;
export default class Regist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            password: '',
            company: '',
            mobile: '',
            checkCode: '',
            email: '',
            isSelect: false,
            isShowPassword: true,
            defaultBg: { backgroundColor: '#E0E0E1' },
            defaultTextBg: { color: '#BFBFBF' },
            message: '获取验证码',
        }
        this._rgistSuccess = this._rgistSuccess.bind(this);
        this._getVerification = this._getVerification.bind(this);
        this._onCheck = this._onCheck.bind(this);
        this._onRegist = this._onRegist.bind(this);
        this._perfectInfo = this._perfectInfo.bind(this);
        this._goHome = this._goHome.bind(this);
        //设置默认发送验证码的时间间隔频率
        this.sendSmsFrequency = 60;

        this.veriBackColor = { backgroundColor: '#BFBFBF' };
        this.veriTextColor = { color: '#34457D' };
        this.reSetBackColor = { backgroundColor: '#BFBFBF' };
        this.reSetTextColor = { color: '#ccc' };
        this.isCanSend = true; //倒计时按钮是否可用
    }
    //退出清除倒计时
    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    //显示时间
    _showTime() {
        this.isCanSend = false;
        var time = this.sendSmsFrequency;
        this.timer = setInterval(() => {
            if (time < 0) {
                this.veriBackColor = { backgroundColor: '#ffffff' };
                this.veriTextColor = { color: '#34457D' };
                this.setState({
                    message: '重新发送',
                });
                this.isCanSend = true;
                this.timer && clearInterval(this.timer);
            }

            if (time >= 0) {
                this.veriBackColor = { backgroundColor: '#ffffff' };
                this.veriTextColor = { color: '#ACB3BE' };
                this.setState({
                    message: time + 's重新发送',
                });
            }
            time--;
        }, 1000);
    }

    //重新获取验证码 ||获取验证码
    _getVerification() {
        if (ValidateUtil.isNull(this.state.mobile)) {
            Toast.show('请输入手机号码!');
            return;
        } else {
            if (!(ValidateUtil.isPhone(this.state.mobile))) {
                Toast.show('请输入正确的手机号码!');
                return;
            }
        }
        dismissKeyboard();
        if (this.isCanSend) {
            this._showTime();
            new Fetch({
                url: 'app/user/sendVerificationCode.json',
                data: {
                    type: 2,
                    value: this.state.mobile
                }
            }).dofetch().then((data) => {
                console.log('验证码', data);
                if (data.success) {
                    Toast.show('验证码已发送');
                }
            }).catch((error) => {
                console.info('验证码发送失败', error)
                Toast.show('验证码发送失败');
            });
        }
    }

    //显示密码
    showPassword() {
        this.state.isShowPassword ? (this.setState({
            isShowPassword: false
        })
        ) : (
                this.setState({
                    isShowPassword: true
                })
            )
    }

    isCanTouchRegist() {
        return (
            !ValidateUtil.isBlank(this.state.account.trim()) &&
            !ValidateUtil.isBlank(this.state.password.trim()) &&
            !ValidateUtil.isBlank(this.state.mobile.trim()) &&
            !ValidateUtil.isBlank(this.state.checkCode.trim())
        );
    }

    _onCheck() {
        this.setState({
            isSelect: !this.state.isSelect
        });
    }
    _onRegist() {
        if (ValidateUtil.isNull(this.state.account)) {
            Toast.show('请输入用户名!');
            return;
        }
        if (ValidateUtil.isNull(this.state.password)) {
            Toast.show('请输入密码!');
            return;
        } else {
            if (this.state.password.length < 8) {
                Toast.show('请输入密码必须是8-16位的组合密码!');
                return;
            }
        }
        // if (ValidateUtil.isNull(this.state.company)) {
        //     Toast.show('请输入公司名称!');
        //     return;
        // }
        if (ValidateUtil.isNull(this.state.mobile)) {
            Toast.show('请输入手机号码!');
            return;
        } else {
            if (!(ValidateUtil.isPhone(this.state.mobile))) {
                Toast.show('请输入正确的手机号码!');
                return;
            }
        }
        // if (ValidateUtil.isNull(this.state.email)) {
        //     Toast.show('请输入常用邮箱!');
        //     return;
        // } else {
        //     if (!ValidateUtil.isEmail(this.state.email)) {
        //         Toast.show('请输入正确的邮箱!');
        //         return;
        //     }
        // }
        if (!this.state.isSelect) {
            Toast.show('请输同意《汇药网服务协议》!');
            return;
        }
        this._isAlealreadyRegist('isExistLoginId.json', '抱歉！该用户名已经被注册!', { loginId: this.state.account });
        this._isAlealreadyRegist('isExistMobile.json', '抱歉！该手机号码已经被注册!', { mobile: this.state.mobile });
        // this._isAlealreadyRegist('isExistEmail.json', '抱歉！该邮箱已经被注册!', { email: this.state.email });
        this._doRegist();
    }
    _isAlealreadyRegist(url, msg, datas) {
        new Fetch({
            url: 'app/user/' + url,
            data: datas
        }).dofetch().then((data) => {
            console.log('是否已经注册' + url, data);
            if (data.isExist) {
                Toast.show(msg);
                return;
            }
        }).catch((error) => { console.info('是否已经注册失败信息', error) });
    }

    _doRegist() {
        new Fetch({
            url: 'app/user/register.json',
            bodyType: 'json',
            data: {
                loginId: this.state.account,
                userPsw: this.state.password,
                //  unitNm: this.state.company,
                userMobile: this.state.mobile,
                //  userEmail: this.state.userEmail,
                validateCode: this.state.checkCode
            }
        }).dofetch().then((data) => {
            console.log('注册信息', data);
            if (data.success) {
                this._initUserData();
                this._rgistSuccess(data);
            }
        }).catch((error) => { console.info('注册失败', error) });
    }
    _initUserData() {
        let userData = {};
        userData.userName = this.state.account;
        userData.businessRanges = '';
        userData.customerTypeId = '';
        StorageUtils.saveInfo('BASEINFOR', userData);
    }
    _perfectInfo() {
        this._hideCustom();
        this.props.navigator.push({
            component: BaseInfor,
            params: {
                isForRegist: true,
                userName: this.state.account
            }
        })
    }
    _goHome() {
        this._hideCustom();
        RCTDeviceEventEmitter.emit('changeTabBarIdx', { idx: 0, goTop: true });
    }
    _hideCustom() {
        Alerts.hideCustom({ backgroundColor: 'rgba(0,0,0,0.4)' });
    }
    _renderAccount() {
        return (
            <View style={styles.inputView}>
                <TextInputC
                    clearButtonMode='while-editing'
                    autoFocus={true}
                    autoCorrect={false}
                    onChangeText={(account) => {
                        this.setState({
                            account: account,
                            defaultBg: { backgroundColor: '#34457D' },
                            defaultTextBg: { color: '#fff' }
                        });
                        this._isAlealreadyRegist('isExistLoginId.json', '抱歉！该用户名已经被注册!', { loginId: account });
                    }
                    }
                    value={this.state.account}
                    style={[styles.textInput, { fontSize: 15 }]}
                    maxLength={20}
                    placeholder={'用户名(可作为登录账号)'} />
            </View>
        );
    }
    _renderPassword() {
        return (
            <View style={styles.inputView}>
                <TextInputC
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    secureTextEntry={this.state.isShowPassword}
                    onChangeText={(password) => {
                        this.setState({
                            password: password,
                            defaultBg: { backgroundColor: '#34457D' },
                            defaultTextBg: { color: '#fff' }
                        });
                    }
                    }
                    password={this.state.isShowPassword}
                    value={this.state.password}
                    style={[styles.textInput, { fontSize: 15 }]}
                    maxLength={16}
                    placeholder={'8-16位字母、数字、符号组合密码'} />
                <TouchableOpacity activeOpacity={0.7} onPress={() => { this.showPassword() }}>
                    <Image style={{ height: 11, width: 20, }} source={this.state.isShowPassword ? require('../res/Regist/006biyan.png') : require('../res/Regist/006kaiyan.png')} />
                </TouchableOpacity>
            </View>
        );
    }
    _renderCompany() {
        return (
            <View style={styles.inputView}>
                <TextInputC
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(company) => {
                        this.setState({
                            company: company,
                            defaultBg: { backgroundColor: '#34457D' },
                            defaultTextBg: { color: '#fff' }
                        })
                    }
                    }
                    value={this.state.company}
                    style={styles.textInput}
                    maxLength={20}
                    placeholder={'公司名称'} />
            </View>
        );
    }
    _renderMobile() {
        return (
            <View style={styles.inputView}>
                <TextInputC
                    clearButtonMode='while-editing'
                    keyboardType='numeric'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(mobile) => {
                        this.setState({
                            mobile: mobile,
                            defaultBg: { backgroundColor: '#34457D' },
                            defaultTextBg: { color: '#fff' }
                        })
                        if ((ValidateUtil.isPhone(mobile))) {
                            this._isAlealreadyRegist('isExistMobile.json', '抱歉！该手机号码已经被注册!', { mobile: mobile });
                        }
                    }
                    }
                    value={this.state.mobile}
                    style={[styles.textInput, { fontSize: 15 }]}
                    maxLength={11}
                    placeholder={'手机号码'} />
                <Text style={{ color: '#ACB3BE', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>| </Text>
                <TouchableOpacity disabled={this.isCanSend ? false : true} style={[styles.verification]} onPress={this._getVerification}>
                    <Text style={[{ alignItems: 'center', justifyContent: 'center', fontSize: 15 }, this.veriTextColor]}>{this.state.message}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    _renderCheckCode() {
        return (
            <View style={styles.inputView}>
                <TextInputC
                    clearButtonMode='while-editing'
                    keyboardType='numeric'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(checkCode) => {
                        this.setState({
                            checkCode: checkCode,
                            defaultBg: { backgroundColor: '#34457D' },
                            defaultTextBg: { color: '#fff' }
                        })
                    }
                    }
                    value={this.state.checkCode}
                    style={styles.textInput}
                    maxLength={6}
                    placeholder={'验证码'} />
            </View>
        );
    }
    _renderEmail() {
        return (
            <View style={styles.inputView}>
                <TextInputC
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(email) => {
                        this.setState({
                            email: email,
                            defaultBg: { backgroundColor: '#34457D' },
                            defaultTextBg: { color: '#fff' }
                        })
                        if ((ValidateUtil.isEmail(email))) {
                            this._isAlealreadyRegist('isExistEmail.json', '抱歉！该邮箱已经被注册!', { email: email });
                        }
                    }
                    }
                    value={this.state.email}
                    style={styles.textInput}
                    maxLength={20}
                    placeholder={'常用邮箱'} />
            </View>
        );
    }
    _renderCheck() {
        return (
            <View style={styles.check}>
                <TouchableOpacity onPress={this._onCheck}>
                    <CheckBox
                        style={{ width: 14, height: 14, marginRight: 7 }}
                        checked={this.state.isSelect}
                    />
                </TouchableOpacity>
                <Text style={{ fontSize: 12, color: '#53606A' }}>同意</Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => {
                    this.props.navigator.push({
                        component: WebViewPage,
                        params: {
                            title: '注册协议',
                            tintColor: '#000',
                            url: '/app/registerProtocol.jsp'
                        }
                    })
                }}>
                    <Text style={{ fontSize: 12, color: '#34457D' }}>《易淘药服务协议》</Text>
                </TouchableOpacity>
            </View>
        );
    }
    _renderRegist() {
        let disabled;
        let backgroundColor;
        let textColor;
        if (this.isCanTouchRegist()) {
            disabled = false;
            backgroundColor = "#34457D";
            textColor = '#FFFFFF';
        } else {
            disabled = true;
            backgroundColor = '#E0E0E1'
            textColor = '#BFBFBF';
        }
        return (
            <TouchableOpacity
                disabled={disabled}
                style={[styles.regist, this.state.defaultBg, { backgroundColor: backgroundColor }]}
                onPress={this._onRegist}>
                <Text style={[{ fontSize: 16 }, this.state.defaultTextBg, { color: textColor }]}>下一步</Text>
            </TouchableOpacity>
        );
    }

    _rgistSuccess(data) {
        let content = <View style={styles.registSuccess}>
            <Image source={require('../res/Regist/copy.png')} style={{ width: 106, height: 68, marginTop: 35 }} resizeMode='stretch' />
            <View style={[styles.registIconView, { flexDirection: 'column', width: 275 }]}>
                <Text style={{ fontSize: 14, color: '#455A64', textAlign: 'center' }}>恭喜！您的账号已建立，完善资料</Text>
                <Text style={{ fontSize: 14, color: '#455A64', textAlign: 'center', marginTop: 5 }}>并审核通过后，才可正常下单</Text>
            </View>
            <View style={{ width: 231, height: 1, backgroundColor: "#ccc" }}></View>
            <View style={{ flexDirection: 'column', marginTop: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 13, color: '#78909C', marginTop: 10 }}>登录账号  </Text>
                    <Text style={{ fontSize: 13, color: '#78909C', marginTop: 10 }}>{data.loginId}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 13, color: '#78909C', marginTop: 10 }}>手机号码  </Text>
                    <Text style={{ fontSize: 13, color: '#78909C', marginTop: 10 }}>{data.mobile}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.perfect} onPress={this._perfectInfo}>
                <Text style={{ fontSize: 16, color: '#fff' }}>立即完善</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backHome} onPress={this._goHome}>
                <Text style={{ fontSize: 16, color: '#90A4AE' }}>返回首页</Text>
            </TouchableOpacity>
        </View>;
        Alerts.showCustom({
            contentView: content,
        });
    }

    render() {
        return (
            <BaseView
                mainBackColor={{ backgroundColor: '#f5f5f5' }}
                ref={base => this.base = base}
                navigator={this.props.navigator}
                mainColor={'#f5f5f5'}
                titlePosition={'center'}
                title={{ title: '注册', tintColor: '#333', fontSize: 18 }}>
                <KeyboardAwareScrollView style={{ flex: 1 }}>
                    <View style={{ flex: 1, marginHorizontal: 25, flexDirection: 'column' }}>
                        {this._renderAccount()}
                        {this._renderPassword()}
                        {/* {this._renderCompany()} */}
                        {this._renderMobile()}
                        {this._renderCheckCode()}
                        {/* {this._renderEmail()} */}
                        {this._renderCheck()}
                        {this._renderRegist()}
                    </View>
                    <View style={styles.registBottomView}>
                        <Text style={{ fontSize: 12, color: '#53606A', }}>账号注册</Text>
                        <Arrow style={{ height: 25, width: 25, tintColor: '#000' }} />
                        <Text style={{ fontSize: 12, color: '#ACB3BE' }}>基础信息</Text>
                        <Arrow style={{ height: 25, width: 25, tintColor: '#ACB3BE' }} />
                        <Text style={{ fontSize: 12, color: '#ACB3BE' }}>填写资料</Text>
                    </View>
                </KeyboardAwareScrollView>
            </BaseView>
        );
    }
}
class CheckBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: this.props.checked,
        }
    }
    static propTypes = {
        checked: React.PropTypes.bool,
        uncheckedImage: React.PropTypes.number,
        checkedImage: React.PropTypes.number,
    }
    static defaultProps = {
        checked: false,
        uncheckedImage: require('../res/Regist/007gouxuan.png'),
        checkedImage: require('../res/Regist/007gouxuan_s.png'),
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            checked: nextProps.checked,
        });
    }
    render() {
        const source = this.state.checked ? this.props.checkedImage : this.props.uncheckedImage;
        return (
            <Image source={source} style={this.props.style} />
        );
    }
}
