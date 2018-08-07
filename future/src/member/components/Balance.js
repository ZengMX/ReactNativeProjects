import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	PixelRatio,
	InteractionManager,
	Platform
} from 'react-native';
import Fetch from 'future/public/lib/Fetch';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import { BaseView, RefreshableListView } from 'future/public/widgets';
import Detail from './Detail';
import Withdraw from './Withdraw';
import styles from '../styles/Balance';
const screenWidth = Dimensions.get('window').width;

class List extends Component {
	constructor(props) {
		super(props);
	}
	componentWillMount() {
		InteractionManager.runAfterInteractions(() => {
			this.refresh();
		})
	}

	refresh() {
		this.refs && this.refs.list && this.refs.list.pullRefresh();
	}

	fetchData(page, success, error) {
		let params = {}, url = '';
		switch (this.props.type) {
			case 0:
				params = {
					page: page,
					limit: 10
				};
				url = '/app/user/getPrestoreTransactionLogs.json';
				break;
			case 1:
				params = {
					pageNumber: page,
					pageSize: 10
				};
				url = '/app/user/prdCashWithdrawalRequestList.json';
				break;
			default:
				break;
		}
		new Fetch({
			url: url,
			data: params
		}).dofetch().then((data) => {
			if(this.props.type === 0) 
				success(data.result, 10 * page , data.totalCount);
			else
				success(data.result.result, 10 * page , data.result.totalCount);
		}).catch((error) => { 
			error && error();
			console.log('error', error) 
		})
	}
	renderRow(rowData, sectionID, rowID, highlightRow) {
		if (this.props.type == 0) {
			const textColor = rowData.transactionAmount > 0 ? '#13c76f' : '#333';
			var transactionTime = Date.parse(new Date()) - Date.parse(new Date(rowData.transactionTime)) > 86402000 ? rowData.transactionTime : rowData.transactionTime.split(' ')[1]
			return (
				<TouchableOpacity onPress={this.openDetail.bind(this,rowData)}>
					<View style={styles.itemWrap}>
						<View style={styles.itemView}>
							<Text style={styles.reasonTitle} numberOfLines={1}>{rowData.reason}</Text>
							<View style={styles.itemRightView}>
								<Text style={[styles.money, { color: textColor }]}>{rowData.transactionAmount > 0 ? '+￥' + rowData.transactionAmount : '-￥' + rowData.transactionAmount.toString().substr(1)}</Text>
								<Text style={styles.time}>{transactionTime}</Text>
							</View>
						</View>
					</View>
				</TouchableOpacity>
			)
		} else {
			var transactionTime = Date.parse(new Date()) - Date.parse(new Date(rowData.createDateString)) > 86402000 ? rowData.createDateString : rowData.createDateString.split(' ')[1];
			var amount = this.formatNumber(rowData.amount);
			return (
				<TouchableOpacity onPress={this.openDetail.bind(this,rowData)}>
					<View style={styles.itemWrap}>
						<View style={styles.itemView}>
							<View>
								<Text style={styles.userName} numberOfLines={1}>{rowData.bankUserName} {rowData.branchBank}</Text>
								<Text style={styles.reasonTitle}>{rowData.bankAccount.substr(0, 4) + '****' + rowData.bankAccount.substr(-4)}</Text>
							</View>
							<View style={styles.itemRightView}>
								<Text style={styles.userName}>￥{parseFloat(amount).toFixed(2)}</Text>
								<Text style={styles.time}>{transactionTime}</Text>
							</View>
						</View>
					</View>
				</TouchableOpacity>
			)
		}
	}

	//把金额加上逗号
	formatNumber(num) {
		if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(num)) {
			return num;
		}
		var a = RegExp.$1, b = RegExp.$2, c = RegExp.$3;
		var re = new RegExp("(\\d)(\\d{3})(,|$)");
		while (re.test(b)) b = b.replace(re, "$1,$2$3");
		return a + "" + b + "" + c;
	}

	//跳转到详情
	openDetail(rowData) {
		this.props.navigator.push({
			component: Detail,
			params: {
				data: rowData,
				currentPage: this.props.type
			}
		})
	}

	render() {
		return (
			<RefreshableListView
				ref='list'
				showsVerticalScrollIndicator={false}
				scrollRenderAheadDistance={100}
			    onEndReachedThreshold={200}
				contentInset={{ bottom: 0 }}
				initialListSize={1}
				autoLoadMore={true}
				fetchData={this.fetchData.bind(this)}
				renderRow={this.renderRow.bind(this)}
			/>
		)
	}
}

export default class Balance extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPage: 0,
			endAmount: 0,
		}
	}
	
	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.getEndAmount()
		})
	}

	getEndAmount() {
		new Fetch({
			url: '/app/user/getUserPreStoreAndintegral.json',
		}).dofetch().then((data) => {
			this.setState({endAmount: data.prestore})
		}).catch((error) => {
			console.log('error',error)
		})
	}

	//跳转到取现
	// openWithdraw() {
	// 	this.props.navigator.push({
	// 		component: Withdraw,
	// 		params: {
	// 			callBack: (endAmount) => {
	// 				this.setState({ endAmount })
	// 				if(this.state.currentPage == 0) {
	// 					this.refs  && this.refs.list0.refresh();
	// 				}else {
	// 					this.refs  && this.refs.list1.refresh();
	// 				}
	// 			}
	// 		}
	// 	})
	// }

	render() {
		return (
			<BaseView
				mainBackColor={{ backgroundColor: '#f5f5f5' }}
				ref={'base'}
				navigator={this.props.navigator}
				mainColor={'rgba(250,250,250,0.90)'}
				title={{ title: '账户余额', tintColor: '#333', fontSize: 18 }}
				statusBarStyle={'default'}
			>
				<View style={styles.flex}>
					<View style={[styles.bannerView, { marginBottom: 10 }]}>
						<Text style={styles.bannerTitle}>当前余额（元）</Text>
						<Text style={styles.bannerAmount}>{this.state.endAmount}</Text>
						{/* <View style={styles.buttonWrap}>
							<TouchableOpacity onPress={this.openWithdraw.bind(this)}>
								<View style={styles.button}>
									<Text style={styles.buttonTitle}>提现</Text>
								</View>
							</TouchableOpacity>
						</View> */}
					</View>
					<ScrollableTabView
						ref='scrollTab'
						tabBarBackgroundColor='#FAFAFA'
						tabBarInactiveTextColor='#4B5963'
						tabBarUnderlineColor='#0082FF'
						tabBarActiveTextColor='#0082FF'
						tabBarTextStyle={{ fontSize: 14, fontWeight: '700' }}
						onChangeTab={(obj) => { 
								this.setState({ currentPage: obj.i })
								switch(obj.i) {
									case 0:
										this.refs && this.refs.list0.refresh();
										break;
									case 1:
										this.refs && this.refs.list1.refresh();
									default: 
										break;		
								} 
							}}
						renderTabBar={() => 
							<ScrollableTabBar
								style={{ height: 42, borderWidth: 0 }}
								tabStyle={{ height: 35, width: (screenWidth / 2) - 60, flexDirection: 'row', }}
								tabsContainerStyle={{ height: 42 }}
								underlineHeight={3}
								underlineStyle={{ width: (screenWidth / 2) - 60 }}
							/>
						}
					>
						<List tabLabel="交易详情" type={0} ref='list0' navigator={this.props.navigator} />
						<List tabLabel="提现记录" type={1} ref='list1' navigator={this.props.navigator} />
					</ScrollableTabView>
				</View>
			</BaseView>
		)
	}
}