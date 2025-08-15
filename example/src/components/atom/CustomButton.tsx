import React from 'react';
import { TouchableOpacity, Text, StyleSheet, type GestureResponderEvent } from 'react-native';

interface CustomButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
  backgroundColor?: string;
  margin?: number;
  padding?: number;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  title,
  backgroundColor = 'green',
  margin = 10,
  padding = 20,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor, margin, padding }]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CustomButton;
