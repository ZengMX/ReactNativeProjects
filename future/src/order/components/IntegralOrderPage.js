import React, { Component } from 'react';
import {
    Text,
    Image,
    TouchableOpacity,
    View,
    TextInput,
    ScrollView,
    Platform,
    PixelRatio,
    InteractionManager,
	Alert,
} from 'react-native';
import Fetch from 'future/public/lib/Fetch';
import {
    BaseView,
    Toast,
    Alerts,
    TextInputC,
    ImageUploader,
    ItemPicker,
    PopModal,
    ImageUtil,
    RXUtil,
    RefreshableListView,
	Loading,
} from 'future/public/widgets';
import styles from '../styles/IntegralOrderPage';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollableTabBar from 'future/public/commons/ScrollableTabBar';
import IntegralOrderDetail from './IntegralOrderDetail';
var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;
export default class IntegralOrderPage extends Component {
    constructor(props) {
        super(props);
        // 订单选择项 全部订单-0, 团购订单-1, 积分订单-2,  同城送订单-3,礼品卡订单-4
        this.promotionTypes = ["积分订单", "普通订单", "团购订单", "同城送订单", "礼品卡订单"];
        this.onChangeTab = this._onChangeTab.bind(this);
        this._onSelect = this._onSelect.bind(this);
        this._showCustom = this._showCustom.bind(this);
        this._hideCustom = this._hideCustom.bind(this);
        this._search = this._search.bind(this);
        this.tabs = [
            { lab: "全部", params: 0 },
            { lab: "待发货", params: 1 },
            { lab: "待收货", params: 2 },
            { lab: "已完成", params: 3 },
        ];
    }
    componentDidMount() {

    }
    _showCustom() {
        this.refs.itemPicker && this.refs.itemPicker.show();
    }
    _hideCustom() {
        this.refs.popModal && this.refs.popModal.hide();
    }
    _search() {

    }

    _onSelect(data) {

    }
    _showConfirm(title, content, callback) {

    }
    _onChangeTab({ i, ref, from }) {
        if (i !== from) {
            InteractionManager.runAfterInteractions(() => {
                this.refs[ref.ref].reloadList(i);
            })
        }
    }
    _showPicker() {

    }
	// 保留原来写法，万一以后要改回来呢
	/*_renderHead() {
		return (
			<TouchableOpacity onPress={this._showCustom} >
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text style={{ fontSize: 16, color: "#000" }}>{this.promotionTypes[0]}</Text>
					<Image source={require('../res/IntegralOrderPage/001xiala.png')} style={{ marginLeft: 5 }} />
				</View>
			</TouchableOpacity>
		);
	}*/

