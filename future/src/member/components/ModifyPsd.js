import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	Platform,
	TouchableOpacity,
	ScrollView,
	InteractionManager
} from 'react-native';
import { BaseView, Toast, Loading, TextInputC } from 'future/public/widgets';
import Styles from 'future/public/lib/styles/Styles';
import {
	Fetch,
	imageUtil,
	ValidateUtil
} from 'future/public/lib';
import md5 from 'md5';
import dismissKeyboard from 'dismissKeyboard';

var arrowImg = require('../res/Buyer/000xiangyousanjiao.png');

export default class ModifyPsd extends Component {
	constructor(props) {
		super(props);
		this.oldPass = '';
		this.newPass = '';
		this.confirmPass = '';
	}

	componentDidMount() {
	}

	// 更改密码
	_changePwd = () => {
		dismissKeyboard();
		//验证密码格式
		if (this.oldPass == "") {
			Toast.show("请先填写当前登录密码");
			return;
		}
		if (this.newPass == "" || this.newPass.length < 8 || this.newPass.length > 16) {
			Toast.show("请填写8-16位数新密码");
			return;
		}
		if (this.confirmPass == '') {
			Toast.show("请再次填写密码");
			return;
		}
		if(this.newPass != this.confirmPass){
			Toast.show("两次密码不一致，请重新填写");
			return;
		}
		Loading.show();
		new Fetch({
			url:'/app/user/resetPswByOld.json',
			method:'POST',
			data: {
				oldPsw : md5(this.oldPass),
				userPsw : md5(this.newPass)
			}
		}).dofetch().then((data)=>{
			Loading.hide();
			Toast.show('修改成功');
			this.props.navigator.pop();
		}).catch((error)=>{
			Loading.hide();
			Toast.show('修改失败');
		});
	}

	// 渲染完成按钮
	_renderRightButton = () => {
		return (
			<TouchableOpacity style={styles.rightBtn}
			onPress={this._changePwd}>
				<Text style={styles.btnText}>完成</Text>
			</TouchableOpacity>
		);
	}

	render() {
		return (
			<BaseView
				mainBackColor={{ backgroundColor: '#f5f5f5' }}
                ref={base => this.base = base}
                navigator={this.props.navigator}
                mainColor={'#f9f9f9'}
                titlePosition={'center'}
                title={{ title: '修改密码', tintColor: '#333', fontSize: 18 }}
				rightButton={this._renderRightButton()}
				navBarStyle={styles.borderStyle}
				statusBarStyle={'default'} >
				<View style={styles.section}>
					<View style={styles.sectionItem}>
						<Text style={styles.sectionTitle}>输入旧密码</Text>
						<TextInputC
							clearButtonMode={'while-editing'}
							maxLength={32}
							autoFocus={true}
							underlineColorAndroid='transparent'
							style={styles.inputStyle}	
							onChangeText={ text => this.oldPass = text }
							placeholderTextColor="#ACB4BE"
							keyboardType='default'
							secureTextEntry={true}
						/>
						
					</View>
					
				</View>
				<View style={styles.section}>
					<View style={styles.sectionItem}>
						<Text style={styles.sectionTitle}>输入新密码</Text>
						<TextInputC
							clearButtonMode={'while-editing'}
							maxLength={32}
							autoFocus={false}
							underlineColorAndroid='transparent'
							style={styles.inputStyle}
							onChangeText={ text => this.newPass = text }
							placeholderTextColor="#ACB4BE"
							keyboardType='default'
							secureTextEntry={true}
						/>
					</View>
					<View style={styles.line} />
					<View style={styles.sectionItem}>
						<Text style={styles.sectionTitle}>再输一次新密码</Text>
						<TextInputC
							clearButtonMode={'while-editing'}
							maxLength={32}
							autoFocus={false}
							underlineColorAndroid='transparent'
							style={styles.inputStyle}
							onChangeText={ text => this.confirmPass = text }
							placeholderTextColor="#ACB4BE"
							keyboardType='default'
							secureTextEntry={true}
						/>
					</View>
				</View>

			</BaseView>
		)
	}
}

const styles = Styles.create({
	borderStyle: {
		borderBottomWidth: '$BW',
		borderBottomColor: '#e5e5e5'
	},
	section: {
		backgroundColor: '#fff',
		marginTop: 10,
	},
	sectionItem: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
		height: 53,
		paddingLeft: 13,
		paddingRight: 8
	},
	sectionTitle: {
		fontSize: 15,
		color: '#aaaeb9',
		paddingRight: 25
	},
	line: {
		backgroundColor: '#eee',
		height: '$BW',
		marginLeft: 13
	},
	subTitle: {
		fontSize: 14,
		color: '#959fa7',
	},
	inputStyle: {
		flex: 1, 
		fontSize: 15, 
		color: '#0c1828',
		height: 50,
	},
	rightBtn: {
		justifyContent: 'center', marginRight: 13
	},
	btnText: {
		fontSize: 16, color: '#444'
	}
});