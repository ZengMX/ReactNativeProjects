package cn.com.imall.base;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.WindowManager;

import com.baidu.mapapi.SDKInitializer;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactContext;
import com.imall.react_native_baidumap.Utils.SharedPUtils;
import com.imall.react_native_clock.interfaces.HomeListener;
import com.imall.react_native_status_android.module.SystemBarTintManager;
import com.mehcode.reactnative.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

    private SDKReceiver mReceiver;
    private NetState mNetState;
    private Context context;
    private HomeListener mHomeWatcher;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // 启动图
        SplashScreen.show(this);

        getReactNativeHost().getReactInstanceManager().addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
            @Override
            public void onReactContextInitialized(ReactContext context) {
            getWindow().getDecorView().setBackgroundColor(Color.WHITE);
            }
        });

        super.onCreate(savedInstanceState);
        context = this.getBaseContext();
        registBroadcast();
        //修改状态栏
        initStatusBar();

        //极光推送，监听用户是否按了home键使应用进入后台，如果是设置变量为true，应用退出设置为false
        mHomeWatcher = new HomeListener(this);
        mHomeWatcher.setOnHomePressedListener(new HomeListener.OnHomePressedListener() {
            @Override
            public void onHomePressed() {
                Log.i("xsl", "onHomePressed");
                SharedPreferences sharedPreferences = getSharedPreferences("future", 0);
                SharedPreferences.Editor edit = sharedPreferences.edit();
                edit.putBoolean("IS_BACKGROUND_RUN", true);
                edit.commit();
            }
            @Override
            public void onHomeLongPressed() {
            }
        });

    }
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "future";
    }

    private void registBroadcast(){
        IntentFilter iFilter = new IntentFilter();
        iFilter.addAction(SDKInitializer.SDK_BROADTCAST_ACTION_STRING_PERMISSION_CHECK_OK);
        iFilter.addAction(SDKInitializer.SDK_BROADTCAST_ACTION_STRING_PERMISSION_CHECK_ERROR);
        mReceiver = new SDKReceiver();
        registerReceiver(mReceiver, iFilter);
        initNetState();//监听网络异常广播
    }

    // 构造广播监听类，监听 SDK key 验证以及网络异常广播
    public class SDKReceiver extends BroadcastReceiver {
        public void onReceive(Context context, Intent intent) {
            String s = intent.getAction();
            if (s.equals(SDKInitializer.SDK_BROADTCAST_ACTION_STRING_PERMISSION_CHECK_ERROR)) {//SDKReceiver key 验证出错! 错误码
                SharedPUtils.getInstance().saveBaiduSdk(-2,context);
            }
            if (s.equals(SDKInitializer.SDK_BROADTCAST_ACTION_STRING_PERMISSION_CHECK_OK)) {//SDKReceiver key 验证成功! 功能可以正常使用
                SharedPUtils.getInstance().saveBaiduSdk(1,context);
            }
        }
    }

    private void initNetState(){
        mNetState = new NetState();
        IntentFilter filter = new IntentFilter();
        filter.addAction(ConnectivityManager.CONNECTIVITY_ACTION);
        registerReceiver(mNetState, filter);
        mNetState.onReceive(context, null);
    }

    // 构造广播监听类，监听网络异常广播
    public class NetState extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent arg1) {
            ConnectivityManager manager = (ConnectivityManager)context.getSystemService(Context.CONNECTIVITY_SERVICE);
            NetworkInfo gprs = manager.getNetworkInfo(ConnectivityManager.TYPE_MOBILE);
            NetworkInfo wifi = manager.getNetworkInfo(ConnectivityManager.TYPE_WIFI);
            if(!gprs.isConnected() && !wifi.isConnected()){
                SharedPUtils.getInstance().saveNetState(-1,context);
            }else{
                SharedPUtils.getInstance().saveNetState(1,context);
            }
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        //开始监听 极光推送打开指定页面
        mHomeWatcher.startWatch();
    }

    // 设置状态栏透明
    private void initStatusBar(){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            SystemBarTintManager tintManager = new SystemBarTintManager(this);
            tintManager.setStatusBarTintEnabled(true);
            tintManager.setStatusBarTintResource(R.color.app_main_status);
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
        //停止监听极光推送
        mHomeWatcher.stopWatch();
    }

    @Override
    protected void onDestroy() {
        if(mReceiver!=null){
            unregisterReceiver(mReceiver);
        }
        if(mNetState!=null){
            unregisterReceiver(mNetState);
        }
        super.onDestroy();

        // 推送打开指定页面
        SharedPreferences sharedPreferences = getSharedPreferences("future", 0);
        SharedPreferences.Editor edit = sharedPreferences.edit();
        edit.putBoolean("IS_BACKGROUND_RUN", false);
        edit.commit();

    }

}
