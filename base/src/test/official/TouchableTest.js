// 引入官方组件
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
// 引入自定义组件
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';


export default class TouchableTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  onSubmit = () => {
    Alert.alert(this.state.value);
  }

  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: 'Touchable', tintColor: '#fff' }}
      >
        <TouchableOpacity style={styles.opacity} activeOpacity={0.5} onPress={() => { }}>
          <Text>TouchableOpacity</Text>
        </TouchableOpacity>
        <TouchableHighlight style={styles.opacity} underlayColor="#00FF00"  onPress={() => { }}>
          <Text>TouchableHighlight</Text>
        </TouchableHighlight>
        <TouchableWithoutFeedback  onPress={() => { }}>
          <View style={styles.opacity} ><Text>TouchableWithoutFeedback</Text></View>
        </TouchableWithoutFeedback>
      </BaseView>
    );
  }
}

const styles = Styles.create({
  opacity:{
    height: 100,
    width:200,
    backgroundColor:'#66CCFF',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

});