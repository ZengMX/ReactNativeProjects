/**
 * BaseView
 * 主要功能：navbar、网络状态控制
 * <BaseView navigator={this.props.navigator}
 *		ref='base'
 *		leftButton={this.renderLeftButton()}	//自定义navbar左边按钮
 *		rightButton={this.renderRightButton()}	//自定义navbar右边按钮
 *		title={{title:'xxx',tintColor:'xxx'}}	//自定义navbar标题
 *		head={this.renderHead()}				//自定义navbar
 *		openCheckNetwork={false}				//是否开启网络检查
 *		reload={() => this.fetchData()}			//重新加载数据()
 *    mainColor // 导航栏背景色
 *    mainBackColor //背景颜色
 *    statusBarStyle={'default'}  // 状态栏样式 'light-content' or 'default'
 *	/>
 *	</BaseView>
 *
 *	注：1、RefreshableListView和BaseView默认开启网络控制
 *		2、同时使用RefreshableListView和BaseView时注意网络控制开关，不要同时开启网络控制，可通过传递'openCheckNetwork'参数控制是否开启
 */

import React, { Component } from 'react';
import {
	View,
	ScrollView,
	Dimensions,
	StyleSheet,
	Navigator,
	Modal,
	Text,
	Image,
	TouchableOpacity,
	PixelRatio,
	NetInfo,
	Platform
} from 'react-native';

let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT = Dimensions.get('window').height;

import {NavBar, PullView, Toast, Loading} from '../../widgets';
import ToastView from 'react-native-root-toast';
import Chrosslocation from '@imall-test/react-native-chrosslocation';

