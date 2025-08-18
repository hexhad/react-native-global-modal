<a href="https://hexhad.github.io">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./docs/img/dark-banner.png" />
    <source media="(prefers-color-scheme: light)" srcset="./banner/ligh-banner.png" />
    <img alt="globalAlert" src="./docs/img/light-banner.png" />
  </picture>
</a>

## Features

- 🚀 **Global Access** - Show alerts from anywhere in your app
- 📱 **React Native Optimized** - Built specifically for React Native
- 🎯 **Priority System** - High and low priority alert queuing with LIFO processing
- 🎨 **Fully Customizable** - Custom styling and alert components
- ⚡ **TypeScript Support** - Full type safety out of the box
- 🔄 **Smart Queue Management** - Intelligent alert queuing with priority handling
- 🪝 **React Hooks** - Modern React patterns with useGlobalAlert hook
- 🎭 **Multiple Alert Types** - Error, Warning, Success, Info, and more
- ⚙️ **Flexible Configuration** - Optional priority enforcement and backdrop dismiss

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
import { GlobalAlertProvider, GlobalAlert } from '@hexhad/react-native-global-modal';
import CustomAlertModal from './components/CustomAlertModal';

export default function App() {
  return (
    <GlobalAlertProvider 
      AlertModal={CustomAlertModal}
      ignorePriority={false} // Optional: set to true to always show latest alert
    >
      {/* Your app content */}
    </GlobalAlertProvider>
  );
}
```

### 2. Create Your Alert Modal Component

```tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { AlertModalProps } from '@hexhad/react-native-global-modal';

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
                style={[styles.button, button.style, { backgroundColor: getButtonColor(button.variant) }]}
                onPress={() => {
                  button.onPress?.();
                  if (button.closeOnPress !== false) {
                    onClose?.();
                  }
                }}
              >
                <Text style={[styles.buttonText, button.textStyle]}>{button.title}</Text>
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
import { GlobalAlert } from '@hexhad/react-native-global-modal';

// Simple alert
GlobalAlert.show({
  title: 'Success!',
  message: 'Your action was completed successfully.',
  type: GlobalAlert.TYPE.SUCCESS,
  buttons: [
    {
      title: 'OK',
      onPress: () => console.log('OK pressed'),
      closeOnPress: true, // Default behavior
    },
  ],
});

// High priority alert (interrupts current alerts)
GlobalAlert.show({
  title: 'Critical Error',
  message: 'Something went wrong!',
  p: GlobalAlert.P.HIGH, // High priority
  type: GlobalAlert.TYPE.ERROR,
  buttons: [
    {
      title: 'Retry',
      onPress: () => {
        // Handle retry logic
        console.log('Retrying...');
      },
    },
    {
      title: 'Cancel',
      variant: 'ERROR',
      onPress: () => console.log('Cancelled'),
    },
  ],
});

