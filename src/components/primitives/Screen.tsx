import {
  ScrollView,
  View,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '@/theme';

interface ScreenProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  backgroundColor?: string;
  scrollable?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function Screen({
  children,
  padding = 'md',
  scrollable = true,
  backgroundColor = colors.background,
  contentContainerStyle,
}: ScreenProps) {
  if (!scrollable) {
    return (
      <View
        style={[
          styles.container,
          styles[padding],
          { backgroundColor },
          contentContainerStyle,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor }]}
      contentContainerStyle={[
        styles.content,
        styles[padding],
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
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
});
