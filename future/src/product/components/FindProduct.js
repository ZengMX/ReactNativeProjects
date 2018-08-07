import React, { Component } from 'react';
import {
	Text,
	ListView,
	View,
	TouchableOpacity,
	Image,
	Platform,
	InteractionManager
} from 'react-native';
import {
	BaseView,	
} from 'future/public/widgets';
var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;
import _ from 'underscore';
import Fetch from 'future/public/lib/Fetch';
import styles from '../style/FindProduct';
import { NavBar, MaskModal, DataController, } from 'future/public/widgets';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollableTabBar from 'future/public/commons/ScrollableTabBar';

import AlphabetListView from 'react-native-alphabetlistview';
import imageUtil from 'future/public/lib/imageUtil';
import config from 'future/public/config';
import FindProductItems from './FindProductItems';
import MoreOperation from '../../commons/moreOperation/components/MoreOperation';

var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;

//TODO 按拼音首字母选择品牌,字母暂时有一半失效
class ListCategory extends Component {
	constructor(props) {
		super(props);
		this.renderRow = this._renderCategory.bind(this);
		this.fetchData = this._fetchCategoryData.bind(this);

		const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		this.state = {
			dataSource: ds.cloneWithRows([])
		};
	}
	componentDidMount() {
		this.fetchData();
	}

	_fetchCategoryData() {
		new Fetch({
			url: '/app/category/findAllProductCategory.json',
		}).dofetch().then((data) => {
			let arr = data != null && data.result != null ? data.result : [];
			if (arr != null && arr.length > 0) {
				this.setState({
					dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows(arr)
				});
			}
		}).catch((error) => {
			console.log('=> catch: ', error);
		});
	}

	// 跳转到分类的详细抽屉式列表页FindProductItems
	_openCategoryDetail(sysObjectId, title) {
		if (sysObjectId == null) {
			Toast.show('抱歉，获取信息失败！');
			return;
		}
		this.props.navigator.push({
			component: FindProductItems,
			params: {
				sysObjectId: sysObjectId,
				title: title,
			}
		})
	}
	//渲染找货分类页
	_renderCategory(rowData, sectionID, rowID, highlightRow) {
		// console.log('-----------rowData', rowData)
		let prdImg = imageUtil.get(config.host + "/upload/" + rowData.iconFileId, "120X120");		
		const content = (
			<TouchableOpacity key={'renderCategory' + rowData.id} style={{ width: screenWidth / 2, height: 160, backgroundColor: '#fff' }}
				activeOpacity={0.7} onPress={() => { this._openCategoryDetail(rowData.id, rowData.title) } }>
				<View style={styles.listItem}>
					<Image source={prdImg} style={styles.listImg} resizeMode='contain'></Image>
					<Text style={{ fontSize: 14, textAlign: 'center', color: '#0c1828', paddingTop: 14, }}>{rowData.title}</Text>
					<Text style={{ fontSize: 10, textAlign: 'center', color: '#8495a2', paddingTop: 9, }}>（共找到{rowData.productSize}种药品）</Text>
				</View>
			</TouchableOpacity>

		);
		return content;

	}

	render() {
		return (
			<ListView
				enableEmptySections={true}
				contentContainerStyle={styles.contentContainerStyle}
				dataSource={this.state.dataSource}
				renderRow={this.renderRow}
				removeClippedSubviews={false}
				/>
		);
	}
}

export default class FindProduct extends Component {
	constructor(props) {
		super(props);
		this.state = {

			currentPage: 0

		};
	}

	render() {
		return (
			<View style={{ flex: 1, backgroundColor: '#fff', }}>
				<BaseView navigator={this.props.navigator}
					ref={base=>this.base = base}						
					title={{ title: '全部分类',style:{fontSize:18},tintColor:'#333333'}}						
					reload={() => this.fetchData()}						
					leftBtnStyle={{width:10,height:17,tintColor:'#444444'}}
					rightButton={<MoreOperation	navigator={this.props.navigator} style={{alignSelf: 'center'}}> </MoreOperation>}
					statusBarStyle={'default'}
				>
					<ListCategory tabLabel="全部分类" navigator={this.props.navigator} />
				</BaseView>
			</View>
		);
	}
}
