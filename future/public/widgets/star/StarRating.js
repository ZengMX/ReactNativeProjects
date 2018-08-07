// From https://github.com/bluesky0109/react-native-starRating
/*
* npm install react-native-starrating --save
* 属性 :maxStars={5} 显示星星总数
* disabled={false} 是否可用，false 可用，true 不可用。
* rating={5} 默认显示高亮星星个数，starSize：星星缩放级别
*       <StarRating 
*        maxStars={4}
*         rating={2}
*         disabled={false}
*         starSize={30}
*         onStarChange={this.onStarRatingPress.bind(this)}
*         >
*        </StarRating>
*
**/

'use strict';

import React,{Component} from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

export default class StarRating extends Component {
  
  static propTypes = {
    disabled: React.PropTypes.bool,
    maxStars: React.PropTypes.number,
    rating: React.PropTypes.number,
    onStarChange: React.PropTypes.func,
    style: View.propTypes.style,
    starSize: React.PropTypes.number,
  };

  static defaultProps = {
    disabled: true,
    maxStars: 5,
    rating: 0,
  };

  constructor(props) {
    super(props);
    const roundedRating = (Math.round(this.props.rating * 2) / 2);
    this.state = {
      maxStars: this.props.maxStars,
      rating: roundedRating
    }
  }

  pressStarButton (rating) {
    if (!this.props.disabled) {
      if (rating != this.state.rating) {
        if (this.props.onStarChange) {
          this.props.onStarChange(rating);
        }
        this.setState({
          rating: rating,
        });
      }
    }
  }

  render() {
    const starsLeft = this.state.rating;
    const starButtons = [];
    for (let i = 0; i < this.state.maxStars; i++) {
      const starColor = (i + 1) <= starsLeft ? require('./res/003shouchang.png') : require('./res/003shouchang_s.png');
      const starStr = '\u2605'
      starButtons.push(
        <TouchableOpacity
          activeOpacity={0.20}
          key={i + 1}
          onPress={this.pressStarButton.bind(this, (i + 1))}
		  style={{marginHorizontal:this.props.space}}
        >
          {/* <Text style={[starColor,{fontSize:this.props.starSize}]}>{starStr}</Text> */}
		  <Image style={{width: this.props.starSize,height: this.props.starSize}} source={starColor}/>
        </TouchableOpacity>
      );
    }
    return (
      <View style={[styles.starRatingContainer, this.props.style]}>
        {starButtons}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  starRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedColor: {
    color:'#FF4946'
  },
  unSelectedColor:{
    color:'#999999'
  }
});
