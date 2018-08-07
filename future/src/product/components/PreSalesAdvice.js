import React, { Component } from 'react';
import {
	View,
	Dimensions,
	Text,
	Image,
	TouchableOpacity,
	TextInput,
	PixelRatio,
	ScrollView,
	StyleSheet,
	Keyboard
} from 'react-native';
var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;

import _ from 'underscore';
import Fetch from 'future/public/lib/Fetch';
import Styles from 'future/public/lib/styles/Styles';
import { RefreshableListView, BaseView, Toast,Loading } from 'future/public/widgets';
import ScrollableTabBar from 'future/public/commons/ScrollableTabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import KeyboardSpacer from 'react-native-keyboard-spacer';

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: null
		}
		this.fetchData = this._fetchData.bind(this);
		this.renderRow = this._renderRow.bind(this);

	}
	//获取数据
	_fetchData(page, success, error) {
		new Fetch({			
			url: '/app/product/findBuyConsult.json?'+'productId='+this.props.productId+'&'+'pageNum='+page+'&'+'limit='+10,
			method:'GET',
		}).dofetch().then((data) => {
			success(data.result, 10 * (page - 1) + data.result.length, data.totalCount);
		}).catch((err) => {
			error && error();
			console.log('=> catch: ', err);
		});
	}


	_renderRow(rowData, sectionID, rowID, highlightRow) {
		return (
			<View style={[styles.container,{marginTop:rowID==1?10:0}]}>
				<View style={{height:85,justifyContent:'space-around',paddingVertical:5,borderBottomColor:'#e5e5e5',borderBottomWidth:1/PixelRatio.get()}}>
					<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
						<View style={{flexDirection:'row',alignItems:'center'}}>	
							<Image source={require('../res/images/PreSalesAdvice/003touxiang.png')}/>
							<Text style={{marginLeft:5,fontSize:11,color:'#999'}}>{rowData.userName}</Text>
						</View>
						<Text style={{marginLeft:5,fontSize:11,color:'#999'}}>{rowData.consultTimeString}</Text>
					</View>
					<View style={{flexDirection:'row',alignItems:'center',}}>				
						<Text style={{fontSize:10,color:'#fff',backgroundColor:'#0082ff',padding:3}}>询</Text>
						<Text style={{marginLeft:5,fontSize:14,color:'#4b5963'}}>{rowData.consultCont}</Text>			
					</View>
				</View>
				<View style={{paddingVertical:15,flexDirection:'row',alignItems:'flex-start'}}>
					<Text style={{fontSize:10,color:'#fff',backgroundColor:'#ff6600',padding:3}}>答</Text>
					<Text style={{flex:1,marginLeft:5,fontSize:14,color:'#0c1828'}}>{rowData.consultReplyCont}</Text>
				</View>
			</View>
		)
	}
	render() {
		return (
			<RefreshableListView
				style={styles.list}
				ref="listView"
				pageSize={10}
				initialListSize={0}
				autoRefresh={true}
				autoLoadMore={true}
				fetchData={this.fetchData}
				renderRow={this.renderRow.bind(this)}
				scrollRenderAheadDistance={100}
				onEndReachedThreshold={200}
				stickyHeaderIndices={[]}
				/>
		)
	}
}

export default class centralPurchaseApplyList extends Component {
	constructor(props) {
		super(props);
	}
	jumpTo(){
		this.props.navigator.push({
			component:PreSalesAdvice2,
			params:{
				productId:this.props.params.productId,
			}
		})
	}

	render() {
		return (
			<BaseView navigator={this.props.navigator}
				ref='base'
				scrollEnabled={false}
				title={{title:'售前咨询',tintColor:'#333333'}}
				leftButton={<Text style={{alignSelf:'center',fontSize:16,color:'#444444',marginLeft:12}}
							onPress={()=>{this.props.navigator.pop()}}>
							关闭</Text>}
				>
			<List tabLabel="咨询内容" navigator={this.props.navigator} productId ={this.props.params.productId}/>
	
			<TouchableOpacity style={[Styles.layout.horCenter,{height:50}]}
				onPress={()=>{this.jumpTo()}}>
				<Image style={{height:15,width:15}} source={require('../res/images/ProductDetail/003woyaoxunjia.png')}/>
				<Text style={{fontSize:13,color:'#051b28',marginLeft:5}}>我要咨询</Text>
			</TouchableOpacity>
			</BaseView>
		)
	}
}

