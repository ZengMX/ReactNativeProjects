/**
 * 加载中的测试，演示了如何切换加载中到实际视图的书写
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  Picker,
  TouchableHighlight,
  Platform
} from 'react-native';
const PickerItem = Picker.Item;
import { BaseView } from 'future/src/widgets';
var Spinner = require('react-native-spinkit');
var iosOnly = ['WordPress', 'Arc', 'ArcAlt']
var base = [
  'CircleFlip',
  'Bounce',
  'Wave',
  'WanderingCubes',
  'Pulse',
  'ChasingDots',
  'ThreeBounce',
  'Circle',
  '9CubeGrid',
  'FadingCircle',
  'FadingCircleAlt'
];

var types = base;
if (Platform.OS == 'ios') {
  types = base.concat(iosOnly);
}

export default class LoadingView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      type: 'Bounce',
      selectType: 'CircleFlip'
    }
  }
  componentDidMount() {
    setTimeout(() => this.setState({ loaded: true }), 1000);
  }
  onValueChange(key, value) {
    this.setState({
      selectType: value
    });
  }
  onPress() {
    this.setState({
      loaded: false,
      type: this.state.selectType
    });
    setTimeout(() => this.setState({ loaded: true }), 2000);
  }
  render() {
    if (!this.state.loaded) {
      return (
        <BaseView style={{ flex: 1 }} navigator={this.props.navigator}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Spinner size={80} isVisible={!this.state.loaded} type={this.state.type} color={'#0099cc'} />
          </View>
        </BaseView>

      );
    } else {
      const items = types.map((value, idx) => {
        return <PickerItem key={'idx' + idx} label={value} value={value} />
      })

      return (
        <BaseView style={{ flex: 1 }}
          navigator={this.props.navigator}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Picker
              style={{ width: 200, height: 250 }}
              selectedValue={this.state.selectType}
              onValueChange={this.onValueChange.bind(this, 'type')}
              mode="dropdown">
              {items}
            </Picker>
            <TouchableHighlight
              style={{
                borderRadius: 3,
                paddingVertical: 5,
                paddingHorizontal: 10,
                backgroundColor: 'green',
                marginBottom: 10
              }}
              underlayColor="green"
              onPress={this.onPress.bind(this)}
            >
              <Text>确认</Text>
            </TouchableHighlight>
          </View>
        </BaseView>
      );
    }
  }
}
