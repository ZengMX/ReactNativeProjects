import React, { Component } from "react";
import {
  View,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  InteractionManager,
  PixelRatio,
  StyleSheet
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ScrollableTabView, {
  ScrollableTabBar
} from "react-native-scrollable-tab-view";
import { Fetch } from "future/public/lib";
import {
  BaseView,
  RefreshableListView,
  TextInputC
} from "future/public/widgets";
import SupplierHome from "future/src/supplierHome/components/SupplierHome";
var screenWidth = require("Dimensions").get("window").width;
var screenHeight = require("Dimensions").get("window").height;

class List extends Component {
  constructor(props) {
    super(props);
    this.fetchData = this._fetchData.bind(this);
    this.renderRow = this._renderRow.bind(this);
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.refs && this.refs.listView && this.refs.listView.pullRefresh();
    });
  }

  //获取数据
  _fetchData(page, success, error) {
    new Fetch({
      url: "/app/shop/findMyShopUserPurchaseHistory.json",
      data: {
        pageNumber: page,
        pageSize: 10,
        userId: this.props.sysUserId,
        isFirstSale: this.props.isFirstSale,
        shopNm: this.props.searchCont
      }
    })
      .dofetch()
      .then(data => {
        success(
          data.result,
          10 * (page - 1) + data.result.length,
          data.totalCount
        );
      })
      .catch(err => {
        error && error();
        console.log("=> catch: ", err);
      });
  }

  openComponent = (component, params = {}) => {
    let navigator = this.props.navigator;
    if (navigator) {
      navigator.push({
        component,
        params
      });
    }
  };

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <View style={styles.listItem}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            this.openComponent(SupplierHome, { shopInfId: rowData.shopInfId });
          }}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{rowData.shopNm}</Text>
            {rowData.isFreeze == "Y" && (
              <Text style={{ color: "#ee6723", fontSize: 14 }}>(暂停营业)</Text>
            )}
            <View style={styles.image}>
              <Image
                style={{ width: 6, height: 11 }}
                source={require("future/src/order/res/orderlist/000xiangyousanjiao.png")}
              />
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.line} />

        <View style={styles.bottomContainer}>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.bottomText}>联系人: </Text>
            <Text style={styles.bottomText}>联系地址: </Text>
          </View>
          <View style={{ flexDirection: "column", flex: 1 }}>
            <Text style={styles.bottomText}>
              {rowData.companyContactCeo + "  "}
            </Text>
            <Text style={styles.bottomText}>{rowData.regAddr}</Text>
          </View>
        </View>
      </View>
    );
  }
  render() {
    return (
      <RefreshableListView
        autoRefresh={true}
        ref="listView"
        style={{ flex: 1, backgroundColor: "#f5f5f5" }}
        fetchData={this.fetchData}
        scrollRenderAheadDistance={100} //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行。
        pageSize={10} // 每次事件循环（每帧）渲染的行数。
        initialListSize={0}
        onEndReachedThreshold={200}
        renderRow={this.renderRow}
        stickyHeaderIndices={[]}
        autoLoadMore={true}
      />
    );
  }
}

export default class MySupplier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchWord: "", //搜索关键字
      isFirstSale: "Y" //是否建立首营
    };
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <BaseView
          mainBackColor={{ backgroundColor: "#f4f3f3" }}
          ref={base => (this.base = base)}
          navigator={this.props.navigator}
          mainColor={"#f5f5f5"}
          titlePosition={"center"}
          title={{ title: "我的供应商", tintColor: "#333", fontSize: 18 }}
        >
          <View style={styles.rootView}>
            <View
              style={{
                height: 44,
                borderBottomWidth: 1 / PixelRatio.get(),
                borderColor: "#e5e5e5",
                justifyContent: "center",
                backgroundColor: "#fff"
              }}
            >
              <View style={styles.textInputCContainner}>
                <Image
                  style={{ width: 14, height: 14, marginHorizontal: 5 }}
                  source={require("../res/shopStore/a002sousuo.png")}
                />
                <TextInputC
                  onChangeText={text => {
                    this.setState({
                      searchWord: text
                    });
                  }}
                  returnKeyType={"search"}
                  numberOfLines={1}
                  ref="search"
                  value={this.state.searchWord}
                  clearButtonMode={"while-editing"}
                  placeholder="企业名称"
                  placeholderTextColor="#BBBBBB"
                  style={{ color: "#333333", fontSize: 13, flex: 1 }}
                />
              </View>
            </View>
            <ScrollableTabView
              tabBarBackgroundColor="#fff"
              tabBarInactiveTextColor="#4B5963"
              tabBarUnderlineColor="#0082FF"
              tabBarActiveTextColor="#0082FF"
              tabBarTextStyle={{ fontSize: 13, fontWeight: "700" }}
              onChangeTab={obj => {
                if (obj.i == 0) {
                  this.setState({ isFirstSale: "Y" });
                } else {
                  this.setState({ isFirstSale: "N" });
                }
              }}
              renderTabBar={() => (
                <ScrollableTabBar
                  style={{ height: 42, borderWidth: 0 }}
                  tabStyle={styles.tabStyle}
                  tabsContainerStyle={{ height: 42 }}
                  underlineHeight={3}
                  underlineStyle={{ width: screenWidth / 3 - 10 }}
                />
              )}
            >
              <List
                tabLabel="已建立首营"
                ref="list0"
                searchCont={this.state.searchWord}
                isFirstSale={this.state.isFirstSale}
                navigator={this.props.navigator}
                sysUserId={this.props.params.sysUserId}
              />
              <List
                tabLabel="未建立首营"
                ref="list1"
                searchCont={this.state.searchWord}
                isFirstSale={this.state.isFirstSale}
                navigator={this.props.navigator}
                sysUserId={this.props.params.sysUserId}
              />
            </ScrollableTabView>
          </View>
        </BaseView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    width: screenWidth,
    borderTopWidth: 1 / PixelRatio.get(),
    borderColor: "#e5e5e5",
    backgroundColor: "#f5f5f5"
  },
  titleText: {
    color: "#0C1828",
    fontSize: 14,
    textAlign: "center",
    paddingLeft: 15
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 13
  },
  bottomContainer: {
    flexDirection: "row",
    padding: 15,
    width: screenWidth,
    justifyContent: "center"
  },
  titleContainer: {
    flexDirection: "row",
    height: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  listItem: {
    backgroundColor: "white",
    marginTop: 5,
    flexDirection: "column",
    width: screenWidth
  },
  bottomText: {
    fontSize: 13,
    color: "#55697C",
    marginTop: 5
  },
  line: {
    backgroundColor: "#e9e9e9",
    paddingHorizontal: 10,
    marginHorizontal: 10,
    height: 1 / PixelRatio.get()
  },
  tabStyle: {
    height: 35,
    width: screenWidth / 3,
    flexDirection: "row"
  },
  textInputCContainner: {
    height: 30,
    marginHorizontal: 13,
    backgroundColor: "#ececec",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4
  }
});
