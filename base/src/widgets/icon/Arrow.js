import React, { Component, PropTypes } from 'react';
import {
  Image
} from 'react-native';

export default class Arrow extends Component {
  render() {
    return (
      <Image source={require('./img/000gonggaoyoujiantou.png')} {...this.props} />
    );
  }
}