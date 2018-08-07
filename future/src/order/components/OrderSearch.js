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
	Alert,StyleSheet,Keyboard,KeyboardAvoidingView

} from 'react-native';
var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;
import _ from 'underscore';
import Fetch from 'future/public/lib/Fetch';
import { BaseView, MaskModal, RefreshableListView, Toast, TextInputC, DatePicker } from 'future/public/widgets';
import SearchResult from './SearchResult';
import KeyboardSpacer from 'react-native-keyboard-spacer';

export default class OrderSearch extends Component {
	constructor(props) {
		super(props);
		let oldParams = {};
		this.state = {
			productNm: oldParams.productNm || null,
			orderNum: oldParams.orderNum || null,
			shopNm: oldParams.shopNm || null,
			batchNum: oldParams.batchNum || null,
			productCoding: oldParams.productCoding || null,			
			isSalesman: oldParams.isSalesman || null,
			startDate: oldParams.startDate || null,
			endDate: oldParams.endDate || null,

			offset:false,
		}
	}

	//搜索
	search() {
		// let value = {
		// 	keywords: this.state.keywords,
		// 	isSalesman: this.state.isSalesman,
		// 	startTime: this.state.startTime,
		// 	endTime: this.state.endTime,
		// }
		// this.props.params.callback(value)
		this.props.navigator.push({
			component:SearchResult,
			params:{
				extraParams:Object.assign({},this.state,
						{startDate:this.state.startDate?this.state.startDate+' 00:00:00':'',endDate:this.state.endDate?this.state.endDate+' 23:59:59':''}
					), 
			}
		})
	}

	onFocus(){
		this.setState({offset:true});		
	}
    onBlur(){
		this.setState({offset:false});
	
	}
	render() {
		return (
				<BaseView navigator={this.props.navigator} 
					title={{ title: '订单搜索', tintColor: '#333333', style: { fontSize: 18 } }}
					statusBarStyle='default'
					leftButton={
						<Text style={{fontSize:16,color:'#444',alignSelf:'center',marginLeft:13}}
							onPress={()=>{this.props.navigator.pop()}}
						>关闭</Text>}
				>
				
					
					<ScrollView contentContainerStyle={{ backgroundColor: '#fafafa',flex:1,justifyContent:"space-between",borderTopWidth:1/PixelRatio.get(),borderColor:'#e5e5e5' }}
						>				
						<View style={{backgroundColor:'#fff',flex:1,paddingTop:7.5,paddingHorizontal: 13,top:this.state.offset?-120:0,zIndex:2}}>						
							<View style={styles.itemContainer}>
								<Text style={{ fontSize: 15,color: '#333', width: 70 }}>商品名称</Text>
								<View style={{ flex: 1, borderRadius: 3, borderWidth: 1, borderColor: '#e5e5e5',height:35 }}>
									<TextInputC style={{paddingHorizontal: 10, fontSize: 14, color:'#333',paddingVertical: 0 }}
										onChangeText={(productNm) => { this.setState({ productNm }) } }  value = {this.state.productNm} noClean={true}
										/>
								</View>
							</View>
							<View style={styles.itemContainer}>
								<Text style={{ fontSize: 15,color: '#333', width: 70 }}>订单编号</Text>
								<View style={{ flex: 1, borderRadius: 3, borderWidth: 1, borderColor: '#e5e5e5',height:35 }}>
									<TextInputC style={{paddingHorizontal: 10, fontSize: 14, color:'#333',paddingVertical: 0 }}
										onChangeText={(orderNum) => { this.setState({ orderNum }) } }  value = {this.state.orderNum} noClean={true}
										/>									
								</View>
							</View>
							<View style={styles.itemContainer}>
								<Text style={{ fontSize: 15,color: '#333', width: 70 }}>供应商</Text>
								<View style={{ flex: 1, borderRadius: 3, borderWidth: 1, borderColor: '#e5e5e5',height:35 }}>
									<TextInputC style={{paddingHorizontal: 10, fontSize: 14, color:'#333', paddingVertical: 0 }}
										onChangeText={(shopNm) => { this.setState({ shopNm }) } }  value = {this.state.shopNm} noClean={true}
										/>
								</View>
							</View>
							<View style={styles.itemContainer}>
								<Text style={{ fontSize: 15,color: '#333', width: 70 }}>创建时间</Text>
								<TouchableOpacity style={{ flex: 1, borderRadius: 3, borderWidth: 1, borderColor: '#e5e5e5',height:35,justifyContent:'center',alignItems:'center' }}
									onPress={() => { this.picker1.show() } }>
									<Text style={{fontSize:14,color:this.state.startDate?'#333':'#999'}} >{this.state.startDate?this.state.startDate:'开始时间'}</Text>
								</TouchableOpacity>
								<Text>--</Text>
								<TouchableOpacity style={{ flex: 1, borderRadius: 3, borderWidth: 1, borderColor: '#e5e5e5',height:35,justifyContent:'center',alignItems:'center'}}
									onPress={() => { this.picker2.show() } }>
									<Text style={{fontSize:14,color:this.state.endDate?'#333':'#999'}} >{this.state.endDate?this.state.endDate:'结束时间'}</Text>
								</TouchableOpacity>
							</View>
							<View style={styles.itemContainer}>
								<Text style={{ fontSize: 15,color: '#333', width: 70 }}>发货批号</Text>
								<View style={{ flex: 1, borderRadius: 3, borderWidth: 1, borderColor: '#e5e5e5',height:35 }}>
									<TextInputC style={{paddingHorizontal: 10, fontSize: 14, color:'#333', paddingVertical: 0 }}
										onChangeText={(batchNum) => { this.setState({ batchNum }) } }  value = {this.state.batchNum} noClean={true}
										onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)}											
									/>
								</View>
							</View>
							
