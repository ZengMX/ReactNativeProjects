/**
 *
 * Props:
 * 	refreshable 	: true, // 是否下拉, 默认true
 *	pagination	 	: true, // 是否分页, 默认true
 *	autoLoadMore 	: true,
 *	displayStatus   : {
 *		'wait':'点击加载更多',
 *		'loading':'加载中...',
 *		'error':'加载失败，点击重新加载',
 *		'done':'已经没有更多了'
 *	},
 *  controlProps  	: {} 	// 下拉控制属性
 *  dataSource : ListView.DataSource
 *  // 加载数据方法, 回传page给加载函数，
 *  // 加载成功回调接受rows(新增的row)currCount(当前数据条数，兼容一个数据多个row的情况)totalCount(总数据条数)
 *  fetchData  : function(page, function(rows, currCount, totalCount){
 * 		// 成功回调
 *  }, function(){
 * 		// 错误回调
 *  })
 *
 *  注: 只有fetchData参数是必须的。
 *
 */
'use strict'

import React, {Component} from 'react';
import {
	View,
	Image,
    ListView,
	RefreshControl,
	TouchableHighlight,
	TouchableOpacity,
	ActivityIndicator,
	PixelRatio,
	Text,
	StyleSheet,
	Dimensions,
	InteractionManager
} from 'react-native';

import SGListView from 'react-native-sglistview';
import {Toast} from '../../widgets';

let SCREEN_WIDTH = Dimensions.get('window').width;

class RefreshableListView extends Component {
	constructor(props){
		super(props);
		// console.log('props >> ', props);
		this.state = {
			dataSource : this.props.dataSource,
			status : 'wait',
			isRefreshing : false,
			isMyriad : false,
			checkNetwork : true,
			openCheckNetwork : this.props.openCheckNetwork,
		}
		this.totalCount = 0;
		this.page = 1;
		this.listViewHeight = 0;
		this.filled = false;

		this.onPullRefresh = this._onPullRefresh.bind(this);
		this.onLoadMore    = this._onLoadMore.bind(this);
		this.renderFooter  = this._renderFooter.bind(this);
		this.handleEndReached = this._handleEndReached.bind(this);
	}
	static defaultProps = {
		refreshable 	: true,
		pagination	 	: true,
		autoLoadMore 	: true,
		autoRefresh		: false,
		dataSource		: new ListView.DataSource({rowHasChanged: (r1, r2) => true}),
		displayStatus : {
			'wait':'点击加载更多',
			'loading':'加载中...',
			'error':'加载失败，点击重新加载',
			'done':'已经没有更多了'
		},
		noDatas         : undefined,
		openCheckNetwork    : true
  	}
	static propTypes = {
		refreshable 	: React.PropTypes.bool, 				// 是否下拉, 默认true
		pagination	 	: React.PropTypes.bool,					// 是否分页, 默认true
		fetchData		: React.PropTypes.func.isRequired,		// 加载数据方法
		controlProps	: React.PropTypes.object,				// 下拉控制器其他属性
		dataSource 		: React.PropTypes.object,				// 数据
		autoLoadMore	: React.PropTypes.bool,					// 自动加载更多(不需要点击), 默认true
		autoRefresh		: React.PropTypes.bool,					// 进入页面自动加载
		noDatas         : React.PropTypes.object,
		openCheckNetwork	: React.PropTypes.bool,					// 是否需要检查网络
	}
	componentDidMount() {
		if(this.props.autoRefresh){
			InteractionManager.runAfterInteractions(() => {
				this.setState({isRefreshing : true});
				this._onPullRefresh();
			});
		}
	}
	// shouldComponentUpdate(nextProps,  nextState){
	// 	// console.log("1. nextProps", nextProps);
	// 	// console.log("1. nextState", nextState);
	// 	return true;
	// }

