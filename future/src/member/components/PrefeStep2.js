import React, { Component } from 'react';
import {
    Text,
    Image,
    TouchableOpacity,
    View,
    TextInput,
    ScrollView,
    Platform
} from 'react-native';
import Fetch from 'future/public/lib/Fetch';
import {
    BaseView,
    Toast,
    TextInputC,
    Arrow
} from 'future/public/widgets';
import styles from '../styles/PerfectInformation';
import ValidateUtil from 'future/public/lib/ValidateUtil';;
import Chrosslocation from '@imall-test/react-native-chrosslocation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import dismissKeyboard from 'dismissKeyboard';
import md5 from 'md5';
import PrefeStep3 from './PrefeStep3';
export default class PrefeStep2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyCeo: '',// 联系人
            ceoMobile: '', // 联系人手机
            ceoEmail: '',// 联系人邮箱
            ceoTel: '',// 联系人固话
            ceoFax: '',// 联系人传真号
            ceoZipcode: '', // 联系人邮编
            ceoZoneId: '', // 联系人地区
            ceoAddr: '', // 联系人地址
        }
        this.ceoZoneIdStr = '';
        this._openStep3 = this._openStep3.bind(this);
        this._onCeoZoneIdPress = this._onCeoZoneIdPress.bind(this);
        this.defaultBg = { backgroundColor: '#E0E0E1' };
        this.defaultTextBg = { color: '#BFBFBF' };
        this.inpoutConut = 0;
        this.beforeDatas = null;
    }
    componentDidMount() {
        this.beforeDatas = this.props.params.beforeDatas;
        if (this.beforeDatas != null) {
            this.setState({
                companyCeo: this.beforeDatas.companyCeo == null ? '' : this.beforeDatas.companyCeo,// 联系人
                ceoMobile: this.beforeDatas.ceoMobile == null ? '' : this.beforeDatas.ceoMobile, // 联系人手机
                ceoEmail: this.beforeDatas.ceoEmail == null ? '' : this.beforeDatas.ceoEmail,// 联系人邮箱
                ceoTel: this.beforeDatas.ceoTel == null ? '' : this.beforeDatas.ceoTel,// 联系人固话
                ceoFax: this.beforeDatas.ceoFax == null ? '' : this.beforeDatas.ceoFax,// 联系人传真号
                ceoZipcode: this.beforeDatas.ceoZipcode == null ? '' : this.beforeDatas.ceoZipcode, // 联系人邮编
                ceoZoneId: this.beforeDatas.ceoZoneId == null ? '' : this.beforeDatas.ceoZoneId, // 联系人地区
                ceoAddr: this.beforeDatas.ceoAddr == null ? '' : this.beforeDatas.ceoAddr, // 联系人地址
            });
        }
    }
    _onCeoZoneIdPress() {
        Chrosslocation.sethost("http://eyb2b.imall.com.cn");
        Chrosslocation.show({
            areaCode: null,
            color: "#3484df",
            block: (areaCode, addressString) => {
                if (!ValidateUtil.isBlank(areaCode) && !ValidateUtil.isBlank(addressString)) {
                    if (Platform.OS == 'ios') {
                        let end = addressString.indexOf(" ");
                        let address = addressString.substring(0, end) + '省' + addressString.substring(end, addressString.length);
                        this.ceoZoneIdStr = address.trim().replace(/\s/g, "-");
                    } else {
                        this.ceoZoneIdStr = addressString;
                    }
                    this.setState({
                        ceoZoneId: areaCode,
                    })
                }
            }
        });
    }

    checkValidity() {
        let companyCeo = this.state.companyCeo;
        let ceoMobile = this.state.ceoMobile;
        let ceoEmail = this.state.ceoEmail;
        let ceoTel = this.state.ceoTel;
        let ceoFax = this.state.ceoFax;
        let ceoZipcode = this.state.ceoZipcode;
        let ceoZoneId = this.state.ceoZoneId;
        let ceoAddr = this.state.ceoAddr;
        return (
            !ValidateUtil.isBlank(companyCeo) &&
            !ValidateUtil.isBlank(ceoMobile) &&
            !ValidateUtil.isBlank(ceoEmail) &&
            !ValidateUtil.isBlank(ceoTel) &&
            !ValidateUtil.isBlank(ceoFax) &&
            !ValidateUtil.isBlank(ceoZipcode) &&
            !ValidateUtil.isBlank(ceoZoneId) &&
            !ValidateUtil.isBlank(ceoAddr)
        );
    }

    _changerBg() {
        this.defaultBg = { backgroundColor: '#34457D' };
        this.defaultTextBg = { color: '#fff' };
    }
    _openStep3() {
        if (ValidateUtil.isNull(this.state.companyCeo)) {
            Toast.show('请输入注册联系人!');
            return;
        }
        if (ValidateUtil.isNull(this.state.ceoMobile)) {
            Toast.show('请输入注册人手机!');
            return;
        } else {
            if (!(ValidateUtil.isPhone(this.state.ceoMobile))) {
                Toast.show('请输入正确的手机号码!');
                return;
            }
        }

        if (ValidateUtil.isNull(this.state.ceoEmail)) {
            Toast.show('请输入注册人邮箱!');
            return;
        } else {
            if (!ValidateUtil.isEmail(this.state.ceoEmail)) {
                Toast.show('请输入正确的邮箱!');
                return;
            }
        }

        if (ValidateUtil.isNull(this.state.ceoTel)) {
            Toast.show('请输入注册人固话!');
            return;
        }
        if (ValidateUtil.isNull(this.state.ceoFax)) {
            Toast.show('请输入注册人传真!');
            return;
        }
        if (ValidateUtil.isNull(this.state.ceoZipcode)) {
            Toast.show('请输入注册人邮编!');
            return;
        }
        if (ValidateUtil.isNull(this.state.ceoZoneId)) {
            Toast.show('请选择所在地区!');
            return;
        }
        if (ValidateUtil.isNull(this.state.ceoAddr)) {
            Toast.show('请输入详细地址!');
            return;
        }

        dismissKeyboard();
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                component: PrefeStep3,
                params: {
                    user: this.props.params.user,
                    ceo: this.state,
                    beforeDatas: this.beforeDatas
                }
            })
        }
    }
    _renderCompanyCeo() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>注册联系人</Text>
                <TextInputC
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(companyCeo) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            companyCeo: companyCeo,
                        })
                    }
                    }
                    value={this.state.companyCeo}
                    style={styles.textInput}
                    maxLength={20} />
            </View>
        );
    }
    _renderCeoMobile() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>注册人手机</Text>
                <TextInputC
                    keyboardType='numeric'
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(ceoMobile) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            ceoMobile: ceoMobile,
                        })
                    }
                    }
                    value={this.state.ceoMobile}
                    style={styles.textInput}
                    maxLength={20} />
            </View>
        );
    }

    _renderCeoEmail() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>注册人邮箱</Text>
                <TextInputC
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(ceoEmail) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            ceoEmail: ceoEmail,
                        })
                    }
                    }
                    value={this.state.ceoEmail}
                    style={styles.textInput}
                    maxLength={20} />
            </View>
        );
    }

    _renderCeoTel() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>注册人固话</Text>
                <TextInputC
                    keyboardType='numeric'
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(ceoTel) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            ceoTel: ceoTel,
                        })
                    }
                    }
                    value={this.state.ceoTel}
                    style={styles.textInput}
                    maxLength={20} />
            </View>
        );
    }

    _renderCeoFax() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>注册人传真</Text>
                <TextInputC
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(ceoFax) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            ceoFax: ceoFax,
                        })
                    }
                    }
                    value={this.state.ceoFax}
                    style={styles.textInput}
                    maxLength={20} />
            </View>
        );
    }

    _renderCeoZipcode() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>注册人邮编</Text>
                <TextInputC
                    keyboardType='numeric'
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(ceoZipcode) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            ceoZipcode: ceoZipcode,
                        })
                    }
                    }
                    value={this.state.ceoZipcode}
                    style={styles.textInput}
                    maxLength={20} />
            </View>
        );
    }


    _rendeCeoZoneId() {
        return (
            <TouchableOpacity onPress={this._onCeoZoneIdPress}>
                <View style={styles.rentZone}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 20 }}>所在地区</Text>
                        <Text style={{ flex:1,color: "#0C1828", fontSize: 15 }} numberOfLines={1}>{this.ceoZoneIdStr}</Text>
                    </View>
                    <Image source={require('../res/RerfectInformation/000youjiantou.png')} style={{ width: 6, height: 11 }} resizeMode='stretch' />
                </View>
            </TouchableOpacity>
        );
    }


    _rendeCeoAddr() {
        return (
            <View style={styles.regAddr}>
                <TextInput
                    autoFocus={false}
                    autoCorrect={false}
                    multiline={true}
                    autoCapitalize='none'
                    autoCorrect={true}
                    underlineColorAndroid='transparent'
                    onChangeText={(ceoAddr) => {
                        {/*this._changerBg();*/ }
                        this.inpoutConut = ceoAddr.length;
                        this.setState({
                            ceoAddr: ceoAddr
                        })
                    }
                    }
                    value={this.state.ceoAddr}
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
                    <View style={styles.lineItem} />
                    <View style={styles.lineItem} />
                    <View style={styles.lineItem} />
                    <View style={styles.lineItem} />
                </View>
                <KeyboardAwareScrollView style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={styles.marTop}></View>
                    {this._renderCompanyCeo()}
                    {this._renderCeoMobile()}
                    {this._renderCeoEmail()}
                    {this._renderCeoTel()}
                    {this._renderCeoFax()}
                    {this._renderCeoZipcode()}
                    {this._rendeCeoZoneId()}
                    {this._rendeCeoAddr()}
                </KeyboardAwareScrollView>
                <TouchableOpacity
                    style={[styles.buttomView, this.defaultBg]}
                    onPress={this._openStep3}
                    disabled={this.checkValidity() ? false : true}
                >
                    <Text style={[{ fontSize: 16 }, this.defaultTextBg]}>下一步(2/6)</Text>
                </TouchableOpacity>
            </BaseView>
        );
    }
}