import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    ScrollView
} from 'react-native';
import { BaseView, TextInputC, Alerts, Toast } from 'future/public/widgets';
import styles from '../styles/FillEnterpriseInfos.css';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import dismissKeyboard from 'dismissKeyboard';
import { Fetch } from 'future/public/lib';
import { connect } from 'react-redux';
import ValidateUtil from 'future/public/lib/ValidateUtil';
class FillBankAcountInfo extends Component {
    constructor(props) {
        super(props);
        this.renderRightBtn = this._renderRightBtn.bind(this);
        this.state = {
            bankName: '',
            branchName: '',
            bankAccountNm: '',
            bankAccount: '',
            bankPerfect: '未完善'
        }
        this.full = false;
    }
    componentDidMount() {
        this._initData();
    }

    _isPerfect() {
        if (!ValidateUtil.isNull(this.state.bankName)
            && !ValidateUtil.isNull(this.state.branchName)
            && !ValidateUtil.isNull(this.state.bankAccountNm)
            && !ValidateUtil.isNull(this.state.bankAccount)) {
            this.full = true;
        } else {
            this.full = false;
        }
    }

    _initData() {
        console.log('this.props.params.bank', this.props.params.bank);
        if (this.props.params.bank != undefined) {
            let bank = this.props.params.bank;
            let compayPerfect = '未完善';
            if (bank.perfect && bank.perfect == '已完善') {
                compayPerfect = '已完善'
            }
            this.setState({
                bankName: bank.bankName == undefined ? '' : bank.bankName,
                branchName: bank.branchName == undefined ? '' : bank.branchName,
                bankAccountNm: bank.bankAccountNm == undefined ? '' : bank.bankAccountNm,
                bankAccount: bank.bankAccount == undefined ? '' : bank.bankAccount,
                bankPerfect: compayPerfect,
            })
        }
    }
    _callBackData() {
        if (this.props.params) {
            this.props.params.callback(this.state);
        }
        if (this.props.navigator) {
            this.props.navigator.pop();
        }
    }
    
