import React, { Component } from 'react';
import {
	View,
	ScrollView,
	Dimensions,
	StyleSheet,
	Navigator,
	TouchableOpacity,
	TouchableHighlight,
	Image,
	PixelRatio,
	Modal,
	TextInput,
	Platform,	
} from 'react-native';
import {
	Fetch,
	imageUtil,
	ValidateUtil
} from 'future/public/lib';
import {
	BaseView,
	Banner,
	Text,
	Toast,
	Page,
	DataController,
	MaskModal,
	Loading,	
	TextInputC,	
	CheckBox,
	RefreshableListView,
	ListViewWithState
} from 'future/public/widgets';
import SupplierHome from '../../supplierHome/components/SupplierHome';

var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;
import Styles from 'future/public/lib/styles/Styles';
import _ from 'underscore';

class List extends Component {
	constructor(props) {
		super(props);

		this.fetchData = this._fetchData.bind(this);
		this.renderRow = this._renderRow.bind(this);
		this.timer = undefined;
	}
    componentWillReceiveProps(nextProps) {
        if (nextProps.beEdit!=this.props.beEdit) {
			this.refs.listView.localUpdate();
        }
        if(nextProps.searchCont !== this.props.searchCont){
        	this.timer && clearTimeout(this.timer);
        	this.timer = setTimeout(()=>{
        		this.refs.listView.pullRefresh();
        	},300);
        }
    }

    componentWillUnmount(){
    	this.timer && clearTimeout(this.timer);
    }

	//获取数据
	_fetchData(page, success, error) {
		new Fetch({			
			url: '/app/shop/getCollectionShopList.json?',
			data:{
				pageNumber:page,
				limit:99999,
				searchCont:this.props.searchCont,
			}
		}).dofetch().then((data) => {
			//添加数据
			for(idx of data.result.result){
				idx.checked = false;
			}
			// let arr = [];
			// for(let i = 0;i<5;++i){
			// 	arr.push(Object.assign({},data.result.result[0]))
			// }
			// this.localData=arr;
			// success(arr, 99999 * (page - 1) + data.result.result.length, data.result.totalCount);

			this.localData=data.result.result;

			success(data.result.result, 99999 * (page - 1) + data.result.result.length, data.result.totalCount);
		}).catch((err) => {
			error && error();
			console.log('=> catch: ', err);
		});
	}

	checkIsSelectedAll = () =>{
		return this.localData.every((e,i)=>{
			if(e.checked) return true;
			return false;
		})
	}

	_selectClick(rowData,rowID){
		this.localData[rowID].checked = !this.localData[rowID].checked;
		this.refs.listView.localUpdate();
		if(this.checkIsSelectedAll()){
			this.props.setSelectAll && this.props.setSelectAll(true)
		}else{
			this.props.setSelectAll && this.props.setSelectAll(false)
		}
	}
	clickChooseAll(bool){
		for(idx of this.localData){
			if(bool){
				idx.checked=false;
			}else{
				idx.checked=true;
			}
			this.refs.listView.localUpdate();
		}
	}
	//取消收藏
	cancelCollection(){
		let shopIds = [];
		for(idx of this.localData){
			if(idx.checked){
				shopIds.push(idx.shopInfId);
			}
		}
		if(shopIds.length <= 0){
			return Toast.show('请勾选商家');
		}
		Loading.show();
		new Fetch({			
			url: '/app/shop/batchRemoveCollectionShop.json?',
			bodyType:'json',
			data:shopIds,
			
		}).dofetch().then((data) => {			
			Toast.show('操作成功')	
			this.refs.listView.reloadData();		
		}).catch((err) => {			
			console.log('=> catch: ', err);
		}).finally(()=>{
			Loading.hide()
		});		
	}

	openComponent = (component,params={}) => {
		let navigator = this.props.navigator;
		if(navigator){
			navigator.push({
				component,
				params,
			})
		}
	}

	_renderRow(rowData, sectionID, rowID, highlightRow) {					
		return (
			<View style={{marginTop:rowID!=0?10:0,flexDirection:'row',width:screenWidth}}>
				{this.props.beEdit && <View style={{width:50,justifyContent:'center',alignItems:'center'}}>
					<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center',height:50,width:19}} activeOpacity={1}
						onPress={this._selectClick.bind(this,rowData,rowID)}>							
						<View style={{width:19,height:19,borderRadius:9,borderColor:rowData.checked?'#fff':'#c9c9c9',borderWidth:1,alignItems:'center',justifyContent:'center'}}>

							{rowData.checked?<Image style={{width:17,height:17,resizeMode:'contain'}} source={require('../res/shopStore/checked.png')}/>:<View/>}
						</View>
					</TouchableOpacity>
				</View>}	
				<View style={{backgroundColor:'#fff',width:screenWidth}}>
					<TouchableOpacity
						style={{flexDirection:'row',alignItems:'center', height:69, borderBottomWidth:1/PixelRatio.get(),borderColor:'#e5e5e5',marginHorizontal:13}}
						onPress={()=>{
							this.openComponent(SupplierHome,{shopInfId:rowData.shopInfId})
						}}
					>
						<Image style={{width:40,height:40}} source={imageUtil.get(rowData.shopLogo)}/>
						<View style={{marginLeft:11,flex:1}}>
							<Text style={{fontSize:16,color:'#333'}}>{rowData.shopNm}</Text>
							<View style={{flexDirection:'row',marginTop:10}}>
								<Text style={{fontSize:12,color:'#666'}}>商品总数</Text>
								<Text style={{fontSize:12,color:'#ff6600',paddingHorizontal: 5}}>{rowData.allProductNum}</Text>
								<Text style={{fontSize:12,color:'#666'}}>件</Text>
								<Text style={{fontSize:12,color:'#666',marginLeft:13}}>成交</Text>
								<Text style={{fontSize:12,color:'#ff6600',paddingHorizontal: 5}}>{rowData.orderNum}</Text>
							</View>	
						</View>
						<Text style={{fontSize:11,color:'#999'}}>进入店铺</Text>
						<Image style={{width:10}}style={{marginLeft:5}} source={require('../res/shopStore/000xiangyousanjiao.png')}/>
					</TouchableOpacity>
					<ScrollView
						contentContainerStyle={{height:85,alignItems:'center',paddingHorizontal:5}}
						showsHorizontalScrollIndicator={false}
						horizontal={true}
					>
						{_.map(rowData.shopProductList,(data,index)=>{							
							return (																						
								<Image
									key={index}
									style={{width:50,height:50,marginHorizontal:10,}}
									source={imageUtil.get(data.imageUrls[0])}
								/>										
							)
						})}
					</ScrollView>
				</View>
			</View>
		)
	}
	render() {		
		return (
			<ListViewWithState
				style={styles.list}
				ref="listView"
				pageSize={10}				
				autoRefresh={true}
				autoLoadMore={true}
				fetchData={this.fetchData}
				renderRow={this.renderRow.bind(this)}
				scrollRenderAheadDistance={100}
				onEndReachedThreshold={200}				
			/>
		)
	}
}

