import { NativeModules, Platform } from 'react-native';
import type { Settings, ValueType } from './types';
import { FlagType } from './types';

const LINKING_ERROR =
  `The package '@beletsky/react-native-yandex-remote-config' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const BRNYandexRemoteConfig = NativeModules.BRNYandexRemoteConfig
  ? NativeModules.BRNYandexRemoteConfig
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

class YandexRemoteConfigClass {
  private native = BRNYandexRemoteConfig;

  public getDeviceId = (): Promise<string> => this.native.getDeviceId();

  public init = (apiKey: string, config?: Settings): Promise<string> =>
    this.native.initialize(apiKey, config);

  public activateConfig = (): Promise<string> => this.native.activateConfig();

  public fetchConfig = (): Promise<string> => this.native.fetchConfig();

  public get = async <S extends FlagType, T extends ValueType<S>>(
    key: string,
    type: FlagType,
    defaultValue?: T
  ): Promise<T> => {
    try {
      switch (type) {
        case FlagType.string: {
          return await BRNYandexRemoteConfig.getString(key, defaultValue ?? '');
        }
        case FlagType.int: {
          return await BRNYandexRemoteConfig.getInt(key, defaultValue ?? 0);
        }
        case FlagType.double: {
          return await BRNYandexRemoteConfig.getDouble(key, defaultValue ?? 0);
        }
        case FlagType.bool: {
          return await BRNYandexRemoteConfig.getBool(
            key,
            defaultValue ?? false
          );
        }
      }
    } catch (e) {
      throw e;
    }
  };
}

export const YandexRemoteConfig = new YandexRemoteConfigClass();

export * from './types';
export * from './utils';
export * from './hooks';
