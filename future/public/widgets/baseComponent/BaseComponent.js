import React, { Component } from 'react';
import { shallowEqualImmutable } from 'react-immutable-render-mixin';
export default class BaseComponent extends Component {
    constructor(props) {
        super(props);
        //console.log('>>>>>>>>>>>BASECOMPONENT');
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !shallowEqualImmutable(this.props, nextProps)
            || !shallowEqualImmutable(this.state, nextState);
    }
}