								<View style={styles.itemContainer}>
									<Text style={{ fontSize: 15,color: '#333', width: 70 }}>商品编号</Text>
									<View style={{ flex: 1, borderRadius: 3, borderWidth: 1, borderColor: '#e5e5e5',height:35 }}>
										<TextInputC style={{paddingHorizontal: 10, fontSize: 14, color:'#333', paddingVertical: 0 }}
											onChangeText={(productCoding) => { this.setState({ productCoding }) } }  value = {this.state.productCoding} noClean={true}
											onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)}
											/>
									</View>
								</View>
						</View>															
							
						<TouchableOpacity style={{backgroundColor: '#34457d', height: 50, justifyContent: 'center', alignItems: 'center'}}
							onPress={() => { this.search() }}>
							<Text style={{ fontSize: 13, color: '#fff' }}>搜索</Text>
						</TouchableOpacity>	
						
					</ScrollView>				
				
				{/*选择开始时间*/}
				<DatePicker
					ref={picker1 => this.picker1 = picker1}
					style={{ width: 200 }}
					mode="date"
					format="YYYY-MM-DD" //时间日期显示时的模式
					maxDate={new Date()}
					onPressCancel={()=>{this.setState({ startDate: '' });}}
					onDateChange={(startTime) => {
						if (this.state.endDate) {
							var d1 = new Date(Date.parse(startTime.replace(/-/g, "/")));
							var d2 = new Date(Date.parse(this.state.endDate.replace(/-/g, "/")));
							if (d1 > d2) {
								Toast.show("开始时间必须小于结束时间");
								return;
							}
						}
						this.setState({ startDate: startTime});
					} } //选择好日期后的回调
					/>
				{/*选择结束时间*/}
				<DatePicker
					ref={picker2 => this.picker2 = picker2}
					style={{ width: 200 }}
					mode="date"
					format="YYYY-MM-DD" //时间日期显示时的模式
					maxDate= {new Date()}
					onPressCancel={()=>{this.setState({ endDate: ''});}}
					onDateChange={(endTime) => {
						//let timeStr = endTime + " 23:59:59";

						//  if (new Date(Date.parse(timeStr.replace(/-/g, "/"))) - new Date() > 0) {
						//         Toast.show('结束时间不能大于今天，请重新选择');
						// 		return
						//  }

						if (this.state.startDate) {
							var d1 = new Date(Date.parse(this.state.startDate.replace(/-/g, "/")));
							var d2 = new Date(Date.parse(endTime.replace(/-/g, "/")));
							if (d1 > d2) {
								Toast.show("结束时间必须大于开始时间");
								return;
							}
						}
						this.setState({ endDate: endTime});
					} } //选择好日期后的回调
					/>


				
			</BaseView>)
	}
}
const styles = StyleSheet.create({
	itemContainer:{
		alignItems: 'center', flexDirection: 'row',height:60,
	}
})