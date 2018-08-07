import React, { Component } from 'react';
import {
	View,	
	ScrollView,
	TouchableOpacity,	
	PixelRatio,
	TextInput,
	Dimensions,	
	Image,
	ListView,
} from 'react-native';
import ImagePicker from '@imall-test/react-native-image-picker';
import { BaseView,Arrow,Separator,Text,RefreshableListView,StarRating,TextInputC,Loading,ImageUploader,Alerts,Toast } from 'future/public/widgets';
import ImageBigBtnList from 'future/public/widgets/ImageBigBtn/ImageBigBtnList';
import Fetch from 'future/public/lib/Fetch'
import imageUtil from 'future/public/lib/imageUtil'
import MoreOperation from '../../commons/moreOperation/components/MoreOperation';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import config from 'future/public/config'

import { Uploader } from 'future/public/lib';

var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;


export default class Comment extends Component {
	constructor(props) {
		super(props);
		this.orderId = this.props.params && this.props.params.orderId || 38;
		this.state = {
			orderData:undefined,
			serviceRating:[5,'非常好'],
			describeRating:[5,'非常好'],
			logisticsRating:[5,'非常好'],
			deliveredItems:[],
		}			
		this.changRatingTwo = this.changRatingTwo.bind(this);
		this.textOnBlur = this.textOnBlur.bind(this);
		this.renderPhoto = this.renderPhoto.bind(this);
		this.confirmAlert = this.confirmAlert.bind(this);
		this.selectPhoto = this.selectPhoto.bind(this);
		this.comfirmDeleteImg = this.comfirmDeleteImg.bind(this);
		this.submit = this.submit.bind(this);
		this.leftBtnHandler = this.leftBtnHandler.bind(this);
	}
	componentWillMount(){
		Loading.show();		
        new Fetch({
			url: 'app/order/orderDetail.json',  
			data: {
				orderId: this.orderId
			}
        }).dofetch().then((data) => {
			this.state.orderData = data.result;
			this.state.deliveredItems.length = data.result.deliveredItems && data.result.deliveredItems.length || this.state.deliveredItems.length;
			for(let i=0;i<this.state.deliveredItems.length;i++){
				this.state.deliveredItems[i]={
					productRating:[5,'非常好'],
					babelData:[],					
					text:'',
					textArea:'',
					textAreaLength:0,
					photoArr:[],
					commentPictList:[],
					commentPictListRecord:'',
				};
				this.state.deliveredItems[i].babelData.tagList = '';
			}			
			this.setState(Object.assign({},this.state));			
        }).catch((err) => {
			console.log('=> catch: ', err);		
		}).finally(()=>{
			Loading.hide();
		})
	}

	changRating(i,bool,num) {		
		switch (num){
			case 1:
				if(bool){
					this.changRatingTwo(i,num,'非常差');
				}else{
					this.changProductTwo(i,num,'非常差');
				}
				break;
			
			case 2:
				if(bool){
					this.changRatingTwo(i,num,'差');
				}else{
					this.changProductTwo(i,num,'差');
				}
				break;
			
			case 3:
				if(bool){
					this.changRatingTwo(i,num,'一般');
				}else{
					this.changProductTwo(i,num,'一般');
				}
				break;
			
			case 4:
				if(bool){
					this.changRatingTwo(i,num,'好');
				}else{
					this.changProductTwo(i,num,'好');
				}
				break;
			
			case 5:
				if(bool){
					this.changRatingTwo(i,num,'非常好');
				}else{
					this.changProductTwo(i,num,'非常好');
				}
				break;
			
		}
	}
	changRatingTwo(i,num,str) {
		switch (i){
			case 1:
				this.setState({serviceRating:[num,str]})
				break;
			
			case 2:
				this.setState({describeRating:[num,str]})
				break;
			
			case 3:
				this.setState({logisticsRating:[num,str]})
				break;			
		}
	}
	changProductTwo(i,num,str) {		
		this.state.deliveredItems[i].productRating = [num,str];
		this.setState({deliveredItems:Object.assign([],this.state.deliveredItems)});
	}
	textOnBlur(item) {		
		if(item.text == '' || item.text == undefined){
			return 
		}				
		
		item.babelData.push({nm:''+item.text,check:true});
		item.text = '';		

		item.babelData.tagList = [];
		item.babelData.forEach((item,i,arr)=>{
			if(item.check){
				arr.tagList.push(item.nm);
			}
		})
		item.babelData.tagList = item.babelData.tagList.join(',');
		console.log('tagList',item.babelData.tagList);

		this.setState({deliveredItems:Object.assign([],this.state.deliveredItems)});
	}

