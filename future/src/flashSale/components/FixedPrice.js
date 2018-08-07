import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet
} from 'react-native';
import BaseView from "future/public/widgets/baseView/BaseView"
export default class FixedPrice extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount(){
    }
    componentDidMount(){
    }
    componentWillReceiveProps(nextProps){
    }
    shouldComponentUpdate(){
    }
    componentWillUpdate(){
    }
    componentDidUpdate(){
    }
    componentWillUnmount(){
    }
    render(){
        return(
            <BaseView navigator={this.props.navigator} scrollEnabled={false} ref='base'
                title={{ title: '一口价', tintColor: '#fff', fontSize: 16 }}
             >
                <View></View>
            </BaseView>
        )
    }
}
const styles = StyleSheet.create({
})
