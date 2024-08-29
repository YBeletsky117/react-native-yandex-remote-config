import { Button, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import {
  FlagType,
  withRemoteConfig,
} from '@beletsky/react-native-yandex-remote-config';

import type { FCFT } from '@beletsky/react-native-yandex-remote-config';

type TComponent = {
  text?: string;
  refetchFlag: () => void;
  style: StyleProp<ViewStyle>;
};

const Component: FCFT<TComponent> = ({
  style,
  text = 'none',
  updateFlag,
  refetchFlag,
}) => {
  return (
    <View
      style={[
        { width: '100%', alignItems: 'center', justifyContent: 'center' },
        style,
      ]}
    >
      <Text style={{ fontSize: 24 }}>TEST COMPONENT</Text>
      <Button title={'UPDATE MAIN FLAG'} onPress={updateFlag} />
      <Button title={'UPDATE TEXT FLAG'} onPress={refetchFlag} />
      {text ? <Text style={{ fontSize: 24 }}>{text}</Text> : null}
    </View>
  );
};

export const TestComponent = withRemoteConfig(
  {
    flag: 'test-bool',
    flagType: FlagType.bool,
  },
  Component
);
