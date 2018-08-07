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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../styles/PerfectInformation';
import ValidateUtil from 'future/public/lib/ValidateUtil';;
import Chrosslocation from '@imall-test/react-native-chrosslocation';
import dismissKeyboard from 'dismissKeyboard';
import md5 from 'md5';
import PrefeStep5 from './PrefeStep5';
export default class PrefeStep4 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //收货负责人信息
            receiveManagerNm: '', // 收货负责人
            receiveManagerMobile: '', // 收货负责人手机
            receiveManagerEmail: '', // 收货负责人邮箱
            receiveManagerTel: '', // 收货负责人固话
            receiveManagerFax: '', // 收货负责人传真号
            receiveManagerZipcode: '', // 收货负责人邮编
            receiveManagerZoneId: '', // 收货负责人地区
            receiveManagerAddr: '', // 收货负责人地址
        }
        this.ceoZoneIdStr = '';
        this._openStep5 = this._openStep5.bind(this);
        this._onReceiveManagerZoneIdPress = this._onReceiveManagerZoneIdPress.bind(this);
        this.defaultBg = { backgroundColor: '#E0E0E1' };
        this.defaultTextBg = { color: '#BFBFBF' };
        this.inpoutConut = 0;
        this.beforeDatas = null;
    }
    componentDidMount() {
        this.beforeDatas = this.props.params.beforeDatas;
        if (this.beforeDatas != null) {
            this.setState({
                receiveManagerNm: this.beforeDatas.receiveManagerNm == null ? '' : this.beforeDatas.receiveManagerNm,// 采购负责人
                receiveManagerMobile: this.beforeDatas.receiveManagerMobile == null ? '' : this.beforeDatas.receiveManagerMobile, // 采购负责人手机
                receiveManagerEmail: this.beforeDatas.receiveManagerEmail == null ? '' : this.beforeDatas.receiveManagerEmail,// 采购负责人邮箱
                receiveManagerTel: this.beforeDatas.receiveManagerTel == null ? '' : this.beforeDatas.receiveManagerTel,// 采购负责人固话
                receiveManagerFax: this.beforeDatas.receiveManagerFax == null ? '' : this.beforeDatas.receiveManagerFax,// 采购负责人传真号
                receiveManagerZipcode: this.beforeDatas.receiveManagerZipcode == null ? '' : this.beforeDatas.receiveManagerZipcode, // 采购负责人邮编
                receiveManagerZoneId: this.beforeDatas.receiveManagerZoneId == null ? '' : this.beforeDatas.receiveManagerZoneId,// 采购负责人地区
                receiveManagerAddr: this.beforeDatas.receiveManagerAddr == null ? '' : this.beforeDatas.receiveManagerAddr,// 采购负责人地址
            });
        }
    }
    _onReceiveManagerZoneIdPress() {
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
                        receiveManagerZoneId: areaCode,
                    })
                }
            }
        });
    }
    checkValidity() {
        return (
            !ValidateUtil.isBlank(this.state.receiveManagerNm) &&
            !ValidateUtil.isBlank(this.state.receiveManagerMobile) &&
            !ValidateUtil.isBlank(this.state.receiveManagerEmail) &&
            !ValidateUtil.isBlank(this.state.receiveManagerTel) &&
            !ValidateUtil.isBlank(this.state.receiveManagerFax) &&
            !ValidateUtil.isBlank(this.state.receiveManagerZipcode) &&
            !ValidateUtil.isBlank(this.state.receiveManagerZoneId) &&
            !ValidateUtil.isBlank(this.state.receiveManagerAddr)
        );
    }


    _changerBg() {
        this.defaultBg = { backgroundColor: '#34457D' };
        this.defaultTextBg = { color: '#fff' };
    }
    _openStep5() {

        if (ValidateUtil.isNull(this.state.receiveManagerNm)) {
            Toast.show('请输入收货负责人!');
            return;
        }
        if (ValidateUtil.isNull(this.state.receiveManagerMobile)) {
            Toast.show('请输入收货负责人手机!');
            return;
        } else {
            if (!(ValidateUtil.isPhone(this.state.receiveManagerMobile))) {
                Toast.show('请输入正确的收货负责人手机号码!');
                return;
            }
        }

        if (ValidateUtil.isNull(this.state.receiveManagerEmail)) {
            Toast.show('请输入收货负责人邮箱!');
            return;
        } else {
            if (!ValidateUtil.isEmail(this.state.receiveManagerEmail)) {
                Toast.show('请输入正确的收货负责人邮箱!');
                return;
            }
        }

        if (ValidateUtil.isNull(this.state.receiveManagerTel)) {
            Toast.show('请输入收货负责人固话!');
            return;
        }
        if (ValidateUtil.isNull(this.state.receiveManagerFax)) {
            Toast.show('请输入收货负责人传真号!');
            return;
        }
        if (ValidateUtil.isNull(this.state.receiveManagerZipcode)) {
            Toast.show('请输入收货负责人邮编!');
            return;
        }
        if (ValidateUtil.isNull(this.state.receiveManagerZoneId)) {
            Toast.show('请选择所在地区!');
            return;
        }
        if (ValidateUtil.isNull(this.state.receiveManagerAddr)) {
            Toast.show('请输入详细地址!');
            return;
        }

        dismissKeyboard();
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                component: PrefeStep5,
                params: {
                    user: this.props.params.user,
                    ceo: this.props.params.ceo,
                    buy: this.props.params.buy,
                    receive: this.state,
                    beforeDatas: this.beforeDatas
                }
            })
        }
    }
    _renderCompanyCeo() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>收货负责人</Text>
                <TextInputC
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(receiveManagerNm) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            receiveManagerNm: receiveManagerNm,
                        })
                    }
                    }
                    value={this.state.receiveManagerNm}
                    style={styles.textInput}
                    maxLength={20} />
            </View>
        );
    }
    _renderCeoMobile() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>收货人手机</Text>
                <TextInputC
                    keyboardType='numeric'
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(receiveManagerMobile) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            receiveManagerMobile: receiveManagerMobile,
                        })
                    }
                    }
                    value={this.state.receiveManagerMobile}
                    style={styles.textInput}
                    maxLength={20} />
            </View>
        );
    }

    _renderCeoEmail() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>收货人邮箱</Text>
                <TextInputC
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(receiveManagerEmail) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            receiveManagerEmail: receiveManagerEmail,
                        })
                    }
                    }
                    value={this.state.receiveManagerEmail}
                    style={styles.textInput}
                    maxLength={20} />
            </View>
        );
    }

    _renderCeoTel() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>收货人固话</Text>
                <TextInputC
                    keyboardType='numeric'
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(receiveManagerTel) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            receiveManagerTel: receiveManagerTel,
                        })
                    }
                    }
                    value={this.state.receiveManagerTel}
                    style={styles.textInput}
                    maxLength={20} />
            </View>
        );
    }

    _renderCeoFax() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>收货人传真</Text>
                <TextInputC
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(receiveManagerFax) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            receiveManagerFax: receiveManagerFax,
                        })
                    }
                    }
                    value={this.state.receiveManagerFax}
                    style={styles.textInput}
                    maxLength={20} />
            </View>
        );
    }

    _renderCeoZipcode() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>收货人邮编</Text>
                <TextInputC
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(receiveManagerZipcode) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            receiveManagerZipcode: receiveManagerZipcode,
                        })
                    }
                    }
                    value={this.state.receiveManagerZipcode}
                    style={styles.textInput}
                    maxLength={20} />
            </View>
        );
    }


    _rendeCeoZoneId() {
        return (
            <TouchableOpacity onPress={this._onReceiveManagerZoneIdPress}>
                <View style={styles.rentZone}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 20 }}>所在地区</Text>
                        <Text style={{flex:1, color: "#0C1828", fontSize: 15 }} numberOfLines={1}>{this.ceoZoneIdStr}</Text>
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
                    onChangeText={(receiveManagerAddr) => {
                        {/*this._changerBg();*/ }
                        this.inpoutConut = receiveManagerAddr.length;
                        this.setState({
                            receiveManagerAddr: receiveManagerAddr
                        })
                    }
                    }
                    value={this.state.receiveManagerAddr}
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
                    <View style={[styles.lineItem, { backgroundColor: '#34457D' }]} />
                    <View style={[styles.lineItem, { backgroundColor: '#34457D' }]} />
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
                    onPress={this._openStep5}
                    disabled={this.checkValidity() ? false : true}
                >
                    <Text style={[{ fontSize: 16 }, this.defaultTextBg]}>下一步(4/6)</Text>
                </TouchableOpacity>
            </BaseView>
        );
    }
}