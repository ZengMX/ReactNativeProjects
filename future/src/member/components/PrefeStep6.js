import React, { Component } from 'react';
import {
    Text,
    Image,
    TouchableOpacity,
    View,
    TextInput,
    ScrollView
} from 'react-native';
import Fetch from 'future/public/lib/Fetch';
import {
    BaseView,
    Toast,
    Alerts,
    TextInputC,
} from 'future/public/widgets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../styles/PerfectInformation';
import ValidateUtil from 'future/public/lib/ValidateUtil';;
import dismissKeyboard from 'dismissKeyboard';
import md5 from 'md5';
import PrefeStepComplete from './PrefeStepComplete';
export default class PrefeStep6 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invoiceHeard: '',  // 发票抬头
            invoiceType: '0',  // 发票类型
            invoicePhone: '',  // 发票电话
            invoiceAddr: '',  // 发票地址
            bankId: '',  // 银行账号
            bankNm: '',  // 开户银行
            ratepayingId: '',  // 纳税编号
        }
        this._openPrefeStepComplete = this._openPrefeStepComplete.bind(this);
        this._onInvoiceType = this._onInvoiceType.bind(this);
        this._submit = this._submit.bind(this)
        this.defaultBg = { backgroundColor: '#E0E0E1' };
        this.defaultTextBg = { color: '#BFBFBF' };

        this.invoiceTypeDefBg = { borderColor: '#FF6600' };
        this.invoiceTypeDefTextBg = { color: '#FF6600' };

        this.invoiceTypeBg = { borderColor: '#8E939A' };
        this.invoiceTypeTextBg = { color: '#333333' };

        this.inpoutConut = 0;
        this.beforeDatas = null;
    }
    componentDidMount() {
        this.beforeDatas = this.props.params.beforeDatas;
        if (this.beforeDatas != null) {
            this.setState({
                invoiceHeard: this.beforeDatas.invoiceHeard == null ? '' : this.beforeDatas.invoiceHeard,// 发票抬头
                invoiceType: this.beforeDatas.invoiceType == null ? '0' : this.beforeDatas.invoiceType, // 发票类型
                invoicePhone: this.beforeDatas.invoicePhone == null ? '' : this.beforeDatas.invoicePhone,// 发票电话
                invoiceAddr: this.beforeDatas.invoiceHeard == null ? '' : this.beforeDatas.invoiceAddr,// 发票地址
                bankId: this.beforeDatas.invoiceType == null ? '' : this.beforeDatas.bankId,  // 银行账号
                bankNm: this.beforeDatas.bankNm == null ? '' : this.beforeDatas.bankNm,// 开户银行
                ratepayingId: this.beforeDatas.ratepayingId == null ? '' : this.beforeDatas.ratepayingId,// 纳税编号
            });
            this._onInvoiceType(this.state.invoiceType);
        }
    }
    _changerInvoBg(type) {
        if (type == '0') {
            this.invoiceTypeDefBg = { borderColor: '#FF6600' };
            this.invoiceTypeDefTextBg = { color: '#FF6600' };
            this.invoiceTypeBg = { borderColor: '#8E939A' };
            this.invoiceTypeTextBg = { color: '#333333' };
        } else if (type == '1') {
            this.invoiceTypeDefBg = { borderColor: '#8E939A' };
            this.invoiceTypeDefTextBg = { color: '#333333' };
            this.invoiceTypeBg = { borderColor: '#FF6600' };
            this.invoiceTypeTextBg = { color: '#FF6600' };
        }
    }
    _onInvoiceType(type) {
        this._changerInvoBg(type);
        this.setState({
            invoiceType: type
        });
    }

    checkValidity() {
        return (
            !ValidateUtil.isBlank(this.state.invoiceHeard) &&
            !ValidateUtil.isBlank(this.state.invoiceAddr) &&
            !ValidateUtil.isBlank(this.state.invoicePhone) &&
            !ValidateUtil.isBlank(this.state.bankId) &&
            !ValidateUtil.isBlank(this.state.bankNm) &&
            !ValidateUtil.isBlank(this.state.ratepayingId)
        );
    }

    _submit() {
        if (ValidateUtil.isNull(this.state.invoiceHeard)) {
            Toast.show('请输入发票抬头!');
            return;
        }
        if (ValidateUtil.isNull(this.state.invoiceAddr)) {
            Toast.show('请输入开票地址!');
            return;
        }
        if (ValidateUtil.isNull(this.state.invoicePhone)) {
            Toast.show('请输入开票电话!');
            return;
        } else {
            if (!(ValidateUtil.isPhone(this.state.invoicePhone))) {
                Toast.show('请输入正确开票电话!');
                return;
            }
        }
        if (ValidateUtil.isNull(this.state.bankId)) {
            Toast.show('请输入银行账号!');
            return;
        } else {
            if(!(ValidateUtil.isBankCart(this.state.bankId))){
                Toast.show('请输入正确的银行账号!');
                return;
            }
        }
        if (ValidateUtil.isNull(this.state.bankNm)) {
            Toast.show('请输入开户银行!');
            return;
        }
        if (ValidateUtil.isNull(this.state.ratepayingId)) {
            Toast.show('请输入纳税编号!');
            return;
        }

        let datas = {};
        Object.assign(datas, this.state, this.props.params.customer, this.props.params.receive, this.props.params.buy, this.props.params.ceo, this.props.params.user);
        console.log('saveRegisterInfo Fetch datas:', datas);
        new Fetch({
            url: 'app/user/saveRegisterInfo.json',
            bodyType: 'json',
            data: datas
        }).dofetch().then((data) => {
            if (data.success) {
                this._openPrefeStepComplete();
            }
        }).catch((error) => { console.info('error', error) });

    }



    _changerBg() {
        this.defaultBg = { backgroundColor: '#34457D' };
        this.defaultTextBg = { color: '#fff' };
    }
    _openPrefeStepComplete() {
        dismissKeyboard();
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                component: PrefeStepComplete,
                params: {
                }
            })
        }
    }
    _renderInvoiceHeard() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>发票抬头</Text>
                <TextInputC
                    placeholder={'汇药网'}
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(invoiceHeard) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            invoiceHeard: invoiceHeard,
                        })
                    }
                    }
                    value={this.state.invoiceHeard}
                    style={styles.step6input}
                    maxLength={20} />
            </View>
        );
    }
    _renderInvoiceAddr() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>开票地址</Text>
                <TextInputC
                    placeholder={'开票地址'}
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(invoiceAddr) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            invoiceAddr: invoiceAddr,
                        })
                    }
                    }
                    value={this.state.invoiceAddr}
                    style={styles.step6input}
                    maxLength={20} />
            </View>
        );
    }

    _renderInvoicePhone() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>开票电话</Text>
                <TextInputC
                    keyboardType='numeric'
                    placeholder={'开票电话'}
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(invoicePhone) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            invoicePhone: invoicePhone,
                        })
                    }
                    }
                    value={this.state.invoicePhone}
                    style={styles.step6input}
                    maxLength={20} />
            </View>
        );
    }
    _renderInvoiceType() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>发票类型</Text>
                <TouchableOpacity style={[styles.invoiceType, this.invoiceTypeDefBg]} onPress={() => { this._onInvoiceType('0') }}>
                    <Text style={[{ fontSize: 13 }, this.invoiceTypeDefTextBg]}>普通发票</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.invoiceType, { marginLeft: 10 }, this.invoiceTypeBg]} onPress={() => { this._onInvoiceType('1') }}>
                    <Text style={[{ fontSize: 13 }, this.invoiceTypeTextBg]}>增值税发票</Text>
                </TouchableOpacity>
            </View>
        );
    }
    _renderBankNm() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>银行账号</Text>
                <TextInputC
                    keyboardType='numeric'
                    valueType={'bank-card'}
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(bankId) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            bankId: bankId,
                        })
                    }
                    }
                    value={this.state.bankId}
                    style={styles.step6input}
                    maxLength={20} />
            </View>
        );
    }
    _renderBankId() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>开户银行</Text>
                <TextInputC
                    placeholder={'中国银行'}
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(bankNm) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            bankNm: bankNm,
                        })
                    }
                    }
                    value={this.state.bankNm}
                    style={styles.step6input}
                    maxLength={20} />
            </View>
        );
    }
    _renderRatepayingId() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>纳税编号</Text>
                <TextInputC
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(ratepayingId) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            ratepayingId: ratepayingId,
                        })
                    }
                    }
                    value={this.state.ratepayingId}
                    style={styles.step6input}
                    maxLength={20} />
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
            <BaseView
                mainBackColor={{ backgroundColor: '#f4f3f3' }}
                ref={base => this.base = base}
                navigator={this.props.navigator}
                mainColor={'#f5f5f5'}
                titlePosition={'center'}
                title={{ title: '完善资料', tintColor: '#333', fontSize: 18 }}>
                <View style={styles.lineView}>
                    <View style={[styles.lineItem, { backgroundColor: '#34457D' }]} />
                    <View style={[styles.lineItem, { backgroundColor: '#34457D' }]} />
                    <View style={[styles.lineItem, { backgroundColor: '#34457D' }]} />
                    <View style={[styles.lineItem, { backgroundColor: '#34457D' }]} />
                    <View style={[styles.lineItem, { backgroundColor: '#34457D' }]} />
                    <View style={[styles.lineItem, { backgroundColor: '#34457D' }]} />
                </View>
                <KeyboardAwareScrollView style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={styles.marTop}></View>
                    {this._renderInvoiceHeard()}
                    {this._renderInvoiceAddr()}
                    {this._renderInvoicePhone()}
                    {this._renderInvoiceType()}
                    {this._renderBankNm()}
                    {this._renderBankId()}
                    {this._renderRatepayingId()}
                </KeyboardAwareScrollView>
                <TouchableOpacity
                    style={[styles.buttomView, this.defaultBg]}
                    onPress={this._submit}
                    disabled={this.checkValidity() ? false : true}
                >
                    <Text style={[{ fontSize: 16 }, this.defaultTextBg]}>提交资料(6/6)</Text>
                </TouchableOpacity>
            </BaseView>
        );
    }
}