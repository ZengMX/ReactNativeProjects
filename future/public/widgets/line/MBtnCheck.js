/**
 * Created by timhuo on 2017/6/21.
 */
'use strict';
import React, { Component } from 'react';
import {
	TouchableOpacity,
	View,
} from 'react-native';
import CheckBox from "../checkBox/CheckBox";

export default class MBtnCheck extends Component {

  render() {
    return (
    <TouchableOpacity style={{ }}
                      activeOpacity={1}
                      disabled={this.props.disabled}
                      onPress={() => {
                      	if(this.props.onChange!==undefined){
		                      this.props.onChange();
	                      }
                      }}>
	    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
		    <CheckBox
			    
			    {...this.props}
			    disabled={true}
			    onChange={null}
		    />
	    </View>
    </TouchableOpacity>
    );
  }
}