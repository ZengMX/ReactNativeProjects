/**
 * Created by timhuo on 2017/6/19.
 */
'use strict';
import React, {Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	InteractionManager,
} from 'react-native';
import NavBar from "../../../public/widgets/nav/NavBar";
import RefreshableListView from "../../../public/widgets/listview/RefreshableListView";
import {sizeToFit} from "../../../public/widgets/line/sizeToFix";
import Line from "../../../public/widgets/line/Line";
import PurchaseDetailList from "./PurchaseDetailList";
import Fetch from "../../../public/lib/Fetch";
import * as Toast from "../../../public/widgets/toast/index";
import PurchaseAdding from "./PurchaseAdding";
import {PurchaseTitleEdit} from "./PurchaseEdit";
import MDataController from "../../../public/widgets/controller/MDataController";
const moment = require('moment');

export default class PurchaseList extends Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			loading: null,
		};
		
		this.openComponent = this.openComponent.bind(this);
		this.fetchData = this.fetchData.bind(this);
		this.gotoDetail = this.gotoDetail.bind(this);
		this.gotoEdit = this.gotoEdit.bind(this);
	}
	
	openComponent(component, params) {
		if (component === null) {
			return;
		}
		this.props.navigator.push({
			component: component,
			params: params
		});
	};
	
	fetchData(page, success, error) {
		
		InteractionManager.runAfterInteractions(() => {
			new Fetch({
				url: 'app/fastBuy/purchaseTemplateList.json',
			}).dofetch().then((data) => {
				this.setState({loading: ['1']});
				
				let result = data.result.reverse();
				let length = data.result.length;
				success(result, 10 * (page - 1) + length, length);
			}).catch((error) => {
				this.setState({loading: ['1']});
				
				Toast.show('网络异常');
				console.log('catch: ', error);
			});
		});
		
	}
	
	gotoDetail(purid, title) {
		this.props.navigator.push({
			component: PurchaseDetailList,
			params: {
				purid: purid,
				title: title,
				reloadCallBack: () => {
					this.refs.list && this.refs.list.reloadData();
				},
			}
		})
	}
	
	gotoEdit(purid, rowIndex) {
		this.props.navigator.push({
			component: PurchaseAdding,
			params: {
				purid: purid,
				reloadCallBack: () => {
					this.refs.list && this.refs.list.reloadData();
				},
				callback: (title, detail) => {
					let rows = [].concat(this.refs.list.getRows());
					let tempRow = Object.assign({}, rows[rowIndex], {templateNm: title, remarks: detail});
					rows[rowIndex] = tempRow;
					this.refs.list && this.refs.list.setRows(rows);
				},
				delCallBack: (purid) => {
					let rows = [].concat(this.refs.list.getRows());
					let tempRow = -1;
					rows.map((data, index) => {
						if (data.purchaseTemplateId === purid) {
							tempRow = index;
						}
					});
					if (tempRow !== -1) {
						rows.splice(tempRow, 1)
					}
					this.refs.list && this.refs.list.setRows(rows);
				}
			}
		})
	}
	
	renderRow(rowData, title, index) {
		return (
			<TouchableOpacity activeOpacity={0.75} onPress={() => {
				this.gotoDetail(rowData.purchaseTemplateId, rowData.templateNm)
			}}>
				<View style={{height: sizeToFit(158), marginBottom: 10, backgroundColor: "#fff"}}>
					<Text style={styles.rowTitleStyle}>{rowData.templateNm}</Text>
					<Text style={styles.rowDetailStyle}>{rowData.remarks}</Text>
					<Line style={{marginTop: sizeToFit(18), marginLeft: sizeToFit(13), width: sizeToFit(290)}}/>
					<View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
						<View style={{flex: 1}}>
							<View style={{flexDirection: 'row', marginLeft: sizeToFit(15), alignItems: 'center'}}>
								<Image source={require('../res/008naozhon.png')} style={styles.rowDateIconStyle} resizeMode='stretch'/>
								<Text style={styles.rowDateStyle}>{rowData.noticeDateString}</Text>
							</View>
							<Text style={[styles.rowCountStyle, {marginLeft: sizeToFit(15), marginTop: sizeToFit(9.5)}]}>共
								<Text style={styles.rowCount2Style}>{rowData.itemCount}</Text>
								种
								<Text style={styles.rowCount2Style}>{rowData.productCount}</Text>
								件商品
							</Text>
						</View>
						<TouchableOpacity activeOpacity={0.75} onPress={() => {
							this.gotoEdit(rowData.purchaseTemplateId, index)
						}}>
							<View style={{margin: 20, flexDirection: 'row', alignItems: 'center'}}>
								<Image source={require('../res/008shezhi.png')}
								       style={[styles.rowDateIconStyle, {width: 18, height: 18}]} resizeMode='stretch'/>
								<Text style={{color: "#082342"}}>设置</Text>
							
							</View>
						</TouchableOpacity>
					
					</View>
				</View>
			</TouchableOpacity>
		)
	}
	
	render() {
		return (
			<View style={{flex: 1, backgroundColor: '#fff',}}>
				<NavBar navigator={this.props.navigator}
				        leftBtnStyle={{width: 10, height: 17, tintColor: '#444'}}
				        title={{title: '采购计划', style: {fontSize: 18}, tintColor: '#333333'}}
				        mainColor={'#fafafa'}
				        rightButton={
					        <View style={{alignSelf: 'center', marginRight: 10}}>
						        <TouchableOpacity onPress={() => {
							        let params = {
								        callback: (title, detail) => {
									        this.refs.list && this.refs.list.reloadData();
								        }
							        };
							        this.props.navigator.push({
								        component: PurchaseTitleEdit,
								        params: params,
							        });
						        }}>
							        <Text style={styles.leftBtnStyle}>添加</Text>
						        </TouchableOpacity>
					        </View>
				        }
				/>
				<Line />
				<View style={{flex: 1}}>
					<RefreshableListView
						ref="list"
						style={{backgroundColor: "#f5f5f5"}}
						pageSize={5}
						initialListSize={5}
						autoRefresh={true}
						autoLoadMore={false}
						fetchData={this.fetchData}
						renderRow={this.renderRow.bind(this)}
					/>
					<MDataController
						style={{
							position: 'absolute',
							top: 0,
							bottom: 0,
							left: 0,
							right: 0,
							backgroundColor: 'white'
						}}
						data={this.state.loading}
					/>
				</View>
			
			</View>
		);
	}
}

const styles = StyleSheet.create({
	leftBtnStyle: {
		fontSize: 16,
		color: "#444",
	},
	rowTitleStyle: {
		marginTop: sizeToFit(17),
		marginLeft: sizeToFit(15),
		fontSize: sizeToFit(16),
		color: "#333",
	},
	rowDetailStyle: {
		marginTop: sizeToFit(13),
		marginLeft: sizeToFit(15),
		fontSize: sizeToFit(13),
		color: "#666",
	},
	rowDateStyle: {
		fontSize: sizeToFit(14),
		color: "#333",
	},
	rowDateIconStyle: {
		marginRight: sizeToFit(7),
		width: 13,
		height: 15,
	},
	rowCountStyle: {
		fontSize: sizeToFit(14),
		color: "#333",
	},
	rowCount2Style: {
		fontSize: sizeToFit(14),
		color: "orange",
	}
});