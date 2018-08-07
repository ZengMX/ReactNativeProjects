import React,{Component} from 'react';
import {
  Image,
  TouchableOpacity,
} from 'react-native';
/**清除输入框内容
 * type = 'password' 显示隐藏密码 'clear'清除输入框内容
 * clearInput={this._clearInput.bind(this, 'secure',!this.state.secure) }
 * clearInput={this._clearInput.bind(this, 'password','') }
 */
export default class ClearInput extends Component {
  static defaultProps = {
    width:15,
    height:15,
    marginRight:5,
    marginTop:0,
    resizeMode:'contain',
  };
  constructor(props) {
    super(props);
  }
  render() {
    let type=this.props.type || 'clear';
    let image=require('../res/images/000shanchu.png');
    if(type==='password'){
      image=require('../res/images/000xianshimima.png');
    }
    return (
      <TouchableOpacity onPress={this.props.clearInput}>
        <Image
          style={{
            width:this.props.width,
            height:this.props.width,
            marginRight:this.props.marginRight,
            marginTop:this.props.marginTop,
            resizeMode:this.props.resizeMode,}}
          source={image}
          />
      </TouchableOpacity>
    );
  }
}