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
	ScrollView
} from 'react-native';
import { BaseView, Toast, ImageUploader, Loading, FlexModal, } from 'future/public/widgets';
import styles from '../styles/UserInfo';
import {
	Fetch,
	imageUtil,
} from 'future/public/lib';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/Member';

var arrowImg = require('../res/Buyer/000xiangyousanjiao.png');
var addressModalRef = null;
const defaultIcon = require('../res/Buyer/008touxiang.png');

class UserInfo extends Component {
	constructor(props) {
		super(props);

		this.state = {
			headerImg: this._checkIsImg(this.props.userInfo.userIcon) ? imageUtil.get(this.props.userInfo.userIcon) : defaultIcon
		}
	}

	componentWillReceiveProps(nextProps) {
	}

	_checkIsImg(url) {
		return url.indexOf('http') >= 0;
	}

	// 选择图片
	_selectPhoto = () => {
		var imgurl = '';
		ImageUploader.show(
			(source, res) => {
				Loading.show({title: '上传中...'});
			},
			(res) => {
				// 更改头像
				imgurl = res.url;
				new Fetch({
					url:'app/user/saveUserIcon.json',
					method:'POST',
					data: {
						fileId: res.fileId
					}
				}).dofetch().then((data)=>{
					Loading.hide();
					this.setState({
						headerImg: imageUtil.get(imgurl)
					});
				}).catch((error)=>{
					Loading.hide();
				});
			},
			() => {
				Loading.hide();
				Toast.show("设置失败");
			}
		);

	}

	//收货地址列表
	_renderModalView(userInfo) {
		return (
			<View style={styles.addrModal}>
				<View style={styles.modalTitleWrap}>
					<Text style={styles.modalTitle}>收货地址</Text>
				</View>
				<ScrollView style={{maxHeight: 600}}>
					{ 
						userInfo.receiverAddrVoList && userInfo.receiverAddrVoList.length > 0 ? (
							userInfo.receiverAddrVoList.map((e, i) => {
								return (
									<View style={styles.addrItem} key={"addr" + i}>
										<Text numberOfLines={1} style={styles.receiveMan}>{e.name}       {e.mobile}</Text>
										<Text numberOfLines={2} style={styles.receiveAddr}>{e.addressPath} {e.addr}</Text>
									</View>
								)
							})
						) : (
							<View style={styles.noReceive}>
								<Text style={{color:'#333'}}>暂无收货信息</Text>
							</View>
						)
					}
					
				</ScrollView>
				<TouchableOpacity style={styles.closeBtn}
					onPress={() => addressModalRef.hide()}
					activeOpacity={0.5} >
					<Text style={styles.closeText}>关闭</Text>
				</TouchableOpacity>
			</View>
		)
	}

	render() {
		const userInfo = this.props.userInfo;
		return (
			<View style={{flex: 1}}>
				<BaseView
					mainBackColor={{ backgroundColor: '#f5f5f5' }}
					ref={base => this.base = base}
					navigator={this.props.navigator}
					mainColor={'#f9f9f9'}
					titlePosition={'center'}
					statusBarStyle={'default'}
					title={{ title: '账户资料', tintColor: '#333', fontSize: 18 }}
					navBarStyle={styles.borderStyle} >
					<ScrollView style={{flex: 1}}>
						<View style={styles.section}>
							<TouchableOpacity style={[styles.sectionItem, {height: 75}]}
								onPress={this._selectPhoto}>
								<Text style={styles.sectionTitle}>头像</Text>
								<Image source={this.state.headerImg} style={styles.headerImg} />
								<Image source={arrowImg} style={styles.arrowIcon} />
							</TouchableOpacity>
							<View style={styles.line} />
							<View style={styles.sectionItem}>
								<Text style={styles.sectionTitle}>用户名称</Text>
								<Text style={styles.subTitle}>{userInfo.loginId}</Text>
							</View>
							<View style={styles.line} />
							<View style={styles.sectionItem}>
								<Text style={styles.sectionTitle}>真实姓名</Text>
								<Text style={styles.subTitle}>{userInfo.userName}</Text>
							</View>
							<View style={styles.line} />
							<View style={styles.sectionItem}>
								<Text style={styles.sectionTitle}>所属单位</Text>
								<Text style={styles.subTitle}>{userInfo.unitNm}</Text>
							</View>
							<View style={styles.line} />
							<View style={styles.sectionItem}>
								<Text style={styles.sectionTitle}>手机号码</Text>
								<Text style={styles.subTitle}>{userInfo.userMobile}</Text>
							</View>
							<View style={styles.line} />
							<View style={styles.sectionItem}>
								<Text style={styles.sectionTitle}>电子邮箱</Text>
								<Text style={styles.subTitle}>{userInfo.userEmail}</Text>
							</View>
						</View>
						
						<View style={[styles.section, styles.mb10]}>
							<View style={styles.sectionItem}>
								<Text style={styles.sectionTitle}>信用额度</Text>
								<Text style={styles.subTitle}>￥{userInfo.creditLimit.toFixed(2)}</Text>
							</View>
							<View style={styles.line} />
							<TouchableOpacity style={styles.sectionItem}
								onPress={() => {
									addressModalRef.show();
								}}>
								<Text style={styles.sectionTitle}>收货地址</Text>
								<Text style={[styles.subTitle, styles.pr10]}>{userInfo.receiverAddrVoList ? userInfo.receiverAddrVoList.length : 0}个</Text>
								<Image source={arrowImg} style={styles.arrowIcon} />
							</TouchableOpacity>
							
						</View>
					</ScrollView>	
				</BaseView>
				<FlexModal
					ref={(e) => { addressModalRef = e } }
					contentView={this._renderModalView(userInfo)}
					// containerStyle={{ top: 41 }}
					animationType='fade'
					closeCallBack={() => { } }
				/>
			</View>
		);
	}
}

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

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);