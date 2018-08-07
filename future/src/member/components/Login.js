import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  Keyboard,
  Animated,
  Easing,
  InteractionManager
} from "react-native";
import {
  BaseView,
  Banner,
  Toast,
  Page,
  DataController,
  MaskModal,
  Loading,
  TextInputC
} from "future/public/widgets";
import { Fetch, imageUtil, ValidateUtil } from "future/public/lib";
import config from "future/public/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import StorageUtils from 'future/public/lib/StorageUtils';
import dismissKeyboard from "dismissKeyboard";
import md5 from "md5";
import Regist from "./Regist";
import RetrievePassword from "./RetrievePassword";
import RCTDeviceEventEmitter from "RCTDeviceEventEmitter";
import BaseInfor from 'future/src/member/components/BaseInfor';
import Fillinfor from 'future/src/member/components/Fillinfor';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../actions/Member";
import jpush from "@imall-test/react-native-jpush";

let SCREEN_WIDTH = Dimensions.get("window").width;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positionAnim: new Animated.Value(-64),
      opacityAnim: new Animated.Value(0),
      inputUser: "",
      inputPassword: "",
      inputCheck: "",
      checkImg: config.host + "/ValidateCode?" + Date.now(),
      warnText: "",
      isNeedCheckCode: false
    };
    this._openRegist = this._openRegist.bind(this);
    this._openRetrievePassword = this._openRetrievePassword.bind(this);
    this.isStartToast = false;
    this.deviceUserId = "";
    this.channelId = "";
  }
  componentWillMount() {
    jpush.getRegistrationIDWithCallback(registrationID => {
      //极光提供的客户端唯一标识
      // console.log('iiiiiiiiiiiiiiiiiiiii',registrationID);
      this.deviceUserId = registrationID;
    });
  }
  componentDidMount() { }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
    this.props.params &&
      this.props.params.callback &&
      this.props.params.callback(false);
    if (this.props.navigator.getCurrentRoutes().length == 1) {
      if (!this.isLogined) {
        RCTDeviceEventEmitter.emit("changeTabBarIdx", { idx: 0, goTop: true });
      }
    }
  }
  _openRegist() {
    this.props.navigator.push({
      component: Regist
    });
  }
  _openRetrievePassword() {
    this.props.navigator.push({
      component: RetrievePassword
    });
  }
  startToast(value = "") {
    //防止多次触发
    if (this.isStartToast == true) {
      return;
    } else {
      this.isStartToast = true;
    }
    // this.setState({ warnText: value });
    this.setState({ warnText: "用户名不存在或密码不匹配" });
    Animated.parallel([
      Animated.timing(this.state.positionAnim, {
        toValue: 0,
        duration: 150,
        easing: Easing.in
      }),
      Animated.timing(this.state.opacityAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.linear
      })
    ]).start(() => {
      this.timer = setTimeout(() => {
        Animated.sequence([
          Animated.timing(this.state.opacityAnim, {
            toValue: 0,
            duration: 150,
            easing: Easing.ease
          }),
          Animated.timing(this.state.positionAnim, {
            toValue: -64,
            duration: 10
          })
        ]).start(() => {
          this.isStartToast = false;
        });
      }, 1800);
    });
  }

  isCanTouchLogin() {
    if (
      this.state.inputUser.trim() != "" &&
      this.state.inputPassword.trim() != ""
    ) {
      if (
        this.state.isNeedCheckCode == true &&
        this.state.inputCheck.length != 4
      ) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  renderLeftButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          // this.props.params && this.props.params.callback && this.props.params.callback(false);
          this.props.navigator.pop();
        }}
        activeOpacity={0.7}
        style={{ marginLeft: 13, marginTop: 11 }}
      >
        <Text style={{ fontSize: 16, color: "#444" }}>关闭</Text>
      </TouchableOpacity>
    );
  }

  //登录操作
  onClickLogin() {
    console.log("--------------md5登录操作:", this.state.inputPassword);
    console.log("--------------md5", md5(this.state.inputPassword));
    let data = {
      account: this.state.inputUser,
      password: md5(this.state.inputPassword),
      deviceUserId: this.deviceUserId,
      channelId: this.channelId,
      platform: Platform.OS == "ios" ? "IOS" : "ANDROID",
      validateCode: this.state.isNeedCheckCode ? this.state.inputCheck : ""
    };
    this.props.actions
      .login(data)
      .then(data => {
        InteractionManager.runAfterInteractions(() => {
          console.log('login data', data);
          if (!data.isApprove) {
            //帐号未审核
            StorageUtils.readInfo('BASEINFOR').then((inforResult) => {
              console.log('StorageUtils BaseInfor>> ----', inforResult);
              let userInfo = inforResult.data;
              if (userInfo.userName == this.state.inputUser && userInfo.businessRanges != '' && userInfo.customerTypeId != '') {
                this.props.navigator.push({
                  component: Fillinfor,
                  params: {
                    buyersId: data.result.buyersId,
                    businessRanges: userInfo.businessRanges,
                    customerTypeId: userInfo.customerTypeId
                  }
                });
              } else {
                this._ToBaseInfor();
              }
            }, (error) => {
              console.log('StorageUtils BaseInfor>> ----error', error);
              this._ToBaseInfor();
            });
          }
          if (data.isApprove) {
            //帐号已审核
            //登录结束后，关闭当前页面
            this.isLogined = true;
            this.props.params &&
              this.props.params.callback &&
              this.props.params.callback(true);
            this.props.navigator.pop();
          }
        });
        dismissKeyboard();
      })
      .catch(error => {
        console.log("error", error);
        this.startToast({});
        this.setState({ inputPassword: "" });
        // alert(error.code);
        if (error.code == "500") {
          // this.startToast('账户名与密码不匹配，请重新输入');
          this.isNeedValidateCode();
        }
      });
  }
  _ToBaseInfor() {
    this.props.navigator.replace({
      component: BaseInfor,
      //要禁用安卓物理返回键的页面，同时需要去 lib/navigator.js 文件的 onBackAndroid 方法手动添加页面判断
      forbiddenPage: "PerfectInformation",
      params: {
        userName: this.state.inputUser
      }
    });
  }
  //判断是否需要验证码
  isNeedValidateCode() {
    if (this.state.inputUser.trim() == "") {
      return;
    }
    InteractionManager.runAfterInteractions(() => {
      new Fetch({
        url: "app/user/isNeedValidateCode.json",
        method: "POST",
        data: {
          loginId: this.state.inputUser
        }
      })
        .dofetch()
        .then(data => {
          if (data.needCode != this.state.isNeedCheckCode) {
            this.setState({ isNeedCheckCode: data.needCode });
          }
          //重新刷新验证码图片
          if (data.needCode == true) {
            this.setState({
              checkImg: config.host + "/ValidateCode?" + Date.now()
            });
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    });
  }

  render() {
    let checkImg = this.state.checkImg;
    return (
      <View style={{ flex: 1 }}>
        <BaseView
          statusBarStyle={"default"}
          mainColor={"#f5f5f5"}
          leftButton={this.renderLeftButton()}
          navigator={this.props.navigator}
          scrollEnabled={false}
          ref="base"
          title={{ title: "登录", tintColor: "#333" }}
          titlePosition={"center"}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{
              backgroundColor: "#f5f5f5",
              alignItems: "center",
              flex: 1
            }}
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            {/*用户账号*/}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#b1b1b6",
                width: 270,
                paddingBottom: 8
              }}
            >
              <TextInputC
                clearButtonMode={"while-editing"}
                maxLength={32}
                autoFocus={true}
                underlineColorAndroid="transparent"
                style={{
                  flex: 1,
                  height: Platform.OS === "android" ? 40 : 30,
                  fontSize: 15,
                  color: "#333"
                }}
                value={this.state.inputText}
                onChangeText={text => {
                  this.setState({ inputUser: text });
                }}
                placeholder="用户名／手机号／邮箱"
                ref="theAcount"
                placeholderTextColor="#ACB4BE"
                keyboardType="default"
                onFocus={() => {
                  console.log("获得焦点。。。-/-");
                }}
                onBlur={() => {
                  {
                    /* this.isNeedValidateCode(); */
                  }
                  console.log("焦点离开。。。-/-");
                }}
              />
            </View>
            {/*密码*/}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 25,
                borderBottomWidth: 1,
                borderBottomColor: "#b1b1b6",
                width: 270,
                paddingBottom: 8
              }}
            >
              <TextInputC
                clearButtonMode={"while-editing"}
                maxLength={16}
                secureTextEntry={true}
                underlineColorAndroid="transparent"
                ref="thePassword"
                style={{
                  flex: 1,
                  height: Platform.OS === "android" ? 40 : 30,
                  fontSize: 15,
                  color: "#333"
                }}
                placeholderTextColor="#ACB4BE"
                placeholder="密码"
                keyboardType="default"
                value={this.state.inputPassword}
                onChangeText={text => {
                  this.setState({ inputPassword: text });
                }}
              />
            </View>
            {/*验证码*/}
            {this.state.isNeedCheckCode
              ? <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: "#b1b1b6",
                  width: 270,
                  paddingBottom: 8
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      checkImg: config.host + "/ValidateCode?" + Date.now()
                    });
                  }}
                  activeOpacity={0.7}
                >
                  <Image
                    style={{ height: 22, width: 63, marginRight: 10 }}
                    source={{ uri: checkImg }}
                  />
                </TouchableOpacity>
                <TextInputC
                  clearButtonMode={"while-editing"}
                  maxLength={4}
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  ref="theValidateCode"
                  style={{
                    flex: 1,
                    height: Platform.OS === "android" ? 40 : 30,
                    fontSize: 15,
                    color: "#333"
                  }}
                  placeholderTextColor="#ACB4BE"
                  placeholder={
                    this.state.inputCheck.trim() != "" ? "" : "验证码(点击图片可刷新)"
                  }
                  keyboardType="default"
                  value={this.state.inputCheck}
                  onChangeText={text => {
                    this.setState({ inputCheck: text });
                  }}
                />
                {/* {this.state.inputCheck.trim()!=''?
                  <View
                    style={{
                      position: "absolute",
                      zIndex: 9,
                      left: 120,
                      top: 7
                    }}
                  >
                    {this.state.inputCheck.trim().length !=4//== "1234"
                      ? <Image
                          style={{ width: 19, height: 16 }}
                          source={require("../res/login/005cuowu.png")}
                        />
                      : <Image
                          style={{ width: 19, height: 16 }}
                          source={require("../res/login/006zhengque.png")}
                        />}
                  </View>
				  :
				  <View/>
				} */}
              </View>
              : <View />}

            {/*登录按钮*/}
            <View style={{ marginTop: 30 }}>
              {this.isCanTouchLogin()
                ? <TouchableOpacity
                  activeOpacity={0.5}
                  style={{
                    width: 270,
                    height: 45,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#34457D",
                    borderRadius: 4
                  }}
                  onPress={() => {
                    this.onClickLogin();
                  }}
                >
                  <Text style={{ color: "#FFFFFF", fontSize: 16 }}>登录</Text>
                </TouchableOpacity>
                : <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    width: 270,
                    height: 45,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#E0E0E1",
                    borderRadius: 4
                  }}
                  onPress={() => {
                    //灰色按钮的登录
                  }}
                >
                  <Text style={{ color: "#BFBFBF", fontSize: 16 }}>登录</Text>
                </TouchableOpacity>}
            </View>
            <View
              style={{
                flexDirection: "row",
                height: 20,
                alignItems: "center",
                marginTop: 20
              }}
            >
              <TouchableOpacity onPress={this._openRetrievePassword}>
                <Text style={{ color: "#8D95A0", fontSize: 14 }}>找回密码</Text>
              </TouchableOpacity>
              <View
                style={{
                  width: 1,
                  height: 15,
                  backgroundColor: "#A4ABB5",
                  marginHorizontal: 20
                }}
              />
              <TouchableOpacity onPress={this._openRegist}>
                <Text style={{ color: "#8D95A0", fontSize: 14 }}>注册账号</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </BaseView>
        <Animated.View
          style={{
            height: 64,
            width: SCREEN_WIDTH,
            position: "absolute",
            zIndex: 99,
            top: this.state.positionAnim,
            left: 0,
            backgroundColor: "#FF7F79",
            paddingTop: 20,
            justifyContent: "center",
            alignItems: "center",
            opacity: this.state.opacityAnim
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>
            {this.state.warnText}
          </Text>
        </Animated.View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
