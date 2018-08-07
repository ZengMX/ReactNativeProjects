import React, { Component } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  Dimensions,
  PixelRatio,
  Alert,
  ScrollView,
  Platform,
  findNodeHandle
} from "react-native";
import { Fetch } from "future/public/lib";
import {
  NavBar,
  Toast,
  Loading,
  WebViewPage
} from "future/public/widgets";
import RCTDeviceEventEmitter from "RCTDeviceEventEmitter";
import ScrollableTabView, {ScrollableTabBar} from "react-native-scrollable-tab-view";
import PhotoBrowser from "@imall-test/react-native-photobrowser";
import imageUtil from "future/public/lib/imageUtil";
const screenW = Dimensions.get("window").width;
const screenH = Dimensions.get("window").height;

export default class SupplierDetail extends Component {
  constructor(props) {
    super(props);

    this.shopInfo =
      this.props.params && this.props.params.shopInfo
        ? this.props.params.shopInfo
        : {};
    this.state = {
      hasCollectShop: this.props.params && this.props.params.hasCollectShop,
      shopCollectionNum: this.props.params && this.props.params.shopCollectNum,
      isAlreadyLoad:false,
      levelIconWidth:1,
      levelIconHeight:1
    };
    this.collected = require("../res/images/001yishoucang.png");
    this.unCollected = require("../res/images/001shoucang.png");
  }

  componentWillMount() {
    new Fetch({
      url: "/app/shop/getLicenseList.json",
      data: {
        shopId: this.shopInfo.shopInfId
      }
    })
      .dofetch()
      .then(data => {
        this.LicenseListData = data.result;
      })
      .catch(error => {
        console.log("error", error);
      });
  }

  componentWillUnmount() {
    this.props.params.callback &&
      this.props.params.callback({
        hasCollectShop: this.state.hasCollectShop,
        shopCollectNum: this.state.shopCollectionNum
      });
  }

  _collectShop() {
    let hasCollectShop = this.state.hasCollectShop,
      type = hasCollectShop ? "N" : "Y", // params: action Y:收藏 N:取消收藏
      shopId = this.shopInfo.shopInfId;

    //Loading的方式
    Loading.show();
    new Fetch({
      url: "app/user/collectionShop.json?type=" + type + "&shopId=" + shopId,
      method: "GET"
    })
      .dofetch()
      .then(data => {
        Loading.hide();
        let msg = !hasCollectShop ? "收藏成功" : "已取消收藏";
        if (data && data.success) {
          RCTDeviceEventEmitter.emit("changeShopCollect", shopId);
          this.setState({
            hasCollectShop: !hasCollectShop,
            shopCollectionNum: !hasCollectShop
              ? this.state.shopCollectionNum + 1
              : this.state.shopCollectionNum - 1
          });
          return Toast.show(msg);
        } else if (data.errorCode === "errors.login.noexist") {
          return Toast.show("请先登录");
        } else {
          return Toast.show("收藏失败");
        }
      })
      .catch(err => {
        Loading.hide();
        console.log("修改收藏失败 ----->", err);
      });
  }

  _onLoadWithAttesationLogo(url,imageRef){
    Image.getSize(url,(width,height) =>{
      imageRef.setNativeProps({
        style: {
          width: width,
          height:height
        }
      });
   },(error)=>{
    console.log('获取图片宽高失败',error)
  });
  }

  renderAttesationLogo(attesationLogoUrlList) {
    let marginLeft = 0;
    let images = attesationLogoUrlList.map((item, index) => {
      if (index != 0) marginLeft = 5;
      let url=imageUtil.get(item);
      return (
        <Image
          key={"image" + index}
          ref={"image" + index}
          resizeMode={'stretch'}
          style={{ width: 60, height: 16.5, marginLeft: marginLeft }}
          source={url}
          onLoadEnd = {()=>this._onLoadWithAttesationLogo(item,this.refs["image" + index])}
        />
      );
    });
    return images;
  }


  _onLoadWithLevelIcon(url){
    if (!this.state.isAlreadyLoad) {
      this.state.isAlreadyLoad = true;
      Image.getSize(url,(width,height) =>{
         this.setState({
           levelIconWidth:width,
           levelIconHeight:height
          });
      },(error)=>{
        console.log('获取图片宽高失败',error)
      });
    }
  }

