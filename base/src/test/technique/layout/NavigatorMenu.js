import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { BaseView } from 'future/src/widgets';
import { Fetch } from 'future/src/lib';
import _ from 'underscore';
import Styles from 'future/src/lib/styles/Styles';

const datas = [{
  orgId: 1,
  station: "乐商软件"
},
{
  orgId: 2,
  station: "仙草堂医药集团"
},
{
  orgId: 3,
  station: "医院采购"
},
{
  orgId: 4,
  station: "四川云药库"
}];

export default class CommonList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowMenu: false		//菜单是否显示
    }
  }

  // 显示菜单，调用了BaseView的方法showModal
  showMenu = () => {
    this.base.showModal();
    this.setState({ isShowMenu: true });
  };

  // 隐藏菜单
  hideMenu = () => {
    this.base.hideModal();
    this.setState({ isShowMenu: false });
  };

  // 自定义navbar左边按钮
  renderLeftNavBtn() {
    let leftBtnImg = this.state.isShowMenu ? require('./res/001guanbi@3x.png') : require('./res/001xuanzhandian.png');
    return (
      <TouchableOpacity
        style={styles.leftBtnBox}
        onPress={this.showMenu}
        activeOpacity={1}
      >
        <Image style={styles.leftBtnImg} source={leftBtnImg} />
      </TouchableOpacity>
    )
  }

  // 渲染弹出菜单
  renderModalScence = () => {
    return (
      <View style={styles.menu}>
        <TouchableOpacity style={styles.topMask} onPress={this.hideMenu} />
        <ScrollView>
          <View style={styles.triangleBox}>
            <Image style={styles.triangle} source={require('./res/011gengduosanjiao.png')} />
          </View>
          {this.renderItem(datas)}
        </ScrollView>
      </View>
    );
  }

  // 渲染菜单项目
  renderItem = (data) => {
    return _.map(data, (item, index) => {
      return (
        <TouchableOpacity style={styles.item}
          key={index}
          activeOpacity={0.99}
          onPress={this.hideMenu}>
          <View style={styles.itemBox}>
            <Text style={styles.itemTitle} numberOfLines={1}>{item.station}</Text>
          </View>
        </TouchableOpacity>
      )
    });
  }

  render() {
    return (
      <BaseView
        navigator={this.props.navigator}
        ref={base => this.base = base}
        title={{ title: '导航上的菜单', tintColor: '#fff' }}
        leftButton={this.renderLeftNavBtn()}
        renderModalScence={this.renderModalScence}
        modalBackgroundStyle={styles.modalBackgroundStyle}
      >
        <TouchableOpacity onPress={this.props.navigator.pop} style={styles.btn}>
          <Text style={styles.text}>点我返回</Text>
        </TouchableOpacity>
      </BaseView>
    );
  }
}

const styles = Styles.create({
  leftBtnBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftBtnImg: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
  menu: {
    flex: 1,
  },
  item: {
    width: '$W',
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  itemBox: {
    marginHorizontal: 12,
    width: '$W - 24',
    height: 54,
    justifyContent: 'center',
    borderBottomColor: "#eee",
    borderBottomWidth: '$BW',
  },
  itemTitle: {
    color: "#333333",
    fontSize: 16,
    textAlign: "left"
  },
  triangleBox: {
    height: 5,
    backgroundColor: 'transparent',
  },
  triangle: {
    height: 5,
    width: 11,
    resizeMode: 'contain',
    marginLeft: 18, //三角形的左边距，计算出来上面按键的中心位置
  },
  // IS_IOS为全局变量，ios为true
  modalBackgroundStyle: {
    marginTop: IS_IOS ? 64 : 44,
  },
  topMask: {
    backgroundColor: 'transparent',
    height: IS_IOS ? 64 : 44,
    width: '$W',
  },
  btn: {
    marginTop: 10,
    marginHorizontal: 10,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#3B5998',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
});