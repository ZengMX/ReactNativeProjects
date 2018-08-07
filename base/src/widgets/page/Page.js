/**
 * 2017/03/30
 * BaseView已封装,使用方法相同
 * 当使用Navigator作为页面跳转时， 提供onOpen事件
 */
'use strict';
import React, { Component, PropTypes, Children } from 'react';
import { InteractionManager } from 'react-native';
import _ from 'underscore';

export default class Page extends Component {
	constructor(props) {
		super(props);
		if (this.props.navigator) {
			this._didFocusSubscription_ = this.props.navigator.navigationContext.addListener('didfocus', _.once(() => {
				this._didFocusSubscription_.remove();
				InteractionManager.runAfterInteractions(() => {
					this.props.onOpen && this.props.onOpen();
				});
			}));
		}
	}
	static propTypes = {
		navigator: PropTypes.any.isRequired,
		children: PropTypes.element.isRequired,
	}
	render() {
		return Children.only(this.props.children)
	}
};
