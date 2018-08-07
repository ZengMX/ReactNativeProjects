/**
 * 2017/03/31
 * 用新组件取代：
 * http://192.168.1.209:8000/pages/viewpage.action?pageId=8422393
 * 
 * 可以是用手指滑动的图片画廊，使用react-native-looped-carousel
 * 需要安装依赖包npm i react-native-looped-carousel --save
 *
 * https://github.com/appintheair/react-native-looped-carousel
 */
'use strict';
import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Carousel from 'react-native-looped-carousel';
import Styles from '../../lib/styles/Styles';

export default class BannerA extends Component {
  constructor(props) {
    super(props);
  }
  static defaultProps = {
    width: Dimensions.get('window').width,
    imageWidth: Dimensions.get('window').width,
    resizeMode: "contain",
  }
  static propTypes = {
    width: React.PropTypes.number, 								// 宽度
    imageWidth: React.PropTypes.number,
    resizeMode: React.PropTypes.string,
    height: React.PropTypes.number.isRequired, 					// 高度，必须
    images: React.PropTypes.arrayOf(React.PropTypes.string),		// 图片数组
    onPress: React.PropTypes.func,									// 图片点击事件，回传图片下标
    imageProps: React.PropTypes.object,

  }
  _renderRows(images) {
    return images.map((image, index) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          style={{ width: this.props.width, height: this.props.height, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}
          key={'banner_image_' + index}
          onPress={() => { this.props.onPress && this.props.onPress(index) }}
        >
          {image != null && image != undefined && <Image
            style={{ width: this.props.imageWidth, height: this.props.height, resizeMode: this.props.resizeMode }}
            source={{ uri: image }} {...this.props.imageProps} />}
        </TouchableOpacity>
      );
    });
  }
  render() {
    const { onPress, width, height, imageProps, ...carouselProps } = this.props;
    return (
      <Carousel
        bulletStyle={styles.bulletStyle}
        chosenBulletStyle={styles.chosenBulletStyle}
        style={{ width, height }}
        autoplay={false}
        delay={2500}
        bullets={true}
        {...carouselProps}
      >
        <View>
          {this._renderRows(this.props.images)}
        </View>
      </Carousel>
    );
  }
}

const styles = Styles.create({
  //线条指示器
  bulletStyle: {
    backgroundColor: '$line.main',
    width: 13,
    height: 2,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3
  },
  chosenBulletStyle: {
    backgroundColor: '$bColor.main',
    width: 13,
    height: 2,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3
  },
});