// 使用方法 @PureRender
// https://facebook.github.io/react/docs/pure-render-mixin.html

import React, { Component } from 'React';
import PureRenderMixin from 'react-addons-pure-render-mixin';

module.exports = PureRender = (ComposedComponent) => class extends Component {
	constructor(props) {
	    super(props);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
    render() {
        return <ComposedComponent {...this.props}  />;
    }
};
