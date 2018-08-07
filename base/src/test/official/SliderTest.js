// 引入官方组件
import React, { Component } from 'react';
import {
  View,
  Text,
  Slider,
} from 'react-native';
// 引入自定义组件
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';


class SliderExample extends React.Component {
  static defaultProps = {
    value: 0,
  };

  state = {
    value: this.props.value,
  };

  render() {
    return (
      <View>
        <Text style={styles.text} >
          {this.state.value && +this.state.value.toFixed(3)}
        </Text>
        <Slider
          {...this.props}
          onValueChange={(value) => this.setState({ value: value })} />
      </View>
    );
  }
}

export default class SliderTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: 'Slider', tintColor: '#fff' }}
      >
        <SliderExample
          value={0.5}
          minimumValue={-1}
          maximumValue={2}
          minimumTrackTintColor="#0066FF"
          maximumTrackTintColor="#00FF00"
        />

        <SliderExample
          thumbImage={require('./res/poke.png')}
          trackImage={require('./res/slider.png')}
        />

      </BaseView>
    );
  }
}

const styles = Styles.create({
  text: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    margin: 10,
  },
});