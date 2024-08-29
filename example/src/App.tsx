import * as React from 'react';

import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// @ts-ignore
import Selector from '@wiicamp/react-native-selector';
import {
  YandexRemoteConfig,
  FlagType,
  useRemoteConfig,
  wrapFeatureToggle,
} from '@beletsky/react-native-yandex-remote-config';
import { TestComponent } from './TestComponent';

const APPMETRICA_APP_ID = 'appmetrica.<YOUR_APPLICATION_ID>';

export default function App() {
  const [key, setKey] = React.useState<string>('test-bool');
  const [keyType, setKeyType] = React.useState<FlagType>(FlagType.bool);
  const [result, setResult] = React.useState<string>();
  const [deviceId, setDeivceId] = React.useState<string>();

  const [flag, updateFlag] = useRemoteConfig('test-string', FlagType.string);

  React.useLayoutEffect(() => {
    YandexRemoteConfig.init(APPMETRICA_APP_ID)
      .then((res: string) => {
        console.log(`success: method shared.initialize: --> ${res}`);
      })
      .catch((err: any) => {
        console.log(`error: method shared.initialize: --> ${err}`);
      });
  }, []);

  const getFlagValue = () => {
    if (key) {
      YandexRemoteConfig.get(key, keyType)
        .then((r) => {
          console.log(r);
          setResult(`${r}`);
        })
        .catch((err: any) => {
          console.log(`error: method shared.getString: --> ${err}`);
        });
    }
  };

  const execAlert = (flagValue: boolean) => (text: string) => {
    Alert.alert('Feature Toggle alert', `${text}: ${flagValue}`);
    return 'sss';
  };

  const scheduledAlert = wrapFeatureToggle({
    flag: 'test-bool',
    flagType: FlagType.bool,
    callback: execAlert,
    condition: (value) => {
      return !!value;
    },
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.titleContainer}>
        <View style={styles.yaContainer}>
          <Text style={styles.ya}>Я</Text>
        </View>
        <Text style={styles.title}>Varioqub</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={key}
          autoCapitalize={'none'}
          autoCorrect={false}
          blurOnSubmit
          onChangeText={setKey}
        />
        <TouchableOpacity style={styles.searchButton} onPress={getFlagValue}>
          <Text style={styles.searchBtnText}>Найти</Text>
        </TouchableOpacity>
      </View>
      <Button
        title={'Test alert with Feature Toggle'}
        onPress={() =>
          scheduledAlert('I`m here!').then((resp) => console.log({ resp }))
        }
      />
      <TestComponent
        style={{ backgroundColor: '#DDD', borderRadius: 15, padding: 10 }}
        text={flag}
        refetchFlag={updateFlag}
      />
      <View style={styles.selectorContainer}>
        <Selector
          theme="dropdown"
          items={[
            { value: FlagType.string },
            { value: FlagType.int },
            { value: FlagType.double },
            { value: FlagType.bool },
          ]}
          valueKey="value"
          labelKey="value"
          defaultValue={FlagType.string}
          textOptionStyle={{ color: '#555', fontSize: 16 }}
          placeholderContainerStyle={{
            paddingVertical: 20,
            borderColor: 'transparent',
          }}
          optionContainerStyle={{
            height: 20,
            borderColor: 'transparent',
          }}
          onChange={setKeyType}
        />
      </View>
      <View style={styles.resultTextContainer}>
        <Text style={styles.resultText}>Результат: {result}</Text>
      </View>

      <View style={styles.deviceIdTextContainer}>
        <Text style={styles.deviceIdText}>Device ID: {deviceId}</Text>
      </View>
      <TouchableOpacity
        style={styles.deviceIdButton}
        onPress={() => {
          YandexRemoteConfig.getDeviceId()
            .then((val: string) => {
              console.log({ deviceId: val });
              setDeivceId(val);
            })
            .catch((err: any) => {
              console.log('no device: ' + err);
            });
        }}
      >
        <Text style={styles.searchBtnText}>Получить ID Устройства</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => {
          YandexRemoteConfig.fetchConfig()
            .then((res3: string) => {
              console.log({ res3 });
            })
            .catch((err3: any) => {
              console.log({ err3 });
            });
        }}
      >
        <Text style={styles.updateBtnText}>Обновить конфигурацию</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => {
          YandexRemoteConfig.activateConfig()
            .then((res4: string) => {
              console.log({ res4 });
            })
            .catch((err4: any) => {
              console.log({ err4 });
            });
        }}
      >
        <Text style={styles.updateBtnText}>Активировать конфигурацию</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  titleContainer: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#e14017',
    borderWidth: 2,
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 45,
  },
  yaContainer: {
    color: '#fff',
    width: 50,
    fontSize: 32,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
    height: 50,
    borderRadius: 50,
    backgroundColor: '#e14017',
  },
  ya: {
    color: '#fff',
    fontSize: 32,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  selectorContainer: {
    marginTop: 50,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
    width: '100%',
    backgroundColor: 'rgb(220,220,220)',
  },
  title: {
    paddingLeft: 8,
    color: '#000',
    fontSize: 32,
  },
  searchContainer: {
    marginTop: 50,
    flexDirection: 'row',
    height: 40,
  },
  resultTextContainer: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
    width: '100%',
    backgroundColor: 'rgb(220,220,220)',
  },
  resultText: {},
  deviceIdTextContainer: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
    width: '100%',
    backgroundColor: 'rgb(220,220,220)',
  },
  deviceIdText: {},
  searchInput: {
    flex: 4,
    paddingLeft: 8,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    color: '#222',
    borderWidth: 2,
    borderColor: 'rgb(255,204,0)',
  },
  searchButton: {
    flex: 1,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: 'rgb(255,204,0)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtnText: {
    fontSize: 17,
    fontWeight: '700',
  },
  deviceIdButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
    backgroundColor: 'rgb(255,204,0)',
  },
  updateButton: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
    backgroundColor: 'rgb(220,220,220)',
  },
  updateBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
  },
});
