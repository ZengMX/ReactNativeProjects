
/**
 * Created by timhuo on 2017/5/3.
 */
'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
	PixelRatio,
} from 'react-native';

import ImageBigBtn from './imageBigBtn'
import imageUtil from 'future/public/lib/imageUtil';

export default class ImageBigBtnList extends Component {
	
	constructor(props){
		super();
		this.props = props;
		this.coms = [];
		this.getComs = this._getComs.bind(this);
		this.setRef = this._setRef.bind(this);
		this.fixImageUrl = this._fixImageUrl.bind(this);
		this.length = this.props.length?this.props.length:999;
		this.extent = this.props.extentComAfter?this.props.extentComAfter:()=>{return null};
		
		this.imageDefaultStyle = { marginLeft: 10, borderWidth: 1 / PixelRatio.get(), borderColor: "#e5e5e5" ,width: 65, height: 65};
		this.imageDefaultStyle = this.props.imageStyle?this.props.imageStyle:this.imageDefaultStyle;
		
	}
	
	_getComs(){
		return this.coms;
	}
	
	_setRef(com,index){
		if(com!=null){
			this.coms[index] = com;
		}
	}
	
	_fixImageUrl(orgin_url){
		return this.props.fixImageUrl(orgin_url);
	}
	
  render() {
  	var mapImageBtn = this.props.urls.map((value,index)=>{		
		let extent = this.extent(index);
		return (
			<ImageBigBtn
				key={"imageBigBtn"+index}
				ref={(com)=>{this.setRef(com,index)}}
				style={this.props.imageStyle ? this.props.imageStyle : this.imageDefaultStyle}
				url={this.fixImageUrl(value)}
				urls={this.props.urls}
				index={index}
				getComs={this.getComs}
				extentCom={extent}
			/>
		)		
	  });
  	
    return (
      <View style={[{flexDirection: "row"},this.props.style]}>
	      {mapImageBtn}
      </View>
    );
  }
	
	
	propTypes: {
		urls: _react.PropTypes.array.isRequired,
		length: _react.PropTypes.number,
		fixImageUrl: _react.PropTypes.func.isRequired,
		extentComAfter: _react.PropTypes.func,
		imageStyle: _react.PropTypes.object,
	}
}