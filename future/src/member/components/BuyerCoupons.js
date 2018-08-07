import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import {
	RefreshableListView,
	BaseView,
	Toast,
    TextInputC,
    MaskModal
} from 'future/public/widgets';

import { Fetch } from 'future/public/lib';
import styles from '../styles/BuyerCoupons.css';

import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';

export default class BuyerCoupons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage : 0,
            unUsed : 0,
            isUsed : 0,
            outOfDate : 0,
        };
        this.newCouponId = '';
        this.newCouponPwd = '';
    }
    componentDidMount(){
        new Fetch({
			url: 'app/couponFront/getUserCouponNum.json',
		}).dofetch().then((data) => {
			if(data.success){
                this.setState({
                    unUsed : data.unUsed,
                    isUsed : data.isUsed,
                    outOfDate : data.outOfDate
                })
            }
		}).catch((error)=>{
			error && error();
			console.log('=====>错误 CATCH>>',error);			
		});
    }

    addCoupon(){
        
        this.refs.topModal.show();
        console.log(this.couNum);
    }

    renderRightButton(){
        return<TouchableOpacity onPress={this.addCoupon.bind(this)}>
           <Text style={{width:40,marginTop:13,color:'#444',fontSize:16}}>添加</Text>
        </TouchableOpacity>
    }
    sure(){
        // bindCoupon
        new Fetch({
			url: 'app/couponFront/bindCoupon.json',
            data:{
                cardNum:this.newCouponId,
                password:this.newCouponPwd
            }
		}).dofetch().then((data) => {
			this.refs.topModal.hide();
		}).catch((error)=>{
            this.refs.topModal.hide();
			error && error();
			console.log('=====>错误 CATCH>>',error);			
		});
        
    }
    cancle(){
        this.refs.topModal.hide();
    }
    renderTopModal(){
        return(
            <View style={{marginTop:-130}}>
                <Image style={{width:270,height:195,alignItems:'center'}} source={require('../res/BuyerCoupons/alert.png')}>
                    <View style={{width:270,height:150,alignItems:'center'}}>
                        <Text style={{fontSize:17,color:'#333',marginTop:15}}>添加实体优惠券</Text>
                        <View style={{width:245,height:33,marginTop:18,backgroundColor:'#fff'}}>
                            <TextInputC 
                            autoFocus={true} 
                            onChangeText={(value)=>{
                                this.newCouponId = value;
                            }}
                            style={{width:225,height:33,fontSize:14,marginLeft:10}} 
                            placeholder={'输入优惠券编号'}/>
                        </View>
                        <View style={{width:245,height:33,marginTop:10,backgroundColor:'#fff'}}>
                            <TextInputC 
                            secureTextEntry={true}
                            onChangeText={(value)=>{
                                this.newCouponPwd = value;
                            }}
                            style={{width:225,height:33,fontSize:14,marginLeft:10}} 
                            placeholder={'输入优惠券密码'}/>
                        </View>
                        
                    </View>
                    <View style={{height:0.5,backgroundColor:'#999',width:270}}/>
                    <View style={{height:44.5,width:270,flexDirection:'row'}}>
                        <TouchableOpacity
                        onPress={this.cancle.bind(this)} 
                        style={{flex:1,justifyContent:'center',alignItems:'center',borderRightColor:'#999',borderRightWidth:0.5}}>
                            <Text style={{fontSize:16,color:'#007AFF'}}>取消</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        onPress={this.sure.bind(this)} 
                        style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:16,color:'#007AFF'}}>确认</Text>
                        </TouchableOpacity>
                    </View>
                </Image>
            </View>
        )
    }

    render(){
        return(
            <BaseView
				ref='baseview'
				navigator={this.props.navigator}
				title={{ title: '我的优惠券', tintColor: '#333', fontSize: 18 }}
                mainBackColor={{backgroundColor:'rgba(250,250,250,.9)'}}
                rightButton={this.renderRightButton()}
			>
                <ScrollableTabView ref='scrollTab'
					page={this.state.currentPage}
					onChangeTab={(page) => {
						this.state.currentPage != page.i && this.setState({ currentPage: page.i })
					}}
					tabBarTextStyle={{ fontSize: 14 }}
					renderTabBar={() => (
						<ScrollableTabBar
							activeTextColor='#0082FF'
							inactiveTextColor='#4B5963'
							underlineColor='#0082FF'
							underlineHeight={2}
							tabStyle={styles.tabItem}
							tabsContainerStyle={{ backgroundColor:'rgba(244,243,243,1.0)' }}
							style={styles.scrollTabBar}
						/>
					)}>
					<LeftList ref="leftList" tabLabel={this.state.unUsed>0?"未使用("+this.state.unUsed+")":"未使用"} navigator={this.props.navigator}/>
                    <CenterList ref="centerList" tabLabel={this.state.isUsed>0?"已使用("+this.state.unUsed+")":"已使用"} navigator={this.props.navigator}/>
					<RightList ref="rightList" tabLabel={this.state.outOfDate>0?"已过期("+this.state.outOfDate+")":"已过期"} navigator={this.props.navigator}/>
				</ScrollableTabView>

                <MaskModal
					ref="topModal"
					viewType="full"
					containerStyle2={{ justifyContent: 'center', alignItems: 'center' }}
					contentView={this.renderTopModal()}
				/>
            </BaseView>
        )
    }
}

