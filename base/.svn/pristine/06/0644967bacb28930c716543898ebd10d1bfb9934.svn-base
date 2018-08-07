// 引入官方组件
import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
// 引入自定义组件
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';



export default class ScrollViewTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false
    };
  }


  componentWillMount() {
    this.timer && clearInterval(this.timer);
  }

  onRefresh = () => {
    this.setState({ isRefreshing: true });
    this.timer = setTimeout(() => {
      this.setState({ isRefreshing: false });
    }, 2000)
  }

  onScroll = (e) => {
    console.log('onScroll', e.nativeEvent.contentOffset.y)
  }

  content = (text, i) => {
    return (
      <View key={i} style={styles.content}>
        <Text style={styles.contentText}>{text}</Text>
      </View>
    );
  }

  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: 'ScrollView', tintColor: '#fff' }}
      >
        <ScrollView
          ref={scrollView => this.scrollView = scrollView}
          contentContainerStyle={{ padding: 20, backgroundColor: '#FFFF00' }}
          horizontal={false}
          pagingEnabled={false}
          onScroll={this.onScroll}
          scrollEventThrottle={0}
          automaticallyAdjustContentInsets={false}
          style={[styles.scrollView, styles.horizontalScrollView]}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh}
            />}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(this.content)}
        </ScrollView>

        <TouchableOpacity
          style={styles.button}
          onPress={() => { this.scrollView.scrollTo({ x: 0 }); }}>
          <Text>Scroll to start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => { this.scrollView.scrollToEnd({ animated: true }); }}>
          <Text>Scroll to end</Text>
        </TouchableOpacity>

      </BaseView>
    );
  }
}

const styles = Styles.create({
  scrollView: {
    backgroundColor: '#eeeeee',
    height: 300,
  },
  horizontalScrollView: {
    height: 106,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 5,
  },
  button: {
    margin: 5,
    padding: 5,
    alignItems: 'center',
    backgroundColor: '#cccccc',
    borderRadius: 3,
  },
  content: {
    margin: 5,
    padding: 5,
    backgroundColor: '#cccccc',
    borderRadius: 3,
    minWidth: 96,
  },
  contentText: {
    width: 64,
    height: 64,
  }
});