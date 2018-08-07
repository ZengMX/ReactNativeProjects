/**
 * Created by timhuo on 2017/2/4.
 *
 * 签名模块,注意不同的属性
 * 1.defaultImage属性
 * Android   defaultImage="#000000"                    //画板颜色
 * IOS       defaultImage = {require("./123.png")}    //这个是图片吧
 * 2.画笔宽度
 * Android     lineWidth={10}          //画笔宽度
 * IOS         minlineWidth={3}        //最小宽度
 *             maxlineWidth={8}        //最大宽度
 * TODO:
 * ios每次返回同样的图片路径，点击保存后不能同步刷新图片，Image内source内容不变时只读取缓存
 */
import React, {Component} from 'react';
import {
	Text,
	TouchableOpacity,
	Image,
	NativeModules,
	UIManager,
	findNodeHandle,
} from 'react-native';
import {BaseView} from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';

import {BrushBoardComponent, BrushBoardModel} from '@imall-test/react-native-brushboard'

export default class DrawPage extends Component {
	
	constructor(props) {
		super(props);
		this.state = {imageurl: null};
		this.defaultImage = IS_IOS ? require("./res/123.png") : '#ffe599';
	}
	
	clean = () => {
		let tempas = this.refs.BrushBoard;
		BrushBoardModel.cleanWithComponent(tempas);
	}
	
	save = () => {
		let tempas = this.refs.BrushBoard;
		// let tempas2 = findNodeHandle(this.refs.BrushBoard);
		
		// let yyy = UIManager;
		// let ttt = yyy.MTBrushBoard;
		// UIManager.dispatchViewManagerCommand(
		// 	findNodeHandle(tempas),
		// 	ttt.Commands.saveWithTag,
		// 	[
		// 		tempas,
		// 		(imageurl)=>{
		// 				console.log(imageurl + ' 2222  ' + Math.random()); //返回图片路径
		// 				this.setState({
		// 					imageurl: {uri: 'file://' + imageurl }
		// 				});
		// 		}
		// 	]
		// );
		
		BrushBoardModel.saveWithComponent(
			tempas,
			(imageurl) => {
				console.log(imageurl + ' 2222  ' + Math.random()); //返回图片路径
				this.setState({
					imageurl: { uri: 'file://' + imageurl }
				});
			}
		);
		
	};
	
	render() {
		
		let img = this.state.imageurl ? (
				<Image source={this.state.imageurl} style={{ width: Styles.theme.W, height: 200 }}/>) : null;
		
		return (
			<BaseView navigator={this.props.navigator} ref={base => this.base = base}>
				<BrushBoardComponent
					ref='BrushBoard'
					style={{ width: Styles.theme.W, height: 200 }}
					lineColor={"#2fbdc8"}
					defaultImage={this.defaultImage}
				/>
				
				<TouchableOpacity onPress={this.clean.bind(this)}>
					<Text>清除</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={this.save.bind(this)}>
					<Text>保存</Text>
				</TouchableOpacity>
				{img}
			</BaseView>
		);
	}
}