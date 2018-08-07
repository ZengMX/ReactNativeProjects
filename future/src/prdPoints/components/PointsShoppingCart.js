import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  InteractionManager
} from 'react-native';
import { Fetch, imageUtil } from 'future/public/lib';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BaseView, RefreshableListView, NumberInput, Toast, DataController, Loading, MaskModal} from 'future/public/widgets';
import IntegralOrderSuccess from './IntegralOrderSuccess';
import styles from '../style/PointsShoppingCart';
import NewReceiverInfo from './NewReceiverInfo';

let selectIndex = 0;

export default class PointsShoppingCart extends Component {
    constructor(props) {
		super(props);
		
		this.state = {
			quantity: 0,
			integral: 0,
			address: null,
			btnStatus: true,
			addrList: [],
			show: false,
			currentUserAddInfos:{}
		}
	}
	
	componentWillMount() {
		this.state.quantity = 1;
		this.myIntegral = this.props.params.integral;
		this.unitPrice = this.props.params.integralProduct.integral;
		this.state.integral = this.unitPrice;
	}

    componentDidMount(){
		InteractionManager.runAfterInteractions(() => {
			this._getAllReceiver();
		});
	}

	_getAllReceiver() {
		new Fetch({
			url: '/app/cart/listAllReceiver.json',
			method: 'POST',
		}).dofetch().then((data) => {
			this.setState({
				addrList: data.result,
				show: 'true'
			});
			for (var i = 0; i < data.result.length; i++) {
				if (data.result[i].isDefault === 'Y') {
					data.result[i].isSelected = true;
					selectIndex = i;
					this.setState({
						address: data.result[i],
					})
				} else {
					data.result[i].isSelected = false;
				}
			}
		}).catch((err) => {
			console.log('=> catch: ', err);  
			this.setState({show: 'true'});
		});
	}

	_reviseQuantity = (num) =>{
		console.log(typeof num);
		this.setState({
			quantity: num,
			integral: num * this.unitPrice,
			btnStatus: this.myIntegral > (num * this.unitPrice)
		});
	}

	_submitSelectAddress() {
		this.refs.stateModal.hide()
		this.setState({
			address: this.state.addrList[selectIndex]
		})
		//选择地址请求
		new Fetch({
			url: 'app/cart/selectReceiver.json',
			method: 'POST',
			data: {
				type: 'normal',
				receiveAddrId: this.state.addrList[selectIndex].receiveAddrId
			}
		}).dofetch().then((data) => {

		}).catch((error) => {
			console.log('获取进货单数据失败:', error);
		});
	}

	//加入购物车
	_addCart(integralProductId) {
		new Fetch({
			url: '/app/integralCart/addToCart.json',
			method: 'POST',
			data: {
				prdId: integralProductId,
				quantity: this.state.quantity
			}
		}).dofetch().then((data) => {
			if(data.success) {
				this._setAddr();
			}else {
				Loading.hide();
				Toast.show("兑换失败，请稍后重试！");
			}
		}).catch(err => {
			console.log('=> catch: ', err);
			Loading.hide();
			Toast.show("兑换失败，请稍后重试！");
		});
	}
	//设置地址
	_setAddr() {
		return new Fetch({
			url: '/app/integralCart/selectAddress.json',
			method: 'POST',
			data: {
				receiveAddrId: this.state.address.receiveAddrId
			}
		}).dofetch().then(data => {
			if(data.success) {
				this._submitOrder();
			}else {
				this._delIntegralProduct();
				Loading.hide();
				Toast.show("兑换失败，请稍后重试！");
			}
		}).catch(err => {
			this._delIntegralProduct();
			Loading.hide();
			Toast.show("兑换失败，请稍后重试！");
		});
	}
	//提交订单
	_submitOrder() {
		return new Fetch({
			url: '/app/integralCart/addOrder.json',
			method: 'POST',
			data: {
				receiveAddrId: this.state.address.receiveAddrId
			}
		}).dofetch().then(data => {
			if(data.success) {
				this.props.navigator.replace({
					component: IntegralOrderSuccess,
					params: {integralOrderId:data.order.integralOrderId}
				});
				Loading.hide();
			}else {
				this._delIntegralProduct();
				Loading.hide();
				Toast.show("兑换失败，请稍后重试！");
			}
		}).catch(err => {
			this._delIntegralProduct();
			Loading.hide();
			Toast.show("兑换失败，请稍后重试！");
		});
	}
	//删除积分商品
	_delIntegralProduct() {
		new Fetch({
			url: '/app/integralCart/delCartItem.json',
			method: 'POST',
			data: {
				prdId: this.props.params.integralProduct.integralProductId
			}
		}).dofetch().then((data) => {
			console.log(data);
		}).catch((err) => {
			console.log('=> catch: ', err);
		});
	}

	// 确认兑换
	_confirmExchange = () => {
		var integralProduct = this.props.params.integralProduct;
		// 先加入购物车，再设地址，最后提交
		if(integralProduct && this.state.address) {
			Loading.show();
			this._addCart(integralProduct.integralProductId);
		}else {
			Toast.show("请先补全信息");
		}
	}