    render() {
		
        return (
            <View style={{ flex: 1 }}>
                <BaseView
                    mainBackColor={{ backgroundColor: '#f4f3f3' }}
                    mainColor={'#f5f5f5'}
                    statusBarStyle={'default'}
                    navigator={this.props.navigator}
                    title={{ title: '积分订单', tintColor: '#333', fontSize: 18 }}  >

                    <ScrollableTabView
                        ref='scrollableTabView'
                        initialPage={0}
                        onChangeTab={this.onChangeTab}
                        renderTabBar={() => (
                            <ScrollableTabBar
                                underlineStyle={{ height: 2, width: 30 }}
                                tabStyle={{
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    height: 45,
                                    width: screenWidth / 4,
                                    alignItems: 'center',
                                    backgroundColor: '#FAFAFA'
                                }}
                                style={{
                                    height: 45,
                                    borderBottomWidth: 1 / PixelRatio.get(),
                                }}

                            />
                        )}
                    >
                        {
                            this.tabs.map((tab, i) => {
                                return <List
                                    ref={"list_" + i}
                                    i={i}
                                    key={i}
                                    tabLabel={tab.lab}
                                    navigator={this.props.navigator} />;
                            })
                        }
                    </ScrollableTabView>
                </BaseView >
                <ItemPicker
                    ref="itemPicker"
                    cancelText={'取消'}
                    pickerConfirmBtnColor={'#2CBA75'}
                    pickerCancelBtnColor={'#2CBA75'}
                    titleText={'订单选择'}
                    confirmText={'确定'}
                    dataSource={this.promotionTypes}
                    onPickerConfirm={(selectedData) => {
                        if (Platform.OS === 'ios' && selectedData == 0) {
                            this._onSelect(this.promotionTypes[0]);
                        } else {
                            this._onSelect(selectedData[0]);
                        }
                    }}
                    onPickerCancel={() => {
                    }}
                />
            </View>
        );
    }
}
class List extends Component {
    constructor(props) {
        super(props);
        this.requestParam = {}
        this.IntegralOrderParams = {};
        this.IntegralOrderParams.isSent = '';
        this.IntegralOrderParams.isBuyerSigned = '';
        this.requestParam.pageNumber = 1;
        this.requestParam.pageSize = 10;

        this._fetchData = this._fetchData.bind(this);
        this.renderRow = this._renderRow.bind(this);
        this._comfirOroder = this._comfirOroder.bind(this);
        this.isInit = false;
    }
    componentDidMount() {
        if (this.props.i == 0 && !this.isInit) {
            InteractionManager.runAfterInteractions(() => {
                this.refs.list && this.refs.list.pullRefresh();
                setTimeout(() => { this.isInit = true; }, 100);
            });
        }
    }
    _comfirOroder(data, index) {
		
		Alert.alert(
			'温馨提示',
			"确认收货？",
			[
				{text: '取消', onPress: () => {} },
				{text: '确定', onPress: () => {
					Loading.show();
					new Fetch({
						url: 'app/integralOrder/buyerSigned.json',
						data: {
							integralOrderId: data.integralOrderId
						}
					}).dofetch().then((data) => {
						Loading.hide();
						//更新listview
						let newRows = [].concat(this.refs.list.getRows());
						newRows.splice(index, 1);
						this.refs.list.setRows(newRows);
					}).catch((err) => {
						console.log(err)
						Loading.hide();
					});
					
				}},
			]
		);
		
    }
    reloadList(data) {
        switch (data) {
            case 0: //全部
                this.IntegralOrderParams.isSent = '';
                this.IntegralOrderParams.isBuyerSigned = '';
                break;
            case 1://待发货
                this.IntegralOrderParams.isSent = 'N';
                this.IntegralOrderParams.isBuyerSigned = '';
                break;
            case 2://待收货
                this.IntegralOrderParams.isSent = 'Y';
                this.IntegralOrderParams.isBuyerSigned = 'N';
                this.IntegralOrderParams.searchFieId = null;
                break;
            case 3://已完成
                this.IntegralOrderParams.isSent = 'Y';
                this.IntegralOrderParams.isBuyerSigned = 'Y';
                break;
        }
        InteractionManager.runAfterInteractions(() => {
            this.refs.list && this.refs.list.pullRefresh();
        });
    }
    _onListItemsPress(rowData) {
        console.log(">>>>>>>>>>>>",rowData);
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                component: IntegralOrderDetail,
                params: {
                  data:rowData
                }
            })
        }
    }
    _fetchData(page, success, error) {
        this.requestParam.pageNumber = page || 1;
        //订单类型
        let datas = Object.assign({}, this.requestParam, this.IntegralOrderParams);
        console.log('_fetchData', datas);
        new Fetch({
            url: 'app/integralOrder/integralOrderPage.json',
            data: datas
        }).dofetch().then((data) => {
            success(data.result.result, (page - 1) * 10 + data.result.result.length, data.result.totalCount);
        }).catch((err) => {
            console.log(err)
        });
    }
    _renderRow(rowData, sectionID, rowID, highlightRow) {
		
        var hasConfirmBtn = false;
        
        if (rowData.orderStat != undefined && rowData.orderStat === '待收货') {
			hasConfirmBtn = true;
        } else {
            hasConfirmBtn = false;
        }
        let orderItemVoList = rowData.orderItemVoList.length > 0 ? rowData.orderItemVoList[0] : [];
        return (  
            <TouchableOpacity
                style={{
                    width: screenWidth,
                    marginTop: 10
                }}
                onPress={() => { this._onListItemsPress(rowData) }}
            >
				<View style={{width: screenWidth, height: 139}}>
					<View style={{ width: screenWidth, height: 40, paddingHorizontal: 12, justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', flexDirection: "row" }}>
						<Text style={{ fontSize: 12, color: '#444' }}>订单号：{rowData.orderNum}</Text>
						<Text style={{ fontSize: 13, color: '#FF6600' }}>{rowData.orderStat}</Text>
					</View>
					<View style={{ width: screenWidth, height: 53.5, paddingHorizontal: 12, justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAFAFA', flexDirection: "row" }}>
						<Text style={{ fontSize: 14, color: '#333', flex: 1, marginRight: 12 }}>{orderItemVoList.integralProductNm}</Text>
						<Text style={{ fontSize: 12, color: '#8495A2', }}>x{orderItemVoList.num}</Text>
					</View>
					<View style={{ width: screenWidth, height: 46, paddingHorizontal: 12, backgroundColor: '#fff', flexDirection: "column", paddingTop: 10 }}>
						<View style={{ height: 23, flexDirection: "row", justifyContent: 'flex-end', backgroundColor: "#fff", alignItems: 'center' }}>
							<Text style={{ fontSize: 12, color: '#8495A2' }}>商品数量  {rowData.totalNum}</Text>
							<Text style={{ fontSize: 12, color: '#8495A2' }}>  应付总积分：</Text>
							<Text style={{ fontSize: 16, color: '#333' }}>{rowData.totalIntegral}</Text>
						</View>
					</View>
				</View>
				{ hasConfirmBtn ? (
						<View
							
							style={{
								width: screenWidth,
								height: 40,
								backgroundColor: "#fff",
								flexDirection: 'row',
								justifyContent: "flex-end",
								alignSelf: 'flex-end',
								paddingHorizontal: 12
							}}
						>
							<TouchableOpacity style={{
								width:70,
								height:28,
								backgroundColor:'#fff',
								marginLeft:13,
								borderWidth:2/PixelRatio.get(),
								borderColor:'#0082FF',
								flexDirection:'row',
								justifyContent:'center',
								alignItems:'center'
							}}
								onPress={() => { this._comfirOroder(rowData, rowID) }}>
								<Text style={{ fontSize: 13, color: '#0082FF' }}>确认收货</Text>
							</TouchableOpacity>
						</View>
					) : null }
                
            </TouchableOpacity>
        );
    }
    render() {
        return (
            <RefreshableListView
                ref="list"
                autoRefresh={false}
                style={{ flex: 1 }}
                fetchData={this._fetchData}
                renderRow={this.renderRow}
            />
        );
    }
}


