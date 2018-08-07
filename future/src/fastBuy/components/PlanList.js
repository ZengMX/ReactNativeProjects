import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    PixelRatio,
    ListView,
    TouchableOpacity,
	InteractionManager
} from 'react-native';
import DeviceEventEmitter from 'RCTDeviceEventEmitter';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import * as planActions from '../actions/PurchasePlan';
import { RefreshableListView, BaseView } from '../../widgets';
import Fetch from 'future/src/lib/Fetch';
import EditPurchasePlan from './EditPurchasePlan';
import AddPurchasePlan from './AddPurchasePlan';
import SetPurchasePlan from './SetPurchasePlan';
import PurchasePlanPrdList from "./PurchasePlanPrdList";

var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;

export default class PurchasePlanList extends Component {
    constructor(props) {
        super(props);
        this.fetchData = this._fetchData.bind(this);
        this.renderRow = this._renderRow.bind(this);
        // let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        
    }
    componentWillMount() {
    }
    componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.refs.list &&  this.refs.list.pullRefresh && this.refs.list.pullRefresh();
		  	this.updateListener = DeviceEventEmitter.addListener('updatePlanSuccess', () => {
				this.refs.list && this.refs.list.reloadData();
			})
		});
    }

    componentWillUnmount() {
        this.updateListener && this.updateListener.remove();
    }

    _fetchData(page, success, error) {
        // this.props.actions.getPlanList(page,success, error);
        new Fetch({
            url: '/app/user/purchaseTemplatePage.json',
            method: 'POST',
            data: {
                page: page,
                pageSize: 10,
            }
        }).dofetch().then((data) => {
            if (data.result) {
                success(data.result, 10 * (page - 1) + data.result.length, data.totalCount)
            }
        }).catch((err) => {
			console.log('=> catch: ', err);
			error && error();
		});
    }

    showAlertSet(index) {
        
        // this.dataSource[Number(index)].isSelect = true;
        let rows = [].concat(this.refs.list.getRows());
        for (var i = 0; i < rows.length; i++) {
			let row = Object.assign({}, rows[Number(i)], { isSelect: i == index })
			if(i == index && rows[Number(i)].isSelect){
				row = Object.assign({}, rows[Number(i)], { isSelect: false })
			}
            rows[Number(i)] = row;
        }
        // console.log('MMMMMM', rows);
        this.refs.list && this.refs.list.setRows(rows);
    }

    goToEditPurchasePlan(data) {
        this.props.navigator.push({
            component: EditPurchasePlan,
            params: data
        })
    }

    goToEditPurchaseSet(data) {
        this.props.navigator.push({
            component: SetPurchasePlan,
            params: data
        })
    }

    goToPurchase(purchaseTemplateId, rowID){
		this.props.navigator.push({
			component : PurchasePlanPrdList,
			params : {
				purchaseTemplateId : purchaseTemplateId,
				index : rowID,
				resetPlanCount : (kindNum, count, index)=>{this.resetPlanCount(kindNum, count, index)},
				isFast : false
			}
		})
    }

	//重新设置指定位置数据
	resetPlanCount(kindNum, count, index){
		let rows = [].concat(this.refs.list.getRows());
		let row = Object.assign({}, rows[index]);
		row = Object.assign({}, row, { productType: kindNum });
		row = Object.assign({}, row, { productNum: count });
		rows[index] = row;
		this.refs.list.setRows(rows);
	}

    _renderRow(rowData, sectionID, rowID, highlightRow){
        console.log('laibin-------------------------------->',rowData)
        return <View style={styles.plancell_style}>
            <TouchableOpacity
			onPress={()=>{this.goToPurchase(rowData.purchaseTemplateId, rowID)}}>
                <View style={{ backgroundColor: '#fff', width: screenWidth - 30, paddingVertical: 15, paddingHorizontal: 14, borderRadius: 6 }}>
                    <Text style={styles.plancell_txt1}>{rowData.templateNm}</Text>
                    <Text style={styles.plancell_txt2}>{rowData.remarks ? rowData.remarks : '还没有任何描述...'}</Text>
                    <View style={styles.plancell_inline}></View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <Image style={{ width: 12, height: 14, marginTop: 10 }} source={require('../res/images/058shijian.png') }/>
                                <Text style={styles.plancell_txt3}>  {rowData.isEnableNotice == 'Y' ? rowData.lastNoticeDateString : '暂无设置提醒时间'}</Text>
                            </View>

                            <Text style={styles.plancell_txt4}>
                                共<Text style={{ color: '#EE7603' }}>{rowData.productType}</Text>
                                种<Text style={{ color: '#EE7603' }}>{rowData.productNum}</Text>
                                件商品
                            </Text>
                        </View>
                        <View style={{ width: 50, justifyContent: 'center', marginLeft: 0 }}>
                            <TouchableOpacity onPress={() => this.showAlertSet(rowID) }>
                                <Image style={{ width: 50, height: 35 }} source={require('../res/images/058gengduo.png') }/>
                            </TouchableOpacity>
                        </View>
                        {rowData.isSelect && <View style={{ left: screenWidth - 99 - 175, top: 3, position: 'absolute', width: 175, height: 45 }}>
                            <Image style={{ width: 175, height: 45, flexDirection: 'row', alignItems: 'center' }} source={require('../res/images/058beijing.png') }>
                                <TouchableOpacity onPress={this.goToEditPurchasePlan.bind(this, rowData) }>
                                    <View style={{ width: 85, height: 45, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Image source={require('../res/images/058bj.png') } style={{ width: 16, height: 15 }}/>
                                        <Text style={{ marginLeft: 5, color: '#fff', fontSize: 12, backgroundColor: 'rgba(0,0,0,0)' }}>编辑</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{ backgroundColor: '#000', width: 1, height: 17 }}/>
                                <TouchableOpacity onPress={this.goToEditPurchaseSet.bind(this, rowData) }>
                                    <View style={{ width: 85, height: 45, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Image source={require('../res/images/058shezhi.png') } style={{ width: 15, height: 17 }}/>
                                        <Text style={{ marginLeft: 5, color: '#fff', fontSize: 12, backgroundColor: 'rgba(0,0,0,0)' }}>设置</Text>
                                    </View>
                                </TouchableOpacity>
                            </Image>
                        </View>}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    }

    renderRightButton() {
        return <TouchableOpacity onPress={() => {
            this.props.navigator.push({
                component: AddPurchasePlan
            })
        } }>
            <Image source={require('../res/images/001jiahao.png') } style={{ width: 40, height: 50, marginTop: -5 }}/>
        </TouchableOpacity>
    }

    render() {
        return (
            <BaseView
                title={{ title: '采购计划', fontSize: 16, tintColor: '#fff' }}
                navigator={this.props.navigator}
                rightButton={this.renderRightButton() }>
                <RefreshableListView
                    navigator={this.props.navigator}
                    autoRefresh={false}
                    ref="list"
                    style={{ flex: 1 }}
                    fetchData={this.fetchData}
                    //dataSource={this.state.dataSource}
					scrollRenderAheadDistance={100} //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行。
					pageSize={10} // 每次事件循环（每帧）渲染的行数。
					initialListSize={0}
					onEndReachedThreshold={200}
					renderRow={this.renderRow.bind(this)}
					stickyHeaderIndices={[]}/>
            </BaseView>
        )
    }
}

const styles = StyleSheet.create({
    plancell_style: {
        paddingVertical: 7,
        paddingHorizontal: 15
    },
    plancell_txt1: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    plancell_txt2: {
        fontSize: 10, color: '#333',
        marginTop: 10
    },
    plancell_inline: {
        flex: 1,
        height: 1 / PixelRatio.get(),
        backgroundColor: '#e5e5e5',
        marginTop: 10
    },
    plancell_txt3: {
        fontSize: 13,
        color: '#333',
        marginTop: 10
    },
    plancell_txt4: {
        fontSize: 12,
        color: '#666',
        marginTop: 10
    },
})

// export default connect(mapStateToProps, mapDispatchToProps)(PurchasePlanList);