	_selectAddr(index) {
		selectIndex = index;
		for (let i = 0; i < this.state.addrList.length; i++) {
			this.state.addrList[i].isSelected = false;
		}
		this.state.addrList[index].isSelected = !this.state.addrList[index].isSelected;
		this.setState({
			addrList: this.state.addrList
		})
	}

	_goToAddNewAddressInfo(){
		this.refs.stateModal.hide();
		this.props.navigator.push({
			component:NewReceiverInfo,
			params:{
				callBack:()=>{
					this._getAllReceiver();
				}
			}
		})
	}
	//地址选择弹出层
	_renderAddrMask(MaskInfos) {
		return (
			<View style={styles.maskModalView}>
				<View>
					<Text style={styles.maskModalTitle}>收货地址</Text>
					<TouchableOpacity 
					onPress={()=>{this._goToAddNewAddressInfo()}}
					style={styles.addAddrBtn}>
						<Image 
						style={{width:14,height:14}} 
						source={require('../res/PointsShoppingCart/004jiahao.png')}/>
						<Text style={[styles.maskModalTitle,{marginTop:0}]}>新增临时地址</Text>
					</TouchableOpacity>
					<ScrollView>
					{MaskInfos.map((address, index) => {
						return (<TouchableOpacity key={'mask' + index} onPress={()=>this._selectAddr(index)}>
							<View style={styles.maskItem}>
								<View>
									<Text style={styles.maskAddrTopTxt}>{address.name}     {address.mobile}</Text>
									<Text style={styles.maskAddrBottomTxt} numberOfLines={2}>{address.addressPath} {address.addr}</Text>
								</View>
								<View style={styles.imgView}>
									<Image
										style={{ width: 16, height: 16 }}
										source={address.isSelected == true ? 
										require('../../settleCenter/res/CashierDesk/000gouxuan_s.png') : 
										require('../../stocksList/res/images/000weigouxuan.png')}
										resizeMode='contain' />
								</View>
							</View>
						</TouchableOpacity>)
					})}
					</ScrollView>
				</View>
				<TouchableOpacity style={styles.sureBtn} onPress={()=>this._submitSelectAddress()}>
					<Text style={{ color: '#fff', fontSize: 16 }}>确定</Text>
				</TouchableOpacity>
			</View>
		)
	}

    render(){
		var integralProduct = this.props.params.integralProduct;
		var btnStat = this.state.address && this.state.btnStatus;
        return(
            <BaseView
                ref='baseview'
                title={{ title: '积分购物车', tintColor: '#333'}}
                navigator={this.props.navigator}
				mainBackColor={{ backgroundColor: '#f5f5f5' }}
				statusBarStyle={'default'}>
				<DataController data={this.state.show}>
					<KeyboardAwareScrollView
							style={{padding:0,marginBottom:0,flex:1,}}
							contentInset={{bottom:0}}
							extraHeight={170}
						>
						<ScrollView>
							{
								this.state.address ? (
									<TouchableOpacity style={styles.receiveInfo} onPress={()=>{this.refs.stateModal.show()}}>
										<Text style={styles.userInfo}>{this.state.address.name}     {this.state.address.mobile}</Text>
										<Text style={styles.address} numberOfLines={2}>{this.state.address.addressPath} {this.state.address.addr}</Text>
									</TouchableOpacity>
								) : <TouchableOpacity style={styles.noReceiver} onPress={()=>{this.refs.stateModal.show()}}>
									<Text style={{color: '#fff'}}>请先设置收货地址</Text>
								</TouchableOpacity>
							}
							<View style={styles.productItem}>
								<View style={styles.productInfo}>
									<Image source={imageUtil.get(integralProduct.icon)} style={styles.productImg} />
									<View style={styles.productView}>
										<Text numberOfLines={2} style={styles.pdName}>{integralProduct.integralProductNm}</Text>
										<View style={styles.integralView}>
											<Text style={styles.integral}>
												{integralProduct.integral}积分</Text>
											{/*<TouchableOpacity style={styles.delWrap}>
												<Image source={require('../res/PointsShoppingCart/000tancha.png')} style={styles.delIcon} />
											</TouchableOpacity>*/}
										</View>
									</View>
								</View>
								<View style={styles.exchangeWrap}>
									<Text style={styles.exchangeText}>兑换数量</Text>
									<NumberInput 
										value={this.state.quantity} 
										onChange={this._reviseQuantity }
										max={integralProduct.num}  />
								</View>	
							</View>
						</ScrollView>
					</KeyboardAwareScrollView>
					<View style={styles.footer}>
						<View style={styles.statisInfo}>
							<Text style={styles.quantity}>共{this.state.quantity}件 合计</Text>
							<Text style={styles.price}>{this.state.integral}</Text>
							<Text style={styles.text}>积分</Text>
						</View>
						<TouchableOpacity activeOpacity={0.6} style={[styles.btn, btnStat ? null : styles.btnDisable]}
							onPress={this._confirmExchange}
							disabled={!btnStat}>
							<Text style={[styles.btnText, btnStat ? null : styles.btnTextDisable]}>确认兑换</Text>
						</TouchableOpacity>
					</View>
					<KeyboardSpacer />
					<MaskModal ref='stateModal' contentView={
						this._renderAddrMask(this.state.addrList)
					} />
				</DataController>
				
                
            </BaseView>
        )
    }
}

