import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ListView,
  NativeAppEventEmitter,
} from 'react-native';

import DismissKeyboard from 'dismissKeyboard';
import { BaseView, RightNavBtn, TextInputC } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';
import Fetch from 'future/src/lib/Fetch';
import BMKMapView from '@imall-test/react-native-baidu-map';
import config from 'future/src/config';

var proInfo = {};
let timeout = null;

export default class SelectAddressMap extends Component {
  constructor(props) {
    super(props)
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    var cordeds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds,
      showMap: true,
      showsLocation: false,
      annotations: { latitude: '23.169902534125917', longitude: '113.4416848521153' },
      buttonTitle: '搜索',
      cordDatas: cordeds,
      showsUserLocation: true
    };
    this.loadSuggestionAddress = this._loadSuggestionAddress.bind(this);
  }

  componentDidMount() {
    this.subscription = NativeAppEventEmitter.addListener(
      'EventReminderMap',
      (reminder) => {
        console.log('reminder', reminder);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        if (reminder != undefined) {
          proInfo = { province: reminder.province, city: reminder.city, district: reminder.district };
          this.setState({
            dataSource: ds.cloneWithRows(reminder.polists),
          });
        }
      }
    );
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  _search() {
    if (this.state.showMap == false) {
      this.setState({
        buttonTitle: '搜索',
        showMap: true
      });
      DismissKeyboard();
    }
  }

  _loadSuggestionAddress(keyword) {
    let host = 'http://api.map.baidu.com/place/v2/suggestion';
    let url = host + '?query=' + encodeURI(keyword) + '&region=' + encodeURI('全国') + '&output=json&' + 'ak=' + config.map_apikey + '&mcode=' + config.b_id;
    new Fetch({
      url: url,
      method: 'GET'
    }).dofetch().then((data) => {
      this.setState({
        cordDatas: this.state.cordDatas.cloneWithRows(data.result),
      })
    }, (err) => { });
  }

  render() {
    return (
      <BaseView ref={base => this.base = base}
        navigator={this.props.navigator}
        rightButton={(<RightNavBtn title={this.state.buttonTitle} handler={this._search.bind(this)} />)}
        head={(<View ref='modal' style={{ flex: 1, height: 30, marginLeft: 30, marginRight: 55, backgroundColor: '#fff' }}>
          <TextInputC
            ref={'textfield'}
            maxLength={20}
            clearButtonMode={'while-editing'}
            placeholder={'输入地址关键字'}
            onFocus={() => {
              this.setState({
                showMap: false,
                buttonTitle: '取消'
              })
            }}
            onChangeText={(text) => {
              if (timeout) clearTimeout(timeout);
              timeout = setTimeout(() => {
                this.loadSuggestionAddress(text);
                this.setState({
                  showMap: false
                });
                if (timeout) clearTimeout(timeout);
              }, 300);
            }}
            style={{ flex: 1, fontSize: 12, paddingLeft: 10 }} />
        </View>)}>
        {this.state.showMap ?
          <DefaultMap
            selectAddress={(rowID, rowData) => {
              if (this.props.params.selectAddress) {
                this.props.params.selectAddress(Object.assign({}, rowData, proInfo));
                this.props.navigator.pop();
              }
            }}
            showsUserLocation={this.state.showsUserLocation}
            center={this.state.annotations}
            dataSource={this.state.dataSource} /> :
          <SearchList
            onSelect={(selectData) => {
              this.refs.textfield.blur();
              this.setState({
                showMap: true,
                showsUserLocation: false
              })
              setTimeout(() => {
                this.setState({
                  annotations: { latitude: selectData.location.lat, longitude: selectData.location.lng },
                })
              }, 1000);
            }}
            dataSource={this.state.cordDatas} />}
      </BaseView>
    )
  }
}

class DefaultMap extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
    selectAddress: () => { },
    showsUserLocation: false
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <TouchableOpacity style={{ height: 60, alignItems: 'center', justifyContent: 'center' }} onPress={() => { this.props.selectAddress(rowID, rowData) }}>
        <View style={{ width: Styles.theme.W - 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={require('./res/weizhi.png')} style={{ width: 10, height: 14 }} />
            <Text style={{ marginLeft: 10, color: '#2fbdc8' }}>{rowID == 0 ? '[当前]' : ''}</Text>
            <Text>{rowData.name}</Text>
          </View>
          <Text style={{ color: '#5b5b5b', fontSize: 13, marginTop: 3, marginLeft: 20 }}>{rowData.address}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  _renderSeparator(sectionID, rowID) {
    return (
      <View style={{ backgroundColor: '#5b5b5b', height: Styles.theme.BW, marginLeft: 10 }} key={rowID}>
      </View>
    )
  }

  render() {
    return (
      <View>
        <BMKMapView
          mapType={1}
          zoomLevel={18}
          zoomEnabled={true}
          showsUserLocation={this.props.showsUserLocation}
          center={this.props.center}
          ref='map'
          style={{ width: Styles.theme.W, height: 180, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('./res/weizhi_s.png')} style={{ width: 6, height: 10 }} />
        </BMKMapView>
        <ListView
          style={{ width: Styles.theme.W, height: Styles.theme.H - 244, backgroundColor: '#fff' }}
          renderRow={this._renderRow.bind(this)}
          renderSeparator={this._renderSeparator.bind(this)}
          dataSource={this.props.dataSource} />
      </View>
    )
  }
}

class SearchList extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
    onSelect: () => { }
  }

  _renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableOpacity style={{ height: 60, width: Styles.theme.W, justifyContent: 'center', paddingLeft: 10, paddingRight: 10 }} onPress={() => {
        this.props.onSelect(rowData);
      }}>
        <Text style={{ color: '#333', marginLeft: 10 }} numberOfLines={1}>{rowData.name}</Text>
        <Text style={{ color: '#999', marginTop: 2, marginLeft: 10 }} numberOfLines={2}>{rowData.city + '-' + rowData.district}</Text>
      </TouchableOpacity>
    )
  }

  _renderSeparator(sectionID, rowID) {
    return (
      <View style={{ backgroundColor: '#e3e3e3', height: Styles.theme.BW }} key={rowID}></View>
    )
  }

  render() {
    return (
      <ListView
        enableEmptySections={true}
        style={{ marginTop: 0, width: Styles.theme.W, height: Styles.theme.H - 64, backgroundColor: '#fff', position: 'absolute' }}
        renderRow={this._renderRow.bind(this)}
        renderSeparator={this._renderSeparator.bind(this)}
        dataSource={this.props.dataSource} />
    )
  }
}