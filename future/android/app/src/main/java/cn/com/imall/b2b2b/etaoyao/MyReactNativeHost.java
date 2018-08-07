package cn.com.imall.b2b2b.etaoyao;

import android.app.Application;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.devsupport.RedBoxHandler;
import com.facebook.react.uimanager.UIImplementationProvider;
import com.microsoft.codepush.react.ReactInstanceHolder;

import java.util.List;

import javax.annotation.Nullable;

/**
 * Created by qinguoshi on 17/3/13.
 */
public class MyReactNativeHost extends ReactNativeHost implements ReactInstanceHolder {
    protected MyReactNativeHost(Application application) {
        super(application);
    }

    @Override
    public ReactInstanceManager getReactInstanceManager() {
        return super.getReactInstanceManager();
    }

    @Override
    public boolean hasInstance() {
        return super.hasInstance();
    }

    @Override
    public void clear() {
        super.clear();
    }

    @Override
    protected ReactInstanceManager createReactInstanceManager() {
        return super.createReactInstanceManager();
    }

    @Nullable
    @Override
    protected RedBoxHandler getRedBoxHandler() {
        return super.getRedBoxHandler();
    }

    @Override
    protected UIImplementationProvider getUIImplementationProvider() {
        return super.getUIImplementationProvider();
    }

    @Override
    protected String getJSMainModuleName() {
        return super.getJSMainModuleName();
    }

    @Nullable
    @Override
    protected String getJSBundleFile() {
        return super.getJSBundleFile();
    }

    @Nullable
    @Override
    protected String getBundleAssetName() {
        return super.getBundleAssetName();
    }

    @Override
    public boolean getUseDeveloperSupport() {
        return false;
    }

    @Override
    protected List<ReactPackage> getPackages() {
        return null;
    }
}
