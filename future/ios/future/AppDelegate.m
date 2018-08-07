/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import "RNLaunchImage.h"
#import "RCTBundleURLProvider.h"
#import "RCTRootView.h"
#import "RCTLinkingManager.h"
#import "RCTPushNotificationManager.h"
#import "CodePush.h"
//银联支付
#import "UPPaymentControl.h"
//微信
#import "WXApi.h"
#import "WXApiManager.h"
#import "BPush.h"

// 极光推送
#import "JPUSHService.h"
#import <UserNotifications/UserNotifications.h>

#define PUSH_APPKEY @"548d5c3ae8eb132e15b5fda3"

@interface AppDelegate()<JPUSHRegisterDelegate>
@property (nonnull,strong) RCTRootView *rootView;
@property (nonnull,strong) NSMutableArray *notificationInfos;
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

#if DEBUG
  
#ifdef DEBUG
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
#else
    jsCodeLocation = [CodePush bundleURL];
#endif
  NSLog(@"1jsCodeLocation");
#else
  jsCodeLocation=[CodePush bundleURL];
#endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"future"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [WXApi registerApp:@"wxe6492170148a133b" withDescription:@"B2B"];
  
  // 极光推送配置
  self.notificationInfos = [[NSMutableArray alloc]init];
  //把所有角标和消息清除
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
  [JPUSHService resetBadge];
  
  //初始化推送 SDK
  JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
  entity.types = JPAuthorizationOptionAlert|JPAuthorizationOptionBadge|JPAuthorizationOptionSound;
  if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {
    // 可以添加自定义categories
    // NSSet<UNNotificationCategory *> *categories for iOS10 or later
    // NSSet<UIUserNotificationCategory *> *categories for iOS8 and iOS9
  }
  [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
  // 开启推送 SDK
  [JPUSHService setupWithOption:launchOptions appKey:PUSH_APPKEY          //PUSH_APPKEY 极光官网注册提供
                        channel:@"appStore"                                        //渠道 （可选）
               apsForProduction:NO        //是否生产环境. 如果为开发状态,设置为 NO; 如果为生产状态,应改为 YES.    发布时候修改
          advertisingIdentifier:nil];
  
//  [RNLaunchImage wait];
  return YES;
}

//极光推送  处理设备注册 在 iOS8 系统中，还需要添加这个方法。通过新的 API 注册推送服务
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  
  [application registerForRemoteNotifications];
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}


- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  
  NSLog(@"test:%@",[[NSString alloc]initWithData:deviceToken encoding:NSUTF8StringEncoding]);
  [JPUSHService registerDeviceToken:deviceToken];
  
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

//极光推送 当 DeviceToken 获取失败时，系统会回调此方法
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  NSLog(@"DeviceToken 获取失败，原因：%@",error);
}

// 极光推送 处理推送信息 第三方的回调共用(不同ios版本)代码
- (void)notificationWaiteRootView:(NSDictionary *)infos
{
  if (self.rootView.bridge.isLoading==YES) {
    [self.notificationInfos addObject:infos];
    [[NSNotificationCenter defaultCenter] addObserver:self                            //没加载完，注册监听
                                             selector:@selector(javaScriptDidLoad)
                                                 name:RCTJavaScriptDidLoadNotification
                                               object:nil];
  }else{
    [RCTPushNotificationManager didReceiveRemoteNotification:infos];               //直接把推送过来的信息发送给 RN 分析
  }
}