	// componentWillReceiveProps(nextProps){
	// }
	// onChangeVisibleRows(visibleRows, changedRows) {
	// 	// console.log('visibleRows = ', visibleRows);
	// 	// console.log('changedRows = ', changedRows);
	// }
	pullRefresh(){
		this.refs.listview.getNativeListView().scrollTo&&this.refs.listview.getNativeListView().scrollTo({x: 0, y: 0, animated:false});
		this.setState({isRefreshing : true});
		this._onPullRefresh();
	}
	_onPullRefresh(){
		this.page = 0;
		this.filled = false;
		this._onRefresh();
	}
	_onLoadMore(){
		if(this.state.status !== 'loading' && this.state.isRefreshing == false){
			this.setState({status : 'loading'});
			//page自加放在这里可以解决列表连续快速刷新出现重复数据的bug
			this.page++;
			this._onRefresh();
		}
	}
	_onRefresh() {
		this.props.fetchData(this.page + 1, (rows, currCount, totalCount) => {
			this.totalRowCount = currCount;
			this.totalCount = totalCount;
			if(rows != null || rows != undefined){
				if(this.page == 0){
					if(rows.length==0){
						this.setState({
							isMyriad : true,
							checkNetwork : true
						});
					} else {
						this.setState({
							isMyriad : false,
							checkNetwork : true
						});
					}
					this.localRows = rows;
					this.setRows(rows);
				}else{
					this.appendRows(rows);
				}
			}else{
				this.setState({
					status : this.totalRowCount >= this.totalCount ? 'done' : 'wait',
					isRefreshing : false
				});
			}
			this.totalCount = totalCount;
			//原来page是在这里自加的，后来发现在这里自加的话列表下拉很容易出现重复数据，故把 this.page++ 放在 _onLoadMore()方法里面
			// this.page++;
		}, (err) => {
			//TODO 未添加延时判断
			console.log("errInfo",err);
			this.setState({
				status : 'error',
				isRefreshing : false,
				checkNetwork : err.message=="noNetwork" ? false : true
			});
			this.setRows([]);
		});
	}
    // 手动重新加载数据
	reloadData() {
		// this._onPullRefresh();
		this.page = 0;
		this.filled = false;
		InteractionManager.runAfterInteractions(() => {
			this.props.fetchData(1, (rows, currCount, totalCount) => {
				this.totalRowCount = currCount;
				this.totalCount = totalCount;
				this.setState({
					isMyriad: false,
				});
				//保存rows	
				this.localRows = rows;			
				this.setRows(rows);
			})
		});
	}
	//本地更新示图
	localUpdate(){
		this.setState({
			dataSource : this.state.dataSource.cloneWithRows(this.localRows)
		});		
	}

	updateStuatus(status){
		switch(status){
			case 'wait':
			case 'loading':
			case 'error':
			case 'done':
				this.setState({'status' : status});
		}
	}
	setRows(rows){
		// console.log('setRows', this.getRows(), rows)
		this.setState({
			status : this.totalRowCount >= this.totalCount ? 'done' : 'wait',
			isRefreshing : false,
			dataSource : this.state.dataSource.cloneWithRows(rows)
		});
	}
	updateRowAt(index, rowData, sectionId, animation){
		const rows = this.getRows();
		rows[index] = rowData;
		this.setState({
			dataSource : this.state.dataSource.cloneWithRows(rows)
		});
	}
	appendRows(rows){
		var newRows = this.getRows().concat(rows);
		this.setRows(newRows);
	}
	getRows(sectionIdentitie){
		if(sectionIdentitie != undefined){
			return this.state.dataSource._dataBlob[sectionIdentitie];
		}
		let sections = this.getSectionIdentities();
		if(sections != undefined && sections.length > 0){
			return this.state.dataSource._dataBlob[sections[0]];
		}
		return null;
	}
	getSectionIdentities(){
		return this.state.dataSource.sectionIdentities;
	}
	setPage(page){
		this.page = page;
	}
	_renderRefreshControl(){
		return (
			<RefreshControl
				onRefresh={this.onPullRefresh}
				refreshing={this.state.isRefreshing}
				{...this.props.controlProps}
			/>
		)
	}
	_handleEndReached(e = false){
		//开启onEndReachedThreshold 属性，调用此方法，默认会返回一个e事件参数。需要手动调用，请将autoLoadMore设为false，且传递一个true值给e
		if (e == true && this.props.pagination && this.state.status != 'done') {
			this._onLoadMore();
		}
		if (this.state.dataSource.getRowCount() > 0 && this.props.autoLoadMore && this.props.pagination && this.state.status != 'done' && this.filled){
			this._onLoadMore();
		}
	}

	_initNoDataImg(imgTag){
		if(imgTag==100){
			return <Image source={require('./res/myriad.png')} style={{height:60,width:80,resizeMode:Image.resizeMode.contain}}/>
		} else if(imgTag==101) {
			return <Image source={require('./res/005shixiao.png')} style={{height:60,width:80,resizeMode:Image.resizeMode.contain}}/>
		}
	}

	_initButton(arr){
	    return arr.map((value,index)=>{
			return (<TouchableHighlight 
			         underlayColor='#c8c7cc' 
					 key={index} 
					 style={styles.btnitem} 
					 onPress={()=>this.props.noNetworkBtnAction(index)}>
			           <Text style={{color:'#fff'}}>{value}</Text>
			       </TouchableHighlight>)
		});
	}

