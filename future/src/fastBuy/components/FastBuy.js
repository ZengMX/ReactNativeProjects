import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	PixelRatio,
	InteractionManager,
} from 'react-native';

import _ from 'underscore';
import { Fetch, ValidateUtil } from 'future/public/lib/';
import { RefreshableListView, BaseView, Toast, MaskModal, TextInputC, Separator } from 'future/public/widgets';

import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import * as shoppingCartActions from 'future/public/src/shoppingCart/actions/ShoppingCart';

import KeyboardSpacer from 'react-native-keyboard-spacer';

import styles from '../styles/FastBuy';
import FastBuySearch from './FastBuySearch';
import ProcureProgram from './ProcureProgram';
import Login from '../../member/components/Login';


class FastBuy extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchField: '',
			rowData: {},
			value: null,
			purchaseTemplateCount: 0,
			purchaseListCount: 0,
			orderClient: null,
		}

		this.refreshSign = false;   // 刷新页面控制标志
	}

	// 判断是否登录并获取相应数据
	componentDidMount() {
		if (this.props.isLogin) {
			if (this.props.userType == '1' && !this.state.orderClient) {
				setTimeout(() => {
					this.props.navigator.push({
						component: SelectOrderClient,
						params: {
							setOrderClient: (orderClient) => { this.setOrderClient(orderClient) }
						}
					})
				}, 500);
			}

			if (this.props.userType !== '1') {
				this.fetchFastBuyIndex();
			}
		} else {
			this.toLogin();
		}
	}

	toLogin = () =>{
        this.refreshSign = true;
        this.props.navigator.push({
            component: Login,
            //以下两个参数同时存在时点击安卓物理返回键跳转到首页
            //具体实现可以查看navigator.js文件中的 onBackAndroid 方法
            name: 'Login',
            needToBackHome: 'true',
            params:{
                isFromTab:this.props.isFromTab?true:false,
                callback: (status)=>{
                    if(status){
                        this.refreshSign = false;
                    }
                    InteractionManager.runAfterInteractions(()=>{
                        this.refreshSign = false;
                    })
                }
            },
        });
    }

	//切换tab重新获取数据
	componentWillReceiveProps(nextProps) {
        if(nextProps.focusTime != this.props.focusTime && !this.refreshSign && !this.props.isLogin){
            this.toLogin();
        }else if (nextProps.isLogin && (nextProps.focusTime != this.props.focusTime && !this.refreshSign)) {
            InteractionManager.runAfterInteractions(()=>{
                this.reloadFastBuyIndex();
            })
        }

		// if (nextProps.focusTime != this.props.focusTime) {
		// 	this.reloadFastBuyIndex();
		// }
	}

	//重新获取采购计划和常购品种数据
	reloadFastBuyIndex() {
		// （业务员与其它角色执行不同方法）
		this.props.userType == "1" ? this.fetchSomeData() : this.fetchFastBuyIndex();
	}

	//获取采购计划和常购品种数据（不需选择代理客户）
	fetchFastBuyIndex() {
		new Fetch({
			// url: '/app/fastBuy/fastBuyIndex/count.json',
			url: '/app/fastBuy/count.json',
			method: "POST",
		}).dofetch().then((data) => {
			if (data) {
				this.setState({
					purchaseListCount: data.purchaseListCount,
					purchaseTemplateCount: data.purchaseTemplateCount
				})
			}
		}).catch((err) => {
			console.log('获取速购页面数据失败：', err);
		});
	}

	//获取采购计划和常购品种数据（用于选择代理回调）
	fetchSomeData() {
		if (!this.state.orderClient || !this.state.orderClient.mainAccountSysUserId) { return; }
		new Fetch({
			url: '/app/fastBuy/fastBuyIndex.json',
			method: "POST",
			data: {
				selectedUserId: this.state.orderClient.mainAccountSysUserId
			}
		}).dofetch().then((data) => {
			if (data) {
				this.setState({
					purchaseListCount: data.purchaseListCount,
					purchaseTemplateCount: data.purchaseTemplateCount
				})
			}
		}).catch((err) => {
			console.log('=> catch: ', err);

			Toast.show("请求失败")
		});
	}

	goToPurchaseTemplateDetail(){
		new Fetch({
            url: 'app/fastBuy/purchaseTemplateList.json',
            data: 0
        }).dofetch().then((data) => {
			this.refs.topModal.hide();
			this.refreshSign = true;
			setTimeout(() => {
				this.refreshSign = false;
			},0)
			this.props.navigator.push({
				component: ProcureProgram,
				params: {
					purchaseType:0,
					purchaseTemplateId:data.result[0].purchaseTemplateId,
					callback: () => {
						this.reloadFastBuyIndex();	//业务员速购进入购物车回调
					}
				}
			});
        }).catch((err) => {
            console.log("采购计划数据获取错误：", err);
        });
	}

	//点击加号的弹出层
	renderTopModal() {
		// 改变界面颜色和行为
		let purchaseTemplateColor = this.state.purchaseTemplateCount == 0 ? '#999' : '#5591FA';
		let purchaseListColor = this.state.purchaseListCount == 0 ? '#999' : '#13C76F';

		return (
			<View style={styles.modal}>
				<TouchableOpacity style={styles.modalBox} activeOpacity={this.state.purchaseTemplateCount == 0 ? 1 : 0.7} onPress={() => {
					if (this.state.purchaseTemplateCount == 0) {
						return
					} else {
						this.goToPurchaseTemplateDetail();
					}
				}}>
					<View style={[styles.modalNumBox, { backgroundColor: purchaseTemplateColor }]}>
						<Text style={styles.modalNum}>{this.state.purchaseTemplateCount}</Text>
					</View>
					<Text style={styles.modalTitle}>采购计划</Text>
					<Text style={styles.modalExplain} numberOfLines={2}>采购计划可按照不同的商品类型进行归类，定时的采购</Text>
					<View>
						<View style={[styles.modalBtn, { borderColor: purchaseTemplateColor, overflow: 'hidden', borderWidth: 2/PixelRatio.get()}]}>
							<Text style={[styles.modalBtnTitle, { color: purchaseTemplateColor }]}>前往采购</Text>
						</View>
					</View>
				</TouchableOpacity>

				<TouchableOpacity style={styles.modalBox} activeOpacity={this.state.purchaseListCount == 0 ? 1 : 0.7} onPress={() => {
					if (this.state.purchaseListCount == 0) {
						return
					} else {
						this.refs.topModal.hide()
						this.refreshSign = true;
						setTimeout(() => {
							this.refreshSign = false;
						},0)
						this.props.navigator.push({
							component: ProcureProgram,
							params: {
								isFast: true,
								purchaseType:1,
								callback: () => {
									this.reloadFastBuyIndex();	//业务员速购进入购物车回调
								}
							}
						})
					}
				}} >
					<View style={[styles.modalNumBox, { backgroundColor: purchaseListColor,}]}>
						<Text style={styles.modalNum}>{this.state.purchaseListCount}</Text>
					</View>
					<Text style={styles.modalTitle}>常购品种</Text>
					<Text style={styles.modalExplain} numberOfLines={2}>常购品种可根据运营情况不定时不定量的采购</Text>
					<View>
						<View style={[styles.modalBtn, { borderColor: purchaseListColor, overflow: 'hidden', borderWidth: 2/PixelRatio.get() }]}>
							<Text style={[styles.modalBtnTitle, { color: purchaseListColor }]}>前往采购</Text>
						</View>
					</View>
				</TouchableOpacity>

				<TouchableOpacity style={styles.modalClose} onPress={() => { this.refs.topModal.hide() }}>
					<Image style={styles.modalCloseImg} source={require('../res/images/011guanbi.png')} />
				</TouchableOpacity>
			</View>
		);
	}

	//选择订单客户回调
	setOrderClient(orderClient) {
		this.setState({
			orderClient: orderClient
		});
		setTimeout(() => { this.fetchSomeData(); this.props.actions.getCart() }, 500);
	}


	render() {

		let rightButton =
			<TouchableOpacity
				style={{ height: 44, justifyContent: 'center',alignItems:'center' }}
				onPress={() => { this.refs.topModal.show(); }}
				activeOpacity={0.7}>
				<Image style={{ height: 44,}} source={require('../res/images/000jia.png')}></Image>
			</TouchableOpacity>;

		return (
			<BaseView
				ref='base'
				scrollEnabled={false}
				navigator={this.props.navigator}
				title={{ title: '速购 ', tintColor: '#fff' }}
				rightButton={rightButton}
				hideLeftBtn={true/*TODO:完成后改为true*/}
				mainColor={'#34457D'}
				statusBarStyle={'light-content'}  // 状态栏样式
			>

				<View style={{ height: 50, backgroundColor: '#34457D' }}>
					<TouchableOpacity
						activeOpacity={0.7}	
						onPress={() => {
							this.refreshSign = true;
							setTimeout(() => {
								this.refreshSign = false;
							},0)
							this.props.navigator.push({ component: FastBuySearch })
						} }
						style={{ marginHorizontal: 10, marginTop: 6, marginBottom: 14, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5, height: 30 }}>
						<Image source={require('future/public/commons/res/000sousuo.png')} style={{ resizeMode: 'contain', width: 15, height: 15 }} />
						<Text style={{ marginLeft: 7, color: '#73777C', fontSize: 13 }} >请输入药品名／厂家／准字号</Text>
					</TouchableOpacity>
				</View>

				<View style={{ justifyContent: 'center', alignItems: 'center' }}>
					<Text style={{ fontSize: 14, color: '#AAAEB9', marginVertical: 40 }}>更多关键字</Text>
					<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
						<Text style={{ fontSize: 13, color: '#AAAEB9' }}>品种全称</Text>
						<Separator type='ver' width={1} color='#D0D3DB' style={{ marginHorizontal: 20 }} />
						<Text style={{ fontSize: 13, color: '#AAAEB9' }}>品种首字母</Text>
						<Separator type='ver' width={1} color='#D0D3DB' style={{ marginHorizontal: 20 }} />
						<Text style={{ fontSize: 13, color: '#AAAEB9' }}>品种编码</Text>
					</View>
				</View>

				<MaskModal
					ref="topModal"
					viewType="full"
					containerStyle2={{ justifyContent: 'center', alignItems: 'center' }}
					contentView={this.renderTopModal()}
				/>

			</BaseView>
		);
	}
}

//获取数据在下面添加
function mapStateToProps(state) {
	return {
		isLogin: state.Member.isLogin,
		userType: state.Member.userType,
	};
}

export default connect(mapStateToProps)(FastBuy);

