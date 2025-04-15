import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const CustomText = ({ style, children, ...props }) => {
  const { colors } = useTheme();

  return (
    <Text
      style={[
        styles.text,
        { color: colors.text },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Montserrat',
    color: '#4F4F4F', // Dark Grey
  },
});

export default CustomText; 