    //保存银行资料信息
    _saveBankInfos() {
        // if (this.state.bankName.length <= 0) {
        //     Toast.show('请填写银行名称')
        //     return
        // }
        // if (this.state.branchName.length <= 0) {
        //     Toast.show('请填写支行名称')
        //     return
        // }
        // if (this.state.bankAccountNm.length <= 0) {
        //     Toast.show('请填写银行账户')
        //     return
        // }
        // if (this.state.bankAccount.length <= 0) {
        //     Toast.show('请填写银行账号')
        //     return
        // }
        this._isPerfect();
        new Fetch({
            url: 'app/user/saveRegisterFour.json',
            method: 'POST',
            bodyType: 'json',
            data: {
                bankName: this.state.bankName,
                branchName: this.state.branchName,
                bankAccountNm: this.state.bankAccountNm,
                bankAccount: this.state.bankAccount,
                buyersId: this.props.params.buyersId,
            },
        }).dofetch().then((data) => {
            if (data.success) {
                if (this.full) {
                    this.state.bankPerfect = '已完善';
                } else {
                    this.state.bankPerfect = '未完善';
                }
                this._callBackData();
            }
        }).catch((err) => { console.log(err); });
    }
    _renderRightBtn() {
        return (
            <TouchableOpacity
                activeOpacity={0.3}
                onPress={() => {
                    this._saveBankInfos()
                }}
                style={{ justifyContent: 'center', paddingRight: 13, }}
            >
                <Text style={{ color: '#AAAEB9', fontSize: 16, top: 2 }}>保存</Text>
            </TouchableOpacity>
        )
    }
    _clickCallBack() {
        this._isPerfect();
        if (!this.full) {
            this.state.bankPerfect = '未完善';
            this._showAlerts();
        } else {
            this._callBackData();
        }
    }
    _showAlerts() {
        dismissKeyboard();
        let content = <View style={styles.allerts}>
            <View
                style={styles.alertContent}>
                <View style={{
                    flex: 1,
                    width: 270,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: "center",
                    borderBottomWidth: 1,
                    borderColor: '#ccc'
                }}>
                    <Text style={{ fontSize: 17, color: '#333' }}>信息内容尚未完善是否返回</Text>
                </View>
                <View style={styles.alertBott}>
                    <TouchableOpacity
                        style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: "center", borderRightWidth: 1, borderColor: '#ccc' }}
                        onPress={() => { Alerts.hideCustom({ backgroundColor: 'rgba(0,0,0,0.4)' }); }}>
                        <Text style={{ fontSize: 16, color: '#007AFF' }}>手抖点错了</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: "center" }}
                        onPress={() => {
                            Alerts.hideCustom({ backgroundColor: 'rgba(0,0,0,0.4)' });
                            this._callBackData();
                        }}>
                        <Text style={{ fontSize: 16, color: '#007AFF' }}>确定返回</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>;
        Alerts.showCustom({
            contentView: content,
        });
    }

    render() {
        return (
            <BaseView
                leftBtnHandler={() => { this._clickCallBack() }}
                mainBackColor={{ backgroundColor: '#f5f5f5' }}
                ref={'base'}
                navigator={this.props.navigator}
                mainColor={'white'}
                title={{ title: '银行账户', tintColor: '#333', fontSize: 18 }}
                statusBarStyle={'default'}
                rightButton={this.renderRightBtn()}
            >
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps={'never'}
                    style={{ flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={styles.contentItem}>
                            <View style={styles.titleItem}>
                                <Text style={styles.titleTxt}>开户银行</Text>
                            </View>
                            <TextInputC
                                value={this.state.bankName}
                                onChangeText={(value) => {
                                    this.setState({
                                        bankName: value
                                    })
                                }}
                                maxLength={30}
                                clearButtonMode='while-editing'
                                style={styles.input}
                                placeholder={'用于易淘药结算的银行账号'} />
                        </View>
                        <View style={styles.splitLine} />

                        <View style={styles.contentItem}>
                            <View style={styles.titleItem}>
                                <Text style={styles.titleTxt}>银行账号</Text>
                            </View>
                            <TextInputC
                                value={this.state.bankAccount}
                                keyboardType={'numeric'}
                                onChangeText={(value) => {
                                    this.setState({
                                        bankAccount: value
                                    })
                                }}
                                maxLength={30}
                                clearButtonMode='while-editing'
                                style={styles.input}
                                placeholder={'请输入开户账号'} />
                        </View>
                        <View style={styles.splitLine} />

                        <View style={styles.contentItem}>
                            <View style={styles.titleItem}>
                                <Text style={styles.titleTxt}>银行账户</Text>
                            </View>
                            <TextInputC
                                value={this.state.bankAccountNm}
                                onChangeText={(value) => {
                                    this.setState({
                                        bankAccountNm: value
                                    })
                                }}
                                maxLength={30}
                                clearButtonMode='while-editing'
                                style={styles.input}
                                placeholder={'输入银行开户人名称'} />
                        </View>
                        <View style={styles.splitLine} />

                        <View style={styles.contentItem}>
                            <View style={styles.titleItem}>
                                <Text style={styles.titleTxt}>支行名称</Text>
                            </View>
                            <TextInputC
                                value={this.state.branchName}
                                onChangeText={(value) => {
                                    this.setState({
                                        branchName: value
                                    })
                                }}
                                maxLength={30}
                                clearButtonMode='while-editing'
                                style={styles.input}
                                placeholder={'请输入支行名称'} />
                        </View>
                        <View style={styles.splitLine} />
                    </View>
                </KeyboardAwareScrollView>
            </BaseView>
        )
    }
}

//获取数据在下面添加
function mapStateToProps(state) {
    return {
        userInfo: state.Member.userInfo,
        isLogin: state.Member.isLogin,
    };
}

export default connect(mapStateToProps)(FillBankAcountInfo);
