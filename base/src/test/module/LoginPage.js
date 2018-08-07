/**
 * Created by timhuo on 2017/2/4.
 * 功能正常
 */
import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
} from 'react-native';
import { BaseView } from 'future/src/widgets';
import ShareSDK from '@imall-test/react-native-sharesdk';

export default class LoginPage extends Component {

	onlogin(type) {
		ShareSDK.thirdPartyLoginWithPlate(type,      //参数1 登录的平台  Wechat，QQ ， SinaWeibo
			(linkID, userdata) => {                    //参数2 回调函数  linkID（用户唯一标识） userdata (用户信息)
				console.log(linkID);                     //当 linkID 为 -1 时候表示授权失败,为 0 时候 表示取消登录
				console.log(userdata);                   //打印用户全部信息
			});
	}

	render() {
		return (
			<BaseView navigator={this.props.navigator} ref={base => this.base = base}>

				<TouchableOpacity style={styles.btnStyle} onPress={() => { this.onlogin(ShareSDK.SinaWeibo) }}>
					<Text>微博</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.btnStyle} onPress={() => { this.onlogin(ShareSDK.QQ) }}>
					<Text>QQ</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.btnStyle} onPress={() => { this.onlogin(ShareSDK.Wechat) }}>
					<Text>微信</Text>
				</TouchableOpacity>

			</BaseView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
		marginTop: 64,
	},
	btnStyle: {
		padding: 20,
		backgroundColor: 'yellow'
	}
});