import type {
  PropsWithChildren,
  ReactElement,
  ValidationMap,
  WeakValidationMap,
} from 'react';

export type Settings = {
  baseURL?: string;
  settings?: any;
  network?: any;
  fetchThrottle?: number;
  clientFeatures?: Record<string, string>;
  varioqubQueue?: any;
  outputQueue?: any;
};

export enum FlagType {
  string = 'string',
  int = 'int',
  double = 'double',
  bool = 'bool',
}

export type ValueType<T extends FlagType> = T extends FlagType.string
  ? string
  : T extends FlagType.bool
    ? boolean
    : number;

export interface FCFT<P> {
  (
    props: PropsWithChildren<
      P & {
        updateFlag: () => void;
      }
    >,
    context?: any
  ): ReactElement<any, any> | null;

  propTypes?: WeakValidationMap<P> | undefined;
  contextTypes?: ValidationMap<any> | undefined;
  defaultProps?: Partial<P> | undefined;
  displayName?: string | undefined;
}
