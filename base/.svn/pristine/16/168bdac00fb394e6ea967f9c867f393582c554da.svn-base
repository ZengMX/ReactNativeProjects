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

import React, { Component } from 'react';
import {
	View,
	Image,
	ListView,
	RefreshControl,
	TouchableHighlight,
	ActivityIndicator,
	Text,
	InteractionManager
} from 'react-native';

import SGListView from 'react-native-sglistview';

class RefreshableListView extends Component {
	constructor(props) {
		super(props);
		// console.log('props >> ', props);
		this.state = {
			dataSource: this.props.dataSource,
			status: 'wait',
			isRefreshing: false,
			isMyriad: false
		}
		this.totalCount = 0;
		this.page = 1;
		this.listViewHeight = 0;
		this.filled = false;

		this.onPullRefresh = this._onPullRefresh.bind(this);
		this.onLoadMore = this._onLoadMore.bind(this);
		this.renderFooter = this._renderFooter.bind(this);
		this.handleEndReached = this._handleEndReached.bind(this);
	}
	static defaultProps = {
		refreshable: true,
		pagination: true,
		autoLoadMore: true,
		autoRefresh: false,
		dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
		displayStatus: {
			'wait': '点击加载更多',
			'loading': '加载中...',
			'error': '加载失败，点击重新加载',
			'done': '已经没有更多了'
		}
	}
	static propTypes = {
		refreshable: React.PropTypes.bool, 				// 是否下拉, 默认true
		pagination: React.PropTypes.bool,					// 是否分页, 默认true
		fetchData: React.PropTypes.func.isRequired,		// 加载数据方法
		controlProps: React.PropTypes.object,				// 下拉控制器其他属性
		dataSource: React.PropTypes.object,				// 数据
		autoLoadMore: React.PropTypes.bool,					// 自动加载更多(不需要点击), 默认true
		autoRefresh: React.PropTypes.bool					// 进入页面自动加载
	}
	componentDidMount() {
		if (this.props.autoRefresh) {
			this.setState({ isRefreshing: true });
			this._onPullRefresh();
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
	pullRefresh() {
		// this.refs.listview.scrollTo({ x: 0, y: 0, animated: false });

		this.refs.listview.getNativeListView().scrollTo({ x: 0, y: 0, animated: false });
		// console.log('this.refs.ListView', this.refs.listview);
		this.setState({ isRefreshing: true });
		this._onPullRefresh();
	}
	_onPullRefresh() {
		this.page = 0;
		this.filled = false;
		this._onRefresh();
	}
	_onLoadMore() {
		if (this.state.status !== 'loading' && this.state.isRefreshing == false) {
			this.setState({ status: 'loading' });
			this._onRefresh();
		}
	}
	_onRefresh() {
		InteractionManager.runAfterInteractions(() => {
			this.props.fetchData(this.page + 1, (rows, currCount, totalCount) => {
				this.totalRowCount = currCount;
				this.totalCount = totalCount;
				if (rows != null || rows != undefined) {
					if (this.page == 0) {
						if (rows.length == 0) {
							this.setState({
								isMyriad: true,
							});
						} else {
							this.setState({
								isMyriad: false,
							});
						}
						this.setRows(rows);
					} else if(rows.length>0) {
						this.appendRows(rows);
					}
				} else {
					this.setState({
						status: this.totalRowCount >= this.totalCount ? 'done' : 'wait',
						isRefreshing: false
					});
				}
				this.totalCount = totalCount;
				this.page++;
			}, () => {
				this.setState({
					status: 'error',
					isRefreshing: false
				});
			});
		});
	}
	// 手动重新加载数据
	reloadData() {
		this._onPullRefresh();
	}

	updateStuatus(status) {
		switch (status) {
			case 'wait':
			case 'loading':
			case 'error':
			case 'done':
				this.setState({ 'status': status });
		}
	}
	setRows(rows) {
		// console.log('setRows', this.getRows(), rows)
		this.setState({
			status: this.totalRowCount >= this.totalCount ? 'done' : 'wait',
			isRefreshing: false,
			dataSource: this.state.dataSource.cloneWithRows(rows)
		});
	}
	updateRowAt(index, rowData, sectionId, animation) {
		const rows = this.getRows();
		rows[index] = rowData;
		this.setState({
			dataSource: this.state.dataSource.cloneWithRows(rows)
		});
	}
	appendRows(rows) {
		var newRows = this.getRows().concat(rows);
		this.setRows(newRows);
	}
	getRows(sectionIdentitie) {
		if (sectionIdentitie != undefined) {
			return this.state.dataSource._dataBlob[sectionIdentitie];
		}
		let sections = this.getSectionIdentities();
		if (sections != undefined && sections.length > 0) {
			return this.state.dataSource._dataBlob[sections[0]];
		}
		return null;
	}
	getSectionIdentities() {
		return this.state.dataSource.sectionIdentities;
	}
	setPage(page) {
		this.page = page;
	}
	_renderRefreshControl() {
		return (
			<RefreshControl
				onRefresh={this.onPullRefresh}
				refreshing={this.state.isRefreshing}
				{...this.props.controlProps}
				/>
		)
	}
	_handleEndReached() {
		if (this.state.dataSource.getRowCount() > 0 &&
			this.props.autoLoadMore && this.props.pagination && this.state.status != 'done' && this.filled) {
			this._onLoadMore();
		}
	}
	_renderFooter() {
		if (this.state.isMyriad == true) {
			return (
				<View style={{ height: 300, justifyContent: 'center', alignItems: 'center' }}>
					<Image source={require('./res/myriad.png')} style={{ height: 60, width: 80, resizeMode: Image.resizeMode.contain }} />
					<Text style={{ color: '#B8B8B8', fontSize: 13, marginTop: 10 }}>暂无数据</Text>
				</View>
			)
		} else {
			if (this.state.dataSource.getRowCount() > 0 && this.props.pagination) {
				if (this.state.status == 'loading') {
					return (
						<View style={{
							height: 50,
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
							<ActivityIndicator animating={true} size="small" />
							<Text style={{ marginLeft: 5, fontSize: 14 }}>
								{this.props.displayStatus[this.state.status]}
							</Text>
						</View>
					)
				} else if (!this.props.autoLoadMore || !this.filled || this.state.status == 'done' || this.state.status == 'error') {
					return (
						<TouchableHighlight
							style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}
							underlayColor='#c8c7cc'
							disabled={this.state.status == 'done'}
							onPress={this.onLoadMore}>
							<Text style={{ fontSize: 14 }}>
								{this.props.displayStatus[this.state.status]}
							</Text>
						</TouchableHighlight>


					)
				}
			}
		}
		return null;
	}
	render() {
		return (
			<SGListView
				enableEmptySections={true}
				pageSize={10}
				{...this.props}
				ref='listview'
				stickyHeaderIndices={[]}
				dataSource={this.state.dataSource}
				renderFooter={this.renderFooter}
				refreshControl={this.props.refreshable === true ? this._renderRefreshControl() : null}
				onEndReached={this.handleEndReached}
				removeClippedSubviews={true}
				onLayout={(event) => {
					var layout = event.nativeEvent.layout;
					this.listViewHeight = layout.height;
				} }
				onContentSizeChange={(width, height) => {
					if (height >= this.listViewHeight && this.listViewHeight != 0) {
						this.filled = true;
					} else {
						this.filled = false;
					}
				} }
				>
			</SGListView>
		)
	}
}

export default RefreshableListView;
