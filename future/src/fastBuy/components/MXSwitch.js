import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Switch,
  Platform
} from 'react-native';
import {MKSwitch} from '../../widgets/switch';
export default class MXSwitch extends Component {
    constructor(props) {
        super(props);
    }
    
    render(){
        return(
            <View>
            {Platform.OS=='android'&&<MKSwitch
                        checked={this.props.checked}
                        trackSize={30}
                        trackLength={52}
                        onColor="#3491df"
                        thumbOnColor={'#E7E7E7'}
                        rippleColor='rgba(0,0,0,0)'
                        onCheckedChange={(e) => {this.props.onCheckedChange(e.checked)}}/>}
                        {Platform.OS=='ios'&&<Switch 
                        style={{marginRight:12}}
                        onTintColor='#3491df'
                        value={this.props.value} 
                        onValueChange={(value)=>{this.props.onValueChange(value)}}/>}
                        </View>
        )
    }
}

MXSwitch.propTypes = {
    onValueChange: PropTypes.func,
    onCheckedChange: PropTypes.func,
    checked: PropTypes.bool,
    value: PropTypes.bool,
}

MXSwitch.defaultProps = {
  checked: false,
  value: false,
  onCheckedChange: ()=>{},
  onValueChange: ()=>{},
};
const styles = StyleSheet.create({
})
