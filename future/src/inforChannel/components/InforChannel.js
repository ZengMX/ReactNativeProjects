import React, { Component } from 'react';
import {
	View,
	ScrollView,
	Dimensions,
	Text,
	Image,
	TouchableOpacity,
	Platform,
	TouchableHighlight,
	InteractionManager,
	PixelRatio,
} from 'react-native';
import _ from 'underscore';
import { Fetch } from 'future/public/lib';
import { BaseView, MaskModal, RefreshableListView } from 'future/public/widgets';
import ScrollableTabBar from 'future/public/commons/ScrollableTabBar';
import WebViewPage from 'future/public/commons/WebViewPage';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import styles from '../styles/InforChannel';
import InforChannelSearch from './InforChannelSearch';

let screenWidth = require('Dimensions').get('window').width;
let screenHeight = require('Dimensions').get('window').height;

class List extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.pullRefresh()
	}

	// 刷新本列表
	pullRefresh = () => {
		InteractionManager.runAfterInteractions(() => {
			this.refs.list && this.refs.list.pullRefresh && this.refs.list.pullRefresh();
		});
	}

	// 获取资讯内容，考虑是否含有关键字
	fetchData = (page, success, error) => {

		// 根据是否包含关键字用不同的接口查询内容
		let rqUrl = "/app/article/articleList.json";
		if (this.props.keyWord != null) {
			rqUrl = "/app/article/articlesByKeyWord.json";
		}

		new Fetch({
			url: rqUrl,
			data: {
				limit: 10,  // 每页显示条数
				pageNumber: page, // 分页
				articleId: this.props.categoryId,  // 标题分类名
				keyWord: this.props.keyWord, // 搜索关键字
			}
		}).dofetch().then((data) => {
			success(data.result, 10 * (page - 1) + data.result.length, data.totalCount);
		}).catch((err) => {
			error && error();
			console.log('获取资讯内容出错', err);
		});
	}

	//web页面的跳转
	webView = (infArticleId) => {
		this.props.navigator.push({
			component: WebViewPage,
			params: {
				title: '资讯详情',
				url: '/app/medicalNews.jsp?infArticleId=' + infArticleId,
			}
		})
	}

	renderSeparator = (sectionID, rowID) => {
		return (
			<View key={'key' + rowID} style={{ height: 10, backgroundColor: '#FAFAFA' }} />
		)
	}

	renderRow = (rowData) => {
		return (
			<TouchableOpacity style={styles.List} activeOpacity={0.8} onPress={() => { this.webView(rowData.infArticleId) } }>
				<Text style={{ color: '#2D2D2D', fontSize: 17 }} numberOfLines={1}>{rowData.title}</Text>
				<Text style={{ color: '#ACB2C1', fontSize: 13 }} numberOfLines={2}>{rowData.articleContStr.trim()}</Text>
				<Text style={{ color: '#D0D3DB', fontSize: 12 }} >{rowData.sysCreateTimeString && rowData.sysCreateTimeString.substring(0, 10)}</Text>
			</TouchableOpacity>
		)
	}

	// TODO可scrollRenderAheadDistance、pageSize、initialListSize、onEndReachedThreshold到RefreshableListView内
	render() {
		return (
			<RefreshableListView
				ref="list"
				style={{ flex: 1 }}
				autoRefresh={false}
				renderSeparator={this.renderSeparator}
				fetchData={this.fetchData}
				renderRow={this.renderRow}
				scrollRenderAheadDistance={100}  //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行。
				pageSize={10} // 每次事件循环（每帧）渲染的行数。
				initialListSize={10}
				onEndReachedThreshold={200}
				/>
		);
	}
}

//弹出选择资讯分类按钮
class SeleCaption extends Component {
	constructor(props) {
		super(props);
		this.state = {
			orderState: 0 // 当前选中的标题
		}
	}

	// 标签切换时刷新分类按钮模块，父组件调用
	changeState = (orderState) => {
		this.setState({
			orderState
		})
	}

	// 显示本模块，父组件调用
	show = () => {
		this.refs.stateModal.show();
	}

	// 点击标签后隐藏组件，切换标签
	changePage = (orderState) => {
		this.refs.stateModal.hide();
		this.props.goToPage(orderState);
		this.setState({
			orderState: orderState
		});
	}