	NavRightButton(){
		return (
			<TouchableOpacity style={{marginRight:13,alignSelf:'center'}}
				onPress={this.submit.bind(this)}>	
				<Text style={{fontSize:16,color:'#444'}}>提交</Text>
			</TouchableOpacity>	
		)
	}
	// {record:{}   ,sysComments [{} {} {}]  }   “dsfadsf,dfadsf,dfsaf,”
	submit(){
		let data = {
			record:{shopId:this.state.orderData.sysShopInf.shopInfId,
				orderId:this.orderId,
				sellerServiceAttitude:this.state.serviceRating[0],
				productDescrSame:this.state.describeRating[0],
				sellerSendOutSpeed:this.state.logisticsRating[0],
			},
			sysComments:this.state.deliveredItems.map((item,i)=>{
				return(
					{
						objectId:this.state.orderData.deliveredItems[i].productId,
						gradeLevel:item.productRating[0],
						commentCont:item.textArea,
						commentTag:item.babelData.tagList,
						orderId:this.orderId,
						commentPictList:item.commentPictListRecord,
					}
				)
			})
		}
		console.log('>>>>>>>>>>data>>>data',data);
		Loading.show();		
        new Fetch({
			url: 'app/orderComment/orderComment.json',  
			bodyType:'json',
			data: data,
        }).dofetch().then((data) => {			
			Toast.show("成功提交");	
			this.props.navigator.pop();				
        }).catch((err) => {
			console.log('=> catch: ', err);		
		}).finally(()=>{
			Loading.hide();
		})		
	}

	_imageExtentComAfter(item,index){
		return (			
			<TouchableOpacity
				onPress={() => this.confirmAlert(item,index)}
				style={{ position: 'absolute', top: 0, right: 10, width: 15, height: 15, }}>
				<Image source={require('../res/PublishComment/067shanchutupian.png')} />
			</TouchableOpacity>
		)
	}

	// 选择图片
	selectPhoto(item){			
		ImageUploader.show((source, res) => {
			Loading.show({title: '上传中...'});
		}, (response) => {
			console.log('>>>>>>>>>上传成功',response);

			Loading.hide();
			item.photoArr.push(response);
			this.setState({
				photoArr: Object.assign([],this.state.deliveredItems),
			});
			// 添加图片fileId			
			item.commentPictList.push(response.fileId);			
			item.commentPictListRecord = item.commentPictList.join(",");
		}, (res) => {
			Loading.hide();
			Toast.show("上传失败");
		});
	}	

	renderPhoto(item) {					
		let imageUrls = item.photoArr.map((value,index)=> {
			return value.url;
		});		
		return (
			<ImageBigBtnList 
				imageStyle={{ width: (screenWidth-70)/5, height: (screenWidth-70)/5, marginHorizontal: 5,}}
				style={{marginTop:10}}
			    urls={imageUrls}
		        fixImageUrl={(orgin_Url)=>{return {uri:orgin_Url}}}
		        extentComAfter={this._imageExtentComAfter.bind(this,item)}
			/>
		)
	}

	comfirmDeleteImg(item,i) {		
		item.photoArr.splice(i, 1);
		item.commentPictList = [];		
		item.photoArr.forEach((e, i) => {
			item.commentPictList.push(e.fileId);
		});
		item.commentPictListRecord = item.commentPictList.join(",");
		
		this.setState({ deliveredItems: Object.assign([],this.state.deliveredItems) });
	};

	confirmAlert(item,i) {
        Alerts.showConfirm({
            moduleBg: { backgroundColor: 'rgba(0,0,0,0.4)' },
            title: '删除提醒',
            titleStyle: { color: '#333' },
            message: '确定删除此图片？',
            confirmTitle: '删除',
            confirmStyle: { color: '#808080' },
            cancelTitle: '取消',
            cancelStyle: { color: '#f00' },
            onCancelPress: () => {               
            },
            onConfirmPress: () => {
                this.comfirmDeleteImg(item,i);
            },
            closeCallBack: () => {               
            }
        });
	}
	leftBtnHandler(){
        Alerts.showConfirm({
			moduleBg: { backgroundColor: 'rgba(0,0,0,0.4)' },
			title:'您尚未提交',
			titleStyle:{color: '#333',fontSize:17},
			message: '是否对已编辑内容进行保存',
			messageStyle:{color: '#333',fontSize:17},
            confirmTitle: '保存',
            confirmStyle: { color: '#007aff',fontSize:16 },
            cancelTitle: '不保存',
            cancelStyle: { color: '#007aff',fontSize:16 },
            onCancelPress: () => {    
				this.props.navigator.pop()
            },
            onConfirmPress: () => {
				this.submit();
            },
            closeCallBack: () => {               
            }
        });		
	}
	componentDidMount(){
		
	}