//极光推送 远程 IOS6以下回调
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
{
  // App 收到远程推送的通知
  [JPUSHService handleRemoteNotification:userInfo];
  NSDictionary* infos = [self reSetDic:userInfo value:@"didTap"];
  
  [self notificationWaiteRootView:infos];
}
//推送 远程 IOS7以上回调
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [JPUSHService handleRemoteNotification:userInfo];
  NSDictionary* infos = [self reSetDic:userInfo value:@"didTap"];
  
  [self notificationWaiteRootView:infos];
  
}
//推送 本地 IOS10以下回调
-(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification{
  NSDictionary * userInfo = notification.userInfo;
  NSDictionary* infos = [self reSetDic:userInfo value:@"didTap"];
  
  [self notificationWaiteRootView:infos];
}

-(void)javaScriptDidLoad{
  [[NSNotificationCenter defaultCenter] removeObserver:self name:RCTJavaScriptDidLoadNotification object:nil];   //移除监听
  
  //延迟0.3秒，等其加载首页
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    for (NSDictionary *dic in self.notificationInfos) {
      [RCTPushNotificationManager didReceiveRemoteNotification:dic];   //直接把推送过来的信息发送给 RN 分析
    }
    
    [self.notificationInfos removeAllObjects];     //删除信息
  });
}
#pragma mark- JPUSHRegisterDelegate
//推送 IOS10以上回调
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler {
  // Required
  NSDictionary * userInfo = notification.request.content.userInfo;
  NSDictionary* infos = [self reSetDic:userInfo value:@"didRecivice"];
  [self notificationWaiteRootView:infos];
  if([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [JPUSHService handleRemoteNotification:userInfo];
  }
  completionHandler(UNNotificationPresentationOptionAlert); // 需要执行这个方法，选择是否提醒用户，有Badge、Sound、Alert三种类型可以选择设置
  
}
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler {
  // Required
  NSDictionary * userInfo = response.notification.request.content.userInfo;
  NSDictionary* infos = [self reSetDic:userInfo value:@"didTap"];
  [RCTPushNotificationManager didReceiveRemoteNotification:infos];
  if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [JPUSHService handleRemoteNotification:userInfo];
  }
  completionHandler();  // 系统要求执行这个方法
}
//配置推送信息
-(NSMutableDictionary*)reSetDic:(NSDictionary*)userinfo value:(NSString*)stateValue{
  NSMutableDictionary *infos = [[NSMutableDictionary alloc]init];
  [infos setObject:userinfo forKey:@"extra"];
  [infos setObject:stateValue forKey:@"State"];
  return infos;
}


- (void)applicationDidEnterBackground:(UIApplication *)application
{
  // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
  // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
  //  NSLog(@"applicationDidEnterBackground");
  self.State = [NSString stringWithFormat:@"Unactive"];
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
  // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
  //  NSLog(@"applicationDidBecomeActive");
  self.State = [NSString stringWithFormat:@"Active"];
  
}

- (BOOL)application:(UIApplication *)application openURL:(nonnull NSURL *)url options:(nonnull NSDictionary *)options
{
  NSString *host = [url host];
  if([host isEqualToString:@"safepay"]){
    //创建一个消息对象
    NSNotification * notice = [NSNotification notificationWithName:@"alipay" object:nil userInfo:@{@"url":[url absoluteString]}];
    //发送消息
    [[NSNotificationCenter defaultCenter] postNotification:notice];
    return YES;
    //return [RCTLinkingManager application:application openURL:url sourceApplication:nil annotation:nil];
  }
  if([host isEqualToString:@"pay"]){
    [RCTLinkingManager application:application openURL:url sourceApplication:nil annotation:nil];
    return [WXApi handleOpenURL:url delegate:[WXApiManager sharedManager]];
  }
  if([host isEqualToString:@"uppaywallet"]||[host isEqualToString:@"uppayresult"]){
    [[UPPaymentControl defaultControl] handlePaymentResult:url completeBlock:^(NSString *code, NSDictionary *data) {
      NSString *content = @"";
      if([code isEqualToString:@"success"]) {
        content = @"支付成功";
      }else if([code isEqualToString:@"fail"]) {
        content = @"支付失败";
      }else if([code isEqualToString:@"cancel"]) {
        content = @"交易取消";
      }
      
      NSNotification * notice = [NSNotification notificationWithName:@"UPPay" object:nil userInfo:@{@"code":code,@"content":content}];
      [[NSNotificationCenter defaultCenter] postNotification:notice];
    }];
  }
  return YES;
}

#pragma mark Push Delegate
- (void)onMethod:(NSString*)method response:(NSDictionary*)data
{
  NSLog(@"%@",[NSString stringWithFormat:@"Method: %@\n%@,%@",method,data[@"channel_id"],data[@"user_id"]]);
  NSUserDefaults *users = [NSUserDefaults standardUserDefaults];
  [users setObject:data[@"channel_id"] forKey:@"channel_id"];
  [users setObject:data[@"user_id"] forKey:@"user_id"];
}

@end
