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
      title: 'Global Alert 1 ',
      p: GlobalAlert.P.L,
      message: 'This is Global Alert',
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
      title: 'Global Alert 2',
      p: GlobalAlert.P.H,
      message: 'This is Global Alert',
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
      title: 'Global Alert 3',
      p: GlobalAlert.P.L,
      message: 'This is Global Alert',
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
      title: 'Global Alert 44',
      p: GlobalAlert.P.H,
      message: 'This is Global Alert',
      variant: GlobalAlert.TYPE.ERROR,
      buttons: [
        {
          title: 'ERROR',
          variant: GlobalAlert.TYPE.ERROR,
          onPress: () => GlobalAlert.hide(),
        },
      ],
    });

  }
  const onPressAlertButtonHandler = () => {
    GlobalAlert.show({
      title: 'Global Alert 1 ',
      p: GlobalAlert.P.L,
      message: 'This is Global Alert',
      variant: GlobalAlert.TYPE.ERROR,
      buttons: [
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
        <CustomButton title='Open Alerts' onPress={onPressAlertsButtonHandler}/>
        <CustomButton title='Open Alert' onPress={onPressAlertButtonHandler}/>
      </View>
    </GlobalAlertProvider>
  );
};

export default App