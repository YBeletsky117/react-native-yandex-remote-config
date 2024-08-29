import { useCallback, useEffect, useState } from 'react';
import { YandexRemoteConfig, FlagType } from '../';
import type { ValueType } from '../types';

export const useRemoteConfig = <S extends FlagType, T extends ValueType<S>>(
  flag: string,
  flagType: S,
  defaultValue?: T
): [T | undefined, () => void, boolean] => {
  const [state, setState] = useState<T | undefined>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFlag = useCallback(async () => {
    try {
      setIsLoading(true);
      // @ts-ignore
      const result = await YandexRemoteConfig.get(flag, flagType, defaultValue);
      setState(result);
      console.log('useRemoteConfig', `${result}`);
    } catch (e) {
      console.log('useRemoteConfig', `${e}`);
    } finally {
      setIsLoading(false);
    }
  }, [defaultValue, flag, flagType]);
  useEffect(() => {
    fetchFlag();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [state, fetchFlag, isLoading];
};
