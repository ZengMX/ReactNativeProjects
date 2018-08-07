import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView,
	PixelRatio
} from 'react-native';

import { BaseView } from 'future/public/widgets';
import styles from '../styles/Detail'
class Item extends Component {
	constructor(props) {
		super(props)
	}
	
	render() {
		if(this.props.currentPage == 0) {
			var style = this.props.leftTitle == '支出金额' ? styles.payTitle : styles.getTitle;
			var textColor = this.props.leftTitle == '收入金额' ? styles.saveTitle : style;
		}else {
			var style = this.props.rightTitle.indexOf('-￥') !== -1 ? styles.payTitle : styles.getTitle;
			var textColor = this.props.rightTitle === '待审核' ? styles.waitTitle : style;

		}
		return (
			<View style={styles.wrap}>
				<View style={styles.view}>
					<Text style={styles.rightTitle} numberOfLines={1}>{this.props.leftTitle}</Text>
					<Text style={textColor}>{this.props.rightTitle}</Text>
				</View>
			</View>
		)
	}
}

export default class Detail extends Component {
	constructor(props) {
		super(props);
	}
	formatNumber(num) {
		if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(num)) {
			return num;
		}
		var a = RegExp.$1, b = RegExp.$2, c = RegExp.$3;
		var re = new RegExp("(\\d)(\\d{3})(,|$)");
		while (re.test(b)) b = b.replace(re, "$1,$2$3");
		return a + "" + b + "" + c;
	}
	render() {
		if(this.props.params.currentPage == 1){
			var userBank = this.props.params.data.bankCode+'('+ this.props.params.data.bankAccount.substr(12)+ ')';
		}else {
			var transactionAmount = this.formatNumber(parseFloat(this.props.params.data.transactionAmount.toFixed(2)));
			transactionAmount = this.props.params.data.transactionAmount > 0 ? '+￥' + transactionAmount : '-￥' + transactionAmount.toString().substr(1);
		}
		return (
			<BaseView
				mainBackColor={{ backgroundColor: '#f5f5f5' }}
				ref={'base'}
				navigator={this.props.navigator}
				mainColor={'rgba(250,250,250,0.90)'}
				title={{ title: '交易详情', tintColor: '#333', fontSize: 18 }}
			>
				<ScrollView style={styles.scrollView}>
					{
						this.props.params.currentPage == 0 ? 
						<View>
							<Item leftTitle={this.props.params.data.reason} currentPage={this.props.params.currentPage} />
							<Item leftTitle={this.props.params.data.transactionAmount > 0 ? '收入金额' : '支出金额'} rightTitle={transactionAmount} currentPage={this.props.params.currentPage} />
							<Item leftTitle={'交易类型'} rightTitle={this.props.params.data.transactionAmount > 0 ? '收入' : '支出'} currentPage={this.props.params.currentPage} />
							<Item leftTitle={'交易时间'} rightTitle={this.props.params.data.transactionTime} currentPage={this.props.params.currentPage} />
							<Item leftTitle={'余额'} rightTitle={'￥' + this.props.params.data.endAmount.toFixed(2)} currentPage={this.props.params.currentPage} />
						</View>
						:
						<View>
							<Item leftTitle={'支出金额'} rightTitle={'-￥' + this.props.params.data.amount} currentPage={this.props.params.currentPage} />
							<Item leftTitle={'交易类型'} rightTitle={'提现'} currentPage={this.props.params.currentPage} />
							<Item leftTitle={'处理进度'} rightTitle={this.props.params.data.approveStat} currentPage={this.props.params.currentPage} />
							<Item leftTitle={'提现到'} rightTitle={userBank} currentPage={this.props.params.currentPage} />
							<Item leftTitle={'提现原因'} rightTitle={this.props.params.data.reason} currentPage={this.props.params.currentPage} />
							<Item leftTitle={'交易时间'} rightTitle={this.props.params.data.createDateString} currentPage={this.props.params.currentPage} />
							<Item leftTitle={'余额'} rightTitle={'￥' + this.props.params.data.transactionEndAmount} currentPage={this.props.params.currentPage} />
						</View>
					} 		
				</ScrollView>
			</BaseView>
		)

	}
}