class PreSalesAdvice2 extends Component {
	constructor(props){
		super(props);
		this.state = {
			value:'',
			beEdit:true,
		}
		//成功后要跳回的路由
		this.poproute = this.props.navigator.getCurrentRoutes()[this.props.navigator.getCurrentRoutes().length - 3];		
	}
	submit(){
		if(this.state.value.trim() === '') return Toast.show('请先填写您的问题');
		Loading.show();
		new Fetch({
			url: "/app/product/addBuyConsult.json",
			method: "POST",			
			data: {
				productId: this.props.params.productId,
				consultCont:this.state.value,
			}
		}).dofetch().then((data) => {				 
			Toast.show('成功');		
			this.props.navigator.popToRoute(this.poproute);				
		}).catch((err) => {
			console.log("失败: ",err);			
		}).finally(()=>{
			Loading.hide()
		})	
	}
	render(){
		return (
			<BaseView navigator={this.props.navigator}
				ref='base'
				scrollEnabled={false}
				title={{title:'售前咨询',tintColor:'#333333'}}
				leftButton={<Text style={{alignSelf:'center',fontSize:16,color:'#444444',marginLeft:12}}
							onPress={()=>{this.props.navigator.pop()}}>
							关闭</Text>}
				>
				<View style={styles.list}>					
					<View style={{height:50,justifyContent:'center',paddingHorizontal:12}}>
						<Text style={{fontSize:13,color:'#52555e'}}>请描述下您的问题</Text>
					</View>
					<View style={{paddingHorizontal:12,backgroundColor:'#fff'}}>
						<TextInput
							ref="textInput"
							placeholder='请描述下您的问题'
							value={this.state.value}							
							multiline={true}
							autoFocus={true}
							underlineColorAndroid={'transparent'}
							onChangeText={(value) => {this.setState({ value });	if(value.length>200){Toast.show('描述字符请在200字内')}
								}}
							onFocus={()=>{this.setState({beEdit:true})}}
							style={{height:130, flexDirection: 'row', color: '#0c1828', fontSize: 14,alignItems:'flex-start',textAlignVertical: "top", justifyContent: 'flex-start',backgroundColor:'#fff'}}
							/>
							<View style={{height:30,alignItems:'flex-end',justifyContent:'center'}}>
								<Text style={{color:this.state.value.length>200?'#e13027':'#aaaeb9',fontSize:10}}>{this.state.value.length}/200</Text>
							</View>
					</View>
					<View activeOpacity={0.8} style={{flex:1,justifyContent:'flex-end',}}>
						{this.state.beEdit?<TouchableOpacity style={{height:40,justifyContent:'center',alignSelf:'stretch',alignItems:'flex-end',borderTopWidth:1/PixelRatio.get(),borderBottomWidth:1/PixelRatio.get(),borderColor:'#acb3bd'}}
							onPress={()=>{
								this.setState({beEdit:false});
								Keyboard.dismiss()}
								}>
							<Text style={{ color: '#0082ff', fontSize: 16,marginRight:18 }}>完成</Text>
						</TouchableOpacity>:<View/>}
					</View>
					
					{!this.state.beEdit ? <TouchableOpacity style={{height:50,flexDirection:'row',alignItems:'center' ,alignSelf:'stretch'}}>
						<TouchableOpacity style={{height:50,width:50,justifyContent:'center',alignItems:'center'}}
							onPress={()=>{this.props.navigator.pop()}}>
							<Image style={{}} source={require('../res/images/ProductDetail/backBtn.png')}/>
						</TouchableOpacity>
						<TouchableOpacity style={{flex:1,height:50, justifyContent:'center',alignItems:'center',backgroundColor: this.state.value!=''?'#34457d':'#e0e0e1'}}
							onPress={this.submit.bind(this)}>
							<Text style={{color:this.state.value!=''?'#bfbfbf':'#fff', fontSize: 16}}>提交</Text>								
						</TouchableOpacity>
					</TouchableOpacity> :<View/>}
					
					<KeyboardSpacer />
				</View>
				
			</BaseView>
		)
	}
}

const styles = Styles.create({
	list:{
		flex:1,
		borderTopWidth:1/PixelRatio.get(),
		borderColor:'#e5e5e5',
		backgroundColor:'#f5f5f5',		
	},
	container: {		
		flex: 1,
		width: screenWidth,
		backgroundColor: '#fff',
		flexDirection: 'column',
		paddingHorizontal: 12,
	},
})