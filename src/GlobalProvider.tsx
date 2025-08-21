import React, { createRef, useCallback, useEffect, useRef } from "react";
import { PRIORITY } from "./enums";
import { AlertModalWrapper } from "./AlertModalWrapper";
import { GlobalAlert } from "./globalAlert";
import type { AlertData, AlertModalRef, GlobalAlertProviderProps } from "./types";

const alertRef = createRef<AlertModalRef>();

export const GlobalAlertProvider: React.FC<GlobalAlertProviderProps> = ({
    children,
    AlertModal,
    ignorePriority = false,
}) => {
    const alertQueueRef = useRef<AlertData[]>([]);
    const showingRef = useRef(false);
    const mountedRef = useRef(false);
    const currentAlertRef = useRef<AlertData | null>(null);

    if (!AlertModal) {
        throw new Error("GlobalAlertProvider: AlertModal component is required");
    }

    const hide = useCallback(() => {
        alertRef.current?.hide?.();
        showingRef.current = false;
        currentAlertRef.current = null;
        setTimeout(() => {
            processQueue();
        }, 50);
    }, []);

    const clearAll = useCallback(() => {
        alertQueueRef.current = [];
        alertRef.current?.clearAll?.();
        showingRef.current = false;
        currentAlertRef.current = null;
    }, []);

    const processQueue = useCallback(() => {
        if (showingRef.current) return;

        if (alertQueueRef.current.length > 0) {
            const nextAlert = alertQueueRef.current.pop()!;

            showingRef.current = true;
            currentAlertRef.current = nextAlert;

            const originalOnClose = nextAlert.onClose;
            const safeOnClose = () => {
                try {
                    originalOnClose?.();
                } finally {
                    hide();
                }
            };

            alertRef.current?.show?.({
                ...nextAlert,
                onClose: safeOnClose,
            });
        }
    }, [hide]);

    const showMultiple = useCallback((options: AlertData[]) => {
        if (!options || options.length === 0) return;

        options.forEach((alertOption) => {
            const alertOptions = { priority: PRIORITY.LOW, ...alertOption };

            if (ignorePriority) {
                if (showingRef.current && currentAlertRef.current) {
                    alertQueueRef.current.push(currentAlertRef.current);
                    alertRef.current?.hide?.();
                    showingRef.current = false;
                    currentAlertRef.current = null;
                }

                alertQueueRef.current.push(alertOptions);

                const latestAlert = alertQueueRef.current.pop()!;
                showingRef.current = true;
                currentAlertRef.current = latestAlert;

                const originalOnClose = latestAlert.onClose;
                const safeOnClose = () => {
                    try {
                        originalOnClose?.();
                    } finally {
                        alertRef.current?.hide?.();
                        showingRef.current = false;
                        currentAlertRef.current = null;
                        setTimeout(() => {
                            processQueue();
                        }, 50);
                    }
                };

                alertRef.current?.show?.({
                    ...latestAlert,
                    onClose: safeOnClose,
                });
            } else {
                alertQueueRef.current = alertQueueRef.current.filter(alert => alert.priority === PRIORITY.HIGH);

                if (showingRef.current && currentAlertRef.current) {
                    if (currentAlertRef.current.priority === PRIORITY.HIGH) {
                        alertQueueRef.current.push(currentAlertRef.current);
                    }
                    alertRef.current?.hide?.();
                    showingRef.current = false;
                    currentAlertRef.current = null;
                }
                alertQueueRef.current.push(alertOptions);
                processQueue();
            }
        });
    }, [processQueue, ignorePriority]);

    const show = useCallback((options: AlertData) => {
        const alertOptions = { priority: PRIORITY.LOW, ...options };

        if (ignorePriority) {
            if (showingRef.current && currentAlertRef.current) {
                alertQueueRef.current.push(currentAlertRef.current);
                alertRef.current?.hide?.();
                showingRef.current = false;
                currentAlertRef.current = null;
            }

            alertQueueRef.current.push(alertOptions);

            const latestAlert = alertQueueRef.current.pop()!;
            showingRef.current = true;
            currentAlertRef.current = latestAlert;

            const originalOnClose = latestAlert.onClose;
            const safeOnClose = () => {
                try {
                    originalOnClose?.();
                } finally {
                    alertRef.current?.hide?.();
                    showingRef.current = false;
                    currentAlertRef.current = null;
                    setTimeout(() => {
                        processQueue();
                    }, 50);
                }
            };

            alertRef.current?.show?.({
                ...latestAlert,
                onClose: safeOnClose,
            });
        } else {
            alertQueueRef.current = alertQueueRef.current.filter(alert => alert.priority === PRIORITY.HIGH);

            if (showingRef.current && currentAlertRef.current) {
                if (currentAlertRef.current.priority === PRIORITY.HIGH) {
                    alertQueueRef.current.push(currentAlertRef.current);
                }
                alertRef.current?.hide?.();
                showingRef.current = false;
                currentAlertRef.current = null;
            }
            alertQueueRef.current.push(alertOptions);
            processQueue();
        }
    }, [processQueue, ignorePriority]);

    useEffect(() => {
        mountedRef.current = true;

        GlobalAlert.show = show;
        GlobalAlert.hide = hide;
        GlobalAlert.clearAll = clearAll;
        GlobalAlert.showMultiple = showMultiple;

        return () => {
            mountedRef.current = false;
            GlobalAlert.show = (opts: AlertData) =>
                console.error('GlobalAlertProvider unmounted; cannot show alert.', opts);
            GlobalAlert.hide = () => { };
            GlobalAlert.clearAll = () => { };
            GlobalAlert.showMultiple = () => { };
            alertQueueRef.current = [];
            showingRef.current = false;
            currentAlertRef.current = null;
        };
    }, [show, hide, clearAll, showMultiple]);

    return (
        <>
            <AlertModalWrapper ref={alertRef} UserAlertModal={AlertModal} />
            {children}
        </>
    );
};