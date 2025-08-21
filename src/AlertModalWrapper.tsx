import React, { forwardRef, useImperativeHandle } from "react";
import type { AlertData, AlertModalProps, AlertModalRef } from "./types";

export const AlertModalWrapper = forwardRef<AlertModalRef, { UserAlertModal: React.ComponentType<AlertModalProps> }>(
    ({ UserAlertModal }, ref) => {
        const [visible, setVisible] = React.useState(false);
        const [alertData, setAlertData] = React.useState<AlertData | null>(null);

        useImperativeHandle(ref, () => ({
            show: (options: AlertData) => {
                setAlertData(options);
                setVisible(true);
            },
            hide: () => {
                setVisible(false);
                setAlertData(null);
            },
            clearAll: () => {
                setVisible(false);
                setAlertData(null);
            }
        }));

        return <UserAlertModal visible={visible} data={alertData} onClose={alertData?.onClose} />;
    },
);

AlertModalWrapper.displayName = "AlertModalWrapper";