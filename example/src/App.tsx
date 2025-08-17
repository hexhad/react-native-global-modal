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
    GlobalAlert.show({ message: 'HIGH 1', p: GlobalAlert.P.HIGH });
    GlobalAlert.show({ message: 'LOW 1', p: GlobalAlert.P.LOW });
    GlobalAlert.show({ message: 'HIGH 2', p: GlobalAlert.P.HIGH });
    GlobalAlert.show({ message: 'LOW 2', p: GlobalAlert.P.LOW });
  }

  return (
    <GlobalAlertProvider
      ignorePriority={true}
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