import { View, StyleSheet } from 'react-native';

interface RowProps {
  children: React.ReactNode;
  gap?: 'none' | 'sm' | 'md' | 'lg';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  wrap?: boolean;
}

export function Row({
  children,
  gap = 'none',
  align = 'center',
  justify = 'flex-start',
  padding = 'none',
  wrap = false,
}: RowProps) {
  return (
    <View
      style={[
        styles.base,
        styles[`gap_${gap}` as keyof typeof styles],
        styles[`padding_${padding}` as keyof typeof styles],
        { alignItems: align, justifyContent: justify },
        wrap && styles.wrap,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row' },
  wrap: { flexWrap: 'wrap' },
  gap_none: {
    gap: 0,
  },
  gap_sm: {
    gap: 8,
  },
  gap_md: {
    gap: 12,
  },
  gap_lg: {
    gap: 20,
  },
  padding_none: {
    padding: 0,
  },
  padding_sm: {
    padding: 8,
  },
  padding_md: {
    padding: 16,
  },
  padding_lg: {
    padding: 24,
  },
});
