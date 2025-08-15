import React, { createRef, forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react"

export type AlertButton = {
  title?: string
  variant?: string
  onPress?: () => void
  closeOnPress?: boolean
  style?: any
  textStyle?: any
}

export type AlertData = {
  type?: string
  variant?: string
  title?: string
  message?: string
  p?: number
  backdropDismiss?: boolean
  buttons?: AlertButton[]
  onClose?: () => void
  [key: string]: any
}

export type AlertModalProps = {
  visible: boolean
  data: AlertData | null
  onClose?: () => void
}

export type AlertModalRef = {
  show: (options: AlertData) => void
  hide: () => void
}

export type Priority = {
  L: number // Low
  H: number // High
}

export type GlobalAlertInstance = {
  show: (options: AlertData) => void
  hide: () => void
  TYPE: Record<string, string>
  P: Priority
}

export type GlobalAlertProviderProps = {
  children?: React.ReactNode
  AlertModal: React.ComponentType<AlertModalProps>
  types?: Record<string, string>
  globalAlert?: GlobalAlertInstance
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
  TYPE: {
    ERROR: 'ERROR',
    WARNING: 'WARNING',
    SUCCESS: 'SUCCESS',
    INFO: 'INFO',
    NOTICE: 'NOTICE',
    QUESTION: 'QUESTION',
    LOADING: 'LOADING',
    TIP: 'TIP',
  },
  P: {
    L: 0,
    H: 1
  }
}

export const GlobalAlertProvider: React.FC<GlobalAlertProviderProps> = ({
  children,
  AlertModal,
}) => {
  const queueRef = useRef<AlertData[]>([])
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
    processQueue()
  }, [])

  const processQueue = useCallback(() => {
    if (showingRef.current || queueRef.current.length === 0) return

    // LIFO - Last In First Out
    const next = queueRef.current.pop()
    if (!next) return

    showingRef.current = true
    currentAlertRef.current = next

    const originalOnClose = next.onClose
    const safeOnClose = () => {
      try {
        originalOnClose?.()
      } finally {
        hide()
      }
    }

    setTimeout(() => {
      alertRef.current?.show?.({
        ...next,
        onClose: safeOnClose,
      })
    }, 100)
  }, [hide])

  const show = useCallback((options: AlertData) => {
    const alertOptions = { p: 0, ...options }

    queueRef.current = queueRef.current.filter(item => item.p === 1)

    if (showingRef.current && currentAlertRef.current) {
      if (currentAlertRef.current.p === 1) {
        queueRef.current.push(currentAlertRef.current)
      }
      alertRef.current?.hide?.()
      showingRef.current = false
      currentAlertRef.current = null
    }

    showingRef.current = true
    currentAlertRef.current = alertOptions

    const originalOnClose = alertOptions.onClose
    const safeOnClose = () => {
      try {
        originalOnClose?.()
      } finally {
        hide()
      }
    }

    alertRef.current?.show?.({
      ...alertOptions,
      onClose: safeOnClose,
    })
  }, [hide])

  useEffect(() => {
    mountedRef.current = true
    
    GlobalAlert.show = show
    GlobalAlert.hide = hide

    return () => {
      mountedRef.current = false
      GlobalAlert.show = (opts: AlertData) =>
        console.error('GlobalAlertProvider unmounted; cannot show alert.', opts)
      GlobalAlert.hide = () => {}
      queueRef.current = []
      showingRef.current = false
      currentAlertRef.current = null
    }
  }, [show, hide])

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
    TYPE: { ...GlobalAlert.TYPE, ...types },
    P: GlobalAlert.P,
  }
}