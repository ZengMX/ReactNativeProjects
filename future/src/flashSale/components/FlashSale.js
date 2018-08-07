import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  PixelRatio,
} from 'react-native';
import FlashSaleList from './FlashSaleList';
import {BaseView,RefreshableListView,Timeable,} from "future/public/widgets";
import styles from "../styles/FlashSale";
import {
	Fetch,
	imageUtil,
} from 'future/public/lib';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import MoreOperation from '../../commons/moreOperation/components/MoreOperation';
import FlashSaleProductDetail from "./FlashSaleProductDetail";
import ProductDetail from 'future/src/product/components/ProductDetail';

var fullWidth = require('Dimensions').get('window').width;

class TimeBack extends Timeable {
	constructor(props) {
		super(props);
	}

	formatTime(num) {
		if (num < 10) {
			return '0' + num;
		} else {
			return num.toString();
		}
	}

	renderSelfStyle(day, hour, minute, second) {
		let dayStr, hourStr, minuteStr, secondStr, timeStr;
		dayStr = day ? day + '天' : '',
			hourStr = (dayStr || hour) ? hour + '小时' : '',
			minuteStr = (dayStr || hourStr || minute) ? minute + '分钟' : '',
			secondStr = (dayStr || hourStr || minuteStr || second) ? '' : '活动已结束';
		timeStr = secondStr;
		if (timeStr !== '活动已结束') {
			if (dayStr===''){
				timeStr = '仅剩' + '小于1天';
			}else {
				timeStr = '仅剩' + dayStr;
			}
		}
		return (
			<View style={styles.leftListItemBottom_info}>
				<Text style={styles.leftListItemBottom_leftTime}>
					{timeStr}
				</Text>
			</View>
		)
	}
}

export default class FlashSale extends Component {
    constructor(props) {
        super(props);
        this.state = {
			currentPage: 0,
		}
    }
	//?pageNumber=1&pageSize=10
    componentDidMount(){
		//  new Fetch({
			// url: '/app/promotion/panicBuyActivity/findPanicBuyPage.json?pageNumber=1&pageSize=10',
			// method: 'POST',
			// credentials:'same-origin',
			// method: 'GET',
			// headers:{
			// 	'Accept':'application/json',
			// 	'Content-Type': 'application/json',
			// },
            // bodyType: 'json',
			// data: {
			// 	pageNumber : 1,
			// 	pageSize : 10,
            // }
		// }).dofetch().then((data) => {
            
		// }).catch((error)=>{
		// 	console.log('=====>错误 CATCH>>',error);
		// });
    }
	renderRightButton(){
		return (
			<View style={{ justifyContent: 'center' }}>
				<MoreOperation
					navigator={this.props.navigator}
					order={
						[{
							module: 'index',
						}, {
							module: 'search',
						}, {
							module: 'message',
						}, {
							module: 'mine',
						}]
					}
					/>
			</View>
		)
	}
    componentWillReceiveProps(nextProps){
    }
    render(){
        return(
            <BaseView navigator={this.props.navigator} 
			    scrollEnabled={false} 
				ref='base' 
				mainColor={'#FAFAFA'}
                title={{ title: '限时抢购', tintColor: '#333333', fontSize: 18 }}
				rightButton={this.renderRightButton()}
             >
                <ScrollableTabView ref='scrollTab'
					page={this.state.currentPage}
					onChangeTab={(page) => {
						this.state.currentPage != page.i && this.setState({ currentPage: page.i })
					}}
					tabBarTextStyle={{ fontSize: 14 }}
					renderTabBar={() => (
						<ScrollableTabBar
							activeTextColor='#34457D'
							inactiveTextColor='#4B5963'
							underlineColor='#34457D'
							underlineHeight={2}
							tabStyle={styles.tabItem}
							tabsContainerStyle={{ backgroundColor: "#fff" }}
							style={styles.scrollTabBar}
						/>
					)}>
					<LeftList ref="leftList" tabLabel="限时活动" navigator={this.props.navigator}></LeftList>
					<RightList ref="rightList" tabLabel="一口价" navigator={this.props.navigator}></RightList>
				</ScrollableTabView>
            </BaseView>
        )
    }
}

