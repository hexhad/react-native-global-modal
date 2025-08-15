# react-native-global-modal

A powerful, flexible global alert system for React Native applications that provides seamless alert management with priority-based queuing, customizable styling, and both imperative and declarative APIs.

## Features

- 🚀 **Global Access** - Show alerts from anywhere in your app
- 📱 **React Native Optimized** - Built specifically for React Native
- 🎯 **Priority System** - High and low priority alert queuing
- 🎨 **Fully Customizable** - Custom styling and alert components
- ⚡ **TypeScript Support** - Full type safety out of the box
- 🔄 **Queue Management** - Smart alert queuing with LIFO processing
- 🪝 **React Hooks** - Modern React patterns with useGlobalAlert hook
- 🎭 **Multiple Alert Types** - Error, Warning, Success, Info, and more

## Installation

```sh
npm install @hexhad/react-native-global-modal
```

or

```sh
yarn add @hexhad/react-native-global-modal
```

## Quick Start

### 1. Setup the Provider

Wrap your app with `GlobalAlertProvider` and provide your custom alert modal component:

```tsx
import React from 'react';
import { GlobalAlertProvider, GlobalAlert } from 'react-native-global-modal';
import CustomAlertModal from './components/CustomAlertModal';

export default function App() {
  return (
    <GlobalAlertProvider AlertModal={CustomAlertModal}>
      {/* Your app content */}
    </GlobalAlertProvider>
  );
}
```

### 2. Create Your Alert Modal Component

```tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { AlertModalProps } from 'react-native-global-modal';

const CustomAlertModal: React.FC<AlertModalProps> = ({ visible, data, onClose }) => {
  if (!data) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {data.title && <Text style={styles.title}>{data.title}</Text>}
          {data.message && <Text style={styles.message}>{data.message}</Text>}
          
          <View style={styles.buttonContainer}>
            {data.buttons?.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.button, { backgroundColor: getButtonColor(button.variant) }]}
                onPress={() => {
                  button.onPress?.();
                  if (button.closeOnPress !== false) {
                    onClose?.();
                  }
                }}
              >
                <Text style={styles.buttonText}>{button.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getButtonColor = (variant?: string) => {
  switch (variant) {
    case 'ERROR': return '#FF6B6B';
    case 'SUCCESS': return '#51CF66';
    case 'WARNING': return '#FFD93D';
    default: return '#339AF0';
  }
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    minWidth: 280,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 80,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CustomAlertModal;
```

### 3. Show Alerts

#### Using Global Object (Imperative API)

```tsx
import { GlobalAlert } from 'react-native-global-modal';

// Simple alert
GlobalAlert.show({
  title: 'Success!',
  message: 'Your action was completed successfully.',
  variant: GlobalAlert.TYPE.SUCCESS,
  buttons: [
    {
      title: 'OK',
      onPress: () => GlobalAlert.hide(),
    },
  ],
});

// High priority alert (interrupts current alerts)
GlobalAlert.show({
  title: 'Critical Error',
  message: 'Something went wrong!',
  p: GlobalAlert.P.H, // High priority
  variant: GlobalAlert.TYPE.ERROR,
  buttons: [
    {
      title: 'Retry',
      onPress: () => {
        // Handle retry logic
        GlobalAlert.hide();
      },
    },
    {
      title: 'Cancel',
      variant: GlobalAlert.TYPE.ERROR,
      onPress: () => GlobalAlert.hide(),
    },
  ],
});

// Hide current alert
GlobalAlert.hide();
```

#### Using React Hook (Declarative API)

```tsx
import React from 'react';
import { View, Button } from 'react-native';
import { useGlobalAlert } from 'react-native-global-modal';

const MyComponent: React.FC = () => {
  const alert = useGlobalAlert();

  const showConfirmation = () => {
    alert.show({
      title: 'Confirm Action',
      message: 'Are you sure you want to proceed?',
      variant: alert.TYPE.QUESTION,
      buttons: [
        {
          title: 'Cancel',
          onPress: () => alert.hide(),
        },
        {
          title: 'Confirm',
          variant: alert.TYPE.SUCCESS,
          onPress: () => {
            // Handle confirmation
            console.log('Confirmed!');
            alert.hide();
          },
        },
      ],
    });
  };

  return (
    <View>
      <Button title="Show Confirmation" onPress={showConfirmation} />
    </View>
  );
};
```

