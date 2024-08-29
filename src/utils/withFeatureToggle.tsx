import type { FCFT, FlagType, ValueType } from '../types';
import type { FC } from 'react';
import {
  Fragment,
  useCallback,
  useEffect,
  useState,
  createElement,
} from 'react';
import { YandexRemoteConfig } from '../';

export const withRemoteConfig =
  <P extends {}, T extends FlagType>(
    {
      flag,
      flagType,
      condition = (value) => !!value,
      defaultCondition = false,
      defaultValue,
    }: {
      flag: string;
      flagType: T;
      condition?: (flag: ValueType<T>) => boolean;
      defaultValue?: ValueType<T>;
      defaultCondition?: boolean;
    },
    WrappedComponent: FCFT<P>
  ): FC<P> =>
  (props) => {
    const [visible, setVisible] = useState(defaultCondition);

    const fetchFlag = useCallback(async () => {
      try {
        const result = condition(
          await YandexRemoteConfig.get(flag, flagType, defaultValue)
        );
        setVisible(result);
        console.log('useRemoteConfig', `${result}`);
      } catch (e) {
        console.log('useRemoteConfig', `${e}`);
      }
    }, []);
    useEffect(() => {
      fetchFlag();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (visible) {
      return createElement<P>(WrappedComponent as FC<P>, {
        ...props,
        updateFlag: fetchFlag,
      });
    }
    return createElement(Fragment);
  };
