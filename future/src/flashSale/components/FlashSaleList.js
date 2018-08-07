import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  PixelRatio,
} from 'react-native';

import {
  BaseView,
  RefreshableListView,
  Timeable,
} from "future/public/widgets";
import {
  Fetch,
  imageUtil,
} from 'future/public/lib';
import styles from "../styles/FlashSale";
// import FlashSaleProductDetail from './FlashSaleProductDetail';
import ProductDetail from 'future/src/product/components/ProductDetail';

var fullWidth = require('Dimensions').get('window').width;

class TimeBack extends Timeable {
  constructor(props) {
    super(props);
  }

  formatTime(num) {
    if (num < 10) {
      return '0' + num;
    } else {
      return num.toString();
    }
  }

  renderSelfStyle(day, hour, minute, second) {
    let dayStr, hourStr, minuteStr, secondStr, timeStr;
    dayStr = day?day:'0';
    hourStr = (dayStr || hour)?hour:'0',
    minuteStr = (dayStr || hourStr || minute)?minute:'0',
    secondStr = second;
    timeStr = dayStr+hourStr+minuteStr+secondStr;
    if(timeStr !== '0000'){
      timeStr = (
        <Text style={{fontSize:12,color:'#00363D',}}>
          <Text style={{fontSize:15,color:'#5A6576',}}>{dayStr}</Text>天
          <Text style={{fontSize:15,color:'#5A6576',}}>{hourStr}</Text>时
          <Text style={{fontSize:15,color:'#5A6576',}}>{minuteStr}</Text>分
          <Text style={{fontSize:15,color:'#5A6576',}}>{secondStr}</Text>秒后结束
        </Text>
      );
    }else{
      timeStr = (
        <Text style={{fontSize:15,color:'#00363D',}}>活动已结束</Text>
      )
    }
    return (
      <View>
        {timeStr}
      </View>
    )
  }
}

export default class FlashSaleList extends Component {
    constructor(props) {
        super(props);
        this.state = {
          activityData: null,
        }
        this.renderRow = this._renderRow.bind(this);
        this.renderHeader = this._renderHeader.bind(this);
    }
    componentDidMount(){
        
    }
    componentWillReceiveProps(nextProps){
    }

    fetchData(page, success, error){
        new Fetch({
    			url: '/app/promotion/panicBuyActivity/getActivityProductBuyById.json',
          data:{
              pageNumber: page,
              pageSize:10,
              activityId:this.props.params && this.props.params.marketingActivityId
          }
    		}).dofetch().then((data) => {
          if(this.state.activityData === null){
            this.setState({
              activityData: data.marketingActivity,
            })
          }
    			success(data.productPage.result, 5 * (page - 1) + data.productPage.result.length, data.productPage.result.length)
    		}).catch((error)=>{
    			console.log('=====>错误 CATCH>>',error);
    		});
    }

    goToProductDetail(prdId){
		this.props.navigator.push({
			component: ProductDetail,
			params: {
				productId: prdId
			}
		})
    }
    _renderHeader(){
      let time = 0, activityData = this.state.activityData;
      if(activityData !== null){
        time = activityData.activityEndTime - Date.now();
      }
        return(
            <View>
                <View style={{backgroundColor:'#fff',width:fullWidth,height:27*fullWidth/64}}>
					       <Image source={imageUtil.get(this.props.params.activeImg)} style={styles.activityImage} resizeMode={'contain'}/>
                </View>
                <View style={{width:fullWidth-130,height:35,marginLeft:65,marginTop:15,justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}}>
                  <TimeBack
                    ref='time'
                    autoStart={true}
                    time={time}
                    callback={() => {
                      
                    }}
                  />
                </View>
                <View style={{height:15}}>
                </View>
            </View>
        )
    }

    _renderRow(rowData, sectionID, rowID, highlightRow){
      let boxWidth = (fullWidth-5)/2;
	  console.log('>>>>>>rowData',rowData);
      return(
          //TODO点击跳转商品详情
          <TouchableOpacity
            onPress={this.goToProductDetail.bind(this,rowData.productId)}
            style={{width:boxWidth, height:boxWidth+72.5,backgroundColor:'#fff',marginTop:5,}}
          >
            <Image
              source={imageUtil.get(rowData.picUrl)}
              style={{width:boxWidth,height: boxWidth,marginBottom:10}}
            />
            <View style={{marginHorizontal:10,alignItems:'center',justifyContent:'space-between', flexDirection:'row',marginBottom:10,}}>
                <Text style={{fontSize:16,color:'#FF6600'}}>¥{rowData.price}</Text>
                <View style={{width:39,height:17,borderWidth:1/PixelRatio.get(),borderColor:'#FF6600',borderRadius:2,backgroundColor:'#FFF4EC',overflow:'hidden',justifyContent:'center',alignItems:'center',}}>
                  <Text style={{fontSize:12,color:'#FF6600'}}>{rowData.discount}折</Text>
                </View>
            </View>
            <Text style={{fontSize:14,color:'#333',paddingHorizontal: 10,}} numberOfLines={1}>{rowData.productNm}</Text>
          </TouchableOpacity>
      )
    }

    renderRightButton(){
		return (
			<TouchableOpacity
			 style={{width:44,height:44,justifyContent:'center',alignItems:'center'}}>
			    <Image source={require('../res/000dian@2x.png')}/>
			</TouchableOpacity>
		)
	}

    render(){
        return(
        <BaseView navigator={this.props.navigator} 
                scrollEnabled={false} 
                ref='base'
                rightButton={this.renderRightButton()}
                title={{ title: this.props.params.activityNm, tintColor: '#333333', fontSize: 18 }}
             >
            <RefreshableListView
                style={{backgroundColor:'#F4F3F3'}}
        				ref="list"
                listWidth={fullWidth}
        				autoRefresh={true}
        				fetchData={this.fetchData.bind(this)}
        				renderRow={this.renderRow}
                renderHeader={this.renderHeader}
                contentContainerStyle={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',alignItems:'flex-start',}}
      			/>
        </BaseView>
        )
    }
}
