import React, { Component } from 'react';
import {
	View,
	ScrollView,
	Dimensions,
	Text,
	TouchableOpacity,
	Image
} from 'react-native';
import {
	BaseView,
	ImagePicker,
	Alerts
} from 'future/src/widgets';
const { height, width } = Dimensions.get('window');
export default class ModalTest extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			icon: require("../layout/res/a011yidong.png")
		};
	}

	_hideCustom(){
       Alerts.hideCustom({backgroundColor: 'rgba(0,0,0,0.4)'});
	}
	 //自定义对话框
	_pressAlert() {
		let content = <View style={{
			width: 100,
			height: 100,
			backgroundColor: '#fff',
			position: 'absolute',
			top: 0,
			left: 0,
			justifyContent: 'center',
			alignItems: 'center'
		}}> 
		   <TouchableOpacity onPress={this._hideCustom.bind(this)}>
			   <Text>内容</Text>
			</TouchableOpacity>
		</View>;
		Alerts.showCustom({
			moduleBg: { backgroundColor: 'rgba(0,0,0,0.4)' },
			contentView: content,
		});
	}
	//通知对话框
	_pressAlert1() {
		Alerts.showPrompt({
			moduleBg: { backgroundColor: 'rgba(255,0,0,0.8)' },
			title: '删除提醒',
			titleStyle: { color: '#333' },
			message: '确定删除此提醒？删除后不再接受用药提醒  确定删除此提醒？删除后不再接受用药提醒确定删除此提醒？删除后不再接受用药提醒',
			noticeTitle: '知道了',
			noticeStyle: { color: '#2CBA75' },
			onNoticeCallback: () => {

			},
			closeCallBack: () => {

			}
		});
	}
	//确认对话框
	_pressAlert2() {
		Alerts.showConfirm({
			moduleBg: { backgroundColor: 'rgba(0,0,0,0.4)' },
			title: '删除提醒',
			titleStyle: { color: '#333' },
			message: '确定删除此提醒？删除后不再接受用药提醒  确定删除此提醒？删除后不再接受用药提醒确定删除此提醒？删除后不再接受用药提醒',
			noticeTitle: '知道了',
			noticeStyle: { color: '#2CBA75' },
			confirmTitle: '删除',
			confirmStyle: { color: '#808080' },
			cancelTitle: '取消',
			cancelStyle: { color: '#f00' },
			onCancelPress: () => {
				alert('onCancelPress');
			},
			onConfirmPress: () => {
				alert('onConfirmPress');
			},
			closeCallBack: () => {
				alert('close');
			}
		});
	}
	_hideCustomBottom(){
       Alerts.hideCustomBottom({backgroundColor: 'rgba(255,0,0,1)',title:'',message:''});
	}
	//自定义底部对话框
	_pressAlert3() {
		let content = <View style={{ flex: 1, backgroundColor: '#ff0',justifyContent:'center',alignItems:'center'}}>
			<TouchableOpacity onPress={this._hideCustomBottom.bind(this)}>
			   <Text>内容</Text>
			</TouchableOpacity>
		</View>
		Alerts.showCustomBottom({
			moduleBg: { backgroundColor: 'rgba(0,0,0,0.4)' },
			title: '删除提醒',
			titleStyle: { color: '#333' },
			message: '确定删除此提醒？删除后不再接受用药提醒  确定删除此提醒？删除后不再接受用药提醒确定删除此提醒？删除后不再接受用药提醒',
			bottomContent: content,
		});
	}
	//输入对话框
	_inputAlert() {
		Alerts.showInputConfirm({
			moduleBg: { backgroundColor: 'rgba(0,0,0,0.4)' },
			inputType: 'text',
			maxLength: 4,
			title: '新建分组',
			titleStyle: { color: '#333' },
			placeholder: '1~10个字符222',
			confirmStyle: { color: '#007AFF' },
			cancelStyle: { color: '#007AFF' },
			inputStyle: {},
			onChangeText: (text) => {
				alert(text);
			},
			onCancelPress: () => {
				alert("onCancelPress");
			},
			onConfirmPress: (text) => {
				alert(text);
			}
		});
	}
	//输入对话框
	_inputAlert1() {
		Alerts.showInputConfirm({
			moduleBg: { backgroundColor: 'rgba(0,0,0,0.8)' },
			inputType: 'number',
			maxLength: 4,
			title: '新建分组',
			titleStyle: { color: '#333' },
			subTitle: '提现金额100.00元',
			subTitleStyle: {},
			placeholder: '1~10个字符222',
			confirmStyle: { color: '#007AFF' },
			cancelStyle: { color: '#007AFF' },
			inputStyle: {},
			onChangeText: (text) => {
				alert(text);
			},
			onCancelPress: () => {
				alert("onCancelPress");
			},
			onConfirmPress: (text) => {
				alert(text);
			}
		});
	}
  //android选择对话框
	_checkAlert() {
		let datas = [];
		for (var i = 0; i < 4; i++) {
			datas.push('中国工商银行' + i);
		}

		Alerts.showCheckConfirm({
			moduleBg: { backgroundColor: 'rgba(0,0,0,0.4)' },
			title: '选择银行',
			titleStyle: { color: '#333' },
			cancelStyle: { color: '#007AFF' },
			optionalArray : datas,
			onSelect: (item, index) => {
				alert(item);
				alert(index);
			},
			onCancelPress: () => {
				alert('取消');
			},
		});
	}
	_photo() {
		ImagePicker.show((source, response) => {
			this.setState({
				icon: { uri: source.uri }
			});
		});
	}
	render() {
		return (
			<View style={{ flex: 1 }}>
				<BaseView navigator={this.props.navigator}>
					<ScrollView style={{ flex: 1 }}>

						<TouchableOpacity
							onPress={this._pressAlert.bind(this)}
							style={{ flex: 1, height: 30, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ccc' }}>
							<Text>自定义弹出层内容</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={this._pressAlert1.bind(this)}
							style={{ flex: 1, height: 30, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ccc' }}>
							<Text>提示对话框</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={this._pressAlert2.bind(this)}
							style={{ flex: 1, height: 30, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ccc' }}>
							<Text>确定和取消对话框</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={this._pressAlert3.bind(this)}
							style={{ flex: 1, height: 30, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ccc' }}>
							<Text>弹出层Alert自定义底部内容</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={this._inputAlert.bind(this)}
							style={{ flex: 1, height: 30, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ccc' }}>
							<Text>弹出层InputAlert文本输入</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={this._inputAlert1.bind(this)}
							style={{ flex: 1, height: 30, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ccc' }}>
							<Text>弹出层InputAlert数字输入</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={this._checkAlert.bind(this)}
							style={{ flex: 1, height: 30, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ccc' }}>
							<Text>仅android弹出层单选调用</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={this._photo.bind(this)}
							style={{ flex: 1, height: 30, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ccc' }}>
							<Text>拍照</Text>
						</TouchableOpacity>
						<Image style={{ width: 100, height: 100 }} source={this.state.icon} />
					</ScrollView>
				</BaseView>
			</View>
		);
	}
}
