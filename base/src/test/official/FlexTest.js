import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BaseView } from 'future/src/widgets';

export default class AddPickerPage extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: '盒子布局', tintColor: '#fff' }}
      >
        <View style={styles.row}>
          <View style={[styles.rowContent, styles.rowContent1]}><Text>1</Text></View>
          <View style={[styles.rowContent, styles.rowContent2]}><Text>2</Text></View>
          <View style={[styles.rowContent, styles.rowContent3]}><Text>3</Text></View>
        </View>

        <View style={styles.row2}>
          <View style={[styles.row2Content, styles.row2Content1]}><Text>Grow/Shrink 1</Text></View>
          <View style={[styles.row2Content, styles.row2Content2]}><Text>Grow/Shrink 2</Text></View>
          <View style={[styles.row2Content, styles.row2Content3]}><Text>Grow/Shrink 3</Text></View>
        </View>

        <View style={styles.column}>
          <View style={styles.columnContent}><Text>1</Text></View>
          <View style={styles.columnContent}><Text>2</Text></View>
          <View style={styles.columnContent}><Text>3</Text></View>
          <View style={styles.columnContent}><Text>4</Text></View>
          <View style={styles.columnContent}><Text>5</Text></View>
          <View style={styles.columnContent}><Text>6</Text></View>
          <View style={styles.columnContent}><Text>7</Text></View>
          <View style={styles.columnContent}><Text>8</Text></View>
        </View>

      </BaseView>
    );
  }
}

const styles = StyleSheet.create({
  // 演示 flexDirection  justifyContent alignItems flex alignSelf
  // 在容器组件(父组件)上定义
  row: {
    height: 100,
    borderColor: '#ff0000',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end', // 伸缩项目向主轴线的结束位置靠齐
    alignItems: 'center',  // 伸缩项目向交叉轴的中间位置靠齐
  },
  // 在伸缩项目(子组件)上定义
  rowContent: {
    //  height:50, // 不存在height
    //  flex:1,    // 伸缩项目占满主轴空间,justifyContent将无效,子组件交叉轴空间未定义时也将被占满
  },
  rowContent1: {
    backgroundColor: '#ffff00',
    alignSelf: 'flex-end',
  },
  rowContent2: {
    backgroundColor: '#0000ff',
    alignSelf: 'stretch',  //定义自身向交叉轴方向填充整个容器。
  },
  rowContent3: {
    backgroundColor: '#00ff00',
  },

  // 演示 flexBasis flexGrow flexShrink
  row2: {
    marginVertical: 10,
    height: 100,
    borderColor: '#ff0000',
    borderWidth: 1,
    flexDirection: 'row',
  },
  // 下面在个属性不要同时使用
  row2Content: {
    width: 50,  // 测试width为50或200时各个子组件的宽度
    // width:200,
    // flex:1, // 启用此属性其他设置将失效,子组件平分主轴空间
    // flexBasis:100, // 存在width时此属性失效
  },
  row2Content1: {
    backgroundColor: '#ffff00',
    flexGrow: 1, 
    flexShrink: 1,
  },
  row2Content2: {
    backgroundColor: '#0000ff',
    flexGrow: 2,
    flexShrink: 2,
  },
  row2Content3: {
    flexGrow: 3,
    flexShrink: 3,
    backgroundColor: '#00ff00',
  },

  // 演示 flexWrap
  column: {
    height: 102,
    borderColor: '#ff0000',
    borderWidth: 1,
    flexWrap: 'wrap', //超出时换行显示
  },
  // 它是上层View的子组件,也是下层Text的父组件
  columnContent: {
    height: 20,
    width: 20,
    backgroundColor: '#ffd966',

    flexDirection: 'row',    // 由于下面两个定义都是center,这里row和column并没有区别
    justifyContent: 'center',  // 定义子组件Text主轴位置
    alignItems: 'center',     // 定义子组件Text交叉轴位置

  }
});