	render() {			
			
		return(			
			<BaseView
				mainBackColor={{ backgroundColor: '#f5f5f5' }}
				ref={'base'}
				navigator={this.props.navigator}
				mainColor={'#f9f9f9'}
				title={{ title: '发表评价', tintColor: '#333', style:{fontSize: 18, fontWeight:'normal'} }}
				statusBarStyle={'default'}		
				rightButton={this.NavRightButton()}		
				leftBtnHandler={()=>{this.leftBtnHandler()}}
			>	
			 {this.state.orderData && <ScrollView showsVerticalScrollIndicator={false}>
					<View style={{height:67,backgroundColor:'#fff',borderTopWidth:1/PixelRatio.get(),borderColor:'#e5e5e5',paddingHorizontal:13,justifyContent:'center'}}>
						<Text style={{fontSize:15,color:'#0c1828'}}>{'订单 '+this.state.orderData.orderNum}</Text>
						<Text style={{fontSize:11,color:'#55697c',marginTop:5}}>{this.state.orderData.orderTime}</Text>						
					</View>
					<View style={{height:165,paddingHorizontal:13,justifyContent:'space-between',paddingVertical:15, backgroundColor:'#fff',marginTop:5}}>
						<View style={{flexDirection:'row',alignItems:'center'}}>
							{/* <Image style={{height:16,width:16}} source={imageUtil.get(config.host + 'upload/' + this.state.orderData.sysShopInf.logoFileId)}></Image> */}
							<Image style={{height:16,width:16}} source={require('../res/PublishComment/008mendian.png')}></Image>
							<Text style={{marginLeft: 10,fontSize:15,color:'#0c1828'}}>{this.state.orderData.sysShopInf.shopNm}</Text>
						</View>
						<View style={{flexDirection:'row',alignItems:'center'}}>
							<Text style={{fontSize:14,color:'#0c1828'}}>服务态度</Text>
							<StarRating
								style={{ justifyContent: 'center', alignItems: 'center',marginLeft:10 }}
								space={8.5}
								maxStars={5}
								rating={this.state.serviceRating[0]}
								disabled={false}
								starSize={15}		
								onStarChange={this.changRating.bind(this,1,true)}						
							/>
							<Text style={{fontSize:13,color:'#55697c'}}>{this.state.serviceRating[1]}</Text>
						</View>
						<View style={{flexDirection:'row',alignItems:'center'}}>
							<Text style={{fontSize:14,color:'#0c1828'}}>描述相符</Text>
							<StarRating
								style={{ justifyContent: 'center', alignItems: 'center',marginLeft:10 }}
								space={8.5}
								maxStars={5}
								rating={this.state.describeRating[0]}
								disabled={false}
								starSize={15}			
								onStarChange={this.changRating.bind(this,2,true)}					
							/>
							<Text style={{fontSize:13,color:'#55697c'}}>{this.state.describeRating[1]}</Text>
						</View>
						<View style={{flexDirection:'row',alignItems:'center'}}>
							<Text style={{fontSize:14,color:'#0c1828'}}>物流速度</Text>
							<StarRating
								style={{ justifyContent: 'center', alignItems: 'center',marginLeft:10 }}
								space={8.5}
								maxStars={5}
								rating={this.state.logisticsRating[0]}
								disabled={false}
								starSize={15}			
								onStarChange={this.changRating.bind(this,3,true)}					
							/>
							<Text style={{fontSize:13,color:'#55697c'}}>{this.state.logisticsRating[1]}</Text>
						</View>

					</View>
					{this.state.deliveredItems.map((item,i)=>{					
						return(
							<View key={i} style={{marginTop:5,backgroundColor:'#fff'}}>
								<View style={{height:75,flexDirection:'row',alignItems:'center',paddingHorizontal:13,borderBottomWidth:1/PixelRatio.get(),borderColor:'#eee'}}>
									<Image style={{height:45,width:45}} source={imageUtil.get(this.state.orderData.deliveredItems[i].picUrl)}/>
									<View>
										<Text style={{fontSize:14,color:'#444',marginLeft:8.5}}>{this.state.orderData.deliveredItems[i].title}</Text>
										<View style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
											<StarRating
												style={{ justifyContent: 'center', alignItems: 'center'}}
												space={8.5}
												maxStars={5}
												rating={item.productRating[0]}
												disabled={false}
												starSize={15}			
												onStarChange={this.changRating.bind(this,i,false)}					
											/>
											<Text style={{fontSize:13,color:'#55697c'}}>{item.productRating[1]}</Text>
										</View>
									</View>
								</View>
								<View style={{flexDirection:'row',paddingVertical:10,flexWrap:'wrap',paddingHorizontal:8}}>
									{item.babelData.map((item,i,arr)=>{
										return(
											<TouchableOpacity key={i} style={{minWidth:69,height:28,paddingHorizontal:5,alignItems:'center',justifyContent:'center',borderWidth:1/PixelRatio.get(),borderColor:item.check ? '#ff6600' :'#ddd',marginHorizontal:5,marginTop:5,borderRadius:2}}
												onPress={()=>{  
													item.check = !item.check;
													this.setState({deliveredItems:Object.assign([],this.state.deliveredItems)});
													arr.tagList = [];
													arr.forEach((item)=>{
														if(item.check){
															arr.tagList.push(item.nm);
														}
													})
													arr.tagList = arr.tagList.join(',')
													console.log('>>>>>>',arr.tagList);
												}}>
												<Text style={{fontSize:12,color:item.check ? '#ff6600' : '#333'}}>{item.nm}</Text>
											</TouchableOpacity>
										)
									})}
							
										<TextInput
											style={{minWidth:69,height:28,borderWidth:1/PixelRatio.get(),borderColor:'#ddd',marginHorizontal:5,marginTop:5,fontSize:12,color:'#aaaeb9',paddingHorizontal:3,paddingVertical:0,borderRadius:2}}
											placeholder='自定义标签'
											underlineColorAndroid="transparent"		
											placeholderTextColor='#aaaeb9'											
											onChangeText={(str) => {
													item.text = str;
													this.setState({deliveredItems:Object.assign([],this.state.deliveredItems)});
												}}
											value={item.text}
											onBlur={()=>this.textOnBlur(item)}
											maxLength={10}
									 	 />								
								</View>
								<TextInput
									style={{borderWidth:1/PixelRatio.get(),borderColor:'#ddd',paddingBottom:24,paddingHorizontal:5, fontSize:13,color:'#0c1828',marginHorizontal:13,height:80,borderRadius:2,textAlignVertical: 'top'}}
									onChangeText={(str) => {
													item.textArea = str;
													item.textAreaLength = str.length;													
													this.setState({deliveredItems:Object.assign([],this.state.deliveredItems)});
												}}
									underlineColorAndroid="transparent"									
									placeholderTextColor='#aaaeb9'
									placeholder='说说您对购买商品的印象'
									value={item.textArea}
									multiline={true}									
									maxLength={255}
								>
								</TextInput>
								<Text style={{fontSize:10,color:'#aaaeb8',alignSelf:'flex-end',marginRight:18,top:-14}}>{item.textAreaLength + '/255'}</Text>
								<View style={{marginHorizontal:8,flexDirection:'row',alignItems:'center',flexWrap:'wrap',top:-15}}>
									{item.photoArr.length == 0 && 
										<TouchableOpacity onPress={()=>{this.selectPhoto(item)}}>
											<Image style={{width:294*screenWidth/320,height:65*screenWidth/320,marginLeft:5,marginTop:10, justifyContent:'center',alignItems:'center'}} source={require('../res/PublishComment/006tianjiamoren.png')} resizeMode='contain'>
												<View style={{height:60,width:60,justifyContent:'flex-end',alignItems:'center',paddingBottom:10}}>
													<Text style={{fontSize:12,color:'#aaaeb9',marginTop:5}}>上传图片</Text>
												</View>												
											</Image>
										</TouchableOpacity>
									}
									{this.renderPhoto(item)}
									{item.photoArr.length < 5 && item.photoArr.length != 0 &&
										<TouchableOpacity
											style={{ width: (screenWidth-70)/5, height: (screenWidth-70)/5,marginHorizontal:5,marginTop:10 }}
											onPress={() => {this.selectPhoto(item)}}
										>
											<Image style={{height:(screenWidth-70)/5,width:(screenWidth-70)/5}} source={require('../res/PublishComment/006tianjia.png')}/>
										</TouchableOpacity>
									}
								</View>
							</View>
						)
					})}				
					<KeyboardSpacer/>
			</ScrollView>}
			</BaseView>
		)
	}
}