import { View, StyleSheet } from 'react-native';

interface ContainerProps {
  children: React.ReactNode;
  flex?: number;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  maxWidth?: number;
  align?: 'auto' | 'center' | 'stretch';
}

export function Container({
  children,
  flex,
  padding = 'none',
  maxWidth,
  align = 'stretch',
}: ContainerProps) {
  return (
    <View
      style={[
        styles.base,
        styles[padding],
        flex !== undefined && { flex },
        maxWidth !== undefined && { maxWidth },
        align === 'center' && styles.center,
        align === 'stretch' && styles.stretch,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {},
  none: {
    padding: 0,
  },
  sm: {
    padding: 8,
  },
  md: {
    padding: 16,
  },
  lg: {
    padding: 24,
  },
  center: {
    alignSelf: 'center',
    width: '100%',
  },
  stretch: {
    width: '100%',
  },
});
