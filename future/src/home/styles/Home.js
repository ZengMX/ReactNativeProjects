import React, { Component } from 'react';
import {
	Dimensions,
	PixelRatio,
	Platform
} from 'react-native';
let fullwidth = Dimensions.get('window').width;
let fullheight = Dimensions.get('window').height;
import Styles from 'future/public/lib/styles/Styles';
let imageArrViewHeight = fullwidth * 0.6875;
const styles = Styles.create({
	tabViewItems:{
		width:80,
		height:26,
		backgroundColor:'#2e0f50',
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center',
		borderRadius:13,
		marginLeft:13
	},
	tabView:{
		width:fullwidth,
		height:55,
		backgroundColor:'#fff',
	},
	titleShow:{
		width:fullwidth,
		height:50,
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'center',
		backgroundColor:'#fff',
		marginTop:10
	},
	rightView:{
		flex: 1, 
		flexDirection: 'column' ,
		borderBottomWidth:1/PixelRatio.get(),
		borderColor:'#eee',
	},
	imageRight:{
		width:fullwidth * 0.328125,
		height:imageArrViewHeight/2,
		borderRightWidth:1/PixelRatio.get(),
		borderTopWidth:1/PixelRatio.get(),
		borderColor:'#eee',
	},
	imageLeft:{
		width:fullwidth * 0.34375,
		height:imageArrViewHeight,
		borderWidth:1/PixelRatio.get(),
		borderColor:'#eee'
	},
	imageArrView:{
		marginTop:10,
		width:fullwidth,
		height:imageArrViewHeight,
		flexDirection:'row',
		backgroundColor:'#fff'
	},
	noticeBanner:{
		flex:1,
		height:28,		
		justifyContent: 'center',		
	},
	noticeView:{
		width:fullwidth-20,
		marginLeft:10,
		height:28,
		borderRadius:15,
		backgroundColor:"#fff",
		paddingHorizontal:13,
		flexDirection:'row',		
		alignItems:'center'
	},
	headerView:{
		width:fullwidth,
		height:'$STATUS_HIGHT',
		backgroundColor:'#2d0e4f'
	},
	swiperView:{
		width:fullwidth,
		height:50,
		backgroundColor:'#2d0e4f'
	},
	container: {
		flex: 1
	},
	header: {
		width: fullwidth,
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 10,
	},
	inp: {
		width: 14,
		height: 14,
		marginHorizontal: 8,
	},
	recomView: {		
		flexDirection: 'row',
		flexWrap: 'wrap', 
		alignItems: 'flex-start', 
		justifyContent: 'space-between',
	
	},
	listViewItem:{		
		backgroundColor:'#fff',
		marginTop:5,
		width:fullwidth/2-2.5,
		height:(fullwidth/2-2.5) * 1.5
	},
	recomImg: {
		width: fullwidth/2-32.5, 
		height: fullwidth/2-32.5,
	},
	toTop: {
		position: 'absolute',
		zIndex: 9,
		right: 12,
		bottom: 20,
		backgroundColor: '#fff',
		borderRadius: 20,
		overflow: 'hidden'
	},

});

export default styles;