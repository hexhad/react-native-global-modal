import { ALERT_TYPE, PRIORITY } from "./enums";
import type { AlertData, GlobalAlertInstance } from "./types";

export const GlobalAlert: GlobalAlertInstance = {
    show: (options: AlertData) => {
        console.error('GlobalAlert.show called before GlobalAlertProvider mounted.', options);
    },
    hide: () => {
        console.error('GlobalAlert.hide called before GlobalAlertProvider mounted.');
    },
    clearAll: () => {
        console.error('GlobalAlert.clearAll called before GlobalAlertProvider mounted.');
    },
    showMultiple: (options: AlertData[]) => {
        console.error('GlobalAlert.showMultiple called before GlobalAlertProvider mounted.', options);
    },
    TYPE: ALERT_TYPE,
    PRIORITY
};

export const createGlobalAlert = (types: Record<string, string> = {}): GlobalAlertInstance => {
    return {
        show: (options: AlertData) => {
            console.error('GlobalAlert.show called before GlobalAlertProvider mounted.', options);
        },
        hide: () => {
            console.error('GlobalAlert.hide called before GlobalAlertProvider mounted.');
        },
        clearAll: () => {
            console.error('GlobalAlert.clearAll called before GlobalAlertProvider mounted.');
        },
        showMultiple: (options: AlertData[]) => {
            console.error('GlobalAlert.showMultiple called before GlobalAlertProvider mounted.', options);
        },
        TYPE: { ...GlobalAlert.TYPE, ...types },
        PRIORITY: GlobalAlert.PRIORITY,
    };
};