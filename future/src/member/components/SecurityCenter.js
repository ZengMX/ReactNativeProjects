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
import { BaseView, Toast, Loading } from 'future/public/widgets';
import Styles from 'future/public/lib/styles/Styles';
import {
	Fetch,
	imageUtil,
} from 'future/public/lib';

import ModifyPsd from './ModifyPsd';
import ModifyPayPsd from './ModifyPayPsd';
var arrowImg = require('../res/Buyer/000xiangyousanjiao.png');

export default class SecurityCenter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isSetedPass : false
		}
	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			new Fetch({
				url:'/app/user/checkIsSetPayPwd.json',
				method:'POST',
			}).dofetch().then((data)=>{
				console.log("是否设置了支付密码", data);
				this.setState({
					isSetedPass: data.result
				})
			}).catch((error)=>{
				
			});
		});
	}

	_updatePass = () => {
		this.props.navigator.push({
			component: ModifyPsd
		});
	}

	_modifyPayPsd = () => {
		this.props.navigator.push({
			component: ModifyPayPsd,
			params: {
				isSetedPsd: this.state.isSetedPass
			}
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
                title={{ title: '安全中心', tintColor: '#333', fontSize: 18 }}
				navBarStyle={styles.borderStyle} >
				<View style={styles.section}>
					<TouchableOpacity style={styles.sectionItem}
						onPress={this._updatePass}>
						<Text style={styles.sectionTitle}>登录密码</Text>
						<Text style={[styles.subTitle, styles.pr10]}>修改密码</Text>
						<Image source={arrowImg} style={styles.arrowIcon} />
					</TouchableOpacity>
					<View style={styles.line} />
					<TouchableOpacity style={styles.sectionItem}
						onPress={this._modifyPayPsd}>
						<Text style={styles.sectionTitle}>支付密码</Text>
						<Text style={[styles.subTitle, styles.pr10]}>{this.state.isSetedPass ? '修改' : '设置'}支付密码</Text>
						<Image source={arrowImg} style={styles.arrowIcon} />
					</TouchableOpacity>
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
		
		marginTop: 10,
	},
	sectionItem: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
		height: 53,
		paddingHorizontal: 13,
		backgroundColor: '#fff',
	},
	sectionTitle: {
		flex: 1,
		fontSize: 15,
		color: '#333'
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
	pr10: {
		paddingRight: 10
	},
	mb10: {
		marginBottom: 10
	},
	arrowIcon: {
		width: 6, height: 11,
	},
});