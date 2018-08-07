import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    Platform,
    ScrollView
} from 'react-native';
import ValidateUtil from 'future/public/lib/ValidateUtil';
import {
    BaseView,
    TextInputC,
    Alerts,
    Toast
} from 'future/public/widgets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../styles/FillEnterpriseInfos.css';
import dismissKeyboard from 'dismissKeyboard';
import { Fetch } from 'future/public/lib';
import { connect } from 'react-redux';
class FillEnterpriseInfos extends Component {
    constructor(props) {
        super(props);
        this.renderRightBtn = this._renderRightBtn.bind(this);
        this.onBuyManagerZoneIdPress = this._onBuyManagerZoneIdPress.bind(this);
        this.state = {
            unitNm: '', //企业全称
            legalPerson: '',//法定代表人
            regCapital: '',//注册资金
            regAddr: '',//详细地址
            tel: '',//联系电话
            fax: '',//企业联系传真
            zoneIdStr: '省、市、区',//企业经营地区
            buyManagerZoneId: '',
            compayPerfect: '未完善',//资料是否完善
        }
        this.full = false;
    }
    componentDidMount() {
        this._initData();
    }
    _initData() {
        if (this.props.params.compay != undefined) {
            let compay = this.props.params.compay;
            let provinceName = compay.provinceName == undefined ? '' : compay.provinceName + '-';
            let cityName = compay.cityName == undefined ? '' : compay.cityName + '-';
            let districtName = compay.districtName == undefined ? '' : compay.districtName;
            let compayPerfect = '未完善';
            if (compay.perfect && compay.perfect == '已完善') {
                compayPerfect = '已完善'
            }
            this.setState({
                unitNm: compay.unitNm == undefined ? '' : compay.unitNm,
                legalPerson: compay.legalPerson == undefined ? '' : compay.legalPerson,
                regCapital: compay.regCapital == undefined ? '' : compay.regCapital,
                regAddr: compay.regAddr == undefined ? '' : compay.regAddr,
                zoneIdStr: provinceName + cityName + districtName,
                tel: compay.tel,
                fax: compay.fax,
                buyManagerZoneId: compay.entZoneId == undefined ? '' : compay.entZoneId,
                compayPerfect: compayPerfect
            })
        }
    }
    _isPerfect() {
        if (!ValidateUtil.isNull(this.state.unitNm)
            && !ValidateUtil.isNull(this.state.legalPerson)
            && !ValidateUtil.isNull(this.state.regCapital)
            && !ValidateUtil.isNull(this.state.buyManagerZoneId)
            && !ValidateUtil.isNull(this.state.regAddr)
            && !ValidateUtil.isNull(this.state.tel)
            && !ValidateUtil.isNull(this.state.fax)) {
            this.full = true;
        } else {
            this.full = false;
        }
    }
    _onBuyManagerZoneIdPress() {
        if (Platform.OS == 'ios') {
            dismissKeyboard();
        }
        this.refs.base.pickAreaParams(null, "http://eyb2b.imall.com.cn", (areaCode, addressString) => {
            if (!ValidateUtil.isBlank(areaCode) && !ValidateUtil.isBlank(addressString)) {
                if (Platform.OS == 'ios') {
                    let end = addressString.indexOf(" ");
                    let address = addressString.substring(0, end) + '省' + addressString.substring(end, addressString.length);
                    // this.ceoZoneIdStr = address.trim().replace(/\s/g, "-");
                    this.setState({
                        zoneIdStr: address.trim().replace(/\s/g, "-")
                    });
                } else {
                    // this.ceoZoneIdStr = addressString;
                    this.setState({
                        zoneIdStr: addressString
                    });
                }
                this.setState({
                    buyManagerZoneId: areaCode,
                })
            }
        })
    }

   
    _callBackData() {
        if (this.props.params) {
            this.props.params.callback(this.state);
        }
        if (this.props.navigator) {
            this.props.navigator.pop();
        }
    }
    _saveTheEnterpriseInfos() {
        this._isPerfect();
        // if(ValidateUtil.isNull(this.state.regCapital)){
        //     Toast.show('请填写注册资本');
        //     return;
        // }
        // if(ValidateUtil.isNull(this.state.buyManagerZoneId)){
        //     Toast.show('请填写地区号');
        //     return;
        // }
        // if(ValidateUtil.isNull(this.state.regAddr)){
        //     Toast.show('请填写企业详细地址');
        //     return;
        // }
        // if(!(ValidateUtil.isNull(this.state.tel)) && this.state.tel.length != 11){
        //     Toast.show('请填写11位联系电话');
        //     return;
        // }
        // if(ValidateUtil.isNull(this.state.fax)){
        //     Toast.show('请填写企业传真');
        //     return;
        // }
        new Fetch({
            url: 'app/user/saveRegisterTwo.json',
            method: 'POST',
            bodyType: 'json',
            data: {
                buyersId: this.props.params.buyersId,
                unitNm: this.state.unitNm,                 //单位名称
                legalPerson: this.state.legalPerson,       //法定代表
                regCapital: this.state.regCapital == '' ? 0 : this.state.regCapital,         //注册资本
                entZoneId: this.state.buyManagerZoneId,    //地区号
                regAddr: this.state.regAddr,          //企业详细地址
                tel: this.state.tel,                       //企业联系电话
                fax: this.state.fax,                       //企业传真
            }
        }).dofetch().then((data) => {
            if (data.success) {
                if (this.full) {
                    this.state.compayPerfect = '已完善';
                } else {
                    this.state.compayPerfect = '未完善';
                }
                this._callBackData();
            }
        }).catch((error) => { console.info('error', error) });
    }

