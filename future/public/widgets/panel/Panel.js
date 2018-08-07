/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    View,
    Dimensions,
    PropTypes
} from 'react-native';
let screenWidth = Dimensions.get('window').width;
import Collapsible from 'react-native-collapsible';
export default class Panel extends Component {
    constructor(props) {
        super(props);
        let defaultExtended = this.props.collapsed == undefined ? true : this.props.collapsed;
        this.state = {
            collapsed: defaultExtended
        }
        this.duration = this.props.duration == undefined ? 300 : this.props.duration;
    }
    static propTypes = {
        head: React.PropTypes.element,	           //自定义头部
        duration: React.PropTypes.number,
        collapsed: React.PropTypes.bool,
        onCollapsedChange: React.PropTypes.func,

    }
    static defaultProps = {
        collapsed: true,
        duration: 300,
        onCollapsedChange: () => { },
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.collapsed != this.props.collapsed) {
            this.setState({
                collapsed: !this.state.collapsed,
            });
            if (this.props.onCollapsedChange) {
                this.props.onCollapsedChange(nextProps.collapsed);
            }
        }
    }
    render() {
        return (
            <View style={{flexDirection:'column'}}>
            {this.props.head}
            <Collapsible
                style={this.props.style}
                duration={this.duration}
                collapsed={this.state.collapsed}
            >
                {this.props.children}
            </Collapsible>
            </View>
        );
    }
}

