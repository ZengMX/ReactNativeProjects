import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    Text
} from 'react-native';
var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;
import CacheableImage from 'react-native-cacheable-image';
import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';
import StorageUtils from 'future/public/lib/StorageUtils';

// 引入在Guide页面可能要跳转的所有页面，这里示例跳转到首页和商品页
import Index from 'future/src/index';
import ProductDetail from 'future/src/product/components/ProductDetail';

export default class Guide extends Component {
    static propTypes = {
        toProduct: React.PropTypes.func.isRequired,
        toIndex: React.PropTypes.func.isRequired,
        datas: React.PropTypes.object.isRequired
    }

    static defaultProps = {
        toProduct: () => { },
        toIndex: () => { },
        datas: {}
    }

    constructor(props) {
        super(props);
        this.pageLength = this.props.datas.pagePics.length || 0; // 活动数量
        this.drag = 0; // 控制拖动最后页面进入首页
    }

    // 如下两个函数在本页面里面没使用，当前思路是在外部判断欢迎页面是否展示
    // 如果之前展示过的就不要再展示了,即只展示一次。
    // isShowBefore = () => {
    //     if (this.props.datas.appSplashId) {
    //         StorageUtils.readInfo('appSplashIds').then((result) => {
    //             if (result.data) {
    //                 if (this.props.datas.appSplashId == result.data) {
    //                     console.log("有之前的数据,已经显示过了：", result);
    //                     return false;
    //                 } else {
    //                     StorageUtils.saveInfo('appSplashIds', this.props.datas.appSplashId);
    //                     return true;
    //                 }
    //             }
    //         }, (error) => {
    //             StorageUtils.saveInfo('appSplashIds', this.props.datas.appSplashId);
    //             return true;
    //         });
    //     }
    // }
    //活动是否过期
    // isExpire = () => {
    //     if (new Date().getTime() - this.props.datas.endDate > 0) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }

    // 到首页，使用replace方式，页面回跳时进行首页，欢迎页面不再出现
    toIndex = () => {
        this.props.navigator.replace({
            component: Index,
        });
    }

    // 到商品、活动等页面，使用immediatelyResetRouteStack方式，页面回跳时进行首页，欢迎页面不再出现
    toProduct = (pageData) => {
        // this.props.navigator.immediatelyResetRouteStack([
        //     { component: Index },
        //     {
        //         component: ProductDetail,
        //         params: {
        //             productId: 6113,
        //         }
        //     }]);
    }

    // 备用,当滑动到某一页面动画结束后触发，参数为选中页面的index
    onPageSelected = (index) => {
        // console.log('onPageSelected', index);
    }

    // 滑动页面动画时反复触发，参数为当前页面及位置{offset: 0.16851851344108582, position: 0}
    onPageScroll = (params) => {
        // console.log('params', params);
        // 动画结束后触发结束时最后触发一次，参数为{offset: 0, position: 下一页面的index}
        // 在最后一个活动页面向左拖动时进入首页
        if (params.position == this.pageLength - 1) {
            console.log('params.position', params.position);
            this.drag++
            if (this.drag > 2) {
               // this.toIndex();
            }
        } else {
            this.drag = 0;
        }
    }

    // 根据需要定义轮播页面
    renderPageContent() {
        var views = [], img;
        if (this.props.datas && this.props.datas.pagePics && this.props.datas.pagePics.length > 0) {
            for (let i = 0; i < this.props.datas.pagePics.length; i++) {
                img = { uri: this.props.datas.pagePics[i].pagePicUrl }
                if (i == this.props.datas.pagePics.length - 1) {
                    views.push(<View style={{ width: screenWidth, height: screenHeight }} key={i}>
                        <Image
                            source={img}
                            resizeMode='stretch'
                            style={{ width: screenWidth, height: screenHeight }}>
                        </Image>
                        <TouchableOpacity
                            style={{
                                width: 126,
                                height: 30,
                                borderRadius: 15,
                                borderWidth: 1,
                                borderColor: 'rgba(255, 255, 255, 0.7)',
                                position: 'absolute',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bottom: 25,
                                left: (screenWidth - 126) / 2,
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            }}
                            onPress={() => { this.toIndex(); }}>
                            <Text style={{ fontSize: 13, color: '#fff' }}>立即体验</Text>
                        </TouchableOpacity>
                    </View>)
                } else {
                    views.push(<View style={{ width: screenWidth, height: screenHeight }} key={i}>
                        <Image
                            source={img}
                            resizeMode='stretch'
                            style={{ width: screenWidth, height: screenHeight }}>
                        </Image>
                    </View>)
                }
            }
            return views;
        }
    }
    render() {
        return (
            <View style={{ width: screenWidth, height: screenHeight }}>
                {/* 轮播活动页面 */}
                <IndicatorViewPager
                    style={{ width: screenWidth, height: screenHeight }}
                    indicator={<PagerDotIndicator pageCount={this.pageLength} />}
                    onPageScroll={this.onPageScroll}
                    onPageSelected={this.onPageSelected}>
                    {this.renderPageContent()}
                </IndicatorViewPager>
            </View>
        );
    }
}