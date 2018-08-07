import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	View,
	ScrollView,
	Dimensions,
	Text,
	Image,
	TouchableOpacity,
	Platform,
	TouchableHighlight,
	InteractionManager,
	PixelRatio,
	Alert,StyleSheet

} from 'react-native';
var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;
import _ from 'underscore';
import Fetch from 'future/public/lib/Fetch';
import { BaseView, MaskModal, RefreshableListView, Toast, TextInputC, DatePicker } from 'future/public/widgets';
import List from './List';

class OrderSearch extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<BaseView navigator={this.props.navigator} 
					title={{ title: '搜索结果', tintColor: '#333333', style: { fontSize: 18 } }}
					leftBtnStyle={{width:10,height:17,tintColor:'#444444'}}	
					statusBarStyle={'default'}
				>
				<List 
					params={{status:null, extraParams: this.props.params.extraParams, }}
					navigator={this.props.navigator} sysUserId={this.props.userInfo.sysUserId} />
			</BaseView>)
	}
}

function mapStateToProps(state) {
	return {
		// isLogin: state.user.isLogin,
		userInfo: state.Member.userInfo,
		//isLogin: state.Member.isLogin,		
	};
}

export default connect(mapStateToProps)(OrderSearch);

const styles = StyleSheet.create({
	itemContainer:{
		alignItems: 'center', flexDirection: 'row',height:60,
	}
})