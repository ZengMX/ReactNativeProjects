/**
 * Created by timhuo on 2017/2/4.
 */
import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Dimensions,
	ScrollView,
	Platform,
	DeviceEventEmitter,
	findNodeHandle,
} from 'react-native';

import { Banner, BannerModule } from '@imall-test/react-native-banner';
import PhotoBrowser from '@imall-test/react-native-photobrowser';
import { BaseView } from 'future/src/widgets';
const { width } = Dimensions.get('window');

let images = [
	"https://ss2.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/super/whfpf%3D425%2C260%2C50/sign=a4b3d7085dee3d6d2293d48b252b5910/0e2442a7d933c89524cd5cd4d51373f0830200ea.jpg",
	"https://ss0.baidu.com/-Po3dSag_xI4khGko9WTAnF6hhy/super/whfpf%3D425%2C260%2C50/sign=a41eb338dd33c895a62bcb3bb72e47c2/5fdf8db1cb134954a2192ccb524e9258d1094a1e.jpg",
	"http://c.hiphotos.baidu.com/image/w%3D400/sign=c2318ff84334970a4773112fa5c8d1c0/b7fd5266d0160924c1fae5ccd60735fae7cd340d.jpg"
];
let images2 = [
	'http://www.xunyou.com/lols/images/pt/h8.jpg',
	'http://pic3.duowan.com/lol/1108/176309670191/176309716572.jpg',
	'http://pic.baike.soso.com/p/20121221/20121221110512-1500730455.jpg',
	'http://imgsrc.baidu.com/forum/w=580/sign=fa2d3b02bb315c6043956be7bdb0cbe6/16d88135e5dde7118a3cd4e1a0efce1b9c166171.jpg',
	'http://ossweb-img.qq.com/images/lol/appskin/40001.jpg',
	'http://pic.baike.soso.com/p/20121227/20121227110143-1798333393.jpg',
	'http://p14.qhimg.com/t010b9483d65484e048.jpg',
]

let locationX, locationY, bannerWidth, bannerHeight;       /**此处代码为点击图片时的缩放效果**/

export default class ADPage extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if (!IS_IOS) {
			this.listener = DeviceEventEmitter.addListener('onPageSelected', (event) => {
				BannerModule.setCurrentItem(event.position);
			});
		}
	}

	componentWillunMount() {
		this.listener && this.listener.remove();
	}

	showBig = (event) => {
		let index = event.nativeEvent.index; // 获取点击的图片索引
		if (IS_IOS) {
			let barner = findNodeHandle(this.barner);       //this.barner为Image的Component  设置ref={ barner =>{this.barner=barner}} 获取
			//传参修改，无顺序要求
			PhotoBrowser.browserWithUrlImages_ios({
				comArray: [parseFloat(barner)],         //（数组）  Component的 reactTag 的数组 （可与 url 数组数量不相等）,不传默认为空数组                             
				urls: images2,                          //（数组）  图片的 Url 的数组  (必须)
				index: index,                           //（Int）   点击的图片index 不传，默认为0
				start: index,                           //（Int）   参数一的第一个Component 对应的 图片 index  不传，默认为0
				detailCom: []                           //（数组）  扩展的内容的Component数组 不传，默认空数组
			});
		} else {
			this.barnerBox.measure((x, y, width, height, locationX, locationY) => {
				PhotoBrowser.browserWithUrlBanner_android({
					locationArray: [width, height, locationX, locationY],      /**位置数组**/
					urlArray: images2,                                         /**图片url数组**/
					position: index,                                           /**图片当前的索引，索引从0开始**/
					rnPageName: null,                                          /**是否要在原生嵌入RN页面。要嵌入就填js文件名称，如test.js就填test,在此之前需要生成test.bundle文件(生成bundle操作看下面)，如果不要嵌入RN页面此处填null**/
				});
			});
		}
	}

	render() {
		return (
			<BaseView navigator={this.props.navigator} ref={base => this.base = base}>
				<ScrollView>

					<Banner
						style={{ width: width, height: 200 }}
						bannerAnimation={"Default"}
						imageURLStringsGroup={images}
						pageControlAliment={'SDCenter'}
						onSelectBlock={(event) => {
							console.log('BannerIndex', event.nativeEvent.index);
						}}
						shadow={true}
						corner={10}
					/>

					<View
						ref={barnerBox => this.barnerBox = barnerBox}
						onLayout={(event) => {/*若没有onLayout回调，measure回调方法的数值都为undefind，搞不懂*/ }}
					>
						<Banner
							ref={barner => this.barner = barner}
							style={{ width: width, height: 400 }}
							bannerAnimation={"Card"}
							imageURLStringsGroup={images2}
							onSelectBlock={this.showBig}
							shadow={true}
							corner={20}
							falpha={0.3}
							onLayout={(event) => {
								locationX = event.nativeEvent.layout.x;
								locationY = event.nativeEvent.layout.y;
								bannerWidth = event.nativeEvent.layout.width;
								bannerHeight = event.nativeEvent.layout.height;
							}}
						/>
					</View>

				</ScrollView>
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
	},
	btnStyle: {
		padding: 10,
		backgroundColor: 'yellow'
	}
});