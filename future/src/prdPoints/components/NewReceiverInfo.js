import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    Platform,
    InteractionManager
} from 'react-native';
import { Fetch, imageUtil } from 'future/public/lib';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import PhonePicker from 'react-native-phone-picker';
import dismissKeyboard from 'dismissKeyboard';
// import PhoneAndroidPicker from '@imall-test/react-native-phone-picker-android';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import {
    BaseView,
    RefreshableListView,
    Toast,
    DataController,
    MaskModal,
    TextInputC
} from 'future/public/widgets';

import styles from '../style/NewReceiverInfo.css'

export default class NewReceiverInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zoneIdStr: '省、市、区',//企业经营地区   广州国控
            receiverZoneId: '',
            receiverNm: '',
            receiverPhone: '',
            detailAddr: '',
        }
        this.onBuyManagerZoneIdPress = this._onBuyManagerZoneIdPress.bind(this);
        this.renderRightBtn = this._renderRightBtn.bind(this);
    }
    componentDidMount() {
        this.openPhone = RCTDeviceEventEmitter.addListener('onPhoneResult',(result)=>{
            if (result) {
                this.setState({
                    receiverPhone: result.username,
                    receiverNm: result.usernumber
                })
            }
        });
    }
    componentWillUnmount() {
        //移除监听
        if (Platform.OS == 'android') {
            this.openPhone && this.openPhone.remove();
        }
    }
    _saveNewReceiverInfos() {

    }
    _renderRightBtn() {
        return (
            <TouchableOpacity
                activeOpacity={0.3}
                onPress={() => {
                    this._saveNewReceiverInfos();
                }}
                style={{ justifyContent: 'center', paddingRight: 13, }}
            >
                <Text style={{ color: '#AAAEB9', fontSize: 16, top: 2 }}>保存</Text>
            </TouchableOpacity>
        )
    }

    _onBuyManagerZoneIdPress() {
        if (Platform.OS == 'ios') {
            dismissKeyboard();
        }
        this.refs.baseview.pickAreaParams(null, "http://eyb2b.imall.com.cn", (areaCode, addressString) => {
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
                    receiverZoneId: areaCode,
                })
            }
        })
    }

    _selectContactor() {
        if (Platform.OS == 'ios') {
            // PhonePicker.selectPhoneNumber((contact) => {
            //     var phone = contact.phone.replace(/[^\d]/g, '');
            //     this.setState({
            //         receiverPhone: phone,
            //         receiverNm: contact.fullName
            //     })
            //     // if (contact.phone) {
            //     //     var phone = contact.phone.replace(/[^\d]/g, '');
            //     //     if (/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(contact.phone)) {

            //     //     }
            //     // }
            // })
        } else {
            // PhoneAndroidPicker.getPone();
        }
    }

    render() {
        return (
            <BaseView
                ref='baseview'
                title={{ title: '新增临时地址', tintColor: '#333' }}
                navigator={this.props.navigator}
                mainBackColor={{ backgroundColor: '#f5f5f5' }}
                statusBarStyle={'default'}
                rightButton={this.renderRightBtn()}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: SCREENWIDTH - 80 }}>
                        <View style={[styles.contentItem, { width: SCREENWIDTH - 80 }]}>
                            <View style={[styles.titleItem]}>
                                <Text style={styles.titleTxt}>收货人</Text>
                            </View>
                            <TextInputC
                                onChangeText={(value) => {
                                    this.setState({
                                        receiverNm: value
                                    })
                                }}
                                maxLength={20}
                                value={this.state.receiverNm}
                                clearButtonMode='while-editing'
                                style={styles.input}
                                placeholder={'填写收货人'} />
                        </View>
                        <View style={[styles.splitLine, { width: SCREENWIDTH - 80 }]} />

                        <View style={[styles.contentItem, { width: SCREENWIDTH - 80 }]}>
                            <View style={[styles.titleItem]}>
                                <Text style={styles.titleTxt}>手机号码</Text>
                            </View>
                            <TextInputC
                                onChangeText={(value) => {
                                    this.setState({
                                        receiverPhone: value
                                    })
                                }}
                                value={this.state.receiverPhone}
                                clearButtonMode='while-editing'
                                style={styles.input}
                                placeholder={'填写联系人手机号码'} />
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={this._selectContactor.bind(this)}
                        style={{ width: 80, height: 100, backgroundColor: '#fff' }}>
                        <Image
                            style={{ flex: 1 }}
                            source={require('../res/PointsShoppingCart/selectContact.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.splitLine} />

                <View style={styles.contentItem}>
                    <View style={[styles.titleItem]}>
                        <Text style={styles.titleTxt}>邮政编码</Text>
                    </View>
                    <TextInputC
                        onChangeText={(value) => {
                            this.setState({
                                zipCode: value
                            })
                        }}
                        value={this.state.zipCode}
                        clearButtonMode='while-editing'
                        style={styles.input}
                        placeholder={'填写邮政编码（可不填）'} />
                </View>
                <View style={styles.splitLine} />

                <TouchableOpacity style={styles.zoneIdPress} onPress={this.onBuyManagerZoneIdPress.bind(this)}>
                    <View style={[styles.titleItem, { width: 87 }]}>
                        <Text style={styles.titleTxt}>所在地区</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Text numberOfLines={1} style={{ color: '#AAAEB9', fontSize: 14, marginRight: 8 }}>{this.state.zoneIdStr}</Text>
                        <Image
                            style={{ width: 6, height: 11 }}
                            source={require('../../member/res/Fillinfor/000xiangyousanjiao.png')}
                            resizeMode='stretch' />
                    </View>
                </TouchableOpacity>
                <View style={styles.splitLine} />
                <View style={styles.contentItem}>
                    <View style={[styles.titleItem]}>
                        <Text style={styles.titleTxt}>详细地址</Text>
                    </View>
                    <TextInputC
                        onChangeText={(value) => {
                            this.setState({
                                detailAddr: value
                            })
                        }}
                        value={this.state.detailAddr}
                        clearButtonMode='while-editing'
                        style={styles.input}
                        placeholder={'街道楼牌号'} />
                </View>
                <View style={styles.splitLine} />
            </BaseView>
        )
    }
}
