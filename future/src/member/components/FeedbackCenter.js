import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	Platform,
	PixelRatio,
	ScrollView,
	TouchableHighlight,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Keyboard,
	InteractionManager
} from 'react-native';
import {
	BaseView,
	TextInputC,
	Page,
	RefreshableListView,
	Toast,
	Loading,
} from 'future/public/widgets';
import {
	Fetch,
} from 'future/public/lib';
import _ from 'underscore';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import dismissKeyboard from 'dismissKeyboard';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import FeedbackDetail from './FeedbackDetail';

let fullwidth = Dimensions.get('window').width;

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

	_feedkbackDetailInfo = (custMessageId) => {
		this.props.navigator.push({
			component: FeedbackDetail,
			params: {
				id: custMessageId,
				type: this.props.type
			}
		});
	}

	fetchData(page, success, error) {
		let params = {}, url = '';
		switch (this.props.type) {
			case 0: 
				params = {
					pageNum: page,
					pageSize: 10,
					// sysUserId: 
				}; 
				url = '/app/comment/custMessageList.json';
				break;
			case 1:
				params = {
					pageNum: page,
					pageSize: 10,
					type: '0',   // 0：投诉 ，非0：建议
					// sysUserId: 50015,
				};
				url = '/app/comment/complainSuggestList.json';
				break;
			case 2:
				params = {
					pageNum: page,
					pageSize: 10,
					type: '1',  // 0：投诉 ，非0：建议
					// sysUserId: 50015,
				};
				url = '/app/comment/complainSuggestList.json';
				break;
			default:
				break;
		}
		new Fetch({
			url: url,
			data: params
		}).dofetch().then((data) => {
			success(data.result, page * 10, data.totalCount);
		}).catch((err) => { 
			error && error();
			console.log(err) 
		})
	}

	renderRow(rowData, sectionID, rowID, highlightRow) {
		var messageId, content, replyContent;
		if(this.props.type === 0) {
			messageId = rowData.custMessageId;
			content = rowData.messageCont;
			replyContent = rowData.messageReplyCont;
		}else {
			messageId = rowData.complainSuggestId;
			content = rowData.complainCont;
			replyContent = rowData.replyCont;
		}
		return (
			<TouchableOpacity
				style={styles.module}
				onPress={()=> this._feedkbackDetailInfo(messageId)}
			>
				<Text style={styles.content} numberOfLines={1}>{content}</Text>
				{
					replyContent !== null &&
					<Text style={styles.reply} numberOfLines={1}>{replyContent}</Text>
				}
			</TouchableOpacity>
		)
	}

	_renderSeparator(sectionID, rowID) {
		return (
			<View style={styles.separator} key={'separator' + rowID} />
		)
	}

	render() {
		return (
			<RefreshableListView
				ref='list'
				showsVerticalScrollIndicator={false}
				scrollRenderAheadDistance={150}
				contentInset={{ bottom: 0}}
				initialListSize={1}
				autoRefresh={false}
				autoLoadMore={true}
				fetchData={this.fetchData.bind(this)}
				renderRow={this.renderRow.bind(this)}
				renderSeparator={this._renderSeparator}
			/>
		)
	}
}

