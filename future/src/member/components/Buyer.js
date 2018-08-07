import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	TouchableOpacity,
	Platform,
	Dimensions,
	Keyboard,
	ScrollView,
	InteractionManager,
} from 'react-native';
import {
	Toast,
	DataController,
	Loading,
	NavBar,
} from 'future/public/widgets';
import {
	Fetch,
	imageUtil,
} from 'future/public/lib';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/Member';
import styles from '../styles/Buyer';
import Setting from './Setting';
import AfterSaleService from './AfterSaleService';
//反馈中心
import FeedbackCenter from './FeedbackCenter';
//消息中心
import MessageCenter from './MessageCenter';
//订单列表
import OrderList from "future/src/order/components/OrderList";
//积分订单
import IntegralOrderPage from '../../order/components/IntegralOrderPage';
//采购计划
import PurchaseList from '../../purchase/components/PurchaseList';
//商家收藏
import ShopStore from './shopStore';
//账户积分
import Integral from './Integral';
//账户余额
import Balance from './Balance';
//常购品种
import ProcureProgram from '../../fastBuy/components/ProcureProgram';
//我的优惠券
import BuyerCoupons from 'future/src/member/components/BuyerCoupons';
import Login from '../../member/components/Login';
//我的供应商
import MySupplier from 'future/src/member/components/MySupplier';
//企业资料
import FillinforCompletes from 'future/src/member/components/FillinforCompletes';
//我的评价
import CommentList from 'future/src/product/components/CommentList';
var arrowImg = require('../res/Buyer/000xiangyousanjiao.png');

class Buyer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			orderNum: [],
			userInfo: null,
			userNameDisplay: true          //头像下面的那个用户名要不要显示
		};
		this.refreshSign = false;   // 刷新页面控制标志
	}

	componentDidMount() {
		console.log('componentDidMount', this.props);
		if (this.props.isLogin) {
			InteractionManager.runAfterInteractions(() => {
				this._loadData();
			});
		} else {
			this.toLogin();
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.focusTime != this.props.focusTime && !this.refreshSign && !this.props.isLogin) {
			this.toLogin();
		} else if (nextProps.isLogin && (nextProps.focusTime != this.props.focusTime && !this.refreshSign)) {
			InteractionManager.runAfterInteractions(() => {
				this._loadData();
			})
		}

	}

	toLogin = () => {
		this.refreshSign = true;
		this.props.navigator.push({
			component: Login,
			//以下两个参数同时存在时点击安卓物理返回键跳转到首页
			//具体实现可以查看navigator.js文件中的 onBackAndroid 方法广州国控
			name: 'Login',
			needToBackHome: 'true',
			params: {
				isFromTab: this.props.isFromTab ? true : false,
				callback: (status) => {
					if (status) {
						this.refreshSign = false;
					}
					InteractionManager.runAfterInteractions(() => {
						this.refreshSign = false;
					})
				}
			},
		});
	}

	openComponent(component, params) {
		this.refreshSign = true;
		setTimeout(() => {
			this.refreshSign = false;
			// console.log('改回之前的值');
		}, 0);
		if (this.props && this.props.navigator) {
			this.props.navigator.push({
				component: component,
				params: params != undefined ? params : {}
			})
		}
	}

	openComponentFun = (component, params) => {
		return () => {
			this.openComponent(component, params);
		}
	}


	// 加载需要的数据
	_loadData = () => {

		InteractionManager.runAfterInteractions(() => {

			if (this.props.isLogin) {
				this.props.actions.getUser();
				new Fetch({
					url: 'app/user/getUserOrderCount.json',
					method: 'POST',
				}).dofetch().then((data) => {
					console.log("订单需要的数据", data);
					let orderNum = [data.result.toPayTotalCount, data.result.toSendTotalCount, data.result.toReceiveTotalCount];
					this.setState({
						orderNum: orderNum
					});
				}).catch((err) => {
					console.log(err);
				});
			}

		});
	}

	_checkIsImage(url) {
		return url.indexOf('http') >= 0;
	}

	_winScroll = (event) => {

		if (event.nativeEvent.contentOffset.y > 97 && this.state.userNameDisplay === true) {
			this.setState({
				userNameDisplay: false
			})
		} else if (event.nativeEvent.contentOffset.y <= 97 && this.state.userNameDisplay === false) {
			this.setState({
				userNameDisplay: true
			})
		}
	}

	// 渲染订单分类
	_renderOrderCategory() {
		var category = [
			{
				icon: require('../res/Buyer/008daifukuan.png'), name: '待付款',
				component: OrderList, params: { page: 1 }
			},
			{
				icon: require('../res/Buyer/008daifahuo.png'), name: '待发货',
				component: OrderList, params: { page: 2 }
			},
			{
				icon: require('../res/Buyer/008daishouhuo.png'), name: '待收货',
				component: OrderList, params: { page: 3 }
			},
			{
				icon: require('../res/Buyer/008yiwancheng.png'), name: '已完成',
				component: OrderList, params: { page: 5 }
			},
			{
				icon: require('../res/Buyer/008shouhoufuwu.png'), name: '退货/售后',
				component: AfterSaleService, params: {}
			}
		];

		return category.map((e, i) => {
			return (
				<TouchableOpacity
					style={styles.orderCategoryItem}
					key={"category" + i}
					onPress={this.openComponentFun(e.component, e.params)}
				>
					<Image source={e.icon} style={styles.categoryItemImg} />
					<Text style={styles.categoryItemText}>{e.name}</Text>
					{
						this.state.orderNum[i] && this.state.orderNum[i] > 0 ? (
							<View style={styles.brage}>
								<Text style={[styles.brageText, this.state.orderNum[i] > 10 ? { fontSize: 9 } : null]}>{this.state.orderNum[i]}</Text>
							</View>
						) : null
					}
				</TouchableOpacity>
			);
		});
	}

	_renderList = () => {
		let list = [
			{
				icon: require('../res/Buyer/008jifen.png'),
				name: '积分订单',
				component: IntegralOrderPage,
				params: {}
			},
			{
				icon: require('../res/Buyer/008changgou.png'),
				name: '常购品种',
				component: ProcureProgram,
				params: { isFast: true, purchaseType: 1 }
			},
			{
				icon: require('../res/Buyer/008caigou.png'),
				name: '采购计划',
				component: PurchaseList,
				params: {}
			},
			{
				icon: require('../res/Buyer/008shouchang.png'),
				name: '商家收藏',
				component: ShopStore,
				params: {}
			}
		];

		return list.map((e, i) => {
			return (
				<TouchableOpacity style={styles.sectionItem} key={"list" + i}
					onPress={this.openComponentFun(e.component, e.params)}>
					<Image source={e.icon} style={styles.sectionIcon} />
					<Text style={styles.sectionTitle}>{e.name}</Text>
					<Image source={arrowImg} style={styles.arrowIcon} />
				</TouchableOpacity>
			);
		})
	}

	_renderRightButton = (userInfo) => {
		if (!userInfo)
			return <View />;
		return (
			<TouchableOpacity style={styles.navBtn}
				onPress={this.openComponentFun(MessageCenter)}>
				<Image source={require('../res/Buyer/000xiaoxi.png')} style={styles.navRightImg} />
				{
					userInfo.messageNum !== 0 ? <View style={styles.dot}></View> : null
				}
			</TouchableOpacity>
		);
	}

	_renderLeftButton = () => {
		return (
			<TouchableOpacity style={styles.navBtn}
				onPress={this.openComponentFun(Setting)}>
				<Image source={require('../res/Buyer/000shezhi.png')} style={styles.navLeftImg} />
			</TouchableOpacity>
		);
	}

	render() {
		const userInfo = this.props.userInfo;
		let userName = '';
		if(userInfo && userInfo.userName){
			userName =  userInfo.userName;
		}
		const defaultIcon = require('../res/Buyer/008touxiang.png');
		return (
			<View style={styles.page}>
				<Image source={require('../res/Buyer/008biaotibeijing.png')}
					style={styles.navBg}>
					<NavBar
						navigator={this.props.navigator}
						mainColor={'#00000000'}
						statusBarStyle={'light-content'}
						rightButton={this._renderRightButton(userInfo)}
						leftButton={this._renderLeftButton()}
						title={{ title: this.state.userNameDisplay ? '' : userName }} />
				</Image>
				<DataController data={userInfo}>
					{userInfo && (<ScrollView
						bounces={false}
						showsVerticalScrollIndicator={false}
						ref={(c) => { this.scrollvew = c }}
						scrollEventThrottle={10}
						onScroll={this._winScroll} >
						<View style={styles.header}>
							<Image source={require('../res/Buyer/008mingzibeijing.png')}
								style={styles.headerBg}>
								<View style={styles.headInfo}>
									<Image source={this._checkIsImage(userInfo.userIcon) ? imageUtil.get(userInfo.userIcon) : defaultIcon} style={styles.userImg} />
									<Text style={styles.userType}>{this.state.userNameDisplay ? userName : ' '}</Text>
									<Text style={styles.userName}>所属单位：{userInfo.unitNm}</Text>
								</View>
							</Image>
							<View style={styles.accountInfo}>
								<TouchableOpacity style={styles.accountWrap} activeOpacity={0.5}
									onPress={this.openComponentFun(Balance)}>
									<Text numberOfLines={1} style={styles.accountNum}>{userInfo.prestore}</Text>
									<Text style={styles.accountText}>账户余额</Text>
								</TouchableOpacity>
							
								<TouchableOpacity style={styles.accountWrap} activeOpacity={0.5}
									onPress={this.openComponentFun(Integral)}>
									<Text numberOfLines={1} style={styles.accountNum}>{userInfo.integral}</Text>
									<Text style={styles.accountText}>账户积分</Text>
								</TouchableOpacity>
								
								<TouchableOpacity style={styles.accountWrap} activeOpacity={0.5}
									onPress={this.openComponentFun(BuyerCoupons)}>
									<Text numberOfLines={1} style={styles.accountNum}>{userInfo.couponAmount}</Text>
									<Text style={styles.accountText}>优惠券</Text>
								</TouchableOpacity>
							</View>
						</View>
						<TouchableOpacity style={styles.myOrder}
							onPress={this.openComponentFun(OrderList)}>
							<Text style={styles.myOrderText}>我的订单</Text>
							<View style={styles.allOrder}>
								<Text style={styles.allOrderText}>全部订单</Text>
								<Image source={arrowImg} style={styles.arrowIcon} />
							</View>
						</TouchableOpacity>
						<View style={styles.orderCategory}>
							{this._renderOrderCategory()}
						</View>

						<View style={styles.section}>
							{this._renderList()}
						</View>

						<View>
							<TouchableOpacity style={styles.sectionItem}
								onPress={() => this.openComponent(CommentList)}>
								<Image source={require('../res/Buyer/008wodepingjia.png')} style={styles.sectionIcon} />
								<Text style={styles.sectionTitle}>我的评价</Text>
								<Image source={arrowImg} style={styles.arrowIcon} />
							</TouchableOpacity>
						</View>

						<View>
							<TouchableOpacity style={styles.sectionItem}
								onPress={() => this.openComponent(MySupplier, { sysUserId: this.props.userInfo.sysUserId })}>
								<Image source={require('../res/Buyer/008gonyinshan.png')} style={styles.sectionIcon} />
								<Text style={styles.sectionTitle}>我的供应商</Text>
								<Image source={arrowImg} style={styles.arrowIcon} />
							</TouchableOpacity>
						</View>

						<View style={[styles.section]}>
							<TouchableOpacity style={styles.sectionItem}
								onPress={() => {
									let buyerid = this.props.userInfo.buyersId;
									this.openComponent(FillinforCompletes, { buyersId: buyerid })
								}}>
								<Image source={require('../res/Buyer/008woziliao.png')} style={styles.sectionIcon} />
								<Text style={styles.sectionTitle}>企业资料</Text>
								<Image source={arrowImg} style={styles.arrowIcon} />
							</TouchableOpacity>
						</View>

						<View style={[styles.section, styles.mb20]}>
							<TouchableOpacity style={styles.sectionItem}
								onPress={() => this.openComponent(FeedbackCenter)}>
								<Image source={require('../res/Buyer/008fankui.png')} style={styles.sectionIcon} />
								<Text style={styles.sectionTitle}>反馈中心</Text>
								<Image source={arrowImg} style={styles.arrowIcon} />
							</TouchableOpacity>
						</View>

					</ScrollView>)}
				</DataController>


			</View>

		);
	}
}

//获取数据在下面添加
function mapStateToProps(state) {
	return {
		userInfo: state.Member.userInfo,
		isLogin: state.Member.isLogin,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Buyer);


