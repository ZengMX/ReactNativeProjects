import React, { Component } from 'react';
import {
	View,
	Dimensions,
	Text,
	Image,
	TouchableOpacity,
	WebView,
	ScrollView,
	InteractionManager
} from 'react-native';
var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;
import _ from 'underscore';
import Styles from 'future/public/lib/styles/Styles';
import Fetch from 'future/public/lib/Fetch';
import { RefreshableListView, BaseView, Toast, } from 'future/public/widgets';
import styles from '../style/productDetailOther';
import config from 'future/public/config';
//产品参数
class Params extends Component {
	constructor(props) {
		super(props);
		this.state = ({
			messageList: null
		});
		this.renderRow = this._renderRow.bind(this);
		this.fetchData = this._fetchData.bind(this);
	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.fetchData()
		});
	}
	//获取数据
	_fetchData() {
		new Fetch({
			url: '/app/product/getParams.json',
			data: {
				productId: this.props.productId,
			},
		}).dofetch().then((data) => {
			this.setState({
				messageList: data.result
			});
		}).catch((err) => {
			console.log('=> catch: ', err);
		});
	}

	_renderRow(rowData) {
		return _.map(rowData, (item, index) => {
			return (
				<View key={"Cate" + index} style={{ flexDirection: 'row',height:45,alignItems:'center' }}>
					<Text style={{ color: '#aaaeb9', fontSize: 14, paddingLeft: 13, width: 94, }}>{index}</Text>
					<Text style={{ color: '#43474c', fontSize: 14, paddingLeft: 13 }}>{item ? item : "--"}</Text>
				</View>
			)
		})
	}
	render() {
		return (
			<View style={{ marginTop: 10 }}>{this.renderRow(this.state.messageList)}</View>
		)
	}
}
//资质文件
class Certificate extends Component {
	constructor(props) {
		super(props);
		this.state = ({
			messageList: null
		});
		this.renderRow = this._renderRow.bind(this);
		this.fetchData = this._fetchData.bind(this);
	}

	componentDidMount() {
		this.fetchData()
	}
	//获取数据
	_fetchData() {
		new Fetch({
			url: '/app/product/getCertificate.json',
			data: {
				productId: this.props.productId,
			},
		}).dofetch().then((data) => {			
			this.setState({
				messageList: data.result
			});
		}).catch((err) => {
			console.log('=> catch: ', err);
		});
	}

	_renderRow(rowData) {
		return _.map(rowData, (item, index) => {
			return (
				<View key={"Cate" + index} style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
					<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
						<View style={{width:30,height:1,backgroundColor:'#666'}}/>
						<Text style={{ color: '#333', fontSize: 14, paddingVertical: 15 ,marginHorizontal:5}}>
							{item.description}
						</Text>
						<View style={{width:30,height:1,backgroundColor:'#666'}}/>
					</View>
					<Image source={{ uri: item.cerImg }} style={{ width: 270*Styles.theme.IS, height: 190*Styles.theme.IS }}></Image>
				</View>
			)
		})
	}
	render() {
		return (
			<ScrollView style={{ height: screenHeight-50-64-45, width: screenWidth}}>				
				{this.renderRow(this.state.messageList)}
			</ScrollView>
		)
	}
}

export default class MyTickling extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isSelectTab1: true,
			isSelectTab2: false,
			isSelectTab3: false,			
		}

		this.onTabClick = this._onTabClick.bind(this);

	}
	_onTabClick(flag) {
		if (flag === '0') {
			this.setState({
				isSelectTab1: true,
				isSelectTab2: false,
				isSelectTab3: false,				
			});
		} if (flag === '1') {
			this.setState({
				isSelectTab1: false,
				isSelectTab2: true,
				isSelectTab3: false,				
			});
		} if (flag === '2') {
			this.setState({
				isSelectTab1: false,
				isSelectTab2: false,
				isSelectTab3: true,				
			});
		} 
	}
	render() {
		let source = null;
		let productParams = null;
		if (this.state.isSelectTab1 == true) {
			source = config.host + this.props.url			
		}
		if (this.state.isSelectTab3 == true) {
			source =  config.host + this.props.url
		}

		return (
				<View style={styles.container}>
					<View style={styles.tapView}>
						<TouchableOpacity activeOpacity={0.7}
							style={styles.leftBtnView}
							onPress={() => this.onTabClick('0')}>
							<View style={{  }}>								
									<Text style={[styles.text, this.state.isSelectTab1 ? { color: '#0082ff' } : { color: '#4b5963' }]}>商品详情</Text>								
							</View>
							<View style={[styles.tapBottom, this.state.isSelectTab1 ? { backgroundColor: '#0082ff' } : { backgroundColor: '#fff' }]}></View>
						</TouchableOpacity>
						<TouchableOpacity activeOpacity={0.7}
							style={styles.leftBtnView}
							onPress={() => this.onTabClick('1')}>
							<View style={{ }}>
								
									<Text style={[styles.text, this.state.isSelectTab2 ? { color: '#0082ff' } : { color: '#4b5963' }]}>产品参数</Text>
								
							</View>
							<View style={[styles.tapBottom, this.state.isSelectTab2 ? { backgroundColor: '#0082ff' } : { backgroundColor: '#fff' }]}></View>
						</TouchableOpacity>
						<TouchableOpacity activeOpacity={0.7}
							style={styles.leftBtnView}
							onPress={() => this.onTabClick('2')}>
							<View style={{ }}>								
									<Text style={[styles.text, this.state.isSelectTab3 ? { color: '#0082ff' } : { color: '#4b5963' }]}>资质文件</Text>
							</View>

							<View style={[styles.tapBottom, this.state.isSelectTab3 ? { backgroundColor: '#0082ff' } : { backgroundColor: '#fff' }]}></View>
						</TouchableOpacity>

					</View>
					{this.state.isSelectTab1 == true?					
						<WebView						 	
							ref="webView"
							automaticallyAdjustContentInsets={false}
							style={{ flex: 1 }}
							source={{uri: source}}
							javaScriptEnabled={true}
							domStorageEnabled={true}
							decelerationRate='normal'
							startInLoadingState={true}
							scalesPageToFit={true}
							/> :<View></View>}

					{this.state.isSelectTab2 == true ? <Params productId={this.props.productId}/> : <View></View>}
					{this.state.isSelectTab3 == true ? <Certificate productId={this.props.productId}/>: <View></View>}
				</View>
			
		);
	}

}



