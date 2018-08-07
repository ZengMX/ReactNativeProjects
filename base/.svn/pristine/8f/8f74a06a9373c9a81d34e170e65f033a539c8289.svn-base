/**
 * Created by timhuo on 2017/2/4.
 * 不结合react-native-banner，两种平台要用不同的方法实现大图浏览
 * IOS仍用react-native-photobrowser
 * 使用此组件有两个层：底部图片层和上部自定义层，两层内数组长度可不相等,自定义层一般用于图片说明，可用空数组代替
 */
import React, { Component } from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	findNodeHandle,
	Image,
} from 'react-native';
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';
import PhotoBrowser from '@imall-test/react-native-photobrowser'

// 构造图片数组
const images = [
	'http://www.xunyou.com/lols/images/pt/h8.jpg',
	'http://pic3.duowan.com/lol/1108/176309670191/176309716572.jpg',
	'http://pic.baike.soso.com/p/20121221/20121221110512-1500730455.jpg',
	'http://imgsrc.baidu.com/forum/w=580/sign=fa2d3b02bb315c6043956be7bdb0cbe6/16d88135e5dde7118a3cd4e1a0efce1b9c166171.jpg',
	'http://ossweb-img.qq.com/images/lol/appskin/40001.jpg',
	'http://pic.baike.soso.com/p/20121227/20121227110143-1798333393.jpg',
	'http://p14.qhimg.com/t010b9483d65484e048.jpg',
];

// IOS在大图说明数组，成员为组件，可自定义，显示对应图片上面(index对应)
const explain = [
	<Text style={{ color: '#fff' }}>11111111111111</Text>,
	<Text style={{ color: '#fff' }}>22222222222222</Text>,
	<Text style={{ color: '#fff' }}>33333333333333</Text>,
	<Text style={{ color: '#fff' }}>44444444444444</Text>
];

export default class PhotoPage extends Component {
	constructor(props) {
		super(props);
	}

	showBig = () => {
		if (IS_IOS) {
			let com = findNodeHandle(this.com2);       //this.com为Image的Component  设置ref={(com)=>{this.com=com}} 获取
			PhotoBrowser.browserWithUrlImages_ios({
				comArray: [parseFloat(com)],           //参数一：（数组）  Component的 reactTag 的数组 （可与 url 数组数量不相等）
				urls: images,                          //参数二：（数组）  图片的 Url 的数组
				index: 1,                              //参数三：（Int）  点击的图片index
				start: 1,                              //参数四：（Int）  扩展的内容Component数组的index
				detailCom: explain                     //参数五：（数组）  扩展的内容Component数组
			});
		} else {
			this.barnerBox.measure((x, y, width, height, locationX, locationY) => {
				PhotoBrowser.browserWithUrlBanner_android({
					locationArray: [width, height, locationX, locationY],     /**位置数组**/
					urlArray: images,                                         /**图片url数组**/
					position: 1,                                              /*图片当前的索引，索引从0开始*/
					rnPageName: null,                                         /**是否要在原生嵌入RN页面。要嵌入就填js文件名称，如test.js就填test,在此之前需要生成test.bundle文件(生成bundle操作看下面)，如果不要嵌入RN页面此处填null**/
				});
			});
		}
	}

	render() {
		return (
			<BaseView navigator={this.props.navigator} ref={base => this.base = base}>

				<TouchableOpacity
					ref={barnerBox => this.barnerBox = barnerBox}
					onLayout={(event) => {/*若没有onLayout回调，measure回调方法的数值都为undefind，搞不懂*/ }}
					style={{ padding: 20, backgroundColor: 'yellow' }}
					onPress={this.showBig}>
					<Image
						style={{ width: 200, height: 100 }}
						ref={com2 => { this.com2 = com2 }}
						source={{ uri: 'http://ww3.sinaimg.cn/large/006ka0Iygw1f6bqm7zukpj30g60kzdi2.jpg' }} />
				</TouchableOpacity>

			</BaseView>
		);
	}
}
