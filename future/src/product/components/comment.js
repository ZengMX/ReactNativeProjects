import React, { Component } from 'react';
import {
	View,	
	ScrollView,
	TouchableOpacity,	
	PixelRatio,
	Dimensions,	
	TextInput,
	Image,
	ListView,
	InteractionManager
} from 'react-native';
import { BaseView,Arrow,Separator,Text,RefreshableListView,StarRating } from 'future/public/widgets';
import Fetch from 'future/public/lib/Fetch'
import imageUtil from 'future/public/lib/imageUtil'
import MoreOperation from '../../commons/moreOperation/components/MoreOperation';

var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;


export default class Comment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
			empty:false,
			commentData:{},
			showAllComment: false,
			showTriangle:true,
			babelBarHeight:73.5,
			totalCheck:true,
			goolCheck:false,
			normalCheck:false,
			badCheck:false,
			shareOrderCheck:false,
		}		
		this.requestData = {
			productId: this.props.params.productId,
			limit: 10,		
		}

		// this.data = [
		// 			{nm:'全部',num:this.state.commentData.total,check:true,commentStatistics:''},
		// 			{nm:'好评',num:this.state.commentData.good,check:false,commentStatistics:'good'},
		// 			{nm:'中评',num:this.state.commentData.normal,check:false,commentStatistics:'normal'},
		// 			{nm:'差评',num:this.state.commentData.bad,check:false,commentStatistics:'bad'},
		// 			{nm:'晒单',num:this.state.commentData.shareOrder,check:false,commentStatistics:'shareOrder'},
		// 			]	

		this.getStaticComment = this.getStaticComment.bind(this);
		this.fetchData = this.fetchData.bind(this);
		this.onPullRefresh = this.onPullRefresh.bind(this);
	}

	componentWillMount() {
		new Fetch({
			url: 'app/comment/getCommentStatisticsAndTag.json',			
			data: {
				productId: this.props.params.productId,
			}
		}).dofetch().then((data) => {	
			data.result.productTagList.length && data.result.productTagList.forEach((item,i,arr)=>{
				arr[i] = {nm:item,check:false};
			})	
			this.setState({ commentData: data.result });
			
		}).catch((error) => {
			console.log("error===>>", error);
		});		
	}
	onPullRefresh(){
		InteractionManager.runAfterInteractions(() => {	
			this.refs.listView.pullRefresh();
		});		
	}

	changeTag() {
		this.state.totalCheck = false;
		this.state.goolCheck = false;
		this.state.normalCheck = false;
		this.state.badCheck = false;
		this.state.shareOrderCheck = false;
	}
	changeTagTwo(index) {
		this.state.commentData.productTagList.forEach((item,i,arr)=>{
			if(i == index){
				arr[i].check = true;
			}else{
				arr[i].check = false;
			}
		})
	}

	getStaticComment (){
		
		return(
			[
				<TouchableOpacity key={'a'} style={{minWidth:60,height:24,backgroundColor:this.state.totalCheck?'#0082ff':'#F2F9FF',borderWidth:1/PixelRatio.get(),borderColor:'#0082ff',justifyContent:'center',alignItems:'center',marginRight:10,marginTop:10,paddingHorizontal:5}}
					onPress={()=>{
						delete this.requestData.commentStatistics; 
						delete this.requestData.tag,
						this.changeTag();
						this.changeTagTwo();
						this.state.totalCheck = true
						this.setState({ commentData: Object.assign({},this.state.commentData) });
						this.onPullRefresh()			
					}}>
					<Text style={{fontSize:12,color:this.state.totalCheck?'#fff':'#444'}}>{'全部' + ' ' + this.state.commentData.total}</Text>
				</TouchableOpacity>,
				<TouchableOpacity key={'b'} style={{minWidth:60,height:24,backgroundColor:this.state.goolCheck?'#0082ff':'#F2F9FF',borderWidth:1/PixelRatio.get(),borderColor:'#0082ff',justifyContent:'center',alignItems:'center',marginRight:10,marginTop:10,paddingHorizontal:5}}
					onPress={()=>{
						delete this.requestData.tag,
						this.requestData.commentStatistics = 'good';
						this.changeTag();
						this.changeTagTwo();
						this.state.goolCheck = true
						this.setState({ commentData: Object.assign({},this.state.commentData) });
						this.onPullRefresh()
					}}>
					<Text style={{fontSize:12,color:'#444'}}>{'好评' + ' ' + this.state.commentData.good}</Text>
				</TouchableOpacity>,
				<TouchableOpacity key={'c'} style={{minWidth:60,height:24,backgroundColor:this.state.normalCheck?'#0082ff':'#F2F9FF',borderWidth:1/PixelRatio.get(),borderColor:'#0082ff',justifyContent:'center',alignItems:'center',marginRight:10,marginTop:10,paddingHorizontal:5}}
					onPress={()=>{
						delete this.requestData.tag,
						this.requestData.commentStatistics = 'normal';
						this.changeTag();
						this.changeTagTwo();
						this.state.normalCheck = true
						this.setState({ commentData: Object.assign({},this.state.commentData) });
						this.onPullRefresh()
					}}>
					<Text style={{fontSize:12,color:'#444'}}>{'中评' + ' ' + this.state.commentData.normal}</Text>
				</TouchableOpacity>,
				<TouchableOpacity key={'d'} style={{minWidth:60,height:24,backgroundColor:this.state.badCheck?'#0082ff':'#F2F9FF',borderWidth:1/PixelRatio.get(),borderColor:'#0082ff',justifyContent:'center',alignItems:'center',marginRight:10,marginTop:10,paddingHorizontal:5}}
					onPress={()=>{
						delete this.requestData.tag,
						this.requestData.commentStatistics = 'bad';
						this.changeTag();
						this.changeTagTwo();
						this.state.badCheck = true
						this.setState({ commentData: Object.assign({},this.state.commentData) });
						this.onPullRefresh()
					}}>
					<Text style={{fontSize:12,color:'#444'}}>{'差评' + ' ' + this.state.commentData.bad}</Text>
				</TouchableOpacity>,
				<TouchableOpacity key={'e'} style={{minWidth:60,height:24,backgroundColor:this.state.shareOrderCheck?'#0082ff':'#F2F9FF',justifyContent:'center',alignItems:'center',marginRight:10,marginTop:10,paddingHorizontal:5}}
					onPress={()=>{
						delete this.requestData.tag,
						this.requestData.commentStatistics = 'shareOrder';
						this.changeTag();
						this.changeTagTwo();
						this.state.shareOrderCheck = true
						this.setState({ commentData: Object.assign({},this.state.commentData) });
						this.onPullRefresh()
					}}>
					<Text style={{fontSize:12,color:'#444'}}>{'晒单' + ' ' + this.state.commentData.shareOrder}</Text>
			    </TouchableOpacity>,
			]
		)
	}

	fetchData(page, success, error) {
		new Fetch({
			url: 'app/comment/findProductComments.json',			
			data: Object.assign(this.requestData,{pageNumber:page}) 
		}).dofetch().then((data) => {	
			success(data.result.result, 10 * (page - 1) + data.result.result.length, data.result.totalCount);
		}).catch((error) => {
			error && error(err);
		});
	}
	renderRow(rowData, sectionID, rowID) {	
		return(
			<View style={{backgroundColor:'#fff',marginTop:rowID == 0 ? 5 : 0,borderBottomWidth:1/PixelRatio.get(),borderColor:'#eee',paddingVertical:15}}>	
				<View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:13,}}>
					<View style={{flexDirection:'row'}}>
						<Image style={{width:25,height:25}} source={imageUtil.get(rowData.userIcon)}/>
						<View style={{marginLeft:7,justifyContent:'space-between',alignItems:'center'}}>
							<StarRating
								style={{ justifyContent: 'center', alignItems: 'center' }}
								space={1}
								maxStars={5}
								rating={rowData.score}
								disabled={true}
								starSize={10}								
							/>
							<Text style={{fontSize:12,color:'#53606a'}}>{rowData.userName}</Text>
						</View>
					</View>	
					<Text style={{fontSize:12,color:'#999',alignSelf: 'flex-end'}}>{rowData.buyTimeString.replace(/-/g,'.')}</Text>
				</View>	
				<Text style={{marginTop:10,fontSize:11,color:'#53606a',paddingHorizontal:13}}>{rowData.commentCont}</Text>
				<View  style={{flexDirection:'row',flexWrap:'wrap',alignItems:'center',paddingHorizontal:8,marginTop:5}}>							
					{rowData.commentPictList && rowData.commentPictList.map((item,i)=>{
						return(							
							<Image key={i} style={{width:65,height:65,marginHorizontal:5}} source={imageUtil.get(item)}></Image>
						)
					})}
				</View>
			</View>		
		)
	}
	customEmpty(){
		return (
			<View style={{alignItems:'center',top:-25}}>
				<Image 
				style={{marginTop:105}} 
				resizeMode='contain' 
				source={require('../res/images/comment/004shibai.png')}/>
				<Text style={{marginTop:33,fontSize:14,color:'#444'}}>暂时没有相应的评价</Text>				
				<Text style={{marginTop:5,fontSize:14,color:'#999'}}>看看其他的~</Text>				
			</View>		
		)
	}

	render() {		
		let commentData = this.state.commentData;
		let data = commentData.productTagList;
		return(			
			<BaseView
				mainBackColor={{ backgroundColor: '#f5f5f5' }}
				ref={'base'}
				navigator={this.props.navigator}
				mainColor={'#f9f9f9'}
				title={{ title: '评价', tintColor: '#333', style:{fontSize: 18, fontWeight:'normal'} }}
				statusBarStyle={'default'}					
			>	
			<View style={{backgroundColor:'#f5f5f5'}}>
				<View style={{height:50,backgroundColor:"#fff",flexDirection:'row',alignItems:'center',paddingHorizontal:13}}>
					<Image style={{height:30,width:30}} source={imageUtil.get(commentData.productPicUrl)}/>
					<Text style={{marginLeft: 16,fontSize:14,color:'#444'}}>用户满意度</Text>
					<Text style={{marginLeft: 4,fontSize:14,color:'#ff6600'}}>{commentData.goodRate}</Text>
				</View>

				<ScrollView contentContainerStyle={[{backgroundColor:"#fff",flexDirection:'row',alignItems:'center',paddingLeft:13,paddingRight:3, paddingTop:5,flexWrap:'wrap',borderTopWidth:1/PixelRatio.get(),borderColor:'#eee',maxHeight: this.state.babelBarHeight},this.state.showAllComment ? {height:135}: {}]} 	
					onLayout={(e)=>{
						console.log('>>>>>>',e.nativeEvent.layout);
						if(e.nativeEvent.layout.height < 65){
							this.setState({showTriangle:false});
						}else{
							this.setState({showTriangle:true});
						}
					}}
				>

					{data && this.getStaticComment().concat(data.map((item,i)=>{
						console.log('item',item);
						if(this.state.showAllComment || (!this.state.showAllComment && i<3)){								
							return(
								<TouchableOpacity key={i} style={{minWidth:60,height:24,backgroundColor:item.check?'#0082ff':'#F2F9FF',justifyContent:'center',alignItems:'center',marginRight:10,marginTop:10,paddingHorizontal:5}} 
									onPress={()=>{
										delete this.requestData.commentStatistics;
										this.requestData.tag = item.nm;
										this.changeTag();
										this.changeTagTwo(i)										
										this.setState({ commentData: Object.assign({},this.state.commentData) });
										this.onPullRefresh()
									}}>
									<Text style={{fontSize:12,color:'#444'}}>{item.nm}</Text>
								</TouchableOpacity>
							)
						}
					}))
					}
				</ScrollView>
				{this.state.showTriangle ? <View style={{height:24,backgroundColor:'#fff'}}>
					<TouchableOpacity style={{left:screenWidth/2-4,top:10}}
						hitSlop={{top:5,left: 5, bottom: 5, right: 5}}
						onPress={()=>{
							if(!this.state.showAllComment){
								this.setState({showAllComment:!this.state.showAllComment,babelBarHeight:135});
							}else{
								this.setState({showAllComment:!this.state.showAllComment,babelBarHeight:73.5});
							}
						}}>
						<Image style={{width:8,height:4}} source={this.state.showAllComment ? require('../res/images/comment/000zuixiaosanshan.png'): require('../res/images/comment/000zuixiaosanxia.png')}/>
					</TouchableOpacity></View>:<View style={{height:15,backgroundColor:'#fff'}}/>}
				<RefreshableListView
					ref="listView"					
					autoRefresh={true}
					refreshable={true}
					scrollRenderAheadDistance={200}
					pageSize={10}					
					onEndReachedThreshold={200}
					dataSource={this.state.dataSource}
					fetchData={this.fetchData.bind(this)}
					renderRow={this.renderRow.bind(this)}
					customEmpty={this.customEmpty()}
					/>
			</View>
			</BaseView>
		)
	}
}