import React, { Component } from 'react';
import {
	View,
	Text,
} from 'react-native';
// 热更新，在Index页面，网速慢App启动时会卡住
import codePush from "react-native-code-push";
import { BoxShadow } from 'react-native-shadow';
import { BaseView } from 'future/src/widgets';
// 引入本组件样式
import styles from '../styles/Home';

export default class Home extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		// 热更新 
		codePush.sync();
	}

	test = () => {

	}
	render() {
		const shadowOpt = {
			width: 100,//阴影width
			height: 100,//阴影height
			color: "#f00",//阴影颜色
			border: 1,//阴影圆边框
			radius: 0,//阴影圆角度
			opacity: 0.1,//阴影透明度
			x: 10,//x轴偏移量
			y: 10,//y轴偏移量
			style: { marginVertical: 5 } //阴影style
		}

		return (
			<BaseView
				ref={base => this.base = base}
				navigator={this.props.navigator}
				style={styles.container}
				title={{ title: '欢迎', tintColor: '#fff' }}
				showNavBar={true}
			>
				<BoxShadow setting={shadowOpt}>
					<View style={{ width:100,height:100,backgroundColor:'#fff',justifyContent:'center',alignItems:'center'}}>
						<Text style={{ fontSize: 12 }}>
							乐商欢迎你!
					    </Text>
					</View>
				</BoxShadow>
			</BaseView>
		);
	}
}