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
    Alerts,
    TextInputC,
    ImageUploader,
    ItemPicker,
    PopModal
} from 'future/public/widgets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../styles/PerfectInformation';
import ValidateUtil from 'future/public/lib/ValidateUtil';;
import PrefeStep6 from './PrefeStep6';
import md5 from 'md5';
import Clock from '@imall-test/react-native-clock';
import dismissKeyboard from 'dismissKeyboard';
export default class PrefeStep5 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customerTypeId: '',  //客户类型
            customerTypeNm: '药品批发企业',//客户类型名称（数据回显用）
            businessRanges: '',//经营范围
            itemName: "", //要显示的经营范围
            licenseFiles: [],//全部资质文件
            //临时存储
            fileId: [],
            fileUrl: [],        //资质url
            startDate: [],      //资质有效开始时间
            qualificationNum: [],////资质证书号
            endDate: [],       //资质到期时间
            renderSelect: '',//让界面刷新
        }
        this.icon = [];
        this._openStep6 = this._openStep6.bind(this);
        this._onCustomerTypeIdPress = this._onCustomerTypeIdPress.bind(this);
        this._onBusinessRangesPress = this._onBusinessRangesPress.bind(this);
        this._hideCustom = this._hideCustom.bind(this);
        this._reSet = this._reSet.bind(this);
        this._comfirm = this._comfirm.bind(this);
        this._onColoseSelect = this._onColoseSelect.bind(this);
        this._onSelectItem = this._onSelectItem.bind(this);
        this._onUpLoadValidTime = this._onUpLoadValidTime.bind(this);
        this.defaultBg = { backgroundColor: '#E0E0E1' };
        this.defaultTextBg = { color: '#BFBFBF' };
        this.inpoutConut = 0;
        this.isShowDele = [];
        //批发企业
        this.customerTypeData = [];
        this.displayData = [];
        //经营范围
        this.map = new Map();
        this.businessRangesData = [];
        this.defaultSelectBorder = { borderColor: '#eee' };
        this.defaultSelectText = { color: '#444' };
        //回显示数据
        this.customerTypeListData = [];
        this.bool = false;
        this.beforeDatas = null;

        this.allDatas = {};//提交下一页的所有数据
    }

    componentDidMount() {
        this.initBeforDatas();
        this._fetchBusinessRanges();
        this._fetchCustomerType();
    }

    _initView() {
        this.beforeDatas = this.props.params.beforeDatas;
        if (this.beforeDatas != null) {
            this.customerTypeData.map((item, index) => {
                if (item.customerTypeName === this.beforeDatas.customerTypeNm) {
                    new Fetch({
                        url: "app/user/listLicenseByCustomerType.json",
                        data: {
                            customerTypeId: item.customerTypeId
                        }
                    })
                        .dofetch()
                        .then(data => {
                            this.customerTypeListData = data.result;
                        })
                        .catch(error => {
                            console.info("error", error);
                        });
                }
            });
        }
    }


    initBeforDatas() {
        this.beforeDatas = this.props.params.beforeDatas;
        if (this.beforeDatas != null) {
            this.state.customerTypeId = this.beforeDatas.customerTypeId == null ? '' : this.beforeDatas.customerTypeId;
            this.state.customerTypeNm = this.beforeDatas.customerTypeNm == null ? '请选择客户类型' : this.beforeDatas.customerTypeNm;
            this.state.businessRanges = this.beforeDatas.businessRanges == null ? '' : this.beforeDatas.businessRanges;
            if (this.beforeDatas.licenseFiles != null && this.beforeDatas.licenseFiles.length > 0) {
                this.customerTypeListData = this.beforeDatas.licenseFiles;
                this._initAllDatas(this.customerTypeListData);
            }
        }
    }

    //初始化数据
    _initAllDatas(customerTypeListData) {
        if (customerTypeListData.length > 0) {
            customerTypeListData.map((item, index) => {
                if (!ValidateUtil.isBlank(item.qualificationNum)) {
                    this.state.qualificationNum[index] = item.qualificationNum;
                }
                if (!ValidateUtil.isBlank(item.fileId)) {
                    this.state.fileId[index] = item.fileId;
                }
                if (!ValidateUtil.isBlank(item.fileUrl)) {
                    this.state.fileUrl[index] = item.fileUrl;
                }
                if (!ValidateUtil.isBlank(item.startDate)) {
                    this.state.startDate[index] = item.startDate;
                }
                if (!ValidateUtil.isBlank(item.endDate)) {
                    this.state.endDate[index] = item.endDate;
                }
            });
        }
    }
    _fetchBusinessRanges() {
        new Fetch({
            url: "app/user/listAllBusinessRange.json",
            data: {}
        })
            .dofetch()
            .then(data => {
                this.businessRangesData = data.result;
                if (
                    this.beforeDatas != null &&
                    this.state.businessRanges != null &&
                    this.state.businessRanges != ""
                ) {
                    let beforBusinessData = this.state.businessRanges.split(",");
                    let nameStr = "";
                    this.businessRangesData.map((item, index) => {
                        if (
                            beforBusinessData[index] != undefined &&
                            item.businessRangeId == beforBusinessData[index]
                        ) {
                            this.map.set(index, item);
                            nameStr = nameStr + item.name + ",";
                            console.log("set ------", index);
                            //   console.log("set ------", item);
                        }
                    });
                    let itemName = nameStr.substring(0, nameStr.length - 1);
                    this.setState({
                        itemName: itemName
                    });
                }
                this.setState({
                    renderSelect: ""
                });
            })
            .catch(error => {
                console.info("error", error);
            });
    }
    _fetchCustomerType() {
        new Fetch({
            url: 'app/user/listAllCustomerType.json',
            data: {
            }
        }).dofetch().then((data) => {
            console.log('--------------------listAllCustomerType', data);
            if (data.result) {
                data.result.map((item, index) => {
                    this.displayData.push(item.customerTypeName);
                });
            }
            this.customerTypeData = data.result;

            //通过请求网络初始化界面ui
            this._initView();

            this.setState({
                renderSelect: ''
            });
        }).catch((error) => { console.info('error', error) });
    }
    _fetchCustomerTypeList(item) {
        this.state.startDate = [];
        this.state.endDate = [];
        this.state.fileId = [];
        this.state.qualificationNum = [];
        new Fetch({
            url: 'app/user/listLicenseByCustomerType.json',
            data: {
                customerTypeId: item.customerTypeId
            }
        }).dofetch().then((data) => {
            console.log('--------------------listLicenseByCustomerType', data);
            this.customerTypeListData = data.result;
            this.customerTypeData.map((item, index) => {
                this.icon[index] = require('../res/RerfectInformation/shangchuantupian.png');
                this.isShowDele[index] = false;
            })
            this.setState({
                customerTypeId: item.customerTypeId + '',
                customerTypeNm: item.customerTypeName,
            });
        }).catch((error) => { console.info('error', error) });
    }

    _onCustomerTypeIdPress() {
        this.refs.itemPicker && this.refs.itemPicker.show();
    }
    _hideCustom() {
        this.refs.popModal && this.refs.popModal.hide();
    }
    _reSet() {
        this.map.clear();
        this.setState({
            renderSelect: ''
        });
    }
    _onColoseSelect() {
        this._hideCustom();
    }
    _onSelectItem(item, index) {
        let select = this.map.get(index);
        if (select == undefined) {
            this.map.set(index, item);
        } else {
            this.map.delete(index);
        }
        this.setState({
            renderSelect: item
        });
    }
    //经营范围确认
    _comfirm() {
        let str = "";
        let nameStr = "";
        this.map.forEach((value, key, map) => {
            let item = map.get(key);
            str = str + item.businessRangeId + ",";
            nameStr = nameStr + item.name + ",";
        });
        let businessRanges = str.substring(0, str.length - 1);
        let itemName = nameStr.substring(0, nameStr.length - 1);
        this._hideCustom();
        this.setState({
            businessRanges: businessRanges,
            itemName: itemName
        });
        console.log("select businessRanges", businessRanges);
    }
    _renderBusinessItems() {
        return this.businessRangesData.map((item, index) => {
            let select = this.map.get(index);
            if (select == undefined) {
                this.defaultSelectBorder = { borderColor: '#eee' };
                this.defaultSelectText = { color: '#444' };
            } else {
                this.defaultSelectBorder = { borderColor: '#0082FF' };
                this.defaultSelectText = { color: '#0082FF' };
            }
            return (
                <TouchableOpacity style={[styles.brItemsView, this.defaultSelectBorder]} key={index} onPress={() => { this._onSelectItem(item, index) }}>
                    <Text style={[{ fontSize: 12, padding: 1 }, this.defaultSelectText]} numberOfLines={2}>{item.name}</Text>
                </TouchableOpacity>
            );
        });

    }
    _onBusinessRangesPress() {
        this.refs.popModal && this.refs.popModal.show();
    }
    //选择药品批发企业
    _onBusinessRangesSelect(selectData) {
        console.log('customerTypeData', this.customerTypeData);
        console.log('selectData', selectData);
        this.customerTypeData.map((item, index) => {
            if (item.customerTypeName === selectData) {
                this._fetchCustomerTypeList(item);
            }
        });
    }
    _onValidTimePress(index) {
        //时间选择器  （参数参考上面，特殊已标明）
        Clock.setIntervalCalendarAndClock({
            // minDate: (new Date(2015, 2, 25, 5, 50, 0, 0)),
            // maxDate: (new Date(2017, 11, 28, 5, 50, 0, 0)),
            // defaultStartDate: (new Date(2017, 2, 25, 5, 50, 0, 0)),     //默认选择开始日期，不写默认当前日期
            // defaultEndDate: (new Date(2017, 3, 25, 5, 50, 0, 0)),       //默认选择结束日期，不写默认当前日期     （只有2个日期相等，才会起效果）
            color: "rgba(78,193,137,1)",
            titleDic: { confirm_btn: "完成", cancle_btn: "取消" },
            block: (start, end) => {
                let st = new Date(start).format("yyyy-MM-dd");
                let en = new Date(end).format("yyyy-MM-dd");
                console.log('start', st);
                console.log('end', en);
                console.log('index', index);
                this.state.startDate[index] = st;
                this.state.endDate[index] = en;
                this.setState({ bool: true })
            }
        });
    }
    _onUpLoadValidTime(index) {
        ImageUploader.show(
            (source, response) => {
                this.icon[index] = { uri: source.uri };
                this.isShowDele[index] = true;
                this.setState({
                    renderSelect: ''
                });
            },
            (Uploadres) => {
                this.isShowDele[index] = true;
                this.state.fileId[index] = Uploadres.fileId;
                this.state.fileUrl[index] = Uploadres.url;
                console.log('--------------------Uploadres', Uploadres);
                this.setState({
                    renderSelect: ''
                });
            },
            (error) => {
                console.log('ImageUploader error', error);
            });
    }
    _changerBg() {
        this.defaultBg = { backgroundColor: '#34457D' };
        this.defaultTextBg = { color: '#fff' };
    }

    checkValidity() {
        if (this.customerTypeListData.length == 0) {
            return (
                !ValidateUtil.isNull(this.state.customerTypeId) &&
                !ValidateUtil.isNull(this.state.businessRanges)
            );
        } else {
            let qualificationNumIsNull = true;
            this.state.qualificationNum.map((item, index) => {
                if (ValidateUtil.isBlank(item)) {
                    qualificationNumIsNull = false;
                }
            });
            let fileIdIsNull = true;
            for (var i = 0; i < this.state.fileId.length; i++) {
                if (ValidateUtil.isNull(this.state.fileId[i])) {
                    fileIdIsNull = false;
                }
            }
            return (
                !ValidateUtil.isBlank(this.state.customerTypeId) &&
                !ValidateUtil.isBlank(this.state.businessRanges) &&
                (this.state.startDate.length != 0 &&
                    this.customerTypeListData.length == this.state.startDate.length) &&
                (this.state.fileId.length != 0 &&
                    this.state.fileId.length == this.customerTypeListData.length &&
                    fileIdIsNull) &&
                (this.state.qualificationNum.length != 0 && qualificationNumIsNull)
            );
        }
    }
    _openStep6() {

        if (ValidateUtil.isNull(this.state.customerTypeId)) {
            Toast.show('请选择药品批发企业类型!');
            return;
        }
        if (ValidateUtil.isNull(this.state.businessRanges)) {
            Toast.show('请选择经营范围!');
            return;
        }
        if (this.customerTypeListData.length > 0) {
            if (this.customerTypeListData.length != this.state.qualificationNum.length || this.state.qualificationNum.length == 0) {
                Toast.show('请填写所有资质证书号!');
                return;
            }

            if (this.state.startDate.length != this.customerTypeListData.length) {
                Toast.show('请选择所有证书有效期!');
                return;
            }

            if (this.state.fileId.length == 0 || this.state.fileId.length != this.customerTypeListData.length) {
                Toast.show('请选择所有需要上传的图片!');
                return;
            }
        }
        dismissKeyboard();
        this._mapAllDatas();
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                component: PrefeStep6,
                params: {
                    user: this.props.params.user,
                    ceo: this.props.params.ceo,
                    buy: this.props.params.buy,
                    receive: this.props.params.receive,
                    customer: this.allDatas,
                    beforeDatas: this.beforeDatas
                }
            })
        }
    }
    //初始化提交的所有数据
    _mapAllDatas() {
        //资质文件数据
        let licenseData = {
            sysLicenseId: '',//资质Id
            sysLicenseNm: '',//资质名称
            qualificationNum: '', //资质证书号
            fileId: '',
            fileUrl: '',        //资质url
            startDate: '',       //资质有效开始时间
            endDate: '',       //资质到期时间
            sysBuyersLicenseRelId: '',//资质用户关联ID
            customerLicenseTypeRelId: '',//资质类型关联ID
        };
        if (this.customerTypeListData.length > 0) {
            this.customerTypeListData.map((item, index) => {
                licenseData.sysLicenseId = item.sysLicenseId == null ? '' : item.sysLicenseId;;
                licenseData.fileId = this.state.fileId[index];
                licenseData.fileUrl = this.state.fileUrl[index];
                licenseData.sysLicenseNm = item.sysLicenseNm;
                licenseData.startDate = this.state.startDate[index];
                licenseData.endDate = this.state.startDate[index];
                licenseData.qualificationNum = this.state.qualificationNum[index];
                licenseData.sysBuyersLicenseRelId = item.sysBuyersLicenseRelId == null ? '' : item.sysBuyersLicenseRelId;
                licenseData.customerLicenseTypeRelId = item.customerLicenseTypeRelId == null ? '' : item.customerLicenseTypeRelId;
                this.state.licenseFiles[index] = licenseData;
                licenseData = {
                    sysLicenseId: '',//资质Id
                    sysLicenseNm: '',//资质名称
                    qualificationNum: '', //资质证书号
                    fileId: '',
                    fileUrl: '',        //资质url
                    startDate: '',       //资质有效开始时间
                    endDate: '',       //资质到期时间
                    sysBuyersLicenseRelId: '',//资质用户关联ID
                    customerLicenseTypeRelId: '',//资质类型关联ID
                };
            });

            this.allDatas = { licenseFiles: [] };
            let customerData = { customerTypeId: '', businessRanges: '' };
            customerData.businessRanges = this.state.businessRanges;
            customerData.customerTypeId = this.state.customerTypeId;
            this.allDatas.licenseFiles = this.state.licenseFiles;
            Object.assign(this.allDatas, customerData);
            console.log('最后提交的数据', this.allDatas);
        }
    }

    _renderCustomerTypeId() {
        return (
            <TouchableOpacity onPress={this._onCustomerTypeIdPress}>
                <View style={styles.spaceView}>
                    <Text style={{ color: "#0C1828", fontSize: 15, marginRight: 25 }}>{this.state.customerTypeNm}</Text>
                    <Image source={require('../res/RerfectInformation/000dian.png')} style={{ width: 22, height: 4 }} resizeMode='stretch' />
                </View>
            </TouchableOpacity>
        );
    }
    _renderBusinessRanges() {
        return (
            <TouchableOpacity onPress={this._onBusinessRangesPress}>
                <View style={styles.spaceView}>
                    <Text style={{ color: "#AAAEB9", fontSize: 15, marginRight: 25 }}>经营范围</Text>
                    <Text style={{ flex: 1, fontSize: 15 }} numberOfLines={1}>
                        {this.state.itemName ? this.state.itemName : ""}
                    </Text>
                    <Image source={require('../res/RerfectInformation/000youjiantou.png')} style={{ width: 6, height: 11 }} resizeMode='stretch' />
                </View>
            </TouchableOpacity>
        );
    }

    _getPlaceholder(item, index) {
        if (this.state.qualificationNum.length > 0) {
            if (this.state.qualificationNum[index] != undefined && !(ValidateUtil.isBlank(this.state.qualificationNum[index]))) {
                return this.state.qualificationNum[index];
            } else {
                return item.sysLicenseNm;
            }
        } else {
            return item.sysLicenseNm;
        }
    }
    _renderCustomerTypeList() {
        if (this.customerTypeListData.length > 0) {

            let qualificationNumArr = [];
            return this.customerTypeListData.map((item, index) => {
                qualificationNumArr[index] = '';
                if (item.fileUrl != null) {
                    this.icon[index] = { uri: item.fileUrl };
                }
                return (
                    <View style={{ flex: 1, flexDirection: 'column' }} key={index}>
                        <View style={[styles.ItemsView, { marginTop: 10 }]}>
                            <Text style={{ color: "#AAAEB9", fontSize: 15 }}>资质证书号</Text>
                            <TextInputC
                                clearButtonMode='while-editing'
                                autoFocus={false}
                                autoCorrect={false}
                                placeholder={this._getPlaceholder(item, index)}
                                onChangeText={(qualificationNum) => {
                                    this.state.qualificationNum[index] = qualificationNum;
                                    this.setState({
                                        qualificationNum: this.state.qualificationNum
                                    })
                                }
                                }
                                style={{ flex: 1, height: 54, fontSize: 15, paddingLeft: 20, paddingRight: 12 }}
                                maxLength={20} />
                        </View>
                        <TouchableOpacity onPress={() => { this._onValidTimePress(index) }}>
                            <View style={styles.spaceView}>
                                <Text style={{ color: "#AAAEB9", fontSize: 15, }}>证书有效期</Text>
                                <Text style={{ fontSize: 15 }}>{this.state.startDate[index] ? this.state.startDate[index] + '~' + this.state.endDate[index] : ''}</Text>
                                <Image
                                    source={require('../res/RerfectInformation/000youjiantou.png')}
                                    style={{ width: 6, height: 11 }}
                                    resizeMode='stretch' />
                            </View>
                        </TouchableOpacity>
                        <View style={styles.uploadView}>
                            <TouchableOpacity onPress={() => { this._onUpLoadValidTime(index) }}>
                                <Image source={this.icon[index]} style={{ width: 65, height: 65, borderRadius: 4, marginLeft: 13, justifyContent: 'center', alignItems: 'center' }} resizeMode='stretch'>
                                    <Image source={require('../res/RerfectInformation/shanchu.png')} style={{ width: this.isShowDele[index] == false ? 0 : 27, height: 27 }} resizeMode='stretch' />
                                </Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            });
        }
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
            <View style={{ flex: 1 }}>
                <BaseView
                    statusBarStyle={'default'}
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
                        <View style={styles.lineItem} />
                    </View>
                    <KeyboardAwareScrollView style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={styles.marTop}></View>
                        {this._renderCustomerTypeId()}
                        {this._renderBusinessRanges()}
                        {this._renderCustomerTypeList()}
                    </KeyboardAwareScrollView>
                    <TouchableOpacity
                        style={[styles.buttomView, this.defaultBg]}
                        onPress={this._openStep6}
                        disabled={this.checkValidity() ? false : true}
                    >
                        <Text style={[{ fontSize: 16 }, this.defaultTextBg]}>下一步(5/6)</Text>
                    </TouchableOpacity>
                </BaseView>
                <ItemPicker
                    ref="itemPicker"
                    cancelText={'取消'}
                    pickerConfirmBtnColor={'#2CBA75'}
                    pickerCancelBtnColor={'#2CBA75'}
                    titleText={'请选择客户类型'}
                    confirmText={'确定'}
                    dataSource={this.displayData}
                    onPickerConfirm={(selectedData) => {
                        if (Platform.OS === 'ios' && selectedData == 0) {
                            this._onBusinessRangesSelect(this.displayData[0]);
                        } else {
                            this._onBusinessRangesSelect(selectedData[0]);
                        }
                    }}
                    onPickerCancel={() => {
                    }}
                />
                <PopModal
                    ref="popModal"
                    closeCallBack={() => {
                    }}
                    animationType={'fade'}
                    contentView={
                        <View style={styles.businessRanges}>
                            <View style={styles.brHead}>
                                <View style={styles.brHeadCon}>
                                    <TouchableOpacity onPress={this._onColoseSelect}>
                                        <Text style={{ fontSize: 18, color: '#333' }}>关闭</Text>
                                    </TouchableOpacity>
                                    <Text style={{ fontSize: 13, color: '#8E939A' }}>经营范围</Text>

                                    <TouchableOpacity onPress={this._reSet}>
                                        <Text style={{ fontSize: 18, color: '#333' }}>重置</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <ScrollView style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
                                <View style={styles.brContent}>
                                    <Text style={{ fontSize: 14, color: '#333' }}>选择剂型</Text>
                                    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#f7f7f7', marginTop: 5, flexWrap: 'wrap' }}>
                                        {this._renderBusinessItems()}
                                    </View>
                                </View>
                            </ScrollView>

                            <View style={styles.brComfir}>
                                <TouchableOpacity style={styles.brComfirView} onPress={this._comfirm}>
                                    <Text style={{ fontSize: 16, color: '#fff' }}>确认</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                />
            </View>
        );
    }
}