export default class BaseView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			showMenu : false,
			checkNetwork : true,
			openCheckNetwork : this.props.openCheckNetwork,
			title: this.props.title,
		};
		this.alterTitle=this.alterTitle.bind(this);
	}

	static propTypes = {
		// finishChoose		: React.PropTypes.func,
		// onChoose			: React.PropTypes.func,
		navigator			: React.PropTypes.object,
		// scrollEnabled	: React.PropTypes.bool,
		// noNetwork: React.PropTypes.object,
		renderModalScence	: React.PropTypes.func,
		// noNetworkBtnAction: React.PropTypes.func,
		// pullRefresh		: React.PropTypes.func,
		head				: React.PropTypes.element,	//自定义navbar
		openCheckNetwork	: React.PropTypes.bool,		//是否需要检查网络
		reload				: React.PropTypes.func,		//重新加载
	}

	static defaultProps = {
		// finishChoose		: () => { },
		// onChoose			: () => { },
		navigator			: {},
		// scrollEnabled	: false,
		// noNetwork: undefined,
		renderModalScence	: ()=>{return(<View></View>)},
		// noNetworkBtnAction: ()=>{},
		// pullRefresh		: (resolve) => {resolve() },
		head				: <View></View>,
		openCheckNetwork	: true,
		titlePosition:'center',		// 标题位置
		// statusBarStyle:'light-content',  // 状态栏样式
		statusBarStyle:'default',  // 状态栏样式
		reload				: () => {}
	}

	//根据err控制页面
	//TODO 未添加延时判断
	controlViewByErr(err){
		let checkNetwork = true;
		if(err.message == "noNetwork"){
			checkNetwork = false;
		}
		this.setState({
			checkNetwork : checkNetwork
		})
	}
	//改变title
	alterTitle(str){		
		this.setState({title:str});
	}
	//弹出Toast
	showToast(message){
		Toast.show(message);
	}

	//控制浮层
	setShowMenu(isShow){
		this.setState({
			showMenu : isShow
		});
	}
	//获取浮层状态
	getShowMenu(){
		return this.state.showMenu;
	}
	//加载动画
	showLoading(){
		Loading.show();
	}
	//隐藏加载动画
	hideLoading(){
		Loading.hide();
	}
	//隐藏弹出层
	hideModal(){
		this.setState({
			modalVisible:false,
		})
	}
	//弹出层
	showModal(){
		this.setState({
			modalVisible:true,
		})
	}
	//提示框
	showMessages(message){
		alert(message);
	}

	pickAreaParams(areaCode,host,block) {
        Chrosslocation.sethost(host);
        Chrosslocation.show({
            areaCode: areaCode || null,
            color: "#3484df",
            block: block
        });
    }

	render(){
		
		return(
			<View style={{flex:1}}>
				<Modal
				animationType={'fade'}
				transparent={true}
				visible={this.state.modalVisible}
				onRequestClose={()=>{}}>
					<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
						<Text
						style={styles.modalBackground}
						onPress={()=>{
							this.hideModal();
						}}></Text>						
						{this.props.renderModalScence && this.props.renderModalScence()}						
					</View>
				</Modal>
				{/* title与this.props.head不要一起用 */}
				{this.props.title ? <NavBar
					mainColor={this.props.mainColor||'#FAFAFA'}
					statusBarStyle={this.props.statusBarStyle}
					navigator={this.props.navigator}
					title={this.state.title}
					deep={this.props.mainColor!='#34457D' || false}
					paddingRight={this.props.paddingRight}
					hideLeftBtn={this.props.hideLeftBtn || false}
					leftButton={this.props.leftButton || undefined}
					leftBtnHandler={this.props.leftBtnHandler || undefined}
					rightButton={this.props.rightButton || undefined}
					leftBtnStyle={this.props.leftBtnStyle || undefined}
					titlePosition={this.props.titlePosition || undefined}
					style={this.props.navBarStyle} >
					</NavBar> :
					<NavBar
						mainColor={this.props.mainColor||'#FAFAFA'}
						deep={this.props.mainColor!='#34457D' || false}
						statusBarStyle={this.props.statusBarStyle}
						navigator={this.props.navigator}
						hideLeftBtn={this.props.hideLeftBtn || false}
						leftButton={this.props.leftButton || undefined}
						leftBtnHandler={this.props.leftBtnHandler || undefined}
						leftBtnStyle={this.props.leftBtnStyle || undefined}
						rightButton={this.props.rightButton || undefined}
						style={this.props.navBarStyle} >
							{this.props.head}
					</NavBar>}			
				{/* 渲染前优先判断网络状态 */}
				{(this.state.checkNetwork && this.state.openCheckNetwork) ?
					<View style={[styles.navigator,this.props.mainBackColor]}>
						{this.props.children}
					</View>:
					<View style={{ height: 400, justifyContent: 'center', alignItems: 'center', width: SCREEN_WIDTH }}>
						<Image source={require('./res/004zanwuwangluo.png')} style={{resizeMode:Image.resizeMode.contain}}/>
						<Text style={{ color: '#D8D8D8', fontSize: 13, marginTop: 22 }}>{this.props.reload ? '网络不给力，请检查网络后刷新~' : '网络不给力，请检查网络~'}</Text>
						{this.props.reload && <TouchableOpacity style={{width: 164, height: 41, alignItems: 'center', justifyContent: 'center', marginTop: 22, backgroundColor: "#FAFAFA", borderRadius: 5, borderWidth: 1/PixelRatio.get(), borderColor: "#FAFAFA"}}
						onPress={() => {this.props.reload()}}
						activeOpacity={0.7}>
							<Text style={{color: "#fff", fontSize: 15}}>重新加载</Text>
						</TouchableOpacity>}
					</View>
				}
			</View>
		)
	}
}

//TODO 不确定Dimensions获取的高是否包含状态栏，先不做平台判断，用64
const styles = StyleSheet.create({
	modalBackground:{
		top:0,
		width:SCREEN_WIDTH,
		height:SCREEN_HEIGHT,
		position:'absolute',
		backgroundColor:'rgba(0, 0, 0, 0.5)'
	},
	navigator: {
		width:SCREEN_WIDTH,
		// height:SCREEN_HEIGHT-64,
		flex:1,
		// height:SCREEN_HEIGHT-(Platform.OS === "ios" ? 64 : 44),
		backgroundColor:"#fff"
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
	},
	btnitem:{
		width:105,
		height:35,
		alignItems:'center',
		backgroundColor:'#2D86DA',
		justifyContent:'center',
		borderRadius:5
	}
});
