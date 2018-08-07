/**
  * 调用例子
  * <MoreOperation
  *   order={[
  *      'share':{},
  *      'index':{},
  *      'search':{ component, params, callback, },
  *      'message':{},
  *      'mine':{callback,}
  *    ]}
  * />
  *
  */


import React, { Component } from 'react';
import {
	View,
	TouchableHighlight,
	TouchableOpacity,
	Image,
	PixelRatio,
	Text,
	InteractionManager,
	Animated,
	StyleSheet,
	Platform,
	Easing
} from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RootSiblings from 'react-native-root-siblings';
import {
	Fetch,
} from 'future/public/lib';
import Buyer from '../../../member/components/Buyer';
import Login from '../../../member/components/Login';
import Search from '../../../home/components/Search';
import MessageCenter from '../../../member/components/MessageCenter';

import * as moreActions from '../../../member/actions/MsgInfo';


let elements = [];  // 存储显示的modal层视图
let ORDERLIST = [];  // 存储this.props.order
let MSGNUMBER = 0;
let ISLOGIN = false;
// ------------------ 配置属性 ------------------
const MSGCOLOR = '#FF6600';
const MSGNUMCOLOR = '#FF6600';

class ModalItem extends Component{
	constructor(props){
		super(props);

		this.state = {
			showIt: new Animated.Value(0),
			lateXY: new Animated.Value(0),
		}

		this.shareImg = require('../res/images/000fenxian.png');
		this.homeImg = require('../res/images/000shouye02.png');
		this.searchImg = require('../res/images/000sousuo02.png');
		this.msgImg = require('../res/images/000xiaoxi.png');
		this.userImg = require('../res/images/000wode.png');
		this.modalHeight = ORDERLIST?ORDERLIST.length * 50 : 0;

		this.htmlTemplate = (module,params) => {
			switch(module){
				case 'share': 
					return (
						<TouchableOpacity
							key={'share_modal'}
							style={styles.item}
							onPress={()=>this.action('share')}
						>
							<Image
								source={this.shareImg}	
								style={{width: 16, height: 17, marginRight: 16,}}
							/>
							<Text style={styles.actionTitle}>分享</Text>
						</TouchableOpacity>
					)
				case 'index': 
					return (
						<TouchableOpacity
							key={'index_modal'}
							style={styles.item}
							onPress={()=>this.action('index')}
						>
							<Image
								source={this.homeImg}	
								style={{width: 15.5, height: 15.5, marginRight: 16,}}
							/>
							<Text style={styles.actionTitle}>首页</Text>
						</TouchableOpacity>
					)
				case 'search': 
					return (
						<TouchableOpacity
							key={'search_modal'}
							style={styles.item}
							onPress={()=>this.action('search',params)}
						>
							<Image
								source={this.searchImg}	
								style={{width: 16, height: 16, marginRight: 16,}}
							/>
							<Text style={styles.actionTitle}>搜索</Text>
						</TouchableOpacity>
					)
				case 'message': 
					return (
						<TouchableOpacity
							key={'message_modal'}
							style={styles.item}
							onPress={()=>this.action('msg',params)}
						>
							<Image
								source={this.msgImg}	
								style={{width: 16, height: 17, marginRight: 16,}}
							/>
							<Text style={styles.actionTitle}>消息</Text>
							{
								this.props.UnReadMsgNum !== 0 && (
									<View style={{ overflow: 'hidden', position: 'absolute', right: 20, top: 16, width: 18, height: 18, borderRadius: 9, borderWidth: 2/PixelRatio.get(), borderColor: '#FF6600',alignItems:'center', justifyContent: 'center',}}>
										<Text style={{fontSize: 12, color: '#FF6600',}}>{this.props.UnReadMsgNum > 99?99:this.props.UnReadMsgNum}</Text>
									</View>
								)
							}
						</TouchableOpacity>
					)
				case 'mine': 
					return (
						<TouchableOpacity
							key={'mine_modal'}
							style={styles.item}
							onPress={()=>this.action('user',params)}
						>
							<Image
								source={this.userImg}	
								style={{width: 14, height: 16, marginRight: 16,}}
							/>
							<Text style={styles.actionTitle}>我的</Text>
						</TouchableOpacity>
					)
				default:
					break;
			}
		}

		this.timer = undefined;
	}

	componentDidMount(){
		// Animated.parallel([
		// 	Animated.spring(this.state.showIt,{
		// 		toValue: 1,
		// 	}),
		// 	Animated.timing(this.state.lateXY,{
		// 		toValue: 1,
		// 	})
		// ]).start();
		Animated.timing(this.state.showIt,{
			toValue: 1,
			duration: 200,
			easing: Easing.ease
		}).start();
	}

	hideAnimate = ()=>{
		Animated.timing(this.state.showIt,{
			toValue: 0,
			duration: 150,
			easing: Easing.ease
		}).start(()=>{
			this.props.hideAction()
		});
	}

	openComponent = (component,params={}) => {
		let navigator = this.props.navigator;
		if(navigator){
			navigator.push({
				component,
				params,
			})
		}
	}

	action = (type,params={}) =>{
		this.hideAnimate();
		switch(type){
			case 'index': 
				RCTDeviceEventEmitter.emit('changeTabBarIdx', { idx: 0, goTop: true });
				break;
			case 'search':
				let component = params.component?params.component:Search;
				this.openComponent(component,params.params);
				break;
			case 'share':

				break;
			case 'msg':
				if(ISLOGIN){
					this.openComponent(MessageCenter,params);
				}else{
					this.openComponent(Login,params)
				}
				break;
			case 'user':
				if(ISLOGIN){
					RCTDeviceEventEmitter.emit('changeTabBarIdx', { idx: 3, goTop: true });
				}else{
					this.openComponent(Login,params)
				}
				break;
			default:
				break;
		}
	}

