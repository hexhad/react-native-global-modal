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

const delayFor = (time: number = 200): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, time));
};



  const onPressAlertsButtonHandler = () => {
    GlobalAlert.show({ message: 'HIGH 1', priority: GlobalAlert.PRIORITY.HIGH });
    GlobalAlert.show({ message: 'LOW 1', priority: GlobalAlert.PRIORITY.LOW });
    GlobalAlert.show({ message: 'HIGH 2', priority: GlobalAlert.PRIORITY.HIGH });
    GlobalAlert.show({ message: 'LOW 2', priority: GlobalAlert.PRIORITY.LOW });
  }

  const onPressCloseAllHandler = () => {
    GlobalAlert.show({ message: 'HIGH 1', priority: GlobalAlert.PRIORITY.HIGH });
    GlobalAlert.show({ message: 'LOW 1', priority: GlobalAlert.PRIORITY.LOW });
    GlobalAlert.show({ message: 'HIGH 2', priority: GlobalAlert.PRIORITY.HIGH });
    GlobalAlert.show({ message: 'LOW 2', priority: GlobalAlert.PRIORITY.LOW });

    setTimeout(() => GlobalAlert.clearAll(), 2000)
  }

  const onPressWithDelayHandler = async () => {
    GlobalAlert.show({ message: 'HIGH 1', priority: GlobalAlert.PRIORITY.HIGH });
    await delayFor(1000)
    GlobalAlert.show({ message: 'LOW 2', priority: GlobalAlert.PRIORITY.LOW });
  }

  const onPressMultipleAlertsButtonHandler = () => {
    GlobalAlert.show({ message: 'HIGH 2', priority: GlobalAlert.PRIORITY.HIGH });

    GlobalAlert.showMultiple([
      { message: 'showMultiple HIGH 1', priority: GlobalAlert.PRIORITY.HIGH },
      { message: 'showMultiple LOW 1', priority: GlobalAlert.PRIORITY.LOW },
      { message: 'showMultiple HIGH 2', priority: GlobalAlert.PRIORITY.HIGH },
    ]);
  }
  const onPressAdvanceAlertButtonHandler = () => {
    GlobalAlert.show({
      title: 'HIGH SHOWING ALERT 1',
      priority: GlobalAlert.PRIORITY.HIGH,
      message: 'HIGH SHOWING ALERT 1',
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
      ignorePriority={!true}
      AlertModal={AlertModal}
      types={ALERT_TYPES}
      globalAlert={GlobalAlert}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Global Alert</Text>
        <CustomButton title='Open Alerts' onPress={onPressAlertsButtonHandler} />
        <CustomButton title='Open Advance Alert' onPress={onPressAdvanceAlertButtonHandler} />
        <CustomButton title='Open Multiple Alert' onPress={onPressMultipleAlertsButtonHandler} />
        <CustomButton title='Close All' onPress={onPressCloseAllHandler} />
        <CustomButton title='Delay' onPress={onPressWithDelayHandler} />
      </View>
    </GlobalAlertProvider>
  );
};

export default App