import React, { Component } from 'react';

import BMKMapView from '@imall-test/react-native-baidu-map';//地图
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';

export default class ShopMapDetail extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		console.log('this.props.params.getCoor', this.props.params.getCoor);
		console.log('this.props.params.mapUseType', this.props.params.mapUseType);
		console.log('this.props.params.annotations', this.props.params.annotations);
	}


	render() {
		return (
			<BaseView ref={base => this.base = base}
				navigator={this.props.navigator}
				title={{ title: '附近的商家', tintColor: '#fff' }} >
				<BMKMapView
					mapType={1}                                //地图的模式，有卫星地图，普通地图
					zoomEnabled={true}                         //是否支持地图缩放
					googleLocation={this.props.params.getCoor} //传入Google地图坐标进行转换
					mapUseType={this.props.params.mapUseType}  //路线使用类型
					zoomLevel={18}                             //设置地图缩放的层级
					annotations={this.props.params.annotations}//传入多点地理坐标
					showsUserLocation={true}                   //是否开启定位，开启定位后自动定位到用户所在地点
					ref='map'
					style={{ flex: 1, height: Styles.theme.H - 64, backgroundColor: '#333' }} />
			</BaseView>
		);
	}
}


