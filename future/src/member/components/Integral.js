import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	PixelRatio,
	InteractionManager
} from 'react-native';
import Fetch from 'future/public/lib/Fetch';
import { BaseView, RefreshableListView } from 'future/public/widgets';
import styles from '../styles/Integral';
import MallPoints from 'future/src/prdPoints/components/MallPoints';
import IntegralDetail from './IntegralDetail';

const screenWidth = Dimensions.get('window').width;

export default class Integral extends Component {
	constructor(props) {
		super(props);
		this.state = {
			totalIntegral: 0
		}
		this.fetchData = this.fetchData.bind(this);
		this._renderRow = this.renderRow.bind(this);
	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.refs.list && this.refs.list.pullRefresh();
			this.getTotaIntegral();
		});
	}

	getTotaIntegral = () => {
		new Fetch({
			url: '/app/user/getUserPreStoreAndintegral.json',
		}).dofetch().then((data)=>{
			this.setState({
				totalIntegral: data.integral
			})
		}).catch((err)=>{
			console.log(err);
		})
	}

	//跳转到详情
	openDetail(rowData) {
		this.props.navigator.push({
			component: IntegralDetail,
			params: {
				data: rowData,
			}
		})
	}

	fetchData(page, success, error) {
		new Fetch({
			url: '/app/user/getAccountTransactionLogs.json',
			data: {
				page: page,
				limit: 10
			}
		}).dofetch().then((data) => {
			
			success(data.result, (page - 1) * 10 + data.result.length, data.totalCount)
		}).catch((error) => {
			console.log('error', error)
		})
	}

	renderRow(rowData, sectionID, rowID, highlightRow) {
		const textColor = rowData.transactionAmount > 0 ? '#13c76f' : '#333';
		const transactionTime = Date.parse(new Date()) - Date.parse(new Date(rowData.transactionTime)) > 86402000 ? rowData.transactionTime : rowData.transactionTime.split(' ')[1];
		return (
			<TouchableOpacity onPress={this.openDetail.bind(this,rowData)}>
				<View style={styles.itemWrap}>
					<View style={styles.itemView}>
						<View style={styles.titleView}>
							<Text style={styles.title} numberOfLines={1}>{rowData.reason}</Text>
						</View>
						<View style={styles.itemRightView}>
							<Text style={[styles.money,{color: textColor}]}>{rowData.transactionAmount > 0 ? '+' + rowData.transactionAmount : rowData.transactionAmount}</Text>
							<Text style={styles.time}>{transactionTime}</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		)
	}
	render() {
		return (
			<BaseView
				mainBackColor={{ backgroundColor: '#f5f5f5' }}
				ref={'base'}
				navigator={this.props.navigator}
				mainColor={'rgba(250,250,250,0.90)'}
				title={{ title: '账户积分', tintColor: '#333', fontSize: 18 }}
				statusBarStyle={'default'}
			>
				<View style={styles.flex}>
					<View style={styles.bannerView}>
						<Text style={styles.bannerTitle}>当前积分</Text>
						<Text style={styles.bannerAmount}>{this.state.totalIntegral}</Text>
						<View style={styles.buttonWrap}>
							<TouchableOpacity onPress={()=>{
								let navigator = this.props.navigator;
								if(navigator){
									navigator.push({
										component: MallPoints,
									})
								}
							}}>
								<View style={styles.button}>
									<Text style={styles.buttonTitle}>积分兑换商品</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
					<Text style={styles.tip}>积分记录</Text>
					<RefreshableListView
						ref={"list"}
						renderRow={this._renderRow}
						fetchData={this.fetchData}
						scrollRenderAheadDistance={100} //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行。
						pageSize={10} // 每次事件循环（每帧）渲染的行数。
						initialListSize={1}
						onEndReachedThreshold={200}
					/>
				</View>
			</BaseView>
		)
	}
}