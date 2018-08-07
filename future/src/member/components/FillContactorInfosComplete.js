import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Switch,
    Platform,
    InteractionManager
} from 'react-native';
import {
    BaseView,
    TextInputC,
    Alerts,
    Toast
} from 'future/public/widgets';
import { Fetch } from 'future/public/lib';
import ValidateUtil from 'future/public/lib/ValidateUtil';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../styles/FillEnterpriseInfos.css';
import dismissKeyboard from 'dismissKeyboard';
import StorageUtils from 'future/public/lib/StorageUtils';
export default class FillContactorInfosComplete extends Component {
    constructor(props) {
        super(props);
        this.renderRightBtn = this._renderRightBtn.bind(this);
        this.state = {
            switchIsOn: false,
            buyManagerNm: '',
            buyManagerMobile: '',
            buyManagerEmail: '',
            buyManagerQq: '',
            buyManagerWechat: '',
            receiveManagerNm: '',
            receiveManagerMobile: '',
            receiveManagerEmail: '',
            receiveManagerQq: '',
            receiveManagerWechat: '',
            receiveManagerZoneId: '',
            receiveManagerAddr: '',
            receiveZoneIdStr: '省、市、区',
            contactPerfect: '未完善',//联系人信息是否完善
        }
        this.full = false;
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._initData();
            this._initSwitch();
        })
    }
    componentWillUnmount() {
        let switchInfo = {};
		switchInfo.switchIsOn = this.state.switchIsOn;
		StorageUtils.saveInfo('SWITCH', switchInfo);
    }
    _initSwitch() {
        StorageUtils.readInfo('SWITCH').then((inforResult) => {
            let switchInfo = inforResult.data;
            this.setState({
                switchIsOn:switchInfo.switchIsOn,
            });
        }, (error) => {
        });
    }

    _callBackData() {
        if (this.props.params) {
            this.props.params.callback(this.state);
        }
        if (this.props.navigator) {
            this.props.navigator.pop();
        }
    }

    _initData() {
        if (this.props.params.buyManager != undefined) {
            let buyManager = this.props.params.buyManager;
            let compayPerfect = '未完善';
            if (buyManager.perfect && buyManager.perfect == '已完善') {
                compayPerfect = '已完善'
            }
            this.setState({
                buyManagerNm: buyManager.buyManagerNm == undefined ? '' : buyManager.buyManagerNm,
                buyManagerMobile: buyManager.buyManagerMobile == undefined ? '' : buyManager.buyManagerMobile,
                buyManagerEmail: buyManager.buyManagerEmail == undefined ? '' : buyManager.buyManagerEmail,
                buyManagerQq: buyManager.buyManagerQq == undefined ? '' : buyManager.buyManagerQq + '',
                buyManagerWechat: buyManager.buyManagerWechat == undefined ? '' : buyManager.buyManagerWechat + '',
                receiveManagerNm: buyManager.receiveManagerNm == undefined ? '' : buyManager.receiveManagerNm,      // 收货负责人
                receiveManagerMobile: buyManager.receiveManagerMobile == undefined ? '' : buyManager.receiveManagerMobile, // 收货负责人手机
                receiveManagerEmail: buyManager.receiveManagerEmail == undefined ? '' : buyManager.receiveManagerEmail,  // 收货负责人邮箱
                receiveManagerQq: buyManager.receiveManagerQq == undefined ? '' : buyManager.receiveManagerQq + '',      // 收货负责人QQ
                receiveManagerWechat: buyManager.receiveManagerWechat == undefined ? '' : buyManager.receiveManagerWechat + '', // 收货负责人微信
                receiveZoneIdStr: buyManager.receiveZoneIdStr == undefined ? '' : buyManager.receiveZoneIdStr + '', 
                receiveManagerZoneId: buyManager.receiveManagerZoneId == undefined ? '' : buyManager.receiveManagerZoneId + '', // 收货负责人微信
                receiveManagerAddr: buyManager.receiveManagerAddr == undefined ? '' : buyManager.receiveManagerAddr + '',
                contactPerfect: compayPerfect
            })
        }
    }
    _isPerfect() {
        if (!ValidateUtil.isNull(this.state.buyManagerNm)
            && !ValidateUtil.isNull(this.state.buyManagerMobile)
            && !ValidateUtil.isNull(this.state.buyManagerEmail)
            && !ValidateUtil.isNull(this.state.buyManagerQq)
            && !ValidateUtil.isNull(this.state.buyManagerWechat)
            && !ValidateUtil.isNull(this.state.receiveManagerNm)
            && !ValidateUtil.isNull(this.state.receiveManagerMobile)
            && !ValidateUtil.isNull(this.state.receiveManagerEmail)
            && !ValidateUtil.isNull(this.state.receiveManagerWechat)
            && !ValidateUtil.isNull(this.state.receiveManagerQq)) {
            this.full = true;
        } else {
            this.full = false;
        }
    }

    //提交填写资料 广州国控
    _saveContactorInfos() {
        this._isPerfect();
        new Fetch({
            url: 'app/user/saveRegisterThree.json',
            method: 'POST',
            bodyType: 'json',
            data: {
                buyManagerNm: this.state.buyManagerNm,
                buyManagerMobile: this.state.buyManagerMobile,
                buyManagerEmail: this.state.buyManagerEmail,
                buyManagerQq: this.state.buyManagerQq,
                buyManagerWechat: this.state.buyManagerWechat,
                receiveManagerNm: this.state.receiveManagerNm,
                receiveManagerMobile: this.state.receiveManagerMobile,
                receiveManagerEmail: this.state.receiveManagerEmail,
                receiveManagerQq: this.state.receiveManagerQq,
                receiveManagerWechat: this.state.receiveManagerWechat,
                receiveManagerZoneId: this.state.receiveManagerZoneId == '' ? 0 : this.state.receiveManagerZoneId,
                receiveManagerAddr: this.state.receiveManagerAddr,
                buyersId: this.props.params.buyersId,
            },
        }).dofetch().then((data) => {
            this.state.contactPerfect = '已完善';
            if (data.success) {
                if (this.full) {
                    this.state.contactPerfect = '已完善';
                } else {
                    this.state.contactPerfect = '未完善';
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
                    this._saveContactorInfos();
                }}
                style={{ justifyContent: 'center', paddingRight: 13, }}
            >
                <Text style={{ color: '#AAAEB9', fontSize: 16, top: 2 }}>保存</Text>
            </TouchableOpacity>
        )
    }
    //开关事件
    _onSwitchOnFillTheSameOrNot(isSame) {
        if (isSame) {
            this.refs.input1.setTxtNativeProps(this.state.buyManagerNm)
            this.refs.input2.setTxtNativeProps(this.state.buyManagerMobile)
            this.refs.input3.setTxtNativeProps(this.state.buyManagerEmail)
            this.refs.input4.setTxtNativeProps(this.state.buyManagerWechat)
            this.refs.input5.setTxtNativeProps(this.state.buyManagerQq)

            this.state.receiveManagerNm = this.state.buyManagerNm;
            this.state.receiveManagerMobile = this.state.buyManagerMobile;
            this.state.receiveManagerEmail = this.state.buyManagerEmail;
            this.state.receiveManagerQq = this.state.buyManagerQq;
            this.state.receiveManagerWechat = this.state.buyManagerWechat;
        } else {
            this.refs.input1.setTxtNativeProps('')
            this.refs.input2.setTxtNativeProps('')
            this.refs.input3.setTxtNativeProps('')
            this.refs.input4.setTxtNativeProps('')
            this.refs.input5.setTxtNativeProps('')

            this.state.receiveManagerNm = '';
            this.state.receiveManagerMobile = '';
            this.state.receiveManagerEmail = '';
            this.state.receiveManagerQq = '';
            this.state.receiveManagerWechat = '';
        }
    }
    _clickCallBack() {
        this._isPerfect();
        if (!this.full) {
            this.state.contactPerfect = '未完善';
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
                title={{ title: '联系人信息', tintColor: '#333', fontSize: 18 }}
                statusBarStyle={'default'}
                rightButton={this.renderRightBtn()}
            >
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps={'never'}
                    style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={styles.contentItem}>
                            <View style={[styles.titleItem]}>
                                <Text style={styles.titleTxt}>采购人</Text>
                            </View>
                            <TextInputC
                                onChangeText={(value) => {
                                    this.setState({
                                        buyManagerNm: value
                                    })
                                }}
                                maxLength={20}
                                value={this.state.buyManagerNm}
                                clearButtonMode='while-editing'
                                style={styles.input}
                                placeholder={'请填写采购负责人'} />
                        </View>
                        <View style={styles.splitLine} />

                        <View style={styles.contentItem}>
                            <View style={styles.titleItem}>
                                <Text style={styles.titleTxt}>手机号码</Text>
                            </View>
                            <TextInputC
                                onChangeText={(value) => {
                                    this.setState({
                                        buyManagerMobile: value
                                    })
                                }}
                                value={this.state.buyManagerMobile}
                                keyboardType={'numeric'}
                                clearButtonMode='while-editing'
                                style={styles.input}
                                maxLength={11}
                                placeholder={'请填写手机号码'} />
                        </View>
                        <View style={styles.splitLine} />

                        <View style={styles.contentItem}>
                            <View style={styles.titleItem}>
                                <Text style={styles.titleTxt}>电子邮箱</Text>
                            </View>
                            <TextInputC
                                onChangeText={(value) => {
                                    this.setState({
                                        buyManagerEmail: value
                                    })
                                }}
                                value={this.state.buyManagerEmail}
                                clearButtonMode='while-editing'
                                style={styles.input}
                                maxLength={30}
                                placeholder={'请填写电子邮箱'} />
                        </View>
                        <View style={styles.splitLine} />

                        <View style={styles.contentItem}>
                            <View style={styles.titleItem}>
                                <Text style={styles.titleTxt}>微信</Text>
                            </View>
                            <TextInputC
                                value={this.state.buyManagerWechat}
                                onChangeText={(value) => {
                                    this.setState({
                                        buyManagerWechat: value
                                    })
                                }}
                                maxLength={30}
                                clearButtonMode='while-editing'
                                style={styles.input}
                                placeholder={'请填写微信'} />
                        </View>
                        <View style={styles.splitLine} />

                        <View style={styles.contentItem}>
                            <View style={styles.titleItem}>
                                <Text style={styles.titleTxt}>QQ</Text>
                            </View>
                            <TextInputC
                                value={this.state.buyManagerQq}
                                onChangeText={(value) => {
                                    this.setState({
                                        buyManagerQq: value
                                    })
                                }}
                                maxLength={12}
                                clearButtonMode='while-editing'
                                keyboardType={'numeric'}
                                style={styles.input}
                                placeholder={'请填写QQ'} />
                        </View>
                        <View style={styles.splitLine} />


                        <View style={[styles.contentItem, { backgroundColor: 'rgba(255,255,255,0)', height: 50, justifyContent: 'space-between' }]}>
                            <Text style={{ color: '#0C1828', fontSize: 14 }}>采购人与收货人信息一致</Text>
                            <Switch
                                onValueChange={(value) => {
                                    this._onSwitchOnFillTheSameOrNot(value);
                                    this.setState({ switchIsOn: !this.state.switchIsOn })
                                }}
                                style={{ marginRight: 10, width: 51, height: 31 }}
                                value={this.state.switchIsOn}
                                thumbTintColor="#fff" />
                        </View>
                        <View style={styles.splitLine} />

                        <View style={styles.contentItem}>
                            <View style={styles.titleItem}>
                                <Text style={styles.titleTxt}>收货负责人</Text>
                            </View>
                            <TextInputC
                                value={this.state.receiveManagerNm}
                                ref='input1'
                                clearButtonMode='while-editing'
                                maxLength={20}
                                onChangeText={(value) => {
                                    this.setState({
                                        receiveManagerNm: value
                                    })
                                }}
                                style={styles.input} placeholder={'第三方医药批发平台收货负责人'} />
                        </View>
                        <View style={styles.splitLine} />

                        <View style={styles.contentItem}>
                            <View style={styles.titleItem}>
                                <Text style={styles.titleTxt}>手机号码</Text>
                            </View>
                            <TextInputC
                                value={this.state.receiveManagerMobile}
                                clearButtonMode='while-editing'
                                onChangeText={(value) => {
                                    this.setState({
                                        receiveManagerMobile: value
                                    })
                                }}
                                ref='input2'
                                maxLength={11}
                                style={styles.input}
                                keyboardType={'numeric'}
                                placeholder={'请填写手机号码'} />
                        </View>
                        <View style={styles.splitLine} />

                        <View style={styles.contentItem}>
                            <View style={styles.titleItem}>
                                <Text style={styles.titleTxt}>电子邮箱</Text>
                            </View>
                            <TextInputC
                                value={this.state.receiveManagerEmail}
                                clearButtonMode='while-editing'
                                onChangeText={(value) => {
                                    this.setState({
                                        receiveManagerEmail: value
                                    })
                                }}
                                ref='input3'
                                maxLength={30}
                                style={styles.input}
                                placeholder={'请填写电子邮箱'} />
                        </View>
                        <View style={styles.splitLine} />

                        <View style={styles.contentItem}>
                            <View style={styles.titleItem}>
                                <Text style={styles.titleTxt}>微信</Text>
                            </View>
                            <TextInputC
                                value={this.state.receiveManagerWechat}
                                clearButtonMode='while-editing'
                                onChangeText={(value) => {
                                    this.setState({
                                        receiveManagerWechat: value
                                    })
                                }}
                                ref='input4'
                                maxLength={20}
                                style={styles.input}
                                placeholder={'请填写微信'} />
                        </View>
                        <View style={styles.splitLine} />

                        <View style={styles.contentItem}>
                            <View style={styles.titleItem}>
                                <Text style={styles.titleTxt}>QQ</Text>
                            </View>
                            <TextInputC
                                value={this.state.receiveManagerQq}
                                clearButtonMode='while-editing'
                                onChangeText={(value) => {
                                    this.setState({
                                        receiveManagerQq: value
                                    })
                                }}
                                maxLength={12}
                                keyboardType={'numeric'}
                                ref='input5'
                                style={styles.input}
                                placeholder={'请填写QQ'} />
                        </View>
                        <View style={styles.splitLine} />


                        <View style={styles.contentItem}>
                            <View style={styles.titleItem}>
                                <Text style={styles.titleTxt}>收货地区</Text>
                            </View>
                            <View style={{ flex: 1, paddingRight: 12 }}>
                                <Text numberOfLines={1} style={{ color: '#0C1828', fontSize: 14 }}>{this.state.receiveZoneIdStr}</Text>
                            </View>
                        </View>
                        <View style={styles.splitLine} />

                        <View style={styles.contentItem}>
                            <View style={styles.titleItem}>
                                <Text style={styles.titleTxt}>详细地址</Text>
                            </View>
                            <View style={{ flex: 1, paddingRight: 12 }}>
                                <Text numberOfLines={2} style={{ color: '#0C1828', fontSize: 14 }}>{this.state.receiveManagerAddr}</Text>
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </BaseView>
        )
    }
}
