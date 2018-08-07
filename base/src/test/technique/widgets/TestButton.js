import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Navigator,
  Text
} from 'react-native';

import {BaseView, Button} from '../widgets/';

export default class TestText extends Component {
  render() {
	const element = <Text style={{color:'#000',borderColor:'red',borderWidth:1}}>element</Text>;
    return (
      <BaseView style={styles.container}
	  navigator={this.props.navigator}>
       
        <View style={{flexDirection:'column'}}>
            <Button />
        </View>
      </BaseView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
     flex: 1,
  },
});
