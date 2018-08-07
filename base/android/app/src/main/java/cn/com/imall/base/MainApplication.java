package cn.com.imall.base;
import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import android.support.multidex.MultiDex;
import com.baidu.mapapi.SDKInitializer;
import com.burlap.filetransfer.FileTransferPackage;
import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import com.beefe.picker.PickerViewPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.shell.MainReactPackage;
import com.heng.cookie.CookieManagerPackage;
import com.imall.qr.codescan.packager.QRPackage;
import com.imall.react_native_alipay.pacekage.PlayPacekage;
import com.imall.react_native_baidumap.packager.MapPackage;
import com.imall.react_native_banner.packager.BannerPackage;
import com.imall.react_native_blur_android.packager.BlurPackage;
import com.imall.react_native_chrosslocation.packager.AddressPackage;
import com.imall.react_native_clock.packager.ClockPackage;
import com.imall.react_native_digitalsignature.packager.DigitalSignaturePackager;
import com.imall.react_native_imagepicker_imall.packager.ImagePickerPackage;
import com.imall.react_native_jpush.packager.JPushPackager;
import com.imall.react_native_photobrowsery.packager.PhotoBrowserPackage;
import com.imall.react_native_ripple.packager.RipplePackage;
import com.imall.react_native_screenshot_sharing.packager.ScreenshotSharingPackage;
import com.imall.react_native_statistics.packager.StatisticsPackager;
import com.imall.react_native_status_android.packager.StatusPackage;
import com.imall.react_native_switchbutton.packager.SwitchButtonPackage;
import com.imall.react_native_weixinpay.packager.WxPayPackager;
import com.imall.react_native_yinlianpay.packager.YinlianPayPackage;
import com.mehcode.reactnative.splashscreen.SplashScreenPackage;
import com.microsoft.codepush.react.CodePush;
import com.react.rnspinkit.RNSpinkitPackage;
import com.tendcloud.tenddata.TCAgent;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import cn.jpush.android.api.JPushInterface;
import cn.reactnative.httpcache.HttpCachePackage;
import cn.sharesdk.framework.ShareSDK;
import io.rnkit.actionsheetpicker.ASPickerViewPackage;
import io.rong.imkit.RongIM;
import io.rong.imkit.mssage.GoodsMessage;
import io.rong.imkit.mssage.OrderMessage;
import io.rong.imkit.packager.ChatPackage;
import io.rong.imkit.provider.GoodsMessageItemProvider;
import io.rong.imkit.provider.OrderMessageItemProvider;


public class MainApplication extends Application implements ReactApplication {
    // 热更新地址
    private static final String SERVER_URL = "http://www.imall.com.cn:3333/";

    @Override
    public void onCreate() {

        CodePush.setReactInstanceHolder(mReactNativeHost); // 热更新要在super.onCreate();之前调用
        super.onCreate();
        SDKInitializer.initialize(this); // 百度地图初始化
        ShareSDK.initSDK(this); //分享初始化

        //融云的初始化
        RongIM.init(this);
        RongIM.registerMessageType(GoodsMessage.class);
        RongIM.getInstance().registerMessageTemplate(new GoodsMessageItemProvider());
        RongIM.registerMessageType(OrderMessage.class);
        RongIM.getInstance().registerMessageTemplate(new OrderMessageItemProvider());

        // 数据统计
        //true: 开启TalikingData打印日志功能   false: 关闭TalikingData打印日志功能
        TCAgent.LOG_ON=true;
        // App ID: 在TalkingData创建应用后，进入数据报表页中，在“系统设置”-“编辑应用”页面里查看App ID。
        // 渠道 ID: 是渠道标识符，可通过不同渠道单独追踪数据。
        //TCAgent.init(this,"App ID","渠道ID");
        // 如果已经在AndroidManifest.xml配置了App ID和渠道ID,调用如下：
        TCAgent.init(this);
        //true: 开启自动捕获异常   false: 关闭自动捕获异常
        TCAgent.setReportUncaughtExceptions(true);

        //极光推送 开发期间设置为true可查看相关日志信息，上线后可设置为false
        JPushInterface.setDebugMode(true);
        JPushInterface.init(this);

        //极光推送打开指定页面，监听RN是否加载完毕，加载完毕后从SharedPreferences取出之前保存推送消息的内容，并发送给RN
        mReactNativeHost.getReactInstanceManager().addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
            @Override
            public void onReactContextInitialized(ReactContext context) {
                SharedPreferences sharedPreferences = context.getSharedPreferences("future", 0);
                String message = sharedPreferences.getString("PUSH_MESSAGE", null);
                WritableMap map = null;
                if(message!=null){
                    try {
                        map= Arguments.createMap();
                        JSONObject jsonObject=new JSONObject(message);
                        Iterator ite = jsonObject.keys();
                        while (ite.hasNext()) {
                            String key = ite.next().toString();
                            String value = jsonObject.get(key).toString();
                            if ("cn.jpush.android.EXTRA".equals(key)) {
                                WritableMap extraMap = Arguments.createMap();
                                try {
                                    JSONObject jsobject=new JSONObject(String.valueOf(value));
                                    Iterator it = jsobject.keys();
                                    while (it.hasNext()) {
                                        String keyy = it.next().toString();
                                        String valuee = jsobject.get(keyy).toString();
                                        extraMap.putString(keyy,valuee);
                                    }
                                    map.putMap("extra",extraMap );
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                            }else{
                                map.putString(key,value);
                            }
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
                context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("NOTIFICATION", map);
                SharedPreferences.Editor editor = sharedPreferences.edit();
                editor.remove("PUSH_MESSAGE");
                editor.commit();
            }
        });

    }

    // 分包依赖
    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }

    // 热更新需要调用自定义类
    private final MyReactNativeHost mReactNativeHost = new MyReactNativeHost(this) {

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        // CodePush配置
        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new SvgPackage(),
                    new PickerViewPackage(),
                    new CodePush(BuildConfig.CODEPUSH_KEY, MainApplication.this, BuildConfig.DEBUG,SERVER_URL),
                    new CookieManagerPackage(),
                    new RNSpinkitPackage(),
                    new SplashScreenPackage(),
                    new HttpCachePackage(),
                    new QRPackage(),
                    new PlayPacekage(),
                    new FileTransferPackage(),
                    new WxPayPackager(),
                    new ASPickerViewPackage(),
                    new MapPackage(),
                    new PhotoBrowserPackage(),
                    new JPushPackager(),
                    new DigitalSignaturePackager(),
                    new AddressPackage(),
                    new BannerPackage(),
                    new ClockPackage(),
                    new StatisticsPackager(),
                    new YinlianPayPackage(),
                    new RipplePackage(),
                    new SwitchButtonPackage(),
                    new BlurPackage(),
                    new ScreenshotSharingPackage(),
                    new ChatPackage(),
                    new StatusPackage(),
                    new ImagePickerPackage()
            );
        }
    };


    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

}
