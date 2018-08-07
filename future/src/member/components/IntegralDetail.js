import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView,
	PixelRatio
} from 'react-native';

import { BaseView } from 'future/public/widgets';
import styles from '../styles/Detail';

class Item extends Component {
	constructor(props) {
		super(props)
	}
	render() {
		var reasonColor = this.props.reason ? {fontSize: 12} : null;
		var style = this.props.leftTitle == '支出' ? styles.payTitle : styles.getTitle;
		var textColor = this.props.leftTitle == '收入' ? styles.saveTitle : style;
		return (
			<View style={styles.wrap}>
				<View style={styles.view}>
					<Text style={styles.rightTitle} numberOfLines={this.props.reason === 0 ? 2 :1}>{this.props.leftTitle}</Text>
					<Text style={textColor}>{this.props.rightTitle}</Text>
				</View>
			</View>
		)
	}
}

export default class IntegralDetail extends Component {
	constructor(props){
		super(props);
	}

	render() {
		let transactionAmount = this.props.params.data.transactionAmount > 0 ? '+' + this.props.params.data.transactionAmount : this.props.params.data.transactionAmount;
		let title = this.props.params.data.transactionAmount > 0 ? '收入' : '支出';
		return (
			<BaseView
				mainBackColor={{ backgroundColor: '#f5f5f5' }}
				ref={'base'}
				navigator={this.props.navigator}
				mainColor={'rgba(250,250,250,0.90)'}
				title={{ title: '交易详情', tintColor: '#333', fontSize: 18 }}
			>
				<ScrollView style={styles.scrollView}>
					<Item leftTitle={this.props.params.data.reason} reason={0}/>
					<Item leftTitle={title} rightTitle={transactionAmount} /> 
					<Item leftTitle={'交易类型'} rightTitle={title} />
					<Item leftTitle={'交易时间'} rightTitle={this.props.params.data.transactionTime}/>
					<Item leftTitle={'余额'} rightTitle={this.props.params.data.endAmount}/>
				</ScrollView>
			</BaseView>
		)
	}
}