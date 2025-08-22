import { Text, View, StyleSheet } from 'react-native';
import {
  GlobalAlert,
  GlobalAlertProvider,
} from '@hexhad/react-native-global-modal';
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

const delayFor = (time: number = 200): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const App: React.FC = () => {
  const onPressTimeoutHandler = () => {
    GlobalAlert.show({
      message: 'HIGH 1',
      priority: GlobalAlert.PRIORITY.HIGH,
      dismissIn: 200,
    });
  };

  const onPressTimeoutHandler2 = () => {
    GlobalAlert.show({
      message: 'HIGH 1',
      priority: GlobalAlert.PRIORITY.HIGH,
      dismissIn: 1000,
    });
  };

  const onPressAlertsButtonHandler = () => {
    GlobalAlert.show({
      message: 'HIGH 1',
      priority: GlobalAlert.PRIORITY.HIGH,
    });
    GlobalAlert.show({ message: 'LOW 1', priority: GlobalAlert.PRIORITY.LOW });
    GlobalAlert.show({
      message: 'HIGH 2',
      priority: GlobalAlert.PRIORITY.HIGH,
    });
    GlobalAlert.show({ message: 'LOW 2', priority: GlobalAlert.PRIORITY.LOW });
  };

  const onPressCloseAllHandler = () => {
    GlobalAlert.show({
      message: 'HIGH 1',
      priority: GlobalAlert.PRIORITY.HIGH,
    });
    GlobalAlert.show({ message: 'LOW 1', priority: GlobalAlert.PRIORITY.LOW });
    GlobalAlert.show({
      message: 'HIGH 2',
      priority: GlobalAlert.PRIORITY.HIGH,
    });
    GlobalAlert.show({ message: 'LOW 2', priority: GlobalAlert.PRIORITY.LOW });

    setTimeout(() => GlobalAlert.clearAll(), 2000);
  };

  const onPressWithDelayHandler = async () => {
    GlobalAlert.show({
      message: 'HIGH 1',
      priority: GlobalAlert.PRIORITY.HIGH,
    });
    await delayFor(1000);
    GlobalAlert.show({ message: 'LOW 2', priority: GlobalAlert.PRIORITY.LOW });
  };

  const onPressMultipleAlertsButtonHandler = () => {
    GlobalAlert.show({
      message: 'HIGH 2',
      priority: GlobalAlert.PRIORITY.HIGH,
    });

    GlobalAlert.showMultiple([
      { message: 'showMultiple HIGH 1', priority: GlobalAlert.PRIORITY.HIGH },
      { message: 'showMultiple LOW 1', priority: GlobalAlert.PRIORITY.LOW },
      { message: 'showMultiple HIGH 2', priority: GlobalAlert.PRIORITY.HIGH },
    ]);
  };

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
  };

  return (
    <GlobalAlertProvider
      ignorePriority={!true}
      AlertModal={AlertModal}
      types={ALERT_TYPES}
      globalAlert={GlobalAlert}
    >
      <View style={styles.container}>
        <Text>Global Alert</Text>
        <CustomButton title="Dismiss in 200" onPress={onPressTimeoutHandler} />
        <CustomButton
          title="Dismiss in 1000"
          onPress={onPressTimeoutHandler2}
        />
        <CustomButton
          title="Open Alerts"
          onPress={onPressAlertsButtonHandler}
        />
        <CustomButton
          title="Open Advance Alert"
          onPress={onPressAdvanceAlertButtonHandler}
        />
        <CustomButton
          title="Open Multiple Alert"
          onPress={onPressMultipleAlertsButtonHandler}
        />
        <CustomButton title="Close All" onPress={onPressCloseAllHandler} />
        <CustomButton title="Delay" onPress={onPressWithDelayHandler} />
      </View>
    </GlobalAlertProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
