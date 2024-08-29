package com.yandexremoteconfig

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.yandex.varioqub.appmetricaadapter.AppmetricaAdapter
import com.yandex.varioqub.config.FetchError
import com.yandex.varioqub.config.OnFetchCompleteListener
import com.yandex.varioqub.config.Varioqub
import com.yandex.varioqub.config.VarioqubSettings

class YandexRemoteConfigModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  fun multiply(a: Double, b: Double, promise: Promise) {
    promise.resolve(a * b)
  }

  companion object {
    const val NAME = "BRNYandexRemoteConfig"
  }

  @ReactMethod
  fun createVarioqubConfigFromJSObject(appId: String, jsObject: ReadableMap?): VarioqubSettings {

    val vqCfg = VarioqubSettings.Builder(appId)

    if (jsObject !== null) {
      if (jsObject.hasKey("baseURL")) {
        val baseURLString = jsObject.getString("baseURL")
        if (baseURLString != null) {
          vqCfg.withUrl(baseURLString)
        }
      }

      if (jsObject.hasKey("settings")) {
        val settingsMap = jsObject.getMap("settings")
        if (settingsMap != null) {
          if (settingsMap.hasKey("clientFeature")) {
            val clientFeaturesMap = settingsMap.getMap("clientFeature")
            val iterator = clientFeaturesMap?.keySetIterator()
            if (iterator != null) {
              while (iterator.hasNextKey()) {
                val key = iterator.nextKey()
                val value = clientFeaturesMap.getString(key)
                if (value != null) {
                  vqCfg.withClientFeature(key, value)
                }
              }
            }
          }

          if (settingsMap.hasKey("throttleInterval")) {
            val throttleInterval = settingsMap.getInt("throttleInterval")
            vqCfg.withThrottleInterval(throttleInterval.toLong())
          }
        }
      }
    }

    return vqCfg.build()
  }

  @ReactMethod
  fun initialize(apiKey: String, config: ReadableMap?, promise: Promise) {
    try {
      val settings = createVarioqubConfigFromJSObject(apiKey, config)

      val varioqub = Varioqub.init(settings, AppmetricaAdapter(this.reactApplicationContext), this.reactApplicationContext)

      if (varioqub != null) {
        promise.resolve("Initialization success")
      } else {
        promise.reject("INITIALIZATION_ERROR", "Initialization failed")
      }
    } catch (e: Exception) {
      promise.reject("INITIALIZATION_ERROR", "Error during initialization: ${e.message}")
    }
  }

  @ReactMethod
  fun activateConfig(promise: Promise) {
    Varioqub.activateConfig {
      promise.resolve("activateConfig completed")
    }
  }

  @ReactMethod
  fun fetchConfig(promise: Promise) {
    Varioqub.fetchConfig(object : OnFetchCompleteListener {
      override fun onSuccess() {
        promise.resolve("success")
      }

      override fun onError(message: String, error: FetchError) {
        promise.reject("FETCH_CONFIG_ERROR", "Error fetching config: ${error.name}; $message", Throwable("Error: $message"))
      }
    })
  }

  @ReactMethod
  fun getString(flagName: String, defaultValue: String, promise: Promise) {
    if (flagName != null) {
      val value = Varioqub.getString(flagName, defaultValue)
      promise.resolve(value)
    } else {
      promise.reject("INVALID_FLAG_NAME", "Invalid flag name")
    }
  }

  @ReactMethod
  fun getInt(flagName: String, defaultValue: Double, promise: Promise) {
    if (flagName != null) {
      val value = Varioqub.getLong(flagName, defaultValue.toLong())
      promise.resolve(value.toInt())
    } else {
      promise.reject("INVALID_FLAG_NAME", "Invalid flag name")
    }
  }

  @ReactMethod
  fun getDouble(flagName: String, defaultValue: Double, promise: Promise) {
    if (flagName != null) {
      val value = Varioqub.getDouble(flagName, defaultValue)
      promise.resolve(value)
    } else {
      promise.reject("INVALID_FLAG_NAME", "Invalid flag name")
    }
  }

  @ReactMethod
  fun getBool(flagName: String, defaultValue: Boolean, promise: Promise) {
    if (flagName != null) {
      val value = Varioqub.getBoolean(flagName, defaultValue)
      promise.resolve(value)
    } else {
      promise.reject("INVALID_FLAG_NAME", "Invalid flag name")
    }
  }

  @ReactMethod
  fun getDeviceId(promise: Promise) {
    val deviceId = Varioqub.getId()
    if (deviceId != null) {
      promise.resolve(deviceId)
    } else {
      promise.reject("NO_VALUE", "No value for deviceId")
    }
  }

}
