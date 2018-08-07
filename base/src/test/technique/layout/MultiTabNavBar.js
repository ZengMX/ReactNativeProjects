/**
 * 这里演示
 * 1.自定义导航栏
 * 2.导航栏包含TAB，并兼容两个平台
 */
import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	Dimensions,
	TouchableOpacity,
	Platform,
} from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import { BaseView, CoustomTabBar } from 'future/src/widgets';

var dimensW = Dimensions.get('window').width;
var dimensH = Dimensions.get('window').height;

export default class ProductDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPage: 0,
		}
	}

	renderTabBar() {
		return (<ScrollableTabBar
			activeTextColor='#fff'
			inactiveTextColor='#000'
			underlineStyle={{ backgroundColor: '#fff', height: 2, width: (dimensW - 160) / 3 }}
			tabStyle={{
				paddingLeft: 0,
				paddingRight: 0,
				width: (dimensW - 160) / 3,
				height: 30,
				backgroundColor: 'rgba(0,0,0,0)'
			}}
			tabsContainerStyle={{
				height: 30,
				width: dimensW - 160,
				borderWidth: 0,
				alignItems: 'center'
			}}
			style={{
				position: 'absolute',
				left: 80,
				right: 80,
				top: -38,
				height: 30,
				borderWidth: 0,
			}}
		/>);
	}

	render() {
		let head = <View style={{ backgroundColor: '#f00' }} />, rightButton;

		if (Platform.OS == 'android') {
			head = <CoustomTabBar
				page={this.state.currentPage}
				tabs={['商品', '详情', '评价']}
				onChangeTab={(page) => {
					this.refs.scrollTab.goToPage(page);
					this.setState({ currentPage: page })
				}}
			/>
		}

		{/*右上角的按钮*/ }
		rightButton = (
			<View style={{ marginTop: 5, right: 10, flexDirection: 'row' }}>
				<TouchableOpacity style={{ marginTop: 5 }} onPress={() => {
					RCTDeviceEventEmitter.emit('changeTabBarIdx', { idx: 0, goTop: true });
				}}>
					<View style={{}}>
						<Image source={require('./res/002shouye.png')} style={{ width: 24, height: 22 }} />
					</View>
				</TouchableOpacity>
			</View>
		);

		return (
			<BaseView
				style={[layout.ver, { backgroundColor: '#fff' }]}
				navigator={this.props.navigator}
				head={head}
				rightButton={rightButton}
			>

				<ScrollableTabView ref='scrollTab'
					tabBarTextStyle={{ fontSize: 12 }}
					renderTabBar={Platform.OS == 'android' ? false : this.renderTabBar}
					page={this.state.currentPage}
					onChangeTab={(page) => {
						if (this.state.currentPage != page.i) {
							this.setState({ currentPage: page.i })
						}
					}}
				>
					<View style={{ flex: 1 }} tabLabel="商品"><Text>商品</Text></View>
					<View style={{ flex: 1 }} tabLabel="详情"><Text>详情</Text></View>
					<View style={{ flex: 1 }} tabLabel="评价"><Text>评价</Text></View>
				</ScrollableTabView>
			</BaseView>
		);
	}
}