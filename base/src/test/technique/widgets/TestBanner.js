import React, { Component } from 'react';

var sliderImgs = [
	'http://c.hiphotos.baidu.com/image/w%3D310/sign=0dff10a81c30e924cfa49a307c096e66/7acb0a46f21fbe096194ceb468600c338644ad43.jpg',
	'http://a.hiphotos.baidu.com/image/w%3D310/sign=4459912736a85edffa8cf822795509d8/bba1cd11728b4710417a05bbc1cec3fdfc032374.jpg',
	'http://e.hiphotos.baidu.com/image/w%3D310/sign=9a8b4d497ed98d1076d40a30113eb807/0823dd54564e9258655f5d5b9e82d158ccbf4e18.jpg',
	'http://e.hiphotos.baidu.com/image/w%3D310/sign=2da0245f79ec54e741ec1c1f89399bfd/9d82d158ccbf6c818c958589be3eb13533fa4034.jpg'
];
import { View } from 'react-native';
import {Banner, BaseView} from 'future/src/widgets';

export default class TestBanner extends Component {
	render() {
		return (
			<BaseView style={{flex:1}}
			navigator={this.props.navigator}>
				
				<Banner height={240} images={sliderImgs}
					onPress={(index) => { alert(index); } }
				/>
			</BaseView>
		);
	}
}
