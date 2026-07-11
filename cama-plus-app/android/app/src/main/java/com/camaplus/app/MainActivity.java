package com.camaplus.app;

import android.os.Bundle;
import com.zoontek.rnbootsplash.RNBootSplash;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

import com.camaplus.app.healthconnect.HealthConnectPermissionLauncher;

public class MainActivity extends ReactActivity {

  private HealthConnectPermissionLauncher healthConnectPermissionLauncher;

  @Override
  protected String getMainComponentName() {
    return "CamaApp";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    RNBootSplash.init(this, R.style.BootTheme);
    super.onCreate(null);
    healthConnectPermissionLauncher = new HealthConnectPermissionLauncher(this);
    healthConnectPermissionLauncher.register();
  }

  public HealthConnectPermissionLauncher getHealthConnectPermissionLauncher() {
    return healthConnectPermissionLauncher;
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        DefaultNewArchitectureEntryPoint.getFabricEnabled(),
        DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled());
  }
}
