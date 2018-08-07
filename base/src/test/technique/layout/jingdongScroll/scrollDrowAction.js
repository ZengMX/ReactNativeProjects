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
// import {BaseView,} from "future/src/widgets/baseView/BaseView"
import { Banner, BaseView } from 'future/src/widgets';

var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;
var currentOffset = 0;
var _lastPosition = 0;

var sliderImgs = [
    'http://c.hiphotos.baidu.com/image/w%3D310/sign=0dff10a81c30e924cfa49a307c096e66/7acb0a46f21fbe096194ceb468600c338644ad43.jpg',
    'http://a.hiphotos.baidu.com/image/w%3D310/sign=4459912736a85edffa8cf822795509d8/bba1cd11728b4710417a05bbc1cec3fdfc032374.jpg',
    'http://e.hiphotos.baidu.com/image/w%3D310/sign=9a8b4d497ed98d1076d40a30113eb807/0823dd54564e9258655f5d5b9e82d158ccbf4e18.jpg',
    'http://e.hiphotos.baidu.com/image/w%3D310/sign=2da0245f79ec54e741ec1c1f89399bfd/9d82d158ccbf6c818c958589be3eb13533fa4034.jpg'
];

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
            <BaseView navigator={this.props.navigator} scrollEnabled={true} ref='base'>
                {/*<ListView 
                style={{flex:1,backgroundColor:'#287D4C'}}
                scrollEventThrottle={10}
                onScroll={(event)=>{
                currentOffset = event.nativeEvent.contentOffset.y;
                if (currentOffset - _lastPosition > 64 ) {  
                    _lastPosition = currentOffset; 
                    
                    this.refs.base.hideBar(true); 
                    console.log("ScrollUp now");  
                }  
                else if (_lastPosition - currentOffset > 64)  
                {  
                    _lastPosition = currentOffset;  
                    this.refs.base.hideBar(false);
                    console.log("ScrollDown now");  
                }}}
                dataSource={this.state.dataSource}
                renderHeader={()=> <View style={{height:64,width:screenWidth}}></View>}
                renderRow={this._renderRow.bind(this)}/>*/}

                <ScrollView
                    style={{ flex: 1, backgroundColor: '#287D4C' }}
                    scrollEventThrottle={10}
                    onScroll={(event) => {
                        this.refs.image.setNativeProps({
                            style: {
                                marginTop: (event.nativeEvent.contentOffset.y) / 2
                            }
                        })

                    }}>
                    <View style={{ width: screenWidth, height: 1000 }}>
                        <View ref='image'>
                            <Banner height={240} images={sliderImgs}
                                onPress={(index) => { alert(index); }}
                            />
                        </View>
                    </View>
                    <View style={{ position: 'absolute', width: screenWidth, height: 800, top: IS_IOS ? 304 : 284 }}>
                        <View style={{ backgroundColor: '#fff', width: screenWidth, height: 436 }}>
                        </View>
                    </View>
                </ScrollView>
            </BaseView>
        )
    }
}
const styles = StyleSheet.create({
})
