import { Text, View } from 'react-native';
import { GlobalAlert, GlobalAlertProvider } from '@hexhad/react-native-global-modal';
import CustomButton from './components/atom/CustomButton';
import AlertModal from './services/GlobalAlert/AlertModal';

const ALERT_TYPES = {
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  SUCCESS: 'SUCCESS',
  INFO: 'INFO',
  NOTICE: 'NOTICE',
  QUESTION: 'QUESTION',
  LOADING: 'LOADING',
  TIP: 'TIP',
} as const;

const App: React.FC = () => {

  const onPressAlertsButtonHandler = () => {
    GlobalAlert.show({
      title: 'LOW IGNORING ALERT 1',
      p: GlobalAlert.P.LOW,
      message: 'LOW IGNORING ALERT 1',
      variant: GlobalAlert.TYPE.ERROR,
      buttons: [
        {
          title: 'ERROR',
          variant: GlobalAlert.TYPE.ERROR,
          onPress: () => GlobalAlert.hide(),
        },
      ],
    });
    GlobalAlert.show({
      title: 'HIGH SHOWING ALERT 1',
      p: GlobalAlert.P.HIGH,
      message: 'HIGH SHOWING ALERT 1',
      variant: GlobalAlert.TYPE.ERROR,
      buttons: [
        {
          title: 'ERROR',
          variant: GlobalAlert.TYPE.ERROR,
          onPress: () => GlobalAlert.hide(),
        },
      ],
    });
    GlobalAlert.show({
      title: 'LOW IGNORING ALERT 2',
      p: GlobalAlert.P.LOW,
      message: 'LOW IGNORING ALERT 2',
      variant: GlobalAlert.TYPE.ERROR,
      buttons: [
        {
          title: 'ERROR',
          variant: GlobalAlert.TYPE.ERROR,
          onPress: () => GlobalAlert.hide(),
        },
        {
          title: 'ERROR',
          variant: GlobalAlert.TYPE.ERROR,
          onPress: () => GlobalAlert.hide(),
        },
      ],
    });

    GlobalAlert.show({
      title: 'HIGH SHOWING ALERT 2',
      p: GlobalAlert.P.HIGH,
      message: 'HIGH SHOWING ALERT 2',
      variant: GlobalAlert.TYPE.ERROR,
      buttons: [
        {
          title: 'ERROR',
          variant: GlobalAlert.TYPE.ERROR,
          onPress: () => GlobalAlert.hide(),
        },
      ],
    });

    GlobalAlert.show({
      title: 'LOW IGNORING ALERT 3',
      p: GlobalAlert.P.LOW,
      message: 'LOW IGNORING ALERT 3',
      variant: GlobalAlert.TYPE.ERROR,
      buttons: [
        {
          title: 'ERROR',
          variant: GlobalAlert.TYPE.ERROR,
          onPress: () => GlobalAlert.hide(),
        },
        {
          title: 'ERROR',
          variant: GlobalAlert.TYPE.ERROR,
          onPress: () => GlobalAlert.hide(),
        },
      ],
    });

  }

  return (
    <GlobalAlertProvider
      AlertModal={AlertModal}
      types={ALERT_TYPES}
      globalAlert={GlobalAlert}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Global Alert</Text>
        <CustomButton title='Open Alerts' onPress={onPressAlertsButtonHandler} />
      </View>
    </GlobalAlertProvider>
  );
};

export default App