export default class ShopStore extends Component {
	constructor(props){
		super(props);
		this.state = {
			beEdit:false,
			chooseAll:false,
			btnNM:'编辑',
			searchWord: '', //搜索关键字
		}
	}
	renderRightButton(){
		return(		
			<Text style={{fontSize:16,color:'#444',alignSelf:'center',marginRight: 13}}
				onPress={()=>{					
					if(this.state.btnNM=='编辑'){
						this.setState({btnNM:'完成'})
					}else{
						this.setState({btnNM:'编辑'})						
					}
					this.setState({beEdit:!this.state.beEdit})
					}}
				>{this.state.btnNM}
			</Text>		
		)
	}
	
	clickChooseAll(){
		if(this.state.chooseAll){
			this.refs.list.clickChooseAll(true);
		}else{
			this.refs.list.clickChooseAll(false);
		}
		this.setState({chooseAll:!this.state.chooseAll});
		
	}


	render() {
		return (	
			<View style={{ flex: 1 }}>
				<BaseView navigator={this.props.navigator}
					ref={base=>this.base = base}						
					title={{title:'商家收藏',tintColor:'#333333'}}
					rightButton={this.renderRightButton()}										
					leftBtnStyle={{width:10,height:17,tintColor:'#444444'}}
					statusBarStyle={'default'}
				>
					<View style={{flex:1,width:screenWidth, borderTopWidth:1/PixelRatio.get(),borderColor:'#e5e5e5',backgroundColor:'#f5f5f5'}}>
						{
							!this.state.beEdit &&
							<View style={{height:44,borderBottomWidth:1/PixelRatio.get(),borderColor:'#e5e5e5',justifyContent:'center',backgroundColor:'#fff'}}>
								<View style={{height:30,marginHorizontal:13,backgroundColor:'#ececec',flexDirection:'row',justifyContent:'center',alignItems:'center',borderRadius:4}}>
									<Image style={{width:14,height:14,marginHorizontal:5,}} source={require('../res/shopStore/a002sousuo.png')}/>
									<TextInputC
										onChangeText={(text) => {
											this.setState({
												searchWord: text
											});
										} }
										returnKeyType={'search'}
										numberOfLines={1}
										ref='search'
										value={this.state.searchWord}
										clearButtonMode={'while-editing'}
										placeholder='商家名|联系人'
										placeholderTextColor='#BBBBBB'
										style={{ color: '#333333', fontSize: 13, flex: 1 }}
									/>
								</View>
							</View>
						}
						<List
							ref='list'
							searchCont={this.state.searchWord}
							beEdit={this.state.beEdit}
							navigator={this.props.navigator}
							setSelectAll={(status)=>{
								this.setState({
									chooseAll: status,
								})
							}}
						/>

						{this.state.beEdit && <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',justifyContent:'space-between',height:50,width:screenWidth,paddingHorizontal:13}}>	
							<View style={{flexDirection:'row',alignItems:'center'}}>
								<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center',height:50,width:19}} activeOpacity={1}
									onPress={this.clickChooseAll.bind(this)}>							
									<View style={{width:19,height:19,borderRadius:9,borderColor:this.state.chooseAll?'#fff':'#c9c9c9',borderWidth:1,justifyContent:'center',alignItems:'center'}}>
										{this.state.chooseAll?<Image style={{width:17,height:17,resizeMode:'contain'}} source={require('../res/shopStore/checked.png')}/>:<View/>}
									</View>
								</TouchableOpacity>
								<Text style={{marginLeft:5,fontSize:14,color:'#333'}}>全选</Text>
							</View>								
							<View style={{width:70,height:28,borderWidth:1/PixelRatio.get(),borderColor:'#0082ff',justifyContent:'center',alignItems:'center'}}>
								<Text style={{color:'#0082ff',fontSize:13}}
									onPress={()=>{this.refs.list.cancelCollection()}}
									>取消收藏</Text>
							</View>
						</View>}
					</View>
				</BaseView>
			</View>
		);
	}
}

const styles = Styles.create({

});



