// 引入官方组件
import React, { Component } from 'react';
import {
  Image,
  ListView,
  Text,
  View,
} from 'react-native';
// 引入自定义组件
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';

// 模拟后台产生数据
const THUMB_URLS = [
  require('./res/like.png'),
  require('./res/dislike.png'),
  require('./res/call.png'),
  require('./res/fist.png'),
  require('./res/bandaged.png'),
  require('./res/flowers.png'),
  require('./res/heart.png'),
  require('./res/liking.png'),
  require('./res/party.png'),
  require('./res/poke.png'),
  require('./res/superlike.png'),
  require('./res/victory.png'),
];

let LOREM_IPSUM = 'Lorem ipsum dolor sit amet, ius ad pertinax oportere accommodare, an vix civibus corrumpit referrentur. Te nam case ludus inciderint, te mea facilisi adipiscing. Sea id integre luptatum. In tota sale consequuntur nec. Erat ocurreret mei ei. Eu paulo sapientem vulputate est, vel an accusam intellegam interesset. Nam eu stet pericula reprimique, ea vim illud modus, putant invidunt reprehendunt ne qui.';


export default class ListViewTest extends Component {
  constructor(props) {
    super(props);
    this._pressData = {};
    // 创建ListViewDataSource对象，并用其进行数据变更的比较。
    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows(this._genRows({})), // 为ListViewDataSource复制填充数据。
    };

    this.genRows = this._genRows.bind(this);
    this.renderRow = this._renderRow.bind(this);
    this.renderSeparator = this._renderSeparator.bind(this);
  }

  // 模拟后台产生数据
  _genRows() {
    let dataBlob = [];
    for (let i = 0; i < 10; i++) {
      dataBlob.push('Row ' + i );
    }
    return dataBlob;
  }
  
  // highlightRow高亮参数行
  _renderRow(rowData, sectionID, rowID, highlightRow) {
    var imgSource = THUMB_URLS[Math.ceil(Math.random() * 11)];
    return (
        <View >
          <View style={styles.row}>
            <Image style={styles.thumb} source={imgSource} />
            <Text 
              style={styles.text}>
              {rowData + ' - ' + LOREM_IPSUM.substr(0, Math.ceil(Math.random() * 400))}
            </Text>
          </View>
        </View>
    );
  }

  // 两侧线条
  _renderSeparator(rowData, sectionID, rowID, highlightRow) {
    // key={sectionID+rowID+1} 用于ListView渲染比较,RN内部使用
    return (
      <View key={sectionID+rowID+1} style={{ height: 1, backgroundColor: '#CCCCCC', }} />
    );
  }

  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: 'ListView', tintColor: '#fff' }}
      >
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderSeparator={this.renderSeparator}
        />
      </BaseView>
    );
  }
}

const styles = Styles.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  thumb: {
    width: 64,
    height: 64,
  },
  text: {
    flex: 1,
  },
});