import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  InteractionManager
} from 'react-native';
import { Fetch } from 'future/public/lib';
import { BaseView, RefreshableListView } from 'future/public/widgets';
import PointsPrdDetail from './PointsPrdDetail';
import styles from '../style/MallPoints.css';
import PointsShoppingCart from '../components/PointsShoppingCart';

import Login from 'future/src/member/components/Login';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

var SCREEN_WIDTH = require('Dimensions').get('window').width;
class MallPoints extends Component {
    constructor(props) {
        super(props);
		this.state = {
			integral: ""
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
    componentDidMount() {
			if (!this.props.isLogin) {
				this.toLogin();
			}
		
	}
    componentWillReceiveProps(nextProps){
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

    _fetchData(page, success, error){
        new Fetch({
            url: 'app/integral/findByProductTypeId.json',
            method: 'POST',
        }).dofetch().then((data) => {
			this.setState({integral: data.userBalance});
            success(data.result.result,10 * (page - 1) + data.result.result.length, data.result.result.length);
			
        }).catch((err) => {
            console.log('=> catch: ', err);
            error && error();
        });
    }
    _OpenPointsPrdDetail = (integralProductId) => {
        this.props.navigator.push({
            component:PointsPrdDetail,
            params:{
                integralProductId: integralProductId
            }
        })
    }

    _renderRow(rowData, sectionID, rowID) {
		var canExchange = true;
		if(rowData.num === 0 || rowData.integral > this.state.integral)
			canExchange = false;
        return (
            <View >
                <TouchableOpacity style={{flexDirection:'row',height:125,flex:1,backgroundColor:'#fff'}} onPress={() => { this._OpenPointsPrdDetail(rowData.integralProductId) }}>
                <View style={{justifyContent:'center',alignItems:'center',width:125,height:125}}>
                    <Image style={{width:100,height:100}} source={{uri:rowData.icon}}/>
                </View>
                <View style={{flex:1,borderBottomColor:'#eee',borderBottomWidth:0.5}}>
                    <Text style={{marginTop:14,color:'#333'}}numberOfLines={2}>{rowData.integralProductNm}</Text>
                    <Text style={{marginTop:6,color:'#666'}}>剩余{rowData.num}件</Text>
                    <View style={{height:56,width:SCREEN_WIDTH-125,alignSelf:'flex-end',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <Text style={{color:'#FF6600',fontSize:14,fontWeight: 'bold'}}>{rowData.integral}积分</Text>
                        <TouchableOpacity style={[{width:75,height:28,borderColor:'#34457d',borderWidth:0.5,borderRadius:2,justifyContent:'center',alignItems:'center',marginRight:13}, canExchange ? null : {borderColor:'#E5E5E5'}]}
							disabled={!canExchange}
							onPress={() => {
								this.props.navigator.push({
									component: PointsShoppingCart,
									params: {
										integralProduct : rowData,
										integral: this.state.integral,
									}
								});
							}}>
                            <Text style={[{color:"#34457d",fontSize:13}, canExchange ? null : {color: '#BFBFBF'}]}>我要兑</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </TouchableOpacity>
            </View>
        );
    }
    _renderHeader(){
        return(
            <View style={styles.header}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>当前积分    <Text style={styles.points}>{this.state.integral}</Text></Text>
                </View>
            </View>
        )
    }
    render(){
        return(
            <BaseView
                ref='baseview'
                title={{ title: '积分商城 ', tintColor: '#333'}}
                navigator={this.props.navigator}
				statusBarStyle={'default'}>
                <RefreshableListView
                    style={{backgroundColor:'#f5f5f5'}}
                    ref='list'
                    contentContainerStyle={{ marginTop: 8 }}
                    showsVerticalScrollIndicator={false}
                    scrollRenderAheadDistance={150}
                    contentInset={{ bottom: 0 }}
                    initialListSize={1}
                    autoRefresh={false}
                    autoLoadMore={true}
                    fetchData={this._fetchData.bind(this)}
                    renderRow={this._renderRow.bind(this)}
                    renderHeader={this._renderHeader.bind(this)}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(MallPoints);

