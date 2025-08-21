import React from 'react';

export type AlertButton = {
  title?: string;
  variant?: string;
  onPress?: () => void;
  closeOnPress?: boolean;
  style?: any;
  textStyle?: any;
}

export type AlertData = {
  type?: string;
  variant?: string;
  title?: string;
  message?: string;
  priority?: number;
  backdropDismiss?: boolean;
  buttons?: AlertButton[];
  onClose?: () => void;
  [key: string]: any;
}

export type AlertModalProps = {
  visible: boolean;
  data: AlertData | null;
  onClose?: () => void;
}

export type AlertModalRef = {
  show: (options: AlertData) => void;
  hide: () => void;
  clearAll: () => void;
}

export type Priority = {
  LOW: number;
  HIGH: number;
}

export type GlobalAlertInstance = {
  show: (options: AlertData) => void;
  hide: () => void;
  clearAll: () => void;
  showMultiple: (options: AlertData[]) => void;
  TYPE: Record<string, string>;
  PRIORITY: Priority;
}

export type GlobalAlertProviderProps = {
  children?: React.ReactNode;
  AlertModal: React.ComponentType<AlertModalProps>;
  types?: Record<string, string>;
  globalAlert?: GlobalAlertInstance;
  ignorePriority?: boolean;
}