	_renderFooter(){
		if(!this.state.checkNetwork && this.state.openCheckNetwork){
			return (
			<View style={{ height: 400, justifyContent: 'center', alignItems: 'center', width: SCREEN_WIDTH }}>
				<Image source={require('./res/004zanwuwangluo.png')} style={{resizeMode:Image.resizeMode.contain}}/>
				<Text style={{ color: '#D8D8D8', fontSize: 13, marginTop: 22 }}>网络不给力，请检查网络后刷新~</Text>
				<TouchableOpacity style={{width: 164, height: 41, alignItems: 'center', justifyContent: 'center', marginTop: 22, backgroundColor: "#3491df", borderRadius: 5, borderWidth: 1/PixelRatio.get(), borderColor: "#3491df"}}
				onPress={() => {this.pullRefresh()}}
				activeOpacity={0.7}>
					<Text style={{color: "#fff", fontSize: 15}}>重新加载</Text>
				</TouchableOpacity>
			</View>)
		}
		if(this.state.isMyriad==true){
			return (<View>
				{this.props.shouNoNumber ? this.props.shouNoNumber() :
					<View style={{ height: 300, justifyContent: 'center', alignItems: 'center', width: SCREEN_WIDTH }}>
						{this.props.noDatas != undefined ?
							this._initNoDataImg(this.props.noDatas && this.props.noDatas.imgTag ? this.props.noDatas.imgTag : 100) :
							this._initNoDataImg(100)
						}
						<Text style={{ color: '#D8D8D8', fontSize: 13, marginTop: 10 }}>暂无数据</Text>

					</View>}
				</View>
				
			)
		} else {
			if(this.state.dataSource.getRowCount() > 0 && this.props.pagination){
				if(this.state.status == 'loading'){
					return (
						<View style={{
							height:50,
							flexDirection:'row',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
							<ActivityIndicator animating={true} size="small" />
							<Text style={{marginLeft: 5, fontSize:14, color: "#999"}}>
								{this.props.displayStatus[this.state.status]}
							</Text>
						</View>
					)
				} else if(!this.props.autoLoadMore || !this.filled || this.state.status == 'done' || this.state.status == 'error') {
					return (
						<TouchableHighlight
							style={{height:50, width:this.props.listWidth?this.props.listWidth:SCREEN_WIDTH,justifyContent:'center',alignItems:'center'}}
							underlayColor='#c8c7cc'
							disabled={this.state.status == 'done'}
							onPress={this.onLoadMore}>
							<Text style={{fontSize:14, color: "#999"}}>
								{this.props.displayStatus[this.state.status]}
							</Text>
						</TouchableHighlight>
					)
				}
			}
		}

		return null;
		// <View style={{height:300,justifyContent:'center',alignItems:'center',width:SCREEN_WIDTH}}>
		// 		   {this.props.noDatas!=undefined?
		// 			   this._initNoDataImg(this.props.noDatas.imgTag):
		// 			   this._initNoDataImg(100)
		// 		   }
		// 		   <Text style={{color:'#D8D8D8',fontSize:13,marginTop:10,height:40}}>{this.props.noDatas!=undefined?this.props.noDatas.title:'暂无数据'}</Text>
		// 		   {this.props.noDatas!=undefined&&<View style={[styles.btnlists,{justifyContent:this.props.noDatas.buttonTitles.length>1?'space-between':'center'}]}>
		// 			   {this.props.noDatas.buttonTitles.length>0&&this._initButton(this.props.noDatas.buttonTitles)}
		// 		   </View>}
		// 		</View>;
	}
	propsRenderFooter(){
		return(
			<View style={{marginVertical:20}}>
				{
					this.props.renderFooter()
				}
			</View>
		)
	}
	render(){
		return (
		<SGListView
			enableEmptySections={true}
			{...this.props}
			ref='listview'
			initialListSize={1}
			onEndReachedThreshold={200}
			pageSize={10}
			scrollRenderAheadDistance={100}
			dataSource={this.state.dataSource}
			renderFooter={this.props.renderFooter?this.propsRenderFooter.bind(this):this.renderFooter} 
			stickyHeaderIndices={[]}
			refreshControl={this.props.refreshable === true ? this._renderRefreshControl() : null}
			onEndReached={this.handleEndReached}
			onLayout={(event)=>{
				var layout = event.nativeEvent.layout;
				this.listViewHeight = layout.height;
			}}
			removeClippedSubviews={false}
			showsVerticalScrollIndicator={false}
			onContentSizeChange={(width, height)=>{
				if(height >= this.listViewHeight && this.listViewHeight != 0){
					this.filled = true;
				}else{
					this.filled = false;
				}
			}}
			 >
		</SGListView>
		)
	}
}

const styles = StyleSheet.create({
  btnitem:{
	  width:105,
	  height:35,
	  alignItems:'center',
	  backgroundColor:'#2D86DA',
	  justifyContent:'center',
	  borderRadius:5
  },
  netimage:{
	  width:100,
	  height:100
  },
  btnlists:{
	  flexDirection:'row',
	  width:SCREEN_WIDTH-90,
	  height:40,
	  alignItems:'center'
  }
});

export default RefreshableListView;
