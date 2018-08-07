import React, { Component } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
} from 'react-native';

import { BaseView, TextInputC, Toast } from 'future/src/widgets';
import { ValidateUtil } from 'future/src/lib';
// 键盘向上顶视图
import KeyboardSpacer from 'react-native-keyboard-spacer';
// 隐藏键盘
import dismissKeyboard from 'dismissKeyboard';
import Styles from 'future/src/lib/styles/Styles';

export default class TestText extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bank: '',
			account: '',
			mobile: '',
		};
	}

	submit = () => {

		let {
      bank,
			account,
			mobile,
    } = this.state;

		//非空验证
		if (ValidateUtil.isBlank(bank)) {
			return Toast.show("请输入开户人名!");
		}
		if (ValidateUtil.isBlank(account)) {
			return Toast.show("请输入银行卡号!");
		}
		if (ValidateUtil.isBlank(mobile)) {
			return Toast.show("请输入手机号码!");
		}

		//去除空格
		bank = bank.trim();
		account = account.trims();
		mobile = mobile.trims();

		//符合规则
		if (!ValidateUtil.isBankCart(account)) {
			return Toast.show("请输入正确的银行卡号!");
		}
		if (!ValidateUtil.isPhone(mobile)) {
			return Toast.show("请输入正确的手机号码!");
		}
	}

	render() {
		const element = <Text style={{ color: '#000', borderColor: 'red', borderWidth: 1 }}>element</Text>;
		return (
			<TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => { dismissKeyboard() }}>
				<BaseView
					style={{ justifyContent: 'center', alignItems: 'stretch' }}
					navigator={this.props.navigator}
					title={{ title: '输入细节', tintColor: '#fff' }}
				>
					<TextInputC
						style={styles.input}
						placeholder='开户人名'
						placeholderTextColor='#c3cbcf'
						clearButtonMode={'while-editing'}
						onChangeText={(bank) => this.setState({ bank })}
						value={this.state.bank}
						maxLength={10}
					/>

					<TextInputC
						style={styles.input}
						placeholder='银行卡号'
						placeholderTextColor='#c3cbcf'
						valueType={'bank-card'}
						keyboardType={'numeric'}
						clearButtonMode={'while-editing'}
						onChangeText={(account) => this.setState({ account })}
						value={this.state.account}
						maxLength={23}
					/>

					<TextInputC
						style={styles.input}
						placeholder='请输入手机号码'
						placeholderTextColor='#c3cbcf'
						valueType={'phone'}
						keyboardType={'number-pad'}
						clearButtonMode={'while-editing'}
						onChangeText={(mobile) => this.setState({ mobile })}
						value={this.state.mobile}
						maxLength={13}
					/>

					<TouchableOpacity
						onPress={this.submit}>
						<View style={styles.btn}>
							<Text style={styles.text}>提交 {this.props.url}</Text>
						</View>
					</TouchableOpacity>

					<KeyboardSpacer topSpacing={0} />
				</BaseView>
			</TouchableOpacity>
		);
	}
}


const styles = Styles.create({
	// 输入框
	input: {
		height: 45,
		marginHorizontal: '$context.b12',
		marginTop: 15,
		paddingLeft: 5,
		fontSize: 15,
		color: '$color.c333',
		backgroundColor: '#fafafa',
		borderColor: '#00FF00',
		borderWidth: '$BW',
		borderRadius: 10,
	},
	btn: {
		height: 45,
		marginHorizontal: '$context.b12',
		marginTop: 15,
		borderRadius: 10,
		backgroundColor: '#3B5998',
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		color: 'white',
	},
});