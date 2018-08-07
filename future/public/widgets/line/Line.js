/**
 * Created by timhuo on 2017/5/31.
 */
'use strict';
import React, { Component } from 'react';
import {
  View,
	PixelRatio,
	Dimensions,
} from 'react-native';

var screenWidth = Dimensions.get('window').width;

export default class Line extends Component {
	
	constructor(props){
		super(props);
	}
	
	static propTypes = {
		left: React.PropTypes.number,    /** 距离左边 */
		right: React.PropTypes.number,    /** 距离右边 */
	};
	
  render() {
  	let leftM = this.props.left?this.props.left:0;
  	let rightM = this.props.right?this.props.right:0;
  	let lineWidth = screenWidth-leftM-rightM;
  	
	  return (
	    <View style={[{ marginLeft:leftM , width:lineWidth , height: 1 / PixelRatio.get(), backgroundColor: '#e5e5e5' },{...this.props.style}]} />
    );
  }
  
}
