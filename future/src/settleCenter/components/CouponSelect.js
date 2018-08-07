import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ListView
} from 'react-native';
import { Fetch } from 'future/public/lib';
import {
	BaseView,
	Toast,
	Loading,
} from 'future/public/widgets';

export default class CouponSelect extends Component {
    constructor(props) {
        super(props);
        this.renderRow = this._renderRow.bind(this);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            theSelectCouponId:-1,
            dataSource: ds.cloneWithRows([]),
            dataArr:[]
        }
    }

    componentDidMount(){
        //加载优惠券数据
		this.fetchData()
    }

    _selectTheCoupon(index){
        // console.log('data前',this.state.dataArr)
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if(this.state.dataArr[index].isSelect == 'Y'){
            this.state.dataArr[index].isSelect = 'N';
        } else {
            this.state.dataArr[index].isSelect = 'Y';
            for(var i=0;i<this.state.dataArr.length;i++){
                if(i!=index){
                    this.state.dataArr[i].isSelect = 'N';
                }
            }
        }
        // console.log('data后',this.state.dataArr)
        this.setState({
            dataSource:ds.cloneWithRows(this.state.dataArr) 
        })
        
    }

    _doSelectCouponRequire(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        // let rows = [].concat(this.refs.list.getRows());
        let selectCount = 0;
        let couponId = 0;
        for(var i=0;i<this.state.dataArr.length;i++){
            if(this.state.dataArr[i].isSelect === 'Y'){
                selectCount++;
                couponId = this.state.dataArr[i].couponId;
            }
        }

        if(selectCount>0){
            this.useCoupon(couponId)
        } else {
            this.cancelUseCoupon(this.state.theSelectCouponId)
        }
    }
//使用所选优惠券
    useCoupon(couponId){
		this.refs.baseview.showLoading();
        new Fetch({
			url: 'app/couponFront/useCoupon.json',
			method: 'POST',
			data: {
				type: this.props.params.type || 'normal',
                orgId: this.props.params.orgId,
                couponId: couponId
			},
		}).dofetch().then((data) => {
			// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>',data);
			this.refs.baseview.hideLoading();
			if(data.success){
                this.props.navigator.pop();
                this.props.params.callBack&&this.props.params.callBack();
            }

		}).catch((error) => {
			console.log('获取数据失败:', error);
		}).finally(() => {
			console.log('>>>>over');
			this.refs.baseview.hideLoading();
		});
    }
//取消使用某优惠券
    cancelUseCoupon(couponId){
		this.refs.baseview.showLoading();
        new Fetch({
			url: 'app/couponFront/cancelUseCoupon.json',
			method: 'POST',
			data: {
				type: this.props.params.type || 'normal',
                orgId: this.props.params.orgId,
                couponId: couponId
			},
		}).dofetch().then((data) => {
			// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>',data);
			this.refs.baseview.hideLoading();
			if(data.success){
                this.props.navigator.pop();
                this.props.params.callBack&&this.props.params.callBack();
            }

		}).catch((error) => {
			this.refs.baseview.hideLoading();
			console.log('获取数据失败:', error);
		}).finally(() => {
			console.log('>>>>over');
			this.refs.baseview.hideLoading();
		});
    }

    _renderRow(rowData, sectionID, rowID, highlightRow){
        return(
            <View style={{width:SCREENWIDTH,alignItems:'center',backgroundColor:'rgba(255,255,255,0)'}}>
                <TouchableOpacity style={{marginTop:10}} onPress={this._selectTheCoupon.bind(this,rowID)}>
                    <View style={{width:SCREENWIDTH-20,flexDirection:'row'}}>
                        <Image 
                        resizeMode={'contain'} 
                        source={require('../res/SettleCenter/000yhq001.png')}/>
                        <View style={{flex:1,height:120,backgroundColor:'#fff',paddingRight:15}}>
                            <Text style={{fontSize:14,color:'#545F6C',marginTop:14}}>{rowData.batchNm}</Text>
                            <Text style={{fontSize:12,color:'#A4ACB6',marginTop:5}}>{rowData.startTimeString}-{rowData.endTimeString}</Text>
                            <Image 
                            source={rowData.isSelect==='N'?
                            require('../res/SettleCenter/gouxuan.png'):
                            require('../res/CashierDesk/000gouxuan_s.png')}
                            style={{position:'absolute',right:20,bottom:10,width:19,height:19}}/>
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

    fetchData() {
        new Fetch({
			url: 'app/couponFront/findUserCoupon.json',
			data: {
                orgId:this.props.params.orgId,
                type:this.props.params.type
            }
		}).dofetch().then((data) => {
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
			if (data.success) {
                for(var i=0;i<data.result.length;i++){
                    if(data.result[i].isSelect === 'Y'){
                        this.state.theSelectCouponId = data.result[i].couponId;
                    }
                }
                this.setState({
                    dataSource:ds.cloneWithRows(data.result),
                    dataArr:data.result
                })
            }
		}).catch((error) => { console.log('error', error) })
    }

    render(){
        return(
            <BaseView
				ref='baseview'
				navigator={this.props.navigator}
				title={{ title: '使用优惠券', tintColor: '#333', fontSize: 18 }}
                mainBackColor={{backgroundColor:'rgba(244,243,243,1.0)'}}
			>
            <ListView 
                contentContainerStyle={{paddingTop:10}}
                enableEmptySections={true}
				ref='list'
				showsVerticalScrollIndicator={false}
				scrollRenderAheadDistance={100}
			    onEndReachedThreshold={200}
				contentInset={{ bottom: 0 }}
				initialListSize={1}
                dataSource={this.state.dataSource}
				renderRow={this.renderRow}/>
            <TouchableOpacity 
            onPress={this._doSelectCouponRequire.bind(this)}
            style={{width:SCREENWIDTH,height:50,backgroundColor:'#34457D',justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:16,color:'#fff'}}>确定</Text>
            </TouchableOpacity>
            </BaseView>
        )
    }
}
