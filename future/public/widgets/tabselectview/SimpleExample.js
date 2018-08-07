/*选项卡demo
 *调用方式：<ScrollableTabView
      style={{marginTop: 20, }}
      renderTabBar={() => <DefaultTabBar />}
    >
      <Text tabLabel='Tab #1' style={{marginLeft:80}}>My</Text>
      <Text tabLabel='Tab #2'>favorite</Text>
      <Text tabLabel='Tab #3'>project</Text>
    </ScrollableTabView>;
 *
 */

import React from 'react';
import {
  Text,
} from 'react-native';

import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';

export default React.createClass({
  constructor(props){
    super(props);
    console.log('props >> ', props);
    this.state = {
      title : this.props.items,
    }
  render() {
    return <ScrollableTabView
      style={{marginTop: 20, }}
      renderTabBar={() => <DefaultTabBar />}
    >
      <Text tabLabel='Tab #1' style={{marginLeft:80}}>My</Text>
      <Text tabLabel='Tab #2'>favorite</Text>
      <Text tabLabel='Tab #3'>project</Text>
    </ScrollableTabView>;
  },
});
