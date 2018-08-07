import React, { Component } from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	Image,
	Platform,
	ScrollView,
	InteractionManager
} from 'react-native';
var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;
import _ from 'underscore';
import Fetch from 'future/public/lib/Fetch';
import styles from '../style/FindProductItems';
import { NavBar, Toast, MaskModal } from 'future/public/widgets';
import MoreOperation from '../../commons/moreOperation/components/MoreOperation';
import ProductList from './ProductList';
import config from 'future/public/config';

var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;

export default class FindProduct extends Component {
	constructor(props) {
		super(props);
		this.getFirstLevelData = this._getFirstLevelData.bind(this);
		// this.getSecondLevelData = this._getSecondLevelData.bind(this);

		this.firstLevelDataFirstId = null;
		this.state = {
			//上一次切换标签的时间
			lastChangeTabTime: null,
			//分类第一级数据
			firstLevelData: [],
			//分类第二级数据
			secondLevelData: [],
			//选择的一级分类代码
			selectedFirstId: null,
			//选择的二级分类id
			selectedSecondId: null,
			//选择的一级分类object id
			selectedFirstSysObjectId: null,
			productSize:0
		}
	}

	componentDidMount() {		
		InteractionManager.runAfterInteractions(() => {
			this.getFirstLevelData();
		});
	}

	//获取一级数据
	_getFirstLevelData() {
		new Fetch({
			url: 'app/category/findLastProductCategory.json',
			data: {
				treeNodeId: this.props.params.sysObjectId

				// treeNodeId : secondItem.id

			}
		}).dofetch().then((data) => {
			const arr = data.result;
		// 	let secondItem = {};
		// 	if (arr != null && arr.length > 0) {
		// 	for (let i = 0; i < arr.length; i++) {
		// 		secondItem = arr[i];
		// 		
		// 	}
		// }
			this.setState({
				firstLevelData: arr,
				selectedFirstSysObjectId: arr != null && arr.length > 0 ? arr[0].sysObjectId : null,
				productSize :arr[0].productSize,
			});
			this._getSecondLevelDatad(data.result[0].id);
		}).catch((error) => {
			console.log('=> catch: ', error);
			this.setState({
				firstLevelData: null,

				lastChangeTabTime: null
			});
		});
	}
	//获取二级数据
	_getSecondLevelDatad(selectedFirstId) {

		if (selectedFirstId == null) {
			Toast.show('获取数据失败');
			return;
		}
		new Fetch({
			url: 'app/category/findLastProductCategory.json',
			data: {
				treeNodeId: selectedFirstId
			},
		}).dofetch().then((data) => {
			const arr = data.result;
			let selectedSecondId = (arr != null && arr.length > 0) ? arr[0].id : null;
			this.setState({
				lastChangeTabTime: new Date(),
				secondLevelData: (arr != null && arr.length > 0) ? arr : [],
			});
		}).catch((error) => {
			console.log('=> catch: ', error);
		});
	}

	//一级数据点击切换选项卡
	_changeFirstLevelData(id, objectId,productSize) {
		if (id == null || this.state.firstLevelData == null || id == this.state.selectedFirstId) { return; }
		this.setState({
			selectedFirstId: id,
			selectedFirstSysObjectId: objectId,
			productSize :productSize 
		});
		//console.log('>>>>>>>>arr[0].sysObjectId',objectId);
		this._getSecondLevelDatad(id,productSize);
		return;

	}

