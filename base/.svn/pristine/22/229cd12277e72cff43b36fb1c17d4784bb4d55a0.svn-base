// 引入官方组件
import React, { Component } from 'react';
import {
  Text,
  Alert,
} from 'react-native';
// 引入自定义组件
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';


export default class TextTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: false,
    };
  }

  onPress=()=>{
    Alert.alert('你点我了！')
  }

  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: 'Text', tintColor: '#fff' }}
      >
        <Text style={styles.basis}>
          支持
          <Text style={styles.nest}>嵌套</Text>
          <Text onPress={this.onPress} style={styles.touch}>触摸</Text>
        </Text>
        
        <Text style={styles.nowrap} numberOfLines={1}>用来当文本过长的时候裁剪文本。包括折叠产生的换行在内，总的行数不会超过这个属性的限制。</Text>

      </BaseView>
    );
  }
}

const styles = Styles.create({
  basis:{
    marginTop: 30,
    fontSize:18,
    color:'#00FF00'
  },
    nest:{
    fontSize:12,
  },
    touch:{
    color:'#0099FF',
  },
  nowrap:{
    marginTop: 30,
    width: 100,
  }
});