## API Reference

### GlobalAlertProvider

Main provider component that manages the global alert system.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `AlertModal` | `React.ComponentType<AlertModalProps>` | ✅ | Your custom alert modal component |
| `children` | `React.ReactNode` | ✅ | Your app content |
| `types` | `Record<string, string>` | ❌ | Custom alert types |
| `globalAlert` | `GlobalAlertInstance` | ❌ | Custom global alert instance |

### AlertData

Configuration object for alert content and behavior.

```tsx
type AlertData = {
  type?: string;
  variant?: string;
  title?: string;
  message?: string;
  p?: number; // Priority: 0 (low) or 1 (high)
  backdropDismiss?: boolean;
  buttons?: AlertButton[];
  onClose?: () => void;
  [key: string]: any; // Additional custom properties
};
```

### AlertButton

Configuration for alert buttons.

```tsx
type AlertButton = {
  title?: string;
  variant?: string;
  onPress?: () => void;
  closeOnPress?: boolean; // Default: true
  style?: ViewStyle;
  textStyle?: TextStyle;
};
```

### GlobalAlert Object

#### Properties

- `GlobalAlert.TYPE`: Predefined alert types
  - `ERROR`, `WARNING`, `SUCCESS`, `INFO`, `NOTICE`, `QUESTION`, `LOADING`, `TIP`
- `GlobalAlert.P`: Priority levels
  - `L: 0` (Low priority)
  - `H: 1` (High priority)

#### Methods

- `GlobalAlert.show(options: AlertData)`: Show an alert
- `GlobalAlert.hide()`: Hide the current alert

### useGlobalAlert Hook

React hook that provides access to the alert system within components.

```tsx
const alert = useGlobalAlert();
// Returns the same API as GlobalAlert object
```

## Priority System

The alert system supports two priority levels:

- **Low Priority (P.L = 0)**: Default priority. These alerts can be replaced by any new alert.
- **High Priority (P.H = 1)**: These alerts interrupt low priority alerts and are queued when interrupted by other high priority alerts.

### Queue Behavior

1. When a **low priority** alert is showing and a **high priority** alert is triggered → High priority alert shows immediately, low priority alert is discarded.
2. When a **high priority** alert is showing and another **high priority** alert is triggered → New alert shows immediately, current alert is queued.
3. When a **high priority** alert is showing and a **low priority** alert is triggered → Low priority alert shows immediately, high priority alert is queued.
4. When alerts are closed, queued alerts are processed in LIFO (Last In, First Out) order.

## Examples

### Loading Alert

```tsx
const showLoading = () => {
  GlobalAlert.show({
    variant: GlobalAlert.TYPE.LOADING,
    message: 'Please wait...',
    p: GlobalAlert.P.H,
    // No buttons = non-dismissible
  });
  
  // Hide after operation completes
  setTimeout(() => {
    GlobalAlert.hide();
  }, 3000);
};
```

### Custom Styling

```tsx
GlobalAlert.show({
  title: 'Custom Alert',
  message: 'This alert has custom styling',
  customProperty: 'any value', // Custom properties are passed to your modal
  buttons: [
    {
      title: 'Styled Button',
      style: { backgroundColor: '#FF6B6B', borderRadius: 20 },
      textStyle: { color: 'white', fontWeight: 'bold' },
      onPress: () => GlobalAlert.hide(),
    },
  ],
});
```

### Network Error Handler

```tsx
const handleNetworkError = (error: Error) => {
  GlobalAlert.show({
    title: 'Network Error',
    message: 'Please check your internet connection and try again.',
    variant: GlobalAlert.TYPE.ERROR,
    p: GlobalAlert.P.H,
    buttons: [
      {
        title: 'Retry',
        onPress: () => {
          GlobalAlert.hide();
          // Retry logic here
        },
      },
      {
        title: 'Cancel',
        variant: GlobalAlert.TYPE.ERROR,
        onPress: () => GlobalAlert.hide(),
      },
    ],
  });
};
```

## TypeScript Support

The library is written in TypeScript and provides full type safety:

```tsx
import type { 
  AlertData, 
  AlertButton, 
  AlertModalProps, 
  GlobalAlertInstance 
} from 'react-native-global-modal';
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with ❤️ for the React Native community