/**
 * 公用目录列表类
 * 属性
 * datas 目录数组
 * navigator Navigator实例，照抄就好
 * header 导航栏标题
 * type 列表类型 默认为row，需要column要明确写出
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Navigator,
  ListView
} from 'react-native';
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';

export default class CommonList extends Component {
  constructor(props) {
    super(props);
    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    let datas = this.props.datas || [];
    this.isColumn = this.props.type == 'column';
    this.dataSource = ds.cloneWithRows(datas);
  }

  renderRow = (rowData, rowId) => {
    return (
      <TouchableHighlight
        key={rowId}
        style={this.isColumn ? styles.column : styles.row}
        onPress={() => {
          this.props.navigator.push({
            component: rowData.component
          });
        }}
        underlayColor={'#ccc'}
      >
        <Text style={styles.title} >{rowData.title}</Text>
      </TouchableHighlight >
    );
  }

  renderSeparator = (sectionID, rowID) => {
    if (this.isColumn) {
      return (
        <View key={'key' + rowID} style={styles.separator} />
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <BaseView
        title={{ title: this.props.header || '测试', tintColor: '#fff' }}
        navigator={this.props.navigator}
      >
        <ListView
          contentContainerStyle={this.isColumn ? undefined : styles.list}
          initialListSize={9}
          pageSize={3}
          scrollRenderAheadDistance={500}
          dataSource={this.dataSource}
          renderRow={this.renderRow.bind(this)}
          renderSeparator={this.renderSeparator}
          removeClippedSubviews={false}
        />
      </BaseView>
    );
  }
}


const styles = Styles.create({
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  column: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  row: {
    height: 45,
    width: '0.3 * $W',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: '$BW',
    borderColor: '#0033FF',
    marginVertical: 5,
    marginHorizontal: '0.015 * $W',
    borderRadius: 10,
  },
  title: {
    fontSize: 12,
    marginLeft: 10
  },
  separator: {
    height: 1,
    backgroundColor: '#CCC'
  },
});