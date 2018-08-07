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
import PrefeStep4 from './PrefeStep4';
export default class PrefeStep3 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //采购负责人信息
            buyManagerNm: '',// 采购负责人
            buyManagerMobile: '', // 采购负责人手机
            buyManagerEmail: '', // 采购负责人邮箱
            buyManagerTel: '', // 采购负责人固话
            buyManagerFax: '', // 采购负责人传真号
            buyManagerZipcode: '', // 采购负责人邮编
            buyManagerZoneId: '', // 采购负责人地区
            buyManagerAddr: '', // 采购负责人地址
        }
        this.ceoZoneIdStr = '';
        this._openStep4 = this._openStep4.bind(this);
        this._onBuyManagerZoneIdPress = this._onBuyManagerZoneIdPress.bind(this);
        this.defaultBg = { backgroundColor: '#E0E0E1' };
        this.defaultTextBg = { color: '#BFBFBF' };
        this.inpoutConut = 0;
        this.beforeDatas = null;
    }
    componentDidMount() {
        this.beforeDatas = this.props.params.beforeDatas;
        if (this.beforeDatas != null) {
            this.setState({
                buyManagerNm: this.beforeDatas.buyManagerNm == null ? '' : this.beforeDatas.buyManagerNm,// 采购负责人
                buyManagerMobile: this.beforeDatas.buyManagerMobile == null ? '' : this.beforeDatas.buyManagerMobile, // 采购负责人手机
                buyManagerEmail: this.beforeDatas.buyManagerEmail == null ? '' : this.beforeDatas.buyManagerEmail,// 采购负责人邮箱
                buyManagerTel: this.beforeDatas.buyManagerTel == null ? '' : this.beforeDatas.buyManagerTel,// 采购负责人固话
                buyManagerFax: this.beforeDatas.buyManagerFax == null ? '' : this.beforeDatas.buyManagerFax,// 采购负责人传真号
                buyManagerZipcode: this.beforeDatas.buyManagerZipcode == null ? '' : this.beforeDatas.buyManagerZipcode, // 采购负责人邮编
                buyManagerZoneId: this.beforeDatas.buyManagerZoneId == null ? '' : this.beforeDatas.buyManagerZoneId,// 采购负责人地区
                buyManagerAddr: this.beforeDatas.buyManagerAddr == null ? '' : this.beforeDatas.buyManagerAddr,// 采购负责人地址
            });
        }
    }
    _onBuyManagerZoneIdPress() {
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
                        buyManagerZoneId: areaCode,
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
            !ValidateUtil.isBlank(this.state.buyManagerNm) &&
            !ValidateUtil.isBlank(this.state.buyManagerMobile) &&
            !ValidateUtil.isBlank(this.state.buyManagerEmail) &&
            !ValidateUtil.isBlank(this.state.buyManagerTel) &&
            !ValidateUtil.isBlank(this.state.buyManagerFax) &&
            !ValidateUtil.isBlank(this.state.buyManagerZipcode) &&
            !ValidateUtil.isBlank(this.state.buyManagerZoneId) &&
            !ValidateUtil.isBlank(this.state.buyManagerAddr)
        );
    }



    _openStep4() {
        if (ValidateUtil.isNull(this.state.buyManagerNm)) {
            Toast.show('请输入采购负责人!');
            return;
        }
        if (ValidateUtil.isNull(this.state.buyManagerMobile)) {
            Toast.show('请输入采购人手机!');
            return;
        } else {
            if (!(ValidateUtil.isPhone(this.state.buyManagerMobile))) {
                Toast.show('请输入正确的手机号码!');
                return;
            }
        }

        if (ValidateUtil.isNull(this.state.buyManagerEmail)) {
            Toast.show('请输入采购人邮箱!');
            return;
        } else {
            if (!ValidateUtil.isEmail(this.state.buyManagerEmail)) {
                Toast.show('请输入正确的采购人邮箱!');
                return;
            }
        }

        if (ValidateUtil.isNull(this.state.buyManagerTel)) {
            Toast.show('请输入采购人固话!');
            return;
        }
        if (ValidateUtil.isNull(this.state.buyManagerFax)) {
            Toast.show('请输入采购人传真号!');
            return;
        }
        if (ValidateUtil.isNull(this.state.buyManagerZipcode)) {
            Toast.show('请输入采购人邮编!');
            return;
        }
        if (ValidateUtil.isNull(this.state.buyManagerZoneId)) {
            Toast.show('请选择所在地区!');
            return;
        }
        if (ValidateUtil.isNull(this.state.buyManagerAddr)) {
            Toast.show('请输入详细地址!');
            return;
        }

        dismissKeyboard();
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                component: PrefeStep4,
                params: {
                    user: this.props.params.user,
                    ceo: this.props.params.ceo,
                    buy: this.state,
                    beforeDatas: this.beforeDatas
                }
            })
        }
    }
    _renderCompanyCeo() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>采购负责人</Text>
                <TextInputC
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(buyManagerNm) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            buyManagerNm: buyManagerNm,
                        })
                    }
                    }
                    value={this.state.buyManagerNm}
                    style={styles.textInput}
                    maxLength={20} />
            </View>
        );
    }
    _renderCeoMobile() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>采购人手机</Text>
                <TextInputC
                    keyboardType='numeric'
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(buyManagerMobile) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            buyManagerMobile: buyManagerMobile,
                        })
                    }
                    }
                    value={this.state.buyManagerMobile}
                    style={styles.textInput}
                    maxLength={20} />
            </View>
        );
    }

    _renderCeoEmail() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>采购人邮箱</Text>
                <TextInputC
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(buyManagerEmail) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            buyManagerEmail: buyManagerEmail,
                        })
                    }
                    }
                    value={this.state.buyManagerEmail}
                    style={styles.textInput}
                    maxLength={20} />
            </View>
        );
    }

    _renderCeoTel() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>采购人固话</Text>
                <TextInputC
                    keyboardType='numeric'
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(buyManagerTel) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            buyManagerTel: buyManagerTel,
                        })
                    }
                    }
                    value={this.state.buyManagerTel}
                    style={styles.textInput}
                    maxLength={20} />
            </View>
        );
    }

    _renderCeoFax() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>采购人传真</Text>
                <TextInputC
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(buyManagerFax) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            buyManagerFax: buyManagerFax,
                        })
                    }
                    }
                    value={this.state.buyManagerFax}
                    style={styles.textInput}
                    maxLength={20} />
            </View>
        );
    }

    _renderCeoZipcode() {
        return (
            <View style={styles.ItemsView}>
                <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>采购人邮编</Text>
                <TextInputC
                    keyboardType='numeric'
                    clearButtonMode='while-editing'
                    autoFocus={false}
                    autoCorrect={false}
                    onChangeText={(buyManagerZipcode) => {
                        {/*this._changerBg();*/ }
                        this.setState({
                            buyManagerZipcode: buyManagerZipcode,
                        })
                    }
                    }
                    value={this.state.buyManagerZipcode}
                    style={styles.textInput}
                    maxLength={20} />
            </View>
        );
    }


    _rendeCeoZoneId() {
        return (
            <TouchableOpacity onPress={this._onBuyManagerZoneIdPress}>
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
                    onChangeText={(buyManagerAddr) => {
                        {/*this._changerBg();*/ }
                        this.inpoutConut = buyManagerAddr.length;
                        this.setState({
                            buyManagerAddr: buyManagerAddr
                        })
                    }
                    }
                    value={this.state.buyManagerAddr}
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
                    onPress={this._openStep4}
                    disabled={this.checkValidity() ? false : true}
                >
                    <Text style={[{ fontSize: 16 }, this.defaultTextBg]}>下一步(3/6)</Text>
                </TouchableOpacity>
            </BaseView>
        );
    }
}