	makeLineHtml = (key) => {
		return <View key={key} style={{height: 1/PixelRatio.get(),backgroundColor:'#E5E5E5'}} />
	}

	render(){
		let htmlArr = ORDERLIST && ORDERLIST.map((e,i)=>{
			return this.htmlTemplate(e.module,e.params);
		});
		for(let i=0;i<htmlArr.length;++i){
			if(i === 0 || i%2 === 0){
				htmlArr.splice(i+1,0,this.makeLineHtml(i+'line'))
			}
		}
		htmlArr.pop();
		return (
			<View
        		style={styles.moreView}
        	>
        		<Text style={styles.moreView} onPress={()=>this.hideAnimate()} />
        		<View style={styles.outBox}>
	        		<Animated.View
	        			style={[styles.moreBox,{
							height: this.state.showIt.interpolate({
								inputRange: [0,1],
								outputRange: [0,this.modalHeight],
								extrapolate: 'clamp',
							}),
							// transform: [{
							// 	scale: this.state.showIt.interpolate({
							// 		inputRange: [0,1],
							// 		outputRange: [0,1],
							// 		extrapolate: 'clamp',
							// 	}),
							// }]
	        			}]}
	        		>{ htmlArr }</Animated.View>
	        	</View>
        	</View>
		);
	}
}

class MoreModal extends Component{
	constructor(props){
		super(props);

	}

	componentWillUnmount() {
        this.hide();
    }

	show = () => {
        let sibling = new RootSiblings(<ModalItem navigator={this.props.navigator} UnReadMsgNum={MSGNUMBER} hideAction={()=>this.hide()}/>);
        elements.push(sibling);
        return sibling;
    }

    hide = () => {
        let lastSibling = elements.pop();
        lastSibling && lastSibling.destroy();
    }

	render(){
		return null;
	}
}

class MoreOperation extends Component{
	constructor(props){
		super(props);

		this.state = {
			msgStatus: false,  // 是否有未读消息
			msgNum: 0,   // 未读信息数量
		}

		this._moreImg = !this.props.whiteIcon ? require('../res/images/000gengduo.png') : require('../res/images/000gengduo_s.png');
		ORDERLIST = [].concat(this.props.order);
		ORDERLIST = ORDERLIST.filter((e,i)=>{
			if(e.module !== 'share') return true;
			return false;
		})
	}

	componentWillMount(){
		this.props.actions.getMsgNum().then((data)=>{
			if(!data.success) return ;
			let nextState = {msgNum: data.unReadNum?data.unReadNum:0,};
			if (data.unReadNum > 0) {
				nextState.msgStatus = true;
			} else {
				nextState.msgStatus = false;
			}
			this.setState(nextState);
		}).catch((err)=>{
			console.log(err);
		})
	}

	componentDidMount(){
		ISLOGIN = this.props.isLogin;
	}


	componentWillReceiveProps(newProps){
		MSGNUMBER = newProps.UnReadMsgNum;
		ISLOGIN = newProps.isLogin;
		ORDERLIST = [].concat(newProps.order);
		ORDERLIST = ORDERLIST.filter((e,i)=>{
			if(e.module !== 'share') return true;
			return false;
		})
	}

	componentWillUnmount(){

	}

	static defaultProps = {
		order: [{
			module:'share',
			params:{},
		},{
			module:'index',
			params:{},
		},{
			module:'search',
			params: {},
		},{
			module:'message',
			params:{},
		},{
			module:'mine',
			params: {},
		}],
	}

	render(){
		let touchStyle = this.props.style?this.props.style:{}
		return (
			<TouchableOpacity
				onPress={()=>{
					this.refs.modal.show();
				}}				
				style={[styles.moreBtn,touchStyle]}
			>
				<Image
					source={this._moreImg}
					style={styles.moreImg}
				/>
				{ this.props.UnReadMsgNum !== 0 && <View style={styles.bot}/>}
				<MoreModal ref={'modal'} navigator={this.props.navigator} />
			</TouchableOpacity>
		)
	}
}



function mapStateToProps(state){
	return {
		UnReadMsgNum: state.MsgInfo.unReadNum,
		isLogin: state.Member.isLogin,
	}
}

function mapDispatchToProps(dispatch){
	return {
		actions: bindActionCreators(moreActions,dispatch),
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(MoreOperation);

const styles = StyleSheet.create({
	moreBtn:{
		width: 34,
		height: 25,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 5,
	},
	moreImg: {
		width: 16,
		height: 3,
	},
	bot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: MSGCOLOR,
		position: 'absolute',
		top: 0,
		right: 0,
	},
	moreView: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'transparent',
	},
	moreBox: {
		width: 145,
		paddingLeft: 10,
		overflow: 'hidden',
	},
	item: {
		height: 50,
		flexDirection: 'row',
		alignItems: 'center',
	},
	actionImg: {
		width: 25,
		height: 25,
	},
	actionTitle: {
		fontSize: 15,
		color: '#333',
	},
	outBox: {
		borderWidth:1/PixelRatio.get(),
		borderColor:'rgba(0,0,0,0.05)',
		borderRadius:5,
		shadowColor: 'rgba(0,0,0,0.26)',
		shadowRadius: 4,
		shadowOffset: {width: 0,height:0,},
		shadowOpacity: 1,
		position: 'absolute',
		top: Platform.OS === 'ios'?64:68,
		right:7.5,
		backgroundColor: '#FAFAFA',
	}
})