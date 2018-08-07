import React,{Component} from 'react';
import {
	Platform,
	Alert,
	BackAndroid,
	Linking,
	View,
	Modal,
	Dimensions,
	PixelRatio,
	Text,
	TouchableOpacity
} from 'react-native';
import Fetch from './Fetch';
import { Toast } from '../widgets';
import config from '../config';
import RootSiblings from 'react-native-root-siblings';
var elements = [];
var dimensW = Dimensions.get('window').width;

export default function (flag) {
	new Fetch({
		url: '/app/update.json',
		method: "POST",
		data: {
			"platformDeviceTypeCode": (Platform.OS == 'ios') ? 'ios-hand' : 'aos-hand',
			"versionNumber": config.version,
		},
	}).dofetch().then((data) => {
		if (data.result == null) {
			if (flag == true) {
				Toast.show("当前已是最新版本，无需更新！");
			}
		} else {
			checkUpdate(data.result);
		}
	});
}

function checkUpdate(upgrade) {
	//强制更新
	if (upgrade.isForcedUpdate == "Y") {
		MyAlert.show(
			()=>{
				if (upgrade.downLoadUrl) {
					Linking.openURL(upgrade.downLoadUrl);
					setTimeout(()=>{
						if(Platform.OS == 'android'){
							BackAndroid.exitApp();
						}
					},500)
				}
			}
		);
	} else {
		//可选更新
		Alert.alert('温馨提示', '发现新版本,为了您能够更好体验购物,请您更新版本。',
			[
				{ text: '取消', onPress: () => { } },
				{
					text: '更新', onPress: () => {
						if (upgrade.downLoadUrl) {
							Linking.openURL(upgrade.downLoadUrl);
						}
					}
				},
			]
		)
	}
}

class MyAlert extends Component {
	constructor(props) {
		super(props);
	}

	static show = (action) => {
		let sibling = new RootSiblings(
			<View style={{top: 0, flex: 1}}>
				<Modal animationType={'fade'}
					transparent={true}
					onRequestClose={()=>{
						BackAndroid.exitApp();
					}}
					visible={true}>
					<View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'}}>
						<View style={{width: dimensW * 3/4, height: dimensW * 3/8, backgroundColor: '#fff', borderRadius: 12}}>
							<View style={{flex: 7/10, alignItems: 'center', paddingHorizontal: 20}}>
								<Text style={{fontSize: 16, color: '#333', fontWeight: 'bold', marginTop: 20}}>温馨提示</Text>
								<Text style={{fontSize: 14, color: '#333', marginTop: 10, textAlign: 'center'}}>尊敬的客户，您当前使用版本已过期,无法使用,请您更新版本。</Text>
							</View>
							<View style={{height: 1 / PixelRatio.get(), backgroundColor: '#eee'}}/>
							<TouchableOpacity style={{flex: 3/10, justifyContent: 'center', alignItems: 'center'}} onPress={()=>{ action && action(); }}>
								<View style={{flex: 3/10, justifyContent: 'center', alignItems: 'center'}}>
									<Text style={{fontSize: 16, color: '#3a79c2'}}>更新</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</View>
		);
		elements.push(sibling);
		return sibling;
	};

	static hide = () => {
        let lastSibling = elements.pop();
        lastSibling && lastSibling.destroy();
    };

	componentWillMount(){
        this.show();
    }

    componentWillUnmount() {
        this.hide();
    }

    render() {
        return null;
    }
}