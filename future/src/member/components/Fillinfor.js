import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	PixelRatio,
	Image,
	InteractionManager,
	Platform
} from 'react-native';
import {
	BaseView,
	ImageUploader,
	Panel,
	Toast
} from 'future/public/widgets';
import Fetch from 'future/public/lib/Fetch';
import styles from '../styles/Fillinfor';
const screenWidth = Dimensions.get('window').width;
import ValidateUtil from 'future/public/lib/ValidateUtil';
import FillContactorInfos from 'future/src/member/components/FillContactorInfos';
import FillEnterpriseInfos from 'future/src/member/components/FillEnterpriseInfos';
import FillBankAcountInfo from 'future/src/member/components/FillBankAcountInfo';
import FillInvoiceInfos from 'future/src/member/components/FillInvoiceInfos';
import FailPage from 'future/src/submitResult/components/FailPage';
import BaseInfor from 'future/src/member/components/BaseInfor';
import SuccessPage from 'future/src/submitResult/components/SuccessPage';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import PhotoBrowser from "@imall-test/react-native-photobrowser";
//普通营业执照 营业执照 税务登记证 组织机构代码证
//多证合一营业执照 营业执照注册号
export default class Fillinfor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			unitNm: '', //企业全称
			legalPerson: '',//法定代表人 e
			regCapital: '',//注册资金
			regAddr: '',//详细地址 e
			tel: '',//联系电话 e
			fax: '',//企业联系传真 e
			zoneIdStr: '',//企业经营地区
			entZoneId: '',//企业经营地区Code
			compayPerfect: '',//企业业务资料是否完善

			buyManagerNm: '',//采购负责人
			buyManagerMobile: '',//采购负责人
			buyManagerEmail: '',//采购负责人
			buyManagerQq: '',//采购负责人
			buyManagerWechat: '',//采购负责人
			receiveManagerNm: '',      // 收货负责人
			receiveManagerMobile: '', // 收货负责人手机
			receiveManagerEmail: '',  // 收货负责人邮箱
			receiveManagerQq: '',      // 收货负责人QQ
			receiveManagerWechat: '', // 收货负责人微信
			receiveManagerZoneId: '',// 收货负责人地区
			receiveManagerAddr: '',   // 收货负责人地址
			receiveZoneIdStr: '',
			contactPerfect: '',//联系人信息是否完善

			bankName: '',
			branchName: '',
			bankAccountNm: '',
			bankAccount: '',
			bankPerfect: '',//银行账户是否完善

			invoiceType: '0',//发票类型 
			invoiceTitle: '',                         //发票抬头
			taxNum: '',                               //税号
			invoiceAddress: '',                       //发票地址
			invoicePhone: '',                         //发票电话
			invoiceBankCode: '',                    //银行账号
			invoiceBank: '',                         //开户银行
			invoicePerfect: '',//发票信息是否完善

			compayIsShow: true,//企业业务资料是否展开
			contactIsShow: true,//联系人信息是否展开
			bankIsShow: true,//银行账户是否展开
			invoiceIsShow: true,//发票信息是否展开
			isRender: false,
			isNormal: true, //是否普通营业执照
			isShowSelect: false,//是否显示选择营业执照
			avatarIsShow: false,//头像是否展开
		}
		this.sysLicenseId = [];//资质id
		this.taxRegAndOrganData = []; //税务登记证和组织机构代码证

		this.iconData = [];
		this.iconMap = new Map();
		this.fileIdsMap = new Map();
		this.beforeDatas = null;
		this.compay = undefined;
		this.buyManager = undefined;
		this.bank = undefined;
		this.invoice = undefined;
		this.isForRegist = true; //是否是从注册进来的
	}
	// 1.营业执照副本   BusinessLicenseCertificate
	// 2.税务登记证     TaxRegistrationCertificate
	// 3.组织机构代码证  OrganizationCodeCertificate
	// 4.医疗机构执业许可证  MedicalInstitutionPracticeLicense
	// 5.药品生产许可证/药品经营许可证  DrugManufacturingCertificateOrBusinessLicense
	// 6.GSP/GMP证书    GSPOrGMPCertificate
	// 7.医疗器械经营许可证  MedicalDevicesManufacturingLicenseOrBusinessLicense
	// 8.食品经营许可证/食品流通许可证 FoodProductionLicenseOrBusinessLicenseOrCirculationLicense
	componentWillMount() {
		InteractionManager.runAfterInteractions(() => {
			this._fetchBeforData();
			this._initState();
		})
	}//
	_initState() {
		if (this.props.params.isForRegist) {
			this.isForRegist = true;
		} else {
			this.isForRegist = false;
		}
	}
	_initData() {
		this._initInvoiceInfos();
		this._initCompay();
		this._initBank();
		this._initBuyManager();
	}
	_fetchBeforData() {
		new Fetch({
			url: 'app/user/findRegisterDetail.json',
			method: 'POST',
			data: {
				buyersId: this.props.params.buyersId,
			}
		}).dofetch().then((data) => {//this.props.params.loginId 
			this.beforeDatas = data.result;
			this._fetchListLicense();
			this._initData();
		}).catch((error) => { console.info('完善信息失败', error) });
	}
	_fetchListLicense() {
		new Fetch({
			url: 'app/user/findListLicenseByBusinessRangeIds.json',
			method: 'POST',
			data: {
				customerTypeId: this.props.params.customerTypeId,
				businessRangeIds: this.props.params.businessRanges
			}
		}).dofetch().then((data) => {
			let beforeLicenseFiles = this.beforeDatas.licenseFiles;
			let dataResult = data.result;
			let beforeDataToShow = new Map();
			if (dataResult) {
				dataResult.map((item, index) => {
					if (beforeLicenseFiles && beforeLicenseFiles.length > 0) { //把之前的数据倒到返回的列表里面
						beforeLicenseFiles.map((licenseItem, licenseIndex) => {
							if (licenseItem.licenseNo == item.licenseNo) {
								beforeDataToShow.set(index, licenseItem);
							}
						})
					}
				});
				if (beforeDataToShow.size > 0) {
					beforeDataToShow.forEach((value, key, map) => {
						dataResult[key] = value;
						// console.log('key--------------',key);
						// console.log('value--------------',value);
					});
				}
			}


			if (dataResult) {
				dataResult.map((item, index) => {
					if (this.iconMap.get(index) == undefined) {
						let icon = [];
						let beforeIcon = item.fileUrlList;
						if (beforeIcon && beforeIcon.length > 0) {
							beforeIcon.map((iconItem, iconIndex) => {
								icon[iconIndex] = { uri: iconItem };
							})
						}
						this.iconMap.set(index, icon);
					}
					if (this.fileIdsMap.get(index) == undefined) {
						let fileId = [];
						let beforeFile = item.fileIdList;
						if (beforeFile && beforeFile.length > 0) {
							beforeFile.map((iconItem, iconIndex) => {
								fileId[iconIndex] = iconItem;
							})
						}
						this.fileIdsMap.set(index, fileId);
					}
				});
			}

			this.iconData = dataResult;
			let isShowSelect = false;
			this.iconData.map((item, index) => {//这里的做法是看看数据中有没有税务登记证和组织机构代码证，如果有说明他是可以选择可以隐藏不上传这些资质的，如果他选普通营业执照那后台返回什么资质我就
				//上传什么资质文件数据，但是他选多证合一营业执照就把税务登记证和组织机构代码证的数据剔除不显示，上传参数的时候也把这两个数据忽略掉
				if ('TaxRegistrationCertificate' == item.licenseNo || 'OrganizationCodeCertificate' == item.licenseNo) {
					isShowSelect = true;
					this.taxRegAndOrganData.push(index);
				}
			})
			this.setState({
				isRender: !this.state.isRender,
				isShowSelect: isShowSelect
			});
		}).catch((err) => {
			console.log('=> catch: ', err);
		});
	}
	_isEmp(data) {
		if (ValidateUtil.isNull(data)) {
			return true;
		} else {
			return false;
		}
	}
	_initCompay() {
		console.log('_initCompay', this.beforeDatas);
		if (this.beforeDatas && this.beforeDatas.appRegisterDetailTwoVo) {
			let compay = this.beforeDatas.appRegisterDetailTwoVo;
			this.compay = compay;
			let perfect = '';
			if (!this._isEmp(compay.legalPerson)
				&& !this._isEmp(compay.regCapital)
				&& !this._isEmp(compay.unitNm)
				&& !this._isEmp(compay.regAddr)
				&& !this._isEmp(compay.entZoneId)
				&& !this._isEmp(compay.tel)
				&& !this._isEmp(compay.fax)) {
				perfect = '已完善';
				this.compay.perfect = '已完善';
			} else {
				perfect = '未完善';
			}
			let provinceName = compay.provinceName == undefined ? '' : compay.provinceName + '-';
			let cityName = compay.cityName == undefined ? '' : compay.cityName + '-';
			let districtName = compay.districtName == undefined ? '' : compay.districtName;

			this.setState({
				unitNm: compay.unitNm == undefined ? '' : compay.unitNm,
				legalPerson: compay.legalPerson == undefined ? '' : compay.legalPerson,
				regCapital: compay.regCapital == undefined ? '' : compay.regCapital,
				regAddr: compay.regAddr == undefined ? '' : compay.regAddr,
				zoneIdStr: provinceName + cityName + districtName,
				tel: compay.tel,
				fax: compay.fax,
				entZoneId: compay.entZoneId == undefined ? '' : compay.entZoneId,
				compayPerfect: perfect,
			})
			console.log('_initCompay this state', this.state);
		}
	}

	_initBuyManager() {
		if (this.beforeDatas && this.beforeDatas.appRegisterDetailThreeVo) {
			let buyManager = this.beforeDatas.appRegisterDetailThreeVo;
			this.buyManager = buyManager;
			let perfect = '';
			if (!this._isEmp(buyManager.buyManagerNm)
				&& !this._isEmp(buyManager.buyManagerMobile)
				&& !this._isEmp(buyManager.buyManagerEmail)
				&& !this._isEmp(buyManager.buyManagerQq)
				&& !this._isEmp(buyManager.buyManagerWechat)
				&& !this._isEmp(buyManager.receiveManagerMobile)
				&& !this._isEmp(buyManager.receiveManagerEmail)
				&& !this._isEmp(buyManager.receiveManagerQq)
				&& !this._isEmp(buyManager.receiveManagerWechat)
				&& !this._isEmp(buyManager.receiveManagerZoneId)
				&& !this._isEmp(buyManager.receiveManagerAddr)) {
				perfect = '已完善';
			} else {
				perfect = '未完善';
			}
			this.buyManager.perfect = perfect;
			let provinceName = buyManager.receiveProvinceName == null ? '' : buyManager.receiveProvinceName + '-';
			let cityName = buyManager.receiveCityName == null ? '' : buyManager.receiveCityName + '-';
			let districtName = buyManager.receiveDistrictName == null ? '' : buyManager.receiveDistrictName;
			this.buyManager.receiveZoneIdStr = provinceName + cityName + districtName;
			this.setState({
				buyManagerNm: buyManager.buyManagerNm == null ? '' : buyManager.buyManagerNm,
				buyManagerMobile: buyManager.buyManagerMobile == null ? '' : buyManager.buyManagerMobile,
				buyManagerEmail: buyManager.buyManagerEmail == null ? '' : buyManager.buyManagerEmail,
				buyManagerQq: buyManager.buyManagerQq == null ? '' : buyManager.buyManagerQq,
				buyManagerWechat: buyManager.buyManagerWechat == null ? '' : buyManager.buyManagerWechat,

				receiveManagerNm: buyManager.receiveManagerNm == null ? '' : buyManager.receiveManagerNm,      // 收货负责人
				receiveManagerMobile: buyManager.receiveManagerMobile == null ? '' : buyManager.receiveManagerMobile, // 收货负责人手机
				receiveManagerEmail: buyManager.receiveManagerEmail == null ? '' : buyManager.receiveManagerEmail,  // 收货负责人邮箱
				receiveManagerQq: buyManager.receiveManagerQq == null ? '' : buyManager.receiveManagerQq,      // 收货负责人QQ
				receiveManagerWechat: buyManager.receiveManagerWechat == null ? '' : buyManager.receiveManagerWechat, // 收货负责人微信
				receiveZoneIdStr: this.buyManager.receiveZoneIdStr,
				receiveManagerAddr: buyManager.receiveManagerAddr,
				contactPerfect: perfect,
			})
		}
	}
	_initBank() {
		if (this.beforeDatas && this.beforeDatas.appRegisterDetailFourVo) {
			let bank = this.beforeDatas.appRegisterDetailFourVo;
			this.bank = bank;
			let perfect = '';
			if (!this._isEmp(bank.bankName)
				&& !this._isEmp(bank.branchName)
				&& !this._isEmp(bank.bankAccountNm)
				&& !this._isEmp(bank.bankAccount)) {
				perfect = '已完善';
			} else {
				perfect = '未完善';
			}
			this.bank.perfect = perfect;
			this.setState({
				bankName: bank.bankName == undefined ? '' : bank.bankName,
				branchName: bank.branchName == undefined ? '' : bank.branchName,
				bankAccountNm: bank.bankAccountNm == undefined ? '' : bank.bankAccountNm,
				bankAccount: bank.bankAccount == undefined ? '' : bank.bankAccount,
				bankPerfect: perfect,
			})
		}
	}

	_initInvoiceInfos() {
		if (this.beforeDatas && this.beforeDatas.appRegisterDetailFivesVo) {
			let invoice = this.beforeDatas.appRegisterDetailFivesVo;
			this.invoice = invoice;
			let perfect = '';
			if (!this._isEmp(invoice.invoiceAddress)
				&& !this._isEmp(invoice.invoicePhone)
				&& !this._isEmp(invoice.invoiceTitle)
				&& !this._isEmp(invoice.taxNum)) {
				if (invoice.invoiceType && invoice.invoiceType == '0') {
					perfect = '已完善';
				} else {
					if (!this._isEmp(invoice.invoiceBank)
						&& !this._isEmp(invoice.invoiceBankCode)) {
						perfect = '已完善';
					} else {
						perfect = '未完善';
					}
				}
			} else {
				perfect = '未完善';
			}
			this.invoice.perfect = perfect;
			this.setState({
				invoiceTitle: invoice.invoiceTitle == undefined ? '' : invoice.invoiceTitle,
				taxNum: invoice.taxNum == undefined ? '' : invoice.invoiceTitle,
				invoiceAddress: invoice.invoiceAddress == undefined ? '' : invoice.invoiceAddress,
				invoicePhone: invoice.invoicePhone == undefined ? '' : invoice.invoicePhone,
				invoiceBankCode: invoice.invoiceBankCode == undefined ? '' : invoice.invoiceBankCode,
				invoiceBank: invoice.invoiceBank == undefined ? '' : invoice.invoiceBank,
				invoiceType: invoice.invoiceType == undefined ? '1' : invoice.invoiceType,
				invoicePerfect: perfect,
			})
		}
	}

	//打开界面
	_onOpenComponent(type) {
		switch (type) {
			case 1://企业业务资料
				this.props.navigator.push({
					component: FillEnterpriseInfos,
					params: {
						buyersId: this.props.params.buyersId,
						compay: this.compay,
						callback: (data) => {
							Object.assign(this.compay, data);
							this.setState({
								legalPerson: data.legalPerson,
								unitNm: data.unitNm, //企业全称
								regCapital: data.regCapital,//注册资金
								regAddr: data.regAddr,//详细地址
								tel: data.tel,//联系电话
								fax: data.fax,//企业联系传真
								zoneIdStr: data.zoneIdStr,//企业经营地区
								entZoneId: data.buyManagerZoneId,//企业经营地区Code
								compayPerfect: data.compayPerfect,//企业业务资料是否完善
							})
						}
					}
				});
				break;
			case 2://联系人信息
				this.props.navigator.push({
					component: FillContactorInfos,
					params: {
						buyersId: this.props.params.buyersId,
						buyManager: this.buyManager,
						callback: (data) => {
							console.log("FillContactorInfos data", data);
							Object.assign(this.buyManager, data);
							this.setState({
								buyManagerNm: data.buyManagerNm,
								buyManagerMobile: data.buyManagerMobile,
								buyManagerEmail: data.buyManagerEmail,
								buyManagerQq: data.buyManagerQq,
								buyManagerWechat: data.buyManagerWechat,
								receiveManagerZoneId: data.receiveManagerZoneId,
								receiveZoneIdStr: data.receiveZoneIdStr,
								receiveManagerAddr: data.receiveManagerAddr,
								receiveManagerNm: data.receiveManagerNm,      // 收货负责人
								receiveManagerMobile: data.receiveManagerMobile, // 收货负责人手机
								receiveManagerEmail: data.receiveManagerEmail,  // 收货负责人邮箱
								receiveManagerQq: data.receiveManagerQq,      // 收货负责人QQ
								receiveManagerWechat: data.receiveManagerWechat, // 收货负责人微信
								receiveManagerZoneId: data.receiveManagerZoneId,// 收货负责人地区
								contactPerfect: data.contactPerfect,
							})
						}
					}
				});
				break;
			case 3://银行账户
				this.props.navigator.push({
					component: FillBankAcountInfo,
					params: {
						buyersId: this.props.params.buyersId,
						bank: this.bank,
						callback: (data) => {
							console.log("FillBankAcountInfo data", data);
							Object.assign(this.bank, data);
							this.setState({
								bankName: data.bankName,
								branchName: data.branchName,
								bankAccountNm: data.bankAccountNm,
								bankAccount: data.bankAccount,
								bankPerfect: data.bankPerfect,
							})
						}
					}
				});
				break;
			case 4://发票信息
				console.log('FillInvoiceInfos')
				this.props.navigator.push({
					component: FillInvoiceInfos,
					params: {
						buyersId: this.props.params.buyersId,
						invoice: this.invoice,
						callback: (data) => {
							console.log("FillInvoiceInfos data", data);
							Object.assign(this.invoice, data);
							this.setState({
								invoiceType: data.invoiceType,
								invoiceTitle: data.invoiceTitle,
								taxNum: data.taxNum,
								invoiceAddress: data.invoiceAddress,
								invoicePhone: data.invoicePhone,
								invoiceBankCode: data.invoiceBankCode,
								invoiceBank: data.invoiceBank,
								invoicePerfect: data.invoicePerfect,
							})
						}
					}
				});
				break;
		}
	}
	_back() {
		if (this.isForRegist) {
			if (this.props.navigator) {
				this.props.navigator.pop();
			}
		} else {
			if (this.props.navigator) {
				RCTDeviceEventEmitter.emit('changeTabBarIdx2', { idx: 0, goTop: true });
				this.props.navigator.popToTop();
			}
		}
	}
	_mapIsEmpty() {
		let isEmpty = false;
		this.sysLicenseId.map((item, index) => {
			let fileIds = this.fileIdsMap.get(index);
			if (fileIds != undefined) {
				if (fileIds.length <= 0) {
					isEmpty = true;
					return isEmpty;
				}
			} else {
				isEmpty = true;
				return isEmpty;
			}
		});
		return isEmpty;
	}
	_selectMapIsEmpyt() {
		let temp = new Map();
		let isEmpty = false;
		temp = this.fileIdsMap;
		this.taxRegAndOrganData.map((selectIndex, index) => { //将税务登记证和组织机构代码证去掉看其他的文件是否上传
			let empty = undefined;
			temp.set(selectIndex, empty);
		});
		this.sysLicenseId.map((item, index) => {
			let fileIds = temp.get(index);
			if (fileIds != undefined) {
				if (fileIds.length <= 0) {
					isEmpty = true;
					return isEmpty;
				}
			}
		});
		return isEmpty;
	}
	_isPerfect() {
		if (this.state.isShowSelect == true && this.state.isNormal == false) {
			return this._selectMapIsEmpyt();
		} else {
			return this._mapIsEmpty();
		}
	}
	//this.taxRegAndOrganData
	_commit() {
		// console.log('==+++++++++++++', this._isPerfect());
		// if (this._isPerfect()) {
		// 	// this.fileIdsMap.forEach((value, key, map) => {
		// 	// 	console.log('key -----------', key);
		// 	// 	console.log('value -----------', value);
		// 	// });
		// 	Toast.show('请完善企业信息!');
		// 	return;
		// }
		let licenseFiles = [];
		if (this.state.isShowSelect == true && this.state.isNormal == false) { //三证合一
			let tempMap = new Map();
			tempMap = this.fileIdsMap;
			this.taxRegAndOrganData.map((selectIndex, index) => {
				let empty = undefined;
				tempMap.set(selectIndex, empty);
			});
			let tepArr = this.sysLicenseId;
			this.taxRegAndOrganData.map((selectIndex, index) => {
				tepArr[selectIndex] = undefined;
			});
			//可能要去掉税务登记证和组织机构代码证，设成undefined
			tepArr.map((item, index) => {
				let datas = {};
				if (item != undefined) {
					datas.sysLicenseId = item;
					datas.isThreeInOne = 'Y';
					let fileIds = tempMap.get(index);
					let fileIdLists = [];
					if (fileIds != undefined) {
						fileIds.map((items, indexs) => {
							fileIdLists[indexs] = items;
						});
						datas.fileIdList = fileIdLists;
					}
					licenseFiles.push(datas);
					datas = {};
				}
			});
		} else {                                                  //普通营业执照
			this.sysLicenseId.map((item, index) => {
				let dataItem = this.iconData[index];
				let datas = {};
				if (dataItem && dataItem.sysBuyersLicenseRelId != undefined) {
					datas.sysBuyersLicenseRelId = dataItem.sysBuyersLicenseRelId;
				} else {
					datas.sysBuyersLicenseRelId = '';
				}
				datas.sysLicenseId = item;
				datas.isThreeInOne = 'N';

				let fileIds = this.fileIdsMap.get(index);
				let fileIdLists = [];
				if (fileIds != undefined) {
					fileIds.map((items, indexs) => {
						fileIdLists[indexs] = items;
					});
					datas.fileIdList = fileIdLists;
				}
				licenseFiles.push(datas);
				datas = {};
			});
		}

		// this.fileIdsMap.forEach((value, key, map) => {
		// 	console.log('key -----------', key);
		// 	console.log('value -----------', value);
		// });
		console.log('licenseFiles -----------', licenseFiles);
		new Fetch({
			url: 'app/user/saveRegister.json',
			method: 'POST',
			bodyType: 'json',
			data: {
				buyersId: this.props.params.buyersId,
				licenseFiles: licenseFiles //资质文件列表
			},
		}).dofetch().then((data) => {
			console.log('saveRegister ------', data);
			if (data.success) {
				this.props.navigator.push({
					component: SuccessPage,
				});
			} else {
				this.props.navigator.push({
					component: FailPage,
				});
			}
		}).catch((err) => { console.log(err); });
	}
	//控制展开
	_expansion(params) {
		switch (params) {
			case 1:
				this.setState({
					compayIsShow: !this.state.compayIsShow,
				})
				break;
			case 2:
				this.setState({
					contactIsShow: !this.state.contactIsShow,
				})
				break;
			case 3:
				this.setState({
					bankIsShow: !this.state.bankIsShow,
				})
				break;
			case 4:
				this.setState({
					invoiceIsShow: !this.state.invoiceIsShow,
				})
				break;
		}
	}

	//头像view
	_renderAvatarView() {
		let beforeDatas = this.beforeDatas;
		if (beforeDatas) {
			let personData = beforeDatas.appRegisterDetailOneVo;
			let businessRangesList = '';
			if (this.props.params.nextPagebusinessRangesName) {
				businessRangesList = this.props.params.nextPagebusinessRangesName;
			} else {
				if (personData && personData.businessRangesList) {
					personData.businessRangesList.map((item, index) => {
						businessRangesList = businessRangesList + item + ' | ';
					});
					businessRangesList = businessRangesList.substring(0, businessRangesList.length - 3);
				}
			}
			return (
				<View style={styles.avatarView}>
					<View style={styles.opacityView} />
					<View style={styles.avater}>

						<View style={{ width: screenWidth - 26, height: 24, flexDirection: "row", justifyContent: 'flex-end' }}>
							<View style={{ width: 34, height: 14, backgroundColor: beforeDatas.isApprove == 'N' ? '#ffe9dd' : '#e3f9ef', alignItems: 'center', justifyContent: 'center' }}>
								<Text style={{ fontSize: 10, color: beforeDatas.isApprove == 'N' ? '#FF6600' : '#13C76F' }}>{beforeDatas.isApprove == 'N' ? '未认证' : '已认证'}</Text>
							</View>
						</View>

						<View style={styles.company}>
							<Text style={{ fontSize: 14, color: '#0C1828' }}>{personData.unitNm == undefined ? "" : personData.unitNm}</Text>
							{this.isForRegist ? <View state={{ width: 0, height: 0 }} /> :
								<TouchableOpacity style={{ width: 13, height: 13, marginLeft: 13 }} onPress={() => {
									if (this.props.navigator) {
										this.props.navigator.push({
											component: BaseInfor,
											params: {
											}
										});
									}
								}}>
									<Image style={{ width: 13, height: 13 }} source={require('../res/Fillinfor/006bianji.png')} resizeMode='stretch' />
								</TouchableOpacity>
							}
						</View>

						<View style={styles.companyTe}>
							<Text style={{ fontSize: 12, color: '#444', }}>{personData.customerTypeNm == undefined ? "" : personData.customerTypeNm}</Text>
						</View>
						{
							this.state.avatarIsShow == false ?
								<View style={styles.avaterTextView}>
									<View style={{ flex: 1, paddingLeft: 10 }}>
										<Text style={{ fontSize: 11, color: '#444', lineHeight: 20 }} numberOfLines={2} >{businessRangesList}</Text>
									</View>
									<TouchableOpacity style={{
										width: 26,
										height: 15,
										marginTop: 24,
										flexDirection: 'row',
										justifyContent: 'center',
										marginRight: 4,
										alignItems: 'center',
									}}
										onPress={() => {
											this.setState({
												avatarIsShow: !this.state.avatarIsShow
											})
										}}
									>
										<Image style={{ width: 16, height: 10 }} source={require('../res/Fillinfor/000zuixiaosanxia.png')} resizeMode='stretch' />
									</TouchableOpacity>
								</View>
								:
								<View style={styles.avaterTextView}>
									<View style={{ flex: 1, paddingLeft: 10, paddingRight: 15 }}>
										<Text style={{ fontSize: 11, color: '#444', lineHeight: 20 }}>{businessRangesList + ''}</Text>
									</View>
									<TouchableOpacity style={{
										width: 26,
										height: 15,
										marginTop: 24,
										flexDirection: 'row',
										justifyContent: 'center',
										alignItems: 'center',
										position: 'absolute',
										bottom: 0,
										right: 4,
									}}
										onPress={() => {
											this.setState({
												avatarIsShow: !this.state.avatarIsShow
											})
										}}
									>
										<Image style={{ width: 16, height: 10 }} source={require('../res/Fillinfor/000zuixiaosanshan.png')} resizeMode='stretch' />
									</TouchableOpacity>
								</View>
						}
					</View>
					<Image style={styles.avatarIcon} source={require('../res/Fillinfor/006touxian.png')} resizeMode='stretch' />
				</View>
			);
		}
	}
	//共同顶部view
	_renderCommView(params, type, perfect) {
		return (
			<View style={styles.commView}>
				<TouchableOpacity onPress={() => { this._onOpenComponent(type) }}>
					<View style={styles.commSelect}>
						<Text style={{ fontSize: 14, color: '#0C1828' }}>{params}</Text>
						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
							<Text style={{ fontSize: 13, color: '#AAAEB9', marginRight: 5 }}>{perfect}</Text>
							<Image style={{ width: 6, height: 11 }} source={require('../res/Fillinfor/000xiangyousanjiao.png')} resizeMode='stretch' />
						</View>
					</View>
				</TouchableOpacity>
				<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', paddingLeft: 10 }}>
					<Text style={{ fontSize: 13, color: '#444' }}>尚未填写{params}</Text>
					<Text style={{ fontSize: 13, color: '#FF6600', marginTop: 5 }}>请进行填写~</Text>
				</View>
			</View>
		);
	}
	//企业业务资料
	_renderCompayInfo() {
		if (this._isEmp(this.state.legalPerson)
			&& this._isEmp(this.state.tel)
			&& this._isEmp(this.state.fax)
			&& this._isEmp(this.state.regAddr)
			&& this.state.regCapital == 0) {
			this.state.compayPerfect = '';
			return this._renderCommView('企业业务资料', 1, this.state.compayPerfect);
		} else {
			return (
				<View style={{ flexDirection: 'column', marginBottom: 5 }}>
					<View style={[styles.commView, { marginBottom: 0, height: 50 }]}>
						<TouchableOpacity onPress={() => { this._onOpenComponent(1) }}>
							<View style={[styles.commSelect, { height: 50 }]}>
								<Text style={{ fontSize: 14, color: '#0C1828' }}>企业业务资料</Text>
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
									<Text style={{ fontSize: 13, color: '#AAAEB9', marginRight: 5 }}>{this.state.compayPerfect}</Text>
									<Image style={{ width: 6, height: 11 }} source={require('../res/Fillinfor/000xiangyousanjiao.png')} resizeMode='stretch' />
								</View>
							</View>
						</TouchableOpacity>
					</View>
					<View style={[styles.panelTopView, { height: this.state.compayIsShow == true ? 60 : 52 }]}>
						<View style={styles.panelTop}>
							<Text style={{ fontSize: 13, color: '#0C1828' }}>法定代表人：{this.state.legalPerson}</Text>
							<TouchableOpacity onPress={() => { this._expansion(1) }}>
								<Text style={{ fontSize: 13, color: '#0C1828' }}>{this.state.compayIsShow == true ? '展开' : '收起'}</Text>
							</TouchableOpacity>
						</View>
						<Text style={{ fontSize: 13, color: '#0C1828', marginLeft: 10, marginTop: 1 }}>注册资金：{this.state.regCapital}</Text>
					</View>
					<Panel
						style={[styles.panelView, { height: 98 }]}
						duration={1000}
						collapsed={this.state.compayIsShow}
						onCollapsedChange={(extended) => {
						}}>
						<View style={{ flex: 1, flexDirection: 'column' }}>
							<Text style={{ fontSize: 13, color: '#0C1828', marginTop: 5 }}>企业经营地区：{this.state.zoneIdStr}</Text>
							<Text style={{ fontSize: 13, color: '#0C1828', marginTop: 5 }} numberOfLines={1}>详细地址：{this.state.regAddr}</Text>
							<Text style={{ fontSize: 13, color: '#0C1828', marginTop: 5 }}>企业联系电话：{this.state.tel}</Text>
							<Text style={{ fontSize: 13, color: '#0C1828', marginTop: 5 }}>企业联系传真：{this.state.fax}</Text>
						</View>
					</Panel>
				</View>
			);
		}
	}
	//联系人信息
	_renderContact() {
		if (this.state.buyManagerNm == ''
			&& this.state.buyManagerMobile == ''
			&& this.state.buyManagerEmail == ''
			&& this.state.buyManagerQq == ''
			&& this.state.buyManagerWechat == ''
			&& this.state.receiveManagerNm == ''
			&& this.state.receiveManagerMobile == ''
			&& this.state.receiveManagerEmail == ''
			&& this.state.receiveManagerQq == ''
			&& this.state.receiveManagerWechat == '') {
			this.state.contactPerfect = '';
			return this._renderCommView('联系人信息', 2, this.state.contactPerfect);
		} else {
			return (
				<View style={{ flexDirection: 'column', marginBottom: 5 }}>
					<View style={[styles.commView, { marginBottom: 0, height: 50 }]}>
						<TouchableOpacity onPress={() => { this._onOpenComponent(2) }}>
							<View style={[styles.commSelect, { height: 50 }]}>
								<Text style={{ fontSize: 14, color: '#0C1828' }}>联系人信息</Text>
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
									<Text style={{ fontSize: 13, color: '#AAAEB9', marginRight: 5 }}>{this.state.contactPerfect}</Text>
									<Image style={{ width: 6, height: 11 }} source={require('../res/Fillinfor/000xiangyousanjiao.png')} resizeMode='stretch' />
								</View>
							</View>
						</TouchableOpacity>
					</View>
					<View style={[styles.panelTopView, { height: this.state.contactIsShow == true ? 60 : 50 }]}>
						<View style={styles.panelTop}>
							<Text style={{ fontSize: 13, color: '#0C1828' }}>采购负责人：{this.state.buyManagerNm}</Text>
							<TouchableOpacity onPress={() => { this._expansion(2) }}>
								<Text style={{ fontSize: 13, color: '#0C1828' }}>{this.state.contactIsShow == true ? '展开' : '收起'}</Text>
							</TouchableOpacity>
						</View>
						<Text style={{ fontSize: 13, color: '#0C1828', marginLeft: 10 }}>手机号码：{this.state.buyManagerMobile}</Text>
					</View>
					<Panel
						style={[styles.panelView, { height: 250 }]}
						duration={1000}
						collapsed={this.state.contactIsShow}
						onCollapsedChange={(extended) => {
						}}>
						<View style={{ flex: 1, flexDirection: 'column' }}>
							<Text style={{ fontSize: 13, color: '#0C1828', marginTop: 5 }}>电子邮箱：{this.state.buyManagerEmail}</Text>
							<Text style={{ fontSize: 13, color: '#0C1828', marginTop: 5 }}>微信：{this.state.buyManagerWechat}</Text>
							<Text style={{ fontSize: 13, color: '#0C1828', marginTop: 5 }}>QQ：{this.state.buyManagerQq}</Text>
							<View style={styles.line} />
							<Text style={{ fontSize: 13, color: '#0C1828', marginTop: 0 }}>收货负责人：{this.state.receiveManagerNm}</Text>
							<Text style={{ fontSize: 13, color: '#0C1828', marginTop: 5 }}>手机号码：{this.state.receiveManagerMobile}</Text>
							<Text style={{ fontSize: 13, color: '#0C1828', marginTop: 5 }}>电子邮箱：{this.state.receiveManagerEmail}</Text>
							<Text style={{ fontSize: 13, color: '#0C1828', marginTop: 5 }}>微信：{this.state.receiveManagerWechat}</Text>
							<Text style={{ fontSize: 13, color: '#0C1828', marginTop: 5 }}>QQ：{this.state.receiveManagerQq}</Text>
							<View style={styles.line} />
							<Text style={{ fontSize: 13, color: '#0C1828', marginTop: 5 }}>收货地区：{this.state.receiveZoneIdStr}</Text>
							<Text style={{ fontSize: 13, color: '#0C1828', marginTop: 5 }} numberOfLines={1}>详细地址：{this.state.receiveManagerAddr}</Text>
						</View>
					</Panel>
				</View>
			);
		}
	}
	//银行账户
	_renderBank() {
		if (this.state.bankName == ''
			&& this.state.branchName == ''
			&& this.state.bankAccountNm == ''
			&& this.state.bankAccount == '') {
			this.state.bankPerfect = '';
			return this._renderCommView('银行账户', 3, this.state.bankPerfect);
		} else {
			return (
				<View style={{ flexDirection: 'column', marginBottom: 5 }}>
					<View style={[styles.commView, { marginBottom: 0, height: 50 }]}>
						<TouchableOpacity onPress={() => { this._onOpenComponent(3) }}>
							<View style={[styles.commSelect, { height: 50 }]}>
								<Text style={{ fontSize: 14, color: '#0C1828' }}>银行账户</Text>
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
									<Text style={{ fontSize: 13, color: '#AAAEB9', marginRight: 5 }}>{this.state.bankPerfect}</Text>
									<Image style={{ width: 6, height: 11 }} source={require('../res/Fillinfor/000xiangyousanjiao.png')} resizeMode='stretch' />
								</View>
							</View>
						</TouchableOpacity>
					</View>
					<View style={[styles.panelTopView, { height: this.state.bankIsShow == true ? 60 : 50 }]}>
						<View style={styles.panelTop}>
							<Text style={{ fontSize: 13, color: '#0C1828' }}>开户银行：{this.state.bankName}</Text>
							<TouchableOpacity onPress={() => { this._expansion(3) }}>
								<Text style={{ fontSize: 13, color: '#0C1828' }}>{this.state.bankIsShow == true ? '展开' : '收起'}</Text>
							</TouchableOpacity>
						</View>
						<Text style={{ fontSize: 13, color: '#0C1828', marginLeft: 10 }}>银行账号：{this.state.bankAccount}</Text>
					</View>
					<Panel
						style={[styles.panelView, { height: 55 }]}
						duration={1000}
						collapsed={this.state.bankIsShow}
						onCollapsedChange={(extended) => {
						}}>
						<View style={{ flex: 1, flexDirection: 'column' }}>
							<Text style={{ fontSize: 13, color: '#0C1828', marginTop: 5 }}>银行账户：{this.state.bankAccountNm}</Text>
							<Text style={{ fontSize: 13, color: '#0C1828', marginTop: 5 }}>支行名称：{this.state.branchName}</Text>
						</View>
					</Panel>
				</View>
			);
		}
	}
	//发票信息
	_renderInvoice() {
		if (this.state.invoiceTitle == ''
			&& this.state.taxNum == ''
			&& this.state.invoiceAddress == ''
			&& this.state.invoicePhone == '') {
			this.state.invoicePerfect = '';
			return this._renderCommView('发票信息', 4, this.state.invoicePerfect);
		} else {
			let banckCode = this.state.invoiceType == '0' ? '' : '银行账号：' + this.state.invoiceBankCode;
			let invoiceBank = this.state.invoiceType == '0' ? '' : '开户银行：' + this.state.invoiceBank;
			return (
				<View style={{ flexDirection: 'column', marginBottom: 5 }}>
					<View style={[styles.commView, { marginBottom: 0, height: 50 }]}>
						<TouchableOpacity onPress={() => { this._onOpenComponent(4) }}>
							<View style={[styles.commSelect, { height: 50 }]}>
								<Text style={{ fontSize: 14, color: '#0C1828' }}>发票信息</Text>
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
									<Text style={{ fontSize: 13, color: '#AAAEB9', marginRight: 5 }}>{this.state.invoicePerfect}</Text>
									<Image style={{ width: 6, height: 11 }} source={require('../res/Fillinfor/000xiangyousanjiao.png')} resizeMode='stretch' />
								</View>
							</View>
						</TouchableOpacity>
					</View>
					<View style={[styles.panelTopView, { height: this.state.invoiceIsShow == true ? 60 : 50 }]}>
						<View style={styles.panelTop}>
							<Text style={{ fontSize: 13, color: '#0C1828' }}>发票抬头：{this.state.invoiceTitle}</Text>
							<TouchableOpacity onPress={() => { this._expansion(4) }}>
								<Text style={{ fontSize: 13, color: '#0C1828' }}>{this.state.invoiceIsShow == true ? '展开' : '收起'}</Text>
							</TouchableOpacity>
						</View>
						<Text style={{ fontSize: 13, color: '#0C1828', marginLeft: 10 }}>税号：{this.state.taxNum}</Text>
					</View>
					<Panel
						style={[styles.panelView, { height: this.state.invoiceType == '1' ? 55 : 100 }]}
						duration={1000}
						collapsed={this.state.invoiceIsShow}
						onCollapsedChange={(extended) => {
						}}>
						<View style={{ flex: 1, flexDirection: 'column' }}>
							<Text style={{ fontSize: 13, color: '#0C1828', marginTop: 5 }} numberOfLines={1}>发票地址：{this.state.invoiceAddress}</Text>
							<Text style={{ fontSize: 13, color: '#0C1828', marginTop: 5 }}>发票电话：{this.state.invoicePhone}</Text>
							<Text style={{ fontSize: 13, color: '#0C1828', marginTop: 5 }}>{banckCode}</Text>
							<Text style={{ fontSize: 13, color: '#0C1828', marginTop: 5 }}>{invoiceBank}</Text>
						</View>
					</Panel>
				</View>
			);
		}
	}
	//添加图片
	_selectIcon(index, item, selectIndex) {
		ImageUploader.show((source, res) => {
		}, (res) => {
			let icons = this.iconMap.get(index);
			console.log('this.iconMap.get(index)', res.url);

			if (icons != undefined) {
				icons[selectIndex] = { uri: res.url };
				this.iconMap.set(index, icons);
				console.log('ImageUploader------selectIndex', this.iconMap.get(selectIndex), selectIndex);
			} else {
				console.log('icons else', icons);
			}
			let fileIds = this.fileIdsMap.get(index);
			if (fileIds != undefined) {
				fileIds[selectIndex] = res.fileId;
				this.fileIdsMap.set(index, fileIds);
			} else {
				console.log('fileId else', fileIds);
			}

			this.setState({
				isRender: !this.state.isRender
			});
			console.log('ImageUploader------res', res);
		}, (error) => {
			console.log('ImageUploader error', error);
		},{allowsEditing:false});
	}
	//删除图片
	_deleteIcon(index, item, selectIndex) {
		let icons = this.iconMap.get(index);
		if (icons != undefined) {
			icons[selectIndex] = undefined;
			let temp = [];
			icons.map((items, indexs) => {
				if (items != undefined) {
					temp.push(items);
				}
			})
			this.iconMap.set(index, temp);
		}

		// console.log('************************************************************** -----------');
		// this.fileIdsMap.forEach((value, key, map) => {
		// 	console.log('key -----------', key);
		// 	console.log('value -----------', value);
		// });
		// console.log('************************************************************** -----------');
		let fileIds = this.fileIdsMap.get(index);
		if (fileIds != undefined) {
			fileIds[selectIndex] = undefined;
			let temp = [];
			fileIds.map((items, indexs) => {
				if (items != undefined) {
					temp.push(items);
				}
			})
			this.fileIdsMap.set(index, temp);
		}
		// this.fileIdsMap.forEach((value, key, map) => {
		// 	console.log('key -----------', key);
		// 	console.log('value -----------', value);
		// });
		// console.log('************************************************************** -----------');
		this.setState({
			isRender: !this.state.isRender
		});
	}
	//浏览图片
	_showPic(event, index, item, selectIndex) {
		let picUri = [];
		let icons = this.iconMap.get(index);
		if (icons != undefined) {
			if (icons[selectIndex] != undefined) {
				picUri.push(icons[selectIndex].uri);
			}
		}
		if (picUri.length > 0) {
			if (Platform.OS == "android") {
				event._targetInst.measure((x, y, width, height, locationX, locationY) => {
					PhotoBrowser.browserWithUrlBanner_android({
						locationArray: [width, height, locationX, locationY] /**位置数组**/,
						urlArray: picUri /**图片url数组**/,
						position: 0 /**index为图片当前的索引，索引从0开始**/,
						rnPageName: null /**是否要在原生嵌入RN页面。要嵌入就填js文件名称，如test.js就填test,在此之前需要生成test.bundle文件(生成bundle操作看下面)，如果不要嵌入RN页面此处填null**/
					});
				});
			} else {
				PhotoBrowser.browserWithUrlImages_ios({
					urls: picUri,
					index: 0, //（Int）   点击的图片index 不传，默认为0
					start: 0 //（Int）   参数一的第一个Component 对应的 图片 index  不传，默认为0
				});
			}
		}
	}
	_renderEmptyIcon(index, item) {
		return (
			<View style={styles.empytIconView}>
				<TouchableOpacity onPress={() => { this._selectIcon(index, item, 0) }}>
					<Image style={{ width: 220, height: 60 }} source={require('../res/Fillinfor/006tianjiamoren.png')} resizeMode='stretch' />
				</TouchableOpacity>
			</View>
		);
	}
	_renderIconArr(index, item, isShwo) {
		let icons = this.iconMap.get(index);
		//console.log('icons-----****&&&&&&&', icons)
		if (icons && icons.length == 0) {
			return this._renderEmptyIcon(index, item);
		} else if (icons.length > 0 && icons.length <= 4) {
			return (
				<View style={[styles.iconView]}>
					{this._renderMapIcon(index, item, icons)}
					{icons.length > 3 ? <View style={{ width: 0, height: 0 }} /> :
						<TouchableOpacity onPress={() => { this._selectIcon(index, item, icons.length) }}>
							<View style={{ width: 62, height: isShwo == false ? 72 : 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: "#fff" }}>
								<Image style={{ width: 60, height: 60 }} source={require('../res/Fillinfor/006tianjia.png')} resizeMode='stretch' />
							</View>
						</TouchableOpacity>
					}
				</View>
			);
		}
	}
	_renderMapIcon(index, item, icons) {
		return icons.map((item, selectIndex) => {
			console.log('_renderMapIcon item', item)
			return (
				<TouchableOpacity onPress={(event) => { this._showPic(event,index, item, selectIndex) }} key={selectIndex}>
					<View style={{ width: 62, height: 72, marginRight: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: "#fff" }}>
						<Image style={styles.icon} source={item} resizeMode='stretch' />
						<TouchableOpacity style={styles.iconTop} onPress={() => { this._deleteIcon(index, item, selectIndex) }}>
							<Image style={styles.iconTop} source={require('../res/Fillinfor/006shanchu.png')} resizeMode='stretch' />
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			);
		});
	}

	//营业执照
	_renderQualification() {
		if (this.iconData) {
			return this.iconData.map((item, index) => {
				this.sysLicenseId[index] = item.sysLicenseId;
				let isShwo = false;
				if (this.state.isShowSelect == true && this.state.isNormal == false) { //点击多证合一营业执照的时候
					if ('TaxRegistrationCertificate' == item.licenseNo || 'OrganizationCodeCertificate' == item.licenseNo) {
						isShwo = true;
					} else {
						isShwo = false;
					}
				}
				return (
					isShwo == true ? <View style={{ width: 0, height: 0 }} key={index + 'index'} /> :
						<View style={[styles.qualificationView]} key={index}>
							<View style={[styles.qualificationTe]}>
								<Text style={{ fontSize: 14, color: '#0C1828' }}>{item.sysLicenseNm}</Text>
							</View>
							{this._renderIconArr(index, item, isShwo)}
						</View>
				);
			});
		}
	}
	_renderSelect() {//根据isShowSelect是否显选择营业执照
		return (
			this.state.isShowSelect == true ?
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
						<Text style={{ color: this.state.isNormal ? '#0082FF' : '#4B5963', fontSize: 14, marginLeft: 5 }}>普通营业执照</Text>
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
						<Text style={{ color: this.state.isNormal ? '#4B5963' : '#0082FF', fontSize: 14, marginLeft: 5 }}>多证合一营业执照</Text>
					</TouchableOpacity>
				</View>
				: <View style={{ height: 0, width: 0 }} />
		);
	}
	render() {
		return (
			<View style={{ flex: 1, flexDirection: 'column' }}>
				<ScrollView style={{ flex: 1, flexDirection: 'column', backgroundColor: '#f3f3f3' }}>
					<Image style={styles.topIcon} source={require('../res/Fillinfor/006beijing.png')} resizeMode='stretch' />
					<View style={{ width: screenWidth, height: 90, paddingLeft: 13, justifyContent: 'flex-end' }}>
						<Text style={{ fontSize: 14, color: '#AAAEB9', marginBottom: 10 }}>企业信息</Text>
					</View>
					{this._renderCompayInfo()}
					{this._renderContact()}
					{this._renderBank()}
					{this._renderInvoice()}
					<Text style={{ fontSize: 14, color: '#AAAEB9', marginBottom: 10, marginTop: 9, marginLeft: 13 }}>企业资质</Text>
					{this._renderSelect()}
					{this._renderQualification()}
					{this._renderAvatarView()}
				</ScrollView>
				<Image style={styles.blur} source={require('../res/Fillinfor/006maoboli.png')} resizeMode='stretch' />
				<View style={styles.topTitle}>
					<View style={{ width: screenWidth, height: 26, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
						<Text style={{ fontSize: 18, color: '#333' }}>填写资料</Text>
					</View>
					<TouchableOpacity style={{ width: 40, height: 20, position: 'absolute', top: 4, left: 15, flexDirection: 'row' }} onPress={() => { this._back() }}>
						{
							this.isForRegist ? <Image style={{ width: 9, height: 16 }} source={require('../res/Fillinfor/000fanhui.png')} resizeMode='stretch' /> : <Text style={{ fontSize: 16, color: "#333" }}>关闭</Text>
						}
					</TouchableOpacity>
				</View>
				<View style={styles.commitView}>
					<TouchableOpacity style={[styles.commit, { backgroundColor: this._isPerfect() ? '#E0E0E1' : '#34457D', }]} onPress={() => { this._commit() }} disabled={this._isPerfect()}>
						<Text style={{ fontSize: 16, color: this._isPerfect() ? '#BFBFBF' : '#fff' }}>提交审核</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}