    _renderRightBtn() {
        return (
            <TouchableOpacity
                activeOpacity={0.3}
                onPress={() => {
                    this._saveTheEnterpriseInfos();
                }}
                style={{ justifyContent: 'center', paddingRight: 13, }}
            >
                <Text style={{ color: '#444', fontSize: 16, top: 2 }}>保存</Text>
            </TouchableOpacity>
        )
    }
    _clickCallBack() {
        this._isPerfect();
        if (!this.full) {
            this.state.compayPerfect = '未完善';
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
                title={{ title: '企业业务资料', tintColor: '#333', fontSize: 18 }}
                statusBarStyle={'default'}
                rightButton={this.renderRightBtn()}
            >
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps={'never'}
                    style={{ flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={styles.contentItem}>
                            <View style={styles.titleItem}>
                                <Text style={styles.titleTxt}>企业全称</Text>
                            </View>
                            <TextInputC
                                clearButtonMode='while-editing'
                                style={styles.input}
                                value={this.state.unitNm}
                                maxLength={30}
                                onChangeText={(txt) => { this.setState({ unitNm: txt }) }}
                                placeholder={'请填写企业全称'}
                            />
                        </View>
                        <View style={styles.splitLine} />

                        <View style={styles.contentItem}>
                            <View style={styles.titleItem}>
                                <Text style={styles.titleTxt}>法定代表人</Text>
                            </View>
                            <TextInputC
                                clearButtonMode='while-editing'
                                style={styles.input}
                                maxLength={30}
                                value={this.state.legalPerson}
                                onChangeText={(txt) => { this.setState({ legalPerson: txt }) }}
                                placeholder={'填写营业执照上的负责人姓名'} />
                        </View>
                        <View style={styles.splitLine} />

                        <View style={styles.contentItem}>
                            <View style={styles.titleItem}>
                                <Text style={styles.titleTxt}>注册资金</Text>
                            </View>
                            <TextInputC
                                clearButtonMode='while-editing'
                                style={styles.input}
                                maxLength={30}
                                keyboardType={'numeric'}
                                value={this.state.regCapital + ''}
                                onChangeText={(txt) => { this.setState({ regCapital: txt }) }}
                                placeholder={'填写营业执照上的注册资金'} />
                        </View>
                        <View style={styles.splitLine} />

                        <TouchableOpacity style={styles.zoneIdPress} onPress={this.onBuyManagerZoneIdPress.bind(this)}>
                            <View style={[styles.titleItem, { width: 87 }]}>
                                <Text style={styles.titleTxt}>企业经营地区</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Text numberOfLines={1} style={{ color: '#AAAEB9', fontSize: 14, marginRight: 8 }}>{this.state.zoneIdStr}</Text>
                                <Image style={{ width: 6, height: 11 }} source={require('../res/Fillinfor/000xiangyousanjiao.png')} resizeMode='stretch' />
                            </View>
                        </TouchableOpacity>

                        <View style={styles.contentItem}>
                            <View style={styles.titleItem}>
                                <Text style={styles.titleTxt}>详细地址</Text>
                            </View>
                            <TextInputC
                                clearButtonMode='while-editing'
                                style={styles.input}
                                maxLength={100}
                                value={this.state.regAddr}
                                onChangeText={(txt) => { this.setState({ regAddr: txt }) }}
                                placeholder={'街道、楼牌号'} />
                        </View>
                        <View style={styles.splitLine} />

                        <View style={styles.contentItem}>
                            <View style={{ width: 90, height: 22, flexDirection: 'row', alignItems: 'center', backgroundColor: "#fff" }}>
                                <Text style={styles.titleTxt}>企业联系电话</Text>
                            </View>
                            <TextInputC
                                clearButtonMode='while-editing'
                                style={styles.input}
                                maxLength={11}
                                keyboardType={'numeric'}
                                value={this.state.tel}
                                onChangeText={(txt) => { this.setState({ tel: txt }) }}
                                placeholder={'填写企业联系电话'} />
                        </View>
                        <View style={styles.splitLine} />

                        <View style={styles.contentItem}>
                            <View style={{ width: 90, height: 22, flexDirection: 'row', alignItems: 'center', backgroundColor: "#fff" }}>
                                <Text style={styles.titleTxt}>企业联系传真</Text>
                            </View>
                            <TextInputC
                                clearButtonMode='while-editing'
                                style={styles.input}
                                maxLength={20}
                                keyboardType={'numeric'}
                                value={this.state.fax}
                                onChangeText={(txt) => { this.setState({ fax: txt }) }}
                                placeholder={'请填写企业联系传真'} />
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

export default connect(mapStateToProps)(FillEnterpriseInfos);
