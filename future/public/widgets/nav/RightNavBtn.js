/**
 * style 文字容器样式
 * titleStyle 文字样式
 */

import React, { Component, PropTypes } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
  navBarButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    marginLeft : 20,
    paddingRight: 12,
    // backgroundColor : 'red'
  },
});

export default class RightNavButton extends Component {
  render() {
    const { style, titleStyle, margin, title, handler } = this.props;

    return (
      <TouchableOpacity style={styles.navBarButton}
        hitSlop={{ top: 15, left: 0, bottom: 15, right: 12 }}
        onPress={handler}>
        <View style={style}>
          <Text style={[{ color: '#333', textAlign: 'center', fontSize: 16 }, titleStyle]} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

}