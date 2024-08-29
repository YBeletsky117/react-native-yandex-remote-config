import { YandexRemoteConfig } from '../';
import type { FlagType } from '../';
import type { ValueType } from '../types';

export const wrapFeatureToggle =
  <P extends any[], R, T extends FlagType, K extends ValueType<T>>({
    flag,
    flagType,
    condition = (value) => !!value,
    callback,
    defaultValue,
  }: {
    flag: string;
    flagType: T;
    callback: (flagValue: K) => (...props: P) => R;
    condition?: (value: ValueType<T>) => boolean;
    defaultValue?: K;
    defaultCondition?: boolean;
  }): ((...props: P) => Promise<R | void>) =>
  async (...props) => {
    try {
      const result: K = await YandexRemoteConfig.get(
        flag,
        flagType,
        defaultValue
      );
      console.log('wrapFeatureToggle', `${result}`);
      if (condition(result)) {
        return callback(result)(...props);
      }
      return (() => {})();
    } catch (e) {
      console.log('wrapFeatureToggle', `${e}`);
    }
  };