class LeftList extends Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	fetchData(page, success, error) {
		new Fetch({
			url: 'app/couponFront/getUserCoupon.json',
			data: {
				page: page,
				pageSize: 10,
                type:1
			}
		}).dofetch().then((data) => {
			success(data.result.result, 5 * (page - 1) + data.result.result.length, data.result.result.length)
		}).catch((error)=>{
			error && error();
			console.log('=====>错误 CATCH>>',error);			
		});
	}

	goToFlashList(rowData){
		// this.props.navigator.push({
		// 	component:FlashSaleList,
		// 	params:rowData
		// });
	}

	renderRow(rowData, sectionID, rowID, highlightRow){
        return(
            <View style={{width:SCREENWIDTH,alignItems:'center',backgroundColor:'rgba(255,255,255,0)'}}>
                <TouchableOpacity style={{marginTop:10}} onPress={()=>{}}>
                    <View style={{width:SCREENWIDTH-20,flexDirection:'row'}}>
                        <Image 
                        resizeMode={'contain'} 
                        source={require('../res/BuyerCoupons/000yhq001.png')}/>
                        <View style={{flex:1,height:120,backgroundColor:'#fff',paddingRight:15}}>
                            <Text style={{fontSize:14,color:'#545F6C',marginTop:14}}>{rowData.batchNm}</Text>
                            <Text style={{fontSize:12,color:'#A4ACB6',marginTop:5}}>{rowData.startTimeString}-{rowData.endTimeString}</Text>
                            
                        </View>

                        <View style={{left:0,top:0,height:120,width:120,position:'absolute',alignItems:'center',justifyContent:'center'}}>
                            <Text style={{fontSize:15,color:'#fff'}}>￥<Text style={{fontSize:40}}>{rowData.amount}</Text></Text>
                            <Text style={{fontSize:13,color:'#fff'}}>{rowData.rules[0]}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

	render() {
		return (
			<RefreshableListView
				style={styles.listStyle}
				ref="list"
				autoRefresh={true}
				fetchData={this.fetchData.bind(this)}
				renderRow={this.renderRow.bind(this)}
			/>
		)
	}
}

class CenterList extends Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	fetchData(page, success, error) {
		new Fetch({
			url: 'app/couponFront/getUserCoupon.json',
			data: {
				page: page,
				pageSize: 10,
                type:2
			}
		}).dofetch().then((data) => {
			success(data.result.result, 5 * (page - 1) + data.result.result.length, data.result.result.length)
		}).catch((error)=>{
			error && error();
			console.log('=====>错误 CATCH>>',error);			
		});
	}

	goToFlashList(rowData){
		// this.props.navigator.push({
		// 	component:FlashSaleList,
		// 	params:rowData
		// });
	}

	renderRow(rowData, sectionID, rowID, highlightRow){
        return(
            <View style={{width:SCREENWIDTH,alignItems:'center',backgroundColor:'rgba(255,255,255,0)'}}>
                <TouchableOpacity style={{marginTop:10}} onPress={()=>{}}>
                    <View style={{width:SCREENWIDTH-20,flexDirection:'row'}}>
                        <Image 
                        resizeMode={'contain'} 
                        source={require('../res/BuyerCoupons/000yhq001.png')}/>
                        <View style={{flex:1,height:120,backgroundColor:'#fff',paddingRight:15}}>
                            <Text style={{fontSize:14,color:'#545F6C',marginTop:14}}>{rowData.batchNm}</Text>
                            <Text style={{fontSize:12,color:'#A4ACB6',marginTop:5}}>{rowData.startTimeString}-{rowData.endTimeString}</Text>
                            <Image 
                            style={{width:75,height:75,position:'absolute',bottom:10,right:5}} 
                            source={require('../res/BuyerCoupons/008yishiyon.png')}/>
                        </View>

                        <View style={{left:0,top:0,height:120,width:120,position:'absolute',alignItems:'center',justifyContent:'center'}}>
                            <Text style={{fontSize:15,color:'#fff'}}>￥<Text style={{fontSize:40}}>{rowData.amount}</Text></Text>
                            <Text style={{fontSize:13,color:'#fff'}}>{rowData.rules[0]}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

	render() {
		return (
			<RefreshableListView
				style={styles.listStyle}
				ref="list"
				autoRefresh={true}
				fetchData={this.fetchData.bind(this)}
				renderRow={this.renderRow.bind(this)}
			/>
		)
	}
}

class RightList extends Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	fetchData(page, success, error) {
		new Fetch({
			url: 'app/couponFront/getUserCoupon.json',
			data: {
				page: page,
				pageSize: 10,
                type:3
			}
		}).dofetch().then((data) => {
			success(data.result.result, 5 * (page - 1) + data.result.result.length, data.result.result.length)
		}).catch((error)=>{
			error && error();
			console.log('=====>错误 CATCH>>',error);			
		});
	}

	goToFlashList(rowData){
		// this.props.navigator.push({
		// 	component:FlashSaleList,
		// 	params:rowData
		// });
	}

	renderRow(rowData, sectionID, rowID, highlightRow){
        return(
            <View style={{width:SCREENWIDTH,alignItems:'center',backgroundColor:'rgba(255,255,255,0)'}}>
                <TouchableOpacity style={{marginTop:10}} onPress={()=>{}}>
                    <View style={{width:SCREENWIDTH-20,flexDirection:'row'}}>
                        <Image 
                        resizeMode={'contain'} 
                        source={require('../res/BuyerCoupons/000yhq001gray.png')}/>
                        <View style={{flex:1,height:120,backgroundColor:'#fff',paddingRight:15}}>
                            <Text style={{fontSize:14,color:'#545F6C',marginTop:14}}>{rowData.batchNm}</Text>
                            <Text style={{fontSize:12,color:'#A4ACB6',marginTop:5}}>{rowData.startTimeString}-{rowData.endTimeString}</Text>
                            
                        </View>

                        <View style={{left:0,top:0,height:120,width:120,position:'absolute',alignItems:'center',justifyContent:'center'}}>
                            <Text style={{fontSize:15,color:'#fff'}}>￥<Text style={{fontSize:40}}>{rowData.amount}</Text></Text>
                            <Text style={{fontSize:13,color:'#fff'}}>{rowData.rules[0]}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

	render() {
		return (
			<RefreshableListView
				style={styles.listStyle}
				ref="list"
				autoRefresh={true}
				fetchData={this.fetchData.bind(this)}
				renderRow={this.renderRow.bind(this)}
			/>
		)
	}
}
