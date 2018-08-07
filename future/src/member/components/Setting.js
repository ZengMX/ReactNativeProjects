import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	PixelRatio,
	Dimensions,
	Platform,
	TouchableOpacity,
	Switch,
	Alert,
	Linking,
	InteractionManager,
} from 'react-native';
import { BaseView, Toast, Loading } from 'future/public/widgets';
import styles from '../styles/Setting';
import config from 'future/public/config';
import {
	Fetch,
	imageUtil,
	ImallCookies,
} from 'future/public/lib';
import Update from 'future/public/lib/Update';
import UserInfo from './UserInfo';
import SecurityCenter from './SecurityCenter';
import StorageUtils from 'future/public/lib/StorageUtils';
import WebViewPage from 'future/public/commons/WebViewPage';
import Instructions from './Instructions';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/Member';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import jpush from  '@imall-test/react-native-jpush'

var arrowImg = require('../res/Buyer/000xiangyousanjiao.png');

class Setting extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isOpenPush: true, //是否接收通知,   广州国控
			workTime: ''
		}

		this.phone = "";
		this.deviceUserId = '';
	}

	componentDidMount() {

		InteractionManager.runAfterInteractions(() => {
			//查询本地记录
			StorageUtils.readInfo('isOpenPush').then((result) => {
				this.setState({
					isOpenPush: result.data == 'Y' ? true : false
				});
			}, (error) => {
				console.log('StorageUtils error>>', error);
			});
			this._getSysInfo();
			jpush.getRegistrationIDWithCallback((registrationID) => {   //极光提供的客户端唯一标识
				this.deviceUserId = registrationID;
			});
		});

	}

	// 获取服务时间，联系电话，关于我们等
	_getSysInfo = () => {
		new Fetch({
			url: '/app/user/getSysInfo.json',
			method: 'POST',
		}).dofetch().then((data) => {
			this.phone = data.webPhone || this.phone;
			this.setState({
				workTime: data.workTime || this.state.workTime
			});
		}).catch((error) => {

		});
	}

	// 账户资料
	_accountInfo = () => {
		this.props.navigator.push({
			component: UserInfo
		});
	}

	// 切换接收消息推送
	_onValueChange = (value) => {
		StorageUtils.saveInfo('isOpenPush', value ? 'Y' : 'N');
		this.setState({
			isOpenPush: value
		});
		new Fetch({
			url: '/app/push/changePushSetting.json',
			method: 'POST',
			data: {
				deviceUserId: this.deviceUserId,
				isAllRead: value ? 'Y' : 'N',
				isOpenPush: value ? 'Y' : 'N',
				notificationStyle: '0'
			}
		}).dofetch().then((data) => {
			console.log('===>data', data);
			Toast.show("设置成功");
		}).catch((error) => {
			console.log('=====>CATCH>>', error);
			Toast.show("设置失败");
			this.setState({
				isOpenPush: !value
			});
		});

	}
	//安全中心
	_safeCenter = () => {
		this.props.navigator.push({
			component: SecurityCenter
		});
	}
	//TODO 给我们评分
	_giveUsScore = () => {
		if (Platform.OS === 'ios') {
			let url = config.ios_downloadUrl;
			if (!url) return Toast.show("给我们评分");
			Linking.canOpenURL(url).then(supported => {
				if (supported) {
					Linking.openURL(url);
				} else {
					console.log("评分失败，请前往App store评分");
				}
			})
		} else {
			Toast.show("给我们评分");
		}
	}
	// 联系我们
	_contactUs = () => {
		Alert.alert('温馨提示', '拨打' + this.phone, [
			{ text: '取消', onPress: () => console.log('取消了操作。') },
			{
				text: '拨打', onPress: () => {
					Linking.canOpenURL('tel:' + this.phone).then(supported => {
						if (supported) {
							Linking.openURL('tel:' + this.phone);
						} else {
							console.log("无法拨打");
						}
					})
				}
			},
		]);
	}

	// 检查更新
	_checkUpdate = () => {
		Update(true);
	}
	// TODO 关于我们
	_aboutUs = () => {
		this.props.navigator.push({
			component: WebViewPage,
			params: {
				title: '关于我们',
				url: '/app/aboutUs.jsp'
			}
		});
	}
	// 特别说明
    _instructions = () => {
		this.props.navigator.push({
			component: Instructions
		});
	}
	// 退出登录, 后期改成redux, 清除掉state.user中的信息
	_logout = () => {
		Loading.show();
		this.props.actions.logout().then(() => {
			Loading.hide();
			ImallCookies.clearUser();
			RCTDeviceEventEmitter.emit('changeTabBarIdx', { idx: 0, goTop: true });
		}).catch(err => {
			Loading.hide();
		});
	}

	render() {
		return (
			<BaseView
				mainBackColor={{ backgroundColor: '#f5f5f5' }}
				ref={base => this.base = base}
				navigator={this.props.navigator}
				mainColor={'#f9f9f9'}
				titlePosition={'center'}
				statusBarStyle={'default'}
				title={{ title: '设置', tintColor: '#333', fontSize: 18 }}
				navBarStyle={styles.borderStyle}
				statusBarStyle={'default'} >
				<View style={{ flex: 1 }}>
					<View style={styles.section}>
						<TouchableOpacity style={styles.sectionItem}
							onPress={this._accountInfo}>
							<Text style={styles.sectionTitle}>账户资料</Text>
							<Image source={arrowImg} style={styles.arrowIcon} />
						</TouchableOpacity>
						<View style={styles.line} />
						<TouchableOpacity style={styles.sectionItem}
							onPress={this._safeCenter}>
							<Text style={styles.sectionTitle}>安全中心</Text>
							<Image source={arrowImg} style={styles.arrowIcon} />
						</TouchableOpacity>
					</View>
					<View style={styles.section}>
						<TouchableOpacity style={styles.sectionItem}>
							<Text style={styles.sectionTitle}>接收消息推送</Text>
							<Switch
								value={this.state.isOpenPush}
								onTintColor="#0082ff"
								tintColor="#e7e7e7"
								onValueChange={this._onValueChange}
							/>
						</TouchableOpacity>
					</View>

					<View style={[styles.section, styles.mb10]}>
						{
							Platform.OS == 'ios' ? (
								<TouchableOpacity style={styles.sectionItem}
									onPress={this._giveUsScore}>
									<Text style={styles.sectionTitle}>给我们评分</Text>
									<Image source={arrowImg} style={styles.arrowIcon} />
								</TouchableOpacity>
							) : (
									<TouchableOpacity style={styles.sectionItem}
										onPress={this._checkUpdate}>
										<Text style={styles.sectionTitle}>检查更新</Text>
										<Image source={arrowImg} style={styles.arrowIcon} />
									</TouchableOpacity>
								)
						}
						<View style={styles.line} />
						<TouchableOpacity style={styles.sectionItem}
							onPress={this._aboutUs}>
							<Text style={styles.sectionTitle}>关于我们</Text>
							<Image source={arrowImg} style={styles.arrowIcon} />
						</TouchableOpacity>
						<View style={styles.line} />
						<TouchableOpacity style={styles.sectionItem}
							onPress={this._instructions}>
							<Text style={styles.sectionTitle}>特别说明</Text>
							<Image source={arrowImg} style={styles.arrowIcon} />
						</TouchableOpacity>
						<View style={styles.line} />
						<TouchableOpacity style={styles.sectionItem}
							onPress={this._contactUs}>
							<Text style={[styles.sectionTitle, { flex: 0 }]}>联系我们</Text>
							<Text style={[styles.subTitle, styles.pr10, { flex: 1, textAlign: 'right' }]}>{this.state.workTime}</Text>
							<Image source={arrowImg} style={styles.arrowIcon} />
						</TouchableOpacity>
						<View style={styles.line} />
						<TouchableOpacity style={styles.sectionItem}>
							<Text style={styles.sectionTitle}>APP版本</Text>
							<Text style={styles.subTitle}>{config.version}</Text>
						</TouchableOpacity>
						<View style={styles.line} />
						<TouchableOpacity style={styles.sectionItem}
							onPress={this._aboutUs}>
							<Text style={styles.sectionTitle}>特别说明</Text>
							<Image source={arrowImg} style={styles.arrowIcon} />
						</TouchableOpacity>
					</View>
				</View>

				<TouchableOpacity style={styles.logoutBtn}
					onPress={this._logout}>
					<Text style={styles.logoutText}>退出登录</Text>
				</TouchableOpacity>

			</BaseView>
		);
	}
}

//获取数据在下面添加
function mapStateToProps(state) {

	return {
		userInfo: state.Member.userInfo,
	};
}
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Setting);