	//渲染分类查找的一级数据的每一行
	_renderFirstLevelDataRow(arr) {
		if (arr == null || arr.length < 1) { return; }
		return arr.map((item, index) => {
			return (
				<TouchableOpacity
					activeOpacity={0.6}
					style={this.state.selectedFirstId == item.id ? styles.byDPTMLeftEachViewSelected : (index == 0 && this.state.selectedFirstId == null ? styles.byDPTMLeftEachViewSelected : styles.byDPTMLeftEachView)}
					onPress={() => { this._changeFirstLevelData(item.id, item.sysObjectId,item.productSize) } }
					key={'renderFirstLevelDataRow' + index}
					>
					<View style={this.state.selectedFirstId == item.id ? styles.byDPTMLeftLineViewSelected : (index == 0 && this.state.selectedFirstId == null ? styles.byDPTMLeftLineViewSelected : styles.byDPTMLeftLineView)}></View>
					<Text numberOfLines={1} style={(this.state.selectedFirstId == item.id) ? styles.byDPTMLeftTextSelected : (index == 0 && this.state.selectedFirstId == null ? styles.byDPTMLeftTextSelected : styles.byDPTMLeftText)}>{item.title}</Text>
				</TouchableOpacity>
			);
		});
	}
	//渲染分类查找的二级数据的每一行
	_renderSecondLevelDataRow(arr) {
		if (arr == null || arr.length < 1) { return; }
		return arr.map((item, index) => {
			return (
				<TouchableOpacity
					activeOpacity={0.6}
					style={styles.byDPTMRightEachView}
					key={'renderSecondLevelDataRow' + index}
					onPress={() => { this._ProductList(item.sysObjectId) } }
					>
					<View style={{width:screenWidth - 145, flexDirection:'row',alignItems: 'center',justifyContent: 'flex-start',paddingRight: 0}} >
						<Text style={{ color: '#0c1828', fontSize: 14,flex:1 }} numberOfLines={1}>{item.title}</Text>
						<Text style={{ color: '#8495a2', fontSize: 10,}} numberOfLines={1}>（{item.productSize}）</Text>
					</View>

				</TouchableOpacity>
			);
		});
	}

	//具体药品的跳转页面
	_ProductList(sysObjectId, isAll) {

		if ((sysObjectId == null && !isAll) || (this.state.selectedFirstSysObjectId == null && isAll)) {
			Toast.show('抱歉，子部位ID丢失，获取数据失败');
			return;
		}

		this.props.navigator.push({
			component: ProductList,
			params: {
				categoryId: isAll ? this.state.selectedFirstSysObjectId : sysObjectId,
				//勿删除以下isFromCategoryPage属性，用于处理商品搜索页页面打开次数，防止循环重复打开列表页和搜索页
				//isFromCategoryPage: true
				// sysObjectId:  sysObjectId
			}
		});
	}

	render() {
		let num = "(共找到" + this.state.productSize + "种药品)";
		return (
			<View>
				<NavBar navigator={this.props.navigator}	
					mainColor={'#fafafa'}					
					title={{ title: this.props.params.title,style:{fontSize:18},tintColor:'#333333'}}
					leftBtnStyle={{width:10,height:17,tintColor:'#444'}}				
					rightButton={<MoreOperation	navigator={this.props.navigator} style={{alignSelf: 'center'}}> </MoreOperation>}					
					/>
				
				<View style={styles.byDPTMView}>
					<ScrollView style={styles.byDPTMLeftView} showsVerticalScrollIndicator={false}>
						{this._renderFirstLevelDataRow(this.state.firstLevelData)}
					</ScrollView>

					<ScrollView style={styles.byDPTMRightView} showsVerticalScrollIndicator={false}>
						<TouchableOpacity 
							style={{width:screenWidth - 130,flexDirection:'row',alignItems: 'center',justifyContent: 'flex-start',height:50,paddingRight: 10}} 
							onPress={() => { this._ProductList(this.state.selectedFirstId, true) } }
						>
							<Text style={{ color: '#0c1828', fontSize: 14, flex:1 }}>全部  </Text>
							<Text style={{ color: '#8495a2', fontSize: 10, marginRight:10 }}>{num}</Text>
						</TouchableOpacity>
						<View style={{marginBottom: 100}}>
							{this._renderSecondLevelDataRow(this.state.secondLevelData)}
						</View>
						

					</ScrollView>
				</View>
			</View>
		);
	}
}
