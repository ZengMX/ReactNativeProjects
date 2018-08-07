import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';

export default class CommonList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BaseView
        title={{ title: '单行N个组件自适应', tintColor: '#fff' }}
        navigator={this.props.navigator}
      >
        <View style={styles.box}>

          <View style={styles.item}>
            <Image
              style={styles.itemImg}
              source={require('./res/001daifukuan.png')}
            >
              {/**右上角数字 */
                1 > 0 &&
                <View style={styles.orderNumberImg}>
                  <Text style={styles.orderNumberText} numberOfLines={1}>20</Text>
                </View>
              }
            </Image>
            <Text style={styles.itemText}>待付款</Text>
          </View>

          <View style={styles.item}>
            <Image style={styles.itemImg} source={require('./res/001daifhuo.png')} />
            <Text style={styles.itemText}>待发货</Text>
          </View>

          <View style={styles.item}>
            <Image style={styles.itemImg} source={require('./res/001daishouhuo@2x.png')} />
            <Text style={styles.itemText}>待收货</Text>
          </View>

          <View style={styles.item}>
            <Image style={styles.itemImg} source={require('./res/001daipingjia@2x.png')} />
            <Text style={styles.itemText}>待评价</Text>
          </View>

          <View style={styles.item}>
            <Image style={styles.itemImg} source={require('./res/001tuihuanhuo@2x.png')} />
            <Text style={styles.itemText}>退换货</Text>
          </View>
        </View>

      </BaseView>
    );
  }
}

const styles = Styles.create({
  box: {
    marginTop: 30,
    borderColor: '#0033FF',
    borderWidth: '$BW',
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around', // 根据适配要求改变这里
    backgroundColor: '#CCFF66',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF99FF',
  },
  itemImg: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    alignItems: 'flex-end', //定义小圆点显示位置
  },
  itemText: {
    textAlign: 'center',
    fontSize: 10,
    color: '#666'
  },
  orderNumberImg: {
    minWidth: 13,
    height: 13,
    borderRadius: 6.5,
    borderWidth: '2 * $BW',
    backgroundColor: 'red',
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  orderNumberText: {
    fontSize: 7,
    color: '#fff'
  },
});