	render() {
		let orderState = this.state.orderState;
		return (
			<MaskModal
				ref='stateModal'
				viewType="top"
				contentView={
					<View style={{ width: screenWidth, backgroundColor: '#FAFAFA' }}>
						<View style={{ width: screenWidth, height: 45, flexDirection: 'row', alignItems: 'center' }}>
							<Text style={{ fontSize: 15, color: '#AAAEB9', flex: 1, marginLeft: 12 }}>资讯分类</Text>
							<TouchableOpacity onPress={() => { this.refs.stateModal.hide(); } } style={{ width: 50, height: 45, alignItems: 'center', justifyContent: 'center' }}>
								<Image style={{ width: 12, height: 12, resizeMode: 'contain' }} source={require('../res/inforChannel/002shouqi.png')} />
							</TouchableOpacity>
						</View>
						<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
							{this.props.stateList && this.props.stateList.map((item, index) => {
								return (
									<TouchableOpacity key={index} onPress={() => { this.changePage(index); } }
										style={[styles.stateView, { backgroundColor: orderState == index ? '#F60' : '#FAFAFA', }]}>
										<Text style={{ fontSize: 12, color: orderState == index ? '#fff' : '#444' }}>{item.name}</Text>
									</TouchableOpacity>
								);
							})}
						</View>
					</View>
				}
				custom={true}
				containerStyle={{ justifyContent: 'flex-start' }}
				/>
		)
	}
}

//  资讯频道
export default class InforChannel extends Component {
	constructor(props) {
		super(props);
		this.currentList = 'List0';
		this.state = {
			searchField: null, // 搜索资讯关键字
			stateList: [], // 资讯内容分类，对象数组{categoryId,name}
		}
		this.fetchCategoryData = this._fetchCategoryData.bind(this);
	}

	componentWillMount() {
		InteractionManager.runAfterInteractions(() => {
			this.fetchCategoryData();
		})
	}

	// 获取资讯内容的分类的标题和ID
	_fetchCategoryData() {
		new Fetch({
			url: '/app/article/articleCategory.json?articleCategoryId=54980',
			method: 'GET',
			// data: {
			// 	innerCode: 'NEWS_CENTER'
			// }
		}).dofetch().then((data) => {

			this.setState({
				stateList: data.result,
			})
		}).catch((err) => {
			console.log('=> catch: ', err);
		});
	}

	// 打开搜索资讯页面
	_openSearch() {
		this.props.navigator.push({
			params: {
				value: this.state.searchField,
				callback: (value) => {
					this.setState({
						searchField: value
					});
					setTimeout(() => {
						this.refs[this.currentList].pullRefresh();
					}, 400);
				}
			},
			component: InforChannelSearch
		})
	}

	render() {
		return (
			<BaseView navigator={this.props.navigator}
				ref='base'
				title={{ title: '资讯中心', tintColor: '#333', }}
				rightButton={(
					<TouchableOpacity onPress={() => { this._openSearch(this.state.searchField); } }>
						<Image source={require('future/public/commons/res/000sousuo.png')} style={{ resizeMode: 'contain', width: 21, height: 22, marginRight: 12, marginTop: 10, }} />
					</TouchableOpacity>
				)}
				>
				<View style={{ flex: 1, backgroundColor: '#f1f4f3' }}>
					{
						this.state.stateList && this.state.stateList.length > 0 && <ScrollableTabView
							ref='scrollableTabView'
							initialPage={0}
							onChangeTab={(i) => { this.currentList = i.ref.ref; this.refs.stateModal.changeState(i.i) } }
							renderTabBar={() => (
								<ScrollableTabBar
									tabStyle={{
										paddingLeft: 0,
										paddingRight: 0,
										height: 45,
										width: screenWidth / 4,
										alignItems: 'center',
										borderBottomWidth: 1 / PixelRatio.get(),
										borderColor: '#E5E5E5',
									}}
									underlineStyle={{ height: 0, width: 0 }}
									activeTextColor={'#34457D'}
									inactiveTextColor={'#4B5963'}
									style={{
										backgroundColor: '#FAFAFA',
										width: screenWidth - 45,
										height: 45,
										borderWidth: 0,
									}}
									/>
							)}
							>

							{this.state.stateList.map((item, index) => {
								return (
									<List
										key={index}
										ref={'List' + index}
										tabLabel={item.name}
										categoryId={item.categoryId}
										keyWord={this.state.searchField}
										navigator={this.props.navigator} />
								);
							})}

						</ScrollableTabView>
					}
				</View>
				<TouchableOpacity onPress={() => { this.refs.stateModal.show(); } } style={{ borderBottomWidth: 1 / PixelRatio.get(), borderColor: '#E5E5E5', top: 0, right: 0, position: 'absolute', width: 45, height: 45, backgroundColor: '#FAFAFA', alignItems: 'center', justifyContent: 'center' }}>
					<Image style={{ width: 12, height: 12, resizeMode: 'contain' }} source={require('../res/inforChannel/001xiala.png')} />
				</TouchableOpacity>
				<SeleCaption ref='stateModal' goToPage={(page) => { this.refs.scrollableTabView.goToPage(page); } } stateList={this.state.stateList} />
			</BaseView>
		);
	}
}


