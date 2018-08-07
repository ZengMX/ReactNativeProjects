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
import FillContactorInfosComplete from 'future/src/member/components/FillContactorInfosComplete';
import PhotoBrowser from "@imall-test/react-native-photobrowser";
//普通营业执照 营业执照 税务登记证 组织机构代码证
//多证合一营业执照 营业执照注册号
export default class FillinforCompletes extends Component {
	constructor(props) {
		super(props);
		this.state = {
			legalName: '',//法定代表人
			unitNm: '', //企业全称
			legalPerson: '',//法定代表人
			regCapital: '',//注册资金
			regAddr: '',//详细地址
			tel: '',//联系电话
			fax: '',//企业联系传真
			zoneIdStr: '',//企业经营地区
			buyManagerZoneId: '',//企业经营地区Code
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

			invoiceType: '1',//发票类型 
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
		this.iconData = [];
		this.iconMap = new Map();
		this.beforeDatas = null;
		this.buyManager = undefined;
	}
	// 1.营业执照副本   BusinessLicenseCertificate
	// 2.税务登记证     TaxRegistrationCertificate
	// 3.组织机构代码证  OrganizationCodeCertificate
	// 4.医疗机构执业许可证  MedicalInstitutionPracticeLicense
	// 5.药品生产许可证/药品经营许可证  DrugManufacturingCertificateOrBusinessLicense
	// 6.GSP/GMP证书    GSPOrGMPCertificate
	// 7.医疗器械经营许可证  MedicalDevicesManufacturingLicenseOrBusinessLicense
	// 8.食品经营许可证/食品流通许可证 FoodProductionLicenseOrBusinessLicenseOrCirculationLicense
	//广州国控
	componentWillMount() {
		InteractionManager.runAfterInteractions(() => {
			this._fetchBeforData();
		})
	}
	_fetchBeforData() {
		new Fetch({
			url: 'app/user/findRegisterDetail.json',
			method: 'POST',
			data: {
				buyersId: this.props.params.buyersId,
			}
		}).dofetch().then((data) => {//this.props.params.loginId 
			this._initData(data.result)
			this._initStateData();
			this.setState({
				isRender: !this.state.isRender,
			});
		}).catch((error) => { console.info('完善信息失败---', error) });
	}
	_initData(data) {
		this.beforeDatas = data;
		this.iconData = data.licenseFiles;
		let dataResult = data.licenseFiles;
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
			});
		}
	}
	_initStateData() {
		this._initInvoiceInfos();
		this._initCompay();
		this._initBank();
		this._initBuyManager();
	}
	_initCompay() {
		if (this.beforeDatas && this.beforeDatas.appRegisterDetailTwoVo) {
			let compay = this.beforeDatas.appRegisterDetailTwoVo;
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
				buyManagerZoneId: compay.entZoneId == undefined ? '' : compay.entZoneId,
			})
		}
	}
	_isEmp(data) {
		if (ValidateUtil.isNull(data)) {
			return true;
		} else {
			return false;
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
				&& !this._isEmp(buyManager.receiveManagerNm)
				&& !this._isEmp(buyManager.receiveManagerQq)
				&& !this._isEmp(buyManager.receiveManagerWechat)
				&& !this._isEmp(buyManager.receiveManagerZoneId)
				&& !this._isEmp(buyManager.receiveManagerAddr)) {
				perfect = '已完善';
			} else {
				perfect = '未完善';
			}
			this.buyManager.perfect = perfect;
			let provinceName = buyManager.receiveProvinceName == undefined ? '' : buyManager.receiveProvinceName + '-';
			let cityName = buyManager.receiveCityName == undefined ? '' : buyManager.receiveCityName + '-';
			let districtName = buyManager.receiveDistrictName == undefined ? '' : buyManager.receiveDistrictName;
			this.setState({
				buyManagerNm: buyManager.buyManagerNm == undefined ? '' : buyManager.buyManagerNm,
				buyManagerMobile: buyManager.buyManagerMobile == undefined ? '' : buyManager.buyManagerMobile,
				buyManagerEmail: buyManager.buyManagerEmail == undefined ? '' : buyManager.buyManagerEmail,
				buyManagerQq: buyManager.buyManagerQq == undefined ? '' : buyManager.buyManagerQq,
				buyManagerWechat: buyManager.buyManagerWechat == undefined ? '' : buyManager.buyManagerWechat,

				receiveManagerNm: buyManager.receiveManagerNm == undefined ? '' : buyManager.receiveManagerNm,      // 收货负责人
				receiveManagerMobile: buyManager.receiveManagerMobile == undefined ? '' : buyManager.receiveManagerMobile, // 收货负责人手机
				receiveManagerEmail: buyManager.receiveManagerEmail == undefined ? '' : buyManager.receiveManagerEmail,  // 收货负责人邮箱
				receiveManagerQq: buyManager.receiveManagerQq == undefined ? '' : buyManager.receiveManagerQq,      // 收货负责人QQ
				receiveManagerWechat: buyManager.receiveManagerWechat == undefined ? '' : buyManager.receiveManagerWechat, // 收货负责人微信

				receiveZoneIdStr: provinceName + cityName + districtName,
				receiveManagerAddr: buyManager.receiveManagerAddr,
				contactPerfect: perfect,
			})

		}
	}
	_initBank() {
		if (this.beforeDatas && this.beforeDatas.appRegisterDetailFourVo) {
			let bank = this.beforeDatas.appRegisterDetailFourVo;
			this.setState({
				bankName: bank.bankName == undefined ? '' : bank.bankName,
				branchName: bank.branchName == undefined ? '' : bank.branchName,
				bankAccountNm: bank.bankAccountNm == undefined ? '' : bank.bankAccountNm,
				bankAccount: bank.bankAccount == undefined ? '' : bank.bankAccount,
			})
		}
	}

	_initInvoiceInfos() {
		if (this.beforeDatas && this.beforeDatas.appRegisterDetailFivesVo) {
			let invoice = this.beforeDatas.appRegisterDetailFivesVo;
			this.setState({
				invoiceTitle: invoice.invoiceTitle == undefined ? '' : invoice.invoiceTitle,
				taxNum: invoice.taxNum == undefined ? '' : invoice.invoiceTitle,
				invoiceAddress: invoice.invoiceAddress == undefined ? '' : invoice.invoiceAddress,
				invoicePhone: invoice.invoicePhone == undefined ? '' : invoice.invoicePhone,
				invoiceBankCode: invoice.invoiceBankCode == undefined ? '' : invoice.invoiceBankCode,
				invoiceBank: invoice.invoiceBank == undefined ? '' : invoice.invoiceBank,
				invoiceType: invoice.invoiceType == undefined ? '1' : invoice.invoiceType,
			})
		}
	}

	//打开界面
	_onOpenComponent() {
		this.props.navigator.push({
			component: FillContactorInfosComplete,
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
	}
	_back() {
		if (this.props.navigator) {
			this.props.navigator.pop();
		}
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
			if (personData && personData.businessRangesList) {
				personData.businessRangesList.map((item, index) => {
					businessRangesList = businessRangesList + item + ' | ';
				});
				businessRangesList = businessRangesList.substring(0, businessRangesList.length - 3);
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
						</View>
						<View style={styles.companyTe}>
							<Text style={{ fontSize: 12, color: '#444', }}>{personData.customerTypeNm == undefined ? "" : personData.customerTypeNm}</Text>
						</View>
						{
							this.state.avatarIsShow == false ?
								<View style={styles.avaterTextView}>
									<View style={{ flex: 1, paddingLeft: 10 }}>
										<Text style={{ fontSize: 11, color: '#444', lineHeight: 20 }} numberOfLines={2} >{businessRangesList + ''}</Text>
									</View>
									<TouchableOpacity style={{
										width: 15,
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
										<Image style={{ width: 16, height: 10 }} source={require('../res/Fillinfor/000sanjiaoxia.png')} resizeMode='stretch' />
									</TouchableOpacity>
								</View>
								:
								<View style={styles.avaterTextView}>
									<View style={{ flex: 1, paddingLeft: 10, paddingRight: 15 }}>
										<Text style={{ fontSize: 11, color: '#444', lineHeight: 20 }}>{businessRangesList + ''}</Text>
									</View>
									<TouchableOpacity style={{
										width: 15,
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
										<Image style={{ width: 16, height: 10 }} source={require('../res/Fillinfor/000sanjiaoshang.png')} resizeMode='stretch' />
									</TouchableOpacity>
								</View>
						}
					</View>
					<Image style={styles.avatarIcon} source={require('../res/Fillinfor/006touxian.png')} resizeMode='stretch' />
				</View>
			);
		}
	}
	//企业业务资料
	_renderCompayInfo() {
		return (
			<View style={{ flexDirection: 'column', marginBottom: 5 }}>
				<View style={[styles.commView, { marginBottom: 0, height: 50 }]}>
					<View style={[styles.commSelect, { height: 50 }]}>
						<Text style={{ fontSize: 14, color: '#0C1828' }}>企业业务资料</Text>
					</View>
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
	//联系人信息
	_renderContact() {
		return (
			<View style={{ flexDirection: 'column', marginBottom: 5 }}>
				<View style={[styles.commView, { marginBottom: 0, height: 50 }]}>
					<TouchableOpacity onPress={() => { this._onOpenComponent() }}>
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
	//银行账户
	_renderBank() {
		return (
			<View style={{ flexDirection: 'column', marginBottom: 5 }}>
				<View style={[styles.commView, { marginBottom: 0, height: 50 }]}>
					<View style={[styles.commSelect, { height: 50 }]}>
						<Text style={{ fontSize: 14, color: '#0C1828' }}>银行账户</Text>
					</View>
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
	//发票信息
	_renderInvoice() {
		let banckCode = this.state.invoiceType == '1' ? '' : '银行账号：' + this.state.invoiceBankCode;
		let invoiceBank = this.state.invoiceType == '1' ? '' : '开户银行：' + this.state.invoiceBank;
		return (
			<View style={{ flexDirection: 'column', marginBottom: 5 }}>
				<View style={[styles.commView, { marginBottom: 0, height: 50 }]}>
					<View style={[styles.commSelect, { height: 50 }]}>
						<Text style={{ fontSize: 14, color: '#0C1828' }}>发票信息</Text>
					</View>
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
	_renderIconArr(index, item) {
		let icons = this.iconMap.get(index);
		if (icons.length > 0 && icons.length <= 4) {
			return (
				<View style={[styles.iconView]}>
					{this._renderMapIcon(index, item, icons)}
				</View>
			);
		}
	}
	_showPic(event, item) {
		let picUri = [];
		if (item != undefined && item.uri != undefined) {
			picUri.push(item.uri);
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
	_renderMapIcon(index, item, icons) {
		return icons.map((item, selectIndex) => {
			return (
				<TouchableOpacity onPress={(event) => { this._showPic(event, item) }} key={selectIndex}>
					<View style={{ width: 62, height: 72, marginRight: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: "#fff" }} key={selectIndex}>
						<Image style={styles.icon} source={item} resizeMode='stretch' />
					</View>
				</TouchableOpacity>
			);
		});
	}

	//营业执照
	_renderQualification() {
		if (this.iconData) {
			return this.iconData.map((item, index) => {
				return (
					<View style={[styles.qualificationView]} key={index}>
						<View style={[styles.qualificationTe]}>
							<Text style={{ fontSize: 14, color: '#0C1828' }}>{item.sysLicenseNm}</Text>
						</View>
						{this._renderIconArr(index, item)}
					</View>
				);
			});
		}
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
					{this._renderQualification()}
					{this._renderAvatarView()}
				</ScrollView>
				<Image style={styles.blur} source={require('../res/Fillinfor/006maoboli.png')} resizeMode='stretch' />
				<View style={styles.topTitle}>
					<View style={{ width: screenWidth, height: 26, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
						<Text style={{ fontSize: 18, color: '#333' }}>企业资料</Text>
					</View>
					<TouchableOpacity style={{ width: 40, height: 20, position: 'absolute', top: 4, left: 15, flexDirection: 'row' }} onPress={() => { this._back() }}>
						<Image style={{ width: 9, height: 16 }} source={require('../res/Fillinfor/000fanhui.png')} resizeMode='stretch' />
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}