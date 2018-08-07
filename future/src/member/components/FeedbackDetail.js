import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView,
	InteractionManager,
} from 'react-native';
import { 
	BaseView, 
	Toast, 
	Loading, 
} from 'future/public/widgets';
import Styles from 'future/public/lib/styles/Styles';
import {
	Fetch,
} from 'future/public/lib';

export default class FeedbackDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			feedbackData: null
		}
	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			let dataUrl = '';
			if(this.props.params.type === 0) {
				dataUrl = '/app/comment/custMessageDetail.json';
			}else {
				dataUrl = '/app/comment/complaintSuggestDetail.json';
			}
			Loading.show();
			new Fetch({
				url: dataUrl,
				data: {
					id : this.props.params.id
				}
			}).dofetch().then(data => {
				this.setState({
					feedbackData: data.result
				});
				Loading.hide();
			}).catch(err => {
				Loading.hide();
			});
		})
		
	}

	render() {
		const data = this.state.feedbackData;
		var myHtml, kefuHtml, title;
		if(data) {
			var content, timeStr;
			if(this.props.params.type === 0) {
				content = data.messageCont;
				timeStr = data.messageTimeStr;
			}else {
				content = data.complainCont;
				timeStr = data.createTimeStr;
			}
			timeStr = timeStr.substring(0, (timeStr.length - 3));
			console.log(timeStr);
			myHtml = (
				<View style={styles.mineWrap}>
					<View style={{alignItems: 'flex-end'}}>
						<View style={styles.mineBubble}>
							<Text style={styles.fs14}>{content}</Text>
						</View>
						<Text style={[styles.time, styles.mr10]}>{timeStr}</Text>
					</View>
					<View style={styles.header}>
						<Text style={styles.text}>我</Text>
					</View>
				</View> );
			if(data.replyContVo && data.replyContVo.replyContList && data.replyContVo.replyContList.length > 0) {
				kefuHtml = data.replyContVo.replyContList.map((e, i) => {
					return (
						<View style={styles.kefuWrap} key={"kefu"+i}>
							<View style={styles.header}>
								<Text style={styles.text}>客服</Text>
							</View>
							<View>
								<View style={styles.kefuBubble}>
									<Text style={[styles.fs14, styles.colorWhite]}>{e.replyCont}</Text>
								</View>
								<Text style={[styles.time, styles.ml10]}>{e.timeStr.substring(0, e.timeStr.length - 3)}</Text>
							</View>	
						</View>
					)
				})
			}
		}
		switch(this.props.params.type) {
			case 0: 
				title = '留言';
				break;
			case 1:
				title = '投诉';
				break;
			default :
				title = '建议';		
		}
		return (
			<BaseView
				mainBackColor={{ backgroundColor: '#f5f5f5' }}
                ref={base => this.base = base}
                navigator={this.props.navigator}
                mainColor={'#fafafa'}
                titlePosition={'center'}
                title={{ title: title, tintColor: '#333',}}
				navBarStyle={styles.borderStyle}
				statusBarStyle={'default'}>
				<ScrollView>
					{ myHtml }
					{ kefuHtml }
				</ScrollView>
			</BaseView>
		);
	}
}

const styles = Styles.create({
	borderStyle: {
		borderBottomWidth: '$BW',
		borderBottomColor: '#e5e5e5'
	},
	mineWrap: {
		marginTop: 25, flexDirection: 'row', 
		justifyContent: 'flex-end', 
		paddingHorizontal: 13
	},
	mineBubble: {
		backgroundColor: '#fff', 
		paddingVertical: 12, 
		paddingHorizontal: 11,
		borderWidth: '$BW',
		borderColor: 'rgba(28,131,217,0.30)',
		borderRadius: 7,
		borderTopRightRadius: 0,
		marginRight: 10,
		marginLeft: 30,
		maxWidth: '$W - 106',
		shadowColor: 'rgb(37, 144 ,233)',
		shadowOffset: {width: 0, height: 3},
		shadowOpacity: 0.2,
	},
	kefuWrap: {
		marginTop: 25, flexDirection: 'row', paddingHorizontal: 13
	},
	kefuBubble: {
		backgroundColor: '#00b2ff', 
		paddingVertical: 12, 
		paddingHorizontal: 11,
		borderWidth: '$BW',
		borderColor: 'rgba(28,131,217,0.30)',
		borderRadius: 7,
		borderTopLeftRadius: 0,
		marginLeft: 10,
		marginRight: 30,
		maxWidth: '$W - 106',
		shadowColor: 'rgb(28,131,217)',
		shadowOffset: {width: 0, height: 3},
		shadowOpacity: 0.3,
	},
	header: {
		width: 30, height: 30, backgroundColor: '#c7cad5', 
		borderRadius: 15, 
		justifyContent: 'center', 
		alignItems: 'center', marginTop: 5
	},
	text: {
		fontSize: 11, color: '#383d47'
	},
	time: {
		fontSize: 11, color: '#959fa7', 
		marginTop: 10,
	},
	mr10: { marginRight: 10 },
	ml10: { marginLeft: 10 },
	fs14: { fontSize: 14 },
	colorWhite: { color: '#fff' }

});


