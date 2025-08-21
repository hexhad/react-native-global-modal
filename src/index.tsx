import React, { createRef, forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react"

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

export enum PRIORITY_TYPE {
    LOW = 0,
    HIGH = 1,
}

export enum ALERT_TYPE {
    ERROR = "ERROR",
    WARNING = "WARNING",
    SUCCESS = "SUCCESS",
    INFO = "INFO",
    NOTICE = "NOTICE",
    QUESTION = "QUESTION",
    LOADING = "LOADING",
    TIP = "TIP",
}
const alertRef = createRef<AlertModalRef>()


const AlertModalWrapper = forwardRef<AlertModalRef, { UserAlertModal: React.ComponentType<AlertModalProps> }>(
    ({ UserAlertModal }, ref) => {
        const [visible, setVisible] = React.useState(false)
        const [alertData, setAlertData] = React.useState<AlertData | null>(null)

        useImperativeHandle(ref, () => ({
            show: (options: AlertData) => {
                setAlertData(options)
                setVisible(true)
            },
            hide: () => {
                setVisible(false)
                setAlertData(null)
            },
            clearAll: () => {
                setVisible(false)
                setAlertData(null)
            }
        }))

        return <UserAlertModal visible={visible} data={alertData} onClose={alertData?.onClose} />
    },
)

AlertModalWrapper.displayName = "AlertModalWrapper"

export const GlobalAlert = {
    show: (options: AlertData) => {
        console.error('GlobalAlert.show called before GlobalAlertProvider mounted.', options)
    },
    hide: () => {
        console.error('GlobalAlert.hide called before GlobalAlertProvider mounted.')
    },
    clearAll: () => {
        console.error('GlobalAlert.clearAll called before GlobalAlertProvider mounted.')
    },
    showMultiple: (options: AlertData[]) => {
        console.error('GlobalAlert.showMultiple called before GlobalAlertProvider mounted.', options)
    },
    TYPE: ALERT_TYPE,
    PRIORITY: PRIORITY_TYPE
}

export const GlobalAlertProvider: React.FC<GlobalAlertProviderProps> = ({
    children,
    AlertModal,
    ignorePriority = false,
}) => {
    const alertQueueRef = useRef<AlertData[]>([])
    const showingRef = useRef(false)
    const mountedRef = useRef(false)
    const currentAlertRef = useRef<AlertData | null>(null)

    if (!AlertModal) {
        throw new Error("GlobalAlertProvider: AlertModal component is required")
    }

    const hide = useCallback(() => {
        alertRef.current?.hide?.()
        showingRef.current = false
        currentAlertRef.current = null
        setTimeout(() => {
            processQueue()
        }, 50)
    }, [])

    const clearAll = useCallback(() => {
        alertQueueRef.current = []
        alertRef.current?.clearAll?.()
        showingRef.current = false
        currentAlertRef.current = null
    }, [])

    const processQueue = useCallback(() => {
        if (showingRef.current) return

        if (alertQueueRef.current.length > 0) {
            const nextAlert = alertQueueRef.current.pop()!

            showingRef.current = true
            currentAlertRef.current = nextAlert

            const originalOnClose = nextAlert.onClose
            const safeOnClose = () => {
                try {
                    originalOnClose?.()
                } finally {
                    hide()
                }
            }

            alertRef.current?.show?.({
                ...nextAlert,
                onClose: safeOnClose,
            })
        }
    }, [hide])

    const showMultiple = useCallback((options: AlertData[]) => {
        if (!options || options.length === 0) return

        options.forEach((alertOption) => {
            const alertOptions = { priority: PRIORITY_TYPE.LOW, ...alertOption }

            if (ignorePriority) {
                if (showingRef.current && currentAlertRef.current) {
                    alertQueueRef.current.push(currentAlertRef.current)
                    alertRef.current?.hide?.()
                    showingRef.current = false
                    currentAlertRef.current = null
                }

                alertQueueRef.current.push(alertOptions)

                const latestAlert = alertQueueRef.current.pop()!
                showingRef.current = true
                currentAlertRef.current = latestAlert

                const originalOnClose = latestAlert.onClose
                const safeOnClose = () => {
                    try {
                        originalOnClose?.()
                    } finally {
                        alertRef.current?.hide?.()
                        showingRef.current = false
                        currentAlertRef.current = null
                        setTimeout(() => {
                            processQueue()
                        }, 50)
                    }
                }

                alertRef.current?.show?.({
                    ...latestAlert,
                    onClose: safeOnClose,
                })
            } else {
                alertQueueRef.current = alertQueueRef.current.filter(alert => alert.priority === PRIORITY_TYPE.HIGH)

                if (showingRef.current && currentAlertRef.current) {
                    if (currentAlertRef.current.priority === PRIORITY_TYPE.HIGH) {
                        alertQueueRef.current.push(currentAlertRef.current)
                    }
                    alertRef.current?.hide?.()
                    showingRef.current = false
                    currentAlertRef.current = null
                }
                alertQueueRef.current.push(alertOptions)
                processQueue()
            }
        })
    }, [processQueue, ignorePriority])

    const show = useCallback((options: AlertData) => {
        const alertOptions = { priority: PRIORITY_TYPE.LOW, ...options }

        if (ignorePriority) {
            if (showingRef.current && currentAlertRef.current) {
                alertQueueRef.current.push(currentAlertRef.current)
                alertRef.current?.hide?.()
                showingRef.current = false
                currentAlertRef.current = null
            }

            alertQueueRef.current.push(alertOptions)

            const latestAlert = alertQueueRef.current.pop()!
            showingRef.current = true
            currentAlertRef.current = latestAlert

            const originalOnClose = latestAlert.onClose
            const safeOnClose = () => {
                try {
                    originalOnClose?.()
                } finally {
                    alertRef.current?.hide?.()
                    showingRef.current = false
                    currentAlertRef.current = null
                    setTimeout(() => {
                        processQueue()
                    }, 50)
                }
            }

            alertRef.current?.show?.({
                ...latestAlert,
                onClose: safeOnClose,
            })
        } else {
            alertQueueRef.current = alertQueueRef.current.filter(alert => alert.priority === PRIORITY_TYPE.HIGH)

            if (showingRef.current && currentAlertRef.current) {
                if (currentAlertRef.current.priority === PRIORITY_TYPE.HIGH) {
                    alertQueueRef.current.push(currentAlertRef.current)
                }
                alertRef.current?.hide?.()
                showingRef.current = false
                currentAlertRef.current = null
            }
            alertQueueRef.current.push(alertOptions)
            processQueue()
        }
    }, [processQueue, ignorePriority])

    useEffect(() => {
        mountedRef.current = true

        GlobalAlert.show = show
        GlobalAlert.hide = hide
        GlobalAlert.clearAll = clearAll
        GlobalAlert.showMultiple = showMultiple

        return () => {
            mountedRef.current = false
            GlobalAlert.show = (opts: AlertData) =>
                console.error('GlobalAlertProvider unmounted; cannot show alert.', opts)
            GlobalAlert.hide = () => { }
            GlobalAlert.clearAll = () => { }
            GlobalAlert.showMultiple = (_opts: AlertData[]) => { }
            alertQueueRef.current = []
            showingRef.current = false
            currentAlertRef.current = null
        }
    }, [show, hide, clearAll, showMultiple])

    return (
        <>
            <AlertModalWrapper ref={alertRef} UserAlertModal={AlertModal} />
            {children}
        </>
    )
}

export const GlobalAlertContext = React.createContext<GlobalAlertInstance | undefined>(undefined)

export const useGlobalAlert = () => {
    const context = React.useContext(GlobalAlertContext)
    if (context === undefined) {
        throw new Error('useGlobalAlert must be used within a GlobalAlertProvider')
    }
    return context
}

export const createGlobalAlert = (types: Record<string, string> = {}): GlobalAlertInstance => {
    return {
        show: (options: AlertData) => {
            console.error('GlobalAlert.show called before GlobalAlertProvider mounted.', options)
        },
        hide: () => {
            console.error('GlobalAlert.hide called before GlobalAlertProvider mounted.')
        },
        clearAll: () => {
            console.error('GlobalAlert.clearAll called before GlobalAlertProvider mounted.')
        },
        showMultiple: (options: AlertData[]) => {
            console.error('GlobalAlert.showMultiple called before GlobalAlertProvider mounted.', options)
        },
        TYPE: { ...GlobalAlert.TYPE, ...types },
        PRIORITY: GlobalAlert.PRIORITY,
    }
}