// Alert with backdrop dismiss
GlobalAlert.show({
  title: 'Info',
  message: 'Tap outside to dismiss',
  backdropDismiss: true,
  buttons: [
    {
      title: 'Got it',
      closeOnPress: true,
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
import { useGlobalAlert } from '@hexhad/react-native-global-modal';

const MyComponent: React.FC = () => {
  const alert = useGlobalAlert();

  const showConfirmation = () => {
    alert.show({
      title: 'Confirm Action',
      message: 'Are you sure you want to proceed?',
      type: alert.TYPE.QUESTION,
      p: alert.P.HIGH, // Ensure this shows immediately
      buttons: [
        {
          title: 'Cancel',
          onPress: () => console.log('Cancelled'),
          closeOnPress: true,
        },
        {
          title: 'Confirm',
          variant: 'SUCCESS',
          onPress: () => {
            console.log('Confirmed!');
            // Handle confirmation logic
          },
          closeOnPress: true,
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

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `AlertModal` | `React.ComponentType<AlertModalProps>` | ✅ | - | Your custom alert modal component |
| `children` | `React.ReactNode` | ✅ | - | Your app content |
| `types` | `Record<string, string>` | ❌ | `{}` | Custom alert types (merged with defaults) |
| `globalAlert` | `GlobalAlertInstance` | ❌ | - | Custom global alert instance |
| `ignorePriority` | `boolean` | ❌ | `false` | If true, always show the latest alert immediately |

### AlertData

Configuration object for alert content and behavior.

```tsx
type AlertData = {
  type?: string;           // Alert type (ERROR, SUCCESS, etc.)
  variant?: string;        // Visual variant for buttons/styling
  title?: string;          // Alert title
  message?: string;        // Alert message
  p?: number;             // Priority: 0 (LOW) or 1 (HIGH)
  backdropDismiss?: boolean; // Allow dismissing by tapping backdrop
  buttons?: AlertButton[]; // Array of action buttons
  onClose?: () => void;    // Callback when alert closes
  [key: string]: any;      // Additional custom properties
};
```

### AlertButton

Configuration for alert buttons.

```tsx
type AlertButton = {
  title?: string;         // Button text
  variant?: string;       // Visual variant for styling
  onPress?: () => void;   // Button press handler
  closeOnPress?: boolean; // Whether to close alert on press (default: true)
  style?: any;           // Custom button styles
  textStyle?: any;       // Custom button text styles
};
```

### AlertModalProps

Props passed to your custom modal component.

```tsx
type AlertModalProps = {
  visible: boolean;        // Whether modal should be visible
  data: AlertData | null;  // Alert configuration data
  onClose?: () => void;    // Function to close the alert
};
```

### GlobalAlert Object

#### Properties

- `GlobalAlert.TYPE`: Predefined alert types
  - `ERROR`, `WARNING`, `SUCCESS`, `INFO`, `NOTICE`, `QUESTION`, `LOADING`, `TIP`
- `GlobalAlert.P`: Priority levels
  - `LOW: 0` (Low priority - default)
  - `HIGH: 1` (High priority)

#### Methods

- `GlobalAlert.show(options: AlertData)`: Show an alert
- `GlobalAlert.hide()`: Hide the current alert

### useGlobalAlert Hook

React hook that provides access to the alert system within components.

```tsx
const alert = useGlobalAlert();
// Returns: { show, hide, TYPE, P }
```

**Note:** The hook will throw an error if used outside of `GlobalAlertProvider`.

## Priority System & Queue Management

The alert system uses a sophisticated priority-based queue with LIFO (Last In, First Out) processing:

### Priority Levels
- **Low Priority (`P.LOW = 0`)**: Default priority. Can be interrupted by any alert.
- **High Priority (`P.HIGH = 1`)**: Interrupts low priority alerts and queues when interrupted by other high priority alerts.

### Queue Behavior

#### With `ignorePriority={false}` (Default)
1. **Low priority showing + High priority triggered** → High priority shows immediately, low priority discarded
2. **High priority showing + High priority triggered** → New alert shows immediately, current alert queued
3. **High priority showing + Low priority triggered** → Low priority shows immediately, high priority alert queued
4. **Queue processing** → Only high priority alerts are preserved in queue, processed in LIFO order

#### With `ignorePriority={true}`
1. **Any alert showing + New alert triggered** → New alert shows immediately, current alert queued (regardless of priority)
2. **Queue processing** → All alerts processed in LIFO order

### Queue Processing Details
- Queue processing happens 50ms after an alert is hidden
- Only one alert can be shown at a time
- When `ignorePriority={false}`, only high priority alerts are kept in the queue
- The queue uses LIFO (stack) behavior - most recent alerts show first

## Examples

### Loading Alert

```tsx
const showLoading = () => {
  GlobalAlert.show({
    type: GlobalAlert.TYPE.LOADING,
    message: 'Please wait...',
    p: GlobalAlert.P.HIGH,
    // No buttons = user must wait for programmatic dismissal
  });
  
  // Simulate async operation
  setTimeout(() => {
    GlobalAlert.hide();
    
    // Show completion
    GlobalAlert.show({
      type: GlobalAlert.TYPE.SUCCESS,
      title: 'Complete!',
      message: 'Operation finished successfully.',
      buttons: [{ title: 'OK' }],
    });
  }, 3000);
};
```

### Custom Properties & Styling

Your alert modal can access any custom properties you pass:

```tsx
GlobalAlert.show({
  title: 'Custom Alert',
  message: 'This alert has custom properties',
  customIcon: 'star',           // Custom property
  backgroundColor: '#f0f0f0',   // Custom property
  animationType: 'bounce',      // Custom property
  buttons: [
    {
      title: 'Styled Button',
      style: { 
        backgroundColor: '#FF6B6B', 
        borderRadius: 20,
        paddingHorizontal: 30,
      },
      textStyle: { 
        color: 'white', 
        fontWeight: 'bold',
        fontSize: 16,
      },
      onPress: () => console.log('Custom button pressed'),
    },
  ],
});
```

### Error Handling with Retry

```tsx
const handleApiError = (error: Error, retryFn: () => void) => {
  GlobalAlert.show({
    title: 'Request Failed',
    message: error.message || 'An unexpected error occurred.',
    type: GlobalAlert.TYPE.ERROR,
    p: GlobalAlert.P.HIGH, // Ensure it shows immediately
    buttons: [
      {
        title: 'Retry',
        variant: 'SUCCESS',
        onPress: () => {
          console.log('Retrying...');
          retryFn();
        },
      },
      {
        title: 'Cancel',
        variant: 'ERROR',
        onPress: () => console.log('Operation cancelled'),
      },
    ],
    onClose: () => {
      console.log('Error alert closed');
    },
  });
};
```

### Confirmation Dialog

```tsx
const showDeleteConfirmation = (itemName: string, onConfirm: () => void) => {
  GlobalAlert.show({
    title: 'Delete Item',
    message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
    type: GlobalAlert.TYPE.QUESTION,
    p: GlobalAlert.P.HIGH,
    buttons: [
      {
        title: 'Cancel',
        style: { backgroundColor: '#gray' },
        onPress: () => console.log('Delete cancelled'),
      },
      {
        title: 'Delete',
        variant: 'ERROR',
        onPress: () => {
          console.log(`Deleting ${itemName}`);
          onConfirm();
        },
      },
    ],
  });
};
```

### Alert Queue Demo

```tsx
const showQueueDemo = () => {
  // Low priority alert
  GlobalAlert.show({
    title: 'Low Priority 1',
    message: 'This is a low priority alert',
    p: GlobalAlert.P.LOW,
    buttons: [{ title: 'OK' }],
  });
  
  // High priority alert (will interrupt)
  setTimeout(() => {
    GlobalAlert.show({
      title: 'High Priority',
      message: 'This high priority alert interrupts the low priority one',
      p: GlobalAlert.P.HIGH,
      buttons: [{ title: 'Got it' }],
    });
  }, 1000);
  
  // Another high priority (will queue)
  setTimeout(() => {
    GlobalAlert.show({
      title: 'Another High Priority',
      message: 'This will be queued and shown after the first high priority alert',
      p: GlobalAlert.P.HIGH,
      buttons: [{ title: 'Understood' }],
    });
  }, 2000);
};
```

## Advanced Usage

### Custom Alert Types

```tsx
// In your app setup
const customTypes = {
  CUSTOM_SUCCESS: 'CUSTOM_SUCCESS',
  MAINTENANCE: 'MAINTENANCE',
  FEATURE_ANNOUNCEMENT: 'FEATURE_ANNOUNCEMENT',
};

<GlobalAlertProvider 
  AlertModal={CustomAlertModal}
  types={customTypes}
>
  {/* Your app */}
</GlobalAlertProvider>

// Usage
GlobalAlert.show({
  type: 'CUSTOM_SUCCESS', // or GlobalAlert.TYPE.CUSTOM_SUCCESS
  title: 'Feature Updated!',
  message: 'Check out the new functionality.',
});
```

### Error Boundaries Integration

```tsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    GlobalAlert.show({
      title: 'Application Error',
      message: 'Something went wrong. The app will reload.',
      type: GlobalAlert.TYPE.ERROR,
      p: GlobalAlert.P.HIGH,
      buttons: [
        {
          title: 'Reload App',
          onPress: () => {
            // Reload or restart logic
            window.location.reload();
          },
        },
      ],
    });
  }
  
  render() {
    return this.props.children;
  }
}
```

## TypeScript Support

The library is fully typed with comprehensive TypeScript definitions:

```tsx
import type { 
  AlertData, 
  AlertButton, 
  AlertModalProps,
  AlertModalRef,
  GlobalAlertInstance,
  GlobalAlertProviderProps,
  Priority
} from '@hexhad/react-native-global-modal';

// Example: Typed custom alert function
const showTypedAlert = (config: AlertData): void => {
  GlobalAlert.show({
    ...config,
    p: config.p ?? GlobalAlert.P.LOW, // Default to low priority
  });
};
```

## Best Practices

1. **Use High Priority Sparingly** - Reserve `P.HIGH` for critical alerts that must interrupt the user
2. **Provide Clear Actions** - Always include actionable buttons unless the alert is purely informational
3. **Handle onClose Properly** - Use `onClose` callback for cleanup when alerts are dismissed
4. **Custom Properties** - Leverage custom properties to pass additional data to your modal component
5. **Error Handling** - Always handle button press errors gracefully
6. **Queue Management** - Consider using `ignorePriority={true}` for simpler queue behavior if priority handling isn't needed

## Troubleshooting

### Common Issues

1. **"GlobalAlert.show called before GlobalAlertProvider mounted"**
   - Ensure `GlobalAlertProvider` wraps your app at the root level
   - Don't call `GlobalAlert.show()` during app initialization before the provider mounts

2. **"useGlobalAlert must be used within a GlobalAlertProvider"**
   - The `useGlobalAlert()` hook can only be used inside components wrapped by `GlobalAlertProvider`

3. **Alerts not showing**
   - Check that your `AlertModal` component properly handles the `visible` prop
   - Ensure your modal component renders when `data` is not null

4. **Queue not working as expected**
   - Review the priority system documentation
   - Consider using `ignorePriority={true}` for simpler behavior

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with ❤️ for the React Native community