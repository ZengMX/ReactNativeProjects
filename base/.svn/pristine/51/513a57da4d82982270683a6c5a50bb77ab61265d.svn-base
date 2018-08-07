import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Navigator,
  Text
} from 'react-native';

import {BaseView, Gallery} from 'future/src/widgets';

export default class TestText extends Component {
  render() {
    return (
      <BaseView style={styles.container} navigator={this.props.navigator}>
        <Gallery
		  source={{
		    uri: "http://c1.staticflickr.com/8/7412/27488731000_96ad0b9740_k.jpg"
		  }}
		  minimumZoomScale={0.5}
		  maximumZoomScale={3}
		  androidScaleType="center"
		  onLoad={() => console.log("Image loaded!")} />
      </BaseView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
     flex: 1,
  },
});
