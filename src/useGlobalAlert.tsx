import React from 'react';
import type { GlobalAlertInstance } from './types';

export const GlobalAlertContext = React.createContext<GlobalAlertInstance | undefined>(undefined);

export const useGlobalAlert = () => {
    const context = React.useContext(GlobalAlertContext);
    if (context === undefined) {
        throw new Error('useGlobalAlert must be used within a GlobalAlertProvider');
    }
    return context;
};