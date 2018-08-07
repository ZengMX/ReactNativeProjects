import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	Dimensions,
	PixelRatio,
	Platform,
	InteractionManager
} from 'react-native';
import Fetch from 'future/public/lib/Fetch';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import { BaseView, RefreshableListView } from 'future/public/widgets';
import styles from '../styles/MessageCenter';
import Login from './Login';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const screenWidth = Dimensions.get('window').width;

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: '',
		}
	}
	componentWillMount() {
		InteractionManager.runAfterInteractions(() => {
			this.refresh();
		})
	}
	refresh() {
		this.refs && this.refs.list && this.refs.list.pullRefresh();
	}

	fetchData(page, success, error) {
		var params = {}, url = '';
		switch (this.props.type) {
			case 0 : 
				params = {
					pageNum: page,
					pageSize: 10,
					messageIndexType: '0'
				};
				break;
			case 1 : 
				params = {
					pageNum: page,
					pageSize: 10,
					messageIndexType: '1'
				};
				break;
			case 2 :
				params = {
					pageNum: page,
					pageSize: 10,
					messageIndexType: '2'
				}
				break;
			default: 
				break;		
		}
		new Fetch({
			url: '/app/push/messageList.json',
			data: params
		}).dofetch().then((data) => {
			success(data.result, page * 10, data.totalCount);
		}).catch((error) => { console.log('error', error) })
		
	}
	renderRow(rowData, sectionID, rowID, highlightRow) {
		return (
			<TouchableOpacity style={styles.messageView}>
				<View style={styles.timeView}>
					<Text style={styles.time}>{rowData.createDateString}</Text>
				</View>
				<View style={styles.container}>
					<View style={styles.flex}>
						<Text style={styles.pushTitle}>{rowData.pushTitle}</Text>
						<View style={{marginTop: 10}}>
							<Text style={styles.pushMessage}>{rowData.pushMessage}</Text>
						</View>
					</View>
					<View>
						<Image 
							source={require('../res/Buyer/000xiangyousanjiao.png')}
							style={styles.sanjiao}
							resizeMode="contain"
						/>
					</View>
				</View>
			</TouchableOpacity>
		)
	}

	render() {
		return (
			<RefreshableListView
				ref='list'
				contentContainerStyle={{ marginTop: 8 }}
				showsVerticalScrollIndicator={false}
				scrollRenderAheadDistance={150}
				contentInset={{ bottom: 0 }}
				initialListSize={1}
				autoRefresh={false}
				autoLoadMore={true}
				fetchData={this.fetchData.bind(this)}
				renderRow={this.renderRow.bind(this)}
			/>
		)
	}
}
class MessageCenter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPage: 0
		}
	}

	componentDidMount() {
		
			if (this.props.isLogin) {
				// InteractionManager.runAfterInteractions(() => {
				// 	this.refs && this.refs.list0.refresh()
				// })
				
			} else {
				this.toLogin();
			}
		
	}


	toLogin = () =>{
        this.refreshSign = true;
        this.props.navigator.push({
            component: Login,
            //以下两个参数同时存在时点击安卓物理返回键跳转到首页
            //具体实现可以查看navigator.js文件中的 onBackAndroid 方法
            name: 'Login',
            needToBackHome: 'true',
            params:{
                isFromTab:this.props.isFromTab?true:false,
                callback: (status)=>{
                    if(status){
                        this.refreshSign = false;
                    }
                    InteractionManager.runAfterInteractions(()=>{
                        this.refreshSign = false;
                    })
                }
            },
        });
    }

	renderRightButton = () => {
		return (
			<View style={{ justifyContent: 'center' }}>
				<MoreOperation
					navigator={this.props.navigator}
					order={
						[{
							module:'index',
						},{
							module:'search',
						},{
							module:'mine',
						}]
					}
				/>
			</View>
		)
	}



	render() {
		return (
			<BaseView
				title={{ title: '消息中心', fontSize: 18, tintColor: '#333' }}
				mainBackColor={{ backgroundColor: '#f5f5f5' }}
				ref={'base'}
				navigator={this.props.navigator}
				mainColor={'rgba(250,250,250,0.90)'}
				statusBarStyle={'default'}
			>
				<ScrollableTabView
					tabBarBackgroundColor='#FAFAFA'
					tabBarInactiveTextColor='#4B5963'
					tabBarUnderlineColor='#0082FF'
					tabBarActiveTextColor='#0082FF'
					tabBarTextStyle={{ fontSize: 13, fontWeight: '700' }}
					onChangeTab={(obj) => { this.setState({ currentPage: obj.i }) }}
					renderTabBar={() => <ScrollableTabBar
						style={{ height: 42, borderWidth: 0 }}
						tabStyle={{ height: 35, width: (screenWidth / 3) - 10, flexDirection: 'row', }}
						tabsContainerStyle={{ height: 42 }}
						underlineHeight={3}
						underlineStyle={{ width: (screenWidth / 3) - 10, }}
					/>}
				>
					<List tabLabel="消息通知" type={0} ref='list0' />
					<List tabLabel="资产消息" type={1} ref='list1' />
					<List tabLabel="物流助手" type={2} ref='list2' />
				</ScrollableTabView>
			</BaseView>
		)
	}
}

function mapStateToProps(state) {
	return {
		isLogin: state.Member.isLogin,
	}
}

function mapDispatchToProps(dispatch) {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageCenter);