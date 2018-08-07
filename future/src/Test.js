import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	PixelRatio,
} from 'react-native';
import { BaseView } from 'future/public/widgets';
import Fillinfor from 'future/src/member/components/Fillinfor';
import FillinforCompletes from 'future/src/member/components/FillinforCompletes';
import FillContactorInfos from 'future/src/member/components/FillContactorInfos';
import FillEnterpriseInfos from 'future/src/member/components/FillEnterpriseInfos';
import FillBankAcountInfo from 'future/src/member/components/FillBankAcountInfo';
import FillInvoiceInfos from 'future/src/member/components/FillInvoiceInfos';
import PrefeStepComplete from 'future/src/submitResult/components/PrefeStepComplete';
import SuccessPage from 'future/src/submitResult/components/SuccessPage';
import FailPage from 'future/src/submitResult/components/FailPage';
import BaseInfor from 'future/src/member/components/BaseInfor';
import GetCoupon from '../src/stocksList/components/GetCoupon';
import Comment from "../src/product/components/comment"

import PubilishComment from '../src/order/components/PublishComment';

import CommentList from 'future/src/product/components/CommentList';
import BuyerCoupons from 'future/src/member/components/BuyerCoupons';
import MySupplier from 'future/src/member/components/MySupplier';

export default class Test extends Component {
	constructor(props) {
		super(props);
	}
	//跳转到详情
	open(param,params) {
		if (this.props.navigator) {
			this.props.navigator.push({
				component: param,
				params:params
			})
		}
	}
	render() {
		return (			
			<BaseView
				mainBackColor={{ backgroundColor: '#f5f5f5' }}
				ref={'base'}
				navigator={this.props.navigator}
				mainColor={'rgba(250,250,250,0.90)'}
				title={{ title: 'test', tintColor: '#333', fontSize: 18 }}
				statusBarStyle={'default'}
			>
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<TouchableOpacity onPress={() => { this.open(BaseInfor)}}>
						<Text>基础信息界面</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => { this.open(Fillinfor) }}>
						<Text>填写资料</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => { this.open(FillEnterpriseInfos) }}>
						<Text>填写企业信息资料</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => { this.open(FillContactorInfos) }}>
						<Text>联系人信息</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => { this.open(FillBankAcountInfo) }}>
						<Text>银行信息</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => { this.open(FillInvoiceInfos) }}>
						<Text>发票信息</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => { 
						this.open(PrefeStepComplete,{
							title:'提交资料',
							returnTitle:'返回上一步',
							resultContent:'抱歉，提交失败！',
							reason:'网络异常，提交未成功，请返回提交'
						}) }}>
						<Text>结果页面</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => { this.open(GetCoupon) }}>
						<Text>领券爽</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => { this.open(Comment,{productId:25}) }}>
						<Text>评价</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => { this.open(PubilishComment) }}>
						<Text>发表评价</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => { this.open(CommentList) }}>
						<Text>我的评价列表</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => { this.open(BuyerCoupons) }}>
						<Text>我的优惠券</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => { this.open(SuccessPage) }}>
						<Text>成功结果页</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => { this.open(FailPage) }}>
						<Text>失败结果页</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => { this.open(MySupplier,{sysUserId:50004}) }}>
						<Text>我的供应商</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => { this.open(FillinforCompletes,{buyersId:49}) }}>
						<Text>资料中心</Text>
					</TouchableOpacity>
				</View>
						
			</BaseView>
		)
	}
}