import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  View,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  InteractionManager,
  StyleSheet
} from "react-native";
import { Fetch, UtilDateTime, imageUtil } from "future/public/lib";
import {
  BaseView,
  MaskModal,
  RefreshableListView,
  Toast,
  Loading
} from "future/public/widgets";
import MoreOperation from "../../commons/moreOperation/components/MoreOperation";
import CommentDetail from "./CommentDetail";

var screenWidth = require("Dimensions").get("window").width;
var screenHeight = require("Dimensions").get("window").height;

export default class CommentList extends Component {
  constructor(props) {
    super(props);
    this.fetchData = this._fetchData.bind(this);
    this.renderRow = this._renderRow.bind(this);
  }
  
  refresh() {
    InteractionManager.runAfterInteractions(() => {
      this.refs && this.refs.listView && this.refs.listView.pullRefresh();
    });
  }

  componentWillMount() {
    this.refresh();
  }

  _fetchData(page, success, error) {
    new Fetch({
      url: "/app/orderComment/findMyComment.json",
      data: {
        pageNum: page,
        limit: 10
      }
    })
      .dofetch()
      .then(data => {
        success(data.result.result, 10 * page, data.result.totalCount);
      })
      .catch(err => {
        error && error(err);
      });
  }

  renderImage(orderProducts) {
    let marginLeft = 0;
    let images =
      orderProducts &&
      orderProducts.map((item, index) => {
        if (index != 0) marginLeft = 10;
        let url = imageUtil.get(item.picUrl);
        return (
          <Image
            key={"renderImage" + index}
            style={{ width: 60, height: 60, marginLeft: marginLeft }}
            source={url}
          />
        );
      });
    return <View style={styles.imageContainer}>{images}</View>;
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <View style={styles.listItem}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigator.push({
              component: CommentDetail,
              params: {
                orderId: rowData && rowData.orderId,
                orderComment: rowData && rowData.orderComment
              }
            });
          }}
        >
          <View style={styles.titleContainer}>
            <View
              style={{ width: 3, height: 16, backgroundColor: "#34457D" }}
            />
            <Text style={{ fontSize: 13, marginLeft: 10, color: "#4f5665" }}>
              订单:{rowData && rowData.orderNum}
            </Text>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "flex-end"
              }}
            >
              <Image
                style={{ marginLeft: 10, width: 6, height: 11 }}
                source={require("future/src/order/res/orderlist/000xiangyousanjiao.png")}
              />
            </View>
          </View>
        </TouchableOpacity>
        {this.renderImage(rowData && rowData.orderProducts)}

        <View style={styles.bottomContainer}>
          <Image
            style={{ width: 12, height: 12 }}
            source={require("future/src/order/res/orderlist/008mendian.png")}
          />
          <Text style={[styles.bottomText, { marginLeft: 5 }]}>
            {rowData &&
              rowData.sysShopInf &&
              rowData.sysShopInf &&
              rowData.sysShopInf.shopNm}
          </Text>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end"
            }}
          >
            <Text style={[styles.bottomText, { marginLeft: 10 }]}>
              {rowData && rowData.finishTimeStr}
            </Text>
          </View>
        </View>
      </View>
    );
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
          title={{ title: "我的评价", tintColor: "#333", fontSize: 18 }}
          rightButton={
            <View style={{ justifyContent: "center" }}>
              <MoreOperation
                navigator={this.props.navigator}
                order={[
                  {
                    module: "index"
                  },
                  {
                    module: "message"
                  },
                  {
                    module: "mine"
                  }
                ]}
              />
            </View>
          }
        >
          <RefreshableListView
            autoRefresh={true}
            autoLoadMore={true}
            ref="listView"
            style={{ flex: 1, backgroundColor: "#f5f5f5" }}
            fetchData={this.fetchData}
            scrollRenderAheadDistance={100} //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行。
            pageSize={10} // 每次事件循环（每帧）渲染的行数。
            initialListSize={0}
            onEndReachedThreshold={200}
            renderRow={this.renderRow}
            stickyHeaderIndices={[]}
          />
        </BaseView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  bottomText: {
    fontSize: 11,
    color: "#55697C"
  },
  bottomContainer: {
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    height: 35
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingRight: 13,
    backgroundColor: "white",
    height: 40,
    alignItems: "center"
  },
  listItem: {
    flexDirection: "column",
    backgroundColor: "#f3f2f2",
    marginTop: 5
  },
  imageContainer: {
    flexDirection: "row",
    paddingRight: 13,
    height: 90,
    paddingLeft: 10,
    alignItems: "center",
    backgroundColor: "#FAFAFA"
  }
});