export default class Feedback extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: '',
			type: 0,
		};
	}

	componentDidMount() {
// 		InteractionManager.runAfterInteractions(() => {
// 			// console.log(this.textInput);
// //			this.textInput.focus();
// 		})
// 		setTimeout(()=>{
// 			this.textInput.focus();
// 		},1000)
	}

	clearText() {
		this.setState({ text: '' });
	}

	refreshList(index) {
		switch (index) {
			case 0: this.refs.list0.refresh(); break;
			case 1: this.refs.list1.refresh(); break;
			case 2: this.refs.list2.refresh(); break;
		}
	}

	submitContent() {
		dismissKeyboard();
		let content = this.state.text.trim();
		let type = this.state.type;
		if (content == '') { return; }
		Loading.show({title: '提交中'});
		if (type == 0) {
			new Fetch({
				url: '/app/comment/addMessage.json',
				data: {
					messageCont: content
				}
			}).dofetch().then((data) => {
				if (data.success) {
					Loading.hide();
					this.clearText();
					this.refreshList(0);
					Toast.show('留言成功', { position: 0 });
				}
			}).catch((err) => {
				console.log(err);
				Loading.hide();
				Toast.show('留言失败', { position: 0 });
			})
		} else if (type == 1 || type == 2) {
			new Fetch({
				url: '/app/comment/addComplaintSuggest.json',
				data: {
					complainCont: content,
					complainType: type == 1 ? '投诉' : '建议',
				}
			}).dofetch().then((data) => {
				if (data.success) {
					Loading.hide();
					this.clearText();
					type == 1 ? this.refreshList(1) : this.refreshList(2);
					Toast.show('发表成功', { position: 0 });
				}
			}).catch((err) => {
				console.log(err);
				Loading.hide();
				Toast.show('操作失败', { position: 0 });
			})
		}
	}

	warmword() {
		switch (this.state.type) {
			case 0: return '请填写您的留言';
			case 1: return '请填写您的投诉';
			case 2: return '请填写您的建议';
		}
	}

	render() {
		return (
			<BaseView
				mainBackColor={{ backgroundColor: '#f5f5f5' }}
                ref={base => this.base = base}
                navigator={this.props.navigator}
                mainColor={'#f9f9f9'}
                titlePosition={'center'}
                statusBarStyle={'default'}
                title={{ title: '反馈中心', tintColor: '#333', fontSize: 18 }}
				statusBarStyle={'default'}>
				<View style={styles.container}>
					
					<ScrollableTabView
						tabBarBackgroundColor='#FAFAFA'
						tabBarInactiveTextColor='#4B5963'
						tabBarUnderlineColor='#0082FF'
						tabBarActiveTextColor='#0082FF'
						tabBarTextStyle={{ fontSize: 14, fontWeight: '700' }}
						style={{flex:1,}}
						onChangeTab={(obj) => { this.setState({ type: obj.i }) } }
						renderTabBar={() => <ScrollableTabBar
							style={{ height: 44, borderWidth: 0 }}
							tabStyle={{ height: 40,width: (fullwidth / 3)  - 10,flexDirection: 'row',}}
							tabsContainerStyle={{ height: 44 }}
							underlineHeight={2}
							underlineStyle={{width: (fullwidth / 3)  - 10,}}
							/>}
						>
						<List tabLabel="留言" type={0} ref='list0' navigator={this.props.navigator} />
						<List tabLabel="投诉" type={1} ref='list1' navigator={this.props.navigator} />
						<List tabLabel="建议" type={2} ref='list2' navigator={this.props.navigator} />
					</ScrollableTabView>
					<View style={styles.bottom}>
						<View style={{borderBottomWidth: 1 / PixelRatio.get(),borderBottomColor: '#eee',height: 35,flex:1,marginLeft: 12,flexDirection:'row'}}>
							<TextInputC
								ref={textinput => this.textInput = textinput}
								style={styles.input}
								returnKeyType={'default'}
								placeholder={this.warmword()}
								placeholderTextColor={'#959FA7'}
								autoFocus = {true}
								onChangeText={(value) => { this.setState({ text: value }) } }
								value={this.state.text}
								onSubmitEditing={() => { this.submitContent() } } 		//需要避免安卓BUG触发2次
							/>
						</View>
						<TouchableOpacity style={styles.bottomOpc} onPress={() => { this.submitContent() } }>
							<Text style={[styles.text,{color:'#959FA7',}]}>发送</Text>
						</TouchableOpacity>
					</View>
					<KeyboardSpacer />
				</View>
			</BaseView>

		)
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8f8f8',
	},
	bottom: {
		backgroundColor: '#fff',
		height: 50,
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#eee'
	},
	input: {
		height: 35,
		backgroundColor: '#fff',
		flex:1,
		fontSize: 14,
		alignSelf: 'center',
		paddingLeft: 2,
		paddingVertical: 0,
	},
	text: {
		color: '#333',
		fontSize: 14,
		fontWeight: '400'
	},
	bottomOpc: {
		width: 50,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center'
	},
	module: {
		backgroundColor: '#fff',
		width: fullwidth,
		paddingVertical: 16,
		paddingHorizontal: 12,
		
		
	},
	content: {
		color: '#333',
		fontSize: 16,
		fontWeight: '700',
		lineHeight: 18
	},
	reply: {
		marginTop: 6,
		marginRight: 15,
		color: '#3A4351',
		fontSize: 14,
		lineHeight: 16
	},
	separator: {
		width: fullwidth - 13,
		marginLeft: 13,
		height: 1 / PixelRatio.get(),
		backgroundColor: '#eee'
	}
})
