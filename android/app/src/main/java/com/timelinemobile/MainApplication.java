package com.timelinemobile;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.gcrabtree.rctsocketio.SocketIoPackage;
import com.xeodou.rctplayer.ReactPlayerManager;
import com.audioStreaming.ReactNativeAudioStreamingPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.imagepicker.ImagePickerPackage;
import com.rnfs.RNFSPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SocketIoPackage(),
            new ReactPlayerManager(),
            new ReactNativeAudioStreamingPackage(MainActivity.class),
            new ReactNativeAudioPackage(),
            new RCTCameraPackage(),
            new VectorIconsPackage(),
              new ImagePickerPackage(),
              new RNFSPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
