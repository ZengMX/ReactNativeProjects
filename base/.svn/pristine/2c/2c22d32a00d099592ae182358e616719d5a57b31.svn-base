import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight
} from 'react-native';
const SEPARATOR_HEIGHT = 6;
const genData = (page, size) => {
    let data = [];
    for (const i = 0; i < size; i++) {
        let item = {};
        item.key = (page - 1) * size + i;
        item.text = 'row ' + item.key;
        data.push(item)
    }
    return data;
}
const fetchData = (page, size) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(genData(page, size));
        }, 6000);
    })
};
import { BaseView, NewRefreshableListView } from 'future/src/widgets';
export default class RefreshableListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'wait'
        }
        this._renderHead = this._renderHead.bind(this);
        this._renderRow = this._renderRow.bind(this);
        this._renderSeparator = this._renderSeparator.bind(this);
    }
    fetchData(page, success, error) {
        fetchData(page, 15).then((data) => {
            console.log("fetchData success data:", data);
            success(data, page * 15, 45);
        }).catch((err) => {
            console.log('fetchData error======: ', err);
            error();
        });
    }
    upDateRow() {
        let item = {};
        item.key = 0;
        item.text = 'row 100';
        this.refs.list.updateRowAt(0, item);
        this.setState({
            status: 'error'
        });
    }
    _renderHead() {
        return (<View style={{ flex: 1, height: 60, backgroundColor: "#00f", justifyContent: 'center', alignItems: 'center' }}>
            <TouchableHighlight onPress={() => { this.upDateRow() }}>
                <Text style={{ flex: 1 }}>
                    upDateRow
       </Text>
            </TouchableHighlight>
        </View>);
    }
    _renderRow(item, index) {
        return (
            <View style={{ flex: 1, height: 60, backgroundColor: '#0f0', justifyContent: 'center', alignItems: 'center' }}>
                <Text>{index}: {item.text}</Text>
            </View>
        )
    }
    _renderSeparator() {
        return (
            <View style={{ height: 5, backgroundColor: '#fff' }}></View>
        );
    }
    render() {
        return (
            <BaseView style={{ flex: 1 }} ref='base' navigator={this.props.navigator}>
                <NewRefreshableListView
                    ref={"list"}
                    autoRefresh={true}
                    autoLoadMore={true}
                    renderHead={this._renderHead}
                    renderRow={this._renderRow}
                    separator={this._renderSeparator}
                    fetchData={this.fetchData.bind(this)} />
            </BaseView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    separator: {
        height: SEPARATOR_HEIGHT,
        backgroundColor: 'gray',
    },
});