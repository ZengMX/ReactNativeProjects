import React, { Component } from 'react';
import {
	View,	
	ScrollView,
	TouchableOpacity,	
	PixelRatio,
	Dimensions,	
	TextInput,
	Image,
	Animated,
	InteractionManager,
} from 'react-native';
import { BaseView,Arrow,Separator,Text,Loading,Toast,DataController} from 'future/public/widgets';
import imageUtil from 'future/public/lib/imageUtil'
import Fetch from 'future/public/lib/Fetch'
import MoreOperation from '../../commons/moreOperation/components/MoreOperation';
import BuyerCoupons from '../../member/components/BuyerCoupons';
import ProductDetail from '../../product/components/ProductDetail';


var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;

export default class BaseInfor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			headPic:undefined,
			word_adv:'',
			prd_recommend:[],
			couponList:[],
			showGetCoupon:false,

			animatDefaultZero: new Animated.Value(0),
		}		
		this.getCoupon = this.getCoupon.bind(this);		
	}
	componentWillMount(){
		Loading.show();		
        new Fetch({
            url: 'app/couponFront/getGivenCouponModuleAndList.json',  
        }).dofetch().then((data) => {	
			if(data.result.clientModuleVoMap.app_module_getCoupons_header_adv.moduleObjects[0]){
				this.setState({headPic:data.result.clientModuleVoMap.app_module_getCoupons_header_adv.moduleObjects[0].iconFileUrl})
			}
			if(data.result.clientModuleVoMap.app_module_getCoupons_word_adv.moduleObjects[0]){
				this.setState({word_adv:data.result.clientModuleVoMap.app_module_getCoupons_word_adv.moduleObjects[0].text})
			}			
			this.setState({prd_recommend:data.result.clientModuleVoMap.app_module_getCoupons_prd_recommend.moduleObjects});
			this.setState({couponList:data.result.givenCouponList});
        }).catch((err) => {
			console.log('=> catch: ', err);		
		}).finally(()=>{
			Loading.hide();
		})
	}
	componentWillUnmount() {
		if (this.timer) {
			clearTimeout(this.timer);
		}
	}

	getCoupon(link) {
		Loading.show();		
        new Fetch({
			url: 'app/couponFront/getCoupon.json',  
			data:{ruleLink:link}
        }).dofetch().then((data) => {			
			this.showGetCoupon = this.showGetCoupon.bind(this,data);	
			this.setState({showGetCoupon:true})
			
			Animated.timing(this.state.animatDefaultZero, {
				toValue: 1,
				duration: 200,
			}).start();	
			
			this.timer = setTimeout(()=>{
				Animated.timing(this.state.animatDefaultZero, {
					toValue: 0,
					duration: 200,
				}).start(()=>{
					this.setState({showGetCoupon:false})
				});
			},1800)		
        }).catch((err) => {
			console.log('=> catch: ', err);		
		}).finally(()=>{
			Loading.hide();
		})
	}
	showGetCoupon(data){
		return(
			<Animated.View style={{height:50,width:280,backgroundColor:'#fff',justifyContent:'center',alignItems:'center',position:'absolute',left:(screenWidth-280)/2,top:-5,shadowColor: 'black',shadowRadius: 5,shadowOpacity: 0.1,shadowOffset: {height: 1 },opacity:this.state.animatDefaultZero}}>	
				<Text style={{fontSize:14,color:'#666'}}>{'成功领取'+data.result.batchNm + data.result.bindNum +'张'}				
					<Text style={{fontSize:14,color:'#ff6400'}} 
						onPress={()=>{							
							this.props.navigator.push({component:BuyerCoupons})							
						}}
						>去使用>
					</Text>					
				</Text>
			</Animated.View>
		)
	}

	render(){
		let base = screenWidth/320,
			couponWidth = 93.5*base,
			couponHeight = 60*base,
			data = this.state.prd_recommend,
			couponList = this.state.couponList.slice(1);
		return(
			<BaseView
				mainBackColor={{ backgroundColor: '#f5f5f5' }}
				ref={'base'}
				navigator={this.props.navigator}
				mainColor={'#f9f9f9'}
				title={{ title: '领券爽', tintColor: '#333', style:{fontSize: 18, fontWeight:'normal'} }}
				statusBarStyle={'default'}	
				rightButton={<MoreOperation navigator={this.props.navigator} style={{alignSelf: 'center'}}> </MoreOperation>}
			>	
		
				<ScrollView contentContainerStyle={{ alignItems:'center',backgroundColor:'#fff',paddingBottom:18}} showsVerticalScrollIndicator={false}>
					<Image style={{height:240*base,width:screenWidth}} source={imageUtil.get(this.state.headPic)}>	
						<TouchableOpacity style={{height:25,width:80,backgroundColor:'rgba(0,0,0,0.3)',borderRadius:10,flexDirection:'row', justifyContent:'center',alignItems:'center',position:'absolute',top:21,right:13}}
							onPress={()=>{this.props.navigator.push({component:BuyerCoupons})}}>
							<Text style={{fontSize:12,color:'#fff'}}>查看优惠券></Text> 
						</TouchableOpacity>
					</Image>
					{this.state.couponList.length != 0 &&
					<View style={{width:screenWidth,top:-25}}>						
						<Image style={{flexDirection:'row', height:50*base,width:294*base,alignItems:'center',justifyContent:'space-between',marginLeft:13*base}} source={this.state.couponList[0].isGetCoupon != 'N' ? require('../res/images/002quan.png') : require('../res/images/002quan_s.png')} resizeMode='stretch'>
							<View style={{marginLeft:18,flexDirection:'row',alignItems:'center',backgroundColor:'transparent'}}>
								<Text text={[
									{value : '¥', style:{color:'#f6f6f6',fontSize:11}},
									{value : this.state.couponList[0].couponBatchVo.amount, style:{color:'#f6f6f6',fontSize:28,fontWeight:'bold'}},	
								]}/>
								<View style={{marginLeft:11}}>
									<Text style={{fontSize:9,color:'#f6f6f6'}}>{'有效期 ' + this.state.couponList[0].couponBatchVo.endTimeStr.replace(/-/g,'.')}</Text>
									<Text style={{fontSize:11,color:'#f6f6f6'}}>{this.state.couponList[0].rules[0]}</Text>
								</View>
							</View>							
							{this.state.couponList[0].isGetCoupon != 'N' && <Text style={{height:25,width:25,fontSize:11,color:'#f6f6f6',textAlign:'center',marginRight:15*base,backgroundColor:'transparent'}}
								onPress={()=>{											
									this.getCoupon(this.state.couponList[0].ruleLinke)
								}}>
								立即领取
							</Text>	}						
						</Image>
						
						
						<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between', flexWrap:'wrap', marginTop:1,paddingHorizontal:13}}>
							{couponList.map((item,i)=>{
								return(
									<TouchableOpacity key={i} style={{borderRadius:4,marginTop:7}} 
										onPress={()=>{		
												if(item.isGetCoupon != 'N' ){
													this.getCoupon(item.ruleLinke)
												}																				
											}}
										>										
										<Image style={{height:couponHeight,width:couponWidth,justifyContent:'space-between',alignItems:'center',paddingVertical:7*base}} source={require('../res/images/002xiaoquandi_s.png')}>
											<View style={{position:'absolute',top:couponHeight/2-5,left:-5, width:10,height:10,borderRadius:5,backgroundColor:'#FFF'}}/>
											<View style={{position:'absolute',top:couponHeight/2-5,right:-5, width:10,height:10,borderRadius:5,backgroundColor:'#FFF'}}/>

											<View style={{backgroundColor:'transparent'}}>
												<Text text={[
													{value : '¥', style:{color:'#f6f6f6',fontSize:10}},
													{value : item.couponBatchVo.amount, style:{color:'#f6f6f6',fontSize:18}},
													{value : '·'+item.everyoneGivenTotalAmount+'张', style:{color:'#f6f6f6',fontSize:9}},
												]}/>
											</View>
											<View style={{backgroundColor:'#ffc80a',height:13*base,width:75*base,borderRadius:10,alignItems:'center',justifyContent:'center',top:-2,paddingHorizontal:2}}>
												<Text style={{fontSize:9,color:'#f4500c'}} numberOfLines={1}>{item.rules[0]}</Text>
											</View>
											<Text style={{fontSize:9,color:'#f6f6f6',backgroundColor:'transparent'}}>{'有效期 ' + item.couponBatchVo.endTimeStr.replace(/-/g,'.')}</Text>	
											{item.isGetCoupon == 'N' && <View style={{justifyContent:'flex-end', height:couponHeight,width:couponWidth,position:'absolute',top:0, backgroundColor:'rgba(255,255,255,0.5)',borderRadius:5}}>
												<View style={{height:18,backgroundColor:'rgba(0,0,0,0.5)',borderRadius:8,justifyContent:'center',alignItems:'center'}}>
													<Text style={{fontSize:11,color:'#fff'}}>已领取</Text>
												</View>
											</View>}
										</Image>
									</TouchableOpacity>								
								)
							})}			
						</View>
					</View>}

					{/* 商品推荐 */}
					<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',alignSelf:'stretch'}}>						
						<View style={{height:2,width:20,backgroundColor:'#eee',marginRight:5,}}/>
							<Text style={{fontSize:15,color:'#333',}}>{this.state.word_adv}</Text>				
						<View style={{height:2,width:20,backgroundColor:'#eee',marginLeft:5}}/>
						{/* 成功领券提示 */}
						{this.state.showGetCoupon && this.showGetCoupon()}
					</View>
					<View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',alignItems:'center', width:screenWidth,marginTop:18}}>
						{data && data.map((item,i)=>{
							let price= parseFloat(item.product.price).toFixed(2).split('.'),
								intPrice = price[0],
								dicimalPrice = price[1];
							return(
							<TouchableOpacity key={i} onPress={()=>this.props.navigator.push({
										component:ProductDetail,
										params:{productId: item.product.productId}
									})}>
								<Image style={{width:157.5*base,height:157.5*base}} source={imageUtil.get(item.product.picUrl)}/>
								<View style={{paddingHorizontal:13,width:157.5*base,paddingVertical:16}}>
									<Text style={{fontSize:13,color:'#4b5943',marginBottom: 5}} numberOfLines={2}>{item.product.title}</Text>
									{item.product.price ?
										<Text text={[
											{value : '¥', style:{color:'#fe5b4a',fontSize:11}},
											{value : intPrice, style:{color:'#fe5b4a',fontSize:17}},
											{value : '.'+dicimalPrice, style:{color:'#fe5b4a',fontSize:12}},				
										]}/>:
										<Text style={{color:'#4b5943'}}>--/--</Text>
									}
								</View>
							</TouchableOpacity>
							)
						})}
					</View>
				</ScrollView>
				
			</BaseView>		
		)
	}
}