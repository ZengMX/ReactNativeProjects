import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  PixelRatio,
  InteractionManager,
  LayoutAnimation,
  UIManager
} from 'react-native';

import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

import {BaseView,RefreshableListView,MaskModal,TextInputC,DataController,} from "future/public/widgets";
import {Fetch} from 'future/public/lib';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-root-toast';

import PrdListItem from './PrdListItem';
import styles from '../style/StocksList.css'
import SettleCenter from '../../settleCenter/components/SettleCenter';
import ProductDetail from 'future/src/product/components/ProductDetail';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as StocksListActions from '../actions/stocksList';
import Login from '../../member/components/Login';

class StocksList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editEnable : false,
            cartDatas:[],
            cartList:{},
            totalAmount:0,
            discountAmount:0,
            buyPlanList:[],
            isPayWhenResieved:false,
            // visible:false
            getData: '',    // 是否获取到数据的标志
        }

        this.refreshSign = false;   // 刷新页面控制标志
    }

    static defaultProps = {
        params: {},
	}
	
	componentWillMount() {
		UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
	}

    componentDidMount(){
        if (this.props.isLogin) {
            InteractionManager.runAfterInteractions(() => {
                this._loadpurchaseTemplateList();
            });
        }else{
            this.toLogin();
        }
        
        // this._loadpurchaseTemplateList();
        
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.focusTime != this.props.focusTime && !this.refreshSign && !this.props.isLogin){
            this.setState({getData:'',});
            this.toLogin();
        }else if (nextProps.isLogin && (nextProps.focusTime != this.props.focusTime && !this.refreshSign)) {
            InteractionManager.runAfterInteractions(()=>{
                this._loadpurchaseTemplateList();
            })
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

    //获取当前用户采购计划列表
    _loadpurchaseTemplateList(){
        
        new Fetch({
            url:'app/fastBuy/purchaseTemplateList.json',
            method:"POST",
            data:{}
        }).dofetch().then((data) => {
            this.loadShoppingCartData();
			// console.log('>>>>>>>>>>>>',data)
            let planListDatas = data.result.map((item)=>{
                item.isSelect = false;
                return item;
            })
            this.setState({
                buyPlanList:planListDatas,
            })
		}).catch((error) => {
			console.log('获取采购计划列表数据失败:', error);
		});
    }


    _clearShoppingCart(){
        //清空购物车数据
        new Fetch({
			url: 'app/cart/clearShoppingCart.json',
			method: 'POST',
			data: {
				type: this.props.params.type || 'normal'
			},
		}).dofetch().then((data) => {
			this.props.actions && this.props.actions.setShoppingCartNum(data.cartList.allProductNum);
		}).catch((error) => {
			console.log('获取进货单数据失败:', error);
		});
    }

    loadShoppingCartData(){
        //加载购物车数据
        new Fetch({
			url: 'app/cart/getShoppingCartList.json',
			method: 'POST',
			data: {
				type: this.props.params.type || 'normal'
			},
            forbidToast: true,
		}).dofetch().then((data) => {

            // this.refs.base.hideLoading();
            // 普通进货单修改数量
            if(data.cartList.cartType === "normal"){
                let number = data.cartList?data.cartList.allProductNum:0;
                this.props.actions && this.props.actions.setShoppingCartNum(number);
            }
            
			this._setDataState(data);
		}).catch((error) => {

            // this.refs.base.hideLoading();
			console.log('获取进货单数据失败:', error);
		});
    }

    renderRightButton(){
        return(
            <TouchableOpacity
				onPress={() => {
				LayoutAnimation.easeInEaseOut();	
                this.setState({
                    editEnable:!this.state.editEnable
                })
            }}
			 style={{width:44,height:44,justifyContent:'center',alignItems:'center'}}>
			    <Text style={{color:'#fff'}}>{this.state.editEnable?'完成':'编辑'}</Text>
			</TouchableOpacity>
        )
    }
    //加常购
    _addPurshase(){
        
        let skuIdsArr = this._getTheSelectedPrdsSkuIds();
        let skuIds = '';
        for(var i = 0;i<skuIdsArr.length;i++){
            skuIds = skuIds + skuIdsArr[i] + ',';
        }
        if(skuIdsArr.length>0){
            this.refs.base.showLoading();
            new Fetch({
                url: 'app/fastBuy/addPurchase.json',
                method: 'POST',
                data: {skuIds:skuIds},
            }).dofetch().then((data) => {
                this.refs.base.hideLoading();
                this.refs.base.showToast(
                <View style={{width:130,height:85,alignItems:'center'}}>
                    <Image 
                    resizeMode='contain' 
                    style={{width:26,height:26,marginTop:20}} 
                    source={require('../res/StocksList/chenggon.png')}/>
                    <Text style={{color:'#fff',marginTop:10,fontSize:13}}>已添加到常购品种</Text>
                </View>);
            }).catch((error) => {
                console.log('获取进货单数据失败:', error);
            });
        } else {
            Alert.alert(
            null,
            '请先选择要添加的商品',
            [
                {text: '确定', onPress: () => {}},
            ],
            { cancelable: false }
            )
        }
            
    }
    //加计划
    _addPlan(purchaseTemplateId){
        
        let skuIds = this._getTheSelectedPrdsSkuIds();
        let nums = this._getTheSkuIdNums();
        if(nums.length>0){
            this.refs.base.showLoading();
            new Fetch({
                url: 'app/fastBuy/addPurchaseTemplateItems.json',
                method: 'POST',
                bodyType:'json',
                data: {purchaseTemplateId:purchaseTemplateId,skuIds:skuIds,nums:nums},
            }).dofetch().then((data) => {
                this.refs.base.showToast(
                    <View style={{width:130,height:85,alignItems:'center'}}>
                        <Image 
                        resizeMode='contain' 
                        style={{width:26,height:26,marginTop:20}} 
                        source={require('../res/StocksList/chenggon.png')}/>
                        <Text style={{color:'#fff',marginTop:10,fontSize:13}}>已添加到采购计划</Text>
                    </View>);
                this.refs.stateModal.hide();
                this.refs.base.hideLoading();
            }).catch((error) => {
                this.refs.base.hideLoading();
                console.log('获取进货单数据失败:', error);
            });
        } else {
            Alert.alert(
            null,
            '请先选择要添加的商品',
            [
                {text: '确定', onPress: () => {this.refs.stateModal.hide();}},
            ],
            { cancelable: false }
            )
        }
        
    }
    //创建采购计划
    _createPurshase(planNm){
        let skuIds = this._getTheSelectedPrdsSkuIds();
        let skuNums = this._getTheSkuIdNums();
        this.refs.base.showLoading();
        new Fetch({
			url: 'app/fastBuy/createPurchaseTemplate.json',
			method: 'POST',
            bodyType:'json',
			data: {templateNm:planNm,skuIds:skuIds,nums:skuNums},
		}).dofetch().then((data) => {
            this.refs.base.hideLoading();
            this.refs.addNewPlan.hide();
            this._loadpurchaseTemplateList();
		}).catch((error) => {
            this.refs.base.hideLoading();
            this.refs.addNewPlan.hide();
			console.log('获取进货单数据失败:', error);
		});
    }
    //选择采购计划
    _selectPlan(index,purchaseTemplateId){
        
        for(var i=0;i<this.state.buyPlanList.length;i++){
            this.state.buyPlanList[i].isSelect = false;
        }
        this.state.buyPlanList[index].isSelect = !this.state.buyPlanList[index].isSelect;
        this.setState({
            buyPlanList:this.state.buyPlanList
        })
        this._addPlan(purchaseTemplateId);

    }
    _renderMaskModal(planList){
        return(
            <View style={styles.mask_PlanSelect}>
                <Text style={styles.mask_PlanSelectTitle}>选择计划</Text>
                <TouchableOpacity style={styles.mask_NewPlan} onPress={()=>{
                    this.refs.addNewPlan.show()
                    }}>
                    <Image 
                    style={styles.mask_NewPlanImg} 
                    source={require('../res/StocksList/004jiahao.png')}
                    resizeMode='contain'/>
                    <Text style={styles.mask_NewPlanTxt}>新建计划</Text>
                </TouchableOpacity>
                <ScrollView style={styles.mask_PlanSelectScroll}>
                {planList.map((item,index)=>{
                    return <TouchableOpacity key={'plan'+index} 
                    style={styles.mask_PlanItem} 
                    onPress={this._selectPlan.bind(this,index,item.purchaseTemplateId)}>
                        <Image 
                        style={styles.mask_PlanItemImg} 
                        source={item.isSelect===true?require('../res/images/000gouxuan_s.png'):require('../res/images/000weigouxuan.png')}
                        resizeMode='contain'/>
                        <Text style={styles.mask_PlanItemTxt}>{item.templateNm}</Text>
                    </TouchableOpacity>
                })}
                
                <View style={{height:20}}/>
                </ScrollView>
                <MaskModal
					ref="addNewPlan"
					viewType="top"
					animationType='slide'
					containerStyle2={{alignItems:'center'}}
					contentView={
                        this._renderNewPlanModal()
					}/>
            </View>
        )
    }
    _renderNewPlanModal(){
        return(
            <View style={styles.newPlanModal}>
                <Text style={styles.plan_NewBtn}>新建计划</Text>
                <View style={{backgroundColor:'#fff'}}>
                <TextInputC
                    ref="textInput"
                    style={styles.plan_inputNm}
                    clearButtonMode='while-editing'								
                    autoFocus = {true}
                    placeholder = {'1~10个字符'}
                    underlineColorAndroid='transparent'
                    value={this.state.planNm}
                    blurOnSubmit={true}
                    onChangeText={(planNm) => {
                        this.setState({ planNm: planNm})
                    } }
                    maxLength={10}
                />
                </View>
                <View style={styles.plan_cancel}>
                    <TouchableOpacity style={styles.plan_cancelBtn}
                        onPress={this.cancel.bind(this)}>
                        <Text style={styles.plan_cancelTitle}>取消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.plan_sureBtn}
                        onPress={this.submit.bind(this,this.state.planNm)}>
                        <Text style={styles.plan_sureTitle}>确定</Text>
                    </TouchableOpacity>								
                </View>
            </View>
        )
    }
    submit(planNm){
        this._createPurshase(planNm)
    }
    cancel(){
        this.refs.addNewPlan.hide();
    }
    //进货单勾选事件
    _cartItemSelect = (cartId,index,selected)=>{
        this.refs.base.showLoading();
        new Fetch({
            url: 'app/cart/updateSelectItem.json',
            method: 'POST',
            data: {
                type: this.props.params.type || 'normal',
                itemKey:this.state.cartDatas[cartId].cartItems[index].itemKey,
                isSelected:selected,
                orgId:this.state.cartDatas[cartId].orgId
            },
        }).dofetch().then((data) => {
            this.refs.base.hideLoading();
            this._setDataState(data);
        }).catch((error) => {
            this.refs.base.hideLoading();
            console.log('获取进货单数据失败:', error);
        });
    }
    //勾选购物车
    _cartSelect(cartId,isSelectCart){
        this.refs.base.showLoading();
        new Fetch({
            url: 'app/cart/updateCartAllSelected.json',
            method: 'POST',
            data: {
                type: this.props.params.type || 'normal',
                isAllSelected:!isSelectCart,
                orgId:this.state.cartDatas[cartId].orgId
            },
        }).dofetch().then((data) => {
            this.refs.base.hideLoading();
            this._setDataState(data);
        }).catch((error) => {
            this.refs.base.hideLoading();
            console.log('获取进货单数据失败:', error);
        });
    }
    //批量删除商品
    _delPrdBatch(){
        this.refs.base.showLoading();
        let itemkeys = this._getTheSelectedPrds();
        let itemKeys = '';
        if(itemkeys.length>0){
            for(var i=0;i<itemkeys.length;i++){
                itemKeys = itemKeys + itemkeys[i]+',';
            }
        }
        
        new Fetch({
            url: 'app/cart/batchRemoveCartItem.json',
            method: 'POST',
            data: {
                type:this.props.params.type || 'normal',
                handler:'sku',
                itemKeys:itemKeys,
            },
        }).dofetch().then((data) => {
            this.refs.base.hideLoading();
			this._setDataState(data);
			this.props.actions && this.props.actions.setShoppingCartNum(data.cartList.allProductNum);
        }).catch((error) => {
            this.refs.base.hideLoading();
            console.log('获取进货单数据失败:', error);
        });
    }
    //货到付款请求+UI校正
    _payWhenResivePrd(){
        this.refs.base.showLoading();
        new Fetch({
            url:'app/cart/setIsCod.json',
            data:{
                type: this.props.params.type || 'normal',
                isCod:!this.state.isPayWhenResieved,
            }
        }).dofetch().then((data) => {
            this.refs.base.hideLoading();
            this.setState({
                isPayWhenResieved:!this.state.isPayWhenResieved
            })
		}).catch((error) => {
            this.refs.base.hideLoading();
			console.log('获取进货单数据失败:', error);
		});
    }
    //改变商品数量
    _changePrdNums(type,quantity,itemKey,orgId){
        this.refs.base.showLoading();
        this.props.actions.cartChangePrdNums(type,quantity,itemKey,orgId,(data)=>{
            this.refs.base.hideLoading();
            this._setDataState(data);
        },(error)=>{
            this.refs.base.hideLoading();
        })
    }
    //全选与取消全选商品
    _selectAll(selectAll){
        this.refs.base.showLoading();
        new Fetch({
			url: 'app/cart/updateCartListAllSelected.json',
			method: 'POST',
			data: {
                type: this.props.params.type || 'normal',
                isAllSelected:!selectAll,
            }
		}).dofetch().then((data) => {
            this.refs.base.hideLoading();
            this._setDataState(data);
		}).catch((error) => {
            this.refs.base.hideLoading();
			console.log('获取进货单数据失败:', error);
		});
        
    }
    //获取选中的商品itemKey
    _getTheSelectedPrds(){
        let selectedPrds = [];
        for(var i=0;i<this.state.cartDatas.length;i++){
            for(var j=0;j<this.state.cartDatas[i].cartItems.length;j++){
                if(this.state.cartDatas[i].cartItems[j].itemSelected==true){
                    let itemKey = this.state.cartDatas[i].cartItems[j].itemKey+'_'+this.state.cartDatas[i].orgId;
                    selectedPrds.push(itemKey);
                }
            }
        }
        return selectedPrds;
    }
    //获取选中商品的skuIds
    _getTheSelectedPrdsSkuIds(){
        let selectedPrds = [];
        for(var i=0;i<this.state.cartDatas.length;i++){
            for(var j=0;j<this.state.cartDatas[i].cartItems.length;j++){
                if(this.state.cartDatas[i].cartItems[j].itemSelected==true){
                    let skuId = this.state.cartDatas[i].cartItems[j].skuId;
                    selectedPrds.push(skuId);
                }
            }
        }
        return selectedPrds;
    }
    _getTheSkuIdNums(){
        let selectedPrds = [];
        for(var i=0;i<this.state.cartDatas.length;i++){
            for(var j=0;j<this.state.cartDatas[i].cartItems.length;j++){
                if(this.state.cartDatas[i].cartItems[j].itemSelected==true){
                    let skuId_num = this.state.cartDatas[i].cartItems[j].skuId+'_'+this.state.cartDatas[i].cartItems[j].quantity;
                    selectedPrds.push(skuId_num);
                }
            }
        }
        return selectedPrds;
    }
	_setDataState(data) {
		//cartItems为空的时候，购物车要清空他的店铺信息
		data.cartList.shoppingCarts.forEach((item, index) => {
			if (item.cartItems.length == 0) { 
				data.cartList.shoppingCarts.splice(index, 1);
			}
		})
		
        this.setState({
            discountAmount:data.cartList.allDiscountAmount,
            totalAmount:data.cartList.allProductTotalAmount,
            cartDatas:data.cartList.shoppingCarts,
            cartList:data.cartList,
            getData: 'GOT DATA',
        })
        this.refs.base.alterTitle({ title: '进货单('+this.state.cartList.allProductNum+')', tintColor: '#fff', fontSize: 18 });
    }
    //打开商品详情
    // _goToProductDetail(productId){
    //     this.props.navigator.push({
    //         component:ProductDetail,
    //         params:{
    //             productId:productId
    //         }
    //     })
    // }
    openComponent = (component,params={})=>{
        this.refreshSign = true;
        setTimeout(() => {
            this.refreshSign = false;
            // console.log('改回之前的值');
        }, 0);
        let navigator = this.props.navigator;
        if(navigator){
            navigator.push({
                component,
                params,
            })
        }
    }

    //去结算
    _gotoSettleCenter(){
        if(this.state.cartList.allSelectedProductNum>0){
			
            this.props.navigator.push({
                component:SettleCenter,
                params:{
                    type: this.props.params.type,
                    cartDatas:this.state.cartList,
                    isPayWhenResieved:this.state.isPayWhenResieved
                }
            });
        } else {
            this.refs.base.showToast('请先选择商品');
        }
        
    }
    render(){
		let title = '进货单('+(this.state.cartList.allProductNum ? this.state.cartList.allProductNum : 0)+')';
		
        return(
            <BaseView navigator={this.props.navigator} 
                scrollEnabled={false} 
                mainColor={'#34457D'}
                ref='base'
                leftBtnStyle={{width:10,height:17,tintColor:'#fff'}}
                hideLeftBtn={this.props.navigator.getCurrentRoutes().length==1}
                rightButton={this.renderRightButton()}
                title={{ title: title, tintColor: '#fff', fontSize: 18 }}
				statusBarStyle={'light-content'}
             >
             <DataController data={this.state.getData}>
                <KeyboardAwareScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    {this.state.cartList.allProductNum==0&&<View style={{flex:1,alignItems:'center'}}>
                        <Image 
                        style={{marginTop:105}} 
                        resizeMode='contain' 
                        source={require('../res/StocksList/004shibai.png')}/>
                        <Text style={{marginTop:33,fontSize:15,color:'#455A64'}}>您当前还没有进货商品</Text>
                        <TouchableOpacity 
                        onPress={()=>{
                            RCTDeviceEventEmitter.emit('changeTabBarIdx', { idx: 0, goTop: true });
                        }}
                        style={{width:105,height:30,justifyContent:'center',alignItems:'center',marginTop:20,backgroundColor:'#fff'}}>
                            <Text style={{fontSize:14,color:'#4A4A4A'}}>首页逛逛</Text>
                        </TouchableOpacity>
                    </View>}
                    {this.state.cartList.allProductNum>0&&this.state.cartDatas.length>0&&this.state.cartDatas.map((value,index)=>{
                       
                        return <View style={styles.cartShop} key={'shop'+index} >
                            <View>
                                <View style={styles.cartShopCheckView}>
                                    <TouchableOpacity 
                                    style={styles.cartShopCheckBtn} 
                                    onPress={this._cartSelect.bind(this,index,value.isAllSelected)}>
                                    <Image 
                                    style={styles.cartShopCheckImg} 
                                    source={value.isAllSelected==true?
                                    require('../res/images/000gouxuan_s.png'):
                                    require('../res/images/000weigouxuan.png')}
                                    resizeMode='contain'/>
                                    </TouchableOpacity>
                                    <Text style={styles.cartShopTitle}>{value.shopNm}</Text>
									{
										value.hadRecordSta != 1 && <Image style={{width:74,height:15,marginLeft:10}} source={require('../res/StocksList/006weijianli02.png')}/>
									}
                                </View>
                                {/* <View style={styles.cartShopCaptureView}></View> */}
                            </View>
                            {value.cartItems.length>0&&value.cartItems.map((item,tag)=>{
                                
                                return <PrdListItem 
                                key={'prd'+tag} 
                                cartData={item} 
                                editEnable={this.state.editEnable}
                                clickAllItem={(productId)=>{
                                    this.openComponent(ProductDetail,{productId,});
                                }}
                                changePrdNums={(quantity,itemKey)=>{
                                    this._changePrdNums(value.cartType,quantity,itemKey,value.orgId);
                                }}
                                cartDataSelectAction={(selected)=>{
                                    this._cartItemSelect(index,tag,selected);
                                    }}/>
                            })}
                            <View style={{backgroundColor:'#f0f0f0',height:10,width:SCREENWIDTH}}/>
                            {value.orderPresents&&value.orderPresents.length>0&&<View style={styles.orderPresentView}>
                                <View style={styles.orderTitleView}>
                                    <Text style={styles.orderTitle}>订单赠品</Text>
                                </View>
                                <View style={styles.orderPresentItems}>
                                    
                                    {value.orderPresents.map((ordPresent,index)=>{
                                        return <View key={'ordPresent'+index}  style={styles.orderPresentItem}>
                                        <Text 
                                        style={styles.orderPresentNm}>{ordPresent.name}</Text>
                                        <Text style={styles.orderPresentNum}>x{ordPresent.quantity}</Text>
                                        </View>
                                    })}
                                </View>
                            </View>}
                        </View>
                    })}
                    
                </KeyboardAwareScrollView>
                {this.state.cartList.allProductNum>0&&(this.state.editEnable===false?<View style={styles.bottomMenueContainer}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',height:50,width:SCREENWIDTH-110}}>
                        <View style={{flexDirection:'row',alignItems:'center',width:100}}>
                            <TouchableOpacity style={styles.allSelectBtn} onPress={this._selectAll.bind(this,this.state.cartList.isAllSelected)}>
                                <Image 
                                style={styles.allSelectImg} 
                                source={this.state.cartList.isAllSelected==true?
                                require('../res/images/000gouxuan_s.png'):
                                require('../res/images/000weigouxuan.png')}
                                resizeMode='contain'/>
                            </TouchableOpacity>
                            {/* <Text style={styles.allSelect}>全选</Text> */}
                            <View style={{width:40,height:20}}><Text style={styles.allSelect}>全选</Text></View>
                        </View>
                        <View style={styles.stocksListInfo}>
                            <Text 
                            style={styles.stocksListTotal}>总计:<Text 
                            style={styles.stocksListTotalPrice}>¥{this.state.totalAmount.toFixed(2)}</Text></Text>
                            <Text
                            style={styles.favourable}>已优惠￥{0-this.state.discountAmount}  赠送{this.state.cartList.allObtainTotalIntegral}积分</Text>
                        </View>
                    </View>
                    {/*<TouchableOpacity style={styles.cashOnDelivery} onPress={this._payWhenResivePrd.bind(this)}>
                        <Image 
                        style={styles.menuImg} 
                        source={
                            this.state.isPayWhenResieved==true?
                            require('../res/StocksList/004huoche_s.png'):
                            require('../res/StocksList/004huoche.png')}/>
                        <Text 
                        style={[styles.menuTxt,{color:this.state.isPayWhenResieved==true?'#34457D':'#333'}]}>货到付款</Text>
                    </TouchableOpacity>*/}
                    <TouchableOpacity style={styles.settleBtn} onPress={this._gotoSettleCenter.bind(this)}>
                        <Text style={styles.settleBtnTitle}>{'去结算('+this.state.cartList.allSelectedProductNum+')'}</Text>
                    </TouchableOpacity>
                </View>:<View style={[styles.bottomMenueContainer,{justifyContent:'space-between'}]}>
                    <View style={{flexDirection:'row',alignItems:'center',width:100}}>
                        <TouchableOpacity style={styles.allSelectBtn} onPress={this._selectAll.bind(this,this.state.cartList.isAllSelected)}>
                            <Image 
                            style={styles.allSelectImg} 
                            source={this.state.cartList.isAllSelected==true?
                            require('../res/images/000gouxuan_s.png'):
                            require('../res/images/000weigouxuan.png')}
                            resizeMode='contain'/>
                        </TouchableOpacity>
                        {/* <Text style={styles.allSelect}>全选</Text> */}
                        <View style={{width:40,height:20}}><Text style={styles.allSelect}>全选</Text></View>
                    </View>
                    <View style={{width:195,height:50,flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                        <TouchableOpacity onPress={this._addPurshase.bind(this)} style={{alignItems:'center'}}>
                            <Image style={styles.menuImg} 
                            resizeMode='contain'
                            source={require('../res/StocksList/003jiachanggou.png')}/>
                            <Text style={styles.menuTxt}>加常购</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            this.refs.stateModal.show();
                        }} style={{alignItems:'center'}}>
                            <Image style={styles.menuImg}
                            resizeMode='contain'
                            source={require('../res/StocksList/003jaijihua.png')}/>
                            <Text style={styles.menuTxt}>加计划</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            let prds = this._getTheSelectedPrds();
                            if(prds.length>0){
                                Alert.alert(
                                null,
                                '确定删除选中的'+prds.length+'件商品？',
                                [
                                    {text: '手抖了', onPress: () => {}},
                                    {text: '残忍删除', onPress: () => {this._delPrdBatch()}},
                                ],
                                { cancelable: false }
                                )
                            } else {
                                Alert.alert(
                                null,
                                '请先选择要删除的商品',
                                [
                                    {text: '确定', onPress: () => {}},
                                ],
                                { cancelable: false }
                                )
                            }
                            
                        }} style={{alignItems:'center'}}>
                            <Image style={styles.menuImg}
                            resizeMode='contain'
                            source={require('../res/StocksList/004shanchu.png')}/>
                            <Text style={styles.menuTxt}>删除</Text>
                        </TouchableOpacity>
                    </View>
                </View>)}
                <MaskModal ref='stateModal' contentView={
                    this._renderMaskModal(this.state.buyPlanList)
                }/>
                </DataController>
             </BaseView>
        )
    }
}

function mapStateToProps(state) {
    return {
        isLogin: state.Member.isLogin,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(StocksListActions,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(StocksList);


