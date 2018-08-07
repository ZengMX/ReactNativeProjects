import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	Platform,
	Dimensions,
	TouchableOpacity,
	TouchableHighlight,
	ScrollView,
	InteractionManager,
	PixelRatio,
	StyleSheet,
	Animated,
} from 'react-native';

import {
	NavBar,
	TextInputC,
	RefreshableListView,
} from 'future/public/widgets';

import {
	Fetch,
} from 'future/public/lib';

import ProductDetail from '../../product/components/ProductDetail';

let screenW = Dimensions.get('window').width;
let screenH = require('Dimensions').get('window').height;
let _lastPosition = 0;  // 记录隐藏navbar时的y坐标

export default class SupplierHomeSearch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: '',
			childTab: 'default',  // 标记现在是哪一个tab
			desc: false,   //是否是降序，默认否
			canRefresh: false,
			showNav: new Animated.Value(1),
		}
		this.navHeight = Platform.OS == 'ios' ? 40 : 43;
		this.searchImg = require('future/public/commons/res/000sousuo.png');
		this.listLayoutHeight = undefined;
	}

	componentDidMount(){

	}

	fetchData = (page,success,error) =>{
		let order = '';
		switch(this.state.childTab){
			case 'price':
				order = this.state.desc?'minPrice,desc':'minPrice,asc';
				break;
			case 'sales':
				order = 'salesVolume,desc';
				break;
			case 'news':
				order = 'lastOnSaleDate,desc';
				break;
			default:
				break;
		}
		new Fetch({
			url: 'app/shop/shopProductList.json',
			data: {
				shopId: this.props.params && this.props.params.shopInfo.shopInfId,
				keyword: this.state.text,
				page: page,
				pageSize: 10,
				order: order,
			}
		}).dofetch().then((data)=>{
			// success(data.result.result,(page-1) * 10 + data.result.result.length,data.result.totalCount);
			success(data.result.result,(page-1) * 10 + data.result.result.length,(page-1) * 10 + data.result.result.length);
		}).catch((err)=>{
			console.log(err);
		})
	}

	renderRow = (rowData,sectionID,rowID,highlightRow)=>{
		let spec = rowData.specPack?rowData.specPack: '--',
			unit = rowData.unit?rowData.unit: '--',
			marketPrice = Math.floor(rowData.marketPrice.toString()).toFixed(2);
		return (
			<TouchableHighlight
				onPress={() => { this._toProductDetail(rowData.productId) } }
				style={styles.item}
				underlayColor='#eee'
			>
				<View style={{flex:1,justifyContent:'space-between'}}>
					<Text style={{fontSize:15,color:'#333',fontWeight:'500',}} numberOfLines={1}>{rowData.productNm}</Text>
					<View style={{flexDirection: 'row', alignItems:'center',marginBottom: 2,}}>
						<Text style={{fontSize:12,color:'#8495A2',flex:1,}} numberOfLines={1}>规格：{spec}</Text>
						{
							rowData.price === null ? (
								<View style={{width:84,height:20,flexDirection:'row',justifyContent:'space-around',alignItems:'center',borderWidth:1/PixelRatio.get(),borderColor:'#8495a2'}}>
									<Image style={{width:14,resizeMode:'contain'}} source={require('../res/images/003denglukejian.png')}/>
									<View style={{width:1,height:13,backgroundColor:'#8495a2'}}/>
									<Text style={{fontSize:12,color:'#8495a2'}}>登录可见</Text>
								</View>
							) : (
								<Text style={{fontSize:13,color:'#FF6600',}}>￥
									<Text style={{fontSize:18,}}>{parseInt(rowData.price)}.</Text>
									<Text style={{fontSize:13,}}>{parseFloat(rowData.price).toFixed(2).toString().split('.')[1]}</Text>
								</Text>
							)
						}
					</View>
					<View style={{flexDirection: 'row', alignItems:'center',}}>
						<Text style={{fontSize:12,color:'#8495A2',flex:1,}} numberOfLines={1}>厂家：{rowData.factory}</Text>
						<Text style={{fontSize:11,color:'#AAAEB9',marginLeft:23,}}>市场价:￥{marketPrice}</Text>
					</View>
				</View>
			</TouchableHighlight>
		)
	}

	_toProductDetail(productId) {
		this.props.navigator.push({
			params: {
				productId: productId
			},
			component: ProductDetail
		});
	}

	// 改变tab
	changeChildTab(tab){
		let state = {
			childTab:tab,
		};
		if(tab == 'price' && this.state.childTab == 'price'){
			state.desc = !this.state.desc;
		}
		this.setState(state);
		if(this.state.canRefresh){
			InteractionManager.runAfterInteractions(()=>{
				this.refs.list.pullRefresh();
			});
		}
	}

	inputClear() {
		this.setState({
			text: '',
		})
	}

	submit(keyword) {
		this.refs.search.blur();
		this.setState({canRefresh:true,});
		InteractionManager.runAfterInteractions(()=>{
			this.refs.list.pullRefresh();
		})
	}

	render() {
		return (
			<View style={{flex:1,backgroundColor:'#f8f8f8',}}>
				<Animated.View
					style={{marginTop:this.state.showNav.interpolate({
						inputRange: [0,1],
						outputRange: [this.navHeight*(-1),0],
						extrapolate: 'clamp',
					}),opacity:this.state.showNav,backgroundColor:'transparent',}}
				>
					<NavBar
						ref={(c)=>this._navbar = c}
						style={{ backgroundColor: '#fff', height: this.navHeight, width: screenW,alignItems:'center',}}
						navigator={this.props.navigator}
						mainColor={'#fff'}
						deep={true}
						statusBar={{ style: 'default' }}
						rightButton={
							<TouchableOpacity
								style={{ width: 45, height: 32, alignItems: 'center', justifyContent: 'center', }}
								onPress={() => { this.submit() } }
							>
								<Image
									source={this.searchImg}
									resizeMode='stretch'
									style={{width:16,height:16,}}
								/>
							</TouchableOpacity>
						}
					>
						<View style={{ flexDirection: 'row', alignItems: 'center', width: screenW - 100, height: 30,}}>
							<TextInputC
								style={{ paddingVertical: 0, flex: 1, marginRight: 4, fontSize: 14, color: '#333', backgroundColor:'#ececec', paddingLeft:10,}}
								returnKeyType={'default'}
								ref="search"
								autoFocus={true}
								placeholder="搜索商品"
								placeholderTextColor={'#999'}
								onChangeText={(value) => {
									this.setState({text:value,});
								}}
								value={this.state.text}
								onSubmitEditing={()=>{this.submit()}}
							/>
						</View>
					</NavBar>
				</Animated.View>
				<View style={{backgroundColor:'#fff',flexDirection:'row',marginBottom:5,height:45,}}>
					<TouchableOpacity
						style={styles.headerTouch}
						onPress={()=>{ this.changeChildTab('default') }}
						underlayColor='#eee'
					>
						<Text style={[styles.headerTitle,{color:this.state.childTab==='default'?'#34457D':'#90A4AE',}]}>默认</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.headerTouch}
						onPress={()=>{ this.changeChildTab('price') }}
						underlayColor='#eee'
					>
						<View>
							<Text style={[styles.headerTitle,{color:this.state.childTab==='price'?'#34457D':'#90A4AE',}]}>价格</Text>
							<View style={[styles.triangle,styles.tri_up,{borderBottomColor:this.state.childTab === 'price' && this.state.desc === false?'#34457D':'#90A4AE'}]}/>
							<View style={[styles.triangle,styles.tri_down,{borderTopColor:this.state.childTab === 'price' && this.state.desc === true?'#34457D':'#90A4AE'}]}/>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.headerTouch}
						onPress={()=>{ this.changeChildTab('sales') }}
						underlayColor='#eee'
					>
						<Text style={[styles.headerTitle,{color:this.state.childTab==='sales'?'#34457D':'#90A4AE',}]}>销量</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.headerTouch}
						onPress={()=>{ this.changeChildTab('news') }}
						underlayColor='#eee'
					>
						<Text style={[styles.headerTitle,{color:this.state.childTab==='news'?'#34457D':'#90A4AE',}]}>新品</Text>
					</TouchableOpacity>
				</View>
				<RefreshableListView
					ref="list"
					contentInset={{bottom:0,}}
					fetchData={this.fetchData}
					renderRow={this.renderRow}
					scrollRenderAheadDistance={100} //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行。
					pageSize={10} // 每次事件循环（每帧）渲染的行数。
					initialListSize={1}
					onEndReachedThreshold={200}
					scrollEventThrottle={16}
					onContentSizeChange={(width,height)=>{
						this.listHeight = height;
						this.listLayoutHeight = this.refs.list.listViewHeight;
					}}
					refreshable={this.state.canRefresh}
					onScroll={(event)=>{
						let currentOffset = event.nativeEvent.contentOffset.y;
						if(currentOffset < 0){
							currentOffset = 0;
						}else if(currentOffset > this.listHeight - this.listLayoutHeight){
							currentOffset = this.listHeight - this.listLayoutHeight;
						}
						if (currentOffset - _lastPosition > 64) {
							_lastPosition = currentOffset;

							Animated.timing(this.state.showNav,{
								toValue: 0,
								duration: 80,
							}).start();
						}else if (_lastPosition - currentOffset > 64) {
							_lastPosition = currentOffset;
							Animated.timing(this.state.showNav,{
								toValue: 1,
								duration: 80,
							}).start();
						}
					}}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	headerTouch: {
		alignItems: 'center',
		justifyContent: 'center',
		flex:1,
	},
	headerTitle: {
		fontSize: 14,
		color: '#90A4AE',
	},
	triangle: {
		position: 'absolute',
		right: -11,
		width: 0,
		height: 0,
		borderLeftWidth: 4,
		borderRightWidth: 4,
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent',
	},
	tri_up: {
		top: Platform.OS === 'ios'?2:4,
		borderBottomWidth: 4,
	},
	tri_down: {
		bottom: Platform.OS === 'ios'?1:3,
		borderTopWidth: 4,
	},
	item: {
		height: 96.5,
		overflow: 'hidden',
		paddingLeft: 13,
		paddingRight: 15,
		backgroundColor: '#fff',
		borderBottomWidth: 1/PixelRatio.get(),
		borderColor: '#e5e5e5',
		paddingVertical: 15,
	},
})
