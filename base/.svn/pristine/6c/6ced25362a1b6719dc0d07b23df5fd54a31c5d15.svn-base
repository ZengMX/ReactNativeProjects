/*
 *  属性:
 * 	style: 	  星星样式。
 *  maxStars={5} 显示星星总数，
 *  disabled={false} 是否可用，false 可用，true 不可用。
 *  rating={5} 默认显示高亮星星个数，
 *  starSize：星星缩放级别
 * 	onStarChange：星星改变后回调函数
 */
import React, { Component } from 'react';

import { BaseView, StarRating } from 'future/src/widgets';
export default class Star extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<BaseView
				style={{ justifyContent: 'center', alignItems: 'stretch' }}
				navigator={this.props.navigator}
				title={{ title: '星星', tintColor: '#fff' }}
			>
				<StarRating
					style={{ justifyContent: 'center', alignItems: 'center' }}
					maxStars={5}
					rating={2}
					disabled={false}
					starSize={20}
					onStarChange={num => alert(num)}
				/>
			</BaseView>
		);
	}
}
