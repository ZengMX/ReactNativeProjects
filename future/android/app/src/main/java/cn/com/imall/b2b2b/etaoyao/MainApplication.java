package cn.com.imall.b2b2b.etaoyao;

import android.app.Application;

import com.beefe.picker.PickerViewPackage;
import com.burlap.filetransfer.FileTransferPackage;
import com.facebook.react.ReactApplication;
import com.imall.react_native_phone_picker_android.packager.PhonePicker;
import com.rnfs.RNFSPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.heng.cookie.CookieManagerPackage;
import com.imall.react_native_alipay.pacekage.PlayPacekage;
import com.imall.react_native_chrosslocation.packager.AddressPackage;
import com.imall.react_native_clock.packager.ClockPackage;
import com.imall.react_native_imagepicker_imall.packager.ImagePickerPackage;
import com.imall.react_native_jpush.packager.JPushPackager;
import com.imall.react_native_photobrowsery.packager.PhotoBrowserPackage;
import com.imall.react_native_status_android.packager.StatusPackage;
import com.imall.react_native_weixinpay.packager.WxPayPackager;
import com.imall.react_native_yinlianpay.packager.YinlianPayPackage;
import com.mehcode.reactnative.splashscreen.SplashScreenPackage;
import com.microsoft.codepush.react.CodePush;
import com.react.rnspinkit.RNSpinkitPackage;
import java.util.Arrays;
import java.util.List;
import cn.jpush.android.api.JPushInterface;
import io.rnkit.actionsheetpicker.ASPickerViewPackage;

public class MainApplication extends Application implements ReactApplication {
    @Override
    public void onCreate() {
        CodePush.setReactInstanceHolder(mReactNativeHost);
        super.onCreate();
        //  PushManager.startWork(this, PushConstants.LOGIN_TYPE_API_KEY, "drGpHGV5j9vCzmPCuGEhSEWQ");

        //极光推送配置
        JPushInterface.setDebugMode(true);  //开发期间设置为true可查看相关日志信息，上线后可设置为false
        JPushInterface.init(this);
    }

    private final MyReactNativeHost mReactNativeHost = new MyReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        //pjz@imall.com.cn
        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new PhonePicker(),
                    new RNFSPackage(),
                    new ClockPackage(),
                    new PickerViewPackage(),
                    new StatusPackage(),
                    new PhotoBrowserPackage(),
                    new ASPickerViewPackage(),
                    new CookieManagerPackage(),
                    new ImagePickerPackage(),
                    new CodePush(
                            BuildConfig.CODEPUSH_KEY,
                            MainApplication.this,
                            BuildConfig.DEBUG,
                            getBaseContext().getResources().getString(R.string.PUSH_URL)),//url在app -> res -> values -> srings.xml
                    new RNSpinkitPackage(),
                    new FileTransferPackage(),
                    new RNSpinkitPackage(),
                    new WxPayPackager(),
                    new YinlianPayPackage(),
                    new PlayPacekage(),
                    new SplashScreenPackage(),
                    new AddressPackage(),
                    new JPushPackager()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }
}
