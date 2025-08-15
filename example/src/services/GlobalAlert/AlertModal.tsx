import type React from "react"
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import type { AlertModalProps } from "@hexhad/react-native-global-modal"

const TYPES = {
  ERROR: "ERROR",
  WARNING: "WARNING",
  SUCCESS: "SUCCESS",
  INFO: "INFO",
  NOTICE: "NOTICE",
  QUESTION: "QUESTION",
  LOADING: "LOADING",
  TIP: "TIP",
}

const AlertModal: React.FC<AlertModalProps> = ({ visible, data, onClose }) => {
  if (!data || !visible) return null

  return (
    <Modal transparent animationType="none" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Title */}
          {data.title && <Text style={styles.title}>{data.title}</Text>}

          {/* Message */}
          {data.message && <Text style={styles.message}>{data.message}</Text>}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {(data.buttons && data.buttons.length > 0
              ? data.buttons
              : [
                {
                  title: "OK",
                  variant: data.variant || TYPES.INFO,
                  onPress: onClose,
                },
              ]
            ).map((button, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  button.onPress?.()
                  if (button.closeOnPress !== false) {
                    onClose?.()
                  }
                }}
              >
                <Text
                  style={[
                    styles.buttonText,
                    button.variant === TYPES.ERROR && styles.errorButtonText,
                    button.variant === TYPES.WARNING && styles.warningButtonText,
                    button.variant === TYPES.SUCCESS && styles.successButtonText,
                    button.variant === TYPES.INFO && styles.infoButtonText,
                    button.variant === TYPES.NOTICE && styles.noticeButtonText,
                    button.variant === TYPES.QUESTION && styles.questionButtonText,
                    button.variant === TYPES.LOADING && styles.loadingButtonText,
                    button.variant === TYPES.TIP && styles.tipButtonText,
                  ]}
                >
                  {button.title || "OK"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    minWidth: 280,
    maxWidth: "90%",
    alignItems: "center",
  },
  iconWrapper: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  errorButtonText: {
    color: "#DC2626"
  },
  warningButtonText: {
    color: "#EA580C"
  },
  successButtonText: {
    color: "#059669"
  },
  infoButtonText: {
    color: "#2563EB"
  },
  noticeButtonText: {
    color: "#7C3AED"
  },
  questionButtonText: {
    color: "#4338CA"
  },
  loadingButtonText: {
    color: "#6B7280"
  },
  tipButtonText: {
    color: "#0891B2"
  },
})

export default AlertModal
