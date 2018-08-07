import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  PixelRatio,
  Platform,
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
        <View style={styles.normalPrd}>

          <Image style={styles.mainImg} source={require('./res/main.jpg')} />

          <View style={styles.right}>
            <View style={styles.textBox}>
              <Text style={styles.productNm} numberOfLines={2} >
                {(Platform.OS == "ios" ? "             " : "               ")}
                川贝清肺糖浆套盒川贝清肺糖浆套盒川贝清肺糖浆套盒川贝清肺糖浆套盒川贝清肺糖浆套盒川贝清肺糖浆套盒川贝清肺糖浆套盒川贝清肺糖浆套盒川贝清肺糖浆套盒川贝清肺糖浆套盒川贝清肺糖浆套盒川贝清肺糖浆套盒
              </Text>
              <Image style={[styles.smallImg, { top: Platform.OS == "ios" ? 1.5 : 3 }]} source={require('./res/000yaojia_d.png')} />
            </View>
          </View>

        </View>

        {/*方法二*/}
        <View style={styles.normalPrd}>

          <Image style={styles.mainImg} source={require('./res/main.jpg')} />

          <View style={styles.right}>
            <Text numberOfLines={2}>
              <Image style={[styles.smallImg, { top: Platform.OS == "ios" ? 1.5 : 3 }]} source={require('./res/000yaojia_d.png')} />
              川贝清肺糖浆套盒川贝清肺糖浆套盒川贝清肺糖浆套盒川贝清肺糖浆套盒川贝清肺糖浆套盒川贝清肺糖浆套盒川贝清肺糖浆套盒川贝清肺糖浆套盒川贝清肺糖浆套盒川贝清肺糖浆套盒川贝清肺糖浆套盒川贝清肺糖浆套盒
            </Text>
          </View>

        </View>

      </BaseView>
    );
  }
}

const styles = Styles.create({
  normalPrd: {
    height: 100,
    flexDirection: 'row',
    paddingHorizontal: 12,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#e5e5e5',
    marginBottom: 30,
  },
  mainImg: {
    marginVertical: 10,
    width: 80,
    height: 80,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: '#e5e5e5',
    resizeMode: 'contain',
  },
  right: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 15,
    marginLeft: 5,
  },
  textBox: {
    flex: 1,
    flexDirection: 'row'
  },
  productNm: {
    flex: 1,
    fontSize: 12,
    color: '#323232',
  },
  smallImg: {
    width: 39,
    height: 11,
    position: "absolute",
    left: 0,
    resizeMode: 'contain',
  },
});