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
import ValidateUtil from 'future/public/lib/ValidateUtil';
import styles from '../styles/FillEnterpriseInfos.css';
import dismissKeyboard from 'dismissKeyboard';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Fetch } from 'future/public/lib';
export default class FillInvoiceInfos extends Component {
    constructor(props) {
        super(props);
        this.renderRightBtn = this._renderRightBtn.bind(this);
        this.state = {
            isNormal: true,
            invoiceType: '0',                           //单位名称
            invoiceTitle: '',                         //发票抬头
            taxNum: '',                               //税号
            invoiceAddress: '',                       //发票地址
            invoicePhone: '',                         //发票电话
            invoiceBankCode: null,                    //银行账号
            invoiceBank: null,                         //开户银行
            invoicePerfect: '未完善',//发票信息是否完善
        }
    }
    componentDidMount() {
        this._initData();
    }

    _initData() {
        if (this.props.params.invoice != undefined) {
            let invoice = this.props.params.invoice;
            console.log('invoice', invoice);
            let compayPerfect = '未完善';
            if (invoice.perfect && invoice.perfect == '已完善') {
                compayPerfect = '已完善'
            }else{
                compayPerfect = '未完善';
            }
            let isNormal = true;
            if (invoice.invoiceType == '0') {
                isNormal = true;
            } else {
                isNormal = false;
            }
            this.setState({
                invoiceTitle: invoice.invoiceTitle == undefined ? '' : invoice.invoiceTitle,
                taxNum: invoice.taxNum == undefined ? '' : invoice.invoiceTitle,
                invoiceAddress: invoice.invoiceAddress == undefined ? '' : invoice.invoiceAddress,
                invoicePhone: invoice.invoicePhone == undefined ? '' : invoice.invoicePhone,
                invoiceBankCode: invoice.invoiceBankCode == undefined ? '' : invoice.invoiceBankCode,
                invoiceBank: invoice.invoiceBank == undefined ? '' : invoice.invoiceBank,
                invoiceType: invoice.invoiceType == undefined ? '0' : invoice.invoiceType,
                isNormal: isNormal,
                invoicePerfect: compayPerfect,
            });
        }
    }
    _isEmp(data) {
		if (ValidateUtil.isNull(data)) {
			return true;
		} else {
			return false;
		}
    }
    _isPerfect() {
        if (!this._isEmp(this.state.invoiceAddress)
            && !this._isEmp(this.state.invoicePhone)
            && !this._isEmp(this.state.invoiceTitle)
            && !this._isEmp(this.state.taxNum)) {
            if (this.state.invoiceType && this.state.invoiceType == '0') {
                this.full = true;
            } else {
                if (!this._isEmp(this.state.invoiceBank)
                    && !this._isEmp(this.state.invoiceBankCode)) {
                        this.full = true;
                } else {
                    this.full = false;
                }
            }
        } else {
            this.full = false;
        }
    }

