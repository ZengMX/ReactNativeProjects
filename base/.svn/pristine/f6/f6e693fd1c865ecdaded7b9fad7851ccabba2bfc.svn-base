import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

var dimensW = Dimensions.get('window').width;
var dimensH = Dimensions.get('window').height;

export default class CustomTabBar extends Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    page: React.PropTypes.number,
    tabs: React.PropTypes.array,
    onChangeTab: React.PropTypes.func,
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft:50,
          marginRight:80,
          height: 30,
        }}>
        {
          this.props.tabs.map((tab, i) => {
            return (
              <TouchableOpacity
                activeOpacity={1}
                key={tab}
                onPress={() => { this.props.onChangeTab(i) }} >
                <View name={tab} style={[styles.tabStyle, this.props.page == i ? styles.selectedborder : styles.unselectedborder]}>
                  <Text style={this.props.page == i ? styles.selectedStl : styles.unselectedStl}>{tab}</Text>
                </View>
              </TouchableOpacity>
            )
          })
        }
      </View>
    )
  }
}

var styles = StyleSheet.create({
  tabStyle: {
    paddingVertical: 0,
    width: (dimensW - 160) / 3,
    height: 30,
    backgroundColor: 'rgba(0,0,0,0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedborder: {
    borderBottomColor: '#fff',
    borderBottomWidth: 2,
  },
  unselectedborder: {
    borderBottomColor: '#fff',
    borderBottomWidth: 0,
  },
  selectedStl: {
    color: 'white',
    fontSize: 12,
  },
  unselectedStl: {
    color: 'black',
    fontSize: 12,
  },
});
