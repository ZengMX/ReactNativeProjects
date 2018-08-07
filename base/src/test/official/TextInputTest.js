// 引入官方组件
import React, { Component } from 'react';
import {
  View,
  TextInput,
  Alert,
} from 'react-native';
// 引入自定义组件
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';


export default class TextInputTest extends Component {
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
        title={{ title: 'TextInput', tintColor: '#fff' }}
      >
        <View style={styles.box}>
          <TextInput
            style={styles.textinput}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={10}
            onChangeText={value=>this.setState({value})}
            onSubmitEditing={this.onSubmit}
            placeholder={'输入内容'}
            placeholderTextColor="#666"
            value={this.state.value}
          />
        </View>
      </BaseView>
    );
  }
}

const styles = Styles.create({
  box: {
    marginTop: 30,
    marginLeft: 12,
    height: 45,
    width: 200,
    borderWidth:'$BW',
    borderColor:'#0066FF',
    borderRadius:10,
  },
  textinput: {
    flex: 1,
    marginLeft:5,
    fontSize: 18,
    color: '#00FF33'
  },

});