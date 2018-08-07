package cn.com.imall.base.wxapi;


import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.imall.react_native_weixinpay.module.WxPayModule;
import com.tencent.mm.sdk.constants.ConstantsAPI;
import com.tencent.mm.sdk.modelbase.BaseReq;
import com.tencent.mm.sdk.modelbase.BaseResp;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.sdk.openapi.WXAPIFactory;

public class WXPayEntryActivity extends Activity implements IWXAPIEventHandler {

	private static final String TAG = "WXPayEntryActivity";

    private IWXAPI api;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    	api = WXAPIFactory.createWXAPI(this, WxPayModule.getInstance().getAppId());
        api.handleIntent(getIntent(), this);
    }

	@Override
	protected void onNewIntent(Intent intent) {
		super.onNewIntent(intent);
		setIntent(intent);
        api.handleIntent(intent, this);
	}

	@Override
	public void onReq(BaseReq req) {
	}

	@Override
	public void onResp(BaseResp resp) {
		Log.e(TAG,"pay result.errCode: " + resp.errCode);
		Log.e(TAG,"pay result.errStr: " + resp.errStr);
		Log.e(TAG,"pay result.openId: " + resp.openId);
		Log.e(TAG,"pay result.transaction: " + resp.transaction);
		if (resp.getType() == ConstantsAPI.COMMAND_PAY_BY_WX) {
			WritableMap result = Arguments.createMap();
			if (resp.errCode == 0) {
				result.putString("errCode",0+"");
				result.putString("text","支付成功");
			}
			if (resp.errCode == -1) {
				result.putString("errCode",-1+"");
				result.putString("text","支付失败");
			}
			if (resp.errCode == -2) {
				result.putString("errCode",-2+"");
				result.putString("text","用户取消");
			}
			if( WxPayModule.getInstance() == null){
				Log.e(TAG,"WxPayModule instance is null");
			}
			WxPayModule.getInstance().sendResult(result);
			this.finish();
		}
	}
}