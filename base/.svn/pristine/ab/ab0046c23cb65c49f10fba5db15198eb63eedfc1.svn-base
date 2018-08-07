import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import { BaseView } from 'future/src/widgets/';
import AlphabetListView from 'react-native-alphabetlistview';

// 数据结构，也可为数组
const datas = {
  A: ['some', 'entries', 'are here'],
  B: ['some', 'entries', 'are here'],
  C: ['some', 'entries', 'are here'],
  D: ['some', 'entries', 'are here'],
  E: ['some', 'entries', 'are here'],
  F: ['some', 'entries', 'are here'],
  G: ['some', 'entries', 'are here'],
  H: ['some', 'entries', 'are here'],
  I: ['some', 'entries', 'are here'],
  J: ['some', 'entries', 'are here'],
  K: ['some', 'entries', 'are here'],
  L: ['some', 'entries', 'are here'],
  M: ['some', 'entries', 'are here'],
  N: ['some', 'entries', 'are here'],
  O: ['some', 'entries', 'are here'],
  P: ['some', 'entries', 'are here'],
  Q: ['some', 'entries', 'are here'],
  R: ['some', 'entries', 'are here'],
  S: ['some', 'entries', 'are here'],
  T: ['some', 'entries', 'are here'],
  U: ['some', 'entries', 'are here'],
  V: ['some', 'entries', 'are here'],
  W: ['some', 'entries', 'are here'],
  X: ['some', 'entries', 'are here'],
  Y: ['some', 'entries', 'are here'],
  Z: ['some', 'entries', 'are here'],
};

export default class MyComponent extends Component {

  constructor(props) {
    super(props);
  }

  // 主体
  renderCell = (datas) => {
    return (
      <View style={{ height: 30 }}>
        <Text>{datas.item}</Text>
      </View>
    );
  }

  // 右边栏
  renderSectionItem = (datas) => {
    return (
      <Text style={{ color: '#f00' }}>{datas.title}</Text>
    );
  }

  // 单元头
  renderSectionHeader = (datas) => {
    return (
      <View style={{ backgroundColor: '#ccc' }}>
        <Text style={{ color: '#fff', fontSize: 16 }}>{datas.title}</Text>
      </View>
    );
  }

  render() {
    return (
      <BaseView style={{ flex: 1 }} navigator={this.props.navigator}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <AlphabetListView
            data={datas}
            cellHeight={30}
            sectionHeaderHeight={22.5}
            cell={this.renderCell}
            sectionListItem={this.renderSectionItem}
            sectionHeader={this.renderSectionHeader}
          />
        </View>
      </BaseView>
    );
  }
}