    _clickCallBack() {
        this._isPerfect();
        if (!this.full) {
            this.state.invoicePerfect = '未完善';
            this._showAlerts();
        } else {
            this._callBackData();
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

    //保存发票信息
    _saveInvoiceInfos() {
        // if(ValidateUtil.isNull(this.state.invoiceTitle)){
        //     Toast.show('请填写发票抬头');
        //     return;
        // }
        // if(ValidateUtil.isNull(this.state.taxNum)){
        //     Toast.show('请填写税号');
        //     return;
        // }
        // if(ValidateUtil.isNull(this.state.invoiceAddress)){
        //     Toast.show('请填写发票地址');
        //     return;
        // }
        // if(ValidateUtil.isNull(this.state.invoicePhone)){
        //     Toast.show('请填写发票电话');
        //     return;
        // }
        this._isPerfect();
        if (this.state.isNormal == true) {
            this.state.invoiceType = '0';
        } else {
            this.state.invoiceType = '1';
        }
        new Fetch({
            url: 'app/user/saveRegisterFives.json',
            method: 'POST',
            bodyType: 'json',
            data: {
                invoiceType: this.state.invoiceType,
                invoiceTitle: this.state.invoiceTitle,
                taxNum: this.state.taxNum,
                invoiceAddress: this.state.invoiceAddress,
                invoicePhone: this.state.invoicePhone,
                buyersId: this.props.params.buyersId,
                invoiceBankCode: this.state.invoiceBankCode,
                invoiceBank: this.state.invoiceBank
            },
        }).dofetch().then((data) => {
            if (data.success) {
                if (this.full) {
                    this.state.invoicePerfect = '已完善';
                } else {
                    this.state.invoicePerfect = '未完善';
                }
                this._callBackData();
            }
        }).catch((err) => { console.log(err); });
    }
    //导航条右部按钮
    _renderRightBtn() {
        return (
            <TouchableOpacity
                activeOpacity={0.3}
                onPress={() => {
                    this._saveInvoiceInfos();
                }}
                style={{ justifyContent: 'center', paddingRight: 13, }}
            >
                <Text style={{ color: '#AAAEB9', fontSize: 16, top: 2 }}>保存</Text>
            </TouchableOpacity>
        )
    }

    _clickCallBack() {
        if (this.state.invoicePerfect != '已完善') {
            this._showAlerts();
        } else {
            if (this.props.navigator) {
                this.props.navigator.pop();
            }
        }
    }
    //返回提示
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
                title={{ title: '发票信息', tintColor: '#333', fontSize: 18 }}
                statusBarStyle={'default'}
                rightButton={this.renderRightBtn()}
            >
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps={'never'}
                    style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', width: SCREENWIDTH }}>
                        <TouchableOpacity style={{ height: 55, width: SCREENWIDTH / 2, flexDirection: 'row', alignItems: 'center' }}
                            onPress={() => {
                                this.setState({
                                    isNormal: true
                                })
                            }}
                        >
                            <Image
                                style={{ marginLeft: 13, width: 19, height: 19 }}
                                source={!this.state.isNormal ? require('../res/FillInfosAssets/a006gouxuan.png') :
                                    require('../res/FillInfosAssets/已勾选.png')} />
                            <Text style={{ color: this.state.isNormal ? '#0082FF' : '#4B5963', fontSize: 14, marginLeft: 5 }}>普通增值税发票</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ height: 55, width: SCREENWIDTH / 2, flexDirection: 'row', alignItems: 'center' }}
                            onPress={() => {
                                this.setState({
                                    isNormal: false
                                })
                            }}
                        >
                            <Image
                                style={{ width: 19, height: 19 }}
                                source={this.state.isNormal ? require('../res/FillInfosAssets/a006gouxuan.png') :
                                    require('../res/FillInfosAssets/已勾选.png')} />
                            <Text style={{ color: this.state.isNormal ? '#4B5963' : '#0082FF', fontSize: 14, marginLeft: 5 }}>专用增值税发票</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentItem}>
                        <View style={styles.titleItem}>
                            <Text style={styles.titleTxt}>发票抬头</Text>
                        </View>
                        <TextInputC
                            value={this.state.invoiceTitle}
                            onChangeText={(value) => {
                                this.setState({
                                    invoiceTitle: value
                                })
                            }}
                            maxLength={30}
                            clearButtonMode='while-editing'
                            style={styles.input} />
                    </View>
                    <View style={styles.splitLine} />
                    <View style={styles.contentItem}>
                        <View style={styles.titleItem}>
                            <Text style={styles.titleTxt}>税号</Text>
                        </View>
                        <TextInputC
                            value={this.state.taxNum}
                            onChangeText={(value) => {
                                this.setState({
                                    taxNum: value
                                })
                            }}
                            keyboardType={'numeric'}
                            maxLength={30}
                            clearButtonMode='while-editing'
                            style={styles.input} />
                    </View>
                    <View style={styles.splitLine} />

                    <View style={styles.contentItem}>
                        <View style={styles.titleItem}>
                            <Text style={styles.titleTxt}>地址</Text>
                        </View>
                        <TextInputC
                            value={this.state.invoiceAddress}
                            onChangeText={(value) => {
                                this.setState({
                                    invoiceAddress: value
                                })
                            }}
                            maxLength={50}
                            clearButtonMode='while-editing'
                            style={styles.input} />
                    </View>
                    <View style={styles.splitLine} />

                    <View style={styles.contentItem}>
                        <View style={styles.titleItem}>
                            <Text style={styles.titleTxt}>电话</Text>
                        </View>
                        <TextInputC
                            value={this.state.invoicePhone}
                            onChangeText={(value) => {
                                this.setState({
                                    invoicePhone: value
                                })
                            }}
                            maxLength={11}
                            keyboardType={'numeric'}
                            clearButtonMode='while-editing'
                            style={styles.input} />
                    </View>
                    <View style={styles.splitLine} />

                    {!this.state.isNormal && <View>

                        <View style={styles.contentItem}>
                            <View style={styles.titleItem}>
                                <Text style={styles.titleTxt}>开户银行</Text>
                            </View>
                            <TextInputC
                                value={this.state.invoiceBank}
                                onChangeText={(value) => {
                                    this.setState({
                                        invoiceBank: value
                                    })
                                }}
                                maxLength={30}
                                clearButtonMode='while-editing'
                                style={styles.input} />
                        </View>
                        <View style={styles.splitLine} />

                        <View style={styles.contentItem}>
                            <View style={styles.titleItem}>
                                <Text style={styles.titleTxt}>银行账号</Text>
                            </View>
                            <TextInputC
                                value={this.state.invoiceBankCode}
                                onChangeText={(value) => {
                                    this.setState({
                                        invoiceBankCode: value
                                    })
                                }}
                                keyboardType={'numeric'}
                                maxLength={30}
                                clearButtonMode='while-editing'
                                style={styles.input} />
                        </View>
                        <View style={styles.splitLine} />

                    </View>}

                </KeyboardAwareScrollView>
            </BaseView>
        )
    }
}
