import React, { Component } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  PixelRatio
} from "react-native";
import { Fetch } from "future/public/lib";
import {
  NavBar,
  StarRating,
  RefreshableListView
} from "future/public/widgets";
// import NewRefreshableListView from "future/public/widgets/listview/NewRefreshableListView";
import MoreOperation from "../../commons/moreOperation/components/MoreOperation";
import imageUtil from "future/public/lib/imageUtil";
import ConvertUtil from "future/public/lib/ConvertUtil";
import ImageBigBtnList from "future/public/widgets/ImageBigBtn/ImageBigBtnList";
import ProductDetail from '../../product/components/ProductDetail';

const screenW = Dimensions.get("window").width;
const screenH = Dimensions.get("window").height;

export default class CommentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null
    };
    this.fetchData = this._fetchData.bind(this);
    this.renderHead = this._renderHead.bind(this);
    this.renderRow = this._renderRow.bind(this);
    this.orderId = this.props.params.orderId;
  }

  componentWillMount() {
    this.refs&&this.refs.list&&this.refs.list.pullRefresh();
  }

  _fetchData(page, success, error) {
    new Fetch({
      url: "/app/orderComment/findMyCommentDetail.json",
      data: { orderId: this.orderId }
    })
      .dofetch()
      .then(data => {
        this.setState({ result: data.result });
        success(data.result.orderProducts, page * 10, 10);
      })
      .catch(err => {
        error && error(err);
      });
  }

  _renderHead() {
    this.data = this.state.result;
    return (
      <View
        style={styles.headRootView}
      >
        <View
          style={styles.titleContainer}
        >
          <Text style={{ fontSize: 15.5, color: "#0C1828" }}>
            订单：{this.data && this.data.orderNum}
          </Text>
          <Text style={{ color: "#55697C", fontSize: 11, marginTop: 5 }}>
            {this.data && this.data.finishTimeStr+' '+this.data.orderTime}
          </Text>
        </View>

        <View style={{ flexDirection: "column", width: screenW }}>
          <View
            style={{
              paddingHorizontal: 13,
              marginTop: 5,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
              height: 35
            }}
          >
            <Image
              style={{ width: 12, height: 12 }}
              source={require("future/src/order/res/orderlist/008mendian.png")}
            />
            <Text style={{ fontSize: 12, marginLeft: 5, color: "#55697C" }}>
              {this.data && this.data.sysShopInf.shopNm}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFF",
              paddingBottom: 13.5,
              flexWrap: "wrap"
            }}
          >
            <View
              style={{
                width: screenW / 2,
                paddingLeft: 13,
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <Text style={{ fontSize: 12, color: "#55697C" }}>描述相符</Text>
              <StarRating
              style={styles.starRatingStyle}
				maxStars={5}
				space={2.5}
                rating={
                  this.props.params.orderComment ? (
                    this.props.params.orderComment.productDescrSame
                  ) : (
                    0
                  )
                }
                disabled={true}
                starSize={12}
              />
            </View>
            <View
              style={{
                width: screenW / 2,
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <Text style={{ fontSize: 12, color: "#55697C" }}>服务态度</Text>
              <StarRating
              style={styles.starRatingStyle}
				maxStars={5}
				space={2.5}
                rating={
                  this.props.params.orderComment ? (
                    this.props.params.orderComment.sellerServiceAttitude
                  ) : (
                    0
                  )
                }
                disabled={true}
                starSize={12}
              />
            </View>
            <View
              style={{
                width: screenW / 2,
                flexDirection: "row",
                paddingLeft: 13,
                paddingTop: 5,
                alignItems: "center"
              }}
            >
              <Text style={{ fontSize: 12, color: "#55697C" }}>物流速度</Text>
              <StarRating
              style={styles.starRatingStyle}
				maxStars={5}
				space={2.5}
                rating={
                  this.props.params.orderComment ? (
                    this.props.params.orderComment.sellerSendOutSpeed
                  ) : (
                    0
                  )
                }
                disabled={true}
                starSize={12}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  _renderRow(rowData, sectionID, rowID) {
    return (
      <View
        style={styles.listItem}
      >
        {rowData.appCommentVo && (
          <View>
            <View
              style={{
                width: screenW / 2,
                flexDirection: "row",
                paddingTop: 15,
				alignItems: "center",			
              }}
            >
              <Text style={{ fontSize: 12, color: "#55697C" }}>
                {rowData.appCommentVo.commentTimeString.replace(/-/g,'.')}
              </Text>
              <StarRating
                style={styles.starRatingStyle}
				maxStars={5}
				space={2.5}
                rating={rowData.appCommentVo.score}
                disabled={true}
                starSize={12}
              />
            </View>
			{rowData.appCommentVo.commentCont != ''&&
				<Text style={{ fontSize: 13, color: "#0C1828", marginTop: 9 }}>
				{rowData.appCommentVo.commentCont}
				</Text>
			}
			{rowData.appCommentVo.commentPictList &&
				<ScrollView
				horizontal={true}
				showsHorizontalScrollIndicator={false}
				>
				<View
					style={{ flexDirection: "row", marginTop: 10, width: screenW }}
				>					
					{rowData.appCommentVo.commentPictList.length > 0 ? (
					<ImageBigBtnList
						urls={rowData.appCommentVo.commentPictList}
						length={5}
						fixImageUrl={orgin_Url => {
						return imageUtil.get(
							imageUtil.replaceSpec(orgin_Url, "130X130")
						);
						}}
					/>
					) : null}
				</View>
				</ScrollView>
			}	
            <TouchableOpacity onPress={()=>{				
					this.props.navigator.push({
						component:ProductDetail,
						params:{
							productId:rowData.productId
						}
					})
				}}
              style={{
                flexDirection: "row",
                height: 85,
                marginTop: 13,
                marginBottom: 13,
                marginRight: 13
              }}
            >
              <Image
                style={{ width: 77, height: 77, margin: 4 }}
                source={imageUtil.get(rowData.picUrl)}
                resizeMode={"stretch"}
              />
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  backgroundColor: "#f6f6f6",
                  alignItems: "flex-start",
                  justifyContent: "flex-start"
                }}
              >
                <Text style={{ fontSize: 12, color: "#55697C", padding: 5 }}>
                  {rowData.title}
                </Text>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text
                    style={{ fontSize: 12, color: "#0C1828", paddingLeft: 5 }}
                  >
                    ¥
                    <Text style={{ fontSize: 15, color: "#0C1828" }}>
                      {ConvertUtil.toFixed(rowData.itemAmount)}
                    </Text>
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
        <NavBar
          title={{ title: "评价详情", tintColor: "#000" }}
          navigator={this.props.navigator}
          mainColor={"#FAFAFA"}
          style={{ backgroundColor: "#FAFAFA" }}
          deep={true}
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
        />
        
        <RefreshableListView
        	autoRefresh={true}
			ref="list"
			style={{ flex: 1,backgroundColor:'#f5f5f5' }}
			fetchData={this.fetchData}
			scrollRenderAheadDistance={100} //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行。
			pageSize={10} // 每次事件循环（每帧）渲染的行数。
			initialListSize={0}
			onEndReachedThreshold={200}
			renderRow={this.renderRow}
			stickyHeaderIndices={[]}	
			autoLoadMore={true}
			renderHeader={this.renderHead}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  starRatingStyle: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5
  },
  headRootView: {
    backgroundColor: "#F3f2f2",   
	flexDirection: "column",
	borderTopWidth:1/PixelRatio.get(),
	borderColor:'#e5e5e5'
  },
  titleContainer:{
    backgroundColor: "#FFF",
    justifyContent: "center",
    paddingLeft: 13,
    paddingVertical: 15
  },
  listItem: {
    flexDirection: "column",
    width: screenW,
    backgroundColor: "white",
	marginTop: 5,	
    paddingLeft: 13
  }
});