class LeftList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			leftSeconds: this.props.leftSeconds,
			countdown: {
				dayStr: 0,
				hourStr: 0,
				minuteStr: 0,
				secondStr: 0,
			}
		}
	}

	fetchData(page, success, error) {
		new Fetch({
			url: '/app/promotion/panicBuyActivity/findPanicBuyPage.json',
			data: {
				pageNumber: page,
				pageSize: 10,
			}
		}).dofetch().then((data) => {
			success(data.result, 5 * (page - 1) + data.result.length, data.result.length)
		}).catch((error)=>{
			error && error();
			console.log('=====>错误 CATCH>>',error);			
		});
	}
	_goLimitActivityDetail(id) {
		this.props.navigator.push({
			params: {
				activityId: id,
			},
			component: LimitActivityDetail
		});
	}

	_getCountDownTime(leftSeconds){
		this.state.countdown.dayStr = Math.floor(leftSeconds / (60 * 60 * 24 ));
		this.state.countdown.hourStr = Math.floor((leftSeconds - this.state.countdown.dayStr * 24 * 60 * 60 ) / 3600);
		this.state.countdown.minuteStr = Math.floor((leftSeconds - this.state.countdown.dayStr * 24 * 60 * 60 - this.state.countdown.hourStr * 3600) / 60);
		this.state.countdown.secondStr = Math.floor(leftSeconds - this.state.countdown.dayStr * 24 * 60 * 60 - this.state.countdown.hourStr * 3600 - this.state.countdown.minuteStr * 60);
		if (this.state.countdown.hourStr < 10) {
			this.state.countdown.hourStr = "0" + this.state.countdown.hourStr.toString();
		}
		if (this.state.countdown.minuteStr < 10) {
			this.state.countdown.minuteStr = "0" + this.state.countdown.minuteStr.toString();
		}
		if (this.state.countdown.secondStr < 10) {
			this.state.countdown.secondStr = "0" + this.state.countdown.secondStr.toString();
		}
	}

	goToFlashList(rowData){
		this.props.navigator.push({
			component:FlashSaleList,
			params:rowData
		});
	}

	renderRow(rowData) {
		this._getCountDownTime((rowData.activityEndTime-rowData.activityStartTime)/1000)
		// let activityImage = imageUtil.get(rowData.imageUrlMap.img580X248);
		var content = (
			<View>
				<TouchableOpacity onPress={this.goToFlashList.bind(this,rowData)}>
                <View style={styles.activityImageView}>
					<Image source={imageUtil.get(rowData.activeImg)} style={styles.activityImage} resizeMode={'contain'} />
                </View>
				<View style={styles.leftListItemBottom}>
                    <View style={styles.leftListItemBottom_info}>
						<Text style={styles.leftListItemBottom_dic}>{rowData.discountRequirement}折起</Text>   
						<Text style={styles.leftListItemBottom_Nm}>{rowData.activityNm}</Text>
					</View>
					<TimeBack
						ref='time'
						autoStart={true}
						time={rowData.activityEndTime-Date.now()}
						callback={() => {
							
						}}
					/>
                </View>
				</TouchableOpacity>
			</View>

		);
		return content;
	}

	render() {
		return (
			<RefreshableListView
				style={styles.listStyle}
				ref="list"
				autoRefresh={true}
				fetchData={this.fetchData.bind(this)}
				renderRow={this.renderRow.bind(this)}
			/>
		)
	}
}

class RightList extends Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	fetchData(page, success, error) {
		new Fetch({
			url: '/app/promotion/skuDiscountRule/findSpecialPriceProductPage.json',
			data: {
				pageNumber: page,
				pageSize: 10,
			},
		}).dofetch().then((data) => {
			if(data.result){
	            success(data.result, 5 * (page - 1) + data.result.length, data.result.length)
			}
		}).catch((error)=>{
			error && error();
			console.log('=====>错误 CATCH>>',error);
		});
	}
	_goLimitActivityDetail(id) {
		this.props.navigator.push({
			params: {
				activityId: id,
			},
			component: LimitActivityDetail
		});
	}
	goToProductDetail(prdId){
		this.props.navigator.push({
			component: ProductDetail,
			params: {
				productId: prdId
			}
		})
	}
	renderRow(rowData) {
		// let activityImage = imageUtil.get(rowData.imageUrlMap.img580X248);
		console.log('>>>>>>>>>',rowData);
        let oldPrice = rowData.oldPrice?rowData.oldPrice:0;
        let boxWidth = (fullWidth-5)/2;
        oldPrice = parseFloat(oldPrice).toFixed(2);
		var content = (
			<TouchableOpacity
				onPress={this.goToProductDetail.bind(this,rowData.skuId)}
			>
				<View style={{width: boxWidth,height:boxWidth+100,backgroundColor:'#fff',marginTop:10,}}>
					<Image
						source={imageUtil.get(rowData.picUrl)}
						style={{width:  boxWidth, height:  boxWidth, marginBottom:10,}}
						resizeMode={'contain'}
					/>
					<Text style={{color:'#333',fontSize:15,paddingHorizontal:10,}} numberOfLines={1}>{rowData.productNm}</Text>
					<View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10,paddingHorizontal:10,marginBottom:10,}}>
						<Text style={{fontSize:12,color:'#f60',}} numberOfLines={1}>一口价 ￥ {rowData.priceStr}</Text>
						<Text style={{fontSize:11,color:'#999',textDecorationLine:'line-through'}} numberOfLines={1}>￥{oldPrice}</Text>
					</View>
					<View style={{flexDirection:'row', marginLeft:10,width: boxWidth - 21, height:25, borderWidth: 2/PixelRatio.get(), borderColor:'#34457D',borderRadius: 2,overflow:'hidden',}}>
						<View style={{width: (boxWidth-21)/2, height:25, justifyContent:'center',alignItems:'center',}}>
							<Text style={{fontSize:10,color:'#34457D',}}>已抢{rowData.sellAmount}件</Text>
						</View>
						<View style={{width: (boxWidth-21)/2, height:25, justifyContent:'center',alignItems:'center', backgroundColor:'#34457D'}}>
							<Text style={{fontSize:13,color:'#fff',}}>一口价抢</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>

		);
		return content;
	}

	render() {
		return (
			<RefreshableListView
				ref="list"
                listWidth={fullWidth}
				autoRefresh={true}
				fetchData={this.fetchData.bind(this)}
				renderRow={this.renderRow.bind(this)}
                contentContainerStyle={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',alignItems:'flex-start',}}
                style={{ backgroundColor:'#f9f9f9',}}
			/>
		)
	}
}


