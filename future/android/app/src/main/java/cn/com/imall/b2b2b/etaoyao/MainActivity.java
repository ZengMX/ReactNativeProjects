package cn.com.imall.b2b2b.etaoyao;


import android.app.Activity;
import android.content.ContentResolver;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ActivityInfo;
import android.database.Cursor;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.ContactsContract;
import android.util.Log;
import android.view.WindowManager;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.imall.react_native_chrosslocation.module.AddressModule;
import com.imall.react_native_clock.module.ClockModule;
import com.imall.react_native_status_android.module.SystemBarTintManager;
import com.mehcode.reactnative.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    private ClockModule.ClockReceiver clockReceiver;
    private AddressModule.AddressDialogReceiver addressDialogReceiver;
    private  String username, usernumber;
    private ReactApplicationContext mReactApplicationContext;

    @Override
    protected String getMainComponentName() {
        return "future";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        SplashScreen.show(this);

        // After react is initialized; set our background color (override splash screen theme)
        getReactNativeHost().getReactInstanceManager().addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
            @Override
            public void onReactContextInitialized(ReactContext context) {
                // Hide the native splash screen
                getWindow().getDecorView().setBackgroundColor(Color.WHITE);
            }
        });
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

        super.onCreate(savedInstanceState);
        initStatusBar();
        registClock();
        registAddress();
        initReactContext();
    }

    private void registAddress() {
        addressDialogReceiver=new AddressModule.AddressDialogReceiver();
        IntentFilter addressDialogIntentFilter=new IntentFilter("AddressDialog");
        registerReceiver(addressDialogReceiver,addressDialogIntentFilter);
    }

    private void initStatusBar(){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            SystemBarTintManager tintManager = new SystemBarTintManager(this);
            tintManager.setStatusBarTintEnabled(true);
            tintManager.setStatusBarTintResource(R.color.app_main_status);
        }
    }

    private void registClock(){
        clockReceiver = new ClockModule.ClockReceiver();
        IntentFilter clockFilter = new IntentFilter("onStop");
        registerReceiver(clockReceiver, clockFilter);
    }

    private void initReactContext(){
        MainApplication application = (MainApplication) this.getApplication();
        ReactNativeHost reactNativeHosteactNativeHost = application.getReactNativeHost();
        reactNativeHosteactNativeHost.getReactInstanceManager().addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
            @Override
            public void onReactContextInitialized(ReactContext context) {
                if (context != null) {
                    mReactApplicationContext = (ReactApplicationContext) context;
                }
            }
        });
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == Activity.RESULT_OK && data != null) {
            // ContentProvider展示数据类似一个单个数据库表
            // ContentResolver实例带的方法可实现找到指定的ContentProvider并获取到ContentProvider的数据
            ContentResolver reContentResolverol = getContentResolver();
            // URI,每个ContentProvider定义一个唯一的公开的URI,用于指定到它的数据集
            Uri contactData = data.getData();
            // 查询就是输入URI等参数,其中URI是必须的,其他是可选的,如果系统能找到URI对应的ContentProvider将返回一个Cursor对象.
            Cursor cursor = managedQuery(contactData, null, null, null, null);
            cursor.moveToFirst();
            // 获得DATA表中的名字
            username = cursor.getString(cursor
                    .getColumnIndex(ContactsContract.Contacts.DISPLAY_NAME));
            // 条件为联系人ID
            String contactId = cursor.getString(cursor
                    .getColumnIndex(ContactsContract.Contacts._ID));
            // 获得DATA表中的电话号码，条件为联系人ID,因为手机号码可能会有多个
            Cursor phone = reContentResolverol.query(
                    ContactsContract.CommonDataKinds.Phone.CONTENT_URI, null,
                    ContactsContract.CommonDataKinds.Phone.CONTACT_ID + " = "
                            + contactId, null, null);
            while (phone.moveToNext()) {
                usernumber = phone.getString(phone.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER));
            }
        }
        Log.e("MainActivity","username:"+username+"usernumber:"+usernumber);
        sendPhoneInfo(username,usernumber);
    }
    private void sendPhoneInfo(String username,String usernumber){
        if(mReactApplicationContext != null){
            WritableMap msg = Arguments.createMap();
            msg.putString("username",username);
            msg.putString("usernumber",usernumber);
            mReactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("onPhoneResult", msg);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
    }
    @Override
    protected void onPause() {
        super.onPause();
        sendBroadcast(new Intent("onStop"));
        sendBroadcast(new Intent("AddressDialog"));
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if(clockReceiver!=null){
            unregisterReceiver(clockReceiver);
        }
        if(addressDialogReceiver!=null)
            unregisterReceiver(addressDialogReceiver);
    }
}