  renderSupplierDetail() {
    let shopData = this.shopInfo;
    console.log("shopInfo", shopData);
    let logoImg =
      shopData &&
      (!shopData.shopLogo || shopData.shopLogo.indexOf("noPic") != -1)
        ? require("../res/images/018morendianpu.png")
        : { uri: shopData.shopLogo };

    // 店铺收藏人数
    let collectNumber = 0;
    if (shopData) {
      collectNumber =
        this.state.shopCollectionNum / 10000 >= 1
          ? (this.state.shopCollectionNum / 10000).toFixed(2) + "万"
          : this.state.shopCollectionNum;
    }
    return (
      <ScrollView>
        {/* <View style={{borderTopWidth: 1/PixelRatio.get(),borderColor:'#E5E5E5',}}>
			<View
				style={{height:70,flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:8,backgroundColor:'#fff'}}
			>
				<View style={{flexDirection:'row',flex:1,}}>
					<View style={{width:50,height:50,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',borderRadius:6,borderColor:'#333',borderWidth:1/PixelRatio.get()}}>
						<Image source={logoImg} style={{width:40,height:40,}} />
					</View>
					<View style={{backgroundColor:'transparent',marginLeft:9,marginTop:5,flex:1,}}>
						<Text style={{fontSize:14,color:'#333',fontWeight:'700',}} numberOfLines={1}>{shopData && shopData.shopNm}</Text>
					</View>
				</View>
				<View style={{backgroundColor:'transparent',alignItems:'center',marginTop:16.5,width:60,}}>
					<TouchableOpacity
						underlayColor={'#cb1217'}
						onPress={()=>{ this._collectShop()}}
						style={{alignItems:'center',}}
					>
						<Image
							source={this.state.hasCollectShop?this.collected:this.unCollected}
							style={styles.collectImg}
						/>
						<Text style={{fontSize:11,color:'#4B5963',}}>{collectNumber}人</Text>
					</TouchableOpacity>
				</View>
			</View>
		</S>
		<View style={{height:50,flexDirection:'row',}}>
			<View style={[styles.tab,]}>
				<Text style={{ fontSize: 11, color: '#333', paddingBottom: 7 }}>{typeof shopData.allProductNum === 'number'?shopData.allProductNum:0}</Text>
				<Text style={[{color: '#333', fontSize:11,},]}>全部商品</Text>
			</View>
			<View style={[styles.tab,]}>
				<Text style={{fontSize:11,color:'#333',paddingBottom:7}}>{typeof shopData.hotSaleProductNum === 'number'?shopData.hotSaleProductNum:0}</Text>
				<Text style={[{color: '#333', fontSize:11,},]}>热卖商品</Text>
			</View>
			<View style={[styles.tab,]}>
				<Text style={{fontSize:11,color:'#333',paddingBottom:7}}>{typeof shopData.newProductNum === 'number'?shopData.newProductNum:0}</Text>
				<Text style={[{color: '#333', fontSize:11,},]}>上新</Text>
			</View>
		</View> */}

        <View style={{ backgroundColor: "#fff", marginTop: 5 }}>
          <View style={styles.listItem}>
            <Text style={styles.title}>公司名称</Text>
            <Text style={{ color: "#37474f", fontSize: 13, paddingRight: 20 }}>
              {shopData && shopData.companyNm}
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.title}>注册地址</Text>
            <Text style={{ color: "#37474f", fontSize: 13, paddingRight: 80 }}>
              {shopData && shopData.address}
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.title}>注册资金</Text>
            <Text style={{ color: "#37474f", fontSize: 13, paddingRight: 20 }}>
              {shopData && shopData.regCapital}万元
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.title}>公司简介</Text>
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              activeOpacity={0.7}
              onPress={() => {
                this.props.navigator.push({
                  component: WebViewPage,
                  params: {
                    title: "公司简介",
                    url: "/app/shopDetail.jsp?shopId=" + shopData.shopInfId
                  }
                });
              }}
            >
              <Text style={{ color: "#37474f", fontSize: 13 }}>
                {shopData && shopData.shopDescrStr}
              </Text>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "flex-end",
                  paddingRight: 85
                }}
              >
                <Image
                  style={{ width: 6, height: 11 }}
                  source={require("future/src/order/res/orderlist/000xiangyousanjiao.png")}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ width: screenW, backgroundColor: "#fff", marginTop: 5 }}>
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 12,
              flexDirection: "row",
              backgroundColor: "#fff"
            }}
          >
            <Text style={[styles.title]}>经营范围</Text>
            <Text style={{ color: "#37474f", fontSize: 13, paddingRight: 80 }}>
              {shopData && shopData.businessRange}
            </Text>
          </View>
        </View>

        <View style={{ backgroundColor: "#fff", marginTop: 5 }}>
          <View style={styles.listItem}>
            <Text style={styles.title}>信用等级</Text>
            <Image
            style={{width:this.state.levelIconWidth,height:this.state.levelIconHeight}}
            resizeMode={'stretch'}
              source={imageUtil.get(shopData && shopData.levelIconUrl)}
              onLoadEnd = {()=>this._onLoadWithLevelIcon(shopData && shopData.levelIconUrl)}
            />
          </View>
          <View style={styles.listItem}>
            <Text style={styles.title}>认证图标</Text>
            {this.renderAttesationLogo(
              shopData && shopData.attesationLogoUrlList
            )}
          </View>
        </View>

        <View style={{ backgroundColor: "#fff", marginTop: 5 }}>
          <View style={styles.listItem}>
            <Text style={styles.title}>描述相符</Text>
            <Text style={{ color: "#34457D", fontSize: 13, paddingRight: 20 }}>
              {typeof shopData.productDescrSame === "number" ? (
                shopData.productDescrSame
              ) : (
                0
              )}分
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.title}>服务态度</Text>
            <Text style={{ color: "#34457D", fontSize: 13, paddingRight: 20 }}>
              {typeof shopData.sellerServiceAttitude === "number" ? (
                shopData.sellerServiceAttitude
              ) : (
                0
              )}分
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.title}>物流速度</Text>
            <Text style={{ color: "#34457D", fontSize: 13, paddingRight: 20 }}>
              {typeof shopData.sellerSendOutSpeed === "number" ? (
                shopData.sellerSendOutSpeed
              ) : (
                0
              )}分
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.listItem,
            { justifyContent: "space-between", marginTop: 5 }
          ]}
          onPress={() => {
            if (shopData.tel) {
              Alert.alert("温馨提示", "拔打" + shopData.tel, [
                { text: "取消", onPress: () => {} },
                {
                  text: "确认",
                  onPress: () => Linking.openURL("tel:" + shopData.tel)
                }
              ]);
            } else {
              Alert.alert("温馨提示", "该商家暂时没有提供联系电话");
            }
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.title}>服务电话</Text>
            <Text
              style={{
                fontSize: 13,
                color: "#37474f",
                alignSelf: "flex-start"
              }}
            >
              {shopData.tel ? shopData.tel : "--"}
            </Text>
          </View>
          <Image
            source={require("../res/images/002dianhau.png")}
            style={{ width: 17, height: 17 }}
          />
        </TouchableOpacity>
        <View style={styles.listItem}>
          <Text style={styles.title}>客服在线</Text>
          <Text style={{ fontSize: 13, color: "#37474f", flex: 1 }}>
            {shopData.csadOnlineDescr}
          </Text>
        </View>
        {/* <View style={styles.listItem}>
			<Text style={styles.title}>开店时间</Text>
			<Text style={{fontSize:13,color:'#37474f',}}>{shopData.startDateString}</Text>
		</View> */}
        <View
          style={{ backgroundColor: "#fff", marginTop: 5, marginBottom: 15 }}
        >
          <View style={styles.listItem}>
            <Text style={styles.title}>所在地区</Text>
            <Text style={{ fontSize: 13, color: "#37474f", flex: 1 }}>
              {shopData.shopZone}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  _showBigPicture(event, licenseFileList,refStr) {
    let urlArray = [];
    licenseFileList.map((item, index) => {
      urlArray.push(item.fileUrl);
    });
    if (Platform.OS == "android") {
      event._targetInst.measure((x, y, width, height, locationX, locationY) => {
        PhotoBrowser.browserWithUrlImages_android({
          locationArray: [width, height, locationX, locationY] /**位置数组**/,
          urlArray: urlArray /**图片url数组**/,
          position: 0 /**index为图片当前的索引，索引从0开始**/,
          rnPageName: null /**是否要在原生嵌入RN页面。要嵌入就填js文件名称，如test.js就填test,在此之前需要生成test.bundle文件(生成bundle操作看下面)，如果不要嵌入RN页面此处填null**/
        });
      });
    } else {
      PhotoBrowser.browserWithUrlImages_ios({
        comArray: [parseFloat(findNodeHandle(this.refs[refStr]))], //（数组）  Component的 reactTag 的数组 （可与 url 数组数量不相等）,不传默认为空数组
        urls: urlArray,
        index: 0, //（Int）   点击的图片index 不传，默认为0
        start: 0 //（Int）   参数一的第一个Component 对应的 图片 index  不传，默认为0
        // detailCom:renderCom                                                       //（数组）  扩展的内容的Component数组 不传，默认空数组
      });
    }
  }

  renderSupplierQualification() {
    let itemView =
      this.LicenseListData &&
      this.LicenseListData.map((data, index) => {
		let marginLeft = 2;
		let boxMarginLeft=0;
		if (index % 2 == 0) {
			marginLeft = 8;
			boxMarginLeft=5;
		}
		else {
			marginLeft=2;
			boxMarginLeft=0;
		}
        return (
          <View
            key={"itemView" + index}
            style={{
              flexDirection: "column",
              height: screenW / 2 - 10 + 50,
              marginTop: 20
            }}
          >
            <View
              style={{
				      marginTop:5,
				      marginBottom:5,
				      marginLeft:boxMarginLeft,
				      marginRight:5,
              borderColor: "gray",
              borderRadius: 5,
              backgroundColor: "white",
              width: screenW / 2 - 10,
              height: screenW / 2 - 10,
              marginLeft: marginLeft,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 0.2 / PixelRatio.get(),
              borderColor: "gray",
              shadowColor: "gray",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.2
            }}
          >
              <TouchableOpacity
                activeOpacity={1}
                onPress={event => {
                  this._showBigPicture(event, data.licenseFileList,'itemView'+index);
                }}
              >
                <Image
                  resizeMode={'stretch'}
                  ref={'itemView'+index}
                  style={{ width: screenW / 2 - 20, height: screenW / 2 - 20 }}
                  source={
                    imageUtil.get(data.templateFileUrl)
                  }
                />
              </TouchableOpacity>
              {/* <Image style={{width:screenW/2-20,height:screenW/2-20,marginTop:15}} source={{uri:data.licenseFileList[0].fileUrl}}/> */}
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text
                style={{
                  textAlign: "center",
                  width: screenW / 2 - 10,
                  fontSize: 14,
                  color: "#37474F",
                  marginTop: 3,
				          paddingBottom:10,
                }}
              >
                {data.sysLicenseNm}
              </Text>
            </View>
          </View>
        );
      });
    if(this.LicenseListData &&this.LicenseListData.length==0){
      return (
      <View
      style={{
        backgroundColor: "white",
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:50
      }}
    >
     <Text style={{fontSize:20,color:'black'}}>暂无数据</Text>
    </View>
      )
    }else{
      return (
        <ScrollView>
          <View
            style={{
              backgroundColor: "white",
              flexDirection: "row",
              flexWrap: "wrap",
              marginTop: 5,
              marginBottom: 17.5,
              paddingBottom: 17.5 * 2
            }}
          >
            {itemView}
          </View>
        </ScrollView>
      );
    }
  }

  render() {
    let shopData = this.shopInfo;
    let logoImg =
      shopData &&
      (!shopData.shopLogo || shopData.shopLogo.indexOf("noPic") != -1)
        ? require("../res/images/018morendianpu.png")
        : { uri: shopData.shopLogo };

    // 店铺收藏人数
    let collectNumber = 0;
    if (shopData) {
      collectNumber =
        this.state.shopCollectionNum / 10000 >= 1
          ? (this.state.shopCollectionNum / 10000).toFixed(2) + "万"
          : this.state.shopCollectionNum;
    }

    return (
      <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
        <NavBar
          title={{ title: "店铺详情", tintColor: "#000" }}
          navigator={this.props.navigator}
          mainColor={"#FAFAFA"}
          style={{ backgroundColor: "#FAFAFA" }}
          deep={true}
        />

        <ScrollableTabView
          tabBarBackgroundColor="#fff"
          tabBarInactiveTextColor="#4B5963"
          tabBarUnderlineColor="#0082FF"
          tabBarActiveTextColor="#0082FF"
          tabBarTextStyle={{ fontSize: 13, fontWeight: "700" }}
          onChangeTab={obj => {
            this.setState({ currentPage: obj.i });
          }}
          renderTabBar={() => (
            <ScrollableTabBar
              style={{ height: 42, borderWidth: 0 }}
              tabStyle={{
                height: 35,
                width: screenW / 3,
                flexDirection: "row"
              }}
              tabsContainerStyle={{ height: 42 }}
              underlineHeight={3}
              underlineStyle={{ width: screenW / 3 - 10 }}
            />
          )}
        >
          <View tabLabel="公司介绍">{this.renderSupplierDetail()}</View>
          <View tabLabel="企业资质">{this.renderSupplierQualification()}</View>
        </ScrollableTabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    paddingTop: 5
  },
  listItem: {
    height: 45,
    alignItems: "center",
    paddingHorizontal: 12,
    flexDirection: "row",
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 13,
    color: "#37474f",
    paddingRight: 27
  },
  collectImg: {
    width: 60,
    height: 24,
    marginBottom: 4,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: "#eee",
    borderRadius: 2,
    overflow: "hidden"
  }
});
