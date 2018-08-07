import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    ScrollView,
    StyleSheet,
    ListView,
    TouchableOpacity
} from 'react-native';
import BaseView from "future/src/widgets/baseView/BaseView"

var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;
var currentOffset = 0;
var _lastPosition = 0;

export default class ScrollListener extends Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds.cloneWithRows(['row 1', 'row 2', 'row 3', 'row 4', 'row 5', 'row 6', 'row 7', 'row 8', 'row 9', 'row 10', 'row 11', 'row 12', 'row 13', 'row 14', 'row 15']),
        };
    }
    componentWillMount() {
    }
    componentDidMount() {
    }
    _renderRow(rowData, sectionID, rowID, highlightRow) {
        return (
            <Text style={{ height: 60 }}>{rowData}</Text>
        )
    }
    render() {
        return (
            <BaseView navigator={this.props.navigator} scrollEnabled={true} ref='base' screenStyle={{ backgroundColor: '#287D4C' }}>
                <ListView
                    style={{ flex: 1, backgroundColor: '#287D4C' }}
                    scrollEventThrottle={10}
                    onScroll={(event) => {
                        currentOffset = event.nativeEvent.contentOffset.y;
                        if (currentOffset - _lastPosition > 64) {
                            _lastPosition = currentOffset;

                            this.refs.base.hideBar(true);
                            console.log("ScrollUp now");
                        }
                        else if (_lastPosition - currentOffset > 64) {
                            _lastPosition = currentOffset;
                            this.refs.base.hideBar(false);
                            console.log("ScrollDown now");
                        }
                    }}
                    dataSource={this.state.dataSource}

                    renderRow={this._renderRow.bind(this)} />

                {/*<ScrollView
                style={{flex:1,backgroundColor:'#287D4C'}}
                scrollEventThrottle={10}
                onScroll={(event)=>{
                    this.refs.image.setNativeProps({style:{
                        marginTop:64+(event.nativeEvent.contentOffset.y)/2
                    }})

                }}>
                    <View style={{width:screenWidth,height:1000}}>
                        <View ref='image' style={{marginTop:64}}>
                        <TouchableOpacity style={{marginLeft:(screenWidth-240)/2}}>
                        <Image source={require('./res/teacher.png')} style={{width:240,height:300}}/>
                        </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{position:'absolute',width:screenWidth,height:800,top:364}}>
                        <View style={{backgroundColor:'#fff',width:screenWidth,height:436}}>
                        </View>
                    </View>
                </ScrollView>*/}
            </BaseView>
        )
    }
}
const styles